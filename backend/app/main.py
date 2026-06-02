"""
VERIDACT — FastAPI Application Entry Point
CORS middleware, router includes, startup events, health endpoint.
"""
import os
from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import config
from app.database import engine, Base
from app.routes import auth, cases, evidence, analysis, reports, custody, admin, public

# Create FastAPI application
app = FastAPI(
    title=config.APP_NAME,
    description="AI Forensic Evidence Platform — See Through the Fake. Secure the Truth.",
    version=config.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers (8 route groups)
app.include_router(auth.router)
app.include_router(cases.router)
app.include_router(evidence.router)
app.include_router(analysis.router)
app.include_router(reports.router)
app.include_router(custody.router)
app.include_router(admin.router)
app.include_router(public.router)


@app.on_event("startup")
async def startup_event():
    """Create all database tables and upload directories on startup."""
    # Import all models so Base.metadata knows about them
    try:
        from app.models import User, Case, Evidence, AnalysisResult, CustodyLog, Report, CaseNote  # noqa: F401
    except ImportError:
        pass  # Models may not exist yet during AG-02-A phase

    Base.metadata.create_all(bind=engine)

    # Create upload directories if missing
    upload_dirs = [
        os.path.join(config.UPLOAD_DIR, "evidence"),
        os.path.join(config.UPLOAD_DIR, "heatmaps"),
        os.path.join(config.UPLOAD_DIR, "reports"),
    ]
    for directory in upload_dirs:
        os.makedirs(directory, exist_ok=True)


@app.get("/api/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "version": config.APP_VERSION,
        "timestamp": datetime.utcnow().isoformat(),
    }
