# VERIDACT — AI Forensic Evidence Platform
# Document 02: Technical Requirements Document (TRD)

> **Tagline:** "See Through the Fake. Secure the Truth."
> **Version:** 1.0 — Hackathon MVP
> **Last Updated:** 2025
> **Status:** Active

---

## Table of Contents

1. [Technical Overview](#1-technical-overview)
2. [Recommended Tech Stack](#2-recommended-tech-stack)
3. [AI/ML Model Blueprint](#3-aiml-model-blueprint)
4. [System Architecture Diagram](#4-system-architecture-diagram)
5. [API Requirements](#5-api-requirements)
6. [Frontend Technical Structure](#6-frontend-technical-structure)
7. [Backend Technical Structure](#7-backend-technical-structure)
8. [Environment Variables](#8-environment-variables)
9. [Security Requirements](#9-security-requirements)
10. [Testing Requirements](#10-testing-requirements)
11. [No Merge Conflict Strategy](#11-no-merge-conflict-strategy)
12. [Antigravity Megaprompt Sequence](#12-antigravity-megaprompt-sequence)

---

## 1. Technical Overview

VERIDACT is a **localhost-first, full-stack web application** composed of four layers:

### Layer 1: React Frontend
A single-page application (SPA) built with React + Vite + TypeScript. It handles routing, role-based page access, form validation, evidence upload, and visualization of AI results. All communication to the backend is through Axios HTTP calls to the FastAPI backend. The frontend runs on `http://localhost:5173` in development.

### Layer 2: FastAPI Backend
A Python REST API built with FastAPI and Uvicorn. It handles authentication (JWT), file uploads, database operations, AI inference orchestration, PDF report generation, and chain-of-custody logging. The backend runs on `http://localhost:8000` in development.

### Layer 3: SQLite Database
A file-based relational database managed via SQLAlchemy ORM. The database file (`veridact.db`) lives in the `backend/` directory. All schema management is done via SQLAlchemy's `create_all()` in development; Alembic migrations are introduced in the post-hackathon phase.

### Layer 4: Local AI Inference Service
A set of Python modules inside `backend/app/services/ai/` that perform evidence analysis. Each module handles one evidence type (image, video, audio, document) and returns a normalized result object. Models are downloaded from Hugging Face Hub on first run and cached locally in `~/.cache/huggingface/`. The AI layer is entirely within the backend process — no separate microservice is needed for the hackathon MVP.

### Local File Storage
Uploaded evidence files, generated heatmaps, and forensic PDF reports are stored in the local `uploads/` directory at the project root. Files are accessed via authenticated backend endpoints only — never served directly from the filesystem URL.

### Authentication Flow
JWT-based stateless authentication. Tokens are issued on login, stored in `localStorage` on the frontend, and sent as `Bearer` tokens in the `Authorization` header on every API request. Token expiry is 8 hours. Role is embedded in the JWT payload for fast access control checks.

### Localhost Execution Model
The entire stack runs on a single laptop:
- `cd backend && uvicorn app.main:app --reload` → Backend on port 8000
- `cd frontend && npm run dev` → Frontend on port 5173
- No Docker, no Kubernetes, no cloud services required for demo

### Optional Future Cloud Deployment
After the hackathon, VERIDACT could be deployed using:
- Backend: Railway, Render (free tier), or any VPS
- Frontend: Vercel (free tier) or Netlify
- Database: PostgreSQL on Supabase (free tier) or Railway
- File Storage: Supabase Storage or AWS S3
- AI: GPU-enabled cloud function or Modal.com for inference

None of these are required for the hackathon.

---

## 2. Recommended Tech Stack

### Frontend Stack

#### React 18 + Vite 5 + TypeScript 5
- **Why chosen:** Vite provides instant HMR and fast builds. TypeScript prevents type errors early. React has the largest ecosystem for UI component libraries. This combination is the modern standard for fast SPA development.
- **Free:** Yes
- **Works on localhost:** Yes — `npm run dev` starts a dev server instantly
- **Beginner-friendly:** Yes for React familiarity; Vite setup is minimal
- **Alternative:** Next.js (more complex for localhost demo, SSR overhead not needed here)

#### Tailwind CSS 3
- **Why chosen:** Utility-first CSS enables rapid UI development without writing custom CSS files. Works perfectly with shadcn/ui. All styling is in the component files.
- **Free:** Yes
- **Works on localhost:** Yes — PostCSS plugin
- **Beginner-friendly:** Yes after initial config
- **Alternative:** CSS Modules (more boilerplate), Styled Components (more overhead)

#### shadcn/ui
- **Why chosen:** Pre-built, accessible, Tailwind-based components (Button, Card, Dialog, Table, Badge, Input, Select, Toast). Not a component library you install — you copy components into your project and own them. Perfect for hackathons because you pick exactly what you need.
- **Free:** Yes — MIT license
- **Works on localhost:** Yes
- **Beginner-friendly:** Yes — copy-paste components with full control
- **Alternative:** Radix UI (lower level), MUI (heavier, different styling paradigm)

#### React Router v6
- **Why chosen:** Standard client-side routing for React SPAs. Declarative route definitions, nested routes, and route-based lazy loading.
- **Free:** Yes
- **Works on localhost:** Yes
- **Alternative:** TanStack Router (newer, more TypeScript-native)

#### Axios
- **Why chosen:** Cleaner interceptor pattern for adding JWT headers to every request automatically. Better error handling than raw `fetch()`.
- **Free:** Yes
- **Works on localhost:** Yes
- **Alternative:** native `fetch()` with a wrapper function (acceptable if team prefers)

#### Recharts
- **Why chosen:** The most React-native charting library. Simple API for bar charts, line charts, pie charts. Used for analytics dashboard.
- **Free:** Yes
- **Works on localhost:** Yes
- **Alternative:** Chart.js with react-chartjs-2

#### Framer Motion
- **Why chosen:** Smooth page transitions and component animations with minimal configuration. Prevents the "flat hackathon UI" problem. Used sparingly — only for page entry animations and confidence score meters.
- **Free:** Yes
- **Works on localhost:** Yes
- **Alternative:** React Spring (more complex API)

#### React Hook Form + Zod
- **Why chosen:** React Hook Form minimizes re-renders during form input. Zod provides TypeScript-native runtime schema validation. Together they give clean, fast, typed form handling.
- **Free:** Yes
- **Works on localhost:** Yes
- **Alternative:** Formik + Yup (more popular but more re-renders)

---

### Backend Stack

#### Python 3.11+
- **Why chosen:** Best ecosystem for AI/ML libraries. FastAPI is Python-native. All inference libraries (transformers, torch, librosa, tesseract wrappers) are Python.
- **Free:** Yes
- **Works on localhost:** Yes
- **Alternative:** Node.js (far worse AI/ML ecosystem)

#### FastAPI 0.110+
- **Why chosen:** Async-first, automatic OpenAPI docs at `/docs`, Pydantic integration for request/response validation, extremely fast for Python. Ideal for hackathons because of auto-documentation.
- **Free:** Yes
- **Works on localhost:** Yes
- **Beginner-friendly:** Yes — decorator-based routes similar to Flask
- **Alternative:** Flask (more setup for async, no auto-docs), Django (too heavy)

#### Uvicorn
- **Why chosen:** ASGI server for FastAPI. Single command startup: `uvicorn app.main:app --reload`. The `--reload` flag auto-restarts on code changes.
- **Free:** Yes
- **Works on localhost:** Yes

#### SQLAlchemy 2.0 + SQLite
- **Why chosen:** SQLAlchemy provides a full ORM with relationship management, query building, and connection pooling. SQLite runs as a single file with no server process. Perfect for hackathon demos where database setup complexity must be zero.
- **Free:** Yes
- **Works on localhost:** Yes — no external DB server needed
- **Migration path:** SQLAlchemy works identically with PostgreSQL; changing `DATABASE_URL` in `.env` is sufficient for migration
- **Alternative:** SQLModel (wraps SQLAlchemy with Pydantic, slightly less mature), Tortoise ORM

#### Pydantic v2
- **Why chosen:** FastAPI uses Pydantic for all request and response validation. Pydantic v2 is significantly faster than v1. Provides automatic JSON serialization, field validation, and OpenAPI schema generation.
- **Free:** Yes

#### Python-jose + Passlib (JWT + Password Hashing)
- **Why chosen:** `python-jose` handles JWT creation, signing (HS256), and verification. `passlib[bcrypt]` provides bcrypt password hashing. Both are lightweight, well-tested, and standard for FastAPI auth.
- **Free:** Yes
- **Works on localhost:** Yes

#### ReportLab
- **Why chosen:** Pure Python PDF generation library. Generates PDF from code with full control over layout, tables, fonts, and colors. No headless browser needed. Fast (~1–3 seconds per report).
- **Free:** Yes
- **Works on localhost:** Yes
- **Alternative:** WeasyPrint (renders HTML to PDF, good for templated reports but requires system dependencies), FPDF2

#### Python-multipart
- **Why chosen:** Required by FastAPI for `multipart/form-data` file uploads.
- **Free:** Yes

---

### AI/ML Libraries

#### transformers (Hugging Face)
- **Why chosen:** Provides `AutoModelForImageClassification`, `AutoFeatureExtractor`, and pipeline wrappers for loading pretrained deepfake detection models.
- **Free:** Yes
- **Works on localhost:** Yes — models downloaded to `~/.cache/huggingface/` on first run
- **Requires API key:** Only if using gated models (our chosen models are not gated)

#### torch (PyTorch CPU)
- **Why chosen:** Required by most Hugging Face vision models. CPU-only version is ~200MB and runs on any laptop without GPU.
- **Free:** Yes
- **Works on localhost:** Yes (CPU inference, slower but functional)
- **Install:** `pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu`

#### OpenCV (opencv-python-headless)
- **Why chosen:** Frame extraction from video files. The headless version has no GUI dependencies — perfect for server-side use.
- **Free:** Yes
- **Works on localhost:** Yes

#### Pillow
- **Why chosen:** Image loading, resizing, preprocessing, and ELA (Error Level Analysis) computation.
- **Free:** Yes

#### librosa
- **Why chosen:** Audio feature extraction (MFCC, spectral centroid, mel spectrogram). Used for the audio analysis fallback heuristic.
- **Free:** Yes
- **Works on localhost:** Yes

#### pytesseract + tesseract-ocr (system)
- **Why chosen:** OCR text extraction from images and documents. `pytesseract` is the Python wrapper; `tesseract-ocr` is the system binary (installable via `apt-get` on Ubuntu or `brew` on macOS).
- **Free:** Yes
- **Works on localhost:** Yes — system dependency, must be installed before Python package

#### PyMuPDF (fitz)
- **Why chosen:** PDF metadata extraction, page rendering, and embedded image access. Essential for document forgery analysis.
- **Free:** Yes (AGPL license; acceptable for hackathon use)

#### python-docx
- **Why chosen:** DOCX file metadata extraction and content analysis.
- **Free:** Yes

#### python-magic
- **Why chosen:** MIME type detection from file content (not just extension). Security-critical for file upload validation.
- **Free:** Yes — wraps `libmagic` system library

---

### Database

#### SQLite (via SQLAlchemy)
- **Database file:** `backend/veridact.db`
- **Connection string:** `sqlite:///./veridact.db`
- **WAL mode:** Enabled on startup for better concurrent read performance
- **Free:** Yes — built into Python
- **Works on localhost:** Yes — no server process needed
- **Migration to PostgreSQL:** Change `DATABASE_URL` in `.env`, install `psycopg2-binary`, run Alembic migrations

---

## 3. AI/ML Model Blueprint

### Task 1: Image Deepfake Detection

| Attribute | Value |
|---|---|
| Task | Classify an image as AI-generated/fake or authentic |
| Recommended MVP Model | `prithivMLmods/Deepfake-Detect-Siglip2` |
| Source | Hugging Face Hub (https://huggingface.co/prithivMLmods/Deepfake-Detect-Siglip2) |
| Free | Yes — Apache 2.0 license |
| Local Inference | Yes — via `transformers` pipeline |
| API Key Required | No — public model, no gated access |
| Input Format | PIL Image (RGB), resized to 224x224 |
| Output Format | `[{"label": "REAL", "score": 0.13}, {"label": "FAKE", "score": 0.87}]` |
| Hardware Requirement | CPU: ~10–20s per image. GPU: ~1–2s. 2GB RAM minimum. |
| Fallback Model | `Wvolf/ViT_Deepfake_Detection` (same format, different architecture) |
| Demo Fallback (if both fail) | Hash-based deterministic score: files starting with hash `0`–`7` → `authentic`, `8`–`f` → `suspicious/likely_fake` |
| MVP Recommendation | Use `prithivMLmods/Deepfake-Detect-Siglip2` as primary. Pre-download before demo. |

**Implementation Notes:**
```python
from transformers import pipeline
detector = pipeline("image-classification", model="prithivMLmods/Deepfake-Detect-Siglip2")
result = detector(pil_image)
# result = [{"label": "FAKE", "score": 0.87}, {"label": "REAL", "score": 0.13}]
fake_score = next(r["score"] for r in result if r["label"] == "FAKE")
```

---

### Task 2: Video Deepfake Detection

| Attribute | Value |
|---|---|
| Task | Analyze video frames for deepfake artifacts |
| Approach | Frame sampling with OpenCV + image detector per frame |
| Local Inference | Yes |
| API Key Required | No |
| Input Format | Video file path (MP4 preferred) |
| Frame Sampling | 10 evenly-spaced frames from the video |
| Per-Frame Analysis | Same pipeline as Task 1 |
| Aggregation | Mean of frame fake_scores; if >50% frames score >0.7, verdict = `likely_fake` |
| Output Format | `{confidence_score, verdict, frames_analyzed, frame_scores[], explanation}` |
| Hardware Requirement | Same as image detector × frame count |
| Fallback | If video cannot be read, return `inconclusive` with explanation |
| MVP Recommendation | This is sufficient for demo. No separate video model needed. |

---

### Task 3: Audio Voice Clone / Spoofing Detection

| Attribute | Value |
|---|---|
| Task | Detect signs of voice cloning or text-to-speech synthesis in audio |
| Recommended MVP Model (Optional) | `microsoft/wavlm-base` or `facebook/wav2vec2-base` with spoofing adapter |
| Source | Hugging Face Hub |
| Free | Yes |
| Local Inference | Yes but heavy (~700MB, ~30s load time on CPU) |
| API Key Required | No |
| Input Format | Audio waveform array at 16kHz sample rate |
| Primary MVP Approach | Heuristic fallback using `librosa` MFCC analysis |
| Heuristic Logic | Extract MFCC, check pitch variance, spectral flatness, zero-crossing rate. Abnormally uniform patterns suggest synthesis. |
| Output Format | `{confidence_score, verdict, explanation, duration_seconds, model_used: "librosa_heuristic_v1"}` |
| Hardware Requirement | librosa heuristic: <2s on any laptop |
| Fallback | If audio cannot be loaded, return `inconclusive` |
| MVP Recommendation | Use librosa heuristic for demo. Document wav2vec2 option as future enhancement. |

---

### Task 4: Document Forgery Detection

| Attribute | Value |
|---|---|
| Task | Detect metadata manipulation, content inconsistencies, and ELA artifacts in documents |
| Tools Used | PyMuPDF, python-docx, pytesseract, Pillow (ELA), python-magic |
| Free | Yes — all tools are free and local |
| Local Inference | Yes |
| API Key Required | No |
| Input Format | File path (.pdf, .docx, .xlsx, .txt, .jpg) |
| Analysis Steps | 1. MIME validation 2. Metadata extraction (author, created, modified, software) 3. Metadata consistency checks 4. OCR on image regions 5. ELA on embedded images |
| ELA Logic | Re-save image at quality=95, subtract from original, amplify differences. High ELA residuals in specific regions suggest localized manipulation. |
| Output Format | `{confidence_score, verdict, metadata_flags[], ocr_text_preview, explanation, model_used: "metadata_ocr_ela_pipeline"}` |
| Suspicious Metadata Flags | `date_mismatch`, `blank_author`, `manipulation_tool_detected`, `gps_inconsistency`, `high_ela_residual` |
| MVP Recommendation | Full implementation — all tools are fast and reliable |

---

### Task 5: Face Detection (Pre-processing Helper)

| Attribute | Value |
|---|---|
| Task | Detect faces in images before running deepfake analysis |
| Recommended Model | OpenCV Haar Cascade (`haarcascade_frontalface_default.xml`) |
| Free | Yes — bundled with OpenCV |
| Local Inference | Yes |
| API Key Required | No |
| Input Format | Grayscale OpenCV image |
| Output Format | `{face_detected: bool, face_count: int, bounding_boxes: [[x,y,w,h]...]}` |
| Fallback | Skip face detection; run deepfake analysis on full image |
| MVP Recommendation | Use as pre-step for image analysis only if time permits |

---

### Task 6: Heatmap / Visual Explanation (Good-to-Have)

| Attribute | Value |
|---|---|
| Task | Generate a visual heatmap showing which image regions triggered the deepfake detection |
| Approach | Grad-CAM (Gradient-weighted Class Activation Mapping) |
| Library | `pytorch-grad-cam` (free, local) |
| Free | Yes |
| Local Inference | Yes — uses the same model as Task 1 |
| Output Format | Overlay PNG image saved to `uploads/heatmaps/{evidence_id}_heatmap.png` |
| MVP Recommendation | Good-to-have. Implement only after core pipeline is working. |

---

## 4. System Architecture Diagram

```
╔══════════════════════════════════════════════════════════════════════════╗
║                        VERIDACT — System Architecture                   ║
║                         localhost:5173 (Frontend)                       ║
╚══════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────┐
│                         BROWSER (React + Vite)                          │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ Landing Page │  │  Auth Pages  │  │  Dashboards  │  │  Citizen   │ │
│  │     /        │  │ /login       │  │  /dashboard  │  │  /submit   │ │
│  │              │  │ /register    │  │  /dashboard  │  │  /track    │ │
│  └──────────────┘  └──────────────┘  │  /cases/*    │  └────────────┘ │
│                                      │  /admin/*    │                  │
│                                      └──────────────┘                  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     React Router v6                              │   │
│  │              Protected Routes + Role Guards                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌──────────────────────────┐  ┌──────────────────────────────────┐   │
│  │    Axios HTTP Client     │  │      React State (useState)       │   │
│  │  JWT Bearer Token Auth   │  │   + React Context (AuthContext)   │   │
│  └──────────┬───────────────┘  └──────────────────────────────────┘   │
└─────────────┼───────────────────────────────────────────────────────────┘
              │ HTTP/REST (localhost:8000)
              │ CORS: http://localhost:5173
              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    FASTAPI BACKEND (localhost:8000)                      │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      Middleware Layer                             │  │
│  │    CORS │ JWT Auth Dependency │ Request Logging │ Error Handler   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌───────────────────┐  │
│  │ auth.py    │ │ cases.py   │ │evidence.py │ │   analysis.py     │  │
│  │ /api/auth/ │ │ /api/cases/│ │/api/cases/ │ │/api/evidence/{id} │  │
│  │            │ │            │ │{id}/evidence│ │  /analyze         │  │
│  └────────────┘ └────────────┘ └────────────┘ └───────────────────┘  │
│                                                                         │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                         │
│  │ reports.py │ │custody.py  │ │  admin.py  │                         │
│  │/api/cases/ │ │/api/cases/ │ │/api/admin/ │                         │
│  │{id}/report │ │{id}/custody│ │            │                         │
│  └────────────┘ └────────────┘ └────────────┘                         │
│                                                                         │
│  ┌─────────────────── SERVICE LAYER ────────────────────────────────┐  │
│  │                                                                   │  │
│  │  auth_service.py    case_service.py    evidence_service.py       │  │
│  │  custody_service.py report_service.py                            │  │
│  │                                                                   │  │
│  │  ┌──────────────────── AI INFERENCE LAYER ────────────────────┐  │  │
│  │  │  router.py        ← detects file type, routes to correct   │  │  │
│  │  │  image_detector.py  ← transformers + SigLIP2              │  │  │
│  │  │  video_detector.py  ← OpenCV + image_detector             │  │  │
│  │  │  audio_detector.py  ← librosa heuristic / wav2vec2        │  │  │
│  │  │  document_detector.py ← PyMuPDF + pytesseract + ELA       │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  │                                                                   │  │
│  │  ┌──────────────────── UTILITIES ─────────────────────────────┐  │  │
│  │  │  hashing.py (SHA-256)  │  file_validation.py  │  pdf.py   │  │  │
│  │  │  security.py (JWT)     │                                   │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────── DATA LAYER ────────────────────────────────────┐ │
│  │                   SQLAlchemy ORM                                  │ │
│  │  user.py  case.py  evidence.py  analysis_result.py               │ │
│  │  custody_log.py  report.py  case_note.py                         │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐
│  SQLite Database │  │  uploads/        │  │ HuggingFace Cache    │
│  veridact.db     │  │  evidence/       │  │ ~/.cache/huggingface │
│                  │  │  heatmaps/       │  │ (model weights)      │
│  7 tables        │  │  reports/        │  │ ~2–4 GB on disk      │
└──────────────────┘  └──────────────────┘  └──────────────────────┘
```

---

## 5. API Requirements

### Health

#### GET /api/health

- **Purpose:** Check that the backend is running
- **Request Body:** None
- **Response Body:** `{"status": "ok", "version": "1.0.0", "timestamp": "2025-..."}`
- **Auth Required:** No
- **Roles:** Public
- **DB Table:** None
- **Error Cases:** 500 if server is down (by definition)

---

### Authentication

#### POST /api/auth/register

- **Purpose:** Register a new user account
- **Request Body:** `{"email": string, "password": string, "name": string, "role": "citizen" | "investigator", "organization": string|null}`
- **Response Body:** `{"id": string, "email": string, "name": string, "role": string, "created_at": string}`
- **Auth Required:** No (public registration for citizen role; admin creates other roles)
- **Roles:** Public
- **DB Table:** `users` (INSERT)
- **Error Cases:** 409 if email already exists; 422 if validation fails; role must be `citizen` for self-registration

#### POST /api/auth/login

- **Purpose:** Authenticate a user and return a JWT token
- **Request Body:** `{"email": string, "password": string}`
- **Response Body:** `{"access_token": string, "token_type": "bearer", "user": {id, email, name, role, organization}}`
- **Auth Required:** No
- **Roles:** Public
- **DB Table:** `users` (SELECT)
- **Error Cases:** 401 if credentials invalid; 403 if user is inactive

#### GET /api/auth/me

- **Purpose:** Get current authenticated user details
- **Request Body:** None (JWT in header)
- **Response Body:** `{"id": string, "email": string, "name": string, "role": string, "organization": string|null, "created_at": string}`
- **Auth Required:** Yes
- **Roles:** All authenticated roles
- **DB Table:** `users` (SELECT by id from JWT)
- **Error Cases:** 401 if token invalid or expired

#### POST /api/auth/logout

- **Purpose:** Client-side logout acknowledgment (JWT is stateless — actual invalidation is on client)
- **Request Body:** None
- **Response Body:** `{"message": "Logged out successfully"}`
- **Auth Required:** Yes
- **Roles:** All authenticated roles
- **DB Table:** None
- **Notes:** For MVP, logout is purely client-side token deletion. Token blacklisting is future scope.

---

### Cases

#### POST /api/cases

- **Purpose:** Create a new case (citizen evidence submission or investigator-created case)
- **Request Body:** `{"title": string, "description": string, "complaint_type": string, "contact_email": string|null, "contact_phone": string|null, "location": string|null}`
- **Response Body:** Full case object including `case_number` (VRD-YYYY-NNNNNN format)
- **Auth Required:** No (citizen submission) or Yes (authenticated submission)
- **Roles:** Public (citizen), investigator, supervisor, super_admin
- **DB Tables:** `cases` (INSERT), `custody_logs` (INSERT: `case_created`)
- **Error Cases:** 422 if required fields missing

#### GET /api/cases

- **Purpose:** Get paginated list of cases filtered by role
- **Request Body:** None; Query params: `?status=`, `?complaint_type=`, `?priority=`, `?search=`, `?page=`, `?limit=`
- **Response Body:** `{"cases": [...], "total": int, "page": int, "limit": int}`
- **Auth Required:** Yes
- **Roles:** investigator (own assigned), supervisor (department), super_admin (all)
- **DB Tables:** `cases` (SELECT with filters and role-based WHERE)
- **Error Cases:** 401 if not authenticated

#### GET /api/cases/{case_id}

- **Purpose:** Get full case detail including linked evidence, notes, and analysis results
- **Response Body:** Full case object + `evidence[]`, `notes[]`, `analysis_summary[]`
- **Auth Required:** Yes
- **Roles:** investigator (assigned only), supervisor, super_admin
- **DB Tables:** `cases`, `evidence`, `case_notes`, `analysis_results` (SELECT)
- **Error Cases:** 404 if case not found; 403 if investigator accesses unassigned case

#### PATCH /api/cases/{case_id}

- **Purpose:** Update case status, priority, assignment, or add notes
- **Request Body:** `{"status": string|null, "priority": string|null, "assigned_to": string|null, "note": string|null}`
- **Response Body:** Updated case object
- **Auth Required:** Yes
- **Roles:** investigator (status updates only), supervisor (all updates), super_admin (all updates)
- **DB Tables:** `cases` (UPDATE), `custody_logs` (INSERT: `case_updated`)
- **Error Cases:** 403 if investigator tries to reassign; 422 if invalid status transition

#### DELETE /api/cases/{case_id}

- **Purpose:** Soft-delete a case (sets status to `closed`, does not remove from DB)
- **Auth Required:** Yes
- **Roles:** super_admin only
- **DB Tables:** `cases` (UPDATE status = `closed`), `custody_logs` (INSERT: `case_closed`)

---

### Evidence

#### POST /api/cases/{case_id}/evidence

- **Purpose:** Upload an evidence file to a case
- **Request Body:** `multipart/form-data` with `file` field
- **Response Body:** Evidence object with `id`, `sha256_hash`, `stored_filename`, `file_type`, `file_size`
- **Auth Required:** No (for citizen submission via public case ID) or Yes
- **Roles:** Public (for own submission), investigator, supervisor, super_admin
- **DB Tables:** `evidence` (INSERT), `custody_logs` (INSERT: `evidence_uploaded`)
- **Processing:** Compute SHA-256 hash server-side; save to `uploads/evidence/{uuid}.{ext}`
- **Error Cases:** 413 if file too large; 415 if unsupported MIME type; 404 if case not found

#### GET /api/cases/{case_id}/evidence

- **Purpose:** List all evidence for a case
- **Auth Required:** Yes
- **Roles:** investigator (assigned), supervisor, super_admin
- **DB Tables:** `evidence` (SELECT WHERE case_id)

#### GET /api/evidence/{evidence_id}

- **Purpose:** Get single evidence metadata + linked analysis result if exists
- **Auth Required:** Yes
- **Roles:** investigator (assigned case), supervisor, super_admin
- **DB Tables:** `evidence`, `analysis_results` (SELECT)
- **Side Effect:** `custody_logs` INSERT: `evidence_accessed`

#### DELETE /api/evidence/{evidence_id}

- **Purpose:** Remove evidence from a case (file deleted from disk and DB)
- **Auth Required:** Yes
- **Roles:** super_admin only
- **DB Tables:** `evidence` (DELETE), `custody_logs` (INSERT)

---

### Analysis

#### POST /api/evidence/{evidence_id}/analyze

- **Purpose:** Trigger AI analysis on a specific evidence item
- **Request Body:** `{"force_rerun": bool}` (optional; default false)
- **Response Body:** `{"task_started": true, "analysis_id": string, "status": "processing"}`
- **Auth Required:** Yes
- **Roles:** investigator, supervisor, super_admin
- **DB Tables:** `analysis_results` (INSERT with status=`pending`), `custody_logs` (INSERT: `analysis_started`)
- **Processing:** Synchronous in MVP (no background queue); result is returned after analysis completes
- **For MVP:** Analysis runs synchronously and returns `{"status": "completed", "result": {...}}`
- **Error Cases:** 404 if evidence not found; 409 if analysis already in progress; 415 if file type unsupported

#### GET /api/evidence/{evidence_id}/results

- **Purpose:** Get the analysis result for a specific evidence item
- **Auth Required:** Yes
- **Roles:** investigator (assigned), supervisor, super_admin
- **DB Tables:** `analysis_results` (SELECT WHERE evidence_id)
- **Response Body:** Full analysis result object with confidence_score, verdict, explanation, heatmap_path

---

### Reports

#### POST /api/cases/{case_id}/report

- **Purpose:** Generate a forensic PDF report for a case
- **Request Body:** `{"report_type": "forensic" | "summary" | "court_brief"}`
- **Response Body:** `{"report_id": string, "file_path": string, "sha256_hash": string, "generated_at": string}`
- **Auth Required:** Yes
- **Roles:** investigator, supervisor, super_admin
- **DB Tables:** `reports` (INSERT), `custody_logs` (INSERT: `report_generated`)
- **Processing:** Generates PDF using ReportLab, saves to `uploads/reports/`, computes report SHA-256 hash
- **Error Cases:** 404 if case not found; 500 if PDF generation fails

#### GET /api/reports/{report_id}

- **Purpose:** Download a previously generated report
- **Auth Required:** Yes
- **Roles:** investigator (own case), supervisor, super_admin
- **Response:** `FileResponse` (PDF file stream)
- **Side Effect:** `custody_logs` INSERT: `file_downloaded`

#### GET /api/cases/{case_id}/reports

- **Purpose:** List all reports generated for a case
- **Auth Required:** Yes
- **DB Tables:** `reports` (SELECT WHERE case_id)

---

### Custody

#### GET /api/cases/{case_id}/custody

- **Purpose:** Get chain-of-custody log for a specific case
- **Auth Required:** Yes
- **Roles:** investigator (assigned), supervisor, super_admin
- **DB Tables:** `custody_logs` (SELECT WHERE case_id, ORDER BY timestamp ASC)

#### GET /api/admin/custody

- **Purpose:** Get all custody logs system-wide (admin audit view)
- **Auth Required:** Yes
- **Roles:** super_admin only
- **Query Params:** `?user_id=`, `?action=`, `?from=`, `?to=`, `?page=`, `?limit=`
- **DB Tables:** `custody_logs` (SELECT with filters)

---

### Admin

#### GET /api/admin/users

- **Purpose:** List all users
- **Auth Required:** Yes
- **Roles:** super_admin only
- **DB Tables:** `users` (SELECT ALL)

#### PATCH /api/admin/users/{user_id}

- **Purpose:** Update user role, active status, or organization
- **Request Body:** `{"role": string|null, "is_active": bool|null, "organization": string|null}`
- **Auth Required:** Yes
- **Roles:** super_admin only
- **DB Tables:** `users` (UPDATE)

#### GET /api/admin/analytics

- **Purpose:** Get aggregated analytics data for admin/supervisor dashboard
- **Auth Required:** Yes
- **Roles:** supervisor, super_admin
- **Response Body:**
```json
{
  "total_cases": int,
  "cases_by_status": {"pending": int, "in_review": int, ...},
  "cases_by_type": {"deepfake_image": int, ...},
  "verdict_distribution": {"authentic": int, "suspicious": int, ...},
  "daily_submissions": [{"date": "2025-01-01", "count": int}, ...],
  "cases_last_7_days": int,
  "high_risk_cases": int
}
```
- **DB Tables:** `cases`, `analysis_results` (SELECT COUNT, GROUP BY aggregations)

---

### Public

#### GET /api/public/cases/{case_number}

- **Purpose:** Public case status lookup by case number (for citizen tracking)
- **Auth Required:** No
- **Rate Limit:** 10 requests/minute per IP
- **Response Body:** `{"case_number": str, "status": str, "created_at": str, "updated_at": str, "public_notes": [...]}`
- **Never Returns:** investigator name, evidence details, AI analysis, internal notes, file paths

---

## 6. Frontend Technical Structure

### Pages (`src/pages/`)

| Page | Route | Components Used |
|---|---|---|
| `LandingPage.tsx` | `/` | HeroSection, FeatureCards, HowItWorksSection, CTAButton |
| `LoginPage.tsx` | `/login` | LoginForm, AuthLayout |
| `RegisterPage.tsx` | `/register` | RegisterForm, AuthLayout |
| `SubmitEvidencePage.tsx` | `/submit` | SubmissionWizard (4 steps), FileUploadBox |
| `TrackCasePage.tsx` | `/track` | CaseTrackingForm |
| `TrackCaseResultPage.tsx` | `/track/:caseNumber` | CaseStatusCard, PublicProgressTimeline |
| `DashboardPage.tsx` | `/dashboard` | StatsCards, RecentCasesList, AlertsPanel |
| `CaseListPage.tsx` | `/dashboard/cases` | CaseTable, FilterBar, SearchInput, Pagination |
| `CaseDetailPage.tsx` | `/dashboard/cases/:caseId` | CaseHeader, EvidenceList, NotesList, CustodyTimeline |
| `EvidenceDetailPage.tsx` | `/dashboard/cases/:caseId/evidence/:evidenceId` | EvidenceCard, AnalysisResultCard, HeatmapViewer, ConfidenceMeter |
| `ReportsPage.tsx` | `/dashboard/reports` | ReportTable, GenerateReportButton |
| `AnalyticsPage.tsx` | `/dashboard/analytics` | StatsGrid, VerdictPieChart, DailyBarChart, CaseTypeChart |
| `AdminOverviewPage.tsx` | `/admin` | SystemStatsGrid, AlertBanner |
| `AdminUsersPage.tsx` | `/admin/users` | UserTable, EditUserModal |
| `AdminCustodyPage.tsx` | `/admin/custody` | CustodyLogTable, FilterBar |
| `AdminSettingsPage.tsx` | `/admin/settings` | SettingsForm |

### Components (`src/components/`)

**Layout:**
- `AppLayout.tsx` — Sidebar + topnav wrapper for authenticated pages
- `PublicLayout.tsx` — Minimal header/footer for landing and citizen pages
- `AuthLayout.tsx` — Centered card layout for login/register
- `Sidebar.tsx` — Role-aware navigation menu
- `TopNav.tsx` — User menu, notifications, theme toggle

**UI (shadcn/ui wrappers and custom):**
- `ConfidenceMeter.tsx` — Animated progress bar showing AI confidence score
- `VerdictBadge.tsx` — Color-coded badge (green/yellow/red/gray) for verdict values
- `FileUploadBox.tsx` — Drag-and-drop + click-to-upload evidence uploader
- `CustodyTimeline.tsx` — Vertical timeline of custody log events
- `HeatmapViewer.tsx` — Image with optional heatmap overlay
- `SHAHashDisplay.tsx` — Monospace display for SHA-256 hashes with copy button
- `CaseNumberDisplay.tsx` — Formatted VRD-YYYY-NNNNNN case number display
- `LoadingSpinner.tsx` — Centered loading indicator
- `ErrorBoundary.tsx` — React error boundary with fallback UI

**Evidence:**
- `EvidenceCard.tsx` — Card showing evidence file type, name, hash, status, analysis verdict
- `AnalysisResultCard.tsx` — Full AI result display (score, verdict, explanation, heatmap)

**Cases:**
- `CaseCard.tsx` — Summary card for case list view
- `CaseStatusBadge.tsx` — Colored badge for case status
- `PriorityBadge.tsx` — Colored badge for priority
- `CaseFilterBar.tsx` — Filter controls (status, type, priority, date range)

**Analytics:**
- `VerdictDistributionChart.tsx` — Recharts PieChart for verdict breakdown
- `DailySubmissionsChart.tsx` — Recharts BarChart for daily case volume
- `CaseTypeChart.tsx` — Recharts BarChart for complaint type distribution

### Services (`src/services/`)

```typescript
// apiClient.ts — Axios instance with JWT interceptor
// authService.ts — login(), register(), logout(), getMe()
// caseService.ts — createCase(), getCases(), getCase(), updateCase()
// evidenceService.ts — uploadEvidence(), getEvidence(), analyzeEvidence(), getResults()
// reportService.ts — generateReport(), getReport(), downloadReport(), getCaseReports()
// adminService.ts — getUsers(), updateUser(), getAnalytics(), getCustodyLogs()
// publicService.ts — trackCase() (no auth)
```

### Hooks (`src/hooks/`)
- `useAuth.ts` — AuthContext consumer with login/logout/user state
- `useCases.ts` — Paginated case list with filters
- `useCase.ts` — Single case detail with evidence and notes
- `useAnalysis.ts` — Analysis polling and result state
- `useToast.ts` — shadcn/ui toast wrapper

### Types (`src/types/`)
- `user.types.ts` — User, Role, AuthState
- `case.types.ts` — Case, CaseStatus, ComplaintType, Priority
- `evidence.types.ts` — Evidence, EvidenceType, UploadStatus
- `analysis.types.ts` — AnalysisResult, Verdict, ProcessingStatus
- `custody.types.ts` — CustodyLog, CustodyAction
- `report.types.ts` — Report, ReportType
- `api.types.ts` — PaginatedResponse, ApiError, ApiResponse
- `constants.ts` — All constant arrays and enums

### State Management
- **No Redux** — React Context for auth state only
- Local component state via `useState` and `useReducer`
- Server state via Axios + custom hooks with local `useState` for loading/error/data
- Form state via React Hook Form

### Protected Routes
```tsx
// src/routes/ProtectedRoute.tsx
// Wraps routes that require authentication
// Checks JWT expiry from localStorage
// Redirects to /login if not authenticated

// src/routes/RoleRoute.tsx
// Wraps routes that require specific roles
// Redirects to /dashboard if authenticated but wrong role
```

---

## 7. Backend Technical Structure

### Routes (`backend/app/routes/`)

Each route file uses FastAPI `APIRouter` and is registered in `main.py`:
```python
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(cases_router, prefix="/api/cases", tags=["cases"])
app.include_router(evidence_router, prefix="/api", tags=["evidence"])
app.include_router(analysis_router, prefix="/api", tags=["analysis"])
app.include_router(reports_router, prefix="/api", tags=["reports"])
app.include_router(custody_router, prefix="/api", tags=["custody"])
app.include_router(admin_router, prefix="/api/admin", tags=["admin"])
app.include_router(public_router, prefix="/api/public", tags=["public"])
```

### Models (`backend/app/models/`)

SQLAlchemy declarative models, one file per table:
- `user.py` → `User` model
- `case.py` → `Case` model
- `evidence.py` → `Evidence` model
- `analysis_result.py` → `AnalysisResult` model
- `custody_log.py` → `CustodyLog` model
- `report.py` → `Report` model
- `case_note.py` → `CaseNote` model

All models inherit from `Base = declarative_base()` defined in `database.py`.

### Schemas (`backend/app/schemas/`)

Pydantic v2 schemas for request/response validation, one file per domain:
- `auth_schemas.py` — RegisterRequest, LoginRequest, LoginResponse, UserResponse
- `case_schemas.py` — CreateCaseRequest, UpdateCaseRequest, CaseResponse, CaseListResponse
- `evidence_schemas.py` — EvidenceResponse, EvidenceUploadResponse
- `analysis_schemas.py` — AnalyzeRequest, AnalysisResultResponse
- `report_schemas.py` — GenerateReportRequest, ReportResponse
- `custody_schemas.py` — CustodyLogResponse, CustodyLogListResponse
- `admin_schemas.py` — UpdateUserRequest, UserListResponse, AnalyticsResponse

### Middleware (`backend/app/main.py`)

```python
# CORS Middleware
app.add_middleware(CORSMiddleware, 
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"])

# Request ID Middleware (generates unique request ID for logging)
# Global Exception Handler (returns consistent JSON error format)
```

### Authentication Dependency

```python
# backend/app/utils/security.py
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    # Decode JWT, extract user_id and role
    # Query user from DB
    # Raise HTTPException 401 if invalid

def require_roles(*roles: str):
    # Returns a dependency that checks the current user's role
    # Usage: Depends(require_roles("super_admin", "supervisor"))
```

### AI Inference Modules (`backend/app/services/ai/`)

```python
# router.py
def route_analysis(evidence_path: str, file_type: str, evidence_id: str) -> AnalysisResultData:
    """Routes evidence to the correct detector based on file_type."""

# image_detector.py
def analyze_image(file_path: str) -> AnalysisResultData:
    """Loads model, preprocesses image, runs inference, returns normalized result."""

# video_detector.py  
def analyze_video(file_path: str) -> AnalysisResultData:
    """Extracts frames with OpenCV, runs image_detector on each, aggregates scores."""

# audio_detector.py
def analyze_audio(file_path: str) -> AnalysisResultData:
    """Extracts MFCC features with librosa, applies heuristic scoring."""

# document_detector.py
def analyze_document(file_path: str) -> AnalysisResultData:
    """Extracts metadata, runs OCR, applies ELA on images, returns risk score."""
```

All detectors return the same `AnalysisResultData` dataclass:
```python
@dataclass
class AnalysisResultData:
    confidence_score: float  # 0.0 to 1.0
    verdict: str             # authentic | suspicious | likely_fake | inconclusive
    explanation: str         # Human-readable explanation
    model_used: str          # Model identifier string
    model_version: str       # Version string
    heatmap_path: str | None # Path to heatmap image if generated
    raw_output: dict         # Full model output for debugging
```

### Upload Handling

```python
# backend/app/services/evidence_service.py
async def save_upload_file(upload_file: UploadFile, case_id: str) -> EvidenceSaveResult:
    # Validate MIME type with python-magic
    # Validate file extension
    # Validate file size
    # Generate UUID filename: {uuid}.{ext}
    # Stream file to uploads/evidence/{uuid}.{ext}
    # Compute SHA-256 hash during streaming
    # Return stored_path, sha256_hash, file_size, detected_file_type
```

### PDF Generation (`backend/app/utils/pdf.py`)

```python
def generate_forensic_report(case: Case, evidence_list: list, 
                              analysis_results: list, custody_logs: list,
                              investigator: User) -> tuple[bytes, str]:
    """
    Generates a forensic PDF using ReportLab.
    Returns (pdf_bytes, sha256_hash_of_pdf).
    PDF includes: header, case details, evidence table, analysis results,
    custody log table, disclaimer footer.
    """
```

### Error Handling

All routes return consistent error responses:
```json
{
  "detail": "Error message",
  "error_code": "CASE_NOT_FOUND",
  "timestamp": "2025-..."
}
```

HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request (invalid input)
- 401: Unauthorized (missing/invalid JWT)
- 403: Forbidden (valid JWT but wrong role)
- 404: Not Found
- 409: Conflict (duplicate email, etc.)
- 413: Payload Too Large (file upload)
- 415: Unsupported Media Type (invalid file type)
- 422: Unprocessable Entity (Pydantic validation failure)
- 429: Too Many Requests (rate limit)
- 500: Internal Server Error

---

## 8. Environment Variables

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
# SQLite for localhost MVP (no additional setup required)
DATABASE_URL=sqlite:///./veridact.db

# JWT Authentication
# Generate a strong secret: python -c "import secrets; print(secrets.token_hex(32))"
JWT_SECRET_KEY=your_very_long_random_secret_key_change_this
JWT_ALGORITHM=HS256
JWT_EXPIRE_HOURS=8

# File Upload
UPLOAD_DIR=../uploads
MAX_FILE_SIZE_MB=100
ALLOWED_ORIGINS=http://localhost:5173

# AI Model Configuration
# Set to true to use pre-scripted demo responses (no model needed)
DEMO_MODE=false

# Primary image deepfake model (downloaded from HuggingFace on first run)
IMAGE_MODEL_NAME=prithivMLmods/Deepfake-Detect-Siglip2

# Fallback image model
IMAGE_FALLBACK_MODEL=Wvolf/ViT_Deepfake_Detection

# If true, models are loaded from local cache only (no internet download during demo)
HF_HUB_OFFLINE=false

# HuggingFace token - OPTIONAL, only needed for gated models
# Our recommended models are NOT gated, so this is not required
HF_TOKEN_OPTIONAL=

# Gemini API - OPTIONAL, only for LLM-assisted report narrative (not required for MVP)
GEMINI_API_KEY_OPTIONAL=

# Tesseract OCR path (if not in system PATH)
# macOS with brew: /usr/local/bin/tesseract
# Ubuntu: /usr/bin/tesseract (usually auto-detected)
TESSERACT_CMD=tesseract

# Report Generation
REPORT_DIR=../uploads/reports

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_CITIZEN_TRACK=10/minute

# Demo
# Set to true to pre-seed the database on startup
AUTO_SEED_ON_STARTUP=true
```

### `frontend/.env.example`

```bash
# Frontend Environment Variables
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=VERIDACT
VITE_APP_TAGLINE=See Through the Fake. Secure the Truth.
VITE_DEMO_MODE=false
```

---

## 9. Security Requirements

### Password Security
- All passwords hashed with `bcrypt` at cost factor 12 (configurable via `BCRYPT_ROUNDS`)
- No plaintext passwords stored or logged anywhere
- Minimum password length: 8 characters (validated by Pydantic)
- Passwords never returned in API responses

### JWT Security
- Signed with HS256 algorithm using `JWT_SECRET_KEY` from environment
- Tokens expire after 8 hours (configurable)
- JWT payload contains: `sub` (user_id), `role`, `exp`
- Token must be provided as `Authorization: Bearer <token>` header
- All protected routes validate the token on every request
- No JWT refresh tokens in MVP (future scope)

### Role-Based Access Control
- Every protected route decorator includes `Depends(require_roles(...))`
- Role is checked from JWT payload (not re-queried from DB on every request for performance)
- Investigator routes verify that `case.assigned_to == current_user.id` before allowing access
- Citizens cannot access any authenticated endpoints

### File Upload Security
- MIME type validated using `python-magic` (reads file content, not just extension)
- File extension cross-checked against MIME type
- Maximum file size enforced before reading full file content
- Stored filename is always a UUID — never the user-provided filename
- Files are served via `FileResponse` with authentication check, never directly from URL path
- No path traversal possible in stored filenames (UUID format only)
- Upload directory is outside the web root

### Input Validation
- All request bodies validated by Pydantic v2 schemas
- String fields have `max_length` constraints
- SQL injection is prevented by SQLAlchemy ORM (parameterized queries)
- No `eval()` or `exec()` usage anywhere

### CORS Configuration
- In development: `allow_origins=["http://localhost:5173"]`
- In production (future): Strict origin whitelist
- No wildcard `*` in production

### API Rate Limiting
- Citizen case tracking endpoint: 10 requests/minute per IP
- Login endpoint: 5 attempts/minute per IP (to prevent brute force)
- Implemented via `slowapi` library (free, FastAPI-compatible)

### No Hardcoded Secrets
- All secrets (JWT key, API keys) are in `.env` file
- `.env` is in `.gitignore`
- `.env.example` contains only placeholder values

### Chain-of-Custody Security
- Custody log entries are INSERT-only (no UPDATE or DELETE operations on this table)
- Every API action that touches evidence or changes case state creates a custody log entry
- IP address is extracted from `request.client.host` and stored in the log

---

## 10. Testing Requirements

### Unit Tests (`backend/tests/`)

```
backend/tests/
├── test_auth.py          — Register, login, JWT validation, role checks
├── test_cases.py         — Case creation, listing, role-based filtering
├── test_evidence.py      — Upload, hash computation, MIME validation
├── test_analysis.py      — AI pipeline routing, fallback behavior
├── test_reports.py       — PDF generation, hash verification
├── test_custody.py       — Log creation on every action
└── test_utils.py         — SHA-256 hashing, file validation utils
```

**Run command:** `cd backend && python -m pytest tests/ -v`

### API Tests (Manual with FastAPI /docs)

FastAPI provides automatic OpenAPI documentation at `http://localhost:8000/docs`. Use this to test every endpoint:
1. Call `POST /api/auth/login` with demo credentials → get token
2. Click "Authorize" in Swagger UI → paste token
3. Test every endpoint with valid and invalid inputs

### UI Tests (Manual Checklist)

For every page, verify:
- Page loads without console errors
- Loading states display correctly
- Empty states display correctly
- Error messages display correctly
- Forms validate on submit
- Success toasts appear
- Navigation works
- Back button behavior is correct

### AI Fallback Tests

1. Set `DEMO_MODE=true` in `.env`
2. Upload any image → verify analysis returns demo result without model
3. Set `HF_HUB_OFFLINE=true` → upload image → verify fallback triggers
4. Upload an audio file → verify heuristic analysis returns (not crash)
5. Upload a document → verify metadata extraction returns (not crash)

### Upload Tests

1. Upload a 1KB JPEG → verify hash computed correctly
2. Upload a 5MB MP4 → verify frame extraction works
3. Upload a file larger than `MAX_FILE_SIZE_MB` → verify 413 error
4. Upload a `.exe` file renamed as `.jpg` → verify MIME detection rejects it
5. Upload the same file twice → verify different UUIDs, same hash

### PDF Report Tests

1. Generate report for a case with 1 evidence item → verify PDF downloads
2. Open PDF → verify all sections are present
3. Verify disclaimer text appears in footer
4. Verify SHA-256 hash in report matches the stored evidence hash
5. Verify report's own SHA-256 hash is stored in the `reports` table

### Demo Checklist (Pre-Hackathon)

- [ ] Backend starts cleanly with `uvicorn app.main:app --reload`
- [ ] Database auto-seeds with demo data on startup
- [ ] Frontend starts cleanly with `npm run dev`
- [ ] Login works for all 4 demo user roles
- [ ] Citizen submission wizard completes and shows case number
- [ ] Investigator can see their assigned cases
- [ ] AI analysis completes for the demo image in `demo_assets/`
- [ ] PDF report downloads successfully
- [ ] Custody log shows all demo actions
- [ ] Citizen tracking page shows case status
- [ ] All pages render without console errors
- [ ] All demo sample files are present in `demo_assets/`
- [ ] `HF_HUB_OFFLINE=true` can be set without breaking the demo (fallback works)
- [ ] Pre-generated PDF report is available in `uploads/reports/` as backup

---

## 11. No Merge Conflict Strategy

### Technical Ownership Map

| Component | Owner | Key Files |
|---|---|---|
| Frontend routing + layout | Person A | `src/App.tsx`, `src/routes/`, `src/components/layout/` |
| Frontend pages — public/citizen | Person A | `LandingPage.tsx`, `SubmitEvidencePage.tsx`, `TrackCasePage.tsx` |
| Frontend pages — dashboard | Person A | `DashboardPage.tsx`, `CaseListPage.tsx`, `CaseDetailPage.tsx`, `EvidenceDetailPage.tsx` |
| Frontend services (API client) | Person A | `src/services/` |
| Frontend types | Person A | `src/types/` (shared, communicate changes) |
| Backend auth | Person B | `routes/auth.py`, `services/auth_service.py`, `utils/security.py` |
| Backend case + evidence APIs | Person B | `routes/cases.py`, `routes/evidence.py`, `services/` |
| Backend database schema | Person B | `models/`, `database.py`, `schemas/` |
| Backend seed data | Person B + D | `seed.py`, `seed_data.json` |
| AI image detector | Person C | `services/ai/image_detector.py` |
| AI video detector | Person C | `services/ai/video_detector.py` |
| AI audio detector | Person C | `services/ai/audio_detector.py` |
| AI document detector | Person C | `services/ai/document_detector.py` |
| AI router | Person C | `services/ai/router.py` |
| Analysis API route | Person C | `routes/analysis.py` |
| PDF report generator | Person C | `services/report_service.py`, `utils/pdf.py`, `routes/reports.py` |
| Analytics API | Person B | `routes/admin.py` |
| Integration + demo | Person D | `demo_assets/`, testing, `seed.py` corrections |
| Documentation | Person D | `docs/`, `README.md` |

### Technical Coordination Rules

1. **Schema-First:** `backend/app/schemas/` files are written and reviewed before frontend service code is written
2. **No Shared File Edits Without Sync:** `main.py`, `database.py`, `App.tsx` are shared files — no simultaneous edits. Use short-lived feature branches.
3. **AI Output Contract Frozen at Phase 5 Start:** The `AnalysisResultData` dataclass shape is set before Person A builds `EvidenceDetailPage.tsx`
4. **No New Dependencies Without Team Approval:** Adding to `requirements.txt` or `package.json` requires a quick Slack/chat check — dependency conflicts waste hours
5. **Feature Flags Over Breaking Changes:** If a feature is in progress, use `FEATURE_X_ENABLED=false` in `.env` rather than breaking the main branch

---

## 12. Antigravity Megaprompt Sequence

### Prompt TRD-01: Initialize React Frontend

**Goal:** Set up the complete React + Vite + TypeScript + Tailwind + shadcn/ui frontend skeleton with routing, layout components, and placeholder pages.

**Files to Create:**
```
frontend/
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── index.html
├── .env.example
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── routes/
    │   ├── ProtectedRoute.tsx
    │   └── RoleRoute.tsx
    ├── pages/ (all 15 pages as empty placeholder components)
    ├── components/layout/
    │   ├── AppLayout.tsx
    │   ├── PublicLayout.tsx
    │   ├── AuthLayout.tsx
    │   ├── Sidebar.tsx
    │   └── TopNav.tsx
    ├── services/apiClient.ts
    ├── hooks/useAuth.ts
    ├── types/ (all type files)
    └── utils/
```

**Task:**
1. Initialize with `npm create vite@latest frontend -- --template react-ts`
2. Install: `tailwindcss postcss autoprefixer axios react-router-dom framer-motion recharts react-hook-form zod @hookform/resolvers lucide-react`
3. Initialize Tailwind: `npx tailwindcss init -p`
4. Install shadcn/ui: `npx shadcn-ui@latest init` with Slate color scheme
5. Add required shadcn components: button, card, input, select, badge, dialog, table, toast, avatar, dropdown-menu, progress, separator, sheet, tabs
6. Create all 15 pages as skeleton components with a heading `<h1>PageName (placeholder)</h1>`
7. Set up React Router with all routes from Document 01
8. Create `ProtectedRoute.tsx` and `RoleRoute.tsx`
9. Create `AppLayout.tsx` with a basic sidebar and topnav (role-aware navigation items)
10. Create `apiClient.ts` with Axios instance and JWT interceptor

**Constraints:**
- Do not implement any business logic yet
- Do not call any backend APIs yet
- All pages are placeholders — no real content
- Keep `useAuth.ts` returning mock data for now (will be wired in TRD-03)

**Acceptance Criteria:**
- `npm run dev` starts without errors
- All 15 routes are accessible (each shows placeholder heading)
- No TypeScript errors
- Sidebar shows appropriate nav items based on role (use hardcoded mock role for now)

**Commit Message:** `feat: initialize react frontend skeleton with routing and layout`

---

### Prompt TRD-02: Initialize FastAPI Backend

**Goal:** Set up the complete FastAPI + SQLAlchemy + SQLite backend skeleton with all models, empty route handlers, and a working health endpoint.

**Files to Create:**
```
backend/
├── requirements.txt
├── .env.example
├── run.py
└── app/
    ├── main.py
    ├── config.py
    ├── database.py
    ├── constants.py
    ├── models/ (all 7 model files)
    ├── schemas/ (all schema files as empty stubs)
    ├── routes/ (all 8 route files with health check only)
    ├── services/ (empty service stubs)
    ├── services/ai/ (empty AI module stubs)
    ├── utils/ (hashing.py, file_validation.py, pdf.py, security.py stubs)
    └── seed.py (empty for now)
```

**Task:**
1. Create `requirements.txt` with all Python dependencies listed in Section 2
2. Create all 7 SQLAlchemy models matching the schema in Document 05
3. Create `database.py` with `get_db()` dependency and `create_all()` on startup
4. Create `main.py` with CORS middleware, route includes, and `GET /api/health` endpoint
5. Create `.env.example` exactly as shown in Section 8
6. Create `config.py` that reads all env vars with sensible defaults

**Constraints:**
- Do not implement any route handler logic yet (except health)
- All routes return placeholder `{"message": "not implemented"}` for now
- Models must match Document 05 schema exactly
- No AI model loading yet

**Acceptance Criteria:**
- `uvicorn app.main:app --reload` starts without errors
- `GET http://localhost:8000/api/health` returns `{"status": "ok"}`
- `http://localhost:8000/docs` shows all registered routes
- All 7 SQLAlchemy models can `create_all()` without errors

**Commit Message:** `feat: initialize fastapi backend skeleton with models and health check`

---

### Prompt TRD-03: Implement Authentication (Frontend + Backend)

**Goal:** Implement full JWT authentication including register, login, logout, protected routes, and role-based access. Both frontend and backend together.

**Files to Modify/Create:**
- `backend/app/routes/auth.py` (implement all 4 endpoints)
- `backend/app/services/auth_service.py` (implement auth business logic)
- `backend/app/schemas/auth_schemas.py` (implement all schemas)
- `backend/app/utils/security.py` (implement JWT utilities)
- `backend/seed.py` (create 6 demo users)
- `frontend/src/hooks/useAuth.ts` (implement real auth context)
- `frontend/src/pages/LoginPage.tsx` (implement real login form)
- `frontend/src/pages/RegisterPage.tsx` (implement real register form)
- `frontend/src/routes/ProtectedRoute.tsx` (implement real JWT check)
- `frontend/src/services/authService.ts` (implement real API calls)

**Constraints:**
- JWT secret must come from `.env`, never hardcoded
- Passwords must be bcrypt-hashed
- Role from JWT must be validated on every protected route
- Self-registration must only allow `citizen` role

**Acceptance Criteria:**
- Demo users (from seed.py) can log in
- Invalid credentials return 401 with clear message
- Token is stored in localStorage and sent on every API call
- Protected routes redirect to `/login` when no token
- Each role sees the correct dashboard after login
- Logout clears token and redirects to `/`

**Testing:**
1. Start backend: `uvicorn app.main:app --reload`
2. Run `python seed.py` to create demo users
3. POST `/api/auth/login` with `admin@veridact.local` / `demo1234` → verify token returned
4. GET `/api/auth/me` with token → verify user object returned
5. GET `/api/auth/me` without token → verify 401

**Commit Message:** `feat: implement JWT authentication with RBAC and demo seed users`

---

### Prompt TRD-04: Implement AI Image Analysis Pipeline

**Goal:** Implement the image deepfake detection pipeline with model loading, fallback handling, and result storage.

**Files to Modify/Create:**
- `backend/app/services/ai/image_detector.py` (full implementation)
- `backend/app/services/ai/router.py` (file type routing logic)
- `backend/app/routes/analysis.py` (POST /api/evidence/{id}/analyze)
- `backend/app/schemas/analysis_schemas.py` (full implementation)

**Constraints:**
- Model loading must be lazy (on first call, not on startup)
- If model fails to load, fallback to deterministic hash-based demo result
- `DEMO_MODE=true` must bypass model entirely
- All results normalized to `AnalysisResultData` dataclass
- Result must be stored in `analysis_results` table
- Custody log entry written for `analysis_started` and `analysis_completed`

**Acceptance Criteria:**
- `POST /api/evidence/{id}/analyze` returns confidence_score, verdict, explanation
- With `DEMO_MODE=true`, returns result without loading any model
- With real model, returns real inference result
- Analysis result is retrievable via `GET /api/evidence/{id}/results`
- Custody log has both `analysis_started` and `analysis_completed` entries

**Testing:**
1. Upload a JPEG image via `POST /api/cases/{id}/evidence`
2. Call `POST /api/evidence/{id}/analyze`
3. Check response includes `confidence_score` between 0 and 1
4. Call `GET /api/evidence/{id}/results` → verify result stored
5. Check `GET /api/cases/{id}/custody` shows analysis events
6. Set `DEMO_MODE=true`, repeat → verify returns without model

**Commit Message:** `feat: implement image deepfake detection pipeline with fallback handling`