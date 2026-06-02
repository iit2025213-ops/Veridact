"""
VERIDACT — CustodyLog Model
Table: custody_logs
Matches Document 05 Section 3 exactly.
NOTE: This table is append-only — no UPDATE or DELETE operations allowed.
"""
import uuid
from datetime import datetime

from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class CustodyLog(Base):
    __tablename__ = "custody_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(
        String(36), ForeignKey("cases.id"), nullable=False, index=True
    )
    evidence_id = Column(
        String(36), ForeignKey("evidence.id"), nullable=True, index=True
    )
    performed_by = Column(
        String(36), ForeignKey("users.id"), nullable=True, index=True
    )
    action = Column(String(30), nullable=False, index=True)
    notes = Column(Text, nullable=True)
    ip_address = Column(String(45), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    # Relationships
    case = relationship("Case", back_populates="custody_logs")
    evidence = relationship("Evidence", back_populates="custody_logs")
    performer = relationship("User", back_populates="custody_events")

    def __repr__(self):
        return f"<CustodyLog {self.action} @ {self.timestamp}>"
