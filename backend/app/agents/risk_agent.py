from __future__ import annotations

from dataclasses import dataclass
from typing import Literal, TypedDict

from app.models.analysis import AnalysisRequest


RiskLevel = Literal["low", "medium", "high"]


class RiskProfile(TypedDict):
    score: int
    risks: list[str]


@dataclass(slots=True)
class RiskAgentResult:
    risk_score: int
    risk_level: RiskLevel
    identified_risks: list[str]


class RiskAgent:
    name = "risk-agent"

    def run(self, request: AnalysisRequest) -> RiskAgentResult:
        return self.analyze(
            startup_name=request.startup_name,
            description=request.description,
            industry=request.industry,
        )

    def analyze(self, startup_name: str, description: str, industry: str) -> RiskAgentResult:
        del startup_name

        normalized_industry = industry.strip().casefold()
        normalized_description = description.strip().casefold()

        if not normalized_industry and not normalized_description:
            return RiskAgentResult(
                risk_score=55,
                risk_level="medium",
                identified_risks=["General execution risk", "Market uncertainty"],
            )

        profile = self._profile_for_industry(normalized_industry)
        identified_risks = list(profile["risks"])

        if any(keyword in normalized_description for keyword in ("regulat", "compliance", "gdpr", "hipaa")):
            identified_risks.append("Regulatory compliance")
        if any(keyword in normalized_description for keyword in ("fraud", "security", "breach")):
            identified_risks.append("Fraud and security risk")
        if any(keyword in normalized_description for keyword in ("privacy", "patient", "health")):
            identified_risks.append("Data privacy exposure")
        if any(keyword in normalized_description for keyword in ("competition", "competitive", "crowded")):
            identified_risks.append("Competitive pressure")

        risk_score = self._adjust_score(profile["score"], normalized_description)
        risk_level = self._risk_level_from_score(risk_score)

        return RiskAgentResult(
            risk_score=risk_score,
            risk_level=risk_level,
            identified_risks=self._dedupe(identified_risks),
        )

    def _profile_for_industry(self, industry: str) -> RiskProfile:
        if "fintech" in industry:
            return {
                "score": 82,
                "risks": ["Regulatory compliance", "Fraud risk"],
            }
        if "healthtech" in industry or "health" in industry:
            return {
                "score": 86,
                "risks": ["Compliance", "Patient data privacy"],
            }
        if "edtech" in industry or "education" in industry:
            return {
                "score": 44,
                "risks": ["User acquisition", "Content quality"],
            }
        if "ai" in industry or "saas" in industry:
            return {
                "score": 52,
                "risks": ["Competition", "Model reliability"],
            }

        return {
            "score": 55,
            "risks": ["Market uncertainty", "Execution risk"],
        }

    def _adjust_score(self, base_score: int, description: str) -> int:
        score = base_score

        if any(keyword in description for keyword in ("strong traction", "revenue", "profit", "retention")):
            score -= 6
        if any(keyword in description for keyword in ("pre-launch", "early", "beta", "uncertain", "unproven")):
            score += 8
        if any(keyword in description for keyword in ("regulated", "compliance", "privacy", "security")):
            score += 5

        return max(0, min(100, score))

    def _risk_level_from_score(self, score: int) -> str:
        if score >= 70:
            return "high"
        if score >= 35:
            return "medium"
        return "low"

    def _dedupe(self, risks: list[str]) -> list[str]:
        unique_risks: list[str] = []
        seen: set[str] = set()

        for risk in risks:
            normalized = risk.strip()
            key = normalized.casefold()
            if not normalized or key in seen:
                continue
            seen.add(key)
            unique_risks.append(normalized)

        return unique_risks