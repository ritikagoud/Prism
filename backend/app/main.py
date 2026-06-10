from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import get_settings
from app.core.cors import build_cors_options
from app.services.mongodb_service import MongoDBService

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize MongoDB connection
    mongodb_service = MongoDBService(
        uri=settings.mongodb_uri,
        database_name=settings.mongodb_database,
    )
    
    try:
        mongodb_service.connect()
        app.state.mongodb_service = mongodb_service
    except Exception as e:
        print(f"Warning: Could not connect to MongoDB: {e}")
        print("Falling back to JSON file storage")
        app.state.mongodb_service = None
    
    app.state.settings = settings
    yield
    
    # Shutdown: Close MongoDB connection
    if hasattr(app.state, "mongodb_service") and app.state.mongodb_service:
        app.state.mongodb_service.disconnect()


app = FastAPI(title=settings.app_name, lifespan=lifespan)
app.add_middleware(CORSMiddleware, **build_cors_options(settings))
app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/")
def root() -> dict[str, str]:
    return {"service": settings.app_name, "version": "v1"}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
