"""
VERIDACT — Database Seeder
Drops/creates tables and seeds initial demo users, cases, evidence, and custody logs.
Run with: python seed.py --reset (fresh) or python seed.py (idempotent)
"""
import sys
import uuid
import hashlib
from datetime import datetime, timedelta

from app.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.case import Case
from app.models.evidence import Evidence
from app.models.custody_log import CustodyLog
from app.models.case_note import CaseNote
from app.services.auth_service import get_password_hash


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _sha256(seed_str: str) -> str:
    """Deterministic 64-char hex SHA-256 from a seed string."""
    return hashlib.sha256(seed_str.encode()).hexdigest()


def _past(days: int, hours: int = 0) -> datetime:
    return datetime.utcnow() - timedelta(days=days, hours=hours)


# ─── Main ─────────────────────────────────────────────────────────────────────

def seed_database(reset: bool = False):
    print("=" * 60)
    print("VERIDACT DATABASE SEEDER")
    print("=" * 60)

    if reset:
        print("[*] Reset flag detected. Dropping all tables...")
        Base.metadata.drop_all(bind=engine)
        print("[*] Recreating all tables...")
        Base.metadata.create_all(bind=engine)
    else:
        Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        seed_users(db)
        seed_cases(db)
        print_summary(db)
    finally:
        db.close()


# ─── Users ────────────────────────────────────────────────────────────────────

def seed_users(db):
    if db.query(User).filter(User.email == "admin@veridact.gov.np").first():
        print("[*] Users already seeded — skipping.")
        return

    print("[*] Seeding demo users...")
    hashed_pwd = get_password_hash("demo1234")

    users_to_create = [
        User(id="usr-admin-001",  email="admin@veridact.gov.np",      name="System Administrator",   role="super_admin",  password_hash=hashed_pwd, organization="Veridact Admin"),
        User(id="usr-super-001",  email="supervisor@veridact.gov.np",  name="Priya Sharma",           role="supervisor",   password_hash=hashed_pwd, organization="Nepal Cyber Bureau"),
        User(id="usr-inv-001",    email="inv1@veridact.gov.np",        name="Officer Ram Shrestha",   role="investigator", password_hash=hashed_pwd, organization="Nepal Cyber Bureau"),
        User(id="usr-inv-002",    email="inv2@veridact.gov.np",        name="Officer Sita Rai",       role="investigator", password_hash=hashed_pwd, organization="Nepal Cyber Bureau"),
        User(id="usr-citizen-001",email="citizen1@veridact.gov.np",    name="Arjun Thapa",            role="citizen",      password_hash=hashed_pwd, organization=None),
        User(id="usr-citizen-002",email="citizen2@veridact.gov.np",    name="Nisha Gurung",           role="citizen",      password_hash=hashed_pwd, organization=None),
    ]

    db.add_all(users_to_create)
    db.commit()
    print(f"[*] Created {len(users_to_create)} demo users.")


# ─── Cases + Evidence + Custody ───────────────────────────────────────────────

