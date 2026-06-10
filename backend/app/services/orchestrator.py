from dataclasses import dataclass
from datetime import datetime, timezone
from uuid import uuid4

from app.agents.claim_agent import ClaimAgent
from app.agents.competitor_agent import CompetitorAgent
from app.agents.investment_committee_agent import InvestmentCommitteeAgent
from app.agents.risk_agent import RiskAgent
from app.models.analysis import AnalysisRecord, AnalysisRequest, AnalysisResponse
from app.services.analysis_persistence import AnalysisPersistenceService
from app.services.investment_memo_service import InvestmentMemoService
from app.services.mongodb_analysis_persistence import MongoDBAnalysisPersistenceService
from app.services.mongodb_service import MongoDBService


@dataclass(slots=True)
class OrchestratorService:
    claim_agent: ClaimAgent
    competitor_agent: CompetitorAgent
    risk_agent: RiskAgent
    investment_committee_agent: InvestmentCommitteeAgent
    investment_memo_service: InvestmentMemoService
    analysis_persistence: AnalysisPersistenceService

    @classmethod
    def create_default(cls) -> "OrchestratorService":
        """Create orchestrator with default JSON persistence."""
        return cls(
            claim_agent=ClaimAgent(),
            competitor_agent=CompetitorAgent(),
            risk_agent=RiskAgent(),
            investment_committee_agent=InvestmentCommitteeAgent(),
            investment_memo_service=InvestmentMemoService(),
            analysis_persistence=AnalysisPersistenceService.create_default(),
        )
    
    @classmethod
    def create_with_mongodb(cls, mongodb_service: MongoDBService) -> "OrchestratorService":
        """Create orchestrator with MongoDB persistence."""
        mongodb_persistence = MongoDBAnalysisPersistenceService(mongodb_service)
        return cls(
            claim_agent=ClaimAgent(),
            competitor_agent=CompetitorAgent(),
            risk_agent=RiskAgent(),
            investment_committee_agent=InvestmentCommitteeAgent(),
            investment_memo_service=InvestmentMemoService(),
            analysis_persistence=AnalysisPersistenceService.create_with_mongodb(mongodb_persistence),
        )

    def run(self, request: AnalysisRequest) -> AnalysisResponse:
        claims_result = self.claim_agent.run(request.startup_name, request.description)
        competitors_result = self.competitor_agent.run(request)
        risk_result = self.risk_agent.run(request)
        
        investment_result = self.investment_committee_agent.run(
            claims=claims_result.claims,
            competitors=competitors_result.competitors,
            risk_score=risk_result.risk_score,
            risk_level=risk_result.risk_level,
        )

        memo_result = self.investment_memo_service.generate_memo(
            startup_name=request.startup_name,
            claims=claims_result.claims,
            competitors=competitors_result.competitors,
            risk_score=risk_result.risk_score,
            risk_level=risk_result.risk_level,
            recommendation=investment_result.recommendation,
            confidence=investment_result.confidence,
            rationale=investment_result.rationale,
        )

        response = AnalysisResponse(
            analysis_id=str(uuid4()),
            status="completed",
            claims=claims_result.claims,
            competitors=competitors_result.competitors,
            risk_score=risk_result.risk_score,
            risk_level=risk_result.risk_level,
            identified_risks=risk_result.identified_risks,
            recommendation=investment_result.recommendation,
            confidence=investment_result.confidence,
            rationale=investment_result.rationale,
            investment_memo=memo_result.memo,
        )

        self.analysis_persistence.save_analysis(
            AnalysisRecord(
                analysis_id=response.analysis_id,
                startup_name=request.startup_name,
                risk_score=response.risk_score,
                risk_level=response.risk_level,
                competitors=response.competitors,
                claims=response.claims,
                recommendation=response.recommendation,
                confidence=response.confidence,
                rationale=response.rationale,
                investment_memo=response.investment_memo,
                timestamp=datetime.now(timezone.utc).isoformat(),
            )
        )

        return response