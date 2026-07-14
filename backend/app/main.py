from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.core.config import settings

from contextlib import asynccontextmanager
from app.db.init_db import init_db
from app.database import SessionLocal

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB
    db = SessionLocal()
    init_db(db)
    db.close()
    yield

app = FastAPI(
    title="StadiumOS Copilot API",
    description="AI-enabled real-time stadium operations and fan-experience platform",
    version="0.1.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {
        "message": "Welcome to StadiumOS Copilot API",
        "version": "0.1.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}