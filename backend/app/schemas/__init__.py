"""
VERIDACT — Schemas Package
Re-exports all schemas for convenient importing.
"""
from .auth_schemas import RegisterRequest, LoginRequest, LoginResponse, UserResponse
from .case_schemas import (
    CreateCaseRequest, UpdateCaseRequest, CaseResponse,
    CaseDetailResponse, CaseListResponse, CaseNoteResponse,
)
from .evidence_schemas import EvidenceResponse, EvidenceUploadResponse, EvidenceListResponse
from .analysis_schemas import AnalyzeRequest, AnalysisResultResponse, AnalysisStatusResponse
from .report_schemas import GenerateReportRequest, ReportResponse, ReportListResponse
from .custody_schemas import CustodyLogResponse, CustodyLogListResponse
from .admin_schemas import UpdateUserRequest, UserListResponse, AnalyticsResponse

__all__ = [
    # Auth
    "RegisterRequest", "LoginRequest", "LoginResponse", "UserResponse",
    # Cases
    "CreateCaseRequest", "UpdateCaseRequest", "CaseResponse",
    "CaseDetailResponse", "CaseListResponse", "CaseNoteResponse",
    # Evidence
    "EvidenceResponse", "EvidenceUploadResponse", "EvidenceListResponse",
    # Analysis
    "AnalyzeRequest", "AnalysisResultResponse", "AnalysisStatusResponse",
    # Reports
    "GenerateReportRequest", "ReportResponse", "ReportListResponse",
    # Custody
    "CustodyLogResponse", "CustodyLogListResponse",
    # Admin
    "UpdateUserRequest", "UserListResponse", "AnalyticsResponse",
]
