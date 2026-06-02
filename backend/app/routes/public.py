"""
VERIDACT — Public Routes
Handles citizen-facing public case tracking (no auth required).
"""
from fastapi import APIRouter

router = APIRouter(prefix="/api/public", tags=["Public"])


@router.get("/cases/{case_number}")
async def track_case(case_number: str):
    return {"message": "not implemented"}
