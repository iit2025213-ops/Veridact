"""
VERIDACT — Case Routes
Handles case CRUD operations.
"""
from fastapi import APIRouter

router = APIRouter(prefix="/api/cases", tags=["Cases"])


@router.post("")
async def create_case():
    return {"message": "not implemented"}


@router.get("")
async def list_cases():
    return {"message": "not implemented"}


@router.get("/{case_id}")
async def get_case(case_id: str):
    return {"message": "not implemented"}


@router.patch("/{case_id}")
async def update_case(case_id: str):
    return {"message": "not implemented"}


@router.delete("/{case_id}")
async def delete_case(case_id: str):
    return {"message": "not implemented"}
