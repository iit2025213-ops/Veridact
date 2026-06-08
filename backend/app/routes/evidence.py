"""
VERIDACT — Evidence Routes
Handles evidence upload, retrieval, and listing.
"""
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.evidence_schemas import (
    EvidenceResponse,
    EvidenceUploadResponse,
    EvidenceListResponse,
)
from app.services import evidence_service, custody_service
from app.utils.security import get_current_user, get_current_user_optional, require_roles

router = APIRouter(prefix="/api", tags=["Evidence"])


@router.post("/cases/{case_id}/evidence", response_model=EvidenceUploadResponse, status_code=201)
async def upload_evidence(
    case_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    """
    Upload evidence file for a case.
    Validates MIME type and size server-side. Computes SHA-256 during streaming.
    """
    # Verify case exists
    from app.models.case import Case
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    # Save file and compute hash
    save_result = await evidence_service.save_upload_file(file, case_id)

    # Create DB record with custody log
    evidence = evidence_service.create_evidence_record(
        db=db,
        case_id=case_id,
        save_result=save_result,
        uploaded_by_id=current_user.id if current_user else None,
    )

    return EvidenceUploadResponse.model_validate(evidence)


@router.get("/cases/{case_id}/evidence", response_model=EvidenceListResponse)
async def list_case_evidence(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lists all evidence items for a case."""
    from app.models.case import Case
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    items = evidence_service.list_case_evidence(db, case_id)
    return EvidenceListResponse(items=[EvidenceResponse.model_validate(e) for e in items])


@router.get("/evidence/{evidence_id}", response_model=EvidenceResponse)
async def get_evidence(
    evidence_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieves a single evidence record. Logs evidence_accessed custody event."""
    evidence = evidence_service.get_evidence(db, evidence_id, current_user)
    return EvidenceResponse.model_validate(evidence)


@router.delete("/evidence/{evidence_id}", status_code=204)
async def delete_evidence(
    evidence_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("super_admin")),
):
    """Deletes an evidence record and its file. super_admin only."""
    import os
    evidence = db.query(__import__("app.models.evidence", fromlist=["Evidence"]).Evidence).filter_by(id=evidence_id).first()
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")

    # Remove file from disk
    if evidence.file_path and os.path.exists(evidence.file_path):
        try:
            os.remove(evidence.file_path)
        except Exception:
            pass  # Log but don't block deletion

    custody_service.log_action(
        db=db,
        case_id=evidence.case_id,
        action="evidence_uploaded",  # Using closest available action
        performed_by_id=current_user.id,
        evidence_id=evidence_id,
        notes=f"Evidence '{evidence.original_filename}' deleted by super_admin",
    )

    db.delete(evidence)
    db.commit()
