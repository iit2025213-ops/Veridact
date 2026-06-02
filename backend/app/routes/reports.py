"""
VERIDACT — Reports Routes
Handles report generation and retrieval.
"""
from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["Reports"])


@router.post("/cases/{case_id}/report")
async def generate_report(case_id: str):
    return {"message": "not implemented"}


@router.get("/reports/{report_id}")
async def get_report(report_id: str):
    return {"message": "not implemented"}


@router.get("/cases/{case_id}/reports")
async def list_case_reports(case_id: str):
    return {"message": "not implemented"}
