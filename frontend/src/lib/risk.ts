import type { RiskLevel } from "@/types/analysis";

export function normalizeRiskLevel(level: string): string {
	return level.trim().toLowerCase();
}

export function getRiskLevelBadgeClass(level: RiskLevel | string): string {
	const normalized = normalizeRiskLevel(level);

	if (normalized === "low") {
		return "border-emerald-300/30 bg-emerald-400/15 text-emerald-100";
	}
	if (normalized === "medium") {
		return "border-amber-300/30 bg-amber-400/15 text-amber-100";
	}
	if (normalized === "high") {
		return "border-rose-300/30 bg-rose-400/15 text-rose-100";
	}

	return "border-slate-300/20 bg-slate-400/10 text-slate-200";
}

export function getRiskScoreAccentClass(score: number): string {
	if (score < 40) {
		return "text-emerald-200";
	}
	if (score < 70) {
		return "text-amber-200";
	}
	return "text-rose-200";
}
