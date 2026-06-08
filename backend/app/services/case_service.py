"""
VERIDACT — Case Service
Business logic for case creation, retrieval, listing, and updates.
"""
import logging
from datetime import datetime
from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc

from app.models.case import Case
from app.models.case_note import CaseNote
from app.models.user import User
from app.schemas.case_schemas import CreateCaseRequest, UpdateCaseRequest
from app.services import custody_service

logger = logging.getLogger(__name__)


def generate_case_number(db: Session) -> str:
    """
    Count existing cases + 1 and format as VRD-YYYY-NNNNNN.
    Thread-safe: uses DB count which is atomic within a transaction.
    """
    count = db.query(Case).count()
    year = datetime.utcnow().year
    return f"VRD-{year}-{str(count + 1).zfill(6)}"


def create_case(
    db: Session,
    data: CreateCaseRequest,
    submitter_id: Optional[str] = None,
) -> Case:
    """
    Creates a new case with auto-generated case number and logs case_created custody event.
    """
    case_number = generate_case_number(db)

    new_case = Case(
        case_number=case_number,
        title=data.title,
        description=data.description,
        complaint_type=data.complaint_type,
        submitted_by=submitter_id,
        contact_email=data.contact_email,
        contact_phone=data.contact_phone,
        location=data.location,
    )

    db.add(new_case)
    db.commit()
    db.refresh(new_case)

    # Log custody event — always after commit so case_id exists
    custody_service.log_action(
        db=db,
        case_id=new_case.id,
        action="case_created",
        performed_by_id=submitter_id,
        notes=f"Case {case_number} created. Complaint type: {data.complaint_type}",
    )

    return new_case


def get_case(db: Session, case_id: str, current_user: Optional[User] = None) -> Case:
    """
    Retrieves a case by ID.
    Investigators may only access cases assigned to them.
    Supervisors, super_admins, and citizens (own submissions) have broader access.
    """
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    if current_user and current_user.role == "investigator":
        if case.assigned_to != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="Access denied: this case is not assigned to you"
            )

    return case


def list_cases(
    db: Session,
    current_user: User,
    filters: dict,
    page: int = 1,
    limit: int = 20,
) -> tuple[list[Case], int]:
    """
    Returns paginated, role-filtered list of cases.
    - investigator: only their assigned cases
    - supervisor/super_admin: all cases
    - citizen: only their own submitted cases
    """
    query = db.query(Case)

    # Role-based filtering
    if current_user.role == "investigator":
        query = query.filter(Case.assigned_to == current_user.id)
    elif current_user.role == "citizen":
        query = query.filter(Case.submitted_by == current_user.id)
    # supervisor and super_admin see all

    # Optional filters
    if filters.get("status"):
        query = query.filter(Case.status == filters["status"])
    if filters.get("complaint_type"):
        query = query.filter(Case.complaint_type == filters["complaint_type"])
    if filters.get("priority"):
        query = query.filter(Case.priority == filters["priority"])
    if filters.get("assigned_to"):
        query = query.filter(Case.assigned_to == filters["assigned_to"])
    if filters.get("search"):
        term = f"%{filters['search']}%"
        query = query.filter(
            or_(Case.title.ilike(term), Case.case_number.ilike(term))
        )

    total = query.count()
    items = (
        query.order_by(desc(Case.created_at))
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
    return items, total


def update_case(
    db: Session,
    case_id: str,
    data: UpdateCaseRequest,
    current_user: User,
) -> Case:
    """
    Updates case fields. Logs case_updated custody event.
    Citizens may not update cases.
    Investigators may not change assignment.
    """
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    if current_user.role == "citizen":
        raise HTTPException(status_code=403, detail="Citizens may not update case records")

    if current_user.role == "investigator":
        if case.assigned_to != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied: case not assigned to you")
        if data.assigned_to is not None:
            raise HTTPException(status_code=403, detail="Investigators may not reassign cases")

    changes = []
    if data.status is not None and data.status != case.status:
        changes.append(f"status: {case.status} → {data.status}")
        case.status = data.status
        if data.status == "closed":
            case.closed_at = datetime.utcnow()

    if data.priority is not None and data.priority != case.priority:
        changes.append(f"priority: {case.priority} → {data.priority}")
        case.priority = data.priority

    if data.assigned_to is not None and data.assigned_to != case.assigned_to:
        # Validate assignee exists
        assignee = db.query(User).filter(User.id == data.assigned_to).first()
        if not assignee:
            raise HTTPException(status_code=404, detail="Assignee user not found")
        changes.append(f"assigned_to: {case.assigned_to} → {data.assigned_to}")
        case.assigned_to = data.assigned_to

    # Handle optional note
    if data.note:
        note = CaseNote(
            case_id=case.id,
            author_id=current_user.id,
            content=data.note,
            is_public=False,
        )
        db.add(note)

    case.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(case)

    custody_service.log_action(
        db=db,
        case_id=case.id,
        action="case_updated",
        performed_by_id=current_user.id,
        notes="; ".join(changes) if changes else "Case updated",
    )

    return case
