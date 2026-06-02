"""
VERIDACT — Evidence Schemas
Request validation and response serialization for evidence.
"""
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, ConfigDict, computed_field


class EvidenceResponse(BaseModel):
    """Evidence response with computed file_size_mb."""
    id: str
    case_id: str
    uploaded_by: Optional[str] = None
    original_filename: str
    stored_filename: str
    file_path: str
    file_type: str
    mime_type: str
    file_size: int
    sha256_hash: str
    upload_status: str
    uploaded_at: datetime

    @computed_field
    @property
    def file_size_mb(self) -> float:
        """Computed file size in megabytes."""
        return round(self.file_size / (1024 * 1024), 2)

    model_config = ConfigDict(from_attributes=True)


class EvidenceUploadResponse(EvidenceResponse):
    """Evidence upload response with message."""
    message: str = "Evidence uploaded successfully"


class EvidenceListResponse(BaseModel):
    """Evidence list response."""
    items: List[EvidenceResponse]
