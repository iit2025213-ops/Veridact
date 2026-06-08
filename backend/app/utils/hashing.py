"""
VERIDACT — SHA-256 Hashing Utilities
Provides file-based and in-memory SHA-256 computation.
"""
import hashlib


CHUNK_SIZE = 64 * 1024  # 64 KB chunks


def compute_sha256(file_path: str) -> str:
    """
    Read file in 64KB chunks and return lowercase hex SHA-256 digest.
    Memory-efficient for large files.
    """
    sha256 = hashlib.sha256()
    with open(file_path, "rb") as f:
        while True:
            chunk = f.read(CHUNK_SIZE)
            if not chunk:
                break
            sha256.update(chunk)
    return sha256.hexdigest()


def compute_sha256_bytes(data: bytes) -> str:
    """Compute SHA-256 of in-memory bytes and return lowercase hex digest."""
    return hashlib.sha256(data).hexdigest()
