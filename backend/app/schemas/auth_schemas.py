"""
VERIDACT — Auth Schemas
Request validation and response serialization for authentication.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegisterRequest(BaseModel):
    """Registration request — citizen role only for self-registration."""
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str = Field(..., max_length=100)
    organization: Optional[str] = None


class LoginRequest(BaseModel):
    """Login request."""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """User response — NEVER includes password_hash."""
    id: str
    email: str
    name: str
    role: str
    organization: Optional[str] = None
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LoginResponse(BaseModel):
    """Login response with JWT token and user data."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
