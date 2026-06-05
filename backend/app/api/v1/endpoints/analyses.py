from fastapi import APIRouter

from app.models.analysis import AnalysisRecord
from app.services.analysis_persistence import AnalysisPersistenceService

router = APIRouter(prefix="/analyses", tags=["analyses"])
persistence_service = AnalysisPersistenceService.create_default()


@router.get("", response_model=list[AnalysisRecord])
def list_analyses() -> list[AnalysisRecord]:
    return persistence_service.list_analyses()