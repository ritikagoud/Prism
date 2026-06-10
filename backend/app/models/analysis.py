from typing import Literal

from pydantic import AnyUrl, BaseModel, Field


class EvidenceSourceItem(BaseModel):
    """A source of evidence for a claim."""
    source_type: str
    evidence: str
    source_reference: str | None = None


class ClaimEvidenceItem(BaseModel):
    """Evidence verification result for a single claim."""
    claim: str
    evidence_sources: list[EvidenceSourceItem]
    verification_reasoning: str
    status: Literal["Verified", "Partially Verified", "Unverified"]
    confidence: float


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
    evidence_verification: list[ClaimEvidenceItem]
    competitors: list[str]
    risk_score: int
    risk_level: Literal["low", "medium", "high"]
    identified_risks: list[str]
    recommendation: Literal["Strong Buy", "Watchlist", "Proceed with Caution", "Reject"]
    confidence: float
    rationale: list[str]
    investment_memo: str


class AnalysisRecord(BaseModel):
    analysis_id: str
    startup_name: str
    risk_score: int
    risk_level: Literal["low", "medium", "high"]
    competitors: list[str]
    claims: list[str]
    evidence_verification: list[ClaimEvidenceItem] = Field(default_factory=list)
    recommendation: Literal["Strong Buy", "Watchlist", "Proceed with Caution", "Reject"] = "Watchlist"
    confidence: float = 0.70
    rationale: list[str] = Field(
        default_factory=lambda: ["Historical record loaded before Investment Committee Agent implementation"]
    )
    investment_memo: str = Field(
        default="Investment memo not available for historical records."
    )
    timestamp: str