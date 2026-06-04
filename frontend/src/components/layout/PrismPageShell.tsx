import type { ReactNode } from "react";

type PrismPageShellProps = {
	children: ReactNode;
};

export function PrismPageShell({ children }: PrismPageShellProps) {
	return (
		<main className="min-h-screen overflow-hidden bg-[#050816] text-white">
			<div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(84,114,255,0.20),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.12),transparent_28%),linear-gradient(180deg,#050816_0%,#060b16_50%,#04050b_100%)]" />
			<div className="pointer-events-none fixed inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.18)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.95),transparent_92%)]" />
			<div className="relative mx-auto flex w-full max-w-7xl flex-col px-6 pb-20 pt-8 sm:px-8 lg:px-12">
				{children}
			</div>
		</main>
	);
}
