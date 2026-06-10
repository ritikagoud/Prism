"""Investment Memo Generator Service.

Generates professional VC-style investment memos from analysis results
using deterministic templates without LLMs.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone


@dataclass(slots=True)
class InvestmentMemoResult:
    """Result containing the generated investment memo."""
    
    memo: str
    generated_at: str


class InvestmentMemoService:
    """Service for generating investment memos from analysis data."""
    
    def generate_memo(
        self,
        startup_name: str,
        claims: list[str],
        competitors: list[str],
        risk_score: int,
        risk_level: str,
        recommendation: str,
        confidence: float,
        rationale: list[str],
    ) -> InvestmentMemoResult:
        """
        Generate a professional investment memo from analysis results.
        
        Args:
            startup_name: Name of the startup
            claims: List of validated claims
            competitors: List of identified competitors
            risk_score: Risk score (0-100)
            risk_level: Risk level (low, medium, high)
            recommendation: Investment recommendation
            confidence: Confidence score (0.0-1.0)
            rationale: List of rationale statements
        
        Returns:
            InvestmentMemoResult with the formatted memo
        """
        sections = [
            self._generate_header(startup_name),
            self._generate_executive_summary(
                startup_name, recommendation, confidence, risk_score, risk_level
            ),
            self._generate_business_overview(startup_name, claims),
            self._generate_competitive_landscape(startup_name, competitors),
            self._generate_risk_assessment(risk_score, risk_level),
            self._generate_investment_recommendation(recommendation, confidence, rationale),
            self._generate_footer(),
        ]
        
        memo = "\n\n".join(sections)
        
        return InvestmentMemoResult(
            memo=memo,
            generated_at=datetime.now(timezone.utc).isoformat(),
        )
    
    def _generate_header(self, startup_name: str) -> str:
        """Generate memo header."""
        timestamp = datetime.now(timezone.utc).strftime("%B %d, %Y")
        
        return f"""CONFIDENTIAL INVESTMENT MEMO

Company: {startup_name}
Date: {timestamp}
Prepared by: Prism AI Due Diligence Platform

---"""
    
    def _generate_executive_summary(
        self,
        startup_name: str,
        recommendation: str,
        confidence: float,
        risk_score: int,
        risk_level: str,
    ) -> str:
        """Generate executive summary section."""
        confidence_pct = int(confidence * 100)
        
        # Determine investment stance language
        stance_map = {
            "Strong Buy": "highly recommend proceeding with investment",
            "Watchlist": "recommend continued monitoring",
            "Proceed with Caution": "recommend proceeding with careful evaluation",
            "Reject": "recommend declining this investment opportunity",
        }
        stance = stance_map.get(recommendation, "have completed analysis")
        
        return f"""EXECUTIVE SUMMARY

Following comprehensive due diligence, we {stance} in {startup_name}. Our analysis indicates a {risk_level} risk profile (score: {risk_score}/100) with a recommendation confidence of {confidence_pct}%.

Recommendation: {recommendation}

