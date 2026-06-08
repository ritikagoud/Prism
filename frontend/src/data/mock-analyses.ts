import type { AnalysisSummary } from "@/types/analysis";

export const mockAnalyses: AnalysisSummary[] = [
	{
		id: "anl_7f2k9m1p",
		startupName: "StudySpark",
		riskScore: 38,
		riskLevel: "Medium",
		status: "completed",
		analyzedAt: "2026-05-28T14:32:00Z",
		recommendation: "Proceed with Caution",
	},
	{
		id: "anl_3b8n4q6r",
		startupName: "FinGuard",
		riskScore: 82,
		riskLevel: "High",
		status: "completed",
		analyzedAt: "2026-05-21T09:15:00Z",
		recommendation: "Reject",
	},
	{
		id: "anl_9d1c5w2x",
		startupName: "HealthAI",
		riskScore: 77,
		riskLevel: "High",
		status: "completed",
		analyzedAt: "2026-05-14T16:48:00Z",
		recommendation: "Reject",
	},
];
