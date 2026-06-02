"""
VERIDACT — Case Schemas
Request validation and response serialization for cases.
"""
from datetime import datetime
from typing import Optional, List, Literal

from pydantic import BaseModel, ConfigDict, Field

from app.constants import COMPLAINT_TYPES, CASE_STATUSES, PRIORITY_LEVELS


class CreateCaseRequest(BaseModel):
    """Create case request."""
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=10, max_length=5000)
    complaint_type: Literal[
        "deepfake_image", "deepfake_video", "voice_clone",
        "fake_document", "synthetic_identity", "scam", "other"
    ]
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    location: Optional[str] = None


class UpdateCaseRequest(BaseModel):
    """Update case request — all fields optional."""
    status: Optional[Literal[
        "pending", "in_review", "analysis_complete",
        "report_generated", "closed", "referred"
    ]] = None
    priority: Optional[Literal["low", "medium", "high", "critical"]] = None
    assigned_to: Optional[str] = None
    note: Optional[str] = None


class CaseNoteResponse(BaseModel):
    """Case note response."""
    id: str
    case_id: str
    author_id: str
    content: str
    is_public: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CaseResponse(BaseModel):
    """Case response with computed submitter/assignee names."""
    id: str
    case_number: str
    title: str
    description: str
    complaint_type: str
    status: str
    priority: str
    submitted_by: Optional[str] = None
    assigned_to: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    location: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None
    submitter_name: Optional[str] = None
    assignee_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class CaseDetailResponse(CaseResponse):
    """Extended case response with evidence and notes lists."""
    evidence: list = []
    notes: List[CaseNoteResponse] = []

    model_config = ConfigDict(from_attributes=True)


class CaseListResponse(BaseModel):
    """Paginated case list response."""
    items: List[CaseResponse]
    total: int
    page: int
    limit: int
