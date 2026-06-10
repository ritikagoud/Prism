export type RiskLevel = "Low" | "Medium" | "High";

export type AnalysisStatus = "completed" | "in_progress" | "queued" | "failed";

export type RecommendationType = "Strong Buy" | "Watchlist" | "Proceed with Caution" | "Reject";

export type AnalysisSummary = {
	id: string;
	startupName: string;
	riskScore: number;
	riskLevel: RiskLevel;
	status: AnalysisStatus;
	analyzedAt: string;
	recommendation: RecommendationType;
};

export type ApiRiskLevel = "low" | "medium" | "high";

export type AnalysisHistoryRecord = {
	analysis_id: string;
	startup_name: string;
	risk_score: number;
	risk_level: ApiRiskLevel;
	competitors: string[];
	claims: string[];
	recommendation: RecommendationType;
	confidence: number;
	rationale: string[];
	investment_memo: string;
	timestamp: string;
};
