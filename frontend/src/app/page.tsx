import Link from "next/link";

const workflowSteps = [
	{
		title: "Ingest",
		description:
			"Prism collects pitch decks, data rooms, market notes, and founder claims into a single analysis workspace.",
	},
	{
		title: "Delegate",
		description:
			"Specialized agents split the work across diligence, research, risk review, and evidence validation.",
	},
	{
		title: "Verify",
		description:
			"Every claim is traced to sources, benchmarks, and competitor evidence before it reaches the memo.",
	},
	{
		title: "Decide",
		description:
			"The platform synthesizes a clear investment view with risks, open questions, and conviction drivers.",
	},
];

const features = [
	{
		title: "Claim validation at speed",
		description:
			"Cross-check founder statements against public data, filings, product signals, and comparable companies.",
	},
	{
		title: "Competitive intelligence",
		description:
			"Surface direct and adjacent competitors, pricing gaps, positioning shifts, and defensibility concerns.",
	},
	{
		title: "Risk-first analysis",
		description:
			"Identify market, product, go-to-market, and execution risks before they become costly surprises.",
	},
	{
		title: "Evidence-backed memos",
		description:
			"Generate investor-ready output with citations, summaries, and the exact sources behind each insight.",
	},
	{
		title: "Collaborative workflow",
		description:
			"Keep partners, associates, and analysts aligned with a shared workspace and clear review states.",
	},
	{
		title: "Fast from first look to thesis",
		description:
			"Compress hours of research into a single flow that helps teams move from interest to conviction faster.",
	},
];

