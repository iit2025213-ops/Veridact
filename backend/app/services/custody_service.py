"""
VERIDACT — Custody Log Service
Provides append-only chain-of-custody logging.
CRITICAL: This service NEVER modifies or deletes existing entries.
"""
import logging
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.custody_log import CustodyLog

logger = logging.getLogger(__name__)


def log_action(
    db: Session,
    case_id: str,
    action: str,
    performed_by_id: Optional[str] = None,
    evidence_id: Optional[str] = None,
    notes: Optional[str] = None,
    ip_address: Optional[str] = None,
) -> Optional[CustodyLog]:
    """
    Creates an append-only custody log entry.
    NEVER modifies existing entries.
    Swallows all exceptions and logs a warning so it never breaks calling code.
    """
    try:
        log_entry = CustodyLog(
            case_id=case_id,
            action=action,
            performed_by=performed_by_id,
            evidence_id=evidence_id,
            notes=notes,
            ip_address=ip_address,
        )
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)
        return log_entry
    except Exception as e:
        logger.warning("Failed to write custody log for case %s action %s: %s", case_id, action, e)
        db.rollback()
        return None


def get_case_custody(db: Session, case_id: str) -> list[CustodyLog]:
    """
    Returns all custody logs for a given case in ascending chronological order.
    """
    return (
        db.query(CustodyLog)
        .filter(CustodyLog.case_id == case_id)
        .order_by(CustodyLog.timestamp.asc())
        .all()
    )


def get_all_custody(
    db: Session,
    filters: dict,
    page: int = 1,
    limit: int = 50,
) -> tuple[list[CustodyLog], int]:
    """
    Returns paginated custody logs across all cases with optional filtering.
    Filters: case_id, action, performed_by.
    """
    query = db.query(CustodyLog)

    if filters.get("case_id"):
        query = query.filter(CustodyLog.case_id == filters["case_id"])
    if filters.get("action"):
        query = query.filter(CustodyLog.action == filters["action"])
    if filters.get("performed_by"):
        query = query.filter(CustodyLog.performed_by == filters["performed_by"])

    total = query.count()
    items = (
        query.order_by(desc(CustodyLog.timestamp))
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
    return items, total
