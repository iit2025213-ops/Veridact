// ============================================================
// VERIDACT — Core Type Definitions
// ============================================================

import type { UserRole, CaseStatus, ComplaintType, PriorityLevel, EvidenceType, VerdictValue, AnalysisStatus } from './constants'

// ── User ────────────────────────────────────────────────────
export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  is_active: boolean
  organization?: string
  created_at: string
  updated_at: string
}

export interface AuthTokens {
  access_token: string
  token_type: 'bearer'
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  full_name: string
  email: string
  password: string
}

// ── Case ────────────────────────────────────────────────────
export interface Case {
  id: string
  case_number: string              // VRD-YYYY-NNNNNN
  title: string
  description: string
  complaint_type: ComplaintType
  status: CaseStatus
  priority: PriorityLevel
  submitted_by?: string           // user_id or null (anonymous citizen)
  assigned_to?: string            // investigator user_id
  assigned_to_name?: string
  contact_email?: string
  contact_phone?: string
  location?: string
  created_at: string
  updated_at: string
  evidence_count?: number
}

export interface CreateCasePayload {
  title: string
  description: string
  complaint_type: ComplaintType
  contact_email?: string
  contact_phone?: string
  location?: string
}

export interface UpdateCasePayload {
  status?: CaseStatus
  priority?: PriorityLevel
  assigned_to?: string
  title?: string
  description?: string
}

// ── Evidence ────────────────────────────────────────────────
export interface Evidence {
  id: string
  case_id: string
  evidence_type: EvidenceType
  original_filename: string
  stored_filename: string
  mime_type: string
  file_size: number
  sha256_hash: string
  uploaded_by?: string
  uploaded_at: string
  analysis_status: AnalysisStatus
  analysis_result?: AnalysisResult
}

// ── Analysis ────────────────────────────────────────────────
export interface AnalysisResult {
  id: string
  evidence_id: string
  verdict: VerdictValue
  confidence_score: number        // 0.0 – 1.0
  explanation: string
  model_used: string
  heatmap_path?: string
  analyzed_at: string
  is_fallback: boolean
}

// ── Custody Log ─────────────────────────────────────────────
export interface CustodyLog {
  id: string
  case_id: string
  evidence_id?: string
  user_id?: string
  user_name?: string
  action: CustodyAction
  details?: string
  ip_address?: string
  created_at: string
}

export type CustodyAction =
  | 'case_created'
  | 'evidence_uploaded'
  | 'evidence_accessed'
  | 'analysis_started'
  | 'analysis_completed'
  | 'report_generated'
  | 'file_downloaded'
  | 'case_updated'
  | 'case_closed'

// ── Report ──────────────────────────────────────────────────
export interface Report {
  id: string
  case_id: string
  case_number: string
  report_type: 'forensic_summary' | 'chain_of_custody' | 'full_report'
  generated_by: string
  generated_by_name?: string
  generated_at: string
  file_path: string
  sha256_hash: string
}

// ── Analytics ───────────────────────────────────────────────
export interface AnalyticsSummary {
  total_cases: number
  total_evidence: number
  total_reports: number
  total_users: number
  cases_by_status: Record<CaseStatus, number>
  cases_by_type: Record<ComplaintType, number>
  verdicts_by_type: Record<VerdictValue, number>
  cases_by_day: Array<{ date: string; count: number }>
  investigator_workload: Array<{ name: string; case_count: number }>
}

// ── API Response wrappers ────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

export interface ApiError {
  detail: string
  status_code?: number
}

// ── Public Case Tracking ─────────────────────────────────────
export interface PublicCaseStatus {
  case_number: string
  status: CaseStatus
  complaint_type: ComplaintType
  submitted_at: string
  last_updated: string
  public_notes: string[]
}
