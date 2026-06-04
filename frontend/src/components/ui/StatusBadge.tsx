import { formatAnalysisStatus } from "@/lib/format";
import type { AnalysisStatus } from "@/types/analysis";

type StatusBadgeProps = {
	status: AnalysisStatus;
};

const statusClasses: Record<AnalysisStatus, string> = {
	completed: "border-emerald-300/30 bg-emerald-400/15 text-emerald-100",
	in_progress: "border-cyan-300/30 bg-cyan-400/15 text-cyan-100",
	queued: "border-white/15 bg-white/5 text-slate-200",
	failed: "border-rose-300/30 bg-rose-400/15 text-rose-100",
};

export function StatusBadge({ status }: StatusBadgeProps) {
	return (
		<span
			className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] ${statusClasses[status]}`}
		>
			{formatAnalysisStatus(status)}
		</span>
	);
}