export default function Home() {
	return (
		<main className="min-h-screen overflow-hidden bg-[#050816] text-white">
			<div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(84,114,255,0.20),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.12),transparent_28%),linear-gradient(180deg,#050816_0%,#060b16_50%,#04050b_100%)]" />
			<div className="pointer-events-none fixed inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.18)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.95),transparent_92%)]" />

			<div className="relative mx-auto flex w-full max-w-7xl flex-col px-6 pb-20 pt-8 sm:px-8 lg:px-12">
				<header className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#7c8cff,#3dd6d0)] text-sm font-semibold text-slate-950 shadow-[0_0_40px_rgba(125,140,255,0.35)]">
							P
						</div>
						<div>
							<p className="text-sm font-semibold tracking-[0.22em] text-slate-200 uppercase">
								Prism
							</p>
							<p className="text-xs text-slate-400">
								Evidence-backed startup intelligence
							</p>
						</div>
					</div>
					<div className="flex flex-wrap items-center gap-3">
						<Link
							href="/dashboard"
							className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-400/40 hover:bg-cyan-400/10"
						>
							Dashboard
						</Link>
						<Link
							href="/analyze"
							className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-400/40 hover:bg-cyan-400/10"
						>
							Analyze a Startup
						</Link>
					</div>
				</header>

				<section className="grid gap-16 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-28">
					<div className="max-w-3xl">
						<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
							<span className="h-2 w-2 rounded-full bg-cyan-300" />
							AI due diligence for high-velocity investment teams
						</div>

						<h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-balance sm:text-6xl lg:text-7xl">
							Turn startup pitches into evidence-backed investment decisions.
						</h1>

						<p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
							Prism is a multi-agent diligence platform that analyzes founder
							claims, researches competitors, identifies risks, and assembles a
							credible investment thesis in one premium workflow.
						</p>

						<div className="mt-10 flex flex-col gap-4 sm:flex-row">
							<Link
								href="/analyze"
								className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-cyan-100"
							>
								Analyze a Startup
							</Link>
							<a
								href="#workflow"
								className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/8"
							>
								See the workflow
							</a>
						</div>

						<div className="mt-12 grid gap-4 sm:grid-cols-3">
							{[
								{ value: "10x", label: "faster first-pass diligence" },
								{ value: "100%", label: "traceable source-backed insights" },
								{ value: "1", label: "shared workflow across the team" },
							].map((stat) => (
								<div
									key={stat.label}
									className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
								>
									<div className="text-3xl font-semibold tracking-[-0.04em] text-white">
										{stat.value}
									</div>
									<p className="mt-2 text-sm leading-6 text-slate-400">
										{stat.label}
									</p>
								</div>
							))}
						</div>
					</div>

					<div className="relative">
						<div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle,rgba(61,214,208,0.20),transparent_50%)] blur-2xl" />
						<div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-[0_32px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
							<div className="flex items-center justify-between border-b border-white/10 pb-4">
								<div>
									<p className="text-xs uppercase tracking-[0.24em] text-slate-400">
										Prism overview
									</p>
									<p className="mt-1 text-lg font-medium text-white">
										Investment memo generated from live evidence
									</p>
								</div>
								<div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
									3 agents active
								</div>
							</div>

							<div className="mt-5 space-y-4">
								{[
									{
										title: "Founder claims",
										body: "ARR, retention, and pipeline statements validated against public and private signals.",
									},
									{
										title: "Market scan",
										body: "Direct competitors, substitutes, and category shifts mapped to the target company.",
									},
									{
										title: "Risk memo",
										body: "Product, financing, and execution risks ranked by impact and confidence.",
									},
								].map((item, index) => (
									<div
										key={item.title}
										className="rounded-2xl border border-white/10 bg-slate-950/50 p-4"
									>
										<div className="flex items-center gap-3">
											<div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
												0{index + 1}
											</div>
											<p className="text-sm font-semibold text-white">
												{item.title}
											</p>
										</div>
										<p className="mt-3 text-sm leading-6 text-slate-400">
											{item.body}
										</p>
									</div>
								))}
							</div>

							<div className="mt-5 grid gap-3 sm:grid-cols-2">
								<div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/8 p-4">
									<p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">
										Evidence score
									</p>
									<div className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">
										94
									</div>
									<p className="mt-2 text-sm text-slate-400">
										Based on source coverage, consistency, and market validation.
									</p>
								</div>
								<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
									<p className="text-xs uppercase tracking-[0.2em] text-slate-400">
										Decision output
									</p>
									<p className="mt-2 text-base font-medium text-white">
										Proceed to partner review with open questions highlighted.
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="grid gap-6 border-y border-white/10 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
					<div>
						<p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200/70">
							Product description
						</p>
						<h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
							Built for teams that need rigor, speed, and source-level clarity.
						</h2>
					</div>
					<p className="max-w-2xl text-lg leading-8 text-slate-300">
						Prism helps investors move from a noisy pitch to a defensible view
						by combining agentic research, structured verification, and concise
						synthesis. Instead of juggling scattered notes and browser tabs, your
						team gets a single premium workspace that turns diligence into a
						repeatable operating system.
					</p>
				</section>

				<section id="workflow" className="py-16 lg:py-20">
					<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl">
							<p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200/70">
								Multi-agent workflow
							</p>
							<h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
								Specialized agents collaborate on the same diligence thread.
							</h2>
						</div>
						<p className="max-w-xl text-slate-400">
							Each step is purpose-built so teams can investigate faster without
							sacrificing the traceability required for real investment work.
						</p>
					</div>

					<div className="mt-10 grid gap-4 lg:grid-cols-4">
						{workflowSteps.map((step, index) => (
							<article
								key={step.title}
								className="group rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/25 hover:bg-white/[0.07]"
							>
								<div className="flex items-center justify-between">
									<div className="text-sm font-medium text-cyan-200/80">
										0{index + 1}
									</div>
									<div className="h-2.5 w-2.5 rounded-full bg-cyan-300/70 shadow-[0_0_18px_rgba(103,232,249,0.75)]" />
								</div>
								<h3 className="mt-6 text-xl font-semibold text-white">
									{step.title}
								</h3>
								<p className="mt-3 text-sm leading-6 text-slate-400">
									{step.description}
								</p>
							</article>
						))}
					</div>
				</section>

				<section className="py-16 lg:py-20">
					<div className="max-w-2xl">
						<p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200/70">
							Features
						</p>
						<h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
							Everything needed to ship sharper diligence output.
						</h2>
					</div>

					<div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{features.map((feature) => (
							<article
								key={feature.title}
								className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6"
							>
								<div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
									<span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
								</div>
								<h3 className="mt-5 text-xl font-semibold text-white">
									{feature.title}
								</h3>
								<p className="mt-3 text-sm leading-6 text-slate-400">
									{feature.description}
								</p>
							</article>
						))}
					</div>
				</section>

				<section
					id="cta"
					className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))] px-6 py-12 shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:px-8 lg:px-12 lg:py-16"
				>
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(61,214,208,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(124,140,255,0.18),transparent_32%)]" />
					<div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
						<div className="max-w-2xl">
							<p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200/70">
								Call to action
							</p>
							<h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
								Ready to validate a startup idea?
							</h2>
							<p className="mt-4 text-lg leading-8 text-slate-300">
								See how a multi-agent workflow can surface risks earlier, tighten
								conviction, and produce better investment memos with less manual
								effort.
							</p>
						</div>

						<div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
							<Link
								href="/analyze"
								className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-cyan-100"
							>
								Start Analysis
							</Link>
							<a
								href="#workflow"
								className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/8"
							>
								Explore product
							</a>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}
