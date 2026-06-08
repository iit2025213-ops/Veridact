"""
VERIDACT — File Validation Utilities
Validates uploaded file MIME types, extensions, and size limits.
Uses python-magic for server-side MIME detection.
"""
import os
import logging
from fastapi import HTTPException

try:
    import magic
    HAS_MAGIC = True
except ImportError:
    HAS_MAGIC = False
    logging.warning("python-magic not available — falling back to extension-only validation")

from app.constants import ALLOWED_EXTENSIONS, MAX_FILE_SIZE_MB

logger = logging.getLogger(__name__)

# Flat set of all allowed extensions for quick lookup
ALL_ALLOWED_EXTENSIONS = {
    ext
    for exts in ALLOWED_EXTENSIONS.values()
    for ext in exts
}

# MIME → evidence type mapping
MIME_TO_TYPE: dict[str, str] = {
    "image/jpeg": "image",
    "image/png": "image",
    "image/gif": "image",
    "image/bmp": "image",
    "image/webp": "image",
    "video/mp4": "video",
    "video/avi": "video",
    "video/x-msvideo": "video",
    "video/quicktime": "video",
    "video/x-matroska": "video",
    "audio/mpeg": "audio",
    "audio/wav": "audio",
    "audio/x-wav": "audio",
    "audio/aac": "audio",
    "audio/ogg": "audio",
    "audio/flac": "audio",
    "audio/x-flac": "audio",
    "application/pdf": "document",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "document",
    "text/plain": "document",
    "application/msword": "document",
}


def get_file_type(mime_type: str) -> str:
    """Maps a MIME type string to an evidence type: image/video/audio/document/other."""
    return MIME_TO_TYPE.get(mime_type, "other")


def validate_upload(file_content: bytes, original_filename: str) -> tuple[str, str]:
    """
    Validates file size, extension, and MIME type.

    Args:
        file_content: Raw bytes of the uploaded file.
        original_filename: Original filename provided by the client.

    Returns:
        (detected_file_type, mime_type) tuple where file_type is one of
        image/video/audio/document/other.

    Raises:
        HTTPException 413 if file exceeds MAX_FILE_SIZE_MB.
        HTTPException 415 if extension or MIME type is not allowed.
    """
    # 1. Check file size
    size_bytes = len(file_content)
    max_bytes = MAX_FILE_SIZE_MB * 1024 * 1024
    if size_bytes > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum allowed size is {MAX_FILE_SIZE_MB} MB."
        )

    # 2. Validate extension
    _, ext = os.path.splitext(original_filename.lower())
    if ext not in ALL_ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=415,
            detail=(
                f"File extension '{ext}' is not allowed. "
                f"Accepted extensions: {', '.join(sorted(ALL_ALLOWED_EXTENSIONS))}"
            )
        )

    # 3. Detect MIME type via python-magic (server-side truth)
    if HAS_MAGIC:
        try:
            mime_type = magic.from_buffer(file_content, mime=True)
        except Exception as e:
            logger.warning("python-magic failed: %s — falling back to extension", e)
            mime_type = _mime_from_extension(ext)
    else:
        mime_type = _mime_from_extension(ext)

    # 4. Validate that detected MIME type is in our allowed set
    if mime_type not in MIME_TO_TYPE:
        raise HTTPException(
            status_code=415,
            detail=f"Detected content type '{mime_type}' is not allowed."
        )

    detected_file_type = get_file_type(mime_type)
    return detected_file_type, mime_type


def _mime_from_extension(ext: str) -> str:
    """Fallback MIME lookup by extension when python-magic is unavailable."""
    EXT_TO_MIME: dict[str, str] = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".bmp": "image/bmp",
        ".webp": "image/webp",
        ".mp4": "video/mp4",
        ".avi": "video/x-msvideo",
        ".mov": "video/quicktime",
        ".mkv": "video/x-matroska",
        ".mp3": "audio/mpeg",
        ".wav": "audio/wav",
        ".aac": "audio/aac",
        ".ogg": "audio/ogg",
        ".flac": "audio/flac",
        ".pdf": "application/pdf",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".txt": "text/plain",
    }
    return EXT_TO_MIME.get(ext, "application/octet-stream")
