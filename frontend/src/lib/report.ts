import type { AnalysisHistoryRecord } from "@/types/analysis";

function formatCompetitorList(competitors: string[]): string {
	if (competitors.length === 0) {
		return "no direct competitors were surfaced";
	}

	if (competitors.length === 1) {
		return competitors[0];
	}

	if (competitors.length === 2) {
		return `${competitors[0]} and ${competitors[1]}`;
	}

	return `${competitors.slice(0, -1).join(", ")}, and ${competitors[competitors.length - 1]}`;
}

function describeRisk(score: number): string {
	if (score < 40) {
		return "lower risk with strong market potential";
	}

	if (score < 70) {
		return "moderate risk with balanced upside and diligence items";
	}

	return "elevated risk that warrants deeper diligence";
}

export function generateExecutiveSummary(analysis: AnalysisHistoryRecord): string {
	const competitorList = formatCompetitorList(analysis.competitors);
	const riskDescription = describeRisk(analysis.risk_score);

	return `${analysis.startup_name} shows ${riskDescription}. Key competitors include ${competitorList}. ${analysis.claims.length > 0 ? `The analysis surfaced ${analysis.claims.length} claim${analysis.claims.length === 1 ? "" : "s"} that should be validated.` : "No explicit claims were captured in the current analysis."}`;
}