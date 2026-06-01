from fastapi import APIRouter, status

from app.models.analysis import AnalysisRequest, AnalysisResponse
from app.services.orchestrator import OrchestratorService

router = APIRouter(prefix="/analysis", tags=["analysis"])
orchestrator = OrchestratorService.create_default()


@router.post("", response_model=AnalysisResponse, status_code=status.HTTP_200_OK)
def create_analysis(payload: AnalysisRequest) -> AnalysisResponse:
    return orchestrator.run(payload)