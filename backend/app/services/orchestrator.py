from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from app.agents.claim_agent import ClaimAgent
from app.agents.competitor_agent import CompetitorAgent
from app.agents.evidence_verification_agent import EvidenceVerificationAgent
from app.agents.investment_committee_agent import InvestmentCommitteeAgent
from app.agents.risk_agent import RiskAgent
from app.models.analysis import AnalysisRecord, AnalysisRequest, AnalysisResponse, ClaimEvidenceItem
from app.services.analysis_persistence import AnalysisPersistenceService
from app.services.investment_memo_service import InvestmentMemoService
from app.services.mongodb_analysis_persistence import MongoDBAnalysisPersistenceService
from app.services.mongodb_service import MongoDBService


@dataclass(slots=True)
class OrchestratorService:
    claim_agent: ClaimAgent
    evidence_verification_agent: EvidenceVerificationAgent
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
            evidence_verification_agent=EvidenceVerificationAgent(),
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
            evidence_verification_agent=EvidenceVerificationAgent(),
            competitor_agent=CompetitorAgent(),
            risk_agent=RiskAgent(),
            investment_committee_agent=InvestmentCommitteeAgent(),
            investment_memo_service=InvestmentMemoService(),
            analysis_persistence=AnalysisPersistenceService.create_with_mongodb(mongodb_persistence),
        )

    def run(self, request: AnalysisRequest) -> AnalysisResponse:
        # Step 0: Retrieve extracted text if file was uploaded
        extracted_text: str | None = None
        if request.uploaded_file_id:
            extracted_text = self._retrieve_extracted_text(request.uploaded_file_id)
        
        # Step 1: Extract claims
        claims_result = self.claim_agent.run(request.startup_name, request.description)
        
        # Step 2: Verify evidence for claims (with extracted text if available)
        evidence_result = self.evidence_verification_agent.run(
            claims=claims_result.claims,
            startup_name=request.startup_name,
            description=request.description,
            extracted_text=extracted_text,
        )
        
        # Step 3: Identify competitors
        competitors_result = self.competitor_agent.run(request)
        
        # Step 4: Assess risk
        risk_result = self.risk_agent.run(request)
        
        # Step 5: Generate investment recommendation
        investment_result = self.investment_committee_agent.run(
            claims=claims_result.claims,
            competitors=competitors_result.competitors,
            risk_score=risk_result.risk_score,
            risk_level=risk_result.risk_level,
        )

        # Convert evidence results to Pydantic models
        evidence_items = [
            ClaimEvidenceItem(
                claim=ev.claim,
                evidence_sources=[
                    {
                        "source_type": src.source_type,
                        "evidence": src.evidence,
                        "source_reference": src.source_reference,
                    }
                    for src in ev.evidence_sources
                ],
                verification_reasoning=ev.verification_reasoning,
                status=ev.status,
                confidence=ev.confidence,
            )
            for ev in evidence_result.verified_claims
        ]

        # Step 6: Generate investment memo
        memo_result = self.investment_memo_service.generate_memo(
            startup_name=request.startup_name,
            claims=claims_result.claims,
            competitors=competitors_result.competitors,
            risk_score=risk_result.risk_score,
            risk_level=risk_result.risk_level,
            recommendation=investment_result.recommendation,
            confidence=investment_result.confidence,
            rationale=investment_result.rationale,
            evidence_verification=evidence_items,
        )

        response = AnalysisResponse(
            analysis_id=str(uuid4()),
            status="completed",
            claims=claims_result.claims,
            evidence_verification=evidence_items,
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
                evidence_verification=response.evidence_verification,
                recommendation=response.recommendation,
                confidence=response.confidence,
                rationale=response.rationale,
                investment_memo=response.investment_memo,
                timestamp=datetime.now(timezone.utc).isoformat(),
            )
        )

        return response
    
    def _retrieve_extracted_text(self, file_id: str) -> str | None:
        """
        Retrieve extracted text from uploaded file using file_id.
        
        The text is stored as a .txt sidecar file alongside the PDF.
        Returns None if file not found or cannot be read.
        """
        # Construct uploads directory path
        uploads_dir = Path(__file__).resolve().parents[2] / "uploads"
        
        # Find the text file matching the file_id
        # Files are named as: {file_id}_{original_name}.txt
        text_files = list(uploads_dir.glob(f"{file_id}_*.txt"))
        
        if not text_files:
            return None
        
        # Use the first matching file (should only be one)
        text_file = text_files[0]
        
        try:
            return text_file.read_text(encoding="utf-8")
        except Exception:
            # If we can't read the file, return None
            return None