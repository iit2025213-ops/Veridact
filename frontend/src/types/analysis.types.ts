import { AnalysisStatus, Verdict, CaseStatus, ComplaintType } from './constants';

export interface AnalysisResult {
  id: string; evidence_id: string; analysis_type: string;
  processing_status: AnalysisStatus;
  confidence_score: number | null; verdict: Verdict | null;
  explanation: string | null; model_used: string | null;
  model_version: string | null; heatmap_path: string | null;
  raw_output_json: string | null; error_message: string | null;
  analyzed_at: string | null;
}

export interface AnalyticsSummary {
  total_cases: number;
  total_evidence: number;
  total_reports: number;
  total_users: number;
  cases_by_status: Record<CaseStatus, number>;
  cases_by_type: Record<ComplaintType, number>;
  verdicts_by_type: Record<Verdict, number>;
  cases_by_day: Array<{ date: string; count: number }>;
  investigator_workload: Array<{ name: string; case_count: number }>;
}
