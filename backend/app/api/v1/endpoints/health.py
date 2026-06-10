from fastapi import APIRouter, Request

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check(request: Request) -> dict[str, str | dict]:
    """
    Health check endpoint with MongoDB connection status.
    
    Returns service status and database connectivity information.
    """
    mongodb_service = getattr(request.app.state, "mongodb_service", None)
    
    response = {"status": "ok"}
    
    if mongodb_service:
        response["database"] = {
            "type": "mongodb",
            "connected": mongodb_service.is_connected,
            "database": mongodb_service.database_name if mongodb_service.is_connected else None,
        }
    else:
        response["database"] = {
            "type": "json",
            "connected": True,
            "storage": "file",
        }
    
    return response
