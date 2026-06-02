"""
VERIDACT — Custody Schemas
Response serialization for chain-of-custody logs.
"""
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, ConfigDict


class CustodyLogResponse(BaseModel):
    """Custody log response."""
    id: str
    case_id: str
    evidence_id: Optional[str] = None
    action: str
    performer_name: Optional[str] = None
    notes: Optional[str] = None
    ip_address: Optional[str] = None
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)


class CustodyLogListResponse(BaseModel):
    """Paginated custody log list response."""
    items: List[CustodyLogResponse]
    total: int
