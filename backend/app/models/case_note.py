"""
VERIDACT — CaseNote Model
Table: case_notes
Matches Document 05 Section 3 exactly.
"""
import uuid
from datetime import datetime

from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class CaseNote(Base):
    __tablename__ = "case_notes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(
        String(36), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False, index=True
    )
    author_id = Column(
        String(36), ForeignKey("users.id"), nullable=False, index=True
    )
    content = Column(Text, nullable=False)
    is_public = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    # Relationships
    case = relationship("Case", back_populates="notes")
    author = relationship("User", back_populates="authored_notes")

    def __repr__(self):
        return f"<CaseNote by {self.author_id} on case {self.case_id}>"
