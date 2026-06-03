from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.models.upload import UploadResponse
from app.services.upload_service import UploadService, UploadValidationError

router = APIRouter(prefix="/upload", tags=["upload"])
service = UploadService()


@router.post("", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_pdf(file: UploadFile = File(...)) -> UploadResponse:
    try:
        result = await service.store_pdf(file)
    except UploadValidationError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    return UploadResponse(
        file_id=result.file_id,
        filename=result.filename,
        size=result.size,
        status="uploaded",
    )
