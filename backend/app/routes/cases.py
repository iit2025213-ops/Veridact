"""
VERIDACT — Cases Routes
Full CRUD for cases: create, list, retrieve, update, delete (soft close).
"""
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.case_schemas import (
    CreateCaseRequest,
    UpdateCaseRequest,
    CaseResponse,
    CaseDetailResponse,
    CaseListResponse,
    CaseNoteResponse,
)
from app.services import case_service, custody_service
from app.utils.security import get_current_user, require_roles

router = APIRouter(prefix="/api/cases", tags=["Cases"])


def _enrich_case(case) -> dict:
    """Adds computed submitter_name and assignee_name to a case dict."""
    data = {c.key: getattr(case, c.key) for c in case.__table__.columns}
    data["submitter_name"] = case.submitter.name if case.submitter else None
    data["assignee_name"] = case.assignee.name if case.assignee else None
    return data


@router.post("", response_model=CaseResponse, status_code=201)
async def create_case(
    body: CreateCaseRequest,
    db: Session = Depends(get_db),
    # Submission is allowed without auth (anonymous citizen) — so we try to get user optionally
    current_user: User = Depends(get_current_user),
):
    """
    Creates a new case. Authenticated users are linked as submitter.
    Returns the created case with VRD-YYYY-NNNNNN case number.
    """
    new_case = case_service.create_case(db, body, submitter_id=current_user.id)
    return CaseResponse(**_enrich_case(new_case))


@router.post("/anonymous", response_model=CaseResponse, status_code=201)
async def create_case_anonymous(
    body: CreateCaseRequest,
    db: Session = Depends(get_db),
):
    """
    Creates a case without authentication (for public citizen submissions).
    """
    new_case = case_service.create_case(db, body, submitter_id=None)
    return CaseResponse(**_enrich_case(new_case))


@router.get("", response_model=CaseListResponse)
async def list_cases(
    status: str = Query(None),
    complaint_type: str = Query(None),
    priority: str = Query(None),
    assigned_to: str = Query(None),
    search: str = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Returns paginated, role-filtered case list."""
    filters = {
        "status": status,
        "complaint_type": complaint_type,
        "priority": priority,
        "assigned_to": assigned_to,
        "search": search,
    }
    items, total = case_service.list_cases(db, current_user, filters, page, limit)
    return CaseListResponse(
        items=[CaseResponse(**_enrich_case(c)) for c in items],
        total=total,
        page=page,
        limit=limit,
    )


@router.get("/{case_id}", response_model=CaseDetailResponse)
async def get_case(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Returns full case detail with evidence list and notes."""
    from app.schemas.evidence_schemas import EvidenceResponse

    case = case_service.get_case(db, case_id, current_user)

    # Build response with evidence and public notes
    data = _enrich_case(case)

    # Evidence list
    data["evidence"] = [
        EvidenceResponse.model_validate(e).model_dump()
        for e in case.evidence
    ]

    # Notes — citizens see only public notes; investigators/supervisors/admins see all
    if current_user.role == "citizen":
        notes = [n for n in case.notes if n.is_public]
    else:
        notes = case.notes

    data["notes"] = [
        CaseNoteResponse.model_validate(n).model_dump() for n in notes
    ]

    return CaseDetailResponse(**data)


@router.patch("/{case_id}", response_model=CaseResponse)
async def update_case(
    case_id: str,
    body: UpdateCaseRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Updates case status, priority, or assignment. Enforces role permissions."""
    updated = case_service.update_case(db, case_id, body, current_user)
    return CaseResponse(**_enrich_case(updated))


@router.delete("/{case_id}", status_code=204)
async def delete_case(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("super_admin")),
):
    """Soft-closes a case (sets status to closed). super_admin only."""
    from app.models.case import Case
    from datetime import datetime

    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    case.status = "closed"
    case.closed_at = datetime.utcnow()
    db.commit()

    custody_service.log_action(
        db=db,
        case_id=case_id,
        action="case_closed",
        performed_by_id=current_user.id,
        notes="Case soft-closed by super_admin",
    )
