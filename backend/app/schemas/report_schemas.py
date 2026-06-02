"""
VERIDACT — Report Schemas
Request validation and response serialization for reports.
"""
from datetime import datetime
from typing import Optional, List, Literal

from pydantic import BaseModel, ConfigDict


class GenerateReportRequest(BaseModel):
    """Request to generate a forensic report."""
    report_type: Literal["forensic", "summary", "court_brief"] = "forensic"


class ReportResponse(BaseModel):
    """Report response."""
    id: str
    case_id: str
    report_type: str
    sha256_hash: str
    generated_by: str
    generated_by_name: Optional[str] = None
    generated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReportListResponse(BaseModel):
    """Report list response."""
    items: List[ReportResponse]
