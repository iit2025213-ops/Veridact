"""
VERIDACT — Evidence Model
Table: evidence
Matches Document 05 Section 3 exactly.
"""
import uuid
from datetime import datetime

from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(
        String(36), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False, index=True
    )
    uploaded_by = Column(
        String(36), ForeignKey("users.id"), nullable=True, index=True
    )
    original_filename = Column(String(255), nullable=False)
    stored_filename = Column(String(255), unique=True, nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(10), nullable=False, index=True)
    mime_type = Column(String(100), nullable=False)
    file_size = Column(Integer, nullable=False)
    sha256_hash = Column(String(64), nullable=False, index=True)
    upload_status = Column(String(15), nullable=False, default="uploaded")
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    # Relationships
    case = relationship("Case", back_populates="evidence")
    uploader = relationship("User", back_populates="evidence_uploads")
    analysis_results = relationship(
        "AnalysisResult", back_populates="evidence", cascade="all, delete-orphan"
    )
    custody_logs = relationship("CustodyLog", back_populates="evidence")

    def __repr__(self):
        return f"<Evidence {self.original_filename} ({self.file_type})>"
