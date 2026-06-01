from uuid import uuid4

from fastapi import APIRouter, status

from app.models.analysis import AnalysisRequest, AnalysisResponse

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.post("", response_model=AnalysisResponse, status_code=status.HTTP_202_ACCEPTED)
def create_analysis(payload: AnalysisRequest) -> AnalysisResponse:
    return AnalysisResponse(analysis_id=str(uuid4()), status="queued")