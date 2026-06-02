"""
VERIDACT — Auth Routes
Handles authentication: register, login, me, logout.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.auth_schemas import (
    RegisterRequest,
    LoginRequest,
    LoginResponse,
    UserResponse
)
from app.services import auth_service
from app.utils.security import create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new citizen user."""
    return auth_service.register_user(db, request)


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate a user and return a JWT token."""
    user = auth_service.authenticate_user(db, request.email, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user",
        )
        
    access_token = create_access_token(data={"sub": user.id})
    return LoginResponse(access_token=access_token, user=user)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get the currently authenticated user's profile."""
    return current_user


@router.post("/logout")
async def logout():
    """Logout the user (client handles token deletion)."""
    return {"message": "Logged out successfully"}
