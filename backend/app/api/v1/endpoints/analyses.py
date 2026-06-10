from fastapi import APIRouter, HTTPException, Request

from app.models.analysis import AnalysisRecord
from app.services.analysis_persistence import AnalysisPersistenceService
from app.services.mongodb_analysis_persistence import MongoDBAnalysisPersistenceService

router = APIRouter(prefix="/analyses", tags=["analyses"])


def get_persistence_service(request: Request) -> AnalysisPersistenceService:
    """Get persistence service with MongoDB if available."""
    mongodb_service = getattr(request.app.state, "mongodb_service", None)
    
    if mongodb_service and mongodb_service.is_connected:
        mongodb_persistence = MongoDBAnalysisPersistenceService(mongodb_service)
        return AnalysisPersistenceService.create_with_mongodb(mongodb_persistence)
    return AnalysisPersistenceService.create_default()


@router.get("", response_model=list[AnalysisRecord])
def list_analyses(request: Request) -> list[AnalysisRecord]:
    persistence_service = get_persistence_service(request)
    return persistence_service.list_analyses()


@router.get("/{analysis_id}", response_model=AnalysisRecord)
def get_analysis(analysis_id: str, request: Request) -> AnalysisRecord:
    persistence_service = get_persistence_service(request)
    analysis = persistence_service.get_analysis(analysis_id)
    
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found.")
    
    return analysis