# 05. Backend Schema and Database Design

## 🗄️ 1. Database Schema (SQLite Relational Model)

Below is the database table configuration.

```mermaid
erDiagram
    USERS ||--o{ CASES : manages
    CASES ||--o{ MEDIA : contains
    MEDIA ||--o| FORENSIC_RESULTS : produces
    MEDIA ||--o| REPORTS : yields

    USERS {
        int id PK
        string email UK
        string password_hash
        string role "Admin | Investigator | Guest"
        datetime created_at
    }

    CASES {
        int id PK
        string title
        string description
        int user_id FK
        datetime created_at
    }

    MEDIA {
        int id PK
        string filename
        string filepath
        string mime_type
        string hash_sha256 UK
        int case_id FK
        datetime uploaded_at
    }

    FORENSIC_RESULTS {
        int id PK
        int media_id FK
        json metadata_exif
        string ela_filepath
        string noise_filepath
        float tamper_confidence_score
        datetime analyzed_at
    }

    REPORTS {
        int id PK
        int media_id FK
        string report_hash UK
        string pdf_filepath
        datetime generated_at
    }
```

---

## ⚡ 2. Indexing, Performance & Storage Setup
- **Unique Indexes**: Ensure `hash_sha256` in the `MEDIA` table is indexed to prevent processing duplicate files.
- **Foreign Keys**: Enforce referential integrity checks on deletion cascades.
- **Storage Strategy**: Original media, ELA result images, and exported PDF reports are saved in structured folders (`uploads/evidence/`, `uploads/heatmaps/`, `uploads/reports/` respectively) with only file references stored in the database.
