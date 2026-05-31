export const USER_ROLES = ["super_admin", "supervisor", "investigator", "citizen", "api_partner"] as const;
export type UserRole = typeof USER_ROLES[number];
export const CASE_STATUSES = ["pending", "in_review", "analysis_complete", "report_generated", "closed", "referred"] as const;
export type CaseStatus = typeof CASE_STATUSES[number];
export const COMPLAINT_TYPES = ["deepfake_image", "deepfake_video", "voice_clone", "fake_document", "synthetic_identity", "scam", "other"] as const;
export type ComplaintType = typeof COMPLAINT_TYPES[number];
export const PRIORITY_LEVELS = ["low", "medium", "high", "critical"] as const;
export type PriorityLevel = typeof PRIORITY_LEVELS[number];
export const EVIDENCE_TYPES = ["image", "video", "audio", "document", "other"] as const;
export type EvidenceType = typeof EVIDENCE_TYPES[number];
export const VERDICT_VALUES = ["authentic", "suspicious", "likely_fake", "inconclusive"] as const;
export type Verdict = typeof VERDICT_VALUES[number];
export const ANALYSIS_STATUSES = ["pending", "processing", "completed", "failed"] as const;
export type AnalysisStatus = typeof ANALYSIS_STATUSES[number];
export const CUSTODY_ACTIONS = ["case_created", "evidence_uploaded", "evidence_accessed", "analysis_started", "analysis_completed", "report_generated", "case_updated", "file_downloaded", "case_closed"] as const;
export type CustodyAction = typeof CUSTODY_ACTIONS[number];
export const ALLOWED_EXTENSIONS = {
  image: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"],
  video: [".mp4", ".avi", ".mov", ".mkv"],
  audio: [".mp3", ".wav", ".aac", ".ogg", ".flac"],
  document: [".pdf", ".docx", ".xlsx", ".txt"],
};
export const MAX_FILE_SIZE_MB = 100;
export const CASE_NUMBER_PREFIX = "VRD";
