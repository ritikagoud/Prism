import { AnalysisCard } from "@/components/dashboard/AnalysisCard";
import { PrismHeader } from "@/components/layout/PrismHeader";
import { PrismPageShell } from "@/components/layout/PrismPageShell";
import { NavLink } from "@/components/ui/NavLink";
import { mockAnalyses } from "@/data/mock-analyses";

export default function DashboardPage() {
	const completedCount = mockAnalyses.filter(
		(analysis) => analysis.status === "completed",
	).length;

	return (
		<PrismPageShell>
			<PrismHeader
				subtitle="Analysis history"
				actions={
					<>
						<NavLink href="/">Home</NavLink>
						<NavLink href="/analyze" variant="primary">
							New analysis
						</NavLink>
					</>
				}
			/>

			<section className="py-10 lg:py-16">
				<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
					<span className="h-2 w-2 rounded-full bg-cyan-300" />
					Previous diligence runs
				</div>

				<h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-balance sm:text-5xl lg:text-6xl">
					Your startup analysis dashboard
				</h1>

				<p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
					Review past Prism analyses at a glance. Risk scores, levels, and status
					are summarized for every company you have evaluated.
				</p>

				<div className="mt-10 grid gap-4 sm:grid-cols-3">
					{[
						{ value: String(mockAnalyses.length), label: "total analyses" },
						{ value: String(completedCount), label: "completed" },
						{
							value: String(
								mockAnalyses.filter((a) => a.riskLevel === "High").length,
							),
							label: "high-risk startups",
						},
					].map((stat) => (
						<div
							key={stat.label}
							className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
						>
							<div className="text-3xl font-semibold tracking-[-0.04em] text-white">
								{stat.value}
							</div>
							<p className="mt-2 text-sm leading-6 text-slate-400">{stat.label}</p>
						</div>
					))}
				</div>
			</section>

			<section className="pb-8">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200/70">
							Recent analyses
						</p>
						<h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-white sm:text-3xl">
							All previous runs
						</h2>
					</div>
					<NavLink href="/analyze" variant="primary">
						Analyze a startup
					</NavLink>
				</div>

				<div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{mockAnalyses.map((analysis) => (
						<AnalysisCard key={analysis.id} analysis={analysis} />
					))}
				</div>
			</section>
		</PrismPageShell>
	);
}
