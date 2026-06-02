"""
VERIDACT — Report Model
Table: reports
Matches Document 05 Section 3 exactly.
"""
import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(
        String(36), ForeignKey("cases.id"), nullable=False, index=True
    )
    generated_by = Column(
        String(36), ForeignKey("users.id"), nullable=False, index=True
    )
    report_type = Column(String(15), nullable=False, default="forensic")
    file_path = Column(String(500), nullable=False)
    sha256_hash = Column(String(64), nullable=False)
    generated_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    # Relationships
    case = relationship("Case", back_populates="reports")
    generator = relationship("User", back_populates="generated_reports")

    def __repr__(self):
        return f"<Report {self.report_type} for case {self.case_id}>"
