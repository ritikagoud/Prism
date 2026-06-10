export type RiskLevel = "Low" | "Medium" | "High";

export type AnalysisStatus = "completed" | "in_progress" | "queued" | "failed";

export type RecommendationType = "Strong Buy" | "Watchlist" | "Proceed with Caution" | "Reject";

export type EvidenceStatus = "Verified" | "Partially Verified" | "Unverified";

export type EvidenceSource = {
	source_type: string;
	evidence: string;
	source_reference?: string;
};

export type ClaimEvidence = {
	claim: string;
	evidence_sources: EvidenceSource[];
	verification_reasoning: string;
	status: EvidenceStatus;
	confidence: number;
};

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
	evidence_verification: ClaimEvidence[];
	recommendation: RecommendationType;
	confidence: number;
	rationale: string[];
	investment_memo: string;
	timestamp: string;
};
