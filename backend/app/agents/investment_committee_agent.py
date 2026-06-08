from __future__ import annotations

from dataclasses import dataclass
from typing import Literal


RecommendationType = Literal["Strong Buy", "Watchlist", "Proceed with Caution", "Reject"]


@dataclass(slots=True)
class InvestmentCommitteeResult:
    recommendation: RecommendationType
    confidence: float
    rationale: list[str]


class InvestmentCommitteeAgent:
    """
    Investment Committee Agent - Generates investment decisions based on claims, competitors, and risk.
    
    Uses deterministic rule-based logic:
    - Low risk (0-34) + strong claims → Strong Buy
    - Low risk + weak claims → Watchlist
    - Medium risk (35-69) + strong claims + few competitors → Proceed with Caution
    - Medium risk + many competitors or weak claims → Watchlist
    - High risk (70-100) → Reject
    """
    
    name = "investment-committee-agent"

    def run(
        self,
        claims: list[str],
        competitors: list[str],
        risk_score: int,
        risk_level: str,
    ) -> InvestmentCommitteeResult:
        """
        Generate investment recommendation based on analysis inputs.
        
        Args:
            claims: List of startup claims/value propositions
            competitors: List of identified competitors
            risk_score: Risk score (0-100)
            risk_level: Risk level ('low', 'medium', 'high')
        
        Returns:
            InvestmentCommitteeResult with recommendation, confidence, and rationale
        """
        rationale: list[str] = []
        
        # Analyze inputs
        claim_strength = self._assess_claim_strength(claims)
        competitor_pressure = self._assess_competitor_pressure(competitors)
        
        # Apply decision logic
        if risk_level == "high":
            recommendation = "Reject"
            confidence = self._calculate_confidence(risk_score, claim_strength, competitor_pressure)
            rationale.append(f"High risk level (score: {risk_score}) indicates significant execution challenges")
            rationale.append("Risk profile exceeds acceptable investment threshold")
            if len(competitors) > 5:
                rationale.append(f"Highly competitive market with {len(competitors)} identified competitors")
        
        elif risk_level == "medium":
            if claim_strength == "strong" and competitor_pressure == "low":
                recommendation = "Proceed with Caution"
                confidence = self._calculate_confidence(risk_score, claim_strength, competitor_pressure)
                rationale.append(f"Medium risk (score: {risk_score}) requires careful evaluation")
                rationale.append(f"Strong value proposition with {len(claims)} clear claims")
                rationale.append("Limited competitive pressure provides market opportunity")
            else:
                recommendation = "Watchlist"
                confidence = self._calculate_confidence(risk_score, claim_strength, competitor_pressure)
                rationale.append(f"Medium risk level (score: {risk_score}) warrants monitoring")
                if competitor_pressure != "low":
                    rationale.append(f"Significant competition with {len(competitors)} competitors identified")
                if claim_strength != "strong":
                    rationale.append("Value proposition requires further validation")
        
        else:  # low risk
            if claim_strength == "strong":
                recommendation = "Strong Buy"
                confidence = self._calculate_confidence(risk_score, claim_strength, competitor_pressure)
                rationale.append(f"Low risk profile (score: {risk_score}) indicates stable execution path")
                rationale.append(f"Strong value proposition supported by {len(claims)} validated claims")
                if competitor_pressure == "low":
                    rationale.append("Favorable competitive positioning in target market")
                else:
                    rationale.append("Market opportunity exists despite competitive landscape")
            else:
                recommendation = "Watchlist"
                confidence = self._calculate_confidence(risk_score, claim_strength, competitor_pressure)
                rationale.append(f"Low risk (score: {risk_score}) but value proposition needs strengthening")
                rationale.append(f"Limited claims ({len(claims)}) require further market validation")
        
        return InvestmentCommitteeResult(
            recommendation=recommendation,
            confidence=confidence,
            rationale=rationale,
        )
    
    def _assess_claim_strength(self, claims: list[str]) -> Literal["strong", "moderate", "weak"]:
        """Assess the strength of startup claims."""
        claim_count = len(claims)
        
        if claim_count >= 5:
            return "strong"
        elif claim_count >= 3:
            return "moderate"
        else:
            return "weak"
    
    def _assess_competitor_pressure(self, competitors: list[str]) -> Literal["low", "medium", "high"]:
        """Assess competitive pressure based on number of competitors."""
        competitor_count = len(competitors)
        
        if competitor_count <= 2:
            return "low"
        elif competitor_count <= 5:
            return "medium"
        else:
            return "high"
    
    def _calculate_confidence(
        self,
        risk_score: int,
        claim_strength: str,
        competitor_pressure: str,
    ) -> float:
        """
        Calculate confidence score (0.0 to 1.0) based on multiple factors.
        
        Higher confidence when:
        - Risk score is extreme (very low or very high) - clearer decision
        - Strong claim strength
        - Clear competitive positioning (very low or very high)
        """
        base_confidence = 0.70
        
        # Risk score contribution - higher confidence at extremes
        if risk_score <= 25 or risk_score >= 80:
            risk_adjustment = 0.15
        elif risk_score <= 35 or risk_score >= 70:
            risk_adjustment = 0.10
        else:
            risk_adjustment = 0.00
        
        # Claim strength contribution
        claim_adjustment = {
            "strong": 0.10,
            "moderate": 0.05,
            "weak": 0.00,
        }[claim_strength]
        
        # Competitor pressure contribution - confidence higher at extremes
        competitor_adjustment = {
            "low": 0.05,
            "medium": 0.00,
            "high": 0.05,
        }[competitor_pressure]
        
        confidence = base_confidence + risk_adjustment + claim_adjustment + competitor_adjustment
        
        # Ensure confidence is within bounds
        return round(min(1.0, max(0.5, confidence)), 2)
