from dataclasses import dataclass

from app.models.analysis import AnalysisRequest


@dataclass(slots=True)
class CompetitorAgentResult:
    competitors: list[str]


class CompetitorAgent:
    name = "competitor-agent"

    def run(self, request: AnalysisRequest) -> CompetitorAgentResult:
        return CompetitorAgentResult(
            competitors=["Example Competitor A", "Example Competitor B"],
        )


class RiskAgent:
    name = "risk-agent"

