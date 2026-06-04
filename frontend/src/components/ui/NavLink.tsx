import Link from "next/link";
import type { ComponentProps } from "react";

type NavLinkProps = ComponentProps<typeof Link> & {
	variant?: "primary" | "secondary";
};

const variantClasses = {
	primary:
		"rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-100",
	secondary:
		"rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-400/40 hover:bg-cyan-400/10",
};

export function NavLink({ variant = "secondary", className = "", ...props }: NavLinkProps) {
	return (
		<Link
			{...props}
			className={`inline-flex items-center justify-center ${variantClasses[variant]} ${className}`}
		/>
	);
}
