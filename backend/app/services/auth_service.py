"""
VERIDACT — Auth Service
Handles user registration and authentication business logic.
"""
from fastapi import HTTPException, status
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.auth_schemas import RegisterRequest

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    """Hashes a password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against a hash."""
    return pwd_context.verify(plain_password, hashed_password)


def register_user(db: Session, request: RegisterRequest) -> User:
    """Registers a new citizen user. Ensures email is unique."""
    # Check email uniqueness
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists"
        )
    
    # Hash password and create user
    hashed_pwd = get_password_hash(request.password)
    new_user = User(
        email=request.email,
        password_hash=hashed_pwd,
        name=request.name,
        role="citizen",  # Enforced citizen role for self-registration
        organization=request.organization,
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    """Authenticates a user by email and password."""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


def get_user_by_id(db: Session, user_id: str) -> User | None:
    """Fetches a user by their ID."""
    return db.query(User).filter(User.id == user_id).first()
