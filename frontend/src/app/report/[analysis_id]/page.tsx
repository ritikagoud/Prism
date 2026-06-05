import { AnalysisReportView } from "@/components/report/AnalysisReportView";

type ReportPageProps = {
	params: Promise<{ analysis_id: string }>;
};

export default async function ReportPage({ params }: ReportPageProps) {
	const { analysis_id } = await params;

	return <AnalysisReportView analysisId={analysis_id} />;
}