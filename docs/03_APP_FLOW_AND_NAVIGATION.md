# 03. App Flow and Navigation

## 🗺️ 1. Site Map & Navigation Hierarchy

The application consists of a main sidebar layout allowing investigators to quickly switch context.

```
[Main Navigation Sidebar]
├── Dashboard (Overview of uploads & reports)
├── Media Analyzer (Upload & analyze individual media files)
├── Verification Reports (View, search, and export completed reports)
├── Case Workspaces (Group media files together by investigation case)
└── System Settings (Admin interface for analysis thresholds & users)
```

---

## 🔄 2. Main User Journeys

### Journey 1: Media Analysis & Report Generation
1. Investigator logs in and lands on **Dashboard**.
2. Clicks "New Analysis" in the sidebar/header.
3. Arrives at **Media Analyzer**, drags-and-drops an image file.
4. Platforms auto-extracts EXIF and displays basic file metadata.
5. Investigator selects "Error Level Analysis" and clicks "Run Forensic Pipeline".
6. A progress bar animates until ELA results display on an interactive overlay.
7. Investigator adds findings notes and clicks "Generate Report".
8. App navigates to **Reports Page** displaying the final PDF and verification hash.

---

## 🎨 3. Page Layouts & Wireframe Outline

### Dashboard Layout
- **Top Bar**: User profile widget, active Case selector, system notifications.
- **Left Sidebar**: Collapsible navigation links.
- **Main Area**:
  - Metric Cards: "Total Cases Active", "Pending Uploads", "Reports Generated".
  - Recent Analysis Table: Lists filename, upload date, status (Analyzing, Finished, Error).
  - Quick Actions Panel: Dropzone for immediate media analysis.
