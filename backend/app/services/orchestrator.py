from dataclasses import dataclass
from uuid import uuid4

from app.agents.mock import ClaimAgent, CompetitorAgent, RiskAgent
from app.models.analysis import AnalysisRequest, AnalysisResponse


@dataclass(slots=True)
class OrchestratorService:
    claim_agent: ClaimAgent
    competitor_agent: CompetitorAgent
    risk_agent: RiskAgent

    @classmethod
    def create_default(cls) -> "OrchestratorService":
        return cls(
            claim_agent=ClaimAgent(),
            competitor_agent=CompetitorAgent(),
            risk_agent=RiskAgent(),
        )

    def run(self, request: AnalysisRequest) -> AnalysisResponse:
        claims_result = self.claim_agent.run(request)
        competitors_result = self.competitor_agent.run(request)
        risk_result = self.risk_agent.run(request)

        return AnalysisResponse(
            analysis_id=str(uuid4()),
            status="completed",
            claims=claims_result.claims,
            competitors=competitors_result.competitors,
            risk_score=risk_result.risk_score,
            risk_level=risk_result.risk_level,
        )