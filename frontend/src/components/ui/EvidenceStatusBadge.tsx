import { EvidenceStatus } from "@/types/analysis";

type EvidenceStatusBadgeProps = {
	status: EvidenceStatus;
};

export default function EvidenceStatusBadge({ status }: EvidenceStatusBadgeProps) {
	const styles = getStatusStyles(status);

	return (
		<span
			className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles}`}
		>
			{status}
		</span>
	);
}

function getStatusStyles(status: EvidenceStatus): string {
	switch (status) {
		case "Verified":
			return "bg-emerald-100 text-emerald-800 border border-emerald-200";
		case "Partially Verified":
			return "bg-amber-100 text-amber-800 border border-amber-200";
		case "Unverified":
			return "bg-slate-100 text-slate-800 border border-slate-200";
	}
}
