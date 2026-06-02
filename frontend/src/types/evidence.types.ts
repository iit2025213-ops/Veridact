import { EvidenceType } from './constants';
import { AnalysisResult } from './analysis.types';

export interface Evidence {
  id: string; case_id: string; original_filename: string;
  stored_filename: string; file_path: string; file_type: EvidenceType; mime_type: string;
  file_size: number; sha256_hash: string; upload_status: string;
  uploaded_by: string | null; uploaded_at: string;
  analysis_result?: AnalysisResult;
}
