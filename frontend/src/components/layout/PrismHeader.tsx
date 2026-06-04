import Link from "next/link";
import type { ReactNode } from "react";

type PrismHeaderProps = {
	subtitle: string;
	actions?: ReactNode;
};

export function PrismHeader({ subtitle, actions }: PrismHeaderProps) {
	return (
		<header className="flex flex-col gap-4 rounded-full border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
			<Link href="/" className="flex items-center gap-3 transition hover:opacity-90">
				<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#7c8cff,#3dd6d0)] text-sm font-semibold text-slate-950 shadow-[0_0_40px_rgba(125,140,255,0.35)]">
					P
				</div>
				<div>
					<p className="text-sm font-semibold tracking-[0.22em] text-slate-200 uppercase">
						Prism
					</p>
					<p className="text-xs text-slate-400">{subtitle}</p>
				</div>
			</Link>
			{actions ? (
				<div className="flex flex-wrap items-center gap-3">{actions}</div>
			) : null}
		</header>
	);
}
