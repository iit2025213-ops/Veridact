"""
VERIDACT — Admin Routes
Handles admin user management and analytics.
"""
from fastapi import APIRouter

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/users")
async def list_users():
    return {"message": "not implemented"}


@router.patch("/users/{user_id}")
async def update_user(user_id: str):
    return {"message": "not implemented"}


@router.get("/analytics")
async def get_analytics():
    return {"message": "not implemented"}
