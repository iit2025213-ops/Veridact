# VERIDACT — AI Forensic Evidence Platform
# Document 05: Backend Schema and Database Design

> **Tagline:** "See Through the Fake. Secure the Truth."
> **Version:** 1.0 — Hackathon MVP
> **Last Updated:** 2025
> **Status:** Active

---

## Table of Contents

1. [Database Overview](#1-database-overview)
2. [Entity Relationship Overview](#2-entity-relationship-overview)
3. [Tables](#3-tables)
4. [Relationships](#4-relationships)
5. [Authentication Schema](#5-authentication-schema)
6. [AI Result Storage](#6-ai-result-storage)
7. [File Storage Schema](#7-file-storage-schema)
8. [API-to-Database Mapping](#8-api-to-database-mapping)
9. [Seed Data](#9-seed-data)
10. [Migration and Future Scaling](#10-migration-and-future-scaling)
11. [No Merge Conflict Strategy](#11-no-merge-conflict-strategy)
12. [Antigravity Megaprompt Sequence](#12-antigravity-megaprompt-sequence)

---

## 1. Database Overview

### Why SQLite for the Hackathon MVP

**SQLite is the correct choice for the VERIDACT hackathon MVP.** Here is the reasoning:

| Factor | SQLite | PostgreSQL |
|---|---|---|
| Setup complexity | Zero — file-based, no server process | Requires installation, user, DB creation |
| Demo failure risk | Very low — single `.db` file | Medium — connection refused errors common during live demos |
| Cost | Zero | Zero (self-hosted) or paid (cloud) |
| Performance for hackathon load | Excellent — single user, <1000 rows | Overkill |
| Localhost compatible | Yes — runs inside the Python process | Requires separate server process |
| Python support | Built-in `sqlite3` module | Requires `psycopg2-binary` |
| SQLAlchemy compatible | Yes — `DATABASE_URL=sqlite:///./veridact.db` | Yes — change URL only |

**SQLite is free.** It is distributed under a public domain license with no cost, no usage limits, and no registration required.

**SQLite is localhost-friendly.** The database is a single file at `backend/veridact.db`. Starting the backend automatically creates it. No database server process, no connection port, no user permissions. On demo day, if the database file is corrupt or missing, running `python seed.py` recreates everything in under 5 seconds.

**SQLite avoids demo failures.** The number one cause of live demo failures is database connection issues. SQLite eliminates this entirely — there is no connection to fail.

**SQLite avoids hackathon merge conflicts.** There are no migration files to conflict over. During the hackathon, we use SQLAlchemy's `create_all()` which creates tables from model definitions at startup. If a model changes, restart the backend — tables are recreated.

### SQLite Configuration

```python
# backend/app/database.py
from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./veridact.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}  # Required for SQLite + FastAPI
)

# Enable WAL mode for better concurrent read performance
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA journal_mode=WAL")
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Migration Path to PostgreSQL

When the hackathon is complete and production deployment is needed, the migration is straightforward:

1. Change `.env`: `DATABASE_URL=postgresql://user:password@host/veridact`
2. Install: `pip install psycopg2-binary`
3. Remove `connect_args={"check_same_thread": False}` from engine config
4. Remove SQLite-specific PRAGMAs
5. Add Alembic for migration management: `pip install alembic`
6. Run: `alembic init alembic && alembic revision --autogenerate && alembic upgrade head`
7. Run seed script against new PostgreSQL database

The SQLAlchemy models are 100% database-agnostic — no SQLite-specific column types or constraints are used.

---

## 2. Entity Relationship Overview

### All Entities

| Entity | Table Name | Purpose |
|---|---|---|
| User | `users` | Authentication and authorization for all platform users |
| Case | `cases` | Core cybercrime complaint record |
| Evidence | `evidence` | Uploaded file metadata linked to a case |
| Analysis Result | `analysis_results` | AI analysis output for each evidence item |
| Custody Log | `custody_logs` | Immutable audit trail of all evidence and case actions |
| Report | `reports` | Generated forensic PDF report metadata |
| Case Note | `case_notes` | Investigator notes attached to cases |

---

### Entity Details

#### users

- **Purpose:** Stores credentials and profile for all platform users across all roles
- **Related Features:** F-01 (Auth), F-03 (Case Management), F-08 (Dashboards)
- **Related API Endpoints:** All `/api/auth/*`, `/api/admin/users`, `/api/cases` (assigned_to)
- **Relationships:** One user → many cases (submitted), many cases (assigned), many evidence uploads, many custody log entries, many notes, many reports

#### cases

- **Purpose:** The central record linking a cybercrime complaint to all its evidence, analysis, reports, notes, and custody events
- **Related Features:** F-02 (Citizen Submission), F-03 (Case Management), F-07 (Reports), F-09 (Citizen Tracking)
- **Related API Endpoints:** All `/api/cases/*`
- **Relationships:** One case → many evidence items, many custody logs, many reports, many notes; belongs to one submitter (user) and one assignee (user)

#### evidence

- **Purpose:** Metadata record for each uploaded file. The actual file lives on disk; this table stores its properties, hash, and analysis status.
- **Related Features:** F-04 (Evidence Upload), F-05 (AI Analysis), F-06 (Chain of Custody)
- **Related API Endpoints:** `/api/cases/{id}/evidence`, `/api/evidence/{id}`
- **Relationships:** Belongs to one case; uploaded by one user; has one analysis_result (1:1 eventually); has many custody_logs

#### analysis_results

- **Purpose:** Stores the complete output of AI analysis for a single evidence item
- **Related Features:** F-05 (AI Analysis), F-07 (Reports)
- **Related API Endpoints:** `/api/evidence/{id}/analyze`, `/api/evidence/{id}/results`
- **Relationships:** Belongs to one evidence item (1:1)

#### custody_logs

- **Purpose:** Append-only audit trail. Every significant action on any case or evidence item creates a log entry. This is the chain-of-custody record.
- **Related Features:** F-06 (Chain of Custody), F-07 (Reports — included in PDF)
- **Related API Endpoints:** `/api/cases/{id}/custody`, `/api/admin/custody`
- **Relationships:** Belongs to one case; optionally references one evidence item; performed by one user

#### reports

- **Purpose:** Metadata for generated forensic PDF reports. The actual PDF is on disk; this record stores its path, hash, and generation metadata.
- **Related Features:** F-07 (Forensic Reports)
- **Related API Endpoints:** `/api/cases/{id}/report`, `/api/reports/{id}`
- **Relationships:** Belongs to one case; generated by one user

#### case_notes

- **Purpose:** Freeform investigator notes attached to a case, with visibility controls for public-facing citizen updates vs. internal investigator notes
- **Related Features:** F-03 (Case Management), F-09 (Citizen Tracking for public_update notes)
- **Related API Endpoints:** `/api/cases/{id}` (included in case detail response)
- **Relationships:** Belongs to one case; authored by one user

---

## 3. Tables

### Table: users

**Description:** Stores all platform users including super admins, supervisors, investigators, citizens, and API partners.

| Field | Type | Required | Default | Unique | Index | Description |
|---|---|---|---|---|---|---|
| `id` | VARCHAR(36) | Yes | `uuid4()` | Yes (PK) | Yes | UUID primary key |
| `email` | VARCHAR(255) | Yes | — | Yes | Yes | Login email |
| `password_hash` | VARCHAR(255) | Yes | — | No | No | bcrypt hash |
| `role` | VARCHAR(20) | Yes | `'citizen'` | No | Yes | One of: super_admin, supervisor, investigator, citizen, api_partner |
| `name` | VARCHAR(100) | Yes | — | No | No | Full display name |
| `organization` | VARCHAR(150) | No | NULL | No | No | Police unit, NGO, etc. |
| `is_active` | BOOLEAN | Yes | `True` | No | No | False = deactivated account |
| `created_at` | DATETIME | Yes | `utcnow()` | No | No | Account creation timestamp |
| `updated_at` | DATETIME | Yes | `utcnow()` | No | No | Last update timestamp |

**Constraints:** `email` must be unique. `role` must be one of the 5 defined values (enforced by Pydantic at API layer, not DB constraint in SQLite).

**Example Record:**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "email": "inv1@veridact.local",
  "password_hash": "$2b$12$...",
  "role": "investigator",
  "name": "Aarav Sharma",
  "organization": "Cyber Bureau, Kathmandu",
  "is_active": true,
  "created_at": "2025-01-15T08:00:00Z",
  "updated_at": "2025-01-15T08:00:00Z"
}
```

**SQLAlchemy Model:**
```python
class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="citizen")
    name = Column(String(100), nullable=False)
    organization = Column(String(150), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    submitted_cases = relationship("Case", back_populates="submitter",
                                   foreign_keys="Case.submitted_by")
    assigned_cases = relationship("Case", back_populates="assignee",
                                  foreign_keys="Case.assigned_to")
    evidence_uploads = relationship("Evidence", back_populates="uploader")
    custody_events = relationship("CustodyLog", back_populates="actor")
    authored_notes = relationship("CaseNote", back_populates="author")
    generated_reports = relationship("Report", back_populates="generator")
```

---

### Table: cases

**Description:** The central case record. Every cybercrime complaint creates one case. All evidence, reports, notes, and custody events link back to a case.

| Field | Type | Required | Default | Unique | Index | Description |
|---|---|---|---|---|---|---|
| `id` | VARCHAR(36) | Yes | `uuid4()` | Yes (PK) | Yes | UUID primary key |
| `case_number` | VARCHAR(20) | Yes | generated | Yes | Yes | Human-readable ID: VRD-YYYY-NNNNNN |
| `title` | VARCHAR(200) | Yes | — | No | No | Brief case title |
| `description` | TEXT | Yes | — | No | No | Full complaint description |
| `complaint_type` | VARCHAR(30) | Yes | — | No | Yes | Enum: deepfake_image, deepfake_video, voice_clone, fake_document, synthetic_identity, scam, other |
| `status` | VARCHAR(25) | Yes | `'pending'` | No | Yes | Enum: pending, in_review, analysis_complete, report_generated, closed, referred |
| `priority` | VARCHAR(10) | Yes | `'medium'` | No | Yes | Enum: low, medium, high, critical |
| `submitted_by` | VARCHAR(36) | No | NULL | No | Yes | FK → users.id (NULL for anonymous citizen submissions) |
| `assigned_to` | VARCHAR(36) | No | NULL | No | Yes | FK → users.id (investigator) |
| `contact_email` | VARCHAR(255) | No | NULL | No | No | Citizen contact email |
| `contact_phone` | VARCHAR(20) | No | NULL | No | No | Citizen contact phone |
| `location` | VARCHAR(200) | No | NULL | No | No | Incident location |
| `created_at` | DATETIME | Yes | `utcnow()` | No | Yes | Case submission timestamp |
| `updated_at` | DATETIME | Yes | `utcnow()` | No | No | Last update timestamp |
| `closed_at` | DATETIME | No | NULL | No | No | When case was closed/referred |

**Case Number Generation Logic:**
```python
def generate_case_number(db: Session) -> str:
    year = datetime.utcnow().year
    # Count cases this year + 1 for new sequence number
    count = db.query(Case).filter(
        Case.case_number.like(f"VRD-{year}-%")
    ).count()
    return f"VRD-{year}-{str(count + 1).zfill(6)}"
# Example: VRD-2025-000001, VRD-2025-000042
```

**Example Record:**
```json
{
  "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "case_number": "VRD-2025-000001",
  "title": "Suspected deepfake video used in defamation",
  "description": "A video circulating on social media appears to show me saying things I never said...",
  "complaint_type": "deepfake_video",
  "status": "in_review",
  "priority": "high",
  "submitted_by": null,
  "assigned_to": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "contact_email": "victim@example.com",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T14:22:00Z",
  "closed_at": null
}
```

---

### Table: evidence

**Description:** Metadata for every uploaded evidence file. The actual file is stored at `uploads/evidence/{stored_filename}`.

| Field | Type | Required | Default | Unique | Index | Description |
|---|---|---|---|---|---|---|
| `id` | VARCHAR(36) | Yes | `uuid4()` | Yes (PK) | Yes | UUID primary key |
| `case_id` | VARCHAR(36) | Yes | — | No | Yes | FK → cases.id |
| `uploaded_by` | VARCHAR(36) | No | NULL | No | Yes | FK → users.id (NULL for citizen uploads) |
| `original_filename` | VARCHAR(255) | Yes | — | No | No | Original name from user's device |
| `stored_filename` | VARCHAR(255) | Yes | — | Yes | No | UUID-based name on disk: `{uuid4}.{ext}` |
| `file_path` | VARCHAR(500) | Yes | — | No | No | Relative path from project root: `uploads/evidence/{stored_filename}` |
| `file_type` | VARCHAR(10) | Yes | — | No | Yes | Enum: image, video, audio, document, other |
| `mime_type` | VARCHAR(100) | Yes | — | No | No | Detected MIME type (e.g., image/jpeg) |
| `file_size` | INTEGER | Yes | — | No | No | File size in bytes |
| `sha256_hash` | VARCHAR(64) | Yes | — | No | Yes | SHA-256 hex digest of file content |
| `upload_status` | VARCHAR(15) | Yes | `'uploaded'` | No | No | Enum: uploaded, processing, analyzed, failed |
| `uploaded_at` | DATETIME | Yes | `utcnow()` | No | Yes | Upload timestamp |

**SHA-256 Hash Computation:**
```python
def compute_sha256(file_path: str) -> str:
    sha256 = hashlib.sha256()
    with open(file_path, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            sha256.update(chunk)
    return sha256.hexdigest()
```

**Example Record:**
```json
{
  "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "case_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "uploaded_by": null,
  "original_filename": "suspicious_video.mp4",
  "stored_filename": "f1e2d3c4-b5a6-7890-abcd-ef0123456789.mp4",
  "file_path": "uploads/evidence/f1e2d3c4-b5a6-7890-abcd-ef0123456789.mp4",
  "file_type": "video",
  "mime_type": "video/mp4",
  "file_size": 15728640,
  "sha256_hash": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
  "upload_status": "analyzed",
  "uploaded_at": "2025-01-15T10:31:00Z"
}
```

---

### Table: analysis_results

**Description:** Stores the complete output of AI analysis for a single evidence item. Each evidence item has at most one analysis result (re-analysis overwrites or creates a new record depending on `force_rerun`).

| Field | Type | Required | Default | Unique | Index | Description |
|---|---|---|---|---|---|---|
| `id` | VARCHAR(36) | Yes | `uuid4()` | Yes (PK) | Yes | UUID primary key |
| `evidence_id` | VARCHAR(36) | Yes | — | No | Yes | FK → evidence.id (one-to-one effectively) |
| `analysis_type` | VARCHAR(20) | Yes | — | No | No | Enum: image, video, audio, document |
| `model_used` | VARCHAR(200) | Yes | — | No | No | Model identifier (e.g., "prithivMLmods/Deepfake-Detect-Siglip2") |
| `model_version` | VARCHAR(50) | No | `'1.0'` | No | No | Model version string |
| `confidence_score` | FLOAT | No | NULL | No | No | Float 0.0–1.0 (NULL until completed) |
| `verdict` | VARCHAR(15) | No | NULL | No | Yes | Enum: authentic, suspicious, likely_fake, inconclusive |
| `explanation` | TEXT | No | NULL | No | No | Human-readable explanation |
| `heatmap_path` | VARCHAR(500) | No | NULL | No | No | Path to heatmap image if generated |
| `raw_output_json` | TEXT | No | NULL | No | No | Full model output as JSON string |
| `processing_status` | VARCHAR(15) | Yes | `'pending'` | No | Yes | Enum: pending, processing, completed, failed |
| `error_message` | TEXT | No | NULL | No | No | Error details if processing_status = failed |
| `analyzed_at` | DATETIME | No | NULL | No | No | Completion timestamp |

**Example Record (completed image analysis):**
```json
{
  "id": "d4e5f6a7-b8c9-0123-defa-234567890123",
  "evidence_id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "analysis_type": "video",
  "model_used": "frame_sampling+prithivMLmods/Deepfake-Detect-Siglip2",
  "model_version": "1.0",
  "confidence_score": 0.83,
  "verdict": "likely_fake",
  "explanation": "8 of 10 sampled video frames show strong AI-generation artifacts (mean confidence: 0.83). Facial inconsistencies detected in frames 2, 4, 5, 7, 8, 9. Analysis performed by frame-sampling deepfake detection pipeline.",
  "heatmap_path": null,
  "raw_output_json": "{\"frames_analyzed\": 10, \"frame_scores\": [0.71, 0.88, 0.79, ...]}",
  "processing_status": "completed",
  "error_message": null,
  "analyzed_at": "2025-01-15T14:15:00Z"
}
```

---

### Table: custody_logs

**Description:** Append-only audit log of every significant action involving a case or evidence item. This is the digital chain-of-custody record. No rows are ever updated or deleted.

| Field | Type | Required | Default | Unique | Index | Description |
|---|---|---|---|---|---|---|
| `id` | VARCHAR(36) | Yes | `uuid4()` | Yes (PK) | Yes | UUID primary key |
| `case_id` | VARCHAR(36) | Yes | — | No | Yes | FK → cases.id |
| `evidence_id` | VARCHAR(36) | No | NULL | No | Yes | FK → evidence.id (NULL for case-level actions) |
| `performed_by` | VARCHAR(36) | No | NULL | No | Yes | FK → users.id (NULL for system/anonymous actions) |
| `action` | VARCHAR(30) | Yes | — | No | Yes | Enum: case_created, evidence_uploaded, evidence_accessed, analysis_started, analysis_completed, report_generated, case_updated, file_downloaded, case_closed |
| `notes` | TEXT | No | NULL | No | No | Optional detail (e.g., "Status changed from pending to in_review", "FALLBACK_USED") |
| `ip_address` | VARCHAR(45) | No | NULL | No | No | Client IP (IPv4 or IPv6) |
| `timestamp` | DATETIME | Yes | `utcnow()` | No | Yes | Event timestamp (server-side, UTC) |

**Critical Constraint:** The application layer (custody_service.py) must never issue UPDATE or DELETE queries on this table. All entries are inserts only.

**Example Records:**
```json
[
  {
    "id": "e5f6a7b8-c9d0-1234-efab-345678901234",
    "case_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "evidence_id": null,
    "performed_by": null,
    "action": "case_created",
    "notes": "Citizen submission via web portal",
    "ip_address": "127.0.0.1",
    "timestamp": "2025-01-15T10:30:00Z"
  },
  {
    "id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
    "case_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "evidence_id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "performed_by": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "action": "analysis_completed",
    "notes": "Verdict: likely_fake, Confidence: 0.83",
    "ip_address": "127.0.0.1",
    "timestamp": "2025-01-15T14:15:30Z"
  }
]
```

---

### Table: reports

**Description:** Metadata record for each generated forensic PDF report. The actual PDF is stored at `uploads/reports/{stored_filename}`.

| Field | Type | Required | Default | Unique | Index | Description |
|---|---|---|---|---|---|---|
| `id` | VARCHAR(36) | Yes | `uuid4()` | Yes (PK) | Yes | UUID primary key |
| `case_id` | VARCHAR(36) | Yes | — | No | Yes | FK → cases.id |
| `generated_by` | VARCHAR(36) | Yes | — | No | Yes | FK → users.id |
| `report_type` | VARCHAR(15) | Yes | `'forensic'` | No | No | Enum: forensic, summary, court_brief |
| `file_path` | VARCHAR(500) | Yes | — | No | No | Path to PDF on disk |
| `sha256_hash` | VARCHAR(64) | Yes | — | No | No | SHA-256 hash of the PDF file itself |
| `generated_at` | DATETIME | Yes | `utcnow()` | No | Yes | Report generation timestamp |

---

### Table: case_notes

**Description:** Investigator and supervisor notes attached to a case, with visibility tiers controlling who can see them.

| Field | Type | Required | Default | Unique | Index | Description |
|---|---|---|---|---|---|---|
| `id` | VARCHAR(36) | Yes | `uuid4()` | Yes (PK) | Yes | UUID primary key |
| `case_id` | VARCHAR(36) | Yes | — | No | Yes | FK → cases.id |
| `author_id` | VARCHAR(36) | Yes | — | No | Yes | FK → users.id |
| `note_text` | TEXT | Yes | — | No | No | Note content |
| `visibility` | VARCHAR(15) | Yes | `'internal'` | No | No | Enum: internal, supervisor, public_update |
| `created_at` | DATETIME | Yes | `utcnow()` | No | Yes | Creation timestamp |

**Visibility Rules:**
- `internal` — visible to investigator (author) + supervisor + super_admin
- `supervisor` — visible to supervisor + super_admin (not the investigator unless they authored it)
- `public_update` — visible to citizen on tracking page + all staff

---

## 4. Relationships

### User → Cases (submitted)

```
users.id (1) ←────── cases.submitted_by (*)
```
One user can submit zero or many cases. Many cases can be submitted by the same user. Cases submitted by anonymous citizens have `submitted_by = NULL`.

### User → Cases (assigned)

```
users.id (1) ←────── cases.assigned_to (*)
```
One investigator can be assigned zero or many cases. A case has at most one assigned investigator at a time. `assigned_to = NULL` means unassigned.

### Case → Evidence

```
cases.id (1) ────────→ evidence.case_id (*)
```
One case can have many evidence items. Each evidence item belongs to exactly one case. Deleting a case should cascade-delete or archive its evidence records.

### Evidence → Analysis Result

```
evidence.id (1) ────────→ analysis_results.evidence_id (1)
```
One evidence item has at most one current analysis result (1:1 eventually). In practice, re-analysis creates a new record; only the latest is surfaced to the user. Query: `ORDER BY analyzed_at DESC LIMIT 1`.

### Case → Custody Logs

```
cases.id (1) ────────→ custody_logs.case_id (*)
```
One case has many custody log entries. Every significant event (case created, evidence uploaded, analysis completed, report generated, status changed) creates a new log entry.

### Evidence → Custody Logs

```
evidence.id (1) ────────→ custody_logs.evidence_id (*)
```
Evidence-specific events (evidence_uploaded, evidence_accessed, analysis_started, analysis_completed, file_downloaded) reference both `case_id` and `evidence_id`. Case-level events (case_created, case_updated, case_closed) only reference `case_id`.

### Case → Reports

```
cases.id (1) ────────→ reports.case_id (*)
```
One case can have many generated reports (forensic, summary, court_brief). Each report is a separate PDF file.

### Case → Notes

```
cases.id (1) ────────→ case_notes.case_id (*)
```
One case can have many notes. Notes are ordered by `created_at ASC` for chronological display.

### Entity Relationship Diagram (Text)

```
┌──────────┐         ┌──────────┐         ┌──────────────────┐
│  users   │────────>│  cases   │────────>│  evidence        │
│          │         │          │         │                  │
│ id (PK)  │         │ id (PK)  │         │ id (PK)          │
│ email    │         │case_num  │         │ case_id (FK)     │
│ role     │         │status    │         │ file_type        │
│ name     │<────────│submitted │         │ sha256_hash      │
│          │         │_by (FK)  │         │ stored_filename  │
│          │<────────│assigned  │         └────────┬─────────┘
└──────────┘         │_to (FK)  │                  │
     │               └────┬─────┘                  │
     │                    │                         │ (1:1)
     │                    │                         ▼
     │               ┌────┴──────┐         ┌──────────────────┐
     │               │  case_    │         │ analysis_results │
     │               │  notes   │         │                  │
     │               │ (FK→case)│         │ id (PK)          │
     │               └──────────┘         │ evidence_id (FK) │
     │                    │               │ confidence_score  │
     │                    │               │ verdict          │
     │               ┌────┴──────┐         └──────────────────┘
     │               │  reports  │
     └──────────────>│          │
                     │ case_id  │
                     │(FK→case) │
                     └──────────┘
                          │
                     ┌────┴──────────┐
                     │ custody_logs  │
                     │               │
                     │ case_id (FK)  │
                     │ evidence_id   │
                     │   (FK, opt)   │
                     │ performed_by  │
                     │   (FK, opt)   │
                     └───────────────┘
```

---

## 5. Authentication Schema

### Password Hashing

```python
# backend/app/utils/security.py
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

bcrypt with default work factor 12 (configurable via `BCRYPT_ROUNDS` env var). Every password stored as a bcrypt hash — no plaintext, no MD5, no SHA1.

### JWT Strategy

```python
# JWT payload structure
{
    "sub": "user-uuid-here",       # user.id
    "role": "investigator",         # user.role
    "email": "inv1@veridact.local", # for display convenience
    "exp": 1736000000,              # expiry: utcnow + 8 hours
    "iat": 1735971200               # issued at
}
```

JWT is signed with HS256 using `JWT_SECRET_KEY` from `.env`. Tokens expire after 8 hours. No refresh tokens in MVP. Role is embedded in the payload to avoid a DB query on every protected request.

### Role Field

The `role` field on the `users` table stores one of these string values:
- `super_admin`
- `supervisor`
- `investigator`
- `citizen`
- `api_partner`

Role is set at registration (`citizen` only for self-registration) or by a super_admin via `PATCH /api/admin/users/{id}`.

### Auth Dependency

```python
# backend/app/utils/security.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        role = payload.get("role")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found or deactivated")
    return user

def require_roles(*allowed_roles: str):
    def dependency(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user
    return dependency
```

### Demo Users (Development Only)

All demo credentials are bcrypt-hashed in the seed script. The plaintext passwords shown below are **development-only** and must never appear in production:

| Role | Email | Password (dev only) |
|---|---|---|
| super_admin | `admin@veridact.local` | `demo1234` |
| supervisor | `supervisor@veridact.local` | `demo1234` |
| investigator | `inv1@veridact.local` | `demo1234` |
| investigator | `inv2@veridact.local` | `demo1234` |
| citizen | `citizen1@veridact.local` | `demo1234` |
| citizen | `citizen2@veridact.local` | `demo1234` |

### Localhost-Safe Auth Flow

1. Backend starts → `create_all()` creates tables if not existing
2. `seed.py` runs → inserts demo users with bcrypt-hashed passwords
3. Frontend sends `POST /api/auth/login` with email + password
4. Backend: `verify_password(plain, hash)` → True
5. Backend: generate JWT with user_id, role, expiry → return token
6. Frontend: store token in `localStorage.setItem('veridact_token', token)`
7. Frontend: `apiClient.ts` Axios interceptor adds `Authorization: Bearer {token}` to every request
8. Backend: `get_current_user()` Depends on every protected route

---

## 6. AI Result Storage

### Input Reference

The analysis result is tied to a specific evidence item via `evidence_id`. Before storing a result, the evidence file must already exist in the `evidence` table with `upload_status = 'uploaded'`.

### Complete Result Storage Flow

```python
# 1. Create pending result immediately on analyze request
result = AnalysisResult(
    id=str(uuid4()),
    evidence_id=evidence_id,
    analysis_type=evidence.file_type,
    model_used="pending",
    processing_status="pending"
)
db.add(result)
db.commit()

# 2. Update to processing
result.processing_status = "processing"
result.model_used = selected_model_name
db.commit()

# 3. Run inference (may take 5-30 seconds)
analysis_data = route_analysis(evidence.file_path, evidence.file_type, evidence_id)

# 4. Store completed result
result.confidence_score = analysis_data.confidence_score
result.verdict = analysis_data.verdict
result.explanation = analysis_data.explanation
result.model_used = analysis_data.model_used
result.model_version = analysis_data.model_version
result.heatmap_path = analysis_data.heatmap_path
result.raw_output_json = json.dumps(analysis_data.raw_output)
result.processing_status = "completed"
result.analyzed_at = datetime.utcnow()
db.commit()

# 5. If exception:
result.processing_status = "failed"
result.error_message = str(exception)
result.verdict = "inconclusive"
result.confidence_score = 0.5
result.explanation = "Analysis failed. Manual review required."
result.model_used = "error_fallback"
db.commit()
```

### Verdict Thresholds

| Confidence Score Range | Verdict | Color |
|---|---|---|
| < 0.40 | `authentic` | Emerald |
| 0.40 – 0.64 | `suspicious` | Orange |
| ≥ 0.65 | `likely_fake` | Red |
| NULL (model failure) | `inconclusive` | Slate |

These thresholds are defined in `backend/app/constants.py` and used consistently by all AI detector modules.

### Explanation Templates

Each AI module generates explanation text from templates to ensure consistent, professional language:

```python
# image_detector.py
EXPLANATION_TEMPLATES = {
    "likely_fake": "High-confidence AI generation artifacts detected (score: {score:.0%}). Facial inconsistencies and synthetic texture patterns identified. Model: {model}. Manual expert review recommended.",
    "suspicious": "Moderate indicators of AI manipulation detected (score: {score:.0%}). Some facial or texture anomalies present. Requires expert verification. Model: {model}.",
    "authentic": "No significant AI generation artifacts detected (score: {score:.0%}). Analysis does not indicate AI manipulation. Model: {model}. Note: AI analysis is probabilistic — human expert review is recommended.",
    "inconclusive": "Analysis could not be completed. Manual expert review is required. Reason: {reason}"
}
```

---

## 7. File Storage Schema

### Directory Structure

```
uploads/
├── evidence/       # Uploaded evidence files
│   └── {uuid4}.{ext}   # e.g., f1e2d3c4-b5a6-7890-abcd-ef0123456789.mp4
├── heatmaps/       # Generated heatmap overlay images
│   └── {evidence_id}_heatmap.png
└── reports/        # Generated forensic PDF reports
    └── {uuid4}.pdf
```

### Evidence File Naming

Stored filenames are always UUID v4 + original extension. The UUID is generated at upload time.

```python
def generate_stored_filename(original_filename: str) -> str:
    ext = Path(original_filename).suffix.lower()  # ".mp4"
    return f"{uuid4()}{ext}"
    # Result: "f1e2d3c4-b5a6-7890-abcd-ef0123456789.mp4"
```

This prevents:
- Directory traversal attacks (no user-controlled path components)
- Filename collisions
- Information leakage from filenames
- Special character issues in filesystem paths

### File Storage Record (in `evidence` table)

| Field | Example Value | Purpose |
|---|---|---|
| `original_filename` | `suspicious_video.mp4` | Display to user; never used to access file |
| `stored_filename` | `f1e2d3c4-b5a6-7890-abcd.mp4` | Used to locate file on disk |
| `file_path` | `uploads/evidence/f1e2d3c4-....mp4` | Relative path from project root |
| `mime_type` | `video/mp4` | Detected by python-magic at upload |
| `file_size` | `15728640` | Bytes |
| `sha256_hash` | `a1b2c3d4...` | 64-char hex digest |
| `uploaded_at` | `2025-01-15T10:31:00Z` | Upload timestamp |
| `uploaded_by` | `user-uuid` or NULL | Who uploaded |
| `upload_status` | `analyzed` | Processing state |

### File Serving (Security)

Files are **never served directly from the URL path** (e.g., `http://localhost:8000/uploads/evidence/...`). They are served through authenticated endpoints:

```python
@router.get("/api/evidence/{evidence_id}/file")
async def download_evidence_file(
    evidence_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    evidence = get_evidence_or_404(evidence_id, db)
    check_case_access(evidence.case_id, current_user, db)
    log_custody(CustodyAction.EVIDENCE_ACCESSED, ...)
    return FileResponse(path=evidence.file_path, filename=evidence.original_filename)
```

```python
@router.get("/api/reports/{report_id}")
async def download_report(
    report_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    report = get_report_or_404(report_id, db)
    check_case_access(report.case_id, current_user, db)
    log_custody(CustodyAction.FILE_DOWNLOADED, ...)
    return FileResponse(path=report.file_path, media_type="application/pdf",
                        filename=f"VERIDACT_Report_{report.id[:8]}.pdf")
```

### Heatmap Storage

Heatmaps are generated and stored during image analysis when Grad-CAM is available. They are PNG overlays of the original image.

```
File path: uploads/heatmaps/{evidence_id}_heatmap.png
DB reference: analysis_results.heatmap_path
```

Heatmaps are served via `/api/evidence/{evidence_id}/heatmap` (authenticated endpoint, same access check as evidence file).

---

## 8. API-to-Database Mapping

### GET /api/health

| | Detail |
|---|---|
| Tables Read | None |
| Tables Written | None |
| Validation | None |
| Error Cases | None (returns 200 always if server is running) |

---

### POST /api/auth/register

| | Detail |
|---|---|
| Tables Read | `users` (check email uniqueness) |
| Tables Written | `users` (INSERT) |
| Validation | Email format, password min 8 chars, name min 2 chars; role must be `citizen` |
| Error Cases | 409 if email exists; 422 if validation fails |

---

### POST /api/auth/login

| | Detail |
|---|---|
| Tables Read | `users` (SELECT WHERE email) |
| Tables Written | None |
| Validation | Email exists; `is_active = True`; bcrypt password match |
| Error Cases | 401 if email not found; 401 if password wrong; 403 if `is_active = False` |

---

### GET /api/auth/me

| | Detail |
|---|---|
| Tables Read | `users` (SELECT WHERE id from JWT) |
| Tables Written | None |
| Error Cases | 401 if JWT invalid; 401 if user not found |

---

### POST /api/cases

| | Detail |
|---|---|
| Tables Read | `cases` (for case_number generation: COUNT WHERE case_number LIKE VRD-YEAR-%) |
| Tables Written | `cases` (INSERT), `custody_logs` (INSERT: case_created) |
| Validation | `complaint_type` must be a valid enum value; `title` required; `description` min 50 chars |
| Error Cases | 422 if validation fails |

---

### GET /api/cases

| | Detail |
|---|---|
| Tables Read | `cases` (SELECT with role-based WHERE: investigator filters by assigned_to=self, supervisor/admin see all), `users` (JOIN for names) |
| Tables Written | None |
| Validation | Query params validated (status, complaint_type must be valid enum values) |
| Error Cases | 401 if not authenticated |

---

### GET /api/cases/{case_id}

| | Detail |
|---|---|
| Tables Read | `cases`, `evidence` (all for case), `analysis_results` (latest per evidence), `case_notes` (visibility-filtered), `custody_logs` (summary), `reports` (list) |
| Tables Written | None (custody log for evidence_accessed is written when evidence is opened, not when case is opened) |
| Validation | case_id must exist; investigator must be assigned to this case |
| Error Cases | 404 if case not found; 403 if investigator accesses unassigned case |

---

### PATCH /api/cases/{case_id}

| | Detail |
|---|---|
| Tables Read | `cases` (current state), `users` (if reassigning: validate target user exists and has investigator role) |
| Tables Written | `cases` (UPDATE), `custody_logs` (INSERT: case_updated) |
| Validation | Status transitions must follow valid state machine; investigator cannot change `assigned_to`; role check for who can change what |
| Error Cases | 403 if unauthorized field change; 404 if case not found; 422 if invalid status value |

---

### DELETE /api/cases/{case_id}

| | Detail |
|---|---|
| Tables Read | `cases` |
| Tables Written | `cases` (UPDATE status=closed), `custody_logs` (INSERT: case_closed) |
| Validation | super_admin role required |
| Error Cases | 403 if not super_admin; 404 if case not found |

---

### POST /api/cases/{case_id}/evidence

| | Detail |
|---|---|
| Tables Read | `cases` (validate case exists) |
| Tables Written | `evidence` (INSERT with sha256_hash, stored_filename, all metadata), `custody_logs` (INSERT: evidence_uploaded) |
| Validation | MIME type validated via python-magic; extension cross-checked; file size ≤ MAX_FILE_SIZE_MB; case must exist |
| Error Cases | 404 if case not found; 413 if file too large; 415 if invalid type; 403 if anonymous upload to case that requires auth |

---

### GET /api/cases/{case_id}/evidence

| | Detail |
|---|---|
| Tables Read | `evidence` (SELECT WHERE case_id), `analysis_results` (latest per evidence_id) |
| Tables Written | None |
| Error Cases | 404 if case not found; 403 if access denied |

---

### GET /api/evidence/{evidence_id}

| | Detail |
|---|---|
| Tables Read | `evidence`, `analysis_results` (latest), `cases` (for access check) |
| Tables Written | `custody_logs` (INSERT: evidence_accessed) |
| Error Cases | 404 if not found; 403 if case not accessible to current user |

---

### DELETE /api/evidence/{evidence_id}

| | Detail |
|---|---|
| Tables Read | `evidence` |
| Tables Written | `evidence` (DELETE), `custody_logs` (INSERT) |
| Validation | super_admin only; also deletes file from disk |
| Error Cases | 403 if not super_admin; 404 if not found |

---

### POST /api/evidence/{evidence_id}/analyze

| | Detail |
|---|---|
| Tables Read | `evidence`, `cases` (access check), `analysis_results` (check if already completed) |
| Tables Written | `analysis_results` (INSERT or UPDATE), `custody_logs` (INSERT: analysis_started), `custody_logs` (INSERT: analysis_completed after), `evidence` (UPDATE upload_status=analyzed) |
| Validation | Evidence must exist and be accessible; file must exist on disk; file_type must be supported |
| Error Cases | 404 if evidence not found; 403 if access denied; 409 if analysis already in progress (processing_status=processing) |

---

### GET /api/evidence/{evidence_id}/results

| | Detail |
|---|---|
| Tables Read | `analysis_results` (SELECT WHERE evidence_id, ORDER BY analyzed_at DESC LIMIT 1) |
| Tables Written | None |
| Error Cases | 404 if no analysis result exists yet; 403 if access denied |

---

### POST /api/cases/{case_id}/report

| | Detail |
|---|---|
| Tables Read | `cases`, `evidence` (all), `analysis_results` (all), `custody_logs` (all for case), `case_notes` (investigator + supervisor visibility), `users` (for names) |
| Tables Written | `reports` (INSERT with sha256_hash, file_path), `custody_logs` (INSERT: report_generated) |
| Validation | investigator, supervisor, or super_admin role; case must exist and be accessible; at least one completed analysis result must exist |
| Error Cases | 404 if case not found; 403 if access denied; 422 if no analysis results exist |

---

### GET /api/reports/{report_id}

| | Detail |
|---|---|
| Tables Read | `reports`, `cases` (access check) |
| Tables Written | `custody_logs` (INSERT: file_downloaded) |
| Response | FileResponse (streams PDF file) |
| Error Cases | 404 if report not found; 403 if access denied; 404 if PDF file missing from disk (return graceful error, not 500) |

---

### GET /api/cases/{case_id}/reports

| | Detail |
|---|---|
| Tables Read | `reports` (SELECT WHERE case_id), `users` (JOIN for generated_by name) |
| Tables Written | None |
| Error Cases | 404 if case not found; 403 if access denied |

---

### GET /api/cases/{case_id}/custody

| | Detail |
|---|---|
| Tables Read | `custody_logs` (SELECT WHERE case_id, ORDER BY timestamp ASC), `users` (JOIN for performed_by name) |
| Tables Written | None |
| Error Cases | 404 if case not found; 403 if access denied |

---

### GET /api/admin/custody

| | Detail |
|---|---|
| Tables Read | `custody_logs` (SELECT ALL with filters), `users`, `cases`, `evidence` (JOINs for context) |
| Tables Written | None |
| Validation | super_admin role required |
| Error Cases | 403 if not super_admin |

---

### GET /api/admin/users

| | Detail |
|---|---|
| Tables Read | `users` (SELECT ALL) |
| Tables Written | None |
| Validation | super_admin role required |
| Error Cases | 403 if not super_admin |

---

### PATCH /api/admin/users/{user_id}

| | Detail |
|---|---|
| Tables Read | `users` (find by id) |
| Tables Written | `users` (UPDATE role, is_active, organization) |
| Validation | super_admin role required; cannot deactivate own account; role must be valid enum |
| Error Cases | 403 if not super_admin; 404 if user not found; 400 if self-deactivation attempt |

---

### GET /api/admin/analytics

| | Detail |
|---|---|
| Tables Read | `cases` (COUNT, GROUP BY status, complaint_type), `analysis_results` (COUNT, GROUP BY verdict), `evidence` (COUNT), `reports` (COUNT), `users` (COUNT) |
| Tables Written | None |
| Validation | supervisor or super_admin role required |
| Aggregations | All aggregations done in SQLAlchemy query with `func.count()`, `func.date()` |

---

### GET /api/public/cases/{case_number} (Public Endpoint)

| | Detail |
|---|---|
| Tables Read | `cases` (SELECT WHERE case_number, limited fields only), `case_notes` (SELECT WHERE case_id AND visibility='public_update') |
| Tables Written | None |
| Auth Required | No |
| Rate Limit | 10/minute per IP via slowapi |
| Fields Returned | `case_number`, `status` (mapped to citizen-friendly label), `created_at`, `updated_at`, `public_notes[]` |
| Fields NEVER Returned | investigator data, evidence file paths, AI analysis details, internal notes, contact info |
| Error Cases | 404 if case_number not found (generic message, no information leakage) |

---

## 9. Seed Data

### Overview

The seed script (`backend/seed.py`) creates a complete, realistic demo dataset. All data is fictional — no real persons, no real cases, no real files.

Run command: `cd backend && python seed.py`

Reset command: `cd backend && python seed.py --reset` (drops and recreates all tables)

### Demo Users

```python
SEED_USERS = [
    {
        "email": "admin@veridact.local",
        "password": "demo1234",  # hashed to bcrypt before insert
        "role": "super_admin",
        "name": "Admin User",
        "organization": "VERIDACT System"
    },
    {
        "email": "supervisor@veridact.local",
        "password": "demo1234",
        "role": "supervisor",
        "name": "Prabha Thapa",
        "organization": "Cyber Bureau, Kathmandu"
    },
    {
        "email": "inv1@veridact.local",
        "password": "demo1234",
        "role": "investigator",
        "name": "Aarav Sharma",
        "organization": "Cyber Bureau, Kathmandu"
    },
    {
        "email": "inv2@veridact.local",
        "password": "demo1234",
        "role": "investigator",
        "name": "Sunita Rai",
        "organization": "Cyber Bureau, Kathmandu"
    },
    {
        "email": "citizen1@veridact.local",
        "password": "demo1234",
        "role": "citizen",
        "name": "Demo Citizen",
        "organization": None
    }
]
```

### Demo Cases

```python
SEED_CASES = [
    {
        "case_number": "VRD-2025-000001",
        "title": "Deepfake Video Used in Online Defamation",
        "description": "A video circulating on social media purports to show me making statements I never made. The video appears altered and my face seems digitally replaced.",
        "complaint_type": "deepfake_video",
        "status": "analysis_complete",
        "priority": "high",
        "assigned_to": "inv1@veridact.local"  # resolved to ID during seed
    },
    {
        "case_number": "VRD-2025-000002",
        "title": "AI-Generated Profile Photo Used for Fraud",
        "description": "An online scammer is using a synthetic AI-generated profile photo to pose as a government official and solicit payments.",
        "complaint_type": "deepfake_image",
        "status": "in_review",
        "priority": "critical",
        "assigned_to": "inv1@veridact.local"
    },
    {
        "case_number": "VRD-2025-000003",
        "title": "Voice Clone Used in Phone Scam",
        "description": "My relative received a phone call from someone using a voice that sounded exactly like me, asking for an emergency money transfer.",
        "complaint_type": "voice_clone",
        "status": "pending",
        "priority": "high",
        "assigned_to": None  # unassigned — for demo of assignment flow
    },
    {
        "case_number": "VRD-2025-000004",
        "title": "Forged Government Document Detected",
        "description": "A document purporting to be an official letter from a ministry was used to deceive a local business. The document appears to have been digitally altered.",
        "complaint_type": "fake_document",
        "status": "report_generated",
        "priority": "medium",
        "assigned_to": "inv2@veridact.local"
    },
    {
        "case_number": "VRD-2025-000005",
        "title": "Synthetic Identity Used for Bank Fraud",
        "description": "A bank account was opened using what appears to be a completely synthetic identity — AI-generated photo, fabricated address, and forged supporting documents.",
        "complaint_type": "synthetic_identity",
        "status": "in_review",
        "priority": "critical",
        "assigned_to": "inv2@veridact.local"
    }
]
```

### Demo Analysis Results

Pre-computed results for demo cases (so judges can see results without triggering actual AI inference):

```python
SEED_ANALYSIS_RESULTS = [
    {
        "evidence_ref": "VRD-2025-000001-evidence-1",
        "analysis_type": "video",
        "model_used": "frame_sampling+prithivMLmods/Deepfake-Detect-Siglip2",
        "confidence_score": 0.87,
        "verdict": "likely_fake",
        "explanation": "8 of 10 analyzed frames show strong AI-generation artifacts. Mean confidence score: 0.87. Facial blending artifacts detected in temporal sequences. This video shows high-confidence indicators of deepfake manipulation.",
        "processing_status": "completed"
    },
    {
        "evidence_ref": "VRD-2025-000002-evidence-1",
        "analysis_type": "image",
        "model_used": "prithivMLmods/Deepfake-Detect-Siglip2",
        "confidence_score": 0.94,
        "verdict": "likely_fake",
        "explanation": "Very high confidence of AI-generated face detected (0.94). GAN-synthesis artifacts present in skin texture, hair generation patterns, and eye reflections. This profile photo shows strong indicators of AI generation.",
        "processing_status": "completed"
    },
    {
        "evidence_ref": "VRD-2025-000004-evidence-1",
        "analysis_type": "document",
        "model_used": "metadata_ocr_ela_pipeline",
        "confidence_score": 0.71,
        "verdict": "likely_fake",
        "explanation": "Document metadata analysis flagged 3 suspicious indicators: (1) Creation date post-dates modification date by 14 days; (2) Author field is blank; (3) Producer field identifies Adobe Acrobat DC used for manipulation. OCR analysis shows text inconsistencies in the signature block.",
        "processing_status": "completed"
    }
]
```

### Demo Custody Logs (Sample)

```python
# Generated automatically during seed based on case actions
# VRD-2025-000001 custody trail:
[
    {"action": "case_created", "notes": "Citizen submission via web portal", "timestamp": "2025-01-10T09:15:00Z"},
    {"action": "evidence_uploaded", "notes": "File: suspicious_video.mp4 (15.0 MB)", "timestamp": "2025-01-10T09:16:00Z"},
    {"action": "case_updated", "notes": "Status: pending → in_review. Assigned to: Aarav Sharma", "timestamp": "2025-01-10T10:00:00Z"},
    {"action": "analysis_started", "notes": "Triggered by: Aarav Sharma", "timestamp": "2025-01-10T14:00:00Z"},
    {"action": "analysis_completed", "notes": "Verdict: likely_fake, Confidence: 0.87", "timestamp": "2025-01-10T14:01:30Z"},
    {"action": "case_updated", "notes": "Status: in_review → analysis_complete", "timestamp": "2025-01-10T14:05:00Z"}
]
```

---

## 10. Migration and Future Scaling

### SQLite → PostgreSQL

**Effort:** Low — approximately 2 hours of configuration changes

**Steps:**
1. Change `DATABASE_URL` in `.env`: `postgresql://veridact:password@localhost/veridact_db`
2. Create PostgreSQL database: `createdb veridact_db`
3. Install psycopg2: `pip install psycopg2-binary`
4. Remove SQLite-specific config (`check_same_thread`, PRAGMA statements)
5. Install Alembic: `pip install alembic`
6. Initialize Alembic: `alembic init alembic`
7. Configure `alembic.ini` and `alembic/env.py` to use `DATABASE_URL`
8. Generate migration: `alembic revision --autogenerate -m "initial schema"`
9. Apply migration: `alembic upgrade head`
10. Run seed script: `python seed.py`

**No SQLAlchemy model changes needed** — all models use database-agnostic types (String, Integer, Float, Boolean, DateTime, Text).

**PostgreSQL advantages over SQLite:**
- True concurrent write support (multiple investigators simultaneously)
- Better performance at scale (>10,000 cases)
- Full-text search via `tsvector`
- JSONB column type for `raw_output_json` (replaces TEXT)
- Better date/time functions
- Row-level locking

---

### Local Files → S3 / Supabase Storage

**Effort:** Medium — approximately 4–6 hours

**Steps:**
1. Install `boto3` (AWS S3) or `supabase-py` (Supabase Storage)
2. Create a new `FileStorageService` abstraction with `save_file()`, `get_file()`, `delete_file()` methods
3. Implement `LocalFileStorage` (current) and `S3FileStorage` (new) as concrete implementations
4. Switch via environment variable: `FILE_STORAGE_BACKEND=local|s3|supabase`
5. Migrate existing local files: upload all files in `uploads/` to the cloud bucket
6. Update `file_path` column to store bucket key instead of local path

**No database schema changes needed** — `file_path` stores relative path locally or bucket key for S3.

---

### Local AI → GPU Microservices

**Effort:** Medium — approximately 1 day

**Steps:**
1. Extract `backend/app/services/ai/` into a separate FastAPI microservice
2. Deploy microservice to GPU-enabled compute (Modal.com, RunPod, or cloud GPU instance)
3. Main backend calls AI microservice via HTTP: `POST http://ai-service/analyze`
4. AI microservice returns same `AnalysisResultData` JSON format
5. Switch via environment variable: `AI_SERVICE_URL=http://localhost:8001` (local) or `https://ai.veridact.io`

---

### Template Reports → LLM-Assisted Reports

**Effort:** Low — approximately 2 hours

**Current:** ReportLab template fills a fixed PDF structure with case data

**Future (Gemini free tier):**
1. Add `GEMINI_API_KEY_OPTIONAL` to `.env`
2. In `report_service.py`, after collecting all case data, call Gemini API:
   ```python
   if settings.GEMINI_API_KEY_OPTIONAL:
       narrative = generate_narrative_with_gemini(case_data, analysis_results)
   else:
       narrative = generate_template_narrative(case_data, analysis_results)
   ```
3. Insert LLM-generated narrative paragraph into PDF as "Investigator Analysis Summary" section
4. Keep all other PDF sections (metadata, hashes, custody log) as template-generated

**Model:** `gemini-1.5-flash` — free tier with generous limits (15 RPM, 1M TPM)

---

## 11. No Merge Conflict Strategy

### Database and Backend Ownership

| Area | Owner | Files |
|---|---|---|
| Database config + engine | Person B | `backend/app/database.py` |
| All SQLAlchemy models | Person B | `backend/app/models/` — all 7 files |
| All Pydantic schemas | Person B | `backend/app/schemas/` — all files |
| Auth routes + service | Person B | `routes/auth.py`, `services/auth_service.py`, `utils/security.py` |
| Case + evidence routes | Person B | `routes/cases.py`, `routes/evidence.py`, `services/case_service.py`, `services/evidence_service.py` |
| Custody service | Person B | `services/custody_service.py`, `routes/custody.py` |
| Admin routes + analytics | Person B | `routes/admin.py` |
| Seed data | Person B → reviewed by Person D | `seed.py`, `seed_data.json` |
| AI pipeline modules | Person C | `services/ai/image_detector.py`, `video_detector.py`, `audio_detector.py`, `document_detector.py`, `router.py` |
| Analysis routes | Person C | `routes/analysis.py` |
| Report generation (PDF) | Person C | `services/report_service.py`, `utils/pdf.py`, `routes/reports.py` |
| SHA-256 + file utilities | Person B/C (coordinate) | `utils/hashing.py`, `utils/file_validation.py` |
| Configuration + constants | Person B | `app/config.py`, `app/constants.py` |
| Main app assembly | Person D | `app/main.py` (only adds new router includes — never removes) |

### Database Schema Change Protocol

Once the SQLAlchemy models are written in Phase 2:
1. New columns may be added as nullable with defaults (non-breaking)
2. No column renames after Phase 3 (auth) is complete
3. No table renames ever
4. New tables can be added without affecting existing tables
5. Any breaking schema change requires: team sync + `python seed.py --reset` + re-test

### AI Output Contract Lock

After Phase 5 starts:
- The `AnalysisResultData` dataclass in `services/ai/router.py` is frozen
- Person A (frontend) builds display components against this contract
- If Person C needs to add a field, it must be optional with a default value

---

## 12. Antigravity Megaprompt Sequence

### Prompt DB-01: Create All SQLAlchemy Models

**Goal:** Implement all 7 SQLAlchemy models matching the schema in this document exactly.

**Files to Create:**
```
backend/app/models/__init__.py
backend/app/models/user.py
backend/app/models/case.py
backend/app/models/evidence.py
backend/app/models/analysis_result.py
backend/app/models/custody_log.py
backend/app/models/report.py
backend/app/models/case_note.py
```

**Files Not to Touch:**
- `backend/app/database.py` (already has Base and engine)
- Any route or schema files
- `seed.py`

**Task:**
1. Implement each model exactly as specified in Section 3 of this document
2. Add all column definitions with correct types, nullable flags, defaults, and index markers
3. Add all SQLAlchemy relationship declarations with correct `back_populates` and `foreign_keys`
4. All models must use the same `Base` from `database.py`
5. Add `__repr__` methods for debugging
6. Import all models in `backend/app/models/__init__.py`
7. Import all models in `backend/app/database.py` before `Base.metadata.create_all(engine)`

**Constraints:**
- Use `String(36)` for all UUID fields — not native UUID type (SQLite compatibility)
- Use `DateTime` (not `TIMESTAMP`) for all datetime fields — SQLite compatibility
- `TEXT` for unbounded text fields
- `Float` for `confidence_score` (not `Decimal`)
- No SQLite-specific column types; all types must be compatible with PostgreSQL for migration

**Acceptance Criteria:**
- `from app.models import User, Case, Evidence, AnalysisResult, CustodyLog, Report, CaseNote` succeeds
- Starting the FastAPI app with `create_all=True` creates all 7 tables in `veridact.db`
- `sqlite3 veridact.db ".tables"` shows all 7 table names
- Foreign keys have correct references (verify with `.schema` in sqlite3)

**Testing:**
```bash
cd backend
python -c "from app.database import engine, Base; from app.models import *; Base.metadata.create_all(engine); print('All tables created successfully')"
sqlite3 veridact.db ".tables"
# Expected: analysis_results  case_notes  cases  custody_logs  evidence  reports  users
```

**Commit Message:** `feat: implement all 7 sqlalchemy models for veridact database schema`

---

### Prompt DB-02: Create All Pydantic Schemas

**Goal:** Create all request and response Pydantic v2 schemas for every API endpoint.

**Files to Create:**
```
backend/app/schemas/__init__.py
backend/app/schemas/auth_schemas.py
backend/app/schemas/case_schemas.py
backend/app/schemas/evidence_schemas.py
backend/app/schemas/analysis_schemas.py
backend/app/schemas/report_schemas.py
backend/app/schemas/custody_schemas.py
backend/app/schemas/admin_schemas.py
```

**Task:**
1. `auth_schemas.py`: `RegisterRequest`, `LoginRequest`, `LoginResponse`, `UserResponse`
2. `case_schemas.py`: `CreateCaseRequest`, `UpdateCaseRequest`, `CaseResponse`, `CaseDetailResponse`, `CaseListResponse`
3. `evidence_schemas.py`: `EvidenceResponse`, `EvidenceUploadResponse`, `EvidenceListResponse`
4. `analysis_schemas.py`: `AnalyzeRequest`, `AnalysisResultResponse`, `AnalysisStatusResponse`
5. `report_schemas.py`: `GenerateReportRequest`, `ReportResponse`, `ReportListResponse`
6. `custody_schemas.py`: `CustodyLogResponse`, `CustodyLogListResponse`
7. `admin_schemas.py`: `UpdateUserRequest`, `UserListResponse`, `AnalyticsResponse`

For every schema:
- Use Pydantic v2 model syntax (`model_config = ConfigDict(from_attributes=True)`)
- All response schemas must be serializable from SQLAlchemy models via `from_attributes=True`
- All request schemas must have field validation (min/max length, valid enum values)
- Never return `password_hash` in any response schema

**Constraints:**
- Do not import any route or service files — schemas are pure data definitions
- All enum values must exactly match constants in `backend/app/constants.py`

**Acceptance Criteria:**
- `from app.schemas import UserResponse, CaseResponse, AnalysisResultResponse` succeeds without error
- `UserResponse.model_validate(user_orm_object)` works correctly for a seeded user
- No password_hash field exposed in UserResponse

**Commit Message:** `feat: implement all pydantic v2 schemas for api request and response validation`

---

### Prompt DB-03: Implement Seed Data Script

**Goal:** Build a complete seed script that creates all demo users, cases, evidence records, analysis results, custody logs, and reports in the SQLite database.

**Files to Create/Modify:**
- `backend/seed.py` (full implementation)
- `backend/seed_data.json` (data specification)

**Files Not to Touch:**
- Any model or schema files
- Any route files

**Task:**
1. `seed.py` must:
   - Accept `--reset` flag to drop and recreate all tables
   - Hash all demo passwords with bcrypt before inserting
   - Create demo users in correct order (admin first)
   - Resolve email references to user IDs when creating cases
   - Create all cases with case_number, complete metadata
   - Create evidence records with fake-but-plausible metadata (the actual files in `demo_assets/` are referenced)
   - Create pre-computed analysis results for demo cases (no AI inference needed)
   - Create realistic custody log chains for each case
   - Create one report record for the completed case (VRD-2025-000004)
   - Create case notes with varied visibility levels
   - Print a success summary at the end
2. Must be idempotent on repeat runs (skip if data already exists)
3. Print login credentials to console at the end for quick reference

**Constraints:**
- Demo passwords must be `demo1234` (bcrypt-hashed before insert)
- No real personal data in any field
- Evidence records must reference real files that will exist in `demo_assets/`
- The pre-generated PDF report must be copied from `demo_assets/sample_report.pdf` if it exists

**Testing:**
```bash
cd backend
python seed.py
# Verify output shows all entities created
python seed.py  # Run again — verify idempotent (no duplicates)
python seed.py --reset  # Verify tables dropped and recreated cleanly
python -c "from app.database import SessionLocal; from app.models import Case; db = SessionLocal(); print(db.query(Case).count(), 'cases')"
# Expected: 5 cases
```

**Commit Message:** `feat: implement database seed script with complete demo data for hackathon`

---

### Prompt DB-04: Implement Custody Service

**Goal:** Build the custody logging service that is called by all other services to create append-only audit log entries.

**Files to Create:**
- `backend/app/services/custody_service.py`

**Files Not to Touch:**
- All model files
- All route files except custody.py

**Task:**
Implement `custody_service.py` with:

```python
def log_action(
    db: Session,
    case_id: str,
    action: str,  # from constants.CUSTODY_ACTIONS
    performed_by_id: Optional[str] = None,
    evidence_id: Optional[str] = None,
    notes: Optional[str] = None,
    ip_address: Optional[str] = None
) -> CustodyLog:
    """Creates a new custody log entry. Never updates existing entries."""

def get_case_custody(db: Session, case_id: str) -> List[CustodyLog]:
    """Returns all custody logs for a case, ordered by timestamp ASC."""

def get_all_custody(
    db: Session,
    filters: CustodyFilters,
    page: int = 1,
    limit: int = 50
) -> Tuple[List[CustodyLog], int]:
    """Returns paginated custody logs with optional filters."""
```

**Constraints:**
- `log_action` must ONLY INSERT — never UPDATE or DELETE
- `action` must be validated against `constants.CUSTODY_ACTIONS` list
- The function must not raise exceptions — if the custody log fails to write, it should log a warning but not crash the calling service
- This service is imported and called by: case_service, evidence_service, analysis routes, report routes

**Acceptance Criteria:**
- `log_action()` creates a new CustodyLog row on every call
- Calling `log_action()` 5 times creates 5 rows
- The `get_case_custody()` returns logs in chronological order
- No existing custody log rows are ever modified

**Commit Message:** `feat: implement append-only custody log service for chain-of-custody tracking`

---

### Prompt DB-05: Implement AI Result Storage Service

**Goal:** Build the analysis result storage and retrieval service that the AI pipeline writes to and the frontend reads from.

**Files to Create/Modify:**
- `backend/app/services/analysis_service.py`

**Task:**
Implement:
```python
def create_pending_result(db: Session, evidence_id: str, analysis_type: str) -> AnalysisResult
def update_result_processing(db: Session, result_id: str, model_used: str) -> AnalysisResult
def complete_result(db: Session, result_id: str, data: AnalysisResultData) -> AnalysisResult
def fail_result(db: Session, result_id: str, error: str) -> AnalysisResult
def get_latest_result(db: Session, evidence_id: str) -> Optional[AnalysisResult]
def get_result_by_id(db: Session, result_id: str) -> Optional[AnalysisResult]
```

**Constraints:**
- All functions must update `evidence.upload_status` alongside the result record
- `complete_result` must set `analyzed_at = datetime.utcnow()`
- `fail_result` must set fallback verdict = "inconclusive", confidence_score = 0.5
- These functions are only called from `routes/analysis.py`

**Commit Message:** `feat: implement analysis result storage service with status lifecycle management`