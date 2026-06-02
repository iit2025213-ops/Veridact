"""
VERIDACT — Analysis Routes
Handles AI analysis trigger and result retrieval.
"""
from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["Analysis"])


@router.post("/evidence/{evidence_id}/analyze")
async def analyze_evidence(evidence_id: str):
    return {"message": "not implemented"}


@router.get("/evidence/{evidence_id}/results")
async def get_analysis_results(evidence_id: str):
    return {"message": "not implemented"}
