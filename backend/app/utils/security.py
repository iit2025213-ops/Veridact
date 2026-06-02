"""
VERIDACT — Security Utilities
Handles password hashing, JWT creation and validation, and RBAC dependencies.
"""
from datetime import datetime, timedelta
from typing import Any, Callable, List

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app import config
from app.database import get_db
from app.models.user import User

security_scheme = HTTPBearer()


def create_access_token(data: dict) -> str:
    """Creates HS256 JWT with expiration."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=config.JWT_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, config.JWT_SECRET_KEY, algorithm=config.JWT_ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> dict:
    """Decodes JWT and returns payload. Raises 401 on failure."""
    try:
        payload = jwt.decode(token, config.JWT_SECRET_KEY, algorithms=[config.JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Verifies token, fetches user from DB, and checks if active."""
    token = credentials.credentials
    payload = verify_token(token)
    user_id: str = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Inactive user")
        
    return user


def require_roles(*roles: str) -> Callable:
    """Returns a FastAPI dependency that checks if the current user has required roles."""
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Required roles: {', '.join(roles)}",
            )
        return current_user
    return role_checker
