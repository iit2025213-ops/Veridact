"""
VERIDACT — Custody Routes
Handles chain-of-custody log retrieval.
"""
from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["Custody"])


@router.get("/cases/{case_id}/custody")
async def get_case_custody(case_id: str):
    return {"message": "not implemented"}


@router.get("/admin/custody")
async def get_all_custody():
    return {"message": "not implemented"}