This assessment is based on systematic evaluation of the company's business model, competitive positioning, and risk factors through our multi-agent analysis framework."""
    
    def _generate_business_overview(self, startup_name: str, claims: list[str]) -> str:
        """Generate business overview section."""
        if not claims:
            return f"""BUSINESS OVERVIEW

Our analysis of {startup_name} did not identify sufficient validated claims to establish a comprehensive business overview. This may indicate limited public information or early-stage development where the value proposition is not yet clearly defined.

Recommendation: Request additional documentation from the founding team, including pitch deck, product demos, and customer testimonials."""
        
        claims_text = "\n".join(f"• {claim}" for claim in claims)
        claim_count = len(claims)
        
        strength_assessment = (
            "strong and well-articulated" if claim_count >= 5
            else "moderate" if claim_count >= 3
            else "developing"
        )
        
        return f"""BUSINESS OVERVIEW

{startup_name} presents a {strength_assessment} value proposition based on our analysis of {claim_count} key claims:

{claims_text}

The company's positioning suggests a focused approach to addressing market needs. The clarity and number of validated claims indicate {"a mature go-to-market strategy" if claim_count >= 5 else "an evolving market strategy that requires further validation" if claim_count >= 3 else "an early-stage value proposition requiring significant development"}."""
    
    def _generate_competitive_landscape(self, startup_name: str, competitors: list[str]) -> str:
        """Generate competitive landscape section."""
        if not competitors:
            return f"""COMPETITIVE LANDSCAPE

Our analysis did not identify direct competitors to {startup_name}. This could indicate:

• A novel market category or blue ocean opportunity
• Limited public information about competitive dynamics
• Early-stage market that has not yet attracted significant competition
• Unique positioning that differentiates from traditional market players

Recommendation: Conduct deeper competitive analysis and validate the uniqueness of the market approach with industry experts."""
        
        competitor_count = len(competitors)
        competitors_text = "\n".join(f"• {competitor}" for competitor in competitors)
        
        # Assess competitive intensity
        if competitor_count <= 2:
            intensity = "limited"
            implication = "This suggests favorable market conditions with potential for market leadership and pricing power."
        elif competitor_count <= 5:
            intensity = "moderate"
            implication = "This indicates a developing market with established players but room for differentiation."
        else:
            intensity = "high"
            implication = "This reflects a crowded market requiring strong differentiation and execution to succeed."
        
        return f"""COMPETITIVE LANDSCAPE

{startup_name} operates in a market with {intensity} competitive intensity. Our analysis identified {competitor_count} direct or adjacent competitors:

{competitors_text}

Market Implications:
{implication}

Competitive dynamics will require {startup_name} to demonstrate clear differentiation through {"technological innovation, superior customer experience, or unique market positioning" if competitor_count > 3 else "consistent execution and customer acquisition"} to capture meaningful market share."""
    
    def _generate_risk_assessment(self, risk_score: int, risk_level: str) -> str:
        """Generate risk assessment section."""
        # Risk level descriptors
        level_descriptor = {
            "low": "favorable risk-return profile",
            "medium": "balanced risk-return profile requiring careful evaluation",
            "high": "elevated risk profile requiring significant scrutiny",
        }
        descriptor = level_descriptor.get(risk_level, "uncertain risk profile")
        
        # Risk implications
        if risk_level == "low":
            implications = """• High probability of successful execution
• Stable regulatory and market environment
• Lower expected volatility in returns
• Suitable for core portfolio allocation"""
        elif risk_level == "medium":
            implications = """• Moderate execution risk requiring active monitoring
• Some regulatory or market uncertainties
• Expected volatility within acceptable ranges
• Suitable for growth portfolio allocation with oversight"""
        else:  # high
            implications = """• Significant execution challenges identified
• Major regulatory, market, or operational concerns
• High expected volatility and potential for loss
• Requires exceptional risk mitigation strategies or avoidance"""
        
        return f"""RISK ASSESSMENT

Risk Score: {risk_score}/100 ({risk_level.upper()})

Our systematic risk analysis indicates a {descriptor}. The risk score of {risk_score} places this opportunity in the {risk_level} risk category based on our evaluation framework.

Key Implications:
{implications}

This risk assessment reflects quantitative analysis of market, execution, regulatory, and competitive factors. Investors should consider this profile in the context of their portfolio strategy and risk tolerance."""
    
    def _generate_investment_recommendation(
        self,
        recommendation: str,
        confidence: float,
        rationale: list[str],
    ) -> str:
        """Generate investment recommendation section."""
        confidence_pct = int(confidence * 100)
        
        # Recommendation action items
        action_map = {
            "Strong Buy": "We recommend proceeding with investment discussions and term sheet preparation. Prioritize this opportunity for portfolio allocation.",
            "Watchlist": "We recommend adding this company to the watchlist for continued monitoring. Reassess quarterly or upon significant developments.",
            "Proceed with Caution": "We recommend proceeding with additional due diligence and risk mitigation planning. Consider smaller initial allocation or structured terms.",
            "Reject": "We recommend declining this investment opportunity. Resources should be allocated to higher-quality prospects.",
        }
        action = action_map.get(recommendation, "Further analysis recommended.")
        
        rationale_text = "\n".join(f"{i}. {item}" for i, item in enumerate(rationale, 1))
        
        return f"""INVESTMENT RECOMMENDATION

Final Recommendation: {recommendation}
Confidence Level: {confidence_pct}%

Rationale:
{rationale_text}

Recommended Action:
{action}

This recommendation is generated through systematic analysis using our multi-agent due diligence framework. Final investment decisions should incorporate additional factors including portfolio strategy, market timing, and investor-specific considerations."""
    
    def _generate_footer(self) -> str:
        """Generate memo footer."""
        return """---

DISCLAIMER

This investment memo is generated by the Prism AI Due Diligence Platform using automated analysis of publicly available information and structured data inputs. This memo is intended for informational purposes only and should not be considered as financial, legal, or investment advice.

All investment decisions should be made after comprehensive due diligence, consultation with qualified professionals, and consideration of individual investment objectives and risk tolerance. Past performance and analytical assessments do not guarantee future results.

© 2026 Prism AI Due Diligence Platform. All rights reserved. Confidential and proprietary."""
