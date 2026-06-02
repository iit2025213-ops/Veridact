"""
VERIDACT — Admin Schemas
Request validation and response serialization for admin operations.
"""
from typing import Optional, List, Dict

from pydantic import BaseModel

from app.schemas.auth_schemas import UserResponse


class UpdateUserRequest(BaseModel):
    """Update user request — all fields optional."""
    role: Optional[str] = None
    is_active: Optional[bool] = None
    organization: Optional[str] = None


class UserListResponse(BaseModel):
    """Paginated user list response."""
    items: List[UserResponse]
    total: int


class AnalyticsResponse(BaseModel):
    """Analytics dashboard response."""
    total_cases: int
    cases_by_status: Dict[str, int]
    cases_by_type: Dict[str, int]
    verdict_distribution: Dict[str, int]
    daily_submissions: List[Dict[str, object]]
    cases_last_7_days: int
    high_risk_cases: int
