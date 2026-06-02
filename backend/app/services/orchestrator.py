from dataclasses import dataclass
from uuid import uuid4

from app.agents.claim_agent import ClaimAgent
from app.agents.competitor_agent import CompetitorAgent
from app.agents.risk_agent import RiskAgent
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
        claims_result = self.claim_agent.run(request.startup_name, request.description)
        competitors_result = self.competitor_agent.run(request)
        risk_result = self.risk_agent.run(request)

        return AnalysisResponse(
            analysis_id=str(uuid4()),
            status="completed",
            claims=claims_result.claims,
            competitors=competitors_result.competitors,
            risk_score=risk_result.risk_score,
            risk_level=risk_result.risk_level,
            identified_risks=risk_result.identified_risks,
        )