from app.core.config import Settings


def build_cors_options(settings: Settings) -> dict:
    return {
        "allow_origins": settings.cors_origins,
        "allow_credentials": True,
        "allow_methods": ["*"],
        "allow_headers": ["*"],
    }
