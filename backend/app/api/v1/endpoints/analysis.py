from fastapi import APIRouter, Request, status

from app.models.analysis import AnalysisRequest, AnalysisResponse
from app.services.orchestrator import OrchestratorService

router = APIRouter(prefix="/analysis", tags=["analysis"])


def get_orchestrator(request: Request) -> OrchestratorService:
    """Get orchestrator service with MongoDB if available."""
    mongodb_service = getattr(request.app.state, "mongodb_service", None)
    
    if mongodb_service and mongodb_service.is_connected:
        return OrchestratorService.create_with_mongodb(mongodb_service)
    return OrchestratorService.create_default()


@router.post("", response_model=AnalysisResponse, status_code=status.HTTP_200_OK)
def create_analysis(payload: AnalysisRequest, request: Request) -> AnalysisResponse:
    orchestrator = get_orchestrator(request)
    return orchestrator.run(payload)