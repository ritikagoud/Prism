"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AnalysisCard } from "@/components/dashboard/AnalysisCard";
import { PrismHeader } from "@/components/layout/PrismHeader";
import { PrismPageShell } from "@/components/layout/PrismPageShell";
import { NavLink } from "@/components/ui/NavLink";
import type { AnalysisHistoryRecord, AnalysisSummary, RiskLevel } from "@/types/analysis";

const ANALYSES_URL = "http://127.0.0.1:8000/api/v1/analyses";

function toDisplayRiskLevel(level: AnalysisHistoryRecord["risk_level"]): RiskLevel {
	if (level === "low") {
		return "Low";
	}
	if (level === "medium") {
		return "Medium";
	}
	return "High";
}

function toAnalysisSummary(analysis: AnalysisHistoryRecord): AnalysisSummary {
	return {
		id: analysis.analysis_id,
		startupName: analysis.startup_name,
		riskScore: analysis.risk_score,
		riskLevel: toDisplayRiskLevel(analysis.risk_level),
		status: "completed",
		analyzedAt: analysis.timestamp,
	};
}

export function DashboardView() {
	const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);

	useEffect(() => {
		const controller = new AbortController();

		async function loadAnalyses() {
			setIsLoading(true);
			setLoadError(null);

			try {
				const response = await fetch(ANALYSES_URL, { signal: controller.signal });

				if (!response.ok) {
					throw new Error(`Failed to load analyses (${response.status})`);
				}

				const payload: AnalysisHistoryRecord[] = await response.json();
				const sortedAnalyses = payload
					.map(toAnalysisSummary)
					.sort(
						(left, right) =>
							new Date(right.analyzedAt).getTime() - new Date(left.analyzedAt).getTime(),
						);

				setAnalyses(sortedAnalyses);
			} catch (error) {
				if (error instanceof DOMException && error.name === "AbortError") {
					return;
				}

				setLoadError(error instanceof Error ? error.message : "Unable to load analyses.");
				setAnalyses([]);
			} finally {
				setIsLoading(false);
			}
		}

		void loadAnalyses();

		return () => controller.abort();
	}, []);

	const completedCount = useMemo(
		() => analyses.filter((analysis) => analysis.status === "completed").length,
		[analyses],
	);

	const highRiskCount = useMemo(
		() => analyses.filter((analysis) => analysis.riskLevel === "High").length,
		[analyses],
	);

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
						{ value: String(analyses.length), label: "total analyses" },
						{ value: String(completedCount), label: "completed" },
						{ value: String(highRiskCount), label: "high-risk startups" },
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

				{isLoading ? (
					<div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{Array.from({ length: 3 }).map((_, index) => (
							<div
								key={index}
								className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6"
							>
								<div className="h-4 w-24 rounded-full bg-white/10" />
								<div className="mt-4 h-7 w-40 rounded-full bg-white/10" />
								<div className="mt-6 grid gap-4 sm:grid-cols-2">
									<div className="h-24 rounded-2xl bg-white/10" />
									<div className="h-24 rounded-2xl bg-white/10" />
								</div>
								<div className="mt-5 h-12 rounded-2xl bg-white/10" />
							</div>
						))}
					</div>
				) : loadError ? (
					<div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-8 text-slate-300">
						<p className="text-lg font-medium text-white">Unable to load analyses</p>
						<p className="mt-2 text-sm leading-6 text-slate-400">{loadError}</p>
					</div>
				) : analyses.length === 0 ? (
					<div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-8 text-slate-300">
						<p className="text-lg font-medium text-white">No analyses yet</p>
						<p className="mt-2 text-sm leading-6 text-slate-400">
							Run your first startup analysis and it will appear here.
						</p>
					</div>
				) : (
					<div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{analyses.map((analysis) => (
							<Link
								key={analysis.id}
								href={`/report/${analysis.id}`}
								aria-label={`Open report for ${analysis.startupName}`}
								className="block"
							>
								<AnalysisCard analysis={analysis} />
							</Link>
						))}
					</div>
				)}
			</section>
		</PrismPageShell>
	);
}