def seed_cases(db):
    if db.query(Case).count() > 0:
        print("[*] Cases already seeded — skipping.")
        return

    print("[*] Seeding 5 demo cases...")

    INV1 = "usr-inv-001"
    INV2 = "usr-inv-002"
    CIT1 = "usr-citizen-001"
    CIT2 = "usr-citizen-002"

    # ── Case 1 ─────────────────────────────────────────────────────────────────
    c1_id = "case-demo-001"
    c1 = Case(
        id=c1_id,
        case_number="VRD-2025-000001",
        title="Suspected Deepfake Harassment Video",
        description=(
            "A resident of Kathmandu reported receiving a deepfake video that was being "
            "circulated on social media platforms, depicting them in a false and defamatory scenario. "
            "The video appears to be generated using AI face-swap technology."
        ),
        complaint_type="deepfake_video",
        status="in_review",
        priority="critical",
        submitted_by=CIT1,
        assigned_to=INV1,
        contact_email="citizen1@veridact.gov.np",
        contact_phone="+977-9841000001",
        location="Kathmandu, Nepal",
        created_at=_past(12),
        updated_at=_past(10),
    )
    db.add(c1)
    db.commit()

    # Evidence for case 1 (2 items)
    e1a_id = str(uuid.uuid4())
    e1a = Evidence(
        id=e1a_id, case_id=c1_id, uploaded_by=CIT1,
        original_filename="harassment_video.mp4",
        stored_filename=f"{e1a_id}.mp4",
        file_path=f"../uploads/evidence/{e1a_id}.mp4",
        file_type="video", mime_type="video/mp4", file_size=18_432_000,
        sha256_hash=_sha256("demo-evidence-case1-video"),
        upload_status="uploaded", uploaded_at=_past(12, 1),
    )
    e1b_id = str(uuid.uuid4())
    e1b = Evidence(
        id=e1b_id, case_id=c1_id, uploaded_by=INV1,
        original_filename="original_source_screenshot.jpg",
        stored_filename=f"{e1b_id}.jpg",
        file_path=f"../uploads/evidence/{e1b_id}.jpg",
        file_type="image", mime_type="image/jpeg", file_size=1_024_000,
        sha256_hash=_sha256("demo-evidence-case1-screenshot"),
        upload_status="uploaded", uploaded_at=_past(11),
    )
    db.add_all([e1a, e1b])
    db.commit()

    # Notes for case 1 (1 public, 1 internal)
    db.add(CaseNote(
        id=str(uuid.uuid4()), case_id=c1_id, author_id=INV1,
        content="This case has been received and assigned for review. Our team will contact you if additional information is needed.",
        is_public=True, created_at=_past(10),
    ))
    db.add(CaseNote(
        id=str(uuid.uuid4()), case_id=c1_id, author_id=INV1,
        content="Internal: Video metadata shows encoding artifacts consistent with GAN-based generation. Recommend running through deepfake classifier immediately.",
        is_public=False, created_at=_past(10, 2),
    ))
    db.commit()

    # Custody for case 1
    _log(db, c1_id, "case_created",     CIT1,  None,   _past(12),     "Case VRD-2025-000001 created. Complaint type: deepfake_video")
    _log(db, c1_id, "evidence_uploaded", CIT1,  e1a_id, _past(12, 1),  f"File 'harassment_video.mp4' uploaded. SHA-256: {_sha256('demo-evidence-case1-video')}")
    _log(db, c1_id, "evidence_uploaded", INV1,  e1b_id, _past(11),     f"File 'original_source_screenshot.jpg' uploaded. SHA-256: {_sha256('demo-evidence-case1-screenshot')}")
    _log(db, c1_id, "case_updated",      INV1,  None,   _past(10),     "status: pending → in_review; assigned_to: None → usr-inv-001")
    _log(db, c1_id, "analysis_started",  INV1,  e1a_id, _past(9),      "AI analysis initiated for harassment_video.mp4")
    _log(db, c1_id, "analysis_completed",INV1,  e1a_id, _past(8, 6),   "Analysis complete. Verdict: likely_fake. Confidence: 0.91")

    # ── Case 2 ─────────────────────────────────────────────────────────────────
    c2_id = "case-demo-002"
    c2 = Case(
        id=c2_id,
        case_number="VRD-2025-000002",
        title="Fake Identity Document — Citizenship Certificate",
        description=(
            "A bank in Birgunj flagged a suspicious citizenship certificate submitted during "
            "a loan application. The document shows signs of digital tampering in the photo field "
            "and has inconsistent font rendering in the name section."
        ),
        complaint_type="fake_document",
        status="analysis_complete",
        priority="high",
        submitted_by=CIT2,
        assigned_to=INV1,
        contact_email="citizen2@veridact.gov.np",
        contact_phone="+977-9841000002",
        location="Birgunj, Parsa, Nepal",
        created_at=_past(20),
        updated_at=_past(5),
    )
    db.add(c2)
    db.commit()

    e2a_id = str(uuid.uuid4())
    e2a = Evidence(
        id=e2a_id, case_id=c2_id, uploaded_by=CIT2,
        original_filename="citizenship_document_scan.pdf",
        stored_filename=f"{e2a_id}.pdf",
        file_path=f"../uploads/evidence/{e2a_id}.pdf",
        file_type="document", mime_type="application/pdf", file_size=2_097_152,
        sha256_hash=_sha256("demo-evidence-case2-pdf"),
        upload_status="uploaded", uploaded_at=_past(20, 1),
    )
    db.add(e2a)
    db.commit()

    _log(db, c2_id, "case_created",      CIT2,  None,   _past(20),    "Case VRD-2025-000002 created. Complaint type: fake_document")
    _log(db, c2_id, "evidence_uploaded", CIT2,  e2a_id, _past(20, 1), f"File 'citizenship_document_scan.pdf' uploaded. SHA-256: {_sha256('demo-evidence-case2-pdf')}")
    _log(db, c2_id, "case_updated",      INV1,  None,   _past(18),    "status: pending → in_review; assigned_to: None → usr-inv-001")
    _log(db, c2_id, "analysis_started",  INV1,  e2a_id, _past(15),    "AI analysis initiated for citizenship_document_scan.pdf")
    _log(db, c2_id, "analysis_completed",INV1,  e2a_id, _past(14),    "Analysis complete. Verdict: suspicious. Confidence: 0.67")
    _log(db, c2_id, "case_updated",      INV1,  None,   _past(5),     "status: in_review → analysis_complete")

    # ── Case 3 ─────────────────────────────────────────────────────────────────
    c3_id = "case-demo-003"
    c3 = Case(
        id=c3_id,
        case_number="VRD-2025-000003",
        title="Voice Clone Audio Used in Phone Fraud",
        description=(
            "A retired government official in Pokhara reported that an unknown person used "
            "a cloned version of their voice to defraud their family members over a phone call, "
            "claiming to be in a medical emergency and requesting immediate money transfer."
        ),
        complaint_type="voice_clone",
        status="pending",
        priority="medium",
        submitted_by=None,
        assigned_to=None,
        contact_email=None,
        contact_phone="+977-9856000003",
        location="Pokhara, Kaski, Nepal",
        created_at=_past(3),
        updated_at=_past(3),
    )
    db.add(c3)
    db.commit()

    e3a_id = str(uuid.uuid4())
    e3a = Evidence(
        id=e3a_id, case_id=c3_id, uploaded_by=None,
        original_filename="fraud_call_recording.mp3",
        stored_filename=f"{e3a_id}.mp3",
        file_path=f"../uploads/evidence/{e3a_id}.mp3",
        file_type="audio", mime_type="audio/mpeg", file_size=3_145_728,
        sha256_hash=_sha256("demo-evidence-case3-audio"),
        upload_status="uploaded", uploaded_at=_past(3, 1),
    )
    db.add(e3a)
    db.commit()

    _log(db, c3_id, "case_created",     None,  None,   _past(3),     "Case VRD-2025-000003 created. Complaint type: voice_clone")
    _log(db, c3_id, "evidence_uploaded",None,  e3a_id, _past(3, 1),  f"File 'fraud_call_recording.mp3' uploaded. SHA-256: {_sha256('demo-evidence-case3-audio')}")

    # ── Case 4 ─────────────────────────────────────────────────────────────────
    c4_id = "case-demo-004"
    c4 = Case(
        id=c4_id,
        case_number="VRD-2025-000004",
        title="AI-Generated Profile Photo Used in Dating Scam",
        description=(
            "A victim in Lalitpur was defrauded by an individual using a clearly AI-generated "
            "profile photograph on a social media platform. The profile was used to establish "
            "a romantic relationship and subsequently extort money."
        ),
        complaint_type="deepfake_image",
        status="report_generated",
        priority="low",
        submitted_by=CIT1,
        assigned_to=INV2,
        contact_email="citizen1@veridact.gov.np",
        contact_phone="+977-9841000001",
        location="Lalitpur, Nepal",
        created_at=_past(30),
        updated_at=_past(2),
    )
    db.add(c4)
    db.commit()

    e4a_id = str(uuid.uuid4())
    e4a = Evidence(
        id=e4a_id, case_id=c4_id, uploaded_by=CIT1,
        original_filename="suspect_profile_photo.jpg",
        stored_filename=f"{e4a_id}.jpg",
        file_path=f"../uploads/evidence/{e4a_id}.jpg",
        file_type="image", mime_type="image/jpeg", file_size=512_000,
        sha256_hash=_sha256("demo-evidence-case4-image"),
        upload_status="uploaded", uploaded_at=_past(30, 1),
    )
    e4b_id = str(uuid.uuid4())
    e4b = Evidence(
        id=e4b_id, case_id=c4_id, uploaded_by=INV2,
        original_filename="conversation_screenshots.png",
        stored_filename=f"{e4b_id}.png",
        file_path=f"../uploads/evidence/{e4b_id}.png",
        file_type="image", mime_type="image/png", file_size=768_000,
        sha256_hash=_sha256("demo-evidence-case4-screenshots"),
        upload_status="uploaded", uploaded_at=_past(28),
    )
    db.add_all([e4a, e4b])
    db.commit()

    _log(db, c4_id, "case_created",      CIT1,  None,   _past(30),    "Case VRD-2025-000004 created. Complaint type: deepfake_image")
    _log(db, c4_id, "evidence_uploaded", CIT1,  e4a_id, _past(30, 1), f"File 'suspect_profile_photo.jpg' uploaded. SHA-256: {_sha256('demo-evidence-case4-image')}")
    _log(db, c4_id, "evidence_uploaded", INV2,  e4b_id, _past(28),    f"File 'conversation_screenshots.png' uploaded. SHA-256: {_sha256('demo-evidence-case4-screenshots')}")
    _log(db, c4_id, "analysis_started",  INV2,  e4a_id, _past(25),    "AI analysis initiated for suspect_profile_photo.jpg")
    _log(db, c4_id, "analysis_completed",INV2,  e4a_id, _past(24),    "Analysis complete. Verdict: likely_fake. Confidence: 0.87")
    _log(db, c4_id, "report_generated",  INV2,  None,   _past(2),     "Forensic report generated and archived.")

    # ── Case 5 ─────────────────────────────────────────────────────────────────
    c5_id = "case-demo-005"
    c5 = Case(
        id=c5_id,
        case_number="VRD-2025-000005",
        title="Synthetic Identity Used in Loan Application",
        description=(
            "A microfinance institution in Dharan flagged a loan application containing "
            "entirely fabricated personal details — including a face, address, and employment "
            "history — believed to be generated by an AI-powered identity synthesis tool."
        ),
        complaint_type="synthetic_identity",
        status="pending",
        priority="high",
        submitted_by=None,
        assigned_to=None,
        contact_email=None,
        contact_phone="+977-9825000005",
        location="Dharan, Sunsari, Nepal",
        created_at=_past(1),
        updated_at=_past(1),
    )
    db.add(c5)
    db.commit()

    e5a_id = str(uuid.uuid4())
    e5a = Evidence(
        id=e5a_id, case_id=c5_id, uploaded_by=None,
        original_filename="loan_application_form.pdf",
        stored_filename=f"{e5a_id}.pdf",
        file_path=f"../uploads/evidence/{e5a_id}.pdf",
        file_type="document", mime_type="application/pdf", file_size=1_048_576,
        sha256_hash=_sha256("demo-evidence-case5-pdf"),
        upload_status="uploaded", uploaded_at=_past(1, 2),
    )
    db.add(e5a)
    db.commit()

    _log(db, c5_id, "case_created",     None, None,   _past(1),    "Case VRD-2025-000005 created. Complaint type: synthetic_identity")
    _log(db, c5_id, "evidence_uploaded",None, e5a_id, _past(1, 2), f"File 'loan_application_form.pdf' uploaded. SHA-256: {_sha256('demo-evidence-case5-pdf')}")

    print("[*] Successfully seeded 5 cases, 8 evidence records, 2 case notes.")


