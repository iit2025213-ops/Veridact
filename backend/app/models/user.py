"""
VERIDACT — User Model
Table: users
Matches Document 05 Section 3 exactly.
"""
import uuid
from datetime import datetime

from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="citizen", index=True)
    name = Column(String(100), nullable=False)
    organization = Column(String(150), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    submitted_cases = relationship(
        "Case", back_populates="submitter", foreign_keys="Case.submitted_by"
    )
    assigned_cases = relationship(
        "Case", back_populates="assignee", foreign_keys="Case.assigned_to"
    )
    evidence_uploads = relationship("Evidence", back_populates="uploader")
    custody_events = relationship("CustodyLog", back_populates="performer")
    authored_notes = relationship("CaseNote", back_populates="author")
    generated_reports = relationship("Report", back_populates="generator")

    def __repr__(self):
        return f"<User {self.email} ({self.role})>"
