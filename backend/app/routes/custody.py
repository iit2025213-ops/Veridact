"""
VERIDACT — Custody Log Routes
Provides chain-of-custody log access for investigators and admins.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.custody_schemas import CustodyLogResponse, CustodyLogListResponse
from app.services import custody_service
from app.utils.security import get_current_user, require_roles

router = APIRouter(prefix="/api", tags=["Custody"])


def _enrich_log(log) -> dict:
    """Add performer_name to custody log dict."""
    return {
        "id": log.id,
        "case_id": log.case_id,
        "evidence_id": log.evidence_id,
        "action": log.action,
        "performer_name": log.performer.name if log.performer else None,
        "notes": log.notes,
        "ip_address": log.ip_address,
        "timestamp": log.timestamp,
    }


@router.get("/cases/{case_id}/custody", response_model=list[CustodyLogResponse])
async def get_case_custody(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns all custody logs for a specific case in chronological order.
    Accessible to investigators (if assigned), supervisors, and super_admins.
    """
    from app.models.case import Case
    from fastapi import HTTPException

    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    # Investigators may only view logs for their assigned cases
    if current_user.role == "investigator" and case.assigned_to != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied: case not assigned to you")

    logs = custody_service.get_case_custody(db, case_id)
    return [CustodyLogResponse(**_enrich_log(log)) for log in logs]


@router.get("/admin/custody", response_model=CustodyLogListResponse)
async def get_all_custody(
    case_id: str = Query(None),
    action: str = Query(None),
    performed_by: str = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("super_admin")),
):
    """
    Returns paginated custody logs across all cases. super_admin only.
    """
    filters = {
        "case_id": case_id,
        "action": action,
        "performed_by": performed_by,
    }
    logs, total = custody_service.get_all_custody(db, filters, page, limit)
    return CustodyLogListResponse(
        items=[CustodyLogResponse(**_enrich_log(log)) for log in logs],
        total=total,
    )
