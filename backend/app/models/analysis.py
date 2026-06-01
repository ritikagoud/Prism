from typing import Literal

from pydantic import AnyUrl, BaseModel, Field


class AnalysisRequest(BaseModel):
    startup_name: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1, max_length=5000)
    website_url: AnyUrl
    industry: str = Field(min_length=1, max_length=100)


class AnalysisResponse(BaseModel):
    analysis_id: str
    status: Literal["queued"]