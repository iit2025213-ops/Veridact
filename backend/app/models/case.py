"""
VERIDACT — Case Model
Table: cases
Matches Document 05 Section 3 exactly.
"""
import uuid
from datetime import datetime

from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Case(Base):
    __tablename__ = "cases"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_number = Column(String(20), unique=True, nullable=False, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    complaint_type = Column(String(30), nullable=False, index=True)
    status = Column(String(25), nullable=False, default="pending", index=True)
    priority = Column(String(10), nullable=False, default="medium", index=True)
    submitted_by = Column(
        String(36), ForeignKey("users.id"), nullable=True, index=True
    )
    assigned_to = Column(
        String(36), ForeignKey("users.id"), nullable=True, index=True
    )
    contact_email = Column(String(255), nullable=True)
    contact_phone = Column(String(20), nullable=True)
    location = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    closed_at = Column(DateTime, nullable=True)

    # Relationships
    submitter = relationship(
        "User", back_populates="submitted_cases", foreign_keys=[submitted_by]
    )
    assignee = relationship(
        "User", back_populates="assigned_cases", foreign_keys=[assigned_to]
    )
    evidence = relationship(
        "Evidence", back_populates="case", cascade="all, delete-orphan"
    )
    custody_logs = relationship("CustodyLog", back_populates="case")
    reports = relationship("Report", back_populates="case")
    notes = relationship(
        "CaseNote", back_populates="case", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Case {self.case_number} ({self.status})>"
