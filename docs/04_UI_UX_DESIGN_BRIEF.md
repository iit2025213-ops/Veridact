# 04. UI/UX Design Brief

## 🎨 1. Theme, Styling & Tone
- **Tone**: Professional, authoritative, clean, trustworthy, high-tech.
- **Color Palette (Dark Mode First)**:
  - Background: HSL(222, 47%, 11%) - Deep Navy Slate
  - Cards / Panels: HSL(223, 47%, 16%) - Dark Slate Gray
  - Border / Muted: HSL(217, 32%, 25%)
  - Accent / Primary: HSL(210, 100%, 50%) - Cyber Blue
  - Danger / Tamper Detected: HSL(0, 84%, 60%) - Signal Red
  - Success / Authentic: HSL(142, 70%, 45%) - Verification Green
- **Typography**:
  - Primary Font: *Inter* or *Outfit* for modern tech appeal.
  - Monospace Font: *Fira Code* or *JetBrains Mono* for displaying metadata tags and hash values.

---

## ⚡ 2. Core Interactive Components & Patterns

### 2.1 Media Dropzone
- Interactive dash-border dropzone.
- Hover-states with glowing primary border.
- Real-time file type validation triggers (turning border red if file format is unsupported).

### 2.2 Compare Slider (Before/After)
- Horizontal slider overlay allowing the user to drag a bar to compare the original image side-by-side with ELA heatmaps/noise anomalies.

### 2.3 Interactive EXIF Table
- Filterable, searchable datatable listing all extracted tags (e.g., Camera Model, Software, Date/Time, GPS Coordinates).
- Tags modified by editing software (e.g., Photoshop) are highlighted in amber.
