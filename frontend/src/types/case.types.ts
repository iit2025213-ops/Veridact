import { ComplaintType, PriorityLevel, CaseStatus } from './constants';
import { Evidence } from './evidence.types';
import { AnalysisResult } from './analysis.types';

export interface Case {
  id: string; case_number: string; title: string; description: string;
  complaint_type: ComplaintType; priority: PriorityLevel | string; status: CaseStatus | string;
  contact_email?: string | null; contact_phone?: string | null;
  location?: string | null; submitted_by?: string | null;
  assigned_to?: string | null; created_at: string; updated_at: string;
  assigned_to_name?: string | null;
  evidence_count?: number;
}

export interface CaseDetail extends Case {
  evidence: Evidence[]; notes: CaseNote[]; analysis_summary: AnalysisResult[];
}

export interface CaseNote {
  id: string; case_id: string; author_id: string; content: string;
  is_public: boolean; created_at: string;
}

export interface CreateCasePayload {
  title: string;
  description: string;
  complaint_type: ComplaintType;
  contact_email?: string;
  contact_phone?: string;
  location?: string;
}

export interface UpdateCasePayload {
  status?: CaseStatus;
  priority?: PriorityLevel;
  assigned_to?: string;
  title?: string;
  description?: string;
}

export interface PublicCaseStatus {
  case_number: string;
  status: CaseStatus;
  complaint_type: ComplaintType;
  submitted_at: string;
  last_updated: string;
  public_notes: string[];
}
