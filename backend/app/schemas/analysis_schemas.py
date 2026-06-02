"""
VERIDACT — Analysis Schemas
Request validation and response serialization for analysis.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, computed_field


class AnalyzeRequest(BaseModel):
    """Request to trigger analysis on an evidence item."""
    force_rerun: bool = False


class AnalysisResultResponse(BaseModel):
    """Analysis result response with computed confidence_percent."""
    id: str
    evidence_id: str
    analysis_type: str
    model_used: str
    model_version: Optional[str] = None
    confidence_score: Optional[float] = None
    verdict: Optional[str] = None
    explanation: Optional[str] = None
    heatmap_path: Optional[str] = None
    raw_output_json: Optional[str] = None
    processing_status: str
    error_message: Optional[str] = None
    analyzed_at: Optional[datetime] = None

    @computed_field
    @property
    def confidence_percent(self) -> Optional[int]:
        """Computed confidence as integer percentage (0-100)."""
        if self.confidence_score is not None:
            return int(self.confidence_score * 100)
        return None

    model_config = ConfigDict(from_attributes=True)


class AnalysisStatusResponse(BaseModel):
    """Analysis status response."""
    analysis_id: str
    status: str
    message: str
