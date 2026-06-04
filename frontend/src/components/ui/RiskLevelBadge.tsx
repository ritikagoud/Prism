import { getRiskLevelBadgeClass } from "@/lib/risk";
import type { RiskLevel } from "@/types/analysis";

type RiskLevelBadgeProps = {
	level: RiskLevel | string;
};

export function RiskLevelBadge({ level }: RiskLevelBadgeProps) {
	return (
		<span
			className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${getRiskLevelBadgeClass(level)}`}
		>
			{level}
		</span>
	);
}
