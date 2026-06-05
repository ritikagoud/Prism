from fastapi import APIRouter, HTTPException

from app.models.analysis import AnalysisRecord
from app.services.analysis_persistence import AnalysisPersistenceService

router = APIRouter(prefix="/analyses", tags=["analyses"])
persistence_service = AnalysisPersistenceService.create_default()


@router.get("", response_model=list[AnalysisRecord])
def list_analyses() -> list[AnalysisRecord]:
    return persistence_service.list_analyses()


@router.get("/{analysis_id}", response_model=AnalysisRecord)
def get_analysis(analysis_id: str) -> AnalysisRecord:
    for analysis in persistence_service.list_analyses():
        if analysis.analysis_id == analysis_id:
            return analysis

    raise HTTPException(status_code=404, detail="Analysis not found.")