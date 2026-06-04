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
