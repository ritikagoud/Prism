from __future__ import annotations

from dataclasses import dataclass

from app.models.analysis import AnalysisRequest


@dataclass(slots=True)
class CompetitorAgentResult:
    competitors: list[str]


class CompetitorAgent:
    name = "competitor-agent"

    def run(self, request: AnalysisRequest) -> CompetitorAgentResult:
        return self.analyze(
            startup_name=request.startup_name,
            description=request.description,
            industry=request.industry,
        )

    def analyze(self, startup_name: str, description: str, industry: str) -> CompetitorAgentResult:
        del startup_name, description

        competitors = self._competitors_for_industry(industry)
        return CompetitorAgentResult(competitors=competitors)

    def _competitors_for_industry(self, industry: str) -> list[str]:
        normalized_industry = industry.strip().casefold()

        if "ai" in normalized_industry or "saas" in normalized_industry:
            return ["OpenAI", "Anthropic", "Perplexity"]
        if "edtech" in normalized_industry or "education" in normalized_industry:
            return ["Coursera", "Udemy", "Khan Academy"]
        if "fintech" in normalized_industry:
            return ["Stripe", "Razorpay", "PayPal"]
        if "healthtech" in normalized_industry or "health" in normalized_industry:
            return ["Practo", "Teladoc", "Healthify"]
        if "e-commerce" in normalized_industry or "ecommerce" in normalized_industry:
            return ["Shopify", "Amazon", "Flipkart"]

        return ["Notion", "ClickUp", "Monday.com"]