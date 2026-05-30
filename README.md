# VERIDACT

> The ultimate digital forensics and media verification suite for tamper detection, authenticity validation, and truth assurance.

---

## 🛠️ Tech Stack

Veridact is built using a modern, scalable, and secure technology stack designed for high-performance forensics analysis:

- **Frontend**: React (Next.js / Vite), TypeScript, Tailwind CSS, Lucide Icons, Recharts (for analytics & metadata visualization)
- **Backend API**: Python (FastAPI / Flask) or Node.js (Express) with robust asynchronous handling
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **Forensic & Computer Vision Engines**: OpenCV, TensorFlow/PyTorch (Deepfake detection models), PIL (Pillow), Librosa (Audio analysis)
- **Caching & Background Tasks**: Redis & Celery (for long-running media processing jobs)

---

## 🚀 Quickstart Commands

*(To be finalized and filled as implementation progresses)*

```bash
# Clone the repository
git clone https://github.com/your-username/veridact.git
cd veridact

# Setup Backend environment
# [Detailed instructions to be filled]

# Setup Frontend environment
# [Detailed instructions to be filled]
```

---

## ✨ Feature Overview

Veridact provides a comprehensive suite of digital media verification and forensic investigation tools:

1. **Image & Video Forensics**:
   - **Metadata Analysis**: Extraction of EXIF data, software signatures, camera profiles, and GPS coordinates.
   - **Error Level Analysis (ELA)**: Detects differences in image compression levels to pinpoint manipulated regions.
   - **Noise Analysis**: Identifies inconsistencies in the sensor noise pattern of an image.
   - **Clone/Copy-Move Detection**: Highlights duplicated regions within a single frame.

2. **Audio Authenticity**:
   - **Spectral Analysis**: Visualizes audio frequencies to detect splicing, cuts, or insertions.
   - **Voiceprint Verification**: Ensures speaker identity and detects deepfake/synthesized voice profiles.

3. **Tamper Visualization**:
   - **Interactive Heatmaps**: Overlay maps pinpointing exact coordinates of detected edits and anomalies.

4. **Forensic Reporting & Chain of Custody**:
   - **Immutable Logging**: Secures evidentiary files with cryptographic hashing.
   - **Professional Export**: Generates PDF/HTML reports with detailed analysis summaries and evidence history.

---

## 👤 User Roles

The platform supports distinct permission tiers tailored to specific workflows:

*   **Forensic Investigator / Analyst**: Core user with full access to upload media, run analysis pipelines, view detailed heatmaps, and export forensic reports.
*   **Admin / Supervisor**: Manages system configurations, oversees analyst workspaces, reviews reports, and manages user accounts.
*   **Guest / Reporter**: Read-only access to view verified reports and check verification status using a public report hash.

---

## 📂 Project Documentation

All design requirements, technical briefs, and implementation plans are located in the [docs/](file:///c:/Users/avdes/OneDrive/Desktop/Veridact/veridact/docs/) folder:

1. [01_PRODUCT_REQUIREMENTS_DOCUMENT.md](file:///c:/Users/avdes/OneDrive/Desktop/Veridact/veridact/docs/01_PRODUCT_REQUIREMENTS_DOCUMENT.md) - Core scope, feature requirements, and user personas.
2. [02_TECHNICAL_REQUIREMENTS_DOCUMENT.md](file:///c:/Users/avdes/OneDrive/Desktop/Veridact/veridact/docs/02_TECHNICAL_REQUIREMENTS_DOCUMENT.md) - Architecture, API, and safety guidelines.
3. [03_APP_FLOW_AND_NAVIGATION.md](file:///c:/Users/avdes/OneDrive/Desktop/Veridact/veridact/docs/03_APP_FLOW_AND_NAVIGATION.md) - Site hierarchy and user flow layouts.
4. [04_UI_UX_DESIGN_BRIEF.md](file:///c:/Users/avdes/OneDrive/Desktop/Veridact/veridact/docs/04_UI_UX_DESIGN_BRIEF.md) - Visual style, themes, and interactive components.
5. [05_BACKEND_SCHEMA_AND_DATABASE_DESIGN.md](file:///c:/Users/avdes/OneDrive/Desktop/Veridact/veridact/docs/05_BACKEND_SCHEMA_AND_DATABASE_DESIGN.md) - Relational schemas, index structures, and storage layout.
6. [06_IMPLEMENTATION_PLAN.md](file:///c:/Users/avdes/OneDrive/Desktop/Veridact/veridact/docs/06_IMPLEMENTATION_PLAN.md) - Phased development timeline and verification matrix.
