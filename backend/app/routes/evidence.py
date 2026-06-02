"""
VERIDACT — Evidence Routes
Handles evidence upload, listing, retrieval.
"""
from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["Evidence"])


@router.post("/cases/{case_id}/evidence")
async def upload_evidence(case_id: str):
    return {"message": "not implemented"}


@router.get("/cases/{case_id}/evidence")
async def list_case_evidence(case_id: str):
    return {"message": "not implemented"}


@router.get("/evidence/{evidence_id}")
async def get_evidence(evidence_id: str):
    return {"message": "not implemented"}


@router.delete("/evidence/{evidence_id}")
async def delete_evidence(evidence_id: str):
    return {"message": "not implemented"}
