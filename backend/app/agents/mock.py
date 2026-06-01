from dataclasses import dataclass
from typing import Literal

from app.models.analysis import AnalysisRequest


@dataclass(slots=True)
class ClaimAgentResult:
    claims: list[str]


@dataclass(slots=True)
class CompetitorAgentResult:
    competitors: list[str]


@dataclass(slots=True)
class RiskAgentResult:
    risk_score: int
    risk_level: Literal["low", "medium", "high"]


class ClaimAgent:
    name = "claim-agent"

    def run(self, request: AnalysisRequest) -> ClaimAgentResult:
        return ClaimAgentResult(
            claims=["Rapid user growth", "Strong market opportunity"],
        )


class CompetitorAgent:
    name = "competitor-agent"

    def run(self, request: AnalysisRequest) -> CompetitorAgentResult:
        return CompetitorAgentResult(
            competitors=["Example Competitor A", "Example Competitor B"],
        )


class RiskAgent:
    name = "risk-agent"

    def run(self, request: AnalysisRequest) -> RiskAgentResult:
        return RiskAgentResult(risk_score=42, risk_level="medium")