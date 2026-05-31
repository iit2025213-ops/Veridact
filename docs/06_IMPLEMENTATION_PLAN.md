# VERIDACT — AI Forensic Evidence Platform
# Document 06: Implementation Plan

> **Tagline:** "See Through the Fake. Secure the Truth."
> **Version:** 1.0 — Hackathon MVP
> **Last Updated:** 2025
> **Status:** Active

---

## Table of Contents

1. [Implementation Strategy](#1-implementation-strategy)
2. [Development Phases](#2-development-phases)
3. [Task Breakdown](#3-task-breakdown)
4. [Git Strategy](#4-git-strategy)
5. [Local Setup Instructions](#5-local-setup-instructions)
6. [Environment Variables](#6-environment-variables)
7. [Testing Plan](#7-testing-plan)
8. [48-Hour Hackathon Build Plan](#8-48-hour-hackathon-build-plan)
9. [Hackathon Demo Script](#9-hackathon-demo-script)
10. [Risk-Based Backup Plan](#10-risk-based-backup-plan)
11. [No Merge Conflict Strategy](#11-no-merge-conflict-strategy)
12. [Final Checklist](#12-final-checklist)
13. [Cross-Document Consistency Check](#13-cross-document-consistency-check)
14. [Free Cost Verification](#14-free-cost-verification)
15. [Final MVP Recommendation](#15-final-mvp-recommendation)
16. [Master Antigravity Megaprompt Sequence](#16-master-antigravity-megaprompt-sequence)

---

## 1. Implementation Strategy

### Core Philosophy

VERIDACT is built **localhost-first, free-cost-first, MVP-first**. The implementation order is deliberately chosen to prevent the two most common hackathon failure modes: merge conflicts between teammates and a non-functional demo on presentation day.

The strategy can be summarized as:

**Foundation before features. Schema before services. Backend before frontend integration. AI last, with fallback always ready.**

### Why This Order Works

**Phase 0 (Repository and Docs)** ensures every team member starts from the same folder structure, `.gitignore`, and constants file. This prevents the most common merge conflict cause: everyone creating their own folder hierarchy.

**Phase 1 (Frontend Skeleton)** creates all 15 pages as empty placeholders and wires routing before a single API is built. This means Person A can build UI in isolation for 8+ hours without waiting for Person B to finish the backend. No API calls are made in Phase 1 — just static shells.

**Phase 2 (Backend and Database)** creates all 7 SQLAlchemy models and all Pydantic schemas before implementing any route logic. Defining shapes first prevents the most common integration bug: mismatched field names between frontend and backend. The schema freeze after Phase 2 means no silent table renames that break everyone else's work.

**Phase 3 (Auth and RBAC)** is implemented before any case or evidence logic. This prevents the anti-pattern of building features that have to be retrofitted with auth later — a process that always introduces bugs.

**Phase 4 (Case and Evidence Core)** builds the core data flow — submission wizard, file upload, SHA-256 hashing, custody logging — which is the backbone every other feature depends on. This phase is the highest-risk from a data-integrity perspective and must be solid before the AI layer is added.

**Phase 5 (AI Analysis)** is built on top of a working evidence upload flow. The AI layer reads from files already stored on disk and writes results back to the database. It is designed to be swap-safe: the `AnalysisResultData` dataclass is the only interface between AI inference and the rest of the system. If any model fails, the fallback engages and the rest of the system is unaffected.

**Phase 6 (Dashboards and Reports)** is placed after AI because the dashboard is most compelling with real AI results to display. PDF report generation reads from the database and is entirely separate from the AI pipeline.

**Phase 7 (Polish and Demo Readiness)** is the final phase where seed data, loading states, error states, and the demo script are finalized. This phase is explicitly time-boxed to the last 8 hours of the hackathon.

### Merge-Conflict Prevention by Design

The build order follows a strict dependency chain: database models → schemas → backend services → backend routes → frontend services → frontend pages. At no point are two team members expected to edit the same file simultaneously. File ownership is defined in Section 11 and must be respected.

### Demo-Focused Build

Every phase decision prioritizes "will this be demonstrable on day two?" over theoretical completeness. Demo seed data is seeded as early as Phase 3 so that even with incomplete feature implementation, the demo database always contains realistic test data that produces meaningful UI output.

---

## 2. Development Phases

### Phase 0: Repository and Documentation Setup

**Goal:** Create the complete project structure before writing a single line of application code. Every subsequent phase depends on this structure being stable.

**Deliverables:**

- `veridact/` root folder
- `README.md` with project overview, tech stack, quickstart, and role list
- `.gitignore` excluding `__pycache__/`, `*.pyc`, `.env`, `node_modules/`, `dist/`, `*.db`, `uploads/evidence/*`, `uploads/reports/*`, `.venv/`, `~/.cache/huggingface/`
- `.env.example` for both `backend/` and `frontend/`
- `docs/` folder with placeholders for all 6 documents
- `uploads/evidence/.gitkeep`, `uploads/heatmaps/.gitkeep`, `uploads/reports/.gitkeep`
- `demo_assets/sample_images/.gitkeep`, `demo_assets/sample_videos/.gitkeep`, `demo_assets/sample_audio/.gitkeep`, `demo_assets/sample_documents/.gitkeep`
- `backend/app/constants.py` and `frontend/src/types/constants.ts` with all shared enumerations
- `backend/seed_data.json` with demo data specification
- Git repository initialized with `main` and `dev` branches

**Folder Structure:**

```
veridact/
├── README.md
├── .gitignore
├── docs/
│   ├── 01_PRODUCT_REQUIREMENTS_DOCUMENT.md
│   ├── 02_TECHNICAL_REQUIREMENTS_DOCUMENT.md
│   ├── 03_APP_FLOW_AND_NAVIGATION.md
│   ├── 04_UI_UX_DESIGN_BRIEF.md
│   ├── 05_BACKEND_SCHEMA_AND_DATABASE_DESIGN.md
│   └── 06_IMPLEMENTATION_PLAN.md
├── uploads/
│   ├── evidence/.gitkeep
│   ├── heatmaps/.gitkeep
│   └── reports/.gitkeep
├── demo_assets/
│   ├── sample_images/.gitkeep
│   ├── sample_videos/.gitkeep
│   ├── sample_audio/.gitkeep
│   ├── sample_documents/.gitkeep
│   └── sample_report.pdf (pre-generated backup)
├── frontend/
│   └── (created in Phase 1)
└── backend/
    └── (created in Phase 2)
```

**Git Branch Strategy:** Initialize with `main` as the stable branch. Create `dev` as the integration branch. All feature work happens on feature branches that merge into `dev` before `main`. The `docs` branch holds documentation-only commits.

---

### Phase 1: Frontend Skeleton

**Goal:** Create a fully routed, styled, but entirely static React application with all 15 pages as placeholder components. No API calls. No real auth. No business logic.

**Tech Stack for Phase:**
- React 18 + Vite 5 + TypeScript 5
- Tailwind CSS 3 (with shadcn/ui Slate dark theme tokens)
- shadcn/ui components: button, card, input, select, badge, dialog, table, toast, avatar, dropdown-menu, progress, separator, sheet, tabs
- React Router v6
- Framer Motion (animation library only — no logic)
- lucide-react (icon library only)

**Deliverables:**

**Frontend initialization:**
```
frontend/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── .env.example
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── globals.css (shadcn/ui + Tailwind variables)
    ├── types/
    │   ├── user.types.ts
    │   ├── case.types.ts
    │   ├── evidence.types.ts
    │   ├── analysis.types.ts
    │   ├── custody.types.ts
    │   ├── report.types.ts
    │   ├── api.types.ts
    │   └── constants.ts
    ├── hooks/
    │   ├── useAuth.ts (returns mock data — wired in Phase 3)
    │   ├── useCases.ts (returns empty array — wired in Phase 4)
    │   ├── useCase.ts
    │   ├── useAnalysis.ts
    │   └── useToast.ts
    ├── services/
    │   ├── apiClient.ts (Axios instance + JWT interceptor)
    │   ├── authService.ts (stubs only)
    │   ├── caseService.ts (stubs only)
    │   ├── evidenceService.ts (stubs only)
    │   ├── reportService.ts (stubs only)
    │   ├── adminService.ts (stubs only)
    │   └── publicService.ts (stubs only)
    ├── routes/
    │   ├── ProtectedRoute.tsx (checks localStorage JWT — mock for now)
    │   └── RoleRoute.tsx (checks role — mock for now)
    ├── components/
    │   ├── layout/
    │   │   ├── AppLayout.tsx
    │   │   ├── PublicLayout.tsx
    │   │   ├── AuthLayout.tsx
    │   │   ├── Sidebar.tsx
    │   │   └── TopNav.tsx
    │   ├── ui/
    │   │   ├── ConfidenceMeter.tsx (placeholder)
    │   │   ├── VerdictBadge.tsx (placeholder)
    │   │   ├── FileUploadBox.tsx (placeholder)
    │   │   ├── CustodyTimeline.tsx (placeholder)
    │   │   ├── HeatmapViewer.tsx (placeholder)
    │   │   ├── SHAHashDisplay.tsx (placeholder)
    │   │   ├── CaseNumberDisplay.tsx (placeholder)
    │   │   ├── LoadingSpinner.tsx
    │   │   ├── ErrorBoundary.tsx
    │   │   ├── DataTable.tsx (placeholder)
    │   │   ├── FilterBar.tsx (placeholder)
    │   │   ├── SkeletonLoader.tsx
    │   │   ├── EmptyState.tsx
    │   │   └── ErrorState.tsx
    │   ├── cases/
    │   │   ├── CaseCard.tsx (placeholder)
    │   │   ├── CaseStatusBadge.tsx (placeholder)
    │   │   ├── PriorityBadge.tsx (placeholder)
    │   │   └── CaseFilterBar.tsx (placeholder)
    │   ├── evidence/
    │   │   ├── EvidenceCard.tsx (placeholder)
    │   │   ├── AnalysisResultCard.tsx (placeholder)
    │   │   ├── SubmissionWizard.tsx (placeholder)
    │   │   └── StepIndicator.tsx (placeholder)
    │   ├── dashboard/
    │   │   └── StatsCard.tsx (placeholder)
    │   └── analytics/
    │       ├── VerdictDistributionChart.tsx (placeholder)
    │       ├── DailySubmissionsChart.tsx (placeholder)
    │       └── CaseTypeChart.tsx (placeholder)
    └── pages/
        ├── LandingPage.tsx (placeholder)
        ├── LoginPage.tsx (placeholder)
        ├── RegisterPage.tsx (placeholder)
        ├── SubmitEvidencePage.tsx (placeholder)
        ├── TrackCasePage.tsx (placeholder)
        ├── TrackCaseResultPage.tsx (placeholder)
        ├── DashboardPage.tsx (placeholder)
        ├── CaseListPage.tsx (placeholder)
        ├── CaseDetailPage.tsx (placeholder)
        ├── EvidenceDetailPage.tsx (placeholder)
        ├── ReportsPage.tsx (placeholder)
        ├── AnalyticsPage.tsx (placeholder)
        ├── AdminOverviewPage.tsx (placeholder)
        ├── AdminUsersPage.tsx (placeholder)
        ├── AdminCustodyPage.tsx (placeholder)
        └── AdminSettingsPage.tsx (placeholder)
```

**Route Configuration in App.tsx:**
```tsx
// Public routes (PublicLayout)
/                     → LandingPage
/login                → LoginPage
/register             → RegisterPage
/submit               → SubmitEvidencePage
/track                → TrackCasePage
/track/:caseNumber    → TrackCaseResultPage

// Protected routes (AppLayout + ProtectedRoute)
/dashboard            → DashboardPage
/dashboard/cases      → CaseListPage
/dashboard/cases/:caseId  → CaseDetailPage
/dashboard/cases/:caseId/evidence/:evidenceId → EvidenceDetailPage
/dashboard/reports    → ReportsPage
/dashboard/analytics  → AnalyticsPage (supervisor+)

// Admin routes (AppLayout + RoleRoute: super_admin)
/admin                → AdminOverviewPage
/admin/users          → AdminUsersPage
/admin/custody        → AdminCustodyPage
/admin/settings       → AdminSettingsPage
```

**Theme Tokens (tailwind.config.ts):**

The design system from Document 04 specifies a dark forensic theme:
- Background: `slate-950` (#0B0F17)
- Surface (cards): `slate-900` (#0F172A)
- Border: `slate-800` (#1E293B)
- Text Primary: `slate-50` (#F8FAFC)
- Text Secondary: `slate-400` (#94A3B8)
- Accent Primary: `cyan-400` (#22D3EE)
- Success/Authentic: `emerald-400` (#34D399)
- Warning/Suspicious: `yellow-400` (#FACC15)
- Danger/Likely Fake: `red-500` (#EF4444)
- Neutral/Inconclusive: `slate-400` (#94A3B8)

**Phase 1 Acceptance Criteria:**
- `npm run dev` starts without TypeScript errors
- All 16 routes load showing a placeholder heading
- Layout renders correctly (sidebar + topnav for authenticated, minimal header for public)
- Sidebar navigation shows all items (hardcoded role for now)
- No console errors

---

### Phase 2: Backend and Database Setup

**Goal:** Create a fully structured FastAPI backend with all 7 SQLAlchemy models, all Pydantic schemas, and a working health endpoint. No business logic yet — just structure and schema.

**Tech Stack for Phase:**
- Python 3.11+
- FastAPI 0.110+ with Uvicorn
- SQLAlchemy 2.0 + SQLite (`veridact.db`)
- Pydantic v2
- `python-jose`, `passlib[bcrypt]`
- `python-multipart`, `python-magic`, `aiofiles`

**Deliverables:**

```
backend/
├── requirements.txt
├── .env.example
├── run.py
├── seed.py (empty stub)
├── seed_data.json
└── app/
    ├── __init__.py
    ├── main.py
    ├── config.py
    ├── database.py
    ├── constants.py
    ├── models/
    │   ├── __init__.py (imports all models)
    │   ├── user.py
    │   ├── case.py
    │   ├── evidence.py
    │   ├── analysis_result.py
    │   ├── custody_log.py
    │   ├── report.py
    │   └── case_note.py
    ├── schemas/
    │   ├── __init__.py
    │   ├── auth_schemas.py
    │   ├── case_schemas.py
    │   ├── evidence_schemas.py
    │   ├── analysis_schemas.py
    │   ├── report_schemas.py
    │   ├── custody_schemas.py
    │   └── admin_schemas.py
    ├── routes/
    │   ├── __init__.py
    │   ├── auth.py (health check only)
    │   ├── cases.py (stub)
    │   ├── evidence.py (stub)
    │   ├── analysis.py (stub)
    │   ├── reports.py (stub)
    │   ├── custody.py (stub)
    │   ├── admin.py (stub)
    │   └── public.py (stub)
    ├── services/
    │   ├── __init__.py
    │   ├── auth_service.py (stub)
    │   ├── case_service.py (stub)
    │   ├── evidence_service.py (stub)
    │   ├── analysis_service.py (stub)
    │   ├── custody_service.py (stub)
    │   ├── report_service.py (stub)
    │   └── ai/
    │       ├── __init__.py
    │       ├── router.py (stub)
    │       ├── image_detector.py (stub)
    │       ├── video_detector.py (stub)
    │       ├── audio_detector.py (stub)
    │       └── document_detector.py (stub)
    └── utils/
        ├── __init__.py
        ├── hashing.py (stub)
        ├── file_validation.py (stub)
        ├── pdf.py (stub)
        └── security.py (stub)
```

**Key files to implement in Phase 2:**

`app/database.py` — SQLAlchemy engine with WAL mode + foreign keys enabled, `get_db()` dependency, `create_all()` called on startup.

`app/models/` — All 7 models matching Document 05 exactly: `users`, `cases`, `evidence`, `analysis_results`, `custody_logs`, `reports`, `case_notes`. UUID primary keys, created_at/updated_at timestamps, correct relationships.

`app/main.py` — CORS middleware (origin: `http://localhost:5173`), all router includes with correct prefixes, `GET /api/health` endpoint returning `{"status": "ok", "version": "1.0.0", "timestamp": "..."}`.

`app/config.py` — Reads all `.env` variables with sensible defaults. No secrets hardcoded.

**Phase 2 Acceptance Criteria:**
- `uvicorn app.main:app --reload` starts without errors
- `GET http://localhost:8000/api/health` returns 200 OK
- `http://localhost:8000/docs` shows all route groups registered
- `python -c "from app.database import engine, Base; from app.models import *; Base.metadata.create_all(engine); print('OK')"` creates all 7 tables
- SQLite `.db` file created at `backend/veridact.db`

---

### Phase 3: Authentication and RBAC

**Goal:** Implement full JWT authentication — register, login, logout, token validation, role extraction — and wire the frontend `useAuth` hook to the real backend. Seed all demo users.

**Backend deliverables:**
- `app/utils/security.py` — JWT creation, verification, `get_current_user()` dependency, `require_roles(*roles)` dependency factory
- `app/services/auth_service.py` — `register_user()`, `authenticate_user()`, `get_user_by_id()`
- `app/schemas/auth_schemas.py` — `RegisterRequest`, `LoginRequest`, `LoginResponse`, `UserResponse`
- `app/routes/auth.py` — `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`
- `backend/seed.py` — Creates 6 demo users with bcrypt-hashed passwords

**Demo Users (from `seed_data.json`):**

| Email | Role | Password |
|---|---|---|
| `admin@veridact.local` | super_admin | demo1234 |
| `supervisor@veridact.local` | supervisor | demo1234 |
| `inv1@veridact.local` | investigator | demo1234 |
| `inv2@veridact.local` | investigator | demo1234 |
| `citizen1@veridact.local` | citizen | demo1234 |
| `citizen2@veridact.local` | citizen | demo1234 |

**Frontend deliverables:**
- `src/hooks/useAuth.ts` — Real `AuthContext` with `login()`, `logout()`, `user`, `isAuthenticated`, `role` state
- `src/services/authService.ts` — `login()`, `register()`, `logout()`, `getMe()` calling real API
- `src/pages/LoginPage.tsx` — Full login form with React Hook Form + Zod, loading state, error display
- `src/pages/RegisterPage.tsx` — Registration form (citizen role only for self-registration)
- `src/routes/ProtectedRoute.tsx` — Real JWT check from localStorage, redirect to `/login`
- `src/routes/RoleRoute.tsx` — Role check from auth context, redirect to `/dashboard` on mismatch

**JWT Configuration:**
- Algorithm: HS256
- Expiry: 8 hours (configurable via `JWT_EXPIRE_HOURS`)
- Payload: `{"sub": user_id, "role": user_role, "exp": timestamp}`
- Self-registration: `citizen` role only; other roles created by super_admin via admin panel

**Phase 3 Acceptance Criteria:**
- Demo users log in successfully with correct role routing
- Invalid credentials return `401 Unauthorized` with error message
- `GET /api/auth/me` with valid token returns user object
- `GET /api/auth/me` without token returns `401`
- Frontend `ProtectedRoute` redirects unauthenticated users to `/login`
- Logout clears `localStorage` and redirects to `/`
- Each role lands on the correct dashboard after login
- `python seed.py --reset` recreates all users cleanly

---

### Phase 4: Case and Evidence Core Flow

**Goal:** Build the complete end-to-end flow from citizen submission through file upload, SHA-256 hashing, evidence storage, and custody logging. This is the backbone of the entire platform.

**Backend deliverables:**
- `app/utils/hashing.py` — `compute_sha256(file_path)` and `compute_sha256_stream(file_data)`
- `app/utils/file_validation.py` — MIME type detection via `python-magic`, extension validation, size check
- `app/services/evidence_service.py` — `save_upload_file()`, `get_evidence_by_id()`, `list_case_evidence()`
- `app/services/case_service.py` — `create_case()`, `get_case()`, `list_cases()`, `update_case()`, `generate_case_number()`
- `app/services/custody_service.py` — `log_action()`, `get_case_custody()`, `get_all_custody()` (append-only)
- `app/routes/cases.py` — Full implementation of all 5 case endpoints
- `app/routes/evidence.py` — Full implementation of all 4 evidence endpoints
- `app/routes/public.py` — `GET /api/public/cases/:caseNumber` for citizen tracking (returns safe public subset)
- `app/routes/custody.py` — `GET /api/cases/{id}/custody`, `GET /api/admin/custody`

**Case Number Format:** `VRD-YYYY-NNNNNN` (e.g., `VRD-2025-000042`). Generated server-side by counting existing cases and zero-padding to 6 digits.

**SHA-256 Workflow:**
1. File is received via `multipart/form-data`
2. `python-magic` validates MIME type
3. File is streamed to `uploads/evidence/{uuid}.{ext}` while simultaneously computing SHA-256
4. Final hash is stored in `evidence.sha256_hash`
5. Custody log entry `evidence_uploaded` is created with the hash in `notes`

**Frontend deliverables:**
- `src/components/evidence/SubmissionWizard.tsx` — Full 4-step wizard using React Hook Form + Zod
- `src/components/ui/FileUploadBox.tsx` — Drag-and-drop with type/size validation
- `src/components/ui/SHAHashDisplay.tsx` — Monospace hash display with copy button
- `src/components/ui/CaseNumberDisplay.tsx` — Formatted case number display
- `src/services/caseService.ts` — Real API calls for case CRUD
- `src/services/evidenceService.ts` — Real file upload and evidence retrieval
- `src/services/publicService.ts` — `trackCase()` for citizen tracking

**Citizen Submission Wizard Steps:**
1. Select complaint type (7 options from `COMPLAINT_TYPES`)
2. Title, description (50–2000 chars), contact email, contact phone, location
3. File upload (single file, 100MB max, validated by extension and MIME type client-side)
4. Review summary + submit → POST `/api/cases` then POST `/api/cases/{id}/evidence`

**Confirmation Screen shows:**
- Case Number (large, prominent): `VRD-2025-000042`
- SHA-256 hash (monospace, with copy button)
- Submission timestamp
- "Download Acknowledgment PDF" button
- "Track My Case" link → `/track/VRD-2025-000042`

**Phase 4 Acceptance Criteria:**
- Citizen wizard completes end-to-end with file upload
- SHA-256 hash is displayed on confirmation screen and stored in DB
- Case number is generated in `VRD-YYYY-NNNNNN` format
- File is saved to `uploads/evidence/{uuid}.ext`
- `custody_logs` has entries: `case_created`, `evidence_uploaded`
- Citizen can track case at `/track/VRD-2025-000042`
- File type and size validation rejects `.exe` and files over 100MB

---

### Phase 5: AI Analysis Layer

**Goal:** Implement the AI inference pipeline that routes each evidence type to the appropriate analyzer and returns a normalized verdict. The fallback must be bulletproof.

**Backend deliverables:**
- `app/services/ai/router.py` — Routes based on `evidence.file_type` to correct detector
- `app/services/ai/image_detector.py` — `prithivMLmods/Deepfake-Detect-Siglip2` via Hugging Face transformers; lazy model loading; hash-based deterministic demo fallback
- `app/services/ai/video_detector.py` — OpenCV frame sampling (10 frames) + `image_detector` per frame; mean aggregation
- `app/services/ai/audio_detector.py` — `librosa` MFCC heuristic (primary); `microsoft/wavlm-base` optional
- `app/services/ai/document_detector.py` — PyMuPDF metadata extraction + pytesseract OCR + Pillow ELA
- `app/services/analysis_service.py` — Full implementation: `create_pending_result()`, `update_result_processing()`, `complete_result()`, `fail_result()`, `get_latest_result()`
- `app/routes/analysis.py` — `POST /api/evidence/{id}/analyze`, `GET /api/evidence/{id}/results`

**AI Output Normalization (AnalysisResultData dataclass):**
```python
@dataclass
class AnalysisResultData:
    confidence_score: float   # 0.0 to 1.0
    verdict: str              # authentic | suspicious | likely_fake | inconclusive
    explanation: str          # Human-readable explanation for investigator
    model_used: str           # e.g. "prithivMLmods/Deepfake-Detect-Siglip2"
    model_version: str        # e.g. "v1.0"
    heatmap_path: str | None  # Path to heatmap PNG if generated
    raw_output: dict          # Full model output for debugging
```

**Verdict Mapping:**
- `confidence_score >= 0.75` → `likely_fake`
- `confidence_score >= 0.45` → `suspicious`
- `confidence_score < 0.45` → `authentic`
- On error → `inconclusive` (confidence_score = 0.5, explanation = "Analysis could not be completed")

**Demo Fallback Logic:**
- If `DEMO_MODE=true` in `.env`: return a pre-scripted result based on evidence file type without loading any model
- If model fails to load: hash-based deterministic score (SHA-256 first byte `0x00`–`0x7F` → score 0.15, `0x80`–`0xFF` → score 0.82)
- Fallback is always marked with `model_used = "demo_fallback_v1"` and a banner note

**Frontend deliverables:**
- `src/components/ui/ConfidenceMeter.tsx` — Framer Motion animated progress bar from 0 to score on mount; color-coded by verdict
- `src/components/ui/VerdictBadge.tsx` — Green (authentic), Yellow (suspicious), Red (likely_fake), Gray (inconclusive)
- `src/components/evidence/AnalysisResultCard.tsx` — Full analysis display: score, verdict, explanation, model used, raw output toggle, heatmap viewer
- `src/hooks/useAnalysis.ts` — Manages analysis trigger, loading state (up to 30s), and result polling

**Phase 5 Acceptance Criteria:**
- `POST /api/evidence/{id}/analyze` returns `confidence_score`, `verdict`, `explanation` for an uploaded image
- With `DEMO_MODE=true`: returns result in < 1 second without loading any model
- Analysis result stored in `analysis_results` table and retrievable via `GET /api/evidence/{id}/results`
- Custody log has `analysis_started` and `analysis_completed` entries
- Frontend `ConfidenceMeter` animates to correct score
- Fallback engages when model is unavailable
- `DEMO_MODE` result is visually flagged in the UI

---

### Phase 6: Dashboards and Reports

**Goal:** Build all role-specific dashboards, the full case detail view, PDF forensic report generation, and report download.

**Backend deliverables:**
- `app/utils/pdf.py` — Full `generate_forensic_report()` implementation using ReportLab
- `app/services/report_service.py` — `generate_report()`, `get_report()`, `list_case_reports()`
- `app/routes/reports.py` — `POST /api/cases/{id}/report`, `GET /api/reports/{id}`, `GET /api/cases/{id}/reports`
- `app/routes/admin.py` — Full implementation: `GET /api/admin/users`, `PATCH /api/admin/users/{id}`, `GET /api/admin/analytics`

**PDF Report Content:**
1. VERIDACT header (logo text + "AI Forensic Evidence Report")
2. Report metadata (ID, generated by, date, SHA-256 of report itself)
3. Case summary (case number, title, type, status, priority, description)
4. Evidence table (filename, type, size, SHA-256, upload date, analysis status)
5. AI analysis results (verdict, confidence score, explanation per evidence item)
6. Chain-of-custody log (full chronological table: timestamp, action, user, notes)
7. Investigator notes (internal notes excluded from public reports)
8. Disclaimer footer: "AI analysis assists investigators but does not replace forensic judgment. Results are probabilistic and require expert human review before use as legal evidence."

**Frontend deliverables:**
- `src/pages/DashboardPage.tsx` — Role-aware stats cards, recent cases, high-risk alerts
- `src/pages/CaseListPage.tsx` — Filterable case table with status/type/priority filters
- `src/pages/CaseDetailPage.tsx` — 4-tab view: Evidence, Notes, Custody Log, Reports
- `src/pages/EvidenceDetailPage.tsx` — Full evidence metadata + analysis result display
- `src/pages/ReportsPage.tsx` — Report list + generate/download
- `src/pages/AnalyticsPage.tsx` — Recharts: verdict pie chart, daily bar chart, case type bar chart
- `src/pages/AdminOverviewPage.tsx`, `AdminUsersPage.tsx`, `AdminCustodyPage.tsx`, `AdminSettingsPage.tsx`
- `src/components/analytics/VerdictDistributionChart.tsx` — Recharts PieChart
- `src/components/analytics/DailySubmissionsChart.tsx` — Recharts BarChart
- `src/components/ui/CustodyTimeline.tsx` — Vertical timeline with action icons
- `src/components/cases/CaseTable.tsx` — Paginated, filterable data table
- `src/services/reportService.ts` — `generateReport()`, `downloadReport()`
- `src/services/adminService.ts` — `getUsers()`, `updateUser()`, `getAnalytics()`

**Phase 6 Acceptance Criteria:**
- Investigator dashboard shows assigned case stats
- Case detail shows all 4 tabs with correct data
- Evidence detail shows full analysis result with confidence meter
- "Generate Report" button creates PDF and returns download link
- Downloaded PDF contains all 7 sections
- PDF SHA-256 is stored in `reports` table
- `file_downloaded` custody log entry created on report download
- Analytics charts render correctly with seed data

---

### Phase 7: UI Polish and Demo Readiness

**Goal:** Transform the functional MVP into a demo-ready presentation. All empty states, error states, loading states, and UI details finalized. Seed data verified. Demo script tested.

**Deliverables:**
- All loading skeleton states implemented for all list and data-fetching components
- All empty states implemented (empty case list, no analysis yet, no reports yet)
- All error states with retry buttons
- Toast notifications for all significant actions (case created, analysis complete, report downloaded, error occurred)
- Demo data verified end-to-end: 5 cases, 8 evidence records, 5 analysis results, 2 reports, 12 custody logs
- `sample_report.pdf` pre-generated and placed in `demo_assets/`
- `DEMO_MODE=true` tested and working as complete fallback
- `HF_HUB_OFFLINE=true` tested to prevent model download failures during demo
- Responsive design verified at 375px (mobile), 768px (tablet), 1440px (desktop)
- Final rehearsal of 5-minute demo script (see Section 9)
- `README.md` updated with final quickstart commands

**Analytics Charts (Recharts):**
- `VerdictDistributionChart.tsx` — `PieChart` with `COLORS` array for 4 verdict values
- `DailySubmissionsChart.tsx` — `BarChart` with date on X axis, count on Y
- `CaseTypeChart.tsx` — `BarChart` horizontal with complaint type breakdown

**Demo Backup Mode Activation:**
- Set `DEMO_MODE=true` and `HF_HUB_OFFLINE=true` in `.env`
- Run `python seed.py --reset` to ensure fresh demo database
- All analysis results are pre-stored from seed data
- No live AI inference needed to complete the full demo flow

---

## 3. Task Breakdown

| Task ID | Phase | Task Name | Owner | Files/Folders | Dependencies | Difficulty | Acceptance Criteria |
|---|---|---|---|---|---|---|---|
| T-001 | 0 | Initialize repo and folder structure | Integration Lead | `veridact/`, `README.md`, `.gitignore`, `docs/` | None | Easy | `tree veridact/` shows all folders; `.gitignore` works |
| T-002 | 0 | Create shared constants files | Backend Developer | `backend/app/constants.py`, `frontend/src/types/constants.ts` | T-001 | Easy | Both files importable; values match Document 05 |
| T-003 | 0 | Create demo seed data JSON | Backend Developer | `backend/seed_data.json` | T-002 | Easy | Valid JSON; internally consistent FK references |
| T-004 | 0 | Create upload and demo asset folders | Integration Lead | `uploads/`, `demo_assets/` | T-001 | Easy | Folders exist; `.gitkeep` files present |
| T-005 | 1 | Initialize React + Vite + TypeScript | Frontend Developer | `frontend/` | T-001 | Easy | `npm run dev` starts; no TypeScript errors |
| T-006 | 1 | Configure Tailwind CSS and shadcn/ui | Frontend Developer | `tailwind.config.ts`, `globals.css` | T-005 | Medium | Dark theme tokens applied; shadcn components render |
| T-007 | 1 | Create all TypeScript types | Frontend Developer | `src/types/` | T-002, T-005 | Medium | All type files importable without errors |
| T-008 | 1 | Set up React Router with all 16 routes | Frontend Developer | `App.tsx`, `src/routes/` | T-005 | Medium | All routes accessible; placeholder pages load |
| T-009 | 1 | Build layout components | UI/UX Developer | `src/components/layout/` | T-006, T-008 | Medium | Sidebar, TopNav, AppLayout, PublicLayout render |
| T-010 | 1 | Create all 16 placeholder page files | Frontend Developer | `src/pages/` | T-008, T-009 | Easy | Each page loads at its route |
| T-011 | 1 | Set up Axios apiClient with JWT interceptor | Frontend Developer | `src/services/apiClient.ts` | T-005 | Easy | Axios instance exports; header auto-added |
| T-012 | 2 | Set up FastAPI application structure | Backend Developer | `backend/app/main.py`, `config.py`, `database.py` | T-002 | Medium | Uvicorn starts; `/api/health` returns 200 |
| T-013 | 2 | Implement all 7 SQLAlchemy models | Database Developer | `backend/app/models/` | T-002, T-012 | Medium | `create_all()` creates 7 tables without errors |
| T-014 | 2 | Implement all 8 Pydantic schema files | Backend Developer | `backend/app/schemas/` | T-013 | Medium | All schemas importable; no password_hash exposed |
| T-015 | 2 | Create route stubs with health endpoint | Backend Developer | `backend/app/routes/` | T-012 | Easy | `/api/health` works; `/docs` shows all routes |
| T-016 | 2 | Create upload and output directories | Backend Developer | `backend/app/main.py` startup | T-012 | Easy | Directories created on startup if missing |
| T-017 | 3 | Implement JWT utilities | Backend Developer | `backend/app/utils/security.py` | T-014 | Medium | `create_token()`, `verify_token()`, `get_current_user()` work |
| T-018 | 3 | Implement auth service and routes | Backend Developer | `app/services/auth_service.py`, `app/routes/auth.py` | T-013, T-017 | Medium | Register, login, me, logout endpoints work |
| T-019 | 3 | Build seed script with demo users | Backend Developer | `backend/seed.py` | T-013, T-017 | Medium | 6 demo users created; bcrypt-hashed; idempotent |
| T-020 | 3 | Implement frontend auth (useAuth, LoginPage) | Frontend Developer | `src/hooks/useAuth.ts`, `src/pages/LoginPage.tsx` | T-011, T-018 | Medium | Login works; token stored; role routing works |
| T-021 | 3 | Implement ProtectedRoute and RoleRoute | Frontend Developer | `src/routes/` | T-020 | Easy | Redirects to /login if no token |
| T-022 | 4 | Implement SHA-256 hashing utility | Backend Developer | `backend/app/utils/hashing.py` | T-012 | Easy | Correct hash for known test file |
| T-023 | 4 | Implement file validation utility | Backend Developer | `backend/app/utils/file_validation.py` | T-022 | Medium | Rejects .exe; accepts .jpg; rejects 200MB file |
| T-024 | 4 | Implement custody log service | Backend Developer | `app/services/custody_service.py` | T-013 | Medium | `log_action()` always inserts, never updates |
| T-025 | 4 | Implement case service and routes | Backend Developer | `app/services/case_service.py`, `app/routes/cases.py` | T-014, T-024 | Hard | Case CRUD works; case number generated correctly |
| T-026 | 4 | Implement evidence service and routes | Backend Developer | `app/services/evidence_service.py`, `app/routes/evidence.py` | T-022, T-023, T-025 | Hard | File upload, SHA-256 stored, file saved to uploads/ |
| T-027 | 4 | Implement public tracking route | Backend Developer | `app/routes/public.py` | T-025 | Easy | `/api/public/cases/:caseNumber` returns safe status |
| T-028 | 4 | Build submission wizard (frontend) | Frontend Developer | `src/pages/SubmitEvidencePage.tsx`, `SubmissionWizard.tsx` | T-020, T-026 | Hard | 4-step wizard completes; case number shown |
| T-029 | 4 | Build FileUploadBox and SHAHashDisplay | UI/UX Developer | `src/components/ui/FileUploadBox.tsx`, `SHAHashDisplay.tsx` | T-006 | Medium | Drag-drop works; copy button works |
| T-030 | 4 | Build citizen case tracking pages | Frontend Developer | `src/pages/TrackCasePage.tsx`, `TrackCaseResultPage.tsx` | T-027 | Medium | Tracking page shows public case status |
| T-031 | 4 | Extend seed script with cases and evidence | Backend Developer | `backend/seed.py` | T-025, T-026 | Medium | 5 demo cases and 8 evidence records seeded |
| T-032 | 5 | Implement image deepfake detector | AI/ML Developer | `app/services/ai/image_detector.py` | T-026 | Hard | Returns AnalysisResultData; fallback works if model fails |
| T-033 | 5 | Implement video detector (frame sampling) | AI/ML Developer | `app/services/ai/video_detector.py` | T-032 | Hard | 10 frames extracted; mean score computed |
| T-034 | 5 | Implement audio heuristic detector | AI/ML Developer | `app/services/ai/audio_detector.py` | T-012 | Medium | librosa MFCC analysis returns verdict |
| T-035 | 5 | Implement document metadata/ELA detector | AI/ML Developer | `app/services/ai/document_detector.py` | T-012 | Hard | Metadata flags + ELA score returned |
| T-036 | 5 | Implement AI router | AI/ML Developer | `app/services/ai/router.py` | T-032, T-033, T-034, T-035 | Medium | Routes to correct detector by file_type |
| T-037 | 5 | Implement analysis service and route | AI/ML Developer | `app/services/analysis_service.py`, `app/routes/analysis.py` | T-036, T-024 | Hard | POST /analyze returns result; custody logs written |
| T-038 | 5 | Build ConfidenceMeter and VerdictBadge | UI/UX Developer | `src/components/ui/ConfidenceMeter.tsx`, `VerdictBadge.tsx` | T-006 | Medium | Animates from 0 to score; 4 colors correct |
| T-039 | 5 | Build AnalysisResultCard | Frontend Developer | `src/components/evidence/AnalysisResultCard.tsx` | T-038 | Medium | Shows score, verdict, explanation, model used |
| T-040 | 5 | Wire EvidenceDetailPage to analysis API | Frontend Developer | `src/pages/EvidenceDetailPage.tsx` | T-037, T-039 | Medium | Analyze button triggers API; result displayed |
| T-041 | 5 | Extend seed with pre-computed analysis results | AI/ML Developer | `backend/seed.py` | T-037 | Easy | 5 analysis results seeded with realistic scores |
| T-042 | 6 | Implement PDF generation utility | AI/ML Developer | `backend/app/utils/pdf.py` | T-025, T-026, T-037 | Hard | PDF has all 7 sections; SHA-256 of PDF computed |
| T-043 | 6 | Implement report service and routes | AI/ML Developer | `app/services/report_service.py`, `app/routes/reports.py` | T-042, T-024 | Medium | POST generates PDF; GET downloads it |
| T-044 | 6 | Implement admin routes and analytics | Backend Developer | `app/routes/admin.py` | T-013, T-019 | Medium | User list, user update, analytics aggregation work |
| T-045 | 6 | Build DashboardPage (all roles) | Frontend Developer | `src/pages/DashboardPage.tsx` | T-025, T-009 | Medium | Role-aware stats; high-risk alerts work |
| T-046 | 6 | Build CaseListPage and CaseDetailPage | Frontend Developer | `src/pages/CaseListPage.tsx`, `CaseDetailPage.tsx` | T-025, T-045 | Hard | Filters work; all 4 tabs render; custody timeline |
| T-047 | 6 | Build CustodyTimeline component | UI/UX Developer | `src/components/ui/CustodyTimeline.tsx` | T-006 | Medium | Vertical timeline; correct icon per action type |
| T-048 | 6 | Build ReportsPage with download | Frontend Developer | `src/pages/ReportsPage.tsx` | T-043 | Medium | Generate Report triggers API; PDF downloads |
| T-049 | 6 | Build AnalyticsPage with Recharts | Frontend Developer | `src/pages/AnalyticsPage.tsx` | T-044 | Medium | 3 charts render with seed data |
| T-050 | 6 | Build Admin pages | Frontend Developer | `src/pages/Admin*.tsx` | T-044 | Medium | User table; update user modal; custody audit |
| T-051 | 7 | Implement loading skeleton states | UI/UX Developer | All list/data pages | T-045, T-046 | Medium | Skeleton shows while data loads |
| T-052 | 7 | Implement empty and error states | UI/UX Developer | All pages | T-051 | Easy | Empty/error states render with correct text |
| T-053 | 7 | Add toast notifications | Frontend Developer | All form submissions and actions | All Phase 6 | Easy | Toasts appear for success and error events |
| T-054 | 7 | Finalize seed data and demo assets | Integration Lead | `backend/seed.py`, `demo_assets/` | All Phase 5-6 | Medium | Full demo flow works end-to-end from seed data |
| T-055 | 7 | Generate and save sample_report.pdf | AI/ML Developer | `demo_assets/sample_report.pdf` | T-042 | Easy | Pre-generated PDF exists as backup |
| T-056 | 7 | Test DEMO_MODE and HF_HUB_OFFLINE | Integration Lead | `.env` | T-037, T-054 | Medium | Demo runs without internet or models |
| T-057 | 7 | Responsive design review | UI/UX Developer | All pages | All Phase 6-7 | Medium | Looks correct at 375px, 768px, 1440px |
| T-058 | 7 | Final end-to-end demo rehearsal | Integration Lead | Full stack | All | Easy | Full 5-minute demo completes without errors |

---

## 4. Git Strategy

### Branch Naming

| Branch | Purpose | Merges Into |
|---|---|---|
| `main` | Stable, demo-ready code only | — |
| `dev` | Integration branch | `main` (after demo) |
| `docs` | Documentation files only | `dev` |
| `frontend-ui` | All React/Vite frontend work | `dev` |
| `backend-api` | FastAPI routes and services | `dev` |
| `database-schema` | SQLAlchemy models and schemas | `dev` (before backend-api) |
| `ai-analysis` | AI inference modules | `dev` |
| `demo-polish` | Seed data, UI polish, demo prep | `dev` |

**Branch Creation Order:**
1. `main` → initialize
2. `dev` → branch from main
3. `docs` → branch from dev
4. `database-schema` → branch from dev
5. `backend-api` → branch from `database-schema` (after models merged)
6. `frontend-ui` → branch from dev
7. `ai-analysis` → branch from `backend-api` (after evidence service merged)
8. `demo-polish` → branch from dev

### Commit Message Format

Use semantic prefixes:
```
feat: add citizen evidence submission wizard
fix: correct sha256 hash streaming for large files
chore: update seed data with 3 new demo cases
docs: add phase 2 acceptance criteria to implementation plan
refactor: extract file validation into utility module
style: apply dark theme tokens to case detail page
test: add integration test for analysis route fallback
```

### Pull Request Rules

1. All PRs go into `dev`, never directly into `main`
2. At least one other team member must review before merge
3. All TypeScript errors must be resolved before PR review
4. All `uvicorn` startup errors must be resolved before PR review
5. PR description must list which Task IDs from Section 3 are completed
6. No PR may rename any route, table, or column without noting it in the PR description and getting explicit approval from all team members

### File Ownership (for PR review routing)

See Section 11 for complete file ownership table.

### Conflict Prevention Rules

1. **Never edit another person's owned files** without coordination
2. `backend/app/constants.py` and `frontend/src/types/constants.ts` are **shared** — any changes require team sync
3. `App.tsx` routing is owned by the Integration Lead — no other person adds routes
4. `backend/app/models/` is frozen after Phase 2 merge — no table renames, only additive nullable columns
5. All backend API schemas are defined before frontend service implementations begin
6. Small, focused commits — no "mega-commits" that touch 20+ files

### Merge Order

Enforce this strict merge sequence to prevent integration failures:

```
T-001 (structure) → T-002 (constants) → T-013 (models) → T-014 (schemas) →
T-017 (JWT utils) → T-018 (auth routes) → T-025 (case routes) → T-026 (evidence routes) →
T-037 (analysis routes) → T-042 (PDF utils) → T-043 (report routes) → T-044 (admin routes) →
[frontend integration can proceed after each backend route is merged]
```

---

## 5. Local Setup Instructions

### Prerequisites

Before running VERIDACT locally, ensure these are installed:

- Python 3.11 or higher
- Node.js 18 or higher
- Git
- Tesseract OCR (system binary for document analysis)

### Step 1: Clone the Repository

```powershell
git clone https://github.com/your-org/veridact.git
cd veridact
```

### Step 2: Set Up Backend

```powershell
# Navigate to backend directory
cd backend

# Create a Python virtual environment
python -m venv .venv

# Activate virtual environment (PowerShell / Windows)
.\.venv\Scripts\Activate.ps1

# If execution policy error on Windows, run first:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Install Python dependencies
pip install -r requirements.txt

# Install PyTorch (CPU-only version — no GPU required)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

### Step 3: Configure Backend Environment

```powershell
# Copy the example env file
copy .env.example .env

# Edit .env — set a strong JWT secret key
# Open with notepad or your editor:
notepad .env

# Minimum required changes:
# JWT_SECRET_KEY=change_this_to_a_random_32_char_string
# (Everything else has sensible defaults for localhost)
```

### Step 4: Set Up Upload Directories

```powershell
# From project root
mkdir uploads\evidence
mkdir uploads\heatmaps
mkdir uploads\reports
mkdir demo_assets\sample_images
mkdir demo_assets\sample_videos
mkdir demo_assets\sample_audio
mkdir demo_assets\sample_documents
```

### Step 5: Start the Backend

```powershell
# From backend/ directory (with .venv activated)
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

### Step 6: Seed the Database

```powershell
# In a new PowerShell window (backend/ with .venv activated)
python seed.py

# Expected output:
# Creating tables...
# Seeding users... 6 users created
# Seeding cases... 5 cases created
# Seeding evidence... 8 evidence records created
# Seeding analysis results... 5 results created
# Seeding custody logs... 12 entries created
# Seeding reports... 2 reports created
# Demo credentials: admin@veridact.local / demo1234
```

### Step 7: Set Up Frontend

```powershell
# From project root
cd frontend

# Install Node.js dependencies
npm install

# Copy environment file
copy .env.example .env
# Default VITE_API_BASE_URL=http://localhost:8000/api is correct for local dev
```

### Step 8: Start the Frontend

```powershell
# From frontend/ directory
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in 3xx ms
  ➜  Local:   http://localhost:5173/
```

### Step 9: Test Health Endpoint

```powershell
# From any PowerShell window
curl http://localhost:8000/api/health

# Expected response:
# {"status":"ok","version":"1.0.0","timestamp":"2025-..."}
```

### Step 10: Test Upload Flow

1. Open `http://localhost:5173/` in browser
2. Click "Report AI Crime"
3. Select "Deepfake Image" as complaint type
4. Fill in title and description
5. Upload any `.jpg` file under 100MB
6. Click Submit
7. Verify case number and SHA-256 hash appear on confirmation screen

### Step 11: Test Evidence Analysis

```powershell
# Test with DEMO_MODE=false (real model — requires internet first run)
# First, pre-download models:
python -c "from app.services.ai.image_detector import load_model; load_model(); print('Model cached')"

# Test with DEMO_MODE=true (no model needed — always works)
# In .env: DEMO_MODE=true
# Restart uvicorn, then trigger analysis from UI
```

### Step 12: Test PDF Report Generation

1. Log in as `inv1@veridact.local` / `demo1234`
2. Navigate to Dashboard → Cases
3. Open any case with analysis results
4. Click "Generate Report" button
5. Verify PDF downloads successfully

### Tesseract Installation (for document analysis)

```powershell
# Windows: Download installer from https://github.com/UB-Mannheim/tesseract/wiki
# Ubuntu/WSL:
sudo apt-get install tesseract-ocr

# macOS (if using Mac):
brew install tesseract
```

### Pre-Downloading AI Models (Run Before Demo)

```powershell
# From backend/ with .venv activated
# Download image deepfake model to local cache (~500MB):
python -c "
from transformers import pipeline
pipe = pipeline('image-classification', model='prithivMLmods/Deepfake-Detect-Siglip2')
print('Image model cached successfully')
"

# After caching, set in .env to prevent download attempts during demo:
# HF_HUB_OFFLINE=true
```

---

## 6. Environment Variables

### `backend/.env.example`

```bash
# ============================================================
# VERIDACT Backend Environment Variables
# Copy this file to .env and fill in values
# No paid services or API keys are required for localhost MVP
# ============================================================

# Application
APP_NAME=VERIDACT
APP_VERSION=1.0.0
DEBUG=true
ENVIRONMENT=development

# Server
HOST=127.0.0.1
PORT=8000

# Database
# SQLite for localhost MVP — no additional setup required
DATABASE_URL=sqlite:///./veridact.db

# JWT Authentication
# Generate a strong secret: python -c "import secrets; print(secrets.token_hex(32))"
JWT_SECRET_KEY=your_very_long_random_secret_key_change_this_before_use
JWT_ALGORITHM=HS256
JWT_EXPIRE_HOURS=8

# File Upload
UPLOAD_DIR=../uploads
MAX_FILE_SIZE_MB=100
ALLOWED_ORIGINS=http://localhost:5173

# AI Model Configuration
# Set to true to use pre-scripted demo responses — no model loading
DEMO_MODE=false

# Primary image deepfake model (downloaded from HuggingFace on first run, ~500MB)
IMAGE_MODEL_NAME=prithivMLmods/Deepfake-Detect-Siglip2

# Fallback image model if primary fails
IMAGE_FALLBACK_MODEL=Wvolf/ViT_Deepfake_Detection

# Set to true during demo to prevent model download attempts (use cached models only)
HF_HUB_OFFLINE=false

# ---- OPTIONAL — Not required for MVP ----
# HuggingFace token — only needed for gated models (our chosen models are NOT gated)
HF_TOKEN_OPTIONAL=

# Gemini API — only for optional LLM-assisted report narrative generation
GEMINI_API_KEY_OPTIONAL=
# ---- END OPTIONAL ----

# Tesseract OCR path — only needed if tesseract is not in system PATH
# Windows example: C:/Program Files/Tesseract-OCR/tesseract.exe
# macOS (brew): /usr/local/bin/tesseract
# Ubuntu: tesseract (auto-detected if installed)
TESSERACT_CMD=tesseract

# Report Generation
REPORT_DIR=../uploads/reports

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_CITIZEN_TRACK=10/minute

# Demo: Set to true to auto-seed the database on startup
AUTO_SEED_ON_STARTUP=true
```

### `frontend/.env.example`

```bash
# VERIDACT Frontend Environment Variables
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=VERIDACT
VITE_APP_TAGLINE=See Through the Fake. Secure the Truth.
VITE_DEMO_MODE=false
```

### Important Notes on Environment Variables

Variables marked `_OPTIONAL` are never required for the hackathon MVP. The system is designed to function fully without them. `HF_TOKEN_OPTIONAL` is only needed for Hugging Face gated models — all our recommended models are public and ungated. `GEMINI_API_KEY_OPTIONAL` would only be used for an optional LLM-generated report narrative feature that is post-MVP scope.

---

## 7. Testing Plan

### Manual Testing Checklist

#### Auth/RBAC Testing
- [ ] `POST /api/auth/register` with valid citizen data → 201 with user object
- [ ] `POST /api/auth/register` with duplicate email → 409 Conflict
- [ ] `POST /api/auth/register` with role `investigator` → reject (citizen only for self-reg)
- [ ] `POST /api/auth/login` with valid credentials → 200 with JWT token
- [ ] `POST /api/auth/login` with wrong password → 401 Unauthorized
- [ ] `GET /api/auth/me` with valid token → 200 with user object
- [ ] `GET /api/auth/me` without token → 401 Unauthorized
- [ ] Admin logs in → lands on `/admin` overview
- [ ] Supervisor logs in → lands on `/dashboard` with department-wide cases
- [ ] Investigator logs in → lands on `/dashboard` with assigned cases only
- [ ] Citizen logs in → lands on `/dashboard` (limited citizen view)
- [ ] Logout clears token and redirects to `/`
- [ ] Accessing `/dashboard` without token redirects to `/login`
- [ ] Accessing `/admin` as investigator redirects to `/dashboard`

#### Upload Testing
- [ ] Upload `.jpg` file under 100MB → 201 with evidence object and SHA-256 hash
- [ ] Upload `.mp4` video → accepted
- [ ] Upload `.mp3` audio → accepted
- [ ] Upload `.pdf` document → accepted
- [ ] Upload `.exe` file → 415 Unsupported Media Type
- [ ] Upload file over 100MB → 413 Payload Too Large (or client-side rejection)
- [ ] SHA-256 hash shown on confirmation screen matches manual `sha256sum` of uploaded file
- [ ] File saved to `uploads/evidence/` as UUID filename
- [ ] Custody log entry `evidence_uploaded` created

#### SHA-256 Hash Testing
- [ ] Hash is computed server-side during streaming (not post-upload)
- [ ] Same file uploaded twice produces identical SHA-256 hash
- [ ] Hash displayed on UI in monospace font with correct value
- [ ] Copy-to-clipboard button copies hash correctly

#### AI Fallback Testing
- [ ] With `DEMO_MODE=true`: analysis returns result in < 1 second without model
- [ ] Demo mode result labeled with `model_used = "demo_fallback_v1"`
- [ ] Demo mode result shows warning banner on frontend
- [ ] With `HF_HUB_OFFLINE=true` and cached model: analysis uses cached model
- [ ] With `HF_HUB_OFFLINE=true` and no cached model: falls back to hash-based result
- [ ] Fallback result has `verdict = "inconclusive"` or deterministic hash-based verdict
- [ ] Backend does not crash on model failure; returns graceful JSON response
- [ ] Custody log created even for fallback results

#### PDF Report Testing
- [ ] `POST /api/cases/{id}/report` generates a valid PDF
- [ ] Generated PDF is not empty (> 5KB)
- [ ] PDF contains case number in header
- [ ] PDF contains SHA-256 hashes for evidence
- [ ] PDF contains AI analysis results table
- [ ] PDF contains chain-of-custody log
- [ ] PDF contains disclaimer footer
- [ ] PDF SHA-256 is stored in `reports` table
- [ ] Downloading PDF creates `file_downloaded` custody log entry
- [ ] Report download requires authentication (no public download URL)
- [ ] Pre-generated `demo_assets/sample_report.pdf` exists as backup

#### Chain-of-Custody Testing
- [ ] `case_created` log entry created when case submitted
- [ ] `evidence_uploaded` log entry created when evidence uploaded
- [ ] `evidence_accessed` log entry created when investigator views evidence detail
- [ ] `analysis_started` and `analysis_completed` entries created per analysis run
- [ ] `report_generated` entry created per PDF generation
- [ ] `file_downloaded` entry created per report download
- [ ] `case_updated` entry created per status or assignment change
- [ ] `case_closed` entry created when case closed
- [ ] `GET /api/cases/{id}/custody` returns all events in chronological order (ASC)
- [ ] No custody log entry is ever deleted or modified (append-only verified)

#### Citizen Tracking Testing
- [ ] `/track` accepts case number in `VRD-YYYY-NNNNNN` format
- [ ] Invalid format rejected with clear message before API call
- [ ] Valid case number shows public status (not internal notes)
- [ ] Unknown case number shows "Case not found" message
- [ ] Public tracking shows citizen-friendly status labels (not internal DB values)

#### Demo Testing
- [ ] Full demo flow completes in under 5 minutes from cold start
- [ ] Demo flow works with `DEMO_MODE=true` (no internet required)
- [ ] All seeded demo data is visible and realistic
- [ ] `python seed.py --reset` takes < 5 seconds
- [ ] Backend starts in < 3 seconds after reset
- [ ] All 6 demo users log in successfully

---

## 8. 48-Hour Hackathon Build Plan

### Team Roles

| Person | Role | Primary Responsibilities |
|---|---|---|
| Person A | Frontend and UI/UX | All React pages, Tailwind styling, shadcn/ui components, animations |
| Person B | Backend and Database | FastAPI routes, SQLAlchemy models, auth, case/evidence APIs |
| Person C | AI Analysis and Reports | AI inference modules, PDF generation, analysis service |
| Person D | Integration, Testing, Demo | App.tsx routing, seed data, end-to-end testing, demo rehearsal |

---

### Hour 0–4: Setup

**All team members — first 30 minutes together:**
- Clone repository on all machines
- Review Documents 01–06 together (15 minutes)
- Confirm each person's assigned task list from Section 3
- Confirm all branch names and commit format
- Confirm demo user credentials

**Person A (Hours 0–4):**
- Set up React + Vite + TypeScript: `npm create vite@latest frontend -- --template react-ts`
- Install all frontend dependencies (Tailwind, shadcn/ui, React Router, Axios, etc.)
- Configure Tailwind with VERIDACT dark theme tokens from Document 04
- Initialize shadcn/ui with Slate base color
- Create `src/types/constants.ts` mirroring `backend/app/constants.py`

**Person B (Hours 0–4):**
- Create `backend/` Python virtual environment
- Generate `requirements.txt` from Document 02 tech stack list
- `pip install -r requirements.txt`
- Create `backend/app/constants.py` with all constant arrays
- Create `backend/seed_data.json` per Document 01 seed spec

**Person C (Hours 0–4):**
- Set up Python environment (same venv as Person B if working together)
- Install PyTorch CPU: `pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu`
- Begin pre-downloading the image deepfake model in background (this takes 15–20 minutes)
- Review AI/ML section of Document 02 carefully
- Set up `AnalysisResultData` dataclass

**Person D (Hours 0–4):**
- Initialize Git repository
- Create all folders from Document 06 Phase 0 structure
- Create `README.md`, `.gitignore`, both `.env.example` files
- Create `docs/` folder with all 6 documents
- Create upload folders with `.gitkeep`
- Make first commit on `main`, create `dev` branch, create all feature branches

---

### Hour 4–12: Core Frontend/Backend

**Person A (Hours 4–12):**
- Create all 16 placeholder page files
- Set up React Router with all routes in `App.tsx`
- Build `AppLayout.tsx`, `PublicLayout.tsx`, `AuthLayout.tsx`, `Sidebar.tsx`, `TopNav.tsx`
- Build `LandingPage.tsx` with full hero section, feature cards, how-it-works, CTA buttons
- Build `LoginPage.tsx` and `RegisterPage.tsx` shells
- Build `ProtectedRoute.tsx` and `RoleRoute.tsx` (mock auth check for now)
- Create `apiClient.ts` with Axios instance and JWT interceptor stub

**Person B (Hours 4–12):**
- Implement all 7 SQLAlchemy models (`backend/app/models/`)
- Implement `database.py` with WAL mode and `create_all()`
- Implement all Pydantic schemas (`backend/app/schemas/`)
- Set up `main.py` with CORS, router includes, health endpoint
- Implement `security.py` JWT utilities
- Implement `auth_service.py` and `app/routes/auth.py`
- Run `uvicorn app.main:app --reload` and confirm `/api/health` works

**Person C (Hours 4–12):**
- Implement `hashing.py` SHA-256 utility
- Implement `file_validation.py` MIME type + extension checker
- Create stub files for all AI modules in `services/ai/`
- Begin `image_detector.py` with lazy model loading pattern
- Test image detector locally with a sample image

**Person D (Hours 4–12):**
- Implement `seed.py` with 6 demo users
- Run `python seed.py` and confirm users created in DB
- Help Person A with shadcn/ui component installation issues
- Prepare 3–4 sample test files: one JPEG face photo, one MP4 video, one MP3 audio, one PDF document — place in `demo_assets/`
- Test `POST /api/auth/login` with Postman/curl against Person B's auth endpoint

---

### Hour 12–24: Upload, Case, AI Analysis

**Person A (Hours 12–24):**
- Wire `useAuth.ts` to real backend auth API (with Person B)
- Implement `LoginPage.tsx` with full React Hook Form + Zod validation
- Implement `RegisterPage.tsx`
- Build `SubmissionWizard.tsx` (4-step flow) and `SubmitEvidencePage.tsx`
- Build `FileUploadBox.tsx` with drag-and-drop
- Build `SHAHashDisplay.tsx` and `CaseNumberDisplay.tsx`
- Begin `DashboardPage.tsx` with placeholder stats cards

**Person B (Hours 12–24):**
- Implement `custody_service.py` (append-only log)
- Implement `case_service.py` and `routes/cases.py`
- Implement `evidence_service.py` and `routes/evidence.py` (file upload + SHA-256)
- Implement `routes/public.py` for citizen tracking
- Extend `seed.py` with 5 demo cases and 8 demo evidence records
- Confirm `POST /api/cases` and `POST /api/cases/{id}/evidence` work end-to-end

**Person C (Hours 12–24):**
- Implement full `image_detector.py` with model loading, inference, and hash-based fallback
- Implement `video_detector.py` (frame sampling + image detector aggregation)
- Implement `audio_detector.py` with librosa heuristic
- Test all three detectors against demo sample files
- Begin `document_detector.py`
- Document `DEMO_MODE=true` fallback behavior

**Person D (Hours 12–24):**
- Coordinate Person A and Person B on API response shapes — ensure `case_schemas.py` matches what `caseService.ts` expects
- Test citizen submission wizard end-to-end (frontend → backend → DB)
- Verify SHA-256 hash shown in UI matches `sha256sum` of uploaded file
- Update seed script as Person B adds more tables
- Begin `demo_assets/sample_report.pdf` placeholder creation

---

### Hour 24–36: Dashboard, Reports, Polish

**Person A (Hours 24–36):**
- Complete `DashboardPage.tsx` with real API data from seed cases
- Complete `CaseListPage.tsx` with filters and table
- Complete `CaseDetailPage.tsx` with all 4 tabs
- Begin `EvidenceDetailPage.tsx` with metadata view
- Build `ConfidenceMeter.tsx` (Framer Motion) and `VerdictBadge.tsx`

**Person B (Hours 24–36):**
- Implement `routes/admin.py` with user management and analytics endpoints
- Implement `admin_schemas.py`
- Extend `seed.py` to add 12 custody log entries and 2 reports
- Help Person C wire analysis routes
- Fix any bugs from Person D's integration testing

**Person C (Hours 24–36):**
- Complete `document_detector.py`
- Implement `analysis_service.py` (result lifecycle management)
- Implement `routes/analysis.py` (`POST /analyze`, `GET /results`)
- Implement `pdf.py` with ReportLab — all 7 PDF sections
- Implement `report_service.py` and `routes/reports.py`
- Add pre-computed analysis results to `seed.py`

**Person D (Hours 24–36):**
- Wire `EvidenceDetailPage.tsx` to analysis API (with Person A and Person C)
- Test analyze button → loading state → result display flow
- Test PDF generation and download
- Begin `AnalyticsPage.tsx` with Recharts charts
- Test custody timeline display in CaseDetailPage

---

### Hour 36–44: Testing and Demo Flow

**Person A (Hours 36–44):**
- Complete `AnalyticsPage.tsx` charts
- Complete Admin pages (`AdminOverviewPage`, `AdminUsersPage`, `AdminCustodyPage`)
- Add toast notifications for all key actions
- Implement empty states and error states for all lists
- Add loading skeletons for all data-fetching components
- `TrackCasePage.tsx` and `TrackCaseResultPage.tsx` final polish

**Person B (Hours 36–44):**
- Complete all remaining backend edge cases and error handling
- Implement global exception handler in `main.py`
- Final review of all route permission enforcement
- Test that investigator cannot access unassigned cases
- Test admin analytics endpoint with seed data

**Person C (Hours 36–44):**
- Pre-generate `demo_assets/sample_report.pdf` using real seed data
- Test `DEMO_MODE=true` end-to-end (no model loading)
- Test with model cached + `HF_HUB_OFFLINE=true`
- Test PDF download produces a valid, non-empty PDF
- Fix any PDF layout issues

**Person D (Hours 36–44):**
- Run full testing checklist from Section 7
- Test all 6 demo user logins
- Test full citizen submission → investigator review → analysis → report flow
- Test `python seed.py --reset` idempotency
- Prepare demo talking points, time the demo script
- Create backup screenshots for demo backup plan

---

### Hour 44–48: Final Rehearsal and Backup Plan

**All team members together:**
- Run full 5-minute demo script from Section 9 twice from cold start
- Identify any remaining UI issues and fix them
- Set final `.env` values: `DEMO_MODE=true` for safe demo, `HF_HUB_OFFLINE=true` if models pre-cached
- Verify `python seed.py --reset` takes under 5 seconds
- Verify both `uvicorn` and `npm run dev` start cleanly
- Commit all changes to `dev`, merge to `main`
- Take backup screenshot of every key demo screen
- Record a 2-minute screen recording of the demo as last resort backup
- Print demo credentials on paper as physical backup

---

## 9. Hackathon Demo Script

### 2-Minute Pitch

"Every day, investigators at cyber bureaus around the world face a growing wave of AI-manipulated evidence — deepfake videos used to fabricate crimes, cloned voices used in fraud, forged documents with invisible pixel-level manipulation. They need help. Not from expensive enterprise solutions that only large agencies can afford, but from open, accessible tools that run anywhere.

VERIDACT is an AI forensic evidence triage platform. It lets citizens submit digital evidence, and it helps investigators automatically detect whether that evidence is authentic or AI-generated — with a confidence score, a detailed explanation, and a court-ready forensic PDF report that includes a full SHA-256-verified chain of custody.

It runs 100% locally. No cloud. No paid APIs. No subscription. Every police cyber unit in the world, from Kathmandu to Nairobi, can run this on a single laptop.

Let us show you."

---

### 5-Minute Live Demo Script

**Screen 1 — Landing Page (30 seconds)**
- Open `http://localhost:5173/`
- Show VERIDACT hero: "See Through the Fake. Secure the Truth."
- Point out: "Works completely offline on a single laptop. Zero cost."
- Click "Report AI Crime"

**Screen 2 — Citizen Submission Wizard (60 seconds)**
- Step 1: Select "Deepfake Image"
- Step 2: Enter title "Suspected deepfake profile photo", brief description
- Step 3: Upload `demo_assets/sample_images/test_face.jpg`
- Step 4: Click "Submit Complaint"
- Confirmation screen: Point out the **Case Number** (`VRD-2025-000006`) and the **SHA-256 hash** ("This is the cryptographic fingerprint that proves this exact file was submitted — it cannot be modified without the hash changing")
- Click "Copy Hash", paste in notes app to show it works

**Screen 3 — Investigator Dashboard (45 seconds)**
- Navigate to `/login`, log in as `inv1@veridact.local` / `demo1234`
- Dashboard loads: Show stats cards — "5 Active Cases, 3 Pending Analysis, 2 High Risk"
- "An investigator sees only their assigned cases"

**Screen 4 — Case Detail (30 seconds)**
- Click on the submitted case
- Show case detail: 4 tabs — Evidence, Notes, Custody Log, Reports
- "Notice the custody log already shows: Case Created, Evidence Uploaded"

**Screen 5 — AI Analysis (90 seconds)**
- Click on the evidence item
- Click "Analyze Evidence"
- While analysis runs: "We're running the SigLIP2 deep learning model — no GPU required, runs on CPU"
- Analysis result appears: Show **ConfidenceMeter** animating to score, **VerdictBadge** turning red/yellow
- Read explanation aloud: "The model detected inconsistent facial boundary artifacts characteristic of GAN-generated images."
- "This result — 0.87 confidence — is probabilistic. AI assists the investigator. It does not replace forensic judgment."

**Screen 6 — Forensic PDF Report (30 seconds)**
- Click "Generate Report"
- PDF downloads: Open it
- Show: Case header, evidence SHA-256 table, AI analysis results, custody log, disclaimer footer
- "This PDF has its own SHA-256 hash — stored in our database. Any modification to this file will be immediately detectable."

**Screen 7 — Chain of Custody + Citizen Tracking (15 seconds)**
- Click "Custody Log" tab: Show full chronological timeline
- Open new tab: Navigate to `/track/VRD-2025-000006`
- Show citizen-facing status: "Under Investigation"

---

### Judge-Friendly Technical Explanation

"The frontend is React with TypeScript, using Tailwind CSS and shadcn/ui for the dark forensic theme. The backend is FastAPI — Python's fastest async REST framework — with SQLite as the database, which means zero database server setup. We chose SQLite specifically for reliability in demo conditions. The AI layer uses Hugging Face's `transformers` library to run deepfake detection models locally on CPU. File integrity is guaranteed by SHA-256 hashing computed during upload streaming."

### Cost Explanation

"The total mandatory cost to run VERIDACT is zero. Every library is open-source. The AI models are free on Hugging Face. SQLite is public domain. There is no cloud hosting required, no API key required, no monthly subscription. A cyber bureau with a single laptop and an internet connection to download the model weights once can run this forever at zero cost."

### AI Explanation

"We want to be very clear: VERIDACT's AI is a triage tool, not a judge. It helps investigators decide which files to prioritize for manual review. Every analysis result includes a human-readable explanation, a confidence score between 0 and 1, and a fallback to 'inconclusive' when the model is uncertain. The report includes a legal disclaimer on every page. AI assists. Humans decide."

### False Positive/Negative Explanation

"No deepfake detection model is perfect. Our chosen model — SigLIP2 fine-tuned for deepfake detection — has strong accuracy on benchmark datasets, but real-world performance varies. High-quality deepfakes may score 'authentic.' Low-quality legitimate photos may score 'suspicious.' This is why the verdict is presented as a confidence score with explanation, not a binary decision. The investigator reviews the AI result alongside all other evidence. VERIDACT never presents AI output as ground truth."

### Future Scope Explanation

"Three things are ready to add after the hackathon: blockchain-anchored custody logs for immutable evidence chains, a REST API for direct evidence submission from other law enforcement systems, and GPU-accelerated inference for sub-second analysis at scale. The SQLAlchemy models are 100% database-agnostic — changing `DATABASE_URL` in `.env` migrates to PostgreSQL instantly."

---

## 10. Risk-Based Backup Plan

### If AI Model Fails During Demo

**Detection:** Analysis returns error, or model loading takes more than 60 seconds, or an exception is shown in terminal.

**Recovery:**
1. Open `.env` in a text editor (have it pre-opened)
2. Set `DEMO_MODE=true`
3. Restart uvicorn: `Ctrl+C`, then `uvicorn app.main:app --reload`
4. Analysis will now return pre-scripted demo results instantly
5. Tell judges: "We have a demo mode that shows pre-scripted analysis results to demonstrate the UI — the real model is also implemented and can be shown separately"

**Pre-condition:** Always start the demo with `DEMO_MODE=false` for authenticity, but have the `DEMO_MODE=true` `.env` edit ready to paste.

### If Backend Fails During Demo

**Detection:** Frontend shows "Could not connect to server" toast, or `axios` `ERR_CONNECTION_REFUSED` errors in browser console.

**Recovery:**
1. Open the terminal where uvicorn is running
2. If it crashed: `uvicorn app.main:app --reload` (takes 3–5 seconds)
3. If port conflict: `uvicorn app.main:app --reload --port 8001` (update `VITE_API_BASE_URL` to match)
4. If database corrupted: `python seed.py --reset` then restart uvicorn

**Pre-condition:** Keep a second terminal window open and pre-positioned, pre-typed with the restart command.

### If Database Fails During Demo

**Detection:** HTTP 500 errors on any API call, or "Database error" toast messages.

**Recovery:**
1. Stop uvicorn
2. Delete `backend/veridact.db`
3. Run `python seed.py --reset` (creates fresh DB with all demo data in < 5 seconds)
4. Restart uvicorn

**Pre-condition:** `seed.py --reset` must be tested and confirmed to work before the demo.

### If File Upload Fails During Demo

**Detection:** Submission wizard shows error on Step 4, or evidence is not saved.

**Recovery:**
1. Try a different demo file from `demo_assets/` (have 3–4 prepared)
2. Check that upload directories exist: `uploads/evidence/`, `uploads/heatmaps/`, `uploads/reports/`
3. Skip the live upload: Navigate directly to `/dashboard/cases` and use the pre-seeded demo case that already has evidence uploaded
4. Tell judges: "The case I'm showing was submitted earlier — we already have evidence analyzed for it"

**Pre-condition:** Seed data includes 5 complete cases with evidence already uploaded. Demo can skip live submission if needed.

### If PDF Generation Fails During Demo

**Detection:** "Could not generate report" toast, or download button produces error.

**Recovery:**
1. Open `demo_assets/sample_report.pdf` directly in PDF viewer
2. Show it to judges: "This is a pre-generated sample report. The generation endpoint is also live, but let me show you the report format here"
3. If time permits, fix the error (usually a missing data field in `pdf.py`)

**Pre-condition:** `demo_assets/sample_report.pdf` must be pre-generated and saved before demo day.

### If Internet Fails During Demo

**Detection:** Model download fails, or any external network request fails.

**Recovery:**
1. All models should be pre-downloaded before the demo venue
2. Set `HF_HUB_OFFLINE=true` in `.env` to prevent any download attempts
3. If models were not pre-cached: `DEMO_MODE=true` bypasses all model loading
4. The entire platform — including AI analysis in DEMO_MODE — works with zero internet

**Pre-condition:** Run `python -c "from app.services.ai.image_detector import load_model; load_model()"` before arriving at the demo venue.

### If Laptop is Slow

**Detection:** Model inference takes > 60 seconds per image; UI is laggy.

**Recovery:**
1. Switch to `DEMO_MODE=true` — all analysis returns instantly with no model loading
2. Close all other applications on the laptop
3. If frontend is slow: `npm run build` and serve the production build with `npx serve dist`

**Pre-condition:** Test the full demo on the demo laptop specifically, not just your development machine.

### If Demo Sample File Does Not Work

**Recovery:**
1. Have 3–4 backup sample files in `demo_assets/` in each category
2. If no uploaded file works: navigate directly to a pre-seeded evidence record that already has analysis results
3. Show the stored analysis result without triggering new analysis

### If Claude or AI Coding Tool Output Breaks Code

**Recovery:**
1. `git stash` immediately
2. Revert to the last working commit: `git checkout HEAD~1 -- <broken_file>`
3. Never let AI tools directly edit models, schemas, or constants without review
4. Keep Phase 0 commits clean — they are the recovery baseline

### If Merge Conflicts Happen

**Recovery:**
1. Identify the conflict file from `git status`
2. If conflict is in a shared file (`constants.py`, `App.tsx`): resolve with all team members together
3. If conflict is in an owned file: the owner resolves it alone
4. Never use `git merge --abort` carelessly — understand the conflict first
5. The safest strategy: backup the conflicting file, run `git checkout --theirs <file>` or `git checkout --ours <file>`, then manually re-apply your changes

### Emergency Demo Backup (Last Resort)

If everything fails:
1. Open `demo_assets/` folder and show pre-generated screenshots of every demo screen
2. Play the 2-minute pre-recorded screen recording of the demo
3. Use the GitHub repository to walk through the code architecture instead
4. Show the PDF report as a standalone document
5. Tell judges: "We have a live system ready to demo in a stable environment — we had infrastructure issues today, but the codebase is complete"

---

## 11. No Merge Conflict Strategy

### File Ownership Table

| Component Area | Owner | Files |
|---|---|---|
| Project structure and README | Person D | `README.md`, `.gitignore`, `docs/`, root-level configs |
| App routing (App.tsx) | Person D | `frontend/src/App.tsx` |
| Frontend layout components | Person A | `src/components/layout/AppLayout.tsx`, `PublicLayout.tsx`, `AuthLayout.tsx`, `Sidebar.tsx`, `TopNav.tsx` |
| LandingPage | Person A | `src/pages/LandingPage.tsx` |
| Auth pages (Login, Register) | Person A | `src/pages/LoginPage.tsx`, `RegisterPage.tsx` |
| Citizen pages (Submit, Track) | Person A | `src/pages/SubmitEvidencePage.tsx`, `TrackCasePage.tsx`, `TrackCaseResultPage.tsx` |
| Dashboard page | Person A | `src/pages/DashboardPage.tsx` |
| Case pages | Person A | `src/pages/CaseListPage.tsx`, `CaseDetailPage.tsx` |
| Evidence detail page | Person A | `src/pages/EvidenceDetailPage.tsx` |
| Report and analytics pages | Person A | `src/pages/ReportsPage.tsx`, `AnalyticsPage.tsx` |
| Admin pages | Person A + Person D | `src/pages/Admin*.tsx` |
| Shared UI components | Person A (UI/UX) | `src/components/ui/` |
| Evidence components | Person A | `src/components/evidence/` |
| Case components | Person A | `src/components/cases/` |
| Analytics components | Person A | `src/components/analytics/` |
| TypeScript types | Person A | `src/types/` (coordinate with Person B for schema matches) |
| React hooks | Person A | `src/hooks/` |
| Frontend services (API calls) | Person A | `src/services/` |
| Tailwind config and globals.css | Person A | `tailwind.config.ts`, `src/globals.css` |
| Database models | Person B | `backend/app/models/` |
| Pydantic schemas | Person B | `backend/app/schemas/` |
| FastAPI main and config | Person B | `backend/app/main.py`, `config.py`, `database.py` |
| Auth service and route | Person B | `app/services/auth_service.py`, `app/routes/auth.py` |
| Case service and route | Person B | `app/services/case_service.py`, `app/routes/cases.py` |
| Evidence service and route | Person B | `app/services/evidence_service.py`, `app/routes/evidence.py` |
| Custody service and route | Person B | `app/services/custody_service.py`, `app/routes/custody.py` |
| Admin route | Person B | `app/routes/admin.py` |
| Public route | Person B | `app/routes/public.py` |
| SHA-256 and file validation utils | Person B | `app/utils/hashing.py`, `app/utils/file_validation.py` |
| JWT security utils | Person B | `app/utils/security.py` |
| AI image detector | Person C | `app/services/ai/image_detector.py` |
| AI video detector | Person C | `app/services/ai/video_detector.py` |
| AI audio detector | Person C | `app/services/ai/audio_detector.py` |
| AI document detector | Person C | `app/services/ai/document_detector.py` |
| AI router | Person C | `app/services/ai/router.py` |
| Analysis service and route | Person C | `app/services/analysis_service.py`, `app/routes/analysis.py` |
| PDF utility | Person C | `app/utils/pdf.py` |
| Report service and route | Person C | `app/services/report_service.py`, `app/routes/reports.py` |
| Seed script | Person D | `backend/seed.py` (coordinate with all) |
| Seed data JSON | Person D | `backend/seed_data.json` |
| Demo assets | Person D | `demo_assets/` |
| Shared constants (backend) | Person B (primary), all | `backend/app/constants.py` — changes require team sync |
| Shared constants (frontend) | Person A (primary), all | `frontend/src/types/constants.ts` — changes require team sync |
| requirements.txt | Person B | `backend/requirements.txt` |
| package.json | Person A | `frontend/package.json` |

### Coordination Contracts

1. **API Contract First:** Person B defines all Pydantic response schemas before Person A writes any service call. Person A reads `backend/app/schemas/` before building `src/services/`.

2. **AnalysisResultData Shape Locked in Phase 2:** Person C defines the `AnalysisResultData` dataclass and the `AnalysisResultResponse` Pydantic schema before Person A builds `AnalysisResultCard.tsx`.

3. **Database Schema Freeze After Phase 2 Merge:** After all 7 SQLAlchemy models are merged into `dev`, no table names or column names change without an explicit team sync and approval. Additive nullable columns are permitted.

4. **Shared Types in One Place:** All TypeScript types that multiple pages use live in `src/types/`. No duplicating type definitions across page files.

5. **No Inline Styles:** All styling uses Tailwind CSS classes. No `style={{}}` attributes except for dynamically calculated chart colors via Recharts' `fill` prop.

6. **Route Names Are Sacred:** Once a backend route is implemented and used by the frontend, its URL path must never change without all team members' agreement. The same applies to DB table names and column names.

7. **Merge Backend Before Frontend Integration:** Every frontend service call must wait until the corresponding backend route is working and merged into `dev`. Person A builds pages with static mock data until the API is ready, then wires it in.

8. **One Person Edits `App.tsx`:** Only Person D adds routes to `App.tsx`. Person A creates page files; Person D imports them into the router.

---

## 12. Final Checklist

### Product Checklist
- [ ] Citizen can submit evidence without creating an account
- [ ] Case number generated in `VRD-YYYY-NNNNNN` format
- [ ] SHA-256 hash displayed on submission confirmation
- [ ] Citizen can track case status with case number
- [ ] Investigator can view all assigned cases
- [ ] Investigator can analyze evidence and see AI result
- [ ] Investigator can generate and download PDF report
- [ ] Chain-of-custody log shows all actions on a case
- [ ] Supervisor/admin can see system-wide analytics
- [ ] Admin can manage user accounts

### Frontend Checklist
- [ ] All 16 routes load without errors
- [ ] All pages render with correct data from seed database
- [ ] `ProtectedRoute` redirects unauthenticated users
- [ ] `RoleRoute` redirects users with wrong role
- [ ] `ConfidenceMeter` animates from 0 to score on mount
- [ ] `VerdictBadge` shows correct color for each verdict
- [ ] `CustodyTimeline` shows events in chronological order
- [ ] `FileUploadBox` validates file type and size
- [ ] `SHAHashDisplay` copy button works
- [ ] Toast notifications appear for all key events
- [ ] Empty states show for all empty lists
- [ ] Loading skeletons show during data fetch
- [ ] Error states show with retry buttons
- [ ] Responsive at 375px, 768px, 1440px

### Backend Checklist
- [ ] `GET /api/health` returns 200 OK
- [ ] All 8 route groups registered and show in `/docs`
- [ ] Auth endpoints work (register, login, me, logout)
- [ ] Case CRUD endpoints work with role-based filtering
- [ ] Evidence upload with SHA-256 computation works
- [ ] File type validation rejects .exe and oversized files
- [ ] Analysis endpoint returns result within timeout
- [ ] `DEMO_MODE=true` bypasses model completely
- [ ] Report generation produces valid PDF
- [ ] Custody logs created for all key actions
- [ ] Admin analytics endpoint returns aggregated data
- [ ] Public case tracking endpoint works

### Database Checklist
- [ ] All 7 tables created on startup
- [ ] `python seed.py` creates all demo data
- [ ] `python seed.py --reset` recreates cleanly in < 5 seconds
- [ ] Custody logs are append-only (no updates or deletes)
- [ ] SHA-256 hashes stored for both evidence and reports
- [ ] UUID primary keys used throughout
- [ ] Foreign key constraints enabled via PRAGMA

### AI Checklist
- [ ] Image deepfake detector returns result for a JPEG
- [ ] Video detector samples 10 frames and returns aggregated result
- [ ] Audio heuristic detector returns result for an MP3
- [ ] Document detector returns metadata flags for a PDF
- [ ] `AnalysisResultData` dataclass returned by all detectors
- [ ] Hash-based fallback returns when model is unavailable
- [ ] `DEMO_MODE=true` returns pre-scripted result instantly
- [ ] Fallback results visually flagged in UI
- [ ] Custody logs written for both `analysis_started` and `analysis_completed`
- [ ] Image deepfake model pre-cached in `~/.cache/huggingface/`
- [ ] `HF_HUB_OFFLINE=true` prevents download attempts during demo

### UI Checklist
- [ ] Dark forensic theme applied (slate-950 background, cyan-400 accent)
- [ ] Inter font for body text
- [ ] IBM Plex Mono (or system monospace) for SHA-256 hash displays
- [ ] Consistent Tailwind color tokens — no hardcoded hex values in components
- [ ] shadcn/ui components used for Button, Card, Dialog, Table, Badge, Toast
- [ ] Framer Motion animations on landing page hero and ConfidenceMeter
- [ ] Lucide icons used consistently throughout
- [ ] All buttons have loading states for async actions

### Security Checklist
- [ ] Passwords bcrypt-hashed at cost factor 12
- [ ] JWT secret read from `.env` — never hardcoded
- [ ] `password_hash` never returned in any API response
- [ ] MIME type validated server-side with `python-magic`
- [ ] Stored filenames are always UUIDs — never user-provided names
- [ ] All protected routes enforce role check via `require_roles` dependency
- [ ] Investigator access to unassigned cases returns 403
- [ ] CORS origin restricted to `http://localhost:5173`
- [ ] SQL injection prevented by SQLAlchemy ORM (parameterized queries)

### Report Checklist
- [ ] PDF generated using ReportLab (free, no system dependencies)
- [ ] PDF contains VERIDACT header
- [ ] PDF contains case number and metadata
- [ ] PDF contains evidence table with SHA-256 hashes
- [ ] PDF contains AI analysis results with confidence scores
- [ ] PDF contains full chain-of-custody log
- [ ] PDF contains legal disclaimer footer
- [ ] PDF SHA-256 stored in `reports` table
- [ ] PDF download requires authentication
- [ ] `demo_assets/sample_report.pdf` pre-generated and saved
- [ ] Report download creates `file_downloaded` custody log entry

### Demo Checklist
- [ ] Full 5-minute demo rehearsed at least twice
- [ ] Demo completes from cold start in < 5 minutes
- [ ] `DEMO_MODE=true` tested as backup mode
- [ ] `HF_HUB_OFFLINE=true` tested with pre-cached model
- [ ] `python seed.py --reset` tested (< 5 seconds)
- [ ] Both `uvicorn` and `npm run dev` start cleanly after reset
- [ ] All 6 demo user logins verified
- [ ] Sample files in `demo_assets/` confirmed to work
- [ ] `demo_assets/sample_report.pdf` opened and verified
- [ ] Backup screenshots of all key screens saved
- [ ] 2-minute screen recording saved as last resort

### Documentation Checklist
- [ ] `README.md` has final quickstart commands
- [ ] `.env.example` matches actual required variables
- [ ] All 6 documents in `docs/` folder
- [ ] `seed.py` prints login credentials to console
- [ ] Code comments on all AI inference functions explaining fallback logic
- [ ] `requirements.txt` has all dependencies pinned or ranged

---

## 13. Cross-Document Consistency Check

| Item | Value Used in Document 06 | Must Match | Status |
|---|---|---|---|
| Project name | VERIDACT | Doc 01 Section 1, Doc 02 Section 1, Doc 03 Section 1, Doc 04 Section 1, Doc 05 Section 1 | ✅ Consistent |
| Tagline | "See Through the Fake. Secure the Truth." | Doc 01 cover, Doc 02 cover, Doc 03 cover, Doc 04 cover, Doc 05 cover | ✅ Consistent |
| User roles | super_admin, supervisor, investigator, citizen, api_partner | Doc 01 Section 4, Doc 02 Section 9, Doc 05 Table users.role | ✅ Consistent |
| Core features | Citizen submission, case management, evidence upload, SHA-256 hashing, AI analysis, chain-of-custody, PDF reports, citizen tracking, analytics | Doc 01 Section 5 and 6 | ✅ Consistent |
| Frontend routes | `/`, `/login`, `/register`, `/submit`, `/track`, `/track/:caseNumber`, `/dashboard`, `/dashboard/cases`, `/dashboard/cases/:caseId`, `/dashboard/cases/:caseId/evidence/:evidenceId`, `/dashboard/reports`, `/dashboard/analytics`, `/admin`, `/admin/users`, `/admin/custody`, `/admin/settings` | Doc 02 Section 6 (Pages table), Doc 03 Section 3 | ✅ Consistent |
| Backend APIs | `/api/auth/*`, `/api/cases/*`, `/api/evidence/*`, `/api/analysis/*`, `/api/reports/*`, `/api/custody/*`, `/api/admin/*`, `/api/public/*`, `/api/health` | Doc 02 Section 5, Section 7 | ✅ Consistent |
| Database tables | users, cases, evidence, analysis_results, custody_logs, reports, case_notes | Doc 05 Section 3, Section 2 entity list | ✅ Consistent |
| AI tools/models | prithivMLmods/Deepfake-Detect-Siglip2 (primary), Wvolf/ViT_Deepfake_Detection (fallback), librosa heuristic (audio), PyMuPDF+pytesseract+ELA (documents), OpenCV frame sampling (video) | Doc 02 Section 3 | ✅ Consistent |
| Tech stack (frontend) | React 18 + Vite 5 + TypeScript 5, Tailwind CSS 3, shadcn/ui, React Router v6, Axios, Recharts, Framer Motion, React Hook Form + Zod, lucide-react | Doc 02 Section 2 (Frontend Stack) | ✅ Consistent |
| Tech stack (backend) | Python 3.11+, FastAPI 0.110+, Uvicorn, SQLAlchemy 2.0, SQLite, Pydantic v2, python-jose, passlib[bcrypt], ReportLab, python-multipart, transformers, PyTorch CPU, OpenCV, librosa, pytesseract, PyMuPDF | Doc 02 Section 2 (Backend Stack, AI/ML Libraries) | ✅ Consistent |
| UI theme | Dark forensic: slate-950 background, slate-900 cards, cyan-400 accent, emerald-400 success, red-500 danger, Inter body font, IBM Plex Mono for hashes | Doc 04 Section 5 (Final Recommended Design System) | ✅ Consistent |
| Implementation phases | Phase 0–7 matching feature delivery order from Doc 01 feature list and Doc 02 architecture | Doc 01 Section 12, Doc 02 Section 12 | ✅ Consistent |
| Localhost-first constraint | Frontend on localhost:5173, backend on localhost:8000, SQLite file at backend/veridact.db, uploads/ folder local | Doc 01 Section 1 (Localhost MVP Scope), Doc 02 Section 1 | ✅ Consistent |
| Free-cost constraint | No paid APIs mandatory; all tools open-source or free-tier; optional keys clearly marked | Doc 01 Section 3 (Non-Goals), Doc 02 Section 2 (all "Free: Yes" entries) | ✅ Consistent |
| Verdict values | authentic, suspicious, likely_fake, inconclusive | Doc 01 Section 7, Doc 02 Section 3, Doc 05 analysis_results table | ✅ Consistent |
| Case number format | VRD-YYYY-NNNNNN | Doc 01 (CASE_NUMBER_PREFIX=VRD), Doc 05 cases table (case_number field) | ✅ Consistent |
| Evidence file types | image: .jpg/.jpeg/.png/.gif/.bmp/.webp; video: .mp4/.avi/.mov/.mkv; audio: .mp3/.wav/.aac/.ogg/.flac; document: .pdf/.docx/.xlsx/.txt | Doc 01 Section 12 (ALLOWED_EXTENSIONS), Doc 02 Section 9 | ✅ Consistent |
| Demo users | admin@veridact.local, supervisor@veridact.local, inv1@veridact.local, inv2@veridact.local, citizen1@veridact.local, citizen2@veridact.local — all password demo1234 | Doc 01 Section 12 (Prompt PRD-03), Doc 02 Section 12 (Prompt TRD-03) | ✅ Consistent |
| JWT configuration | HS256 algorithm, 8-hour expiry, payload: sub (user_id), role, exp | Doc 02 Section 9 (JWT Security) | ✅ Consistent |
| Folder structure | veridact/frontend/, veridact/backend/, veridact/uploads/, veridact/demo_assets/, veridact/docs/ | Doc 01 Section 12 (Prompt PRD-01), Doc 02 Section 6 and 7 | ✅ Consistent |

---

## 14. Free Cost Verification

| Tool / Model / API | Purpose | Free or Paid | Localhost Compatible | Requires API Key | Free Alternative | MVP or Future |
|---|---|---|---|---|---|---|
| React 18 + Vite 5 | Frontend framework + build tool | Free (MIT) | Yes | No | Next.js (heavier) | MVP |
| TypeScript 5 | Type safety | Free (Apache 2.0) | Yes | No | JavaScript (no types) | MVP |
| Tailwind CSS 3 | Utility-first CSS | Free (MIT) | Yes | No | CSS Modules | MVP |
| shadcn/ui | Accessible UI components | Free (MIT) | Yes | No | Radix UI (lower level) | MVP |
| React Router v6 | Client-side routing | Free (MIT) | Yes | No | TanStack Router | MVP |
| Axios | HTTP client | Free (MIT) | Yes | No | native fetch() | MVP |
| Recharts | Analytics charts | Free (MIT) | Yes | No | Chart.js | MVP |
| Framer Motion | UI animations | Free (MIT) | Yes | No | React Spring | MVP |
| React Hook Form + Zod | Form state + validation | Free (MIT) | Yes | No | Formik + Yup | MVP |
| lucide-react | Icon library | Free (ISC) | Yes | No | Heroicons | MVP |
| Python 3.11 | Backend language | Free (PSF) | Yes | No | Node.js (worse AI ecosystem) | MVP |
| FastAPI 0.110+ | REST API framework | Free (MIT) | Yes | No | Flask, Django | MVP |
| Uvicorn | ASGI server | Free (BSD) | Yes | No | Gunicorn | MVP |
| SQLAlchemy 2.0 | ORM | Free (MIT) | Yes | No | SQLModel, Tortoise ORM | MVP |
| SQLite | Database | Free (Public Domain) | Yes | No | PostgreSQL (more setup) | MVP |
| Pydantic v2 | Request/response validation | Free (MIT) | Yes | No | Marshmallow | MVP |
| python-jose | JWT creation/verification | Free (MIT) | Yes | No | PyJWT | MVP |
| passlib[bcrypt] | Password hashing | Free (BSD) | Yes | No | argon2-cffi | MVP |
| ReportLab | PDF generation | Free (BSD) | Yes | No | WeasyPrint, FPDF2 | MVP |
| python-multipart | File upload parsing | Free (Apache) | Yes | No | — (required by FastAPI) | MVP |
| transformers (Hugging Face) | AI model loading | Free (Apache 2.0) | Yes | No | — | MVP |
| PyTorch CPU | Deep learning inference | Free (BSD) | Yes (CPU) | No | TensorFlow (heavier) | MVP |
| prithivMLmods/Deepfake-Detect-Siglip2 | Image deepfake detection | Free (Apache 2.0) | Yes (CPU) | No | Wvolf/ViT_Deepfake_Detection | MVP |
| Wvolf/ViT_Deepfake_Detection | Image deepfake fallback model | Free | Yes (CPU) | No | Hash-based deterministic fallback | MVP |
| OpenCV (headless) | Video frame extraction | Free (Apache 2.0) | Yes | No | moviepy | MVP |
| Pillow | Image preprocessing + ELA | Free (HPND) | Yes | No | — | MVP |
| librosa | Audio MFCC feature extraction | Free (ISC) | Yes | No | — | MVP |
| pytesseract | OCR wrapper | Free (Apache 2.0) | Yes | No | — | MVP |
| tesseract-ocr | OCR system binary | Free (Apache 2.0) | Yes | No | — | MVP |
| PyMuPDF (fitz) | PDF metadata extraction | Free (AGPL) | Yes | No | pdfminer.six | MVP |
| python-docx | DOCX metadata extraction | Free (MIT) | Yes | No | — | MVP |
| python-magic | MIME type detection | Free (MIT) | Yes | No | filetype (Python) | MVP |
| aiofiles | Async file operations | Free (Apache 2.0) | Yes | No | — | MVP |
| pytorch-grad-cam | Heatmap visualization | Free (MIT) | Yes | No | — | Future |
| microsoft/wavlm-base | Advanced audio clone detection | Free (MIT) | Yes (heavy) | No | librosa heuristic (MVP) | Future |
| HF_TOKEN_OPTIONAL | Access to gated HF models | Free tier | Yes | Yes (optional) | Not needed — our models ungated | Future |
| GEMINI_API_KEY_OPTIONAL | LLM-generated report narrative | Free tier has limits | No (cloud API) | Yes (optional) | ReportLab template text (MVP) | Future |
| Vercel / Render / Railway | Cloud hosting | Free tier available | N/A | No | localhost (MVP) | Future |
| PostgreSQL | Production database | Free (self-hosted) | Yes | No | SQLite (MVP) | Future |

**Summary:** All 34 MVP dependencies are free and localhost-compatible. Zero mandatory API keys. Two optional keys (`HF_TOKEN_OPTIONAL`, `GEMINI_API_KEY_OPTIONAL`) are clearly marked as future scope and not required for the hackathon demo.

---

## 15. Final MVP Recommendation

### What to Build First

Build in strict phase order: Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7.

Do not skip phases. Each phase creates dependencies the next phase relies on. The most common hackathon mistake is jumping directly to "the cool AI part" before the file upload pipeline is solid. The AI layer reads files from disk. If the upload pipeline is broken, AI cannot be tested.

The single highest-ROI task is completing Phase 3 (auth) cleanly. Once authentication works, every subsequent feature can be tested realistically with real user roles.

### What to Skip

If time runs short, skip in this order:

1. Skip `AdminSettingsPage.tsx` — it has no functional impact on the demo
2. Skip `AnalyticsPage.tsx` detailed charts — seed data stats shown on the Dashboard page are sufficient
3. Skip `video_detector.py` full implementation — use the image detector with a single sampled frame and label it as "Video Frame Analysis"
4. Skip `Wvolf/ViT_Deepfake_Detection` fallback model — the hash-based deterministic fallback is sufficient
5. Skip heatmap generation (pytorch-grad-cam) — the `heatmap_path` can be null; `HeatmapViewer.tsx` shows a placeholder message
6. Skip rate limiting implementation — it has no impact on a localhost demo
7. Skip JWT refresh tokens — 8-hour expiry is sufficient for a demo session

Do not skip: citizen submission wizard, SHA-256 display, AI analysis result with confidence score, PDF report generation, chain-of-custody log. These are the core demo moments.

### Which AI Feature to Implement First

**Image deepfake detection** (`image_detector.py`) first. It is the most visually compelling, has the clearest user story, uses the highest-quality freely available model, and is the fastest to implement.

After image detection is working, add audio detection (`audio_detector.py` with librosa heuristic) — it is the fastest to implement after image because it requires no model download.

Document detection (`document_detector.py`) third — it has the most code but no model download.

Video detection (`video_detector.py`) last — it reuses `image_detector.py` internally and adds only frame sampling logic.

### Which Fallback to Keep Ready

**Always keep `DEMO_MODE=true` ready as the nuclear fallback.** Test it before every demo. It should be a 10-second fix (one line in `.env`, restart uvicorn) that restores full demo functionality regardless of what else is broken.

Pre-generate `demo_assets/sample_report.pdf` with real seed data before the demo. This is your backup for any PDF generation failure.

### How to Demo Locally

1. Start backend: `cd backend && uvicorn app.main:app --reload`
2. Start frontend: `cd frontend && npm run dev`
3. Open `http://localhost:5173/` in Chrome
4. Demo from a local browser — no internet needed after setup
5. Keep two browser tabs open: one for the citizen view (no login), one for the investigator view (logged in)
6. Keep terminal visible during demo to show backend activity — it builds confidence

### How to Explain Cost to Judges

"Our total mandatory infrastructure cost is zero. We have deliberately chosen free, open-source tools at every layer. The frontend uses React and Tailwind — both MIT licensed. The backend uses FastAPI and SQLite — both free. The AI uses open models from Hugging Face — no API key required, downloaded once and cached locally. A law enforcement agency can deploy this on a single laptop they already own, at no additional cost. Scaling to cloud is a one-line change in the environment config."

### How to Explain False Positives and False Negatives

"We frame this clearly in both the UI and the PDF report. When an analysis returns 'Likely Fake' with 87% confidence, it does not mean the image is fake. It means the model detected patterns consistent with AI generation in 87% of its internal checks. The remaining 13% represents uncertainty. A high-quality deepfake may fool the model. A low-quality original photo may trigger false suspicion.

This is why VERIDACT is a triage tool, not a verdict tool. It helps investigators prioritize their review queue. The human investigator sees the confidence score, the explanation, and the raw model output — and makes the final judgment. No AI result in VERIDACT is ever presented as ground truth. The PDF report includes a legal disclaimer on every page that explicitly states this."

### How to Explain That AI Assists but Does Not Replace Human Judgment

"Our design philosophy matches how courts treat forensic science: AI analysis is one tool among many, with documented limitations and an explicit chain of custody for every piece of evidence it touches. The custody log in VERIDACT records not just what happened to the evidence, but what model analyzed it, what version was used, and whether the result was from real inference or a fallback mode. A defense attorney reviewing this report can see exactly how the analysis was performed and challenge it appropriately. This transparency is by design."

---

## 16. Master Antigravity Megaprompt Sequence

The following prompts are designed to be copy-pasted directly into Antigravity in order. Each prompt builds on the previous one. Never run a prompt that depends on a previous phase before that phase is complete and tested.

---

### PHASE 0 PROMPTS

---

### AG-00-A: Initialize Project Structure

**Goal:** Create the complete VERIDACT project folder structure, README, .gitignore, and documentation skeleton.

**Files/Folders to Create:**
```
veridact/
├── README.md
├── .gitignore
├── docs/
│   ├── 01_PRODUCT_REQUIREMENTS_DOCUMENT.md (placeholder)
│   ├── 02_TECHNICAL_REQUIREMENTS_DOCUMENT.md (placeholder)
│   ├── 03_APP_FLOW_AND_NAVIGATION.md (placeholder)
│   ├── 04_UI_UX_DESIGN_BRIEF.md (placeholder)
│   ├── 05_BACKEND_SCHEMA_AND_DATABASE_DESIGN.md (placeholder)
│   └── 06_IMPLEMENTATION_PLAN.md (placeholder)
├── uploads/
│   ├── evidence/.gitkeep
│   ├── heatmaps/.gitkeep
│   └── reports/.gitkeep
└── demo_assets/
    ├── sample_images/.gitkeep
    ├── sample_videos/.gitkeep
    ├── sample_audio/.gitkeep
    └── sample_documents/.gitkeep
```

**Files Not to Touch:** Nothing (fresh project).

**Exact Task:**
1. Create the full folder hierarchy above
2. Create `README.md` with: project title "VERIDACT — AI Forensic Evidence Platform", tagline "See Through the Fake. Secure the Truth.", a Tech Stack section (React, FastAPI, SQLite, Tailwind, shadcn/ui, Hugging Face), a Quickstart section (placeholder commands for backend and frontend), a Features section listing all 10 core features from the PRD, a User Roles section (super_admin, supervisor, investigator, citizen), and a note that full documentation is in `/docs/`
3. Create `.gitignore` that excludes: `__pycache__/`, `*.pyc`, `.env`, `node_modules/`, `dist/`, `*.db`, `uploads/evidence/*`, `uploads/reports/*`, `uploads/heatmaps/*`, `.venv/`, `venv/`, `*.egg-info/`, `.DS_Store`, `Thumbs.db`
4. Add `.gitkeep` files to all empty directories
5. Create `docs/` placeholder files with title and "See [filename] for content" note

**Constraints:**
- Do not create any frontend or backend application code
- This commit is structure and documentation only
- All paths must use forward slashes in documentation (cross-platform)

**Acceptance Criteria:**
- Running `find veridact -type f` shows all expected files
- `.gitignore` correctly ignores `.env` and `.db` files when tested with `git status`
- `README.md` renders without broken links

**Testing Instructions:**
```
cd veridact
git init
git add .
git status  # Verify .env would be ignored
```

**Commit Message:** `chore: initialize veridact project structure and documentation skeleton`

---

### AG-00-B: Create Shared Constants

**Goal:** Create the shared constants files for both backend and frontend that define all enumerations used throughout the application.

**Files to Create:**
- `backend/app/constants.py`
- `frontend/src/types/constants.ts`

**Files Not to Touch:** Everything else (nothing exists yet except the folder structure).

**Exact Task:**

Create `backend/app/constants.py` with exactly these values:
```python
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
```

Create `frontend/src/types/constants.ts` with equivalent TypeScript:
```typescript
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
```

**Constraints:**
- Values must exactly match between Python and TypeScript files
- Do not import these into any other file yet
- No business logic in these files — pure constant definitions

**Acceptance Criteria:**
- `python -c "from app.constants import VERDICT_VALUES; print(VERDICT_VALUES)"` outputs the correct list
- TypeScript file has zero type errors when imported

**Commit Message:** `feat: add shared constants for roles, statuses, evidence types, and verdict values`

---

### PHASE 1 PROMPTS

---

### AG-01-A: Initialize React Frontend Skeleton

**Goal:** Set up the complete React + Vite + TypeScript frontend with all dependencies installed, Tailwind configured with VERIDACT dark theme tokens, shadcn/ui initialized, and all 16 pages as placeholder components.

**Files/Folders to Create:**
```
frontend/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── .env.example
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx (all routes, placeholder pages imported)
    ├── globals.css (Tailwind + shadcn/ui CSS variables for dark theme)
    ├── types/ (all 8 type files — see AG-01-B for content)
    ├── hooks/ (5 stub hook files)
    ├── services/ (7 stub service files)
    ├── routes/
    │   ├── ProtectedRoute.tsx
    │   └── RoleRoute.tsx
    ├── components/layout/
    │   ├── AppLayout.tsx
    │   ├── PublicLayout.tsx
    │   ├── AuthLayout.tsx
    │   ├── Sidebar.tsx
    │   └── TopNav.tsx
    └── pages/ (16 placeholder page files)
```

**Files Not to Touch:** `backend/`, `docs/`, root-level files.

**Exact Task:**
1. Initialize: `npm create vite@latest frontend -- --template react-ts` (inside `veridact/`)
2. Install dependencies: `cd frontend && npm install tailwindcss postcss autoprefixer @tailwindcss/forms axios react-router-dom framer-motion recharts react-hook-form zod @hookform/resolvers lucide-react clsx class-variance-authority`
3. Install shadcn/ui: `npx shadcn-ui@latest init` — choose: TypeScript yes, Slate color, default.css style, globals.css path, no RSC
4. Add shadcn components: `npx shadcn-ui@latest add button card input select badge dialog table toast avatar dropdown-menu progress separator sheet tabs`
5. Configure `tailwind.config.ts` with VERIDACT theme tokens:
   - Extend colors with named tokens: `background: 'hsl(var(--background))'`, `foreground: 'hsl(var(--foreground))'` etc. from shadcn default
   - Add custom: `surface: '#0F172A'`, `border-subtle: '#1E293B'`, `accent-cyan: '#22D3EE'`, `verdict-authentic: '#34D399'`, `verdict-suspicious: '#FACC15'`, `verdict-fake: '#EF4444'`, `verdict-inconclusive: '#94A3B8'`
6. Update `globals.css` to set dark mode: set `--background` to `222.2 84% 4.9%` (slate-950), `--card` to `222.2 47.4% 11.2%` (slate-900), `--primary` to `188.7 95.5% 52.4%` (cyan-400)
7. Create `App.tsx` with `<BrowserRouter>` wrapping all routes. Define all 16 routes using the route table from Phase 1. Use `PublicLayout` for public routes, `AppLayout` (wrapped in `ProtectedRoute`) for authenticated routes, and `RoleRoute` for admin routes.
8. Create all 16 pages as minimal skeleton components: each returns a `<div className="p-6"><h1 className="text-2xl font-bold">PageName (placeholder)</h1></div>`
9. Build basic layout shells: `AppLayout` = sidebar + topnav + `<main>` content area; `PublicLayout` = minimal header + `<main>` + footer; `AuthLayout` = full-screen centered card
10. Build `Sidebar.tsx` with hardcoded nav items (role filtering to be wired in Phase 3); build `TopNav.tsx` with user avatar placeholder
11. Create `ProtectedRoute.tsx` that checks `localStorage.getItem('veridact_token')` — if null, redirect to `/login`; for now, mock user as `{role: 'investigator'}` if token exists
12. Create `RoleRoute.tsx` that checks if the mock user has the required role; redirect to `/dashboard` if not
13. Create stub service files: `apiClient.ts` with Axios instance (`baseURL: import.meta.env.VITE_API_BASE_URL`), stub `.defaults.headers.common['Authorization']` interceptor (to be wired in Phase 3)
14. Create `.env.example` with `VITE_API_BASE_URL=http://localhost:8000/api` and `VITE_APP_NAME=VERIDACT`

**Constraints:**
- Do not make any backend API calls yet — all services return stub data
- `useAuth.ts` must return `{user: null, isAuthenticated: false, login: async () => {}, logout: () => {}}` for now
- No business logic in any component — strictly layout and navigation
- Must use TypeScript — no `any` types
- All colors from Tailwind/shadcn CSS variables — no hardcoded hex values in component files

**Acceptance Criteria:**
- `npm run dev` starts on `http://localhost:5173/` without TypeScript errors or console errors
- All 16 routes are accessible (each shows its placeholder heading)
- Layout: public pages show PublicLayout header; `/dashboard` shows AppLayout sidebar
- `ProtectedRoute` redirects `/dashboard` to `/login` when `localStorage` has no token
- After manually setting `localStorage.setItem('veridact_token', 'test')`, `/dashboard` loads
- No TypeScript errors on `npm run build`

**Testing Instructions:**
```
cd frontend
npm run dev
# Open http://localhost:5173/ — verify landing page loads
# Open http://localhost:5173/login — verify login page loads
# Open http://localhost:5173/dashboard — verify redirect to /login
# In browser console: localStorage.setItem('veridact_token', 'test')
# Open http://localhost:5173/dashboard — verify dashboard placeholder loads
# npm run build — verify no TypeScript errors
```

**After changes, modified files summary:** `frontend/src/App.tsx`, `frontend/src/globals.css`, `frontend/tailwind.config.ts`, `frontend/src/pages/` (16 files), `frontend/src/components/layout/` (5 files), `frontend/src/routes/` (2 files), `frontend/src/services/apiClient.ts`

**Commit Message:** `feat: initialize react frontend skeleton with routing, layout, and all placeholder pages`

---

### AG-01-B: Create TypeScript Type System

**Goal:** Create all TypeScript type definition files that match the database schema from Document 05 and the API schemas from Document 02.

**Files to Create:**
```
frontend/src/types/
├── user.types.ts
├── case.types.ts
├── evidence.types.ts
├── analysis.types.ts
├── custody.types.ts
├── report.types.ts
├── api.types.ts
└── index.ts (re-exports all types)
```

**Files Not to Touch:** Anything in `components/`, `pages/`, `services/`, `hooks/`, or `App.tsx`.

**Exact Task:**

Create `user.types.ts`:
```typescript
export interface User {
  id: string; email: string; name: string; role: UserRole;
  organization: string | null; is_active: boolean; created_at: string;
}
export interface AuthState {
  user: User | null; isAuthenticated: boolean; token: string | null;
}
// Import UserRole from constants.ts
```

Create `case.types.ts`:
```typescript
export interface Case {
  id: string; case_number: string; title: string; description: string;
  complaint_type: ComplaintType; priority: PriorityLevel; status: CaseStatus;
  contact_email: string | null; contact_phone: string | null;
  location: string | null; submitter_id: string | null;
  assigned_to: string | null; created_at: string; updated_at: string;
}
export interface CaseDetail extends Case {
  evidence: Evidence[]; notes: CaseNote[]; analysis_summary: AnalysisResult[];
}
export interface CaseNote {
  id: string; case_id: string; author_id: string; content: string;
  is_public: boolean; created_at: string;
}
```

Create `evidence.types.ts`:
```typescript
export interface Evidence {
  id: string; case_id: string; original_filename: string;
  stored_filename: string; file_type: EvidenceType; mime_type: string;
  file_size: number; sha256_hash: string; upload_status: string;
  uploaded_by: string | null; created_at: string;
  analysis_result?: AnalysisResult;
}
```

Create `analysis.types.ts`:
```typescript
export interface AnalysisResult {
  id: string; evidence_id: string; status: AnalysisStatus;
  confidence_score: number | null; verdict: Verdict | null;
  explanation: string | null; model_used: string | null;
  model_version: string | null; heatmap_path: string | null;
  raw_output: Record<string, unknown> | null;
  created_at: string; analyzed_at: string | null;
}
```

Create `custody.types.ts`:
```typescript
export interface CustodyLog {
  id: string; case_id: string; evidence_id: string | null;
  action: CustodyAction; performed_by_id: string | null;
  performer_name: string | null; ip_address: string | null;
  notes: string | null; timestamp: string;
}
```

Create `report.types.ts`:
```typescript
export interface Report {
  id: string; case_id: string; report_type: string;
  file_path: string; sha256_hash: string; generated_by: string;
  generated_at: string;
}
```

Create `api.types.ts`:
```typescript
export interface PaginatedResponse<T> {
  items: T[]; total: number; page: number; limit: number;
}
export interface ApiError {
  detail: string; error_code?: string; timestamp?: string;
}
export interface ApiResponse<T> {
  data?: T; error?: ApiError; status: number;
}
```

Create `index.ts` that re-exports everything from all type files.

**Constraints:**
- All `CaseStatus`, `UserRole`, `Verdict`, `EvidenceType`, `ComplaintType`, `PriorityLevel`, `AnalysisStatus`, `CustodyAction` types must be imported from `./constants` (not redefined)
- All interface fields must match the database column names from Document 05 exactly
- Use `string` for all date fields (ISO 8601 strings from JSON)

**Acceptance Criteria:**
- `import { User, Case, Evidence, AnalysisResult, CustodyLog } from '@/types'` succeeds without errors
- `npm run build` has zero TypeScript errors from type files

**Commit Message:** `feat: create typescript type system matching database schema and api contracts`

---

### PHASE 2 PROMPTS

---

### AG-02-A: Initialize FastAPI Backend

**Goal:** Set up the complete FastAPI backend skeleton with all models, schemas, and a working health endpoint. No business logic yet.

**Files/Folders to Create:**
```
backend/
├── requirements.txt
├── .env.example
├── run.py
└── app/
    ├── __init__.py
    ├── main.py
    ├── config.py
    ├── database.py
    ├── constants.py (copy from AG-00-B)
    ├── models/__init__.py
    ├── schemas/__init__.py
    ├── routes/__init__.py
    ├── services/__init__.py
    ├── services/ai/__init__.py
    └── utils/__init__.py
```

**Files Not to Touch:** `frontend/`, `docs/`, root-level files.

**Exact Task:**
1. Create `requirements.txt` with pinned versions:
```
fastapi>=0.110.0
uvicorn[standard]>=0.29.0
sqlalchemy>=2.0.0
pydantic[email]>=2.0.0
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
python-multipart>=0.0.9
aiofiles>=23.0.0
reportlab>=4.1.0
pymupdf>=1.24.0
python-docx>=1.1.0
Pillow>=10.3.0
python-magic-bin>=0.4.14
requests>=2.31.0
transformers>=4.40.0
numpy>=1.26.0
librosa>=0.10.0
pytesseract>=0.3.10
opencv-python-headless>=4.9.0
```
2. Create `app/database.py` with: SQLite engine (`sqlite:///./veridact.db`), WAL mode pragma, foreign keys pragma, `SessionLocal`, `Base`, `get_db()` dependency
3. Create `app/config.py` reading all variables from Document 06 Section 6 `.env.example` using `os.getenv()` with defaults
4. Create `app/main.py` with: CORS middleware (`allow_origins=["http://localhost:5173"]`, `allow_methods=["*"]`, `allow_headers=["*"]`, `allow_credentials=True`), router includes (all 8 routers from Section 7 of Document 02), startup event that calls `Base.metadata.create_all(bind=engine)` and creates upload directories if missing, `GET /api/health` returning `{"status": "ok", "version": "1.0.0", "timestamp": datetime.utcnow().isoformat()}`
5. Create `run.py` with: `uvicorn.run("app.main:app", host=config.HOST, port=config.PORT, reload=True)`
6. Create all stub route files (8 files) — each returns `{"message": "not implemented"}` for all endpoints except `auth.py` which will have a real health-adjacent stub
7. Create `.env.example` exactly as shown in Section 6 of this document

**Constraints:**
- Do not implement any route handler logic except `/api/health`
- All routes must be registered (show up in `/docs`) even as stubs
- `create_all()` must not fail even if some models don't exist yet

**Acceptance Criteria:**
- `uvicorn app.main:app --reload` starts without errors
- `GET http://localhost:8000/api/health` returns 200 with `{"status": "ok", ...}`
- `http://localhost:8000/docs` shows all 8 route groups
- No Python import errors

**Testing Instructions:**
```bash
cd backend
python -m venv .venv
# Activate: .venv\Scripts\activate (Windows) or source .venv/bin/activate (Unix)
pip install fastapi uvicorn sqlalchemy pydantic[email] python-jose passlib aiofiles
uvicorn app.main:app --reload
curl http://localhost:8000/api/health
# Expected: {"status":"ok","version":"1.0.0","timestamp":"..."}
```

**Commit Message:** `feat: initialize fastapi backend skeleton with cors, health endpoint, and route stubs`

---

### AG-02-B: Implement All SQLAlchemy Models

**Goal:** Create all 7 SQLAlchemy ORM models that exactly match the database schema defined in Document 05.

**Files to Create:**
```
backend/app/models/
├── __init__.py (imports all models for create_all)
├── user.py
├── case.py
├── evidence.py
├── analysis_result.py
├── custody_log.py
├── report.py
└── case_note.py
```

**Files Not to Touch:** `routes/`, `services/`, `schemas/`, `main.py`, `database.py`.

**Exact Task:**

Create each model following the exact schema from Document 05 Section 3. Key specifications:

`user.py` — `users` table: UUID PK (`id`), unique indexed `email`, `password_hash`, `role` (String 20), `name`, optional `organization`, `is_active` (Boolean default True), `created_at` (DateTime, default utcnow), `updated_at` (DateTime, onupdate utcnow). Relationships: `submitted_cases` (back_populates="submitter"), `assigned_cases` (back_populates="assignee"), `custody_logs`, `notes`, `reports`.

`case.py` — `cases` table: UUID PK, `case_number` (unique, indexed), `title`, `description`, `complaint_type`, `priority` (default "medium"), `status` (default "pending"), optional `contact_email`, `contact_phone`, `location`, FK `submitter_id` → users.id, FK `assigned_to` → users.id (nullable), `created_at`, `updated_at`. Relationships: `submitter`, `assignee`, `evidence`, `custody_logs`, `reports`, `notes`.

`evidence.py` — `evidence` table: UUID PK, FK `case_id` → cases.id (cascade delete), `original_filename`, `stored_filename` (unique), `file_type`, `mime_type`, `file_size` (Integer bytes), `sha256_hash` (unique), `upload_status` (default "pending"), FK `uploaded_by` → users.id (nullable), `created_at`. Relationships: `case`, `uploader`, `analysis_results`, `custody_logs`.

`analysis_result.py` — `analysis_results` table: UUID PK, FK `evidence_id` → evidence.id (cascade delete), `status` (default "pending"), optional `confidence_score` (Float), optional `verdict`, optional `explanation` (Text), optional `model_used`, optional `model_version`, optional `heatmap_path`, optional `raw_output` (JSON/Text), `created_at`, optional `analyzed_at`. Relationships: `evidence`.

`custody_log.py` — `custody_logs` table: UUID PK, FK `case_id` → cases.id, optional FK `evidence_id` → evidence.id (nullable), `action`, optional FK `performed_by_id` → users.id (nullable), optional `ip_address`, optional `notes` (Text), `timestamp` (DateTime, default utcnow, indexed). Relationships: `case`, `evidence`, `performer`. NOTE: This table has NO update or delete operations — append-only by design.

`report.py` — `reports` table: UUID PK, FK `case_id` → cases.id, `report_type` (default "forensic"), `file_path`, `sha256_hash`, FK `generated_by` → users.id, `generated_at` (default utcnow). Relationships: `case`, `generator`.

`case_note.py` — `case_notes` table: UUID PK, FK `case_id` → cases.id (cascade delete), FK `author_id` → users.id, `content` (Text), `is_public` (Boolean default False), `created_at`. Relationships: `case`, `author`.

In `__init__.py`:
```python
from .user import User
from .case import Case
from .evidence import Evidence
from .analysis_result import AnalysisResult
from .custody_log import CustodyLog
from .report import Report
from .case_note import CaseNote
__all__ = ["User", "Case", "Evidence", "AnalysisResult", "CustodyLog", "Report", "CaseNote"]
```

**Constraints:**
- All primary keys must be UUID strings, generated with `default=lambda: str(uuid.uuid4())`
- All string IDs must be `String(36)` not `Integer`
- Use `String` for all enum-like fields (not SQLAlchemy `Enum` type — avoids SQLite/PostgreSQL compatibility issues)
- All `created_at` fields use `default=datetime.utcnow` (not `func.now()`) for SQLite compatibility
- `updated_at` fields must use `onupdate=datetime.utcnow`
- No SQLite-specific column types — all types must be PostgreSQL-compatible

**Acceptance Criteria:**
```bash
python -c "
from app.database import engine, Base
from app.models import User, Case, Evidence, AnalysisResult, CustodyLog, Report, CaseNote
Base.metadata.create_all(engine)
print('All 7 tables created')
"
# Then:
sqlite3 veridact.db '.tables'
# Expected: analysis_results  case_notes  cases  custody_logs  evidence  reports  users
```

**Commit Message:** `feat: implement all 7 sqlalchemy models matching document 05 database schema`

---

### AG-02-C: Implement All Pydantic Schemas

**Goal:** Create all 7 Pydantic v2 schema files for request validation and response serialization.

**Files to Create:**
```
backend/app/schemas/
├── __init__.py
├── auth_schemas.py
├── case_schemas.py
├── evidence_schemas.py
├── analysis_schemas.py
├── report_schemas.py
├── custody_schemas.py
└── admin_schemas.py
```

**Files Not to Touch:** `models/`, `routes/`, `services/`, `main.py`.

**Exact Task:**

All response schemas must use `model_config = ConfigDict(from_attributes=True)` for ORM compatibility.

`auth_schemas.py`:
- `RegisterRequest`: email (EmailStr), password (min 8 chars), name (max 100), optional organization
- `LoginRequest`: email (EmailStr), password
- `LoginResponse`: access_token (str), token_type (str default "bearer"), user (UserResponse)
- `UserResponse`: id, email, name, role, organization, is_active, created_at — NEVER password_hash

`case_schemas.py`:
- `CreateCaseRequest`: title (1-200 chars), description (10-5000 chars), complaint_type (validated against COMPLAINT_TYPES), optional contact_email, contact_phone, location
- `UpdateCaseRequest`: all fields optional — status, priority, assigned_to, note
- `CaseResponse`: all case fields + submitter_name (computed), assignee_name (computed)
- `CaseDetailResponse`: extends CaseResponse + evidence list + notes list
- `CaseListResponse`: items: list[CaseResponse], total: int, page: int, limit: int

`evidence_schemas.py`:
- `EvidenceResponse`: all evidence fields; sha256_hash (str); file_size_mb (float, computed)
- `EvidenceUploadResponse`: extends EvidenceResponse + message
- `EvidenceListResponse`: items: list[EvidenceResponse]

`analysis_schemas.py`:
- `AnalyzeRequest`: optional force_rerun (bool, default False)
- `AnalysisResultResponse`: all analysis_result fields; confidence_percent (int, computed from score × 100)
- `AnalysisStatusResponse`: analysis_id, status, message

`report_schemas.py`:
- `GenerateReportRequest`: report_type (default "forensic", choices: forensic, summary, court_brief)
- `ReportResponse`: id, case_id, report_type, sha256_hash, generated_by_name, generated_at
- `ReportListResponse`: items: list[ReportResponse]

`custody_schemas.py`:
- `CustodyLogResponse`: id, case_id, evidence_id, action, performer_name, notes, timestamp
- `CustodyLogListResponse`: items: list[CustodyLogResponse], total: int

`admin_schemas.py`:
- `UpdateUserRequest`: all fields optional — role, is_active, organization
- `UserListResponse`: items: list[UserResponse], total: int
- `AnalyticsResponse`: total_cases, cases_by_status, cases_by_type, verdict_distribution, daily_submissions, cases_last_7_days, high_risk_cases

**Constraints:**
- Never include `password_hash` in any response schema
- All enum-type string fields must use `Literal` or validator to restrict to valid values
- All schemas must be importable in `__init__.py`
- Use Pydantic v2 `model_config = ConfigDict(from_attributes=True)` on all response schemas

**Acceptance Criteria:**
```bash
python -c "
from app.schemas import (UserResponse, CaseResponse, EvidenceResponse,
  AnalysisResultResponse, CustodyLogResponse, ReportResponse, AnalyticsResponse)
print('All schemas imported successfully')
# Verify no password_hash field:
print(UserResponse.model_fields.keys())  # Should not contain 'password_hash'
"
```

**Commit Message:** `feat: implement all pydantic v2 schemas for api request validation and response serialization`

---

### PHASE 3 PROMPTS

---

### AG-03-A: Implement JWT Auth Backend

**Goal:** Implement full backend authentication — JWT utilities, auth service, auth routes, and demo seed users.

**Files to Create/Modify:**
- `backend/app/utils/security.py` (create)
- `backend/app/services/auth_service.py` (create)
- `backend/app/routes/auth.py` (implement — was stub)
- `backend/seed.py` (implement — was empty stub)

**Files Not to Touch:** `models/`, `schemas/`, `database.py`, `main.py`, `constants.py`, any frontend files.

**Exact Task:**

`security.py`:
```python
# JWT configuration from config
# create_access_token(data: dict) -> str: creates HS256 JWT with exp = utcnow + timedelta(hours=JWT_EXPIRE_HOURS)
# verify_token(token: str) -> dict: decodes JWT, raises HTTPException 401 if invalid/expired
# get_current_user(token=Depends(oauth2_scheme), db=Depends(get_db)) -> User: verifies token, fetches user from DB, raises 401/403 if invalid
# require_roles(*roles: str) -> Callable: returns FastAPI dependency that checks current_user.role is in roles list
```

`auth_service.py`:
```python
# register_user(db, RegisterRequest) -> User: check email uniqueness (409 if taken), hash password, insert user, return User
# authenticate_user(db, email, password) -> User | None: fetch user by email, verify bcrypt hash, return User or None
# get_user_by_id(db, user_id) -> User | None: fetch by id
```

`auth.py` (routes):
- `POST /api/auth/register`: call `register_user()`, return `UserResponse`
- `POST /api/auth/login`: call `authenticate_user()`, if None raise 401, create JWT, return `LoginResponse`
- `GET /api/auth/me`: Depends on `get_current_user`, return `UserResponse` for current user
- `POST /api/auth/logout`: return `{"message": "Logged out successfully"}` (client handles token deletion)

`seed.py`:
- Accept `--reset` flag via `sys.argv` to drop and recreate all tables
- Create 6 demo users with bcrypt-hashed `demo1234` passwords:
  - `admin@veridact.local` / super_admin
  - `supervisor@veridact.local` / supervisor
  - `inv1@veridact.local` / investigator / "Officer Ram Shrestha"
  - `inv2@veridact.local` / investigator / "Officer Sita Rai"
  - `citizen1@veridact.local` / citizen / "Arjun Thapa"
  - `citizen2@veridact.local` / citizen / "Nisha Gurung"
- Make idempotent: check if `admin@veridact.local` exists before inserting
- Print credentials table to console at end

**Constraints:**
- JWT secret must come from `config.JWT_SECRET_KEY` — never hardcoded
- `python-jose` for JWT, `passlib[bcrypt]` for hashing
- Self-registration (`POST /api/auth/register`) must only allow `citizen` role — reject other roles with 403
- Admin creates investigator/supervisor accounts via `/api/admin/users` (Phase 6)

**Acceptance Criteria:**
```bash
python seed.py
# Creates 6 users, prints credentials table
python seed.py  # Idempotent — no duplicate error
python seed.py --reset  # Drops tables, recreates, seeds
# Then with uvicorn running:
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@veridact.local","password":"demo1234"}'
# Expected: {"access_token": "eyJ...", "token_type": "bearer", "user": {...}}
curl -H "Authorization: Bearer eyJ..." http://localhost:8000/api/auth/me
# Expected: user object with role "super_admin"
```

**Commit Message:** `feat: implement jwt authentication with bcrypt hashing, rbac, and demo seed users`

---

### AG-03-B: Wire Frontend Authentication

**Goal:** Connect the frontend auth system to the real backend JWT API. Implement `useAuth`, `LoginPage`, `RegisterPage`, `ProtectedRoute`, and the Axios JWT interceptor.

**Files to Modify/Create:**
- `src/services/authService.ts` (implement real API calls)
- `src/hooks/useAuth.ts` (implement real AuthContext)
- `src/pages/LoginPage.tsx` (implement real form)
- `src/pages/RegisterPage.tsx` (implement real form)
- `src/routes/ProtectedRoute.tsx` (wire to real useAuth)
- `src/routes/RoleRoute.tsx` (wire to real useAuth)
- `src/services/apiClient.ts` (wire JWT interceptor)

**Files Not to Touch:** `App.tsx`, `tailwind.config.ts`, `globals.css`, all layout components, all other pages, `backend/`.

**Exact Task:**
1. `authService.ts`: implement `login(email, password) -> LoginResponse`, `register(data) -> UserResponse`, `getMe() -> User`, `logout() -> void (clears localStorage)`
2. `useAuth.ts`: create `AuthContext` with `{user, isAuthenticated, role, login, logout, isLoading}`. On mount, check localStorage for token; if found, call `getMe()` to restore session. Store token in localStorage key `veridact_token`.
3. `apiClient.ts`: add `request` interceptor that reads `localStorage.getItem('veridact_token')` and adds `Authorization: Bearer <token>` header if present. Add `response` interceptor that on 401 calls `logout()` and redirects to `/login`.
4. `LoginPage.tsx`: React Hook Form with Zod schema `{email: z.string().email(), password: z.string().min(1)}`. On submit: call `authService.login()`, store token via `useAuth.login()`, redirect based on role (`/admin` for super_admin, `/dashboard` for others). Show error message on 401.
5. `RegisterPage.tsx`: React Hook Form with name, email, password, confirm password. Calls `authService.register()`. On success, auto-login and redirect to `/dashboard`. Role is always `citizen`.
6. `ProtectedRoute.tsx`: use `useAuth()` hook — if `isLoading`, show spinner; if `!isAuthenticated`, redirect to `/login`; else render `<Outlet />`
7. `RoleRoute.tsx`: use `useAuth()` — if user role not in allowed roles, redirect to `/dashboard`
8. `Sidebar.tsx`: update to use `useAuth()` hook and show nav items based on `user.role` (not hardcoded)

**Constraints:**
- Token stored ONLY in `localStorage` (key: `veridact_token`)
- `useAuth` must handle `isLoading` state to prevent flash of redirect before token is verified
- All API errors shown as user-friendly messages (not raw JSON)
- Role routing: super_admin → `/admin`, supervisor → `/dashboard`, investigator → `/dashboard`, citizen → `/dashboard`
- `AuthContext` must be provided at the `App.tsx` root level

**Acceptance Criteria:**
- Log in as `inv1@veridact.local` / `demo1234` → redirected to `/dashboard`
- Log in as `admin@veridact.local` / `demo1234` → redirected to `/admin`
- Log in with wrong password → error message shown on form
- After login, refresh page → session restored (token still valid)
- After logout, `/dashboard` redirects to `/login`
- Sidebar shows investigator nav items when logged in as investigator
- Sidebar shows admin nav items when logged in as super_admin

**Commit Message:** `feat: wire frontend jwt authentication with auth context, login page, and protected routes`

---

### PHASE 4 PROMPTS

---

### AG-04-A: Implement Case and Evidence Backend

**Goal:** Implement the complete backend for case creation, evidence upload, SHA-256 hashing, custody logging, and citizen tracking.

**Files to Create/Modify:**
- `backend/app/utils/hashing.py` (create)
- `backend/app/utils/file_validation.py` (create)
- `backend/app/services/custody_service.py` (create)
- `backend/app/services/case_service.py` (create)
- `backend/app/services/evidence_service.py` (create)
- `backend/app/routes/cases.py` (implement — was stub)
- `backend/app/routes/evidence.py` (implement — was stub)
- `backend/app/routes/public.py` (implement — was stub)
- `backend/app/routes/custody.py` (implement — was stub)

**Files Not to Touch:** `models/`, `schemas/`, `database.py`, `utils/security.py`, `main.py`, any frontend files.

**Exact Task:**

`hashing.py`:
```python
def compute_sha256(file_path: str) -> str:
    """Read file in 64KB chunks, return lowercase hex SHA-256 digest"""

def compute_sha256_bytes(data: bytes) -> str:
    """Compute SHA-256 of in-memory bytes"""
```

`file_validation.py`:
```python
def validate_upload(file_content: bytes, original_filename: str) -> tuple[str, str]:
    """
    Validates MIME type via python-magic and extension.
    Returns (detected_file_type, mime_type) or raises HTTPException 415.
    Raises HTTPException 413 if size > MAX_FILE_SIZE_MB.
    """

def get_file_type(mime_type: str) -> str:
    """Maps MIME type to evidence type: image/video/audio/document/other"""
```

`custody_service.py`:
```python
def log_action(db, case_id, action, performed_by_id=None, evidence_id=None, notes=None, ip_address=None) -> CustodyLog:
    """Creates append-only custody log entry. Never modifies existing entries. Swallows exceptions (logs warning)."""

def get_case_custody(db, case_id) -> list[CustodyLog]:
    """Returns all custody logs for case, ASC order by timestamp"""

def get_all_custody(db, filters, page=1, limit=50) -> tuple[list[CustodyLog], int]:
    """Paginated custody logs with optional filters"""
```

`case_service.py`:
```python
def generate_case_number(db) -> str:
    """Count existing cases + 1, format as VRD-YYYY-NNNNNN"""

def create_case(db, data, submitter_id=None) -> Case:
    """Creates case, calls custody_service.log_action('case_created')"""

def get_case(db, case_id, current_user) -> Case:
    """Gets case; raises 403 if investigator accesses unassigned case"""

def list_cases(db, current_user, filters, page, limit) -> tuple[list[Case], int]:
    """Role-filtered: investigator sees only assigned cases"""

def update_case(db, case_id, data, current_user) -> Case:
    """Updates case; logs 'case_updated'; enforces role permissions"""
```

`evidence_service.py`:
```python
async def save_upload_file(upload_file, case_id) -> EvidenceSaveResult:
    """Validate, stream to uploads/evidence/{uuid}.ext, compute SHA-256, return result"""

def create_evidence_record(db, case_id, save_result, uploaded_by_id=None) -> Evidence:
    """Creates evidence DB record; calls custody_service.log_action('evidence_uploaded')"""

def get_evidence(db, evidence_id, current_user) -> Evidence:
    """Gets evidence; logs 'evidence_accessed'"""
```

Routes:
- `POST /api/cases` — creates case (public or authenticated)
- `GET /api/cases` — paginated, role-filtered list
- `GET /api/cases/{case_id}` — full case detail
- `PATCH /api/cases/{case_id}` — update status/priority/assignment
- `DELETE /api/cases/{case_id}` — super_admin only, soft close
- `POST /api/cases/{case_id}/evidence` — multipart upload; call `save_upload_file` then `create_evidence_record`
- `GET /api/cases/{case_id}/evidence` — list evidence for case
- `GET /api/evidence/{evidence_id}` — single evidence with analysis result if exists
- `DELETE /api/evidence/{evidence_id}` — super_admin only
- `GET /api/cases/{case_id}/custody` — custody log for case
- `GET /api/admin/custody` — all custody logs (super_admin only)
- `GET /api/public/cases/{case_number}` — public citizen tracking (no auth); returns safe subset: case_number, status, complaint_type, created_at, public notes only

**Constraints:**
- File uploads: MIME type validated server-side with `python-magic` before saving
- Stored filename is always UUID format: `{uuid4}.{ext}` — never the user's original filename
- SHA-256 computed during file streaming (not after file is fully written)
- Custody logs must be called by every mutating service function
- Investigator routes must enforce `case.assigned_to == current_user.id` (403 otherwise)
- Public tracking route: must NOT return contact_email, contact_phone, assigned_to, or any internal notes

**Acceptance Criteria:**
```bash
# With uvicorn running and seed users created:
# Test case creation:
curl -X POST http://localhost:8000/api/cases \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Case","description":"Testing the API with enough description text here","complaint_type":"deepfake_image"}'
# Expected: case object with VRD-YYYY-NNNNNN case_number

# Test file upload (with real token):
curl -X POST http://localhost:8000/api/cases/{case_id}/evidence \
  -H "Authorization: Bearer {token}" \
  -F "file=@test.jpg"
# Expected: evidence object with sha256_hash

# Test custody log:
curl -H "Authorization: Bearer {token}" http://localhost:8000/api/cases/{case_id}/custody
# Expected: list with case_created and evidence_uploaded entries
```

**Commit Message:** `feat: implement case and evidence core flow with sha256 hashing and custody logging`

---

### AG-04-B: Extend Seed Script with Cases and Evidence

**Goal:** Extend `seed.py` to create 5 demo cases, 8 evidence records, and 12 custody log entries that will power the demo.

**Files to Modify:**
- `backend/seed.py`
- `backend/seed_data.json`

**Files Not to Touch:** All models, schemas, routes, services, and frontend files.

**Exact Task:**
Add to `seed.py` after user seeding:
- 5 demo cases with varied statuses, priorities, complaint types:
  - VRD-2025-000001: "Suspected Deepfake Harassment Video" / deepfake_video / critical / in_review / assigned to inv1
  - VRD-2025-000002: "Fake Identity Document" / fake_document / high / analysis_complete / assigned to inv1
  - VRD-2025-000003: "Voice Clone Audio Fraud" / voice_clone / medium / pending / unassigned
  - VRD-2025-000004: "AI-Generated Profile Photo" / deepfake_image / low / report_generated / assigned to inv2
  - VRD-2025-000005: "Synthetic Identity Used in Loan Application" / synthetic_identity / high / pending / unassigned
- 8 evidence records (1-2 per case): Use `demo_assets/` filenames as `original_filename`; use realistic UUID strings as `stored_filename`; use realistic file sizes; compute or hardcode realistic SHA-256 hashes
- 12 custody log entries: at least `case_created` and `evidence_uploaded` for all cases; `analysis_started`, `analysis_completed` for cases 1-4; `report_generated` for case 4
- 2 case notes (one public, one internal) for case VRD-2025-000001

All seed functions must check for existing data before inserting (idempotent). Print success summary.

**Constraints:**
- No real personal data — all fictional Nepal-context descriptions
- Case numbers must use VRD-2025-NNNNNN format
- SHA-256 values must be 64-character hex strings (use `hashlib.sha256(b'demo').hexdigest()` style values)

**Acceptance Criteria:**
```bash
python seed.py --reset
# Output: 6 users, 5 cases, 8 evidence, 12 custody logs created
python seed.py  # Idempotent — same output, no duplicate errors
python -c "
from app.database import SessionLocal
from app.models import Case, Evidence, CustodyLog
db = SessionLocal()
print(db.query(Case).count(), 'cases')
print(db.query(Evidence).count(), 'evidence')
print(db.query(CustodyLog).count(), 'custody logs')
"
# Expected: 5 cases, 8 evidence, 12 custody logs
```

**Commit Message:** `feat: extend seed script with 5 demo cases, 8 evidence records, and custody log chain`

---

### AG-04-C: Build Citizen Submission Wizard Frontend

**Goal:** Build the complete 4-step citizen evidence submission wizard, file upload component, and confirmation screen.

**Files to Create/Modify:**
- `src/pages/SubmitEvidencePage.tsx`
- `src/components/evidence/SubmissionWizard.tsx`
- `src/components/evidence/StepIndicator.tsx`
- `src/components/ui/FileUploadBox.tsx`
- `src/components/ui/SHAHashDisplay.tsx`
- `src/components/ui/CaseNumberDisplay.tsx`
- `src/services/caseService.ts`
- `src/services/evidenceService.ts`
- `src/pages/TrackCasePage.tsx`
- `src/pages/TrackCaseResultPage.tsx`
- `src/services/publicService.ts`

**Files Not to Touch:** Layout components, `App.tsx`, backend files, any dashboard pages.

**Exact Task:**

`FileUploadBox.tsx`: Drag-and-drop area + click to select. Props: `onFileSelect(file: File)`, `acceptedTypes: string[]`, `maxSizeMB: number`. On file selection: check extension against `ALLOWED_EXTENSIONS`, check size <= maxSizeMB. Show selected filename + size. Show error if rejected. Style: dashed border, upload icon, "Drop file here or click to upload" text, accepted types listed below.

`SHAHashDisplay.tsx`: Props: `hash: string`. Display in monospace font. Copy-to-clipboard button (uses `navigator.clipboard.writeText(hash)`). Show "Copied!" confirmation for 2 seconds.

`CaseNumberDisplay.tsx`: Props: `caseNumber: string`. Display large, prominent, monospace. Copy button.

`SubmissionWizard.tsx`: 4-step wizard managed by single `useForm()` instance from React Hook Form. Steps tracked by local `currentStep` state (0–3).
- Step 0: Complaint type radio cards (7 options from COMPLAINT_TYPES, with icons/descriptions)
- Step 1: Title (required, max 200), description (required, min 50, max 2000), contact_email (optional, email format), contact_phone (optional), location (optional)
- Step 2: `FileUploadBox` component; file stored in `useState`, not in React Hook Form
- Step 3: Review all entered data + "Submit Complaint" button. On submit: POST `/api/cases` then POST `/api/cases/{id}/evidence`. On success: transform step 3 into a Confirmation Screen showing `CaseNumberDisplay`, `SHAHashDisplay`, timestamp, "Track My Case" button, "Submit Another" link.

`StepIndicator.tsx`: Shows 4 steps (Type, Details, File, Review) with current step highlighted. Completed steps shown with checkmark.

`caseService.ts`: implement `createCase(data)`, `getCase(id)`, `getCases(filters)`, `updateCase(id, data)` calling real backend APIs.

`evidenceService.ts`: implement `uploadEvidence(caseId, file)` as `FormData` POST, `getEvidence(id)`, `getEvidenceForCase(caseId)`.

`publicService.ts`: implement `trackCase(caseNumber)` calling `GET /api/public/cases/{caseNumber}` (no auth).

`TrackCasePage.tsx`: Case number input with VRD-YYYY-NNNNNN format validation regex. On submit, navigate to `/track/${caseNumber}`.

`TrackCaseResultPage.tsx`: On mount, call `publicService.trackCase(caseNumber)`. Show loading skeleton, not-found state, or case status card with citizen-friendly status labels.

**Constraints:**
- File must NOT be uploaded until the final Submit click (not during Step 2)
- All API errors must show user-friendly toast messages
- Loading state must be shown during case creation + evidence upload
- `SHAHashDisplay` must use IBM Plex Mono or system monospace font class

**Acceptance Criteria:**
- Complete wizard with valid JPEG < 100MB → confirmation screen shows case number and SHA-256 hash
- Try `.exe` upload → error message shown on Step 2
- Try file > 100MB → client-side rejection with size error
- Track case VRD-2025-000001 → shows "Under Investigation" status
- Track unknown case → shows "Case not found" message

**Commit Message:** `feat: implement citizen evidence submission wizard, file upload, and case tracking`

---

### PHASE 5 PROMPTS

---

### AG-05-A: Implement AI Image Deepfake Detector

**Goal:** Implement the image deepfake detection pipeline with lazy model loading, real inference, and bulletproof fallback.

**Files to Create:**
- `backend/app/services/ai/image_detector.py`
- `backend/app/services/analysis_service.py`
- `backend/app/routes/analysis.py` (partial — image only for now)

**Files Not to Touch:** All models, schemas, other AI modules, any frontend files.

**Exact Task:**

`image_detector.py`:
```python
from dataclasses import dataclass
from typing import Optional

@dataclass
class AnalysisResultData:
    confidence_score: float
    verdict: str
    explanation: str
    model_used: str
    model_version: str
    heatmap_path: Optional[str]
    raw_output: dict

_model = None
_feature_extractor = None

def load_model():
    """Lazy-load prithivMLmods/Deepfake-Detect-Siglip2 from HuggingFace transformers.
    Sets _model and _feature_extractor globals.
    Reads IMAGE_MODEL_NAME from config (default: prithivMLmods/Deepfake-Detect-Siglip2).
    If HF_HUB_OFFLINE=true, uses cached model only.
    On any exception: logs error, returns False.
    Returns True on success."""

def _hash_based_fallback(file_path: str) -> AnalysisResultData:
    """Deterministic fallback using SHA-256 first byte.
    0x00-0x7F -> confidence_score=0.15, verdict='authentic'
    0x80-0xFF -> confidence_score=0.82, verdict='likely_fake'
    model_used='hash_based_fallback_v1'
    """

def _demo_mode_result(file_path: str) -> AnalysisResultData:
    """Returns pre-scripted demo result without any model.
    Verdict: 'likely_fake', confidence_score=0.87
    explanation: 'DEMO MODE: Pre-scripted result for demonstration purposes.'
    model_used='demo_fallback_v1'
    """

def analyze_image(file_path: str) -> AnalysisResultData:
    """Main entry point.
    1. If DEMO_MODE=true: return _demo_mode_result()
    2. Try load_model() if _model is None
    3. If model loaded: run inference, normalize to AnalysisResultData
    4. If model fails: return _hash_based_fallback()
    Score normalization:
    - Get fake_score from 'FAKE' label in pipeline output
    - confidence_score = fake_score
    - verdict = 'likely_fake' if fake_score >= 0.75 else 'suspicious' if fake_score >= 0.45 else 'authentic'
    - explanation: human-readable string based on score range
    """
```

`analysis_service.py`:
```python
def create_pending_result(db, evidence_id, analysis_type) -> AnalysisResult
def update_result_processing(db, result_id, model_used) -> AnalysisResult
def complete_result(db, result_id, data: AnalysisResultData) -> AnalysisResult
def fail_result(db, result_id, error) -> AnalysisResult  # Sets verdict='inconclusive', score=0.5
def get_latest_result(db, evidence_id) -> Optional[AnalysisResult]
def get_result_by_id(db, result_id) -> Optional[AnalysisResult]
# All functions also update evidence.upload_status to 'analyzed'
```

`analysis.py` (routes):
- `POST /api/evidence/{evidence_id}/analyze`: 
  1. Get evidence (404 if not found, 403 if not authorized)
  2. Check if analysis already in progress (409 if so) unless `force_rerun=true`
  3. `analysis_service.create_pending_result()`
  4. `custody_service.log_action('analysis_started')`
  5. Route to `analyze_image()` (for now; router added in AG-05-D)
  6. `analysis_service.complete_result()` or `fail_result()`
  7. `custody_service.log_action('analysis_completed')`
  8. Return completed `AnalysisResultResponse`
- `GET /api/evidence/{evidence_id}/results`: Return latest analysis result (404 if none)

**Constraints:**
- Model loading must be lazy (on first analyze call, not on uvicorn startup)
- All exceptions in model inference must be caught — never let an exception propagate from `analyze_image()`
- `DEMO_MODE` read from `config` — environment variable at runtime
- Model is read from `config.IMAGE_MODEL_NAME`
- `analyze_image()` must never raise exceptions — always returns `AnalysisResultData`

**Acceptance Criteria:**
```bash
# With DEMO_MODE=true:
curl -X POST http://localhost:8000/api/evidence/{id}/analyze \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"force_rerun": false}'
# Expected: {"confidence_score": 0.87, "verdict": "likely_fake", "explanation": "DEMO MODE: ..."}
# Returned in < 1 second

# Check custody logs:
curl http://localhost:8000/api/cases/{case_id}/custody \
  -H "Authorization: Bearer {token}"
# Expected: includes analysis_started and analysis_completed entries
```

**Commit Message:** `feat: implement image deepfake detector with lazy model loading and demo fallback`

---

### AG-05-B: Implement Audio, Video, Document Detectors

**Goal:** Implement the remaining three AI analysis modules.

**Files to Create:**
- `backend/app/services/ai/video_detector.py`
- `backend/app/services/ai/audio_detector.py`
- `backend/app/services/ai/document_detector.py`

**Files Not to Touch:** `image_detector.py`, `analysis_service.py`, `routes/analysis.py`, any model or schema files.

**Exact Task:**

`video_detector.py`:
```python
def analyze_video(file_path: str) -> AnalysisResultData:
    """
    1. Use OpenCV VideoCapture to open video file
    2. Sample 10 evenly-spaced frames (cap.set(cv2.CAP_PROP_POS_FRAMES, n))
    3. Convert each frame to PIL Image
    4. Run image_detector.analyze_image() on each frame
    5. Collect confidence_scores from each frame result
    6. Final confidence_score = mean(frame_scores)
    7. Verdict: 'likely_fake' if >50% frames score >=0.7, else standard threshold
    8. If video cannot be opened: return inconclusive AnalysisResultData
    9. model_used = 'video_frame_sampling_v1 + ' + image_result.model_used
    """
```

`audio_detector.py`:
```python
def analyze_audio(file_path: str) -> AnalysisResultData:
    """
    1. Load audio with librosa.load(file_path, sr=16000, duration=60)
    2. Extract features: MFCC (n_mfcc=20), spectral_flatness, zero_crossing_rate, pitch variance
    3. Heuristic scoring:
       - Abnormally low MFCC variance (< threshold) → +0.3 to score (synthetic uniformity)
       - High spectral flatness (> 0.1) → +0.2 to score (monotone synthesis)
       - Very low zero_crossing variance → +0.15 to score
       - Initial score = 0.3 (base; human voice is complex)
    4. Final score clamped to [0.0, 1.0]
    5. Map to verdict using standard thresholds
    6. model_used = 'librosa_heuristic_v1'
    7. On exception: return inconclusive
    """
```

`document_detector.py`:
```python
def analyze_document(file_path: str) -> AnalysisResultData:
    """
    1. Detect file type (PDF, DOCX, image, etc.)
    2. For PDF: use PyMuPDF (fitz) to extract metadata
       - Check author field (blank/suspicious tools → flag)
       - Check created/modified dates (future dates → flag)
       - Check producer field for known manipulation tools
    3. For DOCX: use python-docx to extract core properties
    4. For images: run ELA (save at quality=95, subtract, amplify)
    5. For all types: attempt OCR with pytesseract on first page/preview
    6. Score based on metadata_flags count:
       - 0 flags → 0.15 (likely authentic)
       - 1 flag → 0.45 (suspicious)
       - 2+ flags → 0.78 (likely fake)
    7. metadata_flags: list of detected anomalies
    8. model_used = 'metadata_ocr_ela_pipeline_v1'
    9. On exception: return inconclusive
    """
```

**Constraints:**
- All three modules import and use `AnalysisResultData` from `image_detector.py`
- All exceptions caught — never propagate from `analyze_*()` functions
- `analyze_video()` imports `analyze_image` from `image_detector` — no circular imports
- If `tesseract` is not installed, `document_detector.py` skips OCR silently and notes it in explanation

**Acceptance Criteria:**
- `analyze_audio('demo_assets/sample_audio/test.mp3')` returns `AnalysisResultData`
- `analyze_video('demo_assets/sample_videos/test.mp4')` returns `AnalysisResultData`
- `analyze_document('demo_assets/sample_documents/test.pdf')` returns `AnalysisResultData`
- All three return `inconclusive` gracefully on missing/corrupt files

**Commit Message:** `feat: implement audio heuristic, video frame sampling, and document metadata detectors`

---

### AG-05-C: Implement AI Router and Wire Analysis Route

**Goal:** Create the AI routing module and update the analysis route to route to the correct detector by file type.

**Files to Create/Modify:**
- `backend/app/services/ai/router.py` (create)
- `backend/app/routes/analysis.py` (update to use router)

**Files Not to Touch:** All individual detector files, models, schemas, frontend files.

**Exact Task:**

`router.py`:
```python
from .image_detector import analyze_image, AnalysisResultData
from .video_detector import analyze_video
from .audio_detector import analyze_audio
from .document_detector import analyze_document

def route_analysis(file_path: str, file_type: str, evidence_id: str) -> AnalysisResultData:
    """Routes to correct detector based on file_type.
    file_type values: 'image', 'video', 'audio', 'document', 'other'
    For 'other': return inconclusive AnalysisResultData
    Wraps all calls in try/except; on exception returns inconclusive with error note
    """
```

Update `routes/analysis.py`:
- Replace the direct `analyze_image()` call with `router.route_analysis(evidence.stored_path, evidence.file_type, evidence.id)`
- Import router from `services/ai/router`

**Constraints:**
- Router must use `evidence.file_type` from the DB record — not re-detect
- All four detector imports must work without circular dependencies
- `route_analysis()` never raises exceptions — always returns `AnalysisResultData`

**Acceptance Criteria:**
- POST `/api/evidence/{id}/analyze` for an image → routes to image detector
- POST `/api/evidence/{id}/analyze` for an audio file → routes to audio detector
- POST `/api/evidence/{id}/analyze` for a document → routes to document detector
- POST `/api/evidence/{id}/analyze` for unknown type → returns `inconclusive`

**Commit Message:** `feat: implement ai analysis router and wire all detectors to analysis route`

---

### AG-05-D: Build Analysis Result Frontend Components

**Goal:** Build the frontend components for triggering analysis and displaying results.

**Files to Create/Modify:**
- `src/components/ui/ConfidenceMeter.tsx`
- `src/components/ui/VerdictBadge.tsx`
- `src/components/evidence/AnalysisResultCard.tsx`
- `src/pages/EvidenceDetailPage.tsx`
- `src/hooks/useAnalysis.ts`
- `src/services/evidenceService.ts` (add `analyzeEvidence`, `getAnalysisResult`)

**Files Not to Touch:** Layout components, `App.tsx`, backend files, other dashboard pages.

**Exact Task:**

`ConfidenceMeter.tsx`: Props: `score: number` (0.0–1.0), `verdict: Verdict`. Displays Framer Motion animated progress bar from 0 to `score * 100` on mount (duration 1.5s). Color: emerald if authentic, yellow if suspicious, red if likely_fake, slate if inconclusive. Shows percentage text. Width: full-width bar inside a container.

`VerdictBadge.tsx`: Props: `verdict: Verdict`. shadcn/ui Badge with variant: emerald/green for authentic, yellow for suspicious, red for likely_fake, slate/gray for inconclusive. Text: capitalized verdict with spaces ("Likely Fake" not "likely_fake").

`AnalysisResultCard.tsx`: Props: `result: AnalysisResult`. Shows: `VerdictBadge`, `ConfidenceMeter`, explanation text, model_used (small text), analyzed_at timestamp. If `model_used` contains "demo_fallback" or "hash_based_fallback": show yellow warning banner "Note: This is a fallback result. AI analysis could not complete normally. Manual review required." Toggle to show raw_output JSON (hidden by default).

`useAnalysis.ts`: Hook that manages analysis state. `analyzeEvidence(evidenceId)` triggers POST, sets `isAnalyzing: true`, waits for response, sets `result`, sets `isAnalyzing: false`. Handles timeout (30s) and error states.

`EvidenceDetailPage.tsx`:
- Fetch evidence metadata on mount using `useCase` / `evidenceService.getEvidence()`
- Show: filename, file type badge, file size, SHA-256 hash (`SHAHashDisplay`), upload date
- Show existing analysis result if present (`AnalysisResultCard`)
- Show "Analyze Evidence" button (disabled if already analyzing)
- On button click: `useAnalysis.analyzeEvidence(evidenceId)` → loading state (spinner + "Analyzing... this may take 30–60 seconds") → result displayed
- Show `HeatmapViewer` if `result.heatmap_path` is not null (otherwise hide component)

**Constraints:**
- `ConfidenceMeter` animation must play on every new result (re-mount or use animation key)
- "Analyze Evidence" button must be disabled and show loading spinner during analysis
- Fallback warning banner must always show if `model_used` contains "fallback"
- All Lucide icons from `lucide-react` only

**Acceptance Criteria:**
- Upload image, navigate to evidence detail → click "Analyze Evidence" → see loading state → see result with animated ConfidenceMeter
- VerdictBadge shows correct color for each verdict
- Fallback warning banner appears when model_used includes "fallback"
- Analysis result persists after page refresh (loaded from DB on mount)

**Commit Message:** `feat: build analysis result components — confidence meter, verdict badge, evidence detail page`

---

### PHASE 6 PROMPTS

---

### AG-06-A: Implement PDF Report Generation

**Goal:** Implement complete PDF forensic report generation using ReportLab with all required sections.

**Files to Create/Modify:**
- `backend/app/utils/pdf.py`
- `backend/app/services/report_service.py`
- `backend/app/routes/reports.py` (implement — was stub)

**Files Not to Touch:** All models, AI modules, evidence/case services, frontend files.

**Exact Task:**

`pdf.py` — implement `generate_forensic_report(case, evidence_list, analysis_results, custody_logs, investigator, report_type) -> tuple[bytes, str]`:

The function must generate a PDF using ReportLab `SimpleDocTemplate` or `Canvas` with these 7 sections:

1. **Header**: "VERIDACT — AI Forensic Evidence Report" (bold, large), VERIDACT tagline, generation timestamp, report ID, investigator name
2. **Report Integrity**: SHA-256 of the report itself (computed after generation, included via second pass or noted as computed)
3. **Case Summary**: Case number, title, complaint type, priority, status, description, submission date, contact info (if provided)
4. **Evidence Table**: Table with columns: Filename, Type, Size, SHA-256 Hash, Upload Date, Analysis Status, Verdict
5. **AI Analysis Results**: For each analyzed evidence: evidence filename, verdict (bold), confidence score as percentage, explanation paragraph, model used, analyzed timestamp
6. **Chain of Custody Log**: Table with columns: Timestamp, Action, Performed By, Evidence, Notes — all entries in chronological order
7. **Disclaimer Footer**: "This report was generated by VERIDACT AI Forensic Evidence Platform. AI analysis results are probabilistic and assist human investigators but do not constitute legal evidence or replace expert forensic judgment. All findings must be reviewed and validated by qualified investigators before use in legal proceedings."

Use `reportlab.platypus` for structured layout. Return `(pdf_bytes, sha256_hash_of_pdf)`.

`report_service.py`:
```python
def generate_report(db, case_id, report_type, current_user) -> Report:
    """
    1. Fetch case, all evidence, all analysis results, all custody logs
    2. Call pdf.generate_forensic_report()
    3. Save PDF bytes to uploads/reports/{report_id}.pdf
    4. Create Report DB record with sha256_hash
    5. Call custody_service.log_action('report_generated')
    6. Return Report record
    """

def get_report(db, report_id, current_user) -> Report:
    """Get report by ID with access check"""

def list_case_reports(db, case_id, current_user) -> list[Report]:
    """List all reports for a case"""
```

`routes/reports.py`:
- `POST /api/cases/{case_id}/report`: call `report_service.generate_report()`, return `ReportResponse`
- `GET /api/reports/{report_id}`: call `report_service.get_report()`, return `FileResponse` (PDF stream) + create `file_downloaded` custody log
- `GET /api/cases/{case_id}/reports`: call `report_service.list_case_reports()`

**Constraints:**
- ReportLab only — no WeasyPrint, no browser rendering, no system dependencies beyond ReportLab
- PDF must be valid and openable by standard PDF viewers
- PDF must be saved to `uploads/reports/` directory (not temp files)
- SHA-256 of the PDF bytes must be computed and stored in `reports.sha256_hash`
- On `FileResponse`, add `custody_service.log_action('file_downloaded')` side effect
- All generated PDFs saved as `{report_id}.pdf` (UUID filename)

**Acceptance Criteria:**
```bash
curl -X POST http://localhost:8000/api/cases/{case_id}/report \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"report_type": "forensic"}'
# Expected: {"report_id": "...", "sha256_hash": "...", "generated_at": "..."}

curl http://localhost:8000/api/reports/{report_id} \
  -H "Authorization: Bearer {token}" \
  --output test_report.pdf
# Verify: file test_report.pdf is > 5KB and opens correctly in PDF viewer
# Verify: 7 sections present (header, integrity, case, evidence table, analysis, custody log, disclaimer)
```

**Commit Message:** `feat: implement forensic pdf report generation with reportlab — all 7 required sections`

---

### AG-06-B: Build Authenticated Dashboard Pages

**Goal:** Build all authenticated dashboard pages with real API integration: DashboardPage, CaseListPage, CaseDetailPage, ReportsPage, AnalyticsPage, and all Admin pages.

**Files to Create/Modify:**
- `src/pages/DashboardPage.tsx`
- `src/pages/CaseListPage.tsx`
- `src/pages/CaseDetailPage.tsx`
- `src/pages/ReportsPage.tsx`
- `src/pages/AnalyticsPage.tsx`
- `src/pages/AdminOverviewPage.tsx`
- `src/pages/AdminUsersPage.tsx`
- `src/pages/AdminCustodyPage.tsx`
- `src/pages/AdminSettingsPage.tsx`
- `src/components/cases/CaseTable.tsx`
- `src/components/ui/CustodyTimeline.tsx`
- `src/components/dashboard/StatsCard.tsx`
- `src/components/analytics/VerdictDistributionChart.tsx`
- `src/components/analytics/DailySubmissionsChart.tsx`
- `src/components/analytics/CaseTypeChart.tsx`
- `src/components/reports/ReportDownloadCard.tsx`
- `src/services/reportService.ts`
- `src/services/adminService.ts`
- `src/hooks/useCases.ts`
- `src/hooks/useCase.ts`

**Files Not to Touch:** Layout components, `App.tsx`, backend files, submission wizard, citizen pages.

**Exact Task:**

`StatsCard.tsx`: Props: `label, value, icon, trend?, color?`. Shows icon, large number, label, optional trend indicator.

`CaseTable.tsx`: Table component using shadcn/ui `Table`. Props: `cases: Case[], isLoading, onRowClick`. Each row: case number, title, type badge, priority badge, status badge, submitted date. Skeleton rows when loading.

`CustodyTimeline.tsx`: Vertical timeline. Props: `logs: CustodyLog[]`. Each entry: timestamp (relative time), action with icon (using Lucide icons mapped per `CUSTODY_ACTIONS`), performer name, notes. Icons: `Shield` for case events, `Upload` for evidence_uploaded, `Activity` for analysis events, `FileText` for reports, `Download` for downloads, `Lock` for case_closed.

`DashboardPage.tsx`: Role-aware stats cards using `GET /api/admin/analytics` (supervisor+) or case count for investigator. Shows: total cases, active cases, pending analysis, high risk (score > 0.8). Recent activity section (last 5 cases). Role-specific quick actions.

`CaseListPage.tsx`: `FilterBar` with status/complaint_type/priority dropdowns and search input. `CaseTable` with pagination. Fetches `GET /api/cases` with filter params. Row click navigates to case detail.

`CaseDetailPage.tsx`: Case header (number, title, status/priority badges, actions panel). Tabs: Evidence (list of `EvidenceCard` items with Analyze link), Notes (case notes), Custody Log (`CustodyTimeline`), Reports (list of `ReportDownloadCard`). Actions panel: Update Status (if supervisor+), Generate Report button, Add Note textarea.

`ReportsPage.tsx`: List all reports for current user's cases. `ReportDownloadCard` per report. "Generate New Report" button opens case selector dialog.

`AnalyticsPage.tsx`: Three charts using Recharts: `VerdictDistributionChart` (PieChart), `DailySubmissionsChart` (BarChart last 30 days), `CaseTypeChart` (horizontal BarChart). All handle empty data gracefully with "No data yet" placeholder.

Admin pages: `AdminOverviewPage` — system stats; `AdminUsersPage` — user table with edit modal using PATCH `/api/admin/users/{id}`; `AdminCustodyPage` — full custody log with filters; `AdminSettingsPage` — placeholder with coming soon message.

**Constraints:**
- Charts must use VERIDACT color tokens (verdict colors for VerdictDistributionChart)
- All lists must have loading skeleton, empty state, and error state
- Case detail tabs use shadcn/ui `Tabs` component
- AdminUsersPage must not allow deactivating your own account
- Analytics page is only accessible to supervisor and super_admin roles

**Acceptance Criteria:**
- Log in as `inv1@veridact.local`: dashboard shows 2 assigned cases (matching seed data)
- Log in as `admin@veridact.local`: dashboard shows all 5 cases
- Case list filter by status "in_review" shows VRD-2025-000001
- Case detail for VRD-2025-000001: all 4 tabs render with data
- CustodyTimeline shows 12 seed custody entries in chronological order
- Analytics charts render with seed data (5 cases distributed across types)
- "Generate Report" on VRD-2025-000004 downloads a PDF

**Commit Message:** `feat: build all authenticated dashboard pages — cases, reports, analytics, admin with real api integration`

---

### PHASE 7 PROMPTS

---

### AG-07-A: UI Polish — Loading States, Toasts, Empty States

**Goal:** Add all loading skeletons, toast notifications, empty states, and error states to every page.

**Files to Modify:**
- All pages in `src/pages/`
- `src/components/ui/SkeletonLoader.tsx`
- `src/components/ui/EmptyState.tsx`
- `src/components/ui/ErrorState.tsx`
- `src/components/cases/CaseTable.tsx`
- All dashboard components that fetch data

**Files Not to Touch:** Backend files, `App.tsx`, layout components, `tailwind.config.ts`.

**Exact Task:**
1. `SkeletonLoader.tsx`: Several skeleton variants — `TableSkeleton` (n rows × m cols), `CardSkeleton`, `StatsSkeleton`. Use `animate-pulse` Tailwind class with slate-800 placeholder blocks.
2. `EmptyState.tsx`: Props: `icon, title, description, action?`. Centered layout with Lucide icon (large, muted), title, description, optional CTA button. Examples: "No Cases Yet", "No Evidence Uploaded", "No Analysis Run Yet", "No Reports Generated".
3. `ErrorState.tsx`: Props: `error: string, onRetry?`. Shows red-tinted card with AlertCircle icon, error message, optional Retry button.
4. Add `toast` notifications for all key actions using shadcn/ui Toast:
   - Case created: "Complaint submitted successfully. Case Number: VRD-..."
   - Evidence uploaded: "Evidence file uploaded. SHA-256 hash computed."
   - Analysis complete: "Analysis complete. Verdict: [verdict]"
   - Report generated: "Forensic report generated successfully."
   - Report downloaded: "Report download started."
   - Any error: red toast with error message
5. All list pages: show `TableSkeleton` while loading, `EmptyState` when list is empty, `ErrorState` on fetch error with retry button
6. All form submissions: disable submit button and show spinner while in-flight

**Constraints:**
- No new API calls — only UI state management changes
- All skeleton sizes must match the actual content dimensions
- Toasts must use shadcn/ui `useToast` hook (already installed)
- Toast duration: success = 4 seconds, error = 8 seconds

**Acceptance Criteria:**
- CaseListPage shows skeleton rows while fetching
- CaseListPage with no cases shows EmptyState with correct message
- Error in case fetch shows ErrorState with retry button
- Toast appears when citizen submits evidence
- Toast appears when analysis completes
- Toast appears (error) when network is disconnected and action fails

**Commit Message:** `feat: add loading skeletons, toast notifications, empty states, and error states to all pages`

---

### AG-07-B: Final Demo Prep and Seed Completion

**Goal:** Complete all seed data, pre-generate sample report, verify demo mode, and finalize README with correct quickstart commands.

**Files to Modify:**
- `backend/seed.py` (add analysis results + reports to seed)
- `backend/seed_data.json` (update with final seed spec)
- `README.md` (final quickstart commands)
- `demo_assets/` (pre-generate sample_report.pdf)

**Files Not to Touch:** All application code — this is data and docs only.

**Exact Task:**
1. Add 5 pre-computed analysis results to `seed.py` for cases VRD-2025-000001 through VRD-2025-000004 and one evidence item of VRD-2025-000005. Use realistic values:
   - Case 001 (deepfake_video): confidence_score=0.91, verdict="likely_fake", model_used="video_frame_sampling_v1"
   - Case 002 (fake_document): confidence_score=0.73, verdict="suspicious", model_used="metadata_ocr_ela_pipeline_v1"
   - Case 003 (voice_clone): confidence_score=0.68, verdict="suspicious", model_used="librosa_heuristic_v1"
   - Case 004 (deepfake_image): confidence_score=0.88, verdict="likely_fake", model_used="prithivMLmods/Deepfake-Detect-Siglip2"
   - Case 005 (synthetic_identity): confidence_score=0.31, verdict="authentic", model_used="metadata_ocr_ela_pipeline_v1"
2. Add 1 report record to seed for VRD-2025-000004 (report_generated status case)
3. Run the full backend with seed data, use `POST /api/cases/{id}/report` to generate a real PDF, save it to `demo_assets/sample_report.pdf`
4. Test `DEMO_MODE=true` end-to-end: analysis returns instantly, all dashboard data from seed shows correctly
5. Test `python seed.py --reset && uvicorn app.main:app --reload` — backend ready in < 10 seconds
6. Update `README.md` quickstart section with actual working commands from Section 5 of this document
7. Add to README: "Demo Mode: Set DEMO_MODE=true in backend/.env for presentation mode without AI model loading"

**Constraints:**
- `demo_assets/sample_report.pdf` must be generated from real seed data (not fabricated)
- `seed.py --reset` must be fast (< 5 seconds)
- README quickstart commands must be tested and verified on Windows

**Acceptance Criteria:**
- `python seed.py --reset` completes in < 5 seconds with all demo data
- `DEMO_MODE=true`: full demo flow (submit → analyze → report) completes in < 2 minutes
- `demo_assets/sample_report.pdf` exists and is a valid PDF with all 7 sections
- README quickstart commands work verbatim on a fresh machine

**After changes, modified files summary:** `backend/seed.py`, `backend/seed_data.json`, `README.md`, `demo_assets/sample_report.pdf`

**Commit Message:** `feat: finalize demo seed data, pre-generate sample report, update readme with working quickstart`

---

### AG-07-C: Final End-to-End Integration Test

**Goal:** Run the complete demo flow from a fresh seed state, fix any remaining issues, and prepare the demo-ready build.

**Exact Task:**
This is a verification prompt, not a code-generation prompt. Use this as a testing checklist:

```
1. python seed.py --reset  → verify success in < 5s
2. uvicorn app.main:app --reload  → verify starts, /api/health returns OK
3. npm run dev  → verify starts on localhost:5173
4. Browser: / → landing page loads, no console errors
5. Browser: /submit → wizard loads
6. Complete wizard with demo file → verify case number and SHA-256 shown
7. Browser: /login as inv1@veridact.local / demo1234 → verify role routing to /dashboard
8. Dashboard: verify 2 assigned cases visible (VRD-2025-000001, VRD-2025-000002)
9. Open VRD-2025-000001 → verify all 4 tabs load
10. Evidence tab → click Analyze → verify loading state → verify result shown
11. Generate Report → verify PDF downloads and contains all 7 sections
12. Custody tab → verify all events in timeline
13. Browser: /track/VRD-2025-000001 → verify public case status shown
14. Login as admin@veridact.local → verify /admin loads with all 5 cases
15. Admin → Users → verify 6 users listed
16. DEMO_MODE=true in .env → restart uvicorn → re-run steps 10-11 → verify instant result
17. npm run build → verify no TypeScript errors
```

Fix any issues found. Commit all fixes.

**Commit Message:** `fix: end-to-end integration test fixes — demo-ready state`

---

*End of Master Antigravity Megaprompt Sequence — Phase 0 through Phase 7*

---

*Document 06 End*

*VERIDACT — "See Through the Fake. Secure the Truth."*