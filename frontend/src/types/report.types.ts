export interface Report {
  id: string; case_id: string; report_type: string;
  file_path: string; sha256_hash: string; generated_by: string;
  generated_at: string;
}
