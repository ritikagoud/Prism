import { RiskLevelBadge } from "@/components/ui/RiskLevelBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatAnalysisDate } from "@/lib/format";
import { getRiskScoreAccentClass } from "@/lib/risk";
import type { AnalysisSummary } from "@/types/analysis";

type AnalysisCardProps = {
	analysis: AnalysisSummary;
};

export function AnalysisCard({ analysis }: AnalysisCardProps) {
	const scoreAccent = getRiskScoreAccentClass(analysis.riskScore);

	return (
		<article className="group rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/25 hover:bg-white/[0.07]">
			<div className="flex items-start justify-between gap-4">
				<div>
					<p className="text-xs uppercase tracking-[0.24em] text-slate-400">
						Startup
					</p>
					<h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-white">
						{analysis.startupName}
					</h3>
				</div>
				<StatusBadge status={analysis.status} />
			</div>

			<div className="mt-6 grid gap-4 sm:grid-cols-2">
				<div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
					<p className="text-xs uppercase tracking-[0.2em] text-slate-400">
						Risk score
					</p>
					<p
						className={`mt-2 text-3xl font-semibold tracking-[-0.05em] ${scoreAccent}`}
					>
						{analysis.riskScore}
					</p>
				</div>
				<div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
					<p className="text-xs uppercase tracking-[0.2em] text-slate-400">
						Risk level
					</p>
					<div className="mt-3">
						<RiskLevelBadge level={analysis.riskLevel} />
					</div>
				</div>
			</div>

			<div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
				<div>
					<p className="text-xs uppercase tracking-[0.2em] text-slate-400">
						Analysis date
					</p>
					<p className="mt-1 text-sm font-medium text-slate-200">
						{formatAnalysisDate(analysis.analyzedAt)}
					</p>
				</div>
				<p className="text-xs text-slate-500">ID {analysis.id}</p>
			</div>
		</article>
	);
}
