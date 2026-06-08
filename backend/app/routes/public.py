"""
VERIDACT — Public Routes
Citizen-facing case tracking — no authentication required.
Returns ONLY safe public fields. Never exposes contact details or investigator data.
"""
from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from fastapi import Depends
from datetime import datetime

from app.database import get_db
from app.models.case import Case
from app.models.case_note import CaseNote

router = APIRouter(prefix="/api/public", tags=["Public"])

# Human-friendly status labels for citizens
CITIZEN_STATUS_LABELS: dict[str, str] = {
    "pending": "Received — Awaiting Review",
    "in_review": "Under Active Investigation",
    "analysis_complete": "Analysis Complete",
    "report_generated": "Report Generated",
    "closed": "Case Closed",
    "referred": "Referred to Authority",
}


@router.get("/cases/{case_number}")
async def track_case(
    case_number: str,
    db: Session = Depends(get_db),
):
    """
    Public citizen case tracking endpoint.
    Returns safe public subset only — NO contact_email, contact_phone, assigned_to, or internal notes.
    """
    case = db.query(Case).filter(Case.case_number == case_number.upper()).first()

    if not case:
        raise HTTPException(
            status_code=404,
            detail=f"No case found with number '{case_number}'. Please verify your receipt."
        )

    # Fetch only public notes
    public_notes = (
        db.query(CaseNote)
        .filter(CaseNote.case_id == case.id, CaseNote.is_public == True)  # noqa: E712
        .order_by(CaseNote.created_at.asc())
        .all()
    )

    return {
        "case_number": case.case_number,
        "status": case.status,
        "status_label": CITIZEN_STATUS_LABELS.get(case.status, case.status),
        "complaint_type": case.complaint_type,
        "created_at": case.created_at.isoformat() if case.created_at else None,
        "updated_at": case.updated_at.isoformat() if case.updated_at else None,
        "public_notes": [note.content for note in public_notes],
    }
