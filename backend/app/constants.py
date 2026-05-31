USER_ROLES = ["super_admin", "supervisor", "investigator", "citizen", "api_partner"]
CASE_STATUSES = ["pending", "in_review", "analysis_complete", "report_generated", "closed", "referred"]
COMPLAINT_TYPES = ["deepfake_image", "deepfake_video", "voice_clone", "fake_document", "synthetic_identity", "scam", "other"]
PRIORITY_LEVELS = ["low", "medium", "high", "critical"]
EVIDENCE_TYPES = ["image", "video", "audio", "document", "other"]
VERDICT_VALUES = ["authentic", "suspicious", "likely_fake", "inconclusive"]
ANALYSIS_STATUSES = ["pending", "processing", "completed", "failed"]
CUSTODY_ACTIONS = ["case_created", "evidence_uploaded", "evidence_accessed", "analysis_started", "analysis_completed", "report_generated", "case_updated", "file_downloaded", "case_closed"]
ALLOWED_EXTENSIONS = {
    "image": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"],
    "video": [".mp4", ".avi", ".mov", ".mkv"],
    "audio": [".mp3", ".wav", ".aac", ".ogg", ".flac"],
    "document": [".pdf", ".docx", ".xlsx", ".txt"]
}
MAX_FILE_SIZE_MB = 100
CASE_NUMBER_PREFIX = "VRD"