def _log(db, case_id, action, performed_by_id, evidence_id, ts, notes):
    """Helper to insert a custody log with a specific timestamp."""
    entry = CustodyLog(
        id=str(uuid.uuid4()),
        case_id=case_id,
        action=action,
        performed_by=performed_by_id,
        evidence_id=evidence_id,
        notes=notes,
        timestamp=ts,
    )
    db.add(entry)
    db.commit()


# ─── Summary ──────────────────────────────────────────────────────────────────

def print_summary(db):
    print()
    print("-" * 60)
    print("DEMO CREDENTIALS (Password for all: demo1234)")
    print("-" * 60)
    print(f"{'Role':<15} | {'Email':<30} | Name")
    print("-" * 60)
    for u in db.query(User).order_by(User.role.desc()).all():
        print(f"{u.role:<15} | {u.email:<30} | {u.name}")
    print("-" * 60)
    print()
    print(f"Cases:      {db.query(Case).count()}")
    print(f"Evidence:   {db.query(Evidence).count()}")
    print(f"Custody:    {db.query(CustodyLog).count()}")
    print(f"Notes:      {db.query(CaseNote).count()}")
    print("-" * 60)
    print("Seed complete.")


# ─── Entry Point ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    reset = "--reset" in sys.argv
    seed_database(reset=reset)
