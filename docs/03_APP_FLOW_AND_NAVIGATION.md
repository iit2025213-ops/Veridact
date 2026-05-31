# VERIDACT — AI Forensic Evidence Platform
# Document 03: App Flow and Navigation

> **Tagline:** "See Through the Fake. Secure the Truth."
> **Version:** 1.0 — Hackathon MVP
> **Last Updated:** 2025
> **Status:** Active

---

## Table of Contents

1. [App Flow Overview](#1-app-flow-overview)
2. [User Journey Maps](#2-user-journey-maps)
3. [Page List](#3-page-list)
4. [Button-Level Navigation](#4-button-level-navigation)
5. [Form Flows](#5-form-flows)
6. [AI Processing Flow](#6-ai-processing-flow)
7. [Dashboard Flow](#7-dashboard-flow)
8. [Error and Edge Case Flow](#8-error-and-edge-case-flow)
9. [No Merge Conflict Strategy](#9-no-merge-conflict-strategy)
10. [Antigravity Megaprompt Sequence](#10-antigravity-megaprompt-sequence)

---

## 1. App Flow Overview

VERIDACT has two distinct entry paths:

### Path 1: Public / Citizen Path
Citizens (members of the public) never need to log in. They arrive at the landing page, submit evidence via a wizard, receive a case number, and can later track their case status with that number. No authentication required.

```
Landing (/)
    ↓
Report AI Crime button
    ↓
Citizen Submission Wizard (/submit)
  Step 1: Complaint Type
  Step 2: Description + Contact
  Step 3: File Upload
  Step 4: Confirmation
    ↓
Confirmation Screen (shows Case Number + SHA-256 Hash)
    ↓
Download Acknowledgment PDF  OR  Track Case (/track/:caseNumber)
```

### Path 2: Authenticated Staff Path
Investigators, supervisors, and admins log in and access their role-specific dashboards. The core workflow is:

```
Login (/login)
    ↓
Role-Based Dashboard (/dashboard)
    ↓
Case List (/dashboard/cases)
    ↓
Case Detail (/dashboard/cases/:caseId)
    ↓
Evidence Upload OR Analyze Existing Evidence
    ↓
Evidence Analysis Result (/dashboard/cases/:caseId/evidence/:evidenceId)
    ↓
Generate PDF Report
    ↓
View Chain-of-Custody Log
    ↓
Update Case Status
```

### Navigation Structure

The application has three navigation zones:
1. **Public Navigation** — minimal header with "Login" and "Track Case" links only
2. **Authenticated Sidebar** — full role-aware sidebar with all sections
3. **Admin Navigation** — extends the authenticated sidebar with admin-only items

---

## 2. User Journey Maps

### Journey 1: Citizen Submits Evidence

**Entry Point:** Direct URL, search engine, or referral from Nepal Police website

```
STEP 1 — Land on /
│
│   User sees: VERIDACT hero section
│   User sees: "Report AI Crime" primary CTA button
│   User sees: Brief explanation of what VERIDACT does
│   User sees: "Track Existing Case" secondary link
│
▼
STEP 2 — Click "Report AI Crime" → Navigate to /submit
│
│   User sees: 4-step progress indicator
│   User sees: Step 1 — Select Complaint Type
│   Options: Deepfake Image, Deepfake Video, Voice Clone,
│            Fake Document, Synthetic Identity, Scam, Other
│
▼
STEP 3 — Select type, click "Next" → Step 2
│
│   User sees: Title field (required)
│   User sees: Description textarea (required, 50-2000 chars)
│   User sees: Contact Email (optional)
│   User sees: Contact Phone (optional)
│   User sees: Location/Incident Location (optional)
│
▼
STEP 4 — Fill details, click "Next" → Step 3
│
│   User sees: File upload dropzone
│   User sees: Accepted file types listed
│   User sees: Max file size shown (100MB)
│   User sees: Single file upload for MVP
│
▼
STEP 5 — Upload file, click "Next" → Step 4 (Review)
│
│   User sees: Summary of all inputs
│   User sees: Uploaded filename
│   User sees: "Submit Complaint" button
│   User sees: Privacy note
│
▼
STEP 6 — Click "Submit Complaint" → POST /api/cases + POST /api/cases/{id}/evidence
│
│   [Loading state shown: "Submitting your complaint..."]
│   Server: Creates case, saves file, computes SHA-256 hash
│   Server: Logs custody events
│
▼
STEP 7 — Success Screen (still on /submit, Step 4 transforms to confirmation)
│
│   User sees: ✅ "Complaint Submitted Successfully"
│   User sees: Case Number: VRD-2025-000042 (large, prominent)
│   User sees: SHA-256 Hash: (monospace, with copy button)
│   User sees: Submission Timestamp
│   User sees: "Download Acknowledgment PDF" button
│   User sees: "Track My Case" link → /track/VRD-2025-000042
│   User sees: "Submit Another Complaint" link → back to Step 1
│
▼
EXIT — User copies case number and leaves, or clicks track link
```

**Error Flow:**
- Network failure on submit → Show retry button with error message
- File too large → Show error on Step 3, allow re-upload
- Unsupported file type → Show accepted types, allow re-upload
- Backend failure → Show "Something went wrong. Please try again or contact the Cyber Bureau."

---

### Journey 2: Investigator Reviews and Analyzes Evidence

**Entry Point:** Login page (direct URL or redirected from dashboard if session expired)

```
STEP 1 — Navigate to /login
│
│   User sees: Email + Password form
│   User sees: "Login" button
│   User sees: VERIDACT logo and tagline
│
▼
STEP 2 — Enter demo credentials → POST /api/auth/login
│
│   [Loading: "Authenticating..."]
│   Server validates credentials, returns JWT token
│   Token stored in localStorage
│   Role extracted from token: "investigator"
│
▼
STEP 3 — Redirect to /dashboard (Investigator Dashboard)
│
│   User sees: "My Cases" stats (Assigned, Pending, In Review, Completed)
│   User sees: "High Risk Evidence" alert if any AI scores > 0.8
│   User sees: "Recent Activity" list (last 5 custody events)
│   User sees: Quick actions: "View My Cases", "Upload Evidence"
│
▼
STEP 4 — Click "View My Cases" → Navigate to /dashboard/cases
│
│   User sees: Table of assigned cases
│   User sees: Filter bar (status, complaint type, priority)
│   User sees: Each row: Case Number, Title, Type, Priority, Status, Submitted Date
│
▼
STEP 5 — Click on a case row → Navigate to /dashboard/cases/:caseId
│
│   User sees: Case header (number, title, type, status badge, priority badge)
│   User sees: "Evidence" tab — list of uploaded evidence files
│   User sees: "Notes" tab — investigator notes
│   User sees: "Custody Log" tab — timeline of all events
│   User sees: "Actions" panel (Update Status, Add Note, Generate Report)
│
▼
STEP 6 — Click "Analyze" button on an evidence item
│
│   User sees: Evidence card with filename, type, size, SHA-256 hash
│   User sees: "Analyze Evidence" button (blue)
│   [On click: loading spinner shows "Running AI Analysis..."]
│
▼
STEP 7 — POST /api/evidence/{id}/analyze → Redirect to Evidence Detail
│
│   Navigate to /dashboard/cases/:caseId/evidence/:evidenceId
│
▼
STEP 8 — Evidence Analysis Result Page
│
│   User sees: File metadata card (name, type, size, hash, upload time)
│   User sees: AI Verdict Card with:
│              - Verdict badge (color-coded)
│              - Confidence Score (animated progress bar, 0-100%)
│              - Explanation text
│              - Model used
│              - Analysis timestamp
│   User sees: Heatmap image (if available)
│   User sees: "Back to Case" breadcrumb link
│
▼
STEP 9 — Navigate back to Case Detail, click "Generate Report"
│
│   POST /api/cases/{id}/report
│   [Loading: "Generating Forensic Report..."]
│   PDF generated, stored, hash computed
│
▼
STEP 10 — Report generated
│
│   User sees: "Report Generated" success toast
│   User sees: "Download Report" button
│   Click Download → GET /api/reports/{id} → FileResponse (PDF)
│
▼
STEP 11 — Click "Custody Log" tab on Case Detail
│
│   User sees: Vertical timeline of all events:
│   [case_created] [evidence_uploaded] [analysis_started]
│   [analysis_completed] [report_generated] [file_downloaded]
│   Each event: actor name, action label, timestamp, IP
│
▼
STEP 12 — Update Case Status
│
│   PATCH /api/cases/{id} with status: "analysis_complete"
│   Custody log updated automatically
│
EXIT — Investigator logs out via user menu dropdown
```

---

### Journey 3: Citizen Tracks Case Status

```
STEP 1 — Navigate to /track (from bookmark, landing page link, or confirmation email)
│
│   User sees: "Track Your Case" heading
│   User sees: Single input field: "Enter Case Number (e.g. VRD-2025-000042)"
│   User sees: "Track" button
│
▼
STEP 2 — Enter case number, click "Track" → GET /api/public/cases/{caseNumber}
│
│   [Loading spinner: "Looking up your case..."]
│
▼
STEP 3 — Navigate to /track/VRD-2025-000042
│
│   User sees: Case status card
│   User sees: Status badge (e.g., "Under Review" — mapped from "in_review")
│   User sees: Submission date
│   User sees: Last updated date
│   User sees: Public progress notes (if any with visibility=public_update)
│   User does NOT see: Investigator notes, AI analysis, file contents, file paths
│
▼
STEP 4 — (Optional) User clicks "Track Another Case" → back to /track
```

**Error Flow:**
- Invalid case number → "No case found with that number. Please check your receipt."
- Rate limit exceeded → "Too many requests. Please wait a minute and try again."
- Backend failure → "Unable to retrieve case status. Please try again later."

---

### Journey 4: Supervisor Assigns and Monitors Cases

```
Login → /dashboard (Supervisor Dashboard)
│
│   Sees: Department-wide stats (Total, Pending, In Review, Completed)
│   Sees: "Unassigned Cases" alert card if any cases are unassigned
│   Sees: Investigator workload distribution bar chart
│
▼
Navigate to /dashboard/cases → sees all department cases including unassigned
│
│   Filters: All, Unassigned, By Investigator, By Status
│
▼
Click an unassigned case → Case Detail Page
│
│   Sees: "Assign to Investigator" dropdown in Actions panel
│   Selects investigator from dropdown
│   Clicks "Assign"
│   PATCH /api/cases/{id} with assigned_to: investigator_user_id
│   Custody log entry: case_updated
│   Toast: "Case assigned to [Investigator Name]"
│
▼
Back to case list → case now shows assigned investigator
```

---

### Journey 5: Super Admin Manages Users

```
Login → /admin (Admin Overview)
│
│   Sees: System stats (Total Users, Total Cases, Total Evidence, Total Reports)
│   Sees: Quick nav to /admin/users, /admin/custody, /admin/settings
│
▼
Navigate to /admin/users
│
│   Table: All users with Name, Email, Role, Status, Created Date
│   Action per row: "Edit" button
│
▼
Click "Edit" on a user
│
│   Modal/Sheet opens with:
│   - Role dropdown (change role)
│   - Active toggle (deactivate user)
│   - Organization field
│   - "Save" button
│   PATCH /api/admin/users/{id}
│
▼
Navigate to /admin/custody
│
│   System-wide custody audit log table
│   Filters: Date range, User, Action type, Case ID
│   Paginated (50 per page)
```

---

## 3. Page List

### Public Pages

#### Landing Page

- **Route:** `/`
- **Access:** Public (no login required)
- **Purpose:** Introduce VERIDACT, explain its purpose, provide CTAs for citizens and investigators
- **Main Components:** `HeroSection`, `StatsBanner`, `FeatureCards`, `HowItWorksSteps`, `CTASection`, `PublicLayout`
- **Key Buttons:**
  - "Report AI Crime" → `/submit`
  - "Track Your Case" → `/track`
  - "Login for Investigators" → `/login`
- **API Calls:** None
- **Empty State:** N/A (static page)
- **Loading State:** N/A (no data fetching)
- **Error State:** N/A

#### Login Page

- **Route:** `/login`
- **Access:** Public (redirects to `/dashboard` if already authenticated)
- **Purpose:** Authenticate users and redirect to their role-specific dashboard
- **Main Components:** `AuthLayout`, `LoginForm`, `LoadingButton`
- **Key Buttons:** "Login" (submit), "Back to Home" → `/`
- **Form Fields:** Email, Password
- **API Calls:** `POST /api/auth/login`
- **Success:** Store JWT in localStorage, redirect to `/dashboard`
- **Error:** Show inline error message under form ("Invalid email or password")
- **Loading State:** Button text changes to "Logging in..." with spinner

#### Register Page

- **Route:** `/register`
- **Access:** Public (only for citizen self-registration; other roles created by admin)
- **Purpose:** Allow new users to create a citizen account
- **Main Components:** `AuthLayout`, `RegisterForm`
- **Key Buttons:** "Create Account" (submit), "Already have an account?" → `/login`
- **Form Fields:** Full Name, Email, Password, Confirm Password
- **API Calls:** `POST /api/auth/register` (role hardcoded to `citizen`)
- **Success:** Show success message, redirect to `/login`
- **Error:** Show field-specific validation errors; "Email already registered" on 409

#### Citizen Evidence Submission Page

- **Route:** `/submit`
- **Access:** Public
- **Purpose:** Multi-step wizard for citizens to submit evidence and create a case
- **Main Components:** `SubmissionWizard`, `StepIndicator`, `FileUploadBox`, `SubmissionConfirmation`
- **Steps:** 1. Complaint Type → 2. Description + Contact → 3. File Upload → 4. Review + Submit
- **API Calls:**
  - `POST /api/cases` (Step 4 submit)
  - `POST /api/cases/{id}/evidence` (file upload)
- **Success State:** Confirmation screen with case number, hash, download link
- **Empty State:** N/A (wizard always has content)
- **Loading State:** Full-page overlay on final submit ("Securing your submission...")
- **Error State:** Per-step error messages; file upload error on Step 3

#### Case Tracking Input Page

- **Route:** `/track`
- **Access:** Public
- **Purpose:** Allow citizens to enter their case number and look up status
- **Main Components:** `PublicLayout`, `CaseTrackingForm`
- **Form Fields:** Case Number (single input, format validation VRD-YYYY-NNNNNN)
- **API Calls:** None on this page (submitted on form submit, navigates to result page)
- **Key Buttons:** "Track Case" → navigates to `/track/:caseNumber`

#### Case Tracking Result Page

- **Route:** `/track/:caseNumber`
- **Access:** Public
- **Purpose:** Display public-safe case status to citizen
- **Main Components:** `PublicLayout`, `PublicCaseStatusCard`, `PublicProgressTimeline`
- **API Calls:** `GET /api/public/cases/:caseNumber`
- **Empty State:** "No case found with this number" card
- **Loading State:** Skeleton loader
- **Error State:** "Unable to retrieve case. Please try again." with retry button

---

### Authenticated Dashboard Pages

#### Dashboard Home

- **Route:** `/dashboard`
- **Access:** investigator, supervisor, super_admin
- **Purpose:** Role-specific overview with stats and quick actions
- **Main Components:** `AppLayout`, `StatsCards`, `RecentCasesList`, `AlertPanel`, `QuickActions`
- **Role Differences:**
  - Investigator: My assigned cases stats, recent activity
  - Supervisor: Department stats, investigator workload
  - Admin: System-wide stats, system health alerts
- **API Calls:** `GET /api/admin/analytics` (admin/supervisor), `GET /api/cases?assigned_to=me&limit=5` (investigator)
- **Empty State:** Friendly empty state with "No cases assigned yet" and link to case list
- **Loading State:** Skeleton loaders for each stats card

#### Case List Page

- **Route:** `/dashboard/cases`
- **Access:** investigator (own cases), supervisor, super_admin (all cases)
- **Purpose:** Paginated, filterable list of cases
- **Main Components:** `AppLayout`, `CaseFilterBar`, `CaseTable`, `Pagination`, `SearchInput`
- **Filter Options:** Status, Complaint Type, Priority, Date Range, Assigned To (supervisor/admin only)
- **API Calls:** `GET /api/cases` with filter query params
- **Loading State:** Table skeleton (5 rows of skeleton text)
- **Empty State:** "No cases found matching your filters" with "Clear Filters" button
- **Error State:** Error card with "Could not load cases" and retry button

#### Case Detail Page

- **Route:** `/dashboard/cases/:caseId`
- **Access:** investigator (assigned case only), supervisor, super_admin
- **Purpose:** Full case view with evidence list, notes, custody timeline, and actions
- **Main Components:** `CaseHeader`, `TabPanel` (Evidence, Notes, Custody, Reports), `ActionsSidebar`
- **Tabs:**
  - "Evidence" tab: `EvidenceList` with analyze button per item
  - "Notes" tab: `NotesList`, `AddNoteForm`
  - "Custody" tab: `CustodyTimeline`
  - "Reports" tab: `ReportList`, `GenerateReportButton`
- **Actions Sidebar (role-aware):**
  - Investigator: Update Status, Add Note, Generate Report
  - Supervisor: All above + Assign to Investigator, Update Priority
  - Admin: All above + Delete Case
- **API Calls:**
  - `GET /api/cases/:caseId`
  - `POST /api/cases/:caseId/evidence` (upload)
  - `PATCH /api/cases/:caseId` (status/assignment update)
  - `GET /api/cases/:caseId/custody`
  - `POST /api/cases/:caseId/report`
- **Loading State:** Skeleton for entire case header and tabs
- **Error State (403):** "You do not have access to this case" with back button
- **Error State (404):** "Case not found" with link to case list

#### Evidence Analysis Detail Page

- **Route:** `/dashboard/cases/:caseId/evidence/:evidenceId`
- **Access:** investigator (assigned), supervisor, super_admin
- **Purpose:** Display AI analysis results for a specific evidence item
- **Main Components:** `EvidenceMetadataCard`, `AnalysisResultCard`, `ConfidenceMeter`, `VerdictBadge`, `HeatmapViewer`, `SHAHashDisplay`
- **API Calls:**
  - `GET /api/evidence/:evidenceId` (on load — also logs evidence_accessed custody event)
  - `POST /api/evidence/:evidenceId/analyze` (on click of Analyze button)
  - `GET /api/evidence/:evidenceId/results`
- **States:**
  - Pre-analysis: Evidence metadata shown, "Analyze Evidence" CTA button
  - Analyzing: Spinner + "Running AI Analysis... This may take up to 30 seconds"
  - Post-analysis: Full result card with score, verdict, explanation, heatmap
  - Analysis failed: Error card with "Analysis failed" + fallback result explanation
- **Loading State:** Skeleton for metadata card; analysis spinner overlay
- **Error State:** Error card per API failure

#### Reports Page

- **Route:** `/dashboard/reports`
- **Access:** investigator, supervisor, super_admin
- **Purpose:** List all generated reports with download links
- **Main Components:** `ReportTable`, columns: Case Number, Report Type, Generated By, Generated At, Download button
- **API Calls:** `GET /api/reports` (investigator's reports) or all (admin)
- **Download:** `GET /api/reports/:reportId` → triggers browser file download

#### Analytics Page

- **Route:** `/dashboard/analytics`
- **Access:** supervisor, super_admin
- **Purpose:** Visual analytics dashboard with charts
- **Main Components:** `StatsGrid`, `VerdictDistributionChart`, `DailySubmissionsChart`, `CaseTypeChart`, `InvestigatorWorkloadChart`
- **API Calls:** `GET /api/admin/analytics`

---

### Admin Pages

#### Admin Overview

- **Route:** `/admin`
- **Access:** super_admin
- **Purpose:** System health overview and quick navigation
- **Main Components:** `AdminStatsGrid`, `QuickNavCards`
- **API Calls:** `GET /api/admin/analytics`

#### Admin Users Page

- **Route:** `/admin/users`
- **Access:** super_admin
- **Components:** `UserTable`, `EditUserModal`
- **API Calls:** `GET /api/admin/users`, `PATCH /api/admin/users/:userId`

#### Admin Custody Page

- **Route:** `/admin/custody`
- **Access:** super_admin
- **Components:** `CustodyLogTable`, `CustodyFilterBar`
- **API Calls:** `GET /api/admin/custody` with filters

#### Admin Settings Page

- **Route:** `/admin/settings`
- **Access:** super_admin
- **Components:** `SettingsForm`
- **Note:** In MVP, settings are displayed as read-only from `.env` values. Editing is future scope.

---

## 4. Button-Level Navigation

### "Report AI Crime" Button (Landing Page)

- **Location:** Hero section, primary CTA
- **On Click:** Navigate to `/submit`
- **API Call:** None
- **Success:** Page transition to submission wizard
- **Failure:** N/A (pure navigation)

### "Login" Button (Login Form)

- **Location:** `/login` page, below form fields
- **On Click:** Validate form → `POST /api/auth/login`
- **Loading State:** Button disabled + spinner + text "Logging in..."
- **Success:** Store JWT → redirect to `/dashboard`
- **Failure (401):** Show error under form: "Invalid email or password"
- **Failure (403):** Show error: "Your account has been deactivated. Contact the administrator."
- **Failure (Network):** Show error: "Could not reach server. Is the backend running?"

### "Register" Button (Register Form)

- **Location:** `/register` page
- **On Click:** Validate form → `POST /api/auth/register`
- **Loading State:** Button disabled + spinner
- **Success:** Show success toast → redirect to `/login`
- **Failure (409):** Show inline error: "This email is already registered"
- **Failure (422):** Show field-specific errors from Pydantic response

### "Next" Button (Submission Wizard Steps 1–3)

- **Location:** Bottom of each wizard step
- **On Click:** Validate current step's fields → advance to next step
- **Behavior:** If validation fails, show inline field errors. If valid, slide to next step.
- **No API call** until Step 4 submit

### "Submit Complaint" Button (Wizard Step 4)

- **Location:** Wizard Step 4 (review step)
- **On Click:** `POST /api/cases` → on success get case_id → `POST /api/cases/{id}/evidence`
- **Loading State:** Full overlay "Securing your submission..." with progress animation
- **Success:** Transform Step 4 into confirmation screen with case number
- **Failure:** Show error toast + keep form data intact (user can retry)

### "Analyze Evidence" Button (Evidence Card on Case Detail / Evidence Detail Page)

- **Location:** Evidence card → "Analyze" button; also prominent CTA on Evidence Detail page
- **On Click:** `POST /api/evidence/{id}/analyze`
- **Loading State:** Button disabled + spinner + "Analyzing..." text; inline spinner on card
- **Success:** Navigate to `/dashboard/cases/:caseId/evidence/:evidenceId` with result loaded
- **Failure:** Show error: "Analysis failed. A fallback result has been used." (still shows inconclusive result)

### "Generate Report" Button (Case Detail Page)

- **Location:** Case detail page → Actions panel → "Generate Report" button
- **On Click:** `POST /api/cases/{id}/report`
- **Loading State:** Button disabled + "Generating..." with spinner (reports take 2–5s)
- **Success:** Show toast "Forensic report generated" + "Download Now" link in toast
- **Failure:** Show error toast "Report generation failed. Please try again."

### "Download Report" Button (Reports Page + Case Detail)

- **Location:** Report list item, and in toast notification after generation
- **On Click:** `GET /api/reports/{id}` → triggers browser file download
- **Loading State:** Brief loading indicator
- **Success:** Browser download dialog opens; PDF file saved
- **Side Effect:** `custody_logs` entry `file_downloaded` is created on backend

### "View Case" Button/Row Click (Case List Page)

- **Location:** Each row in the case list table
- **On Click:** Navigate to `/dashboard/cases/:caseId`
- **No API call** on click (data loaded on Case Detail page)

### "Assign Case" Button (Supervisor view on Case Detail)

- **Location:** Case Detail → Actions Panel → "Assign to Investigator" with dropdown
- **On Click:** `PATCH /api/cases/{id}` with `{assigned_to: investigatorUserId}`
- **Success:** Toast "Case assigned to [Name]" + case header updates immediately
- **Failure:** Error toast "Assignment failed. Please try again."

### "Update Status" Button (Case Detail)

- **Location:** Case Detail → Actions Panel → Status dropdown + "Update" button
- **On Click:** `PATCH /api/cases/{id}` with `{status: newStatus}`
- **Success:** Case status badge updates; toast confirmation; custody log auto-created
- **Failure:** Error toast

### "Track Case" Button (Track Page)

- **Location:** `/track` page → below case number input
- **On Click:** Validate input format (VRD-YYYY-NNNNNN) → navigate to `/track/:caseNumber`
- **Client-side only:** Validation without API call; page navigates and then fetches

### "Logout" Button (Top Navigation User Menu)

- **Location:** TopNav → user avatar dropdown → "Logout"
- **On Click:** Clear localStorage JWT → clear auth context state → navigate to `/`
- **No API call** (JWT is stateless, no server-side invalidation in MVP)

---

## 5. Form Flows

### Form 1: Login Form

- **Form Name:** Login
- **Route:** `/login`
- **Fields:**
  - Email: `type="email"`, required, max 255 chars
  - Password: `type="password"`, required, min 8 chars
- **Validation:**
  - Client-side: Both fields required before submit
  - Server-side: Pydantic schema validates email format; bcrypt check on login
- **Submit Action:** `POST /api/auth/login`
- **Success:** JWT stored in localStorage → redirect to `/dashboard`
- **Error Messages:**
  - Empty fields: "Email and password are required"
  - Invalid credentials (401): "Invalid email or password"
  - Inactive account (403): "Account deactivated. Contact admin."

---

### Form 2: Register Form

- **Form Name:** Register
- **Route:** `/register`
- **Fields:**
  - Full Name: `type="text"`, required, min 2 chars, max 100 chars
  - Email: `type="email"`, required, max 255 chars
  - Password: `type="password"`, required, min 8 chars
  - Confirm Password: `type="password"`, required, must match Password field
- **Validation:** React Hook Form + Zod schema
- **Submit Action:** `POST /api/auth/register` (role is always `citizen`)
- **Success:** Toast "Account created! Please log in." → navigate to `/login`
- **Error Messages:**
  - Password mismatch: "Passwords do not match"
  - Email taken (409): "This email is already registered"
  - Server error: "Registration failed. Please try again."

---

### Form 3: Evidence Submission Wizard

- **Form Name:** Citizen Evidence Submission
- **Route:** `/submit`
- **Multi-step form managed with React Hook Form + Zod**

**Step 1: Complaint Type**
- Field: `complaint_type` (radio group or large button cards)
- Options: Deepfake Image, Deepfake Video, Voice Clone, Fake Document, Synthetic Identity, Scam, Other
- Validation: One option must be selected

**Step 2: Description and Contact**
- Fields:
  - `title`: text, required, 5–200 chars ("Brief title for your complaint")
  - `description`: textarea, required, 50–2000 chars
  - `contact_email`: email, optional
  - `contact_phone`: text, optional, max 20 chars
  - `location`: text, optional, max 200 chars
- Validation: Title and description required

**Step 3: File Upload**
- Field: `file` (single file upload via dropzone)
- Accepted types: listed in FileUploadBox component
- Max size: 100MB (validated client-side first)
- Validation: Must upload at least one file before proceeding
- Upload behavior: File selected and held in state — NOT uploaded yet

**Step 4: Review and Submit**
- Shows: Summary of all data + filename
- Button: "Submit Complaint" → triggers API calls
- Submit sequence:
  1. `POST /api/cases` with title, description, complaint_type, contact info → get case_id
  2. `POST /api/cases/{case_id}/evidence` with file upload (multipart/form-data)
- **Success:** Replace wizard with confirmation screen

---

### Form 4: Case Tracking Form

- **Form Name:** Case Status Lookup
- **Route:** `/track`
- **Fields:**
  - `case_number`: text, required
- **Validation:** Must match pattern `/^VRD-\d{4}-\d{6}$/`
- **Submit Action:** Navigate to `/track/:caseNumber` (no API call on this page)
- **Invalid format:** "Please enter a valid case number (e.g. VRD-2025-000042)"

---

### Form 5: Add Investigation Note

- **Form Name:** Case Note
- **Location:** Case Detail Page → Notes tab
- **Fields:**
  - `note_text`: textarea, required, 10–2000 chars
  - `visibility`: select (Internal / Supervisor / Public Update), required
- **Submit Action:** `POST /api/cases/{id}/notes` (add this endpoint) or include in `PATCH /api/cases/{id}`
- **Success:** Note appears in Notes list immediately (optimistic UI update)
- **Error:** "Could not save note. Please try again."

---

### Form 6: Update Case Status

- **Form Name:** Case Status Update
- **Location:** Case Detail Page → Actions Sidebar
- **Fields:**
  - `status`: select dropdown (allowed next statuses based on current)
  - `reason`: textarea, optional, for audit trail
- **Status Transition Rules:**
  - `pending` → `in_review`
  - `in_review` → `analysis_complete`
  - `analysis_complete` → `report_generated`, `referred`
  - Any → `closed` (supervisor/admin only)
- **Submit Action:** `PATCH /api/cases/{id}`
- **Success:** Case header status badge updates; custody log entry created; toast confirmation

---

### Form 7: Assign Case to Investigator (Supervisor)

- **Form Name:** Case Assignment
- **Location:** Case Detail Page → Actions Sidebar (supervisor/admin only)
- **Fields:**
  - `assigned_to`: searchable dropdown of investigator users in the system
- **Submit Action:** `PATCH /api/cases/{id}` with `{assigned_to: userId}`
- **Success:** Toast "Case assigned to [Investigator Name]"; header updates
- **Error:** "Assignment failed. The investigator may not be available."

---

### Form 8: Edit User (Admin)

- **Form Name:** User Edit
- **Location:** `/admin/users` → Edit modal/sheet
- **Fields:**
  - `role`: select (super_admin, supervisor, investigator, citizen)
  - `is_active`: toggle (Active / Deactivated)
  - `organization`: text, optional
- **Submit Action:** `PATCH /api/admin/users/{userId}`
- **Success:** User list row updates; toast confirmation
- **Error:** "Update failed. Please try again."

---

## 6. AI Processing Flow

This section defines the complete technical flow from file upload to AI result display.

```
STEP 1 — User uploads file
│
│   Frontend: File selected in FileUploadBox
│   Frontend: Client-side MIME check (basic, by extension)
│   Frontend: Client-side size check (>100MB → immediate error)
│   Frontend: POST /api/cases/{caseId}/evidence (multipart/form-data)
│
▼
STEP 2 — Backend receives upload
│
│   backend/app/services/evidence_service.py::save_upload_file()
│   1. Validate MIME type with python-magic (NOT just extension)
│   2. Cross-validate: extension must match detected MIME type
│   3. Reject if unsupported type → HTTP 415
│   4. Reject if too large → HTTP 413
│   5. Generate UUID stored_filename: {uuid4}.{ext}
│   6. Stream file to uploads/evidence/{uuid4}.{ext}
│   7. Compute SHA-256 hash during streaming (hashlib.sha256)
│   8. Detect file_type category: image | video | audio | document | other
│   9. Create Evidence record in DB with upload_status="uploaded"
│   10. Create custody_log entry: action="evidence_uploaded", ip=request.client.host
│
▼
STEP 3 — User clicks "Analyze Evidence"
│
│   Frontend: POST /api/evidence/{evidenceId}/analyze
│   Frontend: Show analysis loading spinner
│
▼
STEP 4 — Backend receives analysis request
│
│   backend/app/routes/analysis.py
│   1. Get evidence record from DB (404 if not found)
│   2. Check auth: investigator must be assigned to the case
│   3. Check: if analysis already completed and force_rerun=false → return existing result
│   4. Create AnalysisResult record with status="pending"
│   5. Create custody_log: action="analysis_started"
│   6. Update AnalysisResult status to "processing"
│
▼
STEP 5 — Route to correct AI module
│
│   backend/app/services/ai/router.py::route_analysis()
│   Detects file_type from evidence record
│   Routes to: image_detector | video_detector | audio_detector | document_detector
│
▼
STEP 6a — Image Analysis (if file_type == "image")
│
│   backend/app/services/ai/image_detector.py
│   1. Check DEMO_MODE env var → if true, return pre-scripted result
│   2. Try to load model: transformers.pipeline("image-classification", model=IMAGE_MODEL_NAME)
│   3. If model load fails → try FALLBACK_MODEL → if that fails → return deterministic fallback
│   4. Open image with Pillow, resize to 224x224 if needed
│   5. Run inference: result = detector(pil_image)
│   6. Extract fake_score from result labels
│   7. Determine verdict:
│      fake_score >= 0.80 → "likely_fake"
│      fake_score >= 0.55 → "suspicious"
│      fake_score < 0.55  → "authentic"
│      model unavailable  → "inconclusive"
│   8. Generate explanation text (template-based)
│   9. Optional: Run Grad-CAM and save heatmap to uploads/heatmaps/{evidence_id}_heatmap.png
│   10. Return AnalysisResultData object
│
▼
STEP 6b — Video Analysis (if file_type == "video")
│
│   backend/app/services/ai/video_detector.py
│   1. Open video with OpenCV cv2.VideoCapture
│   2. Get total frame count
│   3. Sample 10 evenly-spaced frame indices
│   4. Extract frames at those indices
│   5. Run image_detector on each frame
│   6. Collect frame_scores[]
│   7. Compute mean_score = average of frame_scores
│   8. Count high_risk_frames (score > 0.7)
│   9. Determine verdict:
│      mean_score >= 0.75 → "likely_fake"
│      mean_score >= 0.50 → "suspicious"
│      mean_score < 0.50  → "authentic"
│   10. Return AnalysisResultData with frame_scores in raw_output
│
▼
STEP 6c — Audio Analysis (if file_type == "audio")
│
│   backend/app/services/ai/audio_detector.py
│   1. Load audio with librosa.load(file_path, sr=16000)
│   2. Extract features:
│      - MFCCs (40 coefficients)
│      - Spectral centroid, bandwidth, rolloff
│      - Zero-crossing rate
│      - Pitch estimate (librosa.yin)
│   3. Apply heuristic scoring:
│      - Low MFCC variance → synthetic speech indicator (+0.2)
│      - Abnormally high spectral uniformity → +0.15
│      - Unnatural pitch monotony → +0.2
│      - Very low zero-crossing rate variance → +0.1
│   4. Sum heuristic score (0.0 to 1.0 capped)
│   5. Determine verdict using same thresholds as image
│   6. Return AnalysisResultData with explanation and duration
│
▼
STEP 6d — Document Analysis (if file_type == "document")
│
│   backend/app/services/ai/document_detector.py
│   1. Detect actual MIME type and subtype (PDF/DOCX/image/etc.)
│   2. Extract metadata:
│      PDF: author, creator, producer, created_at, modified_at via PyMuPDF
│      DOCX: core_properties via python-docx (author, created, modified, revision)
│      Images: EXIF data via Pillow
│   3. Check metadata red flags:
│      - created_at > modified_at → date_mismatch flag
│      - Author blank or "[None]" → blank_author flag
│      - Creator/Producer contains known manipulation tools
│        (Adobe Acrobat DC, GIMP, Photoshop, PDFCreator, etc.)
│      - GPS data mismatch between metadata and content context
│   4. Run Tesseract OCR on first page / first 2 pages
│   5. Run ELA on embedded images (if PDF/DOCX contains images):
│      Re-save at quality=95, subtract, amplify, check max residual
│      High residual (>50) → high_ela_residual flag
│   6. Compute risk_score:
│      0 flags → 0.1 (baseline)
│      1 flag  → 0.35
│      2 flags → 0.55 (suspicious)
│      3+ flags → 0.75 (likely_fake)
│   7. Return AnalysisResultData with metadata_flags and ocr_text_preview
│
▼
STEP 7 — Result Normalization
│
│   All detectors return same AnalysisResultData dataclass:
│   {
│     confidence_score: float (0.0–1.0)
│     verdict: "authentic" | "suspicious" | "likely_fake" | "inconclusive"
│     explanation: str
│     model_used: str
│     model_version: str
│     heatmap_path: str | None
│     raw_output: dict
│   }
│
▼
STEP 8 — Store Analysis Result
│
│   Update AnalysisResult record in DB:
│   - confidence_score, verdict, explanation, model_used, model_version
│   - heatmap_path (if generated)
│   - raw_output_json = json.dumps(raw_output)
│   - processing_status = "completed"
│   - analyzed_at = datetime.utcnow()
│
│   Create custody_log: action="analysis_completed"
│   Update evidence.upload_status = "analyzed"
│
▼
STEP 9 — Return Result to Frontend
│
│   API returns full AnalysisResultResponse JSON
│   Frontend receives result
│   Frontend hides loading spinner
│   Frontend renders AnalysisResultCard with:
│   - VerdictBadge (color-coded)
│   - ConfidenceMeter (animated to final score)
│   - Explanation text
│   - HeatmapViewer (if heatmap_path present)
│
▼
STEP 10 — Failure Handling
│
│   If AI model raises exception:
│   - Set AnalysisResult.processing_status = "failed"
│   - Set AnalysisResult.error_message = str(exception)
│   - Return fallback result: verdict="inconclusive", score=0.5,
│     explanation="Analysis could not be completed. Manual review required.",
│     model_used="error_fallback"
│   - Create custody_log: action="analysis_completed" with note="FALLBACK_USED"
│   - Frontend displays fallback result with warning banner
```

---

## 7. Dashboard Flow

### Investigator Dashboard (`/dashboard`)

**Layout:** 2-column grid on desktop, single column on mobile

**Left/Main Area:**
- Stats Row: 4 cards — Total Assigned, Pending, In Review, Completed
- Recent Cases Table: Last 5 updated cases with quick-link to case detail
- High-Risk Evidence Alert: If any `analysis_results.confidence_score > 0.80`, show alert banner

**Right/Secondary Area:**
- Quick Actions: "View All Cases", "Upload Evidence" (goes to case list for selection)
- My Activity: Last 5 custody log events for actions taken by current user

**API Calls on Load:**
```
GET /api/cases?assigned_to=me&limit=5&sort=updated_at:desc
GET /api/admin/analytics  (investigator sees limited version — own stats only)
```

**Empty State:** Friendly card: "No cases assigned to you yet. Contact your supervisor to get started."

---

### Supervisor Dashboard (`/dashboard`)

**Layout:** 3-column grid on desktop

**Top Row:** 4 Stats Cards — Total Department Cases, Pending, Unassigned, Closed This Week

**Middle Row:**
- Bar Chart: Cases by Investigator (workload distribution, using Recharts BarChart)
- Pie Chart: Cases by Complaint Type

**Bottom Row:**
- Table: Unassigned Cases (quick assign action inline)
- Table: Recent High-Risk Cases (AI score > 0.75)

**API Calls on Load:**
```
GET /api/admin/analytics
GET /api/cases?assigned_to=unassigned&status=pending
```

---

### Admin Dashboard (`/dashboard` and `/admin`)

**Extends Supervisor Dashboard with:**
- System stats: Total Users, Total Evidence Items, Storage Used (from local filesystem), Total Reports Generated
- System Alerts: Any failed analyses, any large files pending processing
- User Activity: Most active users by custody log event count
- Daily Submissions Chart (7-day rolling, Recharts BarChart)
- Verdict Distribution Chart (Recharts PieChart — Authentic, Suspicious, Likely Fake, Inconclusive)

**API Calls:**
```
GET /api/admin/analytics
GET /api/admin/users?limit=10
GET /api/admin/custody?limit=20
```

---

### Citizen Case Tracking Page (`/track/:caseNumber`)

**Layout:** Single column, centered card

**Card Content:**
- Case Number (large, monospace)
- Status Badge (mapped from internal status to citizen-friendly label):
  - `pending` → "Received"
  - `in_review` → "Under Review"
  - `analysis_complete` → "Analysis Complete"
  - `report_generated` → "Report Generated"
  - `closed` → "Closed"
  - `referred` → "Referred to Specialist"
- Submission Date (relative: "3 days ago")
- Last Updated Date
- Progress Steps (visual stepper showing journey)
- Public Notes Section (only shows notes where `visibility = "public_update"`)

**API Call:** `GET /api/public/cases/:caseNumber`

**Security:** Response never includes investigator data, evidence details, file paths, or internal notes.

---

## 8. Error and Edge Case Flow

### Invalid Login

- **Trigger:** Wrong email or password
- **Backend Response:** HTTP 401
- **Frontend Behavior:** Show inline error message under password field: "Invalid email or password. Please try again."
- **Do NOT reveal:** Which field is wrong (prevents username enumeration)

### Missing Required Fields (Form Submission)

- **Trigger:** User submits form with empty required fields
- **Frontend Behavior:** React Hook Form + Zod validation fires before API call
- **Display:** Red border + error text under each invalid field
- **No API call made** until all client-side validations pass

### Unsupported File Type

- **Trigger:** User uploads a `.exe`, `.zip`, or other non-supported file
- **Client-side:** FileUploadBox checks extension before accepting file
- **Server-side:** python-magic validates MIME type; returns HTTP 415
- **Display:** "File type not supported. Accepted types: Images, Videos, Audio, Documents (PDF, DOCX, XLSX, TXT)"

### File Too Large

- **Trigger:** User uploads a file > 100MB
- **Client-side:** Size checked immediately on file selection
- **Server-side:** Enforced via FastAPI `UploadFile` max size check
- **Display:** "File is too large. Maximum allowed size is 100MB."

### AI Model Failure

- **Trigger:** Model weights missing, OOM, CUDA error, or exception during inference
- **Backend Behavior:** `try/except` around entire analysis function
- **On exception:** Return `AnalysisResultData` with `verdict="inconclusive"`, `model_used="error_fallback"`, explanation explaining manual review needed
- **Frontend Behavior:** Show analysis result with a yellow warning banner: "Note: AI analysis could not be completed normally. This is a fallback result. Manual review is required."
- **Custody Log:** Still created with note "FALLBACK_USED"
- **System does not crash** — investigation can continue with manual review

### Backend Server Failure

- **Trigger:** Uvicorn process crashes, port conflict, or Python exception
- **Frontend Behavior:** Axios catches network error (ERR_CONNECTION_REFUSED)
- **Display:** Toast notification: "Could not connect to the server. Please ensure the backend is running."
- **Login page:** If login fails, show: "Server unavailable. Is the backend running on port 8000?"

### Database Failure

- **Trigger:** SQLite file locked, disk full, or corrupted DB
- **Backend Behavior:** SQLAlchemy raises exception, caught by global exception handler
- **Response:** HTTP 500 with `{"detail": "Database error. Please try again."}`
- **Frontend:** Error toast + retry button where applicable
- **Recovery:** If DB file is corrupted, `python seed.py --reset` recreates it from seed_data.json

### PDF Generation Failure

- **Trigger:** ReportLab exception, missing data, or disk write error
- **Backend Behavior:** Exception caught in report_service.py
- **Response:** HTTP 500 `{"detail": "Report generation failed"}`
- **Frontend:** Error toast: "Could not generate report. Please try again."
- **Demo Backup:** A pre-generated sample PDF is stored in `demo_assets/sample_report.pdf` as a fallback

### No Internet (Localhost Demo)

- **Trigger:** Demo environment has no internet connection
- **Impact:** Hugging Face model download will fail on first run if models are not pre-cached
- **Prevention:** Set `HF_HUB_OFFLINE=true` in `.env` to prevent download attempts
- **Ensure:** All models are pre-downloaded before demo by running `python -c "from app.services.ai.image_detector import load_model; load_model()"`
- **Fallback:** `DEMO_MODE=true` bypasses model entirely

### Localhost Demo Fallback

If everything goes wrong during the live demo:
1. Switch to pre-seeded demo data in DB (cases already have analysis results stored)
2. All analysis result pages will show stored results without triggering new AI analysis
3. PDF report is pre-generated in `demo_assets/sample_report.pdf`
4. Investigator dashboard shows meaningful data from seed data
5. No live AI inference needed to complete the demo flow

---

## 9. No Merge Conflict Strategy

### Route/Page Ownership

| Route Group | Owner | Key Files |
|---|---|---|
| `/` — Landing Page | Person A | `LandingPage.tsx` |
| `/login`, `/register` | Person A | `LoginPage.tsx`, `RegisterPage.tsx`, `useAuth.ts` |
| `/submit` | Person A | `SubmitEvidencePage.tsx`, `SubmissionWizard.tsx` |
| `/track`, `/track/:id` | Person A | `TrackCasePage.tsx`, `TrackCaseResultPage.tsx` |
| `/dashboard` | Person A | `DashboardPage.tsx` |
| `/dashboard/cases` | Person A | `CaseListPage.tsx` |
| `/dashboard/cases/:id` | Person A | `CaseDetailPage.tsx` |
| `/dashboard/cases/:id/evidence/:id` | Person A | `EvidenceDetailPage.tsx` |
| `/dashboard/reports` | Person A | `ReportsPage.tsx` |
| `/dashboard/analytics` | Person A (uses Person B's API) | `AnalyticsPage.tsx` |
| `/admin/*` | Person A + Person D | `AdminPages/` |
| `App.tsx` routing | Person D (integrator) | `App.tsx` |
| `AppLayout`, `Sidebar` | Person A (no changes after Phase 1) | `layout/` |

### Navigation Component Lock

- `Sidebar.tsx` navigation items are finalized in **Phase 3** (after auth is implemented)
- No changes to sidebar navigation items after Phase 4 without team sync
- Adding new routes in `App.tsx` requires notification to all team members

### Form Data Contracts

- All form submission shapes are defined in `src/types/` before forms are implemented
- Backend Pydantic schemas define the canonical shape; frontend types mirror them exactly
- No silent form field additions after schemas are written

---

## 10. Antigravity Megaprompt Sequence

### Prompt NAV-01: Implement Landing Page and Public Navigation

**Goal:** Build a professional, visually compelling landing page for VERIDACT with working navigation to all public routes.

**Files to Create/Modify:**
- `frontend/src/pages/LandingPage.tsx`
- `frontend/src/components/layout/PublicLayout.tsx`
- `frontend/src/pages/LoginPage.tsx` (stub link only)

**Task:**
1. Build `LandingPage.tsx` with:
   - Hero section: VERIDACT title, tagline "See Through the Fake. Secure the Truth.", two CTA buttons
   - Features section: 3–4 feature cards (AI Detection, SHA-256 Integrity, Forensic Reports, Chain of Custody)
   - How It Works: 4-step flow (Submit → Analyze → Report → Track)
   - Stats banner: "100% Free. Runs Locally. Open Source."
   - Footer with nav links
2. Build `PublicLayout.tsx` with minimal header (logo + Login link + Track Case link)
3. Wire "Report AI Crime" button → `/submit`
4. Wire "Track Your Case" button → `/track`
5. Wire "Login" → `/login`

**Constraints:**
- Must use Tailwind CSS only (no custom CSS files)
- Must use shadcn/ui `Button` component for CTAs
- No hardcoded colors — use Tailwind theme tokens from the design system in Document 04
- Page must be responsive (looks correct on 375px mobile and 1440px desktop)

**Acceptance Criteria:**
- Landing page loads at `http://localhost:5173/`
- All three navigation buttons route to correct pages
- No TypeScript errors
- No console errors

**Commit Message:** `feat: implement landing page and public navigation layout`

---

### Prompt NAV-02: Implement Citizen Submission Wizard

**Goal:** Build the complete 4-step citizen evidence submission wizard with form validation, file upload, and confirmation screen.

**Files to Create/Modify:**
- `frontend/src/pages/SubmitEvidencePage.tsx`
- `frontend/src/components/evidence/SubmissionWizard.tsx`
- `frontend/src/components/evidence/StepIndicator.tsx`
- `frontend/src/components/ui/FileUploadBox.tsx`
- `frontend/src/services/caseService.ts` (createCase, uploadEvidence functions)

**Task:**
1. Build 4-step wizard with React Hook Form + Zod validation
2. Step 1: Complaint type radio cards (7 options from COMPLAINT_TYPES constant)
3. Step 2: Title, description, contact email, contact phone, location fields with validation
4. Step 3: FileUploadBox with drag-and-drop, file type validation, size check
5. Step 4: Summary review with all entered data + Submit button
6. On submit: POST /api/cases → POST /api/cases/{id}/evidence
7. Confirmation screen: case number, SHA-256 hash, copy buttons, download acknowledgment link, track case link

**Constraints:**
- Form state must persist across all 4 steps (single React Hook Form instance)
- File must NOT be uploaded until Step 4 "Submit" click
- Hash display must use monospace font with copy-to-clipboard button
- All API calls must handle errors gracefully

**Testing:**
1. Complete wizard with valid data → verify confirmation screen shows case number
2. Try to submit without selecting file → verify Step 3 validation error
3. Try uploading .exe file → verify rejection message
4. Try uploading 200MB file → verify client-side size rejection

**Commit Message:** `feat: implement citizen evidence submission wizard with 4-step flow`

---

### Prompt NAV-03: Implement Protected Dashboard and Case Management Pages

**Goal:** Build authenticated dashboard, case list, case detail, and evidence analysis result pages with real API integration.

**Files to Modify:**
- `frontend/src/pages/DashboardPage.tsx`
- `frontend/src/pages/CaseListPage.tsx`
- `frontend/src/pages/CaseDetailPage.tsx`
- `frontend/src/pages/EvidenceDetailPage.tsx`
- `frontend/src/components/cases/CaseTable.tsx`
- `frontend/src/components/evidence/EvidenceCard.tsx`
- `frontend/src/components/evidence/AnalysisResultCard.tsx`
- `frontend/src/components/ui/ConfidenceMeter.tsx`
- `frontend/src/components/ui/VerdictBadge.tsx`
- `frontend/src/components/ui/CustodyTimeline.tsx`

**Task:**
1. Dashboard: role-aware stats cards, recent cases list
2. Case List: filterable table with pagination, role-based filter defaults
3. Case Detail: tabs for Evidence, Notes, Custody, Reports; Actions sidebar
4. Evidence Detail: metadata card, Analyze button, loading state, AnalysisResultCard
5. ConfidenceMeter: animated Framer Motion progress bar 0–100%
6. VerdictBadge: green=authentic, yellow=suspicious, red=likely_fake, gray=inconclusive
7. CustodyTimeline: vertical timeline component with icons per action type

**Constraints:**
- ProtectedRoute must gate all /dashboard routes
- Investigator must only see assigned cases (enforced by API; UI should not show "Access Denied" for routes they have access to)
- Loading states for all data-fetching operations
- Empty states for all lists

**Testing:**
1. Log in as investigator → verify only assigned cases appear
2. Log in as admin → verify all cases appear
3. Navigate to evidence detail → click Analyze → verify loading state and result display
4. Verify custody timeline shows all events in chronological order

**Commit Message:** `feat: implement authenticated dashboard and case management pages`