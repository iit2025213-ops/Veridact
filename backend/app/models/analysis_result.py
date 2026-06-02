"""
VERIDACT — AnalysisResult Model
Table: analysis_results
Matches Document 05 Section 3 exactly.
"""
import uuid
from datetime import datetime

from sqlalchemy import Column, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    evidence_id = Column(
        String(36), ForeignKey("evidence.id", ondelete="CASCADE"), nullable=False, index=True
    )
    analysis_type = Column(String(20), nullable=False)
    model_used = Column(String(200), nullable=False)
    model_version = Column(String(50), nullable=True, default="1.0")
    confidence_score = Column(Float, nullable=True)
    verdict = Column(String(15), nullable=True, index=True)
    explanation = Column(Text, nullable=True)
    heatmap_path = Column(String(500), nullable=True)
    raw_output_json = Column(Text, nullable=True)
    processing_status = Column(String(15), nullable=False, default="pending", index=True)
    error_message = Column(Text, nullable=True)
    analyzed_at = Column(DateTime, nullable=True)

    # Relationships
    evidence = relationship("Evidence", back_populates="analysis_results")

    def __repr__(self):
        return f"<AnalysisResult {self.verdict} ({self.confidence_score})>"
