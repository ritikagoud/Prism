export type RiskLevel = "Low" | "Medium" | "High";

export type AnalysisStatus = "completed" | "in_progress" | "queued" | "failed";

export type AnalysisSummary = {
	id: string;
	startupName: string;
	riskScore: number;
	riskLevel: RiskLevel;
	status: AnalysisStatus;
	analyzedAt: string;
};

export type ApiRiskLevel = "low" | "medium" | "high";

export type AnalysisHistoryRecord = {
	analysis_id: string;
	startup_name: string;
	risk_score: number;
	risk_level: ApiRiskLevel;
	competitors: string[];
	claims: string[];
	timestamp: string;
};
