from typing import Literal

from pydantic import AnyUrl, BaseModel, Field


class AnalysisRequest(BaseModel):
    startup_name: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1, max_length=5000)
    website_url: AnyUrl
    industry: str = Field(min_length=1, max_length=100)
    uploaded_file_id: str | None = None


class AnalysisResponse(BaseModel):
    analysis_id: str
    status: Literal["completed"]
    claims: list[str]
    competitors: list[str]
    risk_score: int
    risk_level: Literal["low", "medium", "high"]
    identified_risks: list[str]
    recommendation: Literal["Strong Buy", "Watchlist", "Proceed with Caution", "Reject"]
    confidence: float
    rationale: list[str]


class AnalysisRecord(BaseModel):
    analysis_id: str
    startup_name: str
    risk_score: int
    risk_level: Literal["low", "medium", "high"]
    competitors: list[str]
    claims: list[str]
    recommendation: Literal["Strong Buy", "Watchlist", "Proceed with Caution", "Reject"] = "Watchlist"
    confidence: float = 0.70
    rationale: list[str] = Field(
        default_factory=lambda: ["Historical record loaded before Investment Committee Agent implementation"]
    )
    timestamp: str