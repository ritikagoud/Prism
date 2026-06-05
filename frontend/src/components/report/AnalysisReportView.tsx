"use client";

import { useEffect, useMemo, useState } from "react";

import { PrismHeader } from "@/components/layout/PrismHeader";
import { PrismPageShell } from "@/components/layout/PrismPageShell";
import { NavLink } from "@/components/ui/NavLink";
import { RiskLevelBadge } from "@/components/ui/RiskLevelBadge";
import { formatAnalysisTimestamp } from "@/lib/format";
import { getRiskScoreAccentClass } from "@/lib/risk";
import { generateExecutiveSummary } from "@/lib/report";
import type { AnalysisHistoryRecord } from "@/types/analysis";

const ANALYSES_ENDPOINT = "http://127.0.0.1:8000/api/v1/analyses";

type AnalysisReportViewProps = {
	analysisId: string;
};

export function AnalysisReportView({ analysisId }: AnalysisReportViewProps) {
	const [analysis, setAnalysis] = useState<AnalysisHistoryRecord | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	useEffect(() => {
		const controller = new AbortController();

		async function loadAnalysis() {
			setIsLoading(true);
			setErrorMessage(null);

			try {
				const response = await fetch(`${ANALYSES_ENDPOINT}/${analysisId}`, {
					signal: controller.signal,
				});

				if (response.status === 404) {
					setAnalysis(null);
					setErrorMessage(`No analysis found for ID ${analysisId}.`);
					return;
				}

				if (!response.ok) {
					throw new Error(`Failed to load analysis (${response.status})`);
				}

				const payload = (await response.json()) as AnalysisHistoryRecord;
				setAnalysis(payload);
			} catch (error) {
				if (error instanceof DOMException && error.name === "AbortError") {
					return;
				}

				setAnalysis(null);
				setErrorMessage(
					error instanceof Error ? error.message : "Unable to load the analysis report.",
				);
			} finally {
				setIsLoading(false);
			}
		}

		void loadAnalysis();

		return () => controller.abort();
	}, [analysisId]);

	const executiveSummary = useMemo(
		() => (analysis ? generateExecutiveSummary(analysis) : ""),
		[analysis],
	);

	const scoreAccent = analysis ? getRiskScoreAccentClass(analysis.risk_score) : "text-white";

	return (
		<PrismPageShell>
			<PrismHeader
				subtitle="Analysis report"
				actions={
					<>
						<NavLink href="/dashboard">Back to dashboard</NavLink>
						<NavLink href="/analyze" variant="primary">
							New analysis
						</NavLink>
					</>
				}
			/>

			<section className="py-10 lg:py-16">
				<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
					<span className="h-2 w-2 rounded-full bg-cyan-300" />
					Detailed analysis report
				</div>

				<h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.06em] text-balance sm:text-5xl lg:text-6xl">
					Analysis report
				</h1>

				<p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
					Review the selected startup assessment, key claims, competitors, and the
					rule-based executive summary generated from the stored analysis.
				</p>

				{isLoading ? (
					<div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
						<div className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6">
							<div className="h-4 w-28 rounded-full bg-white/10" />
							<div className="mt-4 h-8 w-72 rounded-full bg-white/10" />
							<div className="mt-6 space-y-3">
								<div className="h-4 w-full rounded-full bg-white/10" />
								<div className="h-4 w-5/6 rounded-full bg-white/10" />
								<div className="h-4 w-2/3 rounded-full bg-white/10" />
							</div>
						</div>
						<div className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6">
							<div className="h-4 w-24 rounded-full bg-white/10" />
							<div className="mt-4 h-24 rounded-2xl bg-white/10" />
							<div className="mt-6 h-4 w-32 rounded-full bg-white/10" />
							<div className="mt-3 h-10 rounded-2xl bg-white/10" />
						</div>
					</div>
				) : errorMessage ? (
					<div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-8 text-slate-300">
						<p className="text-lg font-medium text-white">Report unavailable</p>
						<p className="mt-2 text-sm leading-6 text-slate-400">{errorMessage}</p>
					</div>
				) : analysis ? (
					<div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
						<article className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl">
							<div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
								<div>
									<p className="text-xs uppercase tracking-[0.24em] text-slate-400">
										Startup
									</p>
									<h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">
										{analysis.startup_name}
									</h2>
								</div>
								<RiskLevelBadge level={analysis.risk_level} />
							</div>

							<div className="mt-6 grid gap-4 sm:grid-cols-2">
								<div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
									<p className="text-xs uppercase tracking-[0.2em] text-slate-400">
										Risk score
									</p>
									<p className={`mt-2 text-3xl font-semibold tracking-[-0.05em] ${scoreAccent}`}>
										{analysis.risk_score}
									</p>
								</div>
								<div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
									<p className="text-xs uppercase tracking-[0.2em] text-slate-400">
										Analysis ID
									</p>
									<p className="mt-2 break-all text-sm font-medium text-slate-200">
										{analysis.analysis_id}
									</p>
								</div>
							</div>

							<div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
								<p className="text-xs uppercase tracking-[0.2em] text-slate-400">
									Timestamp
								</p>
								<p className="mt-2 text-sm font-medium text-slate-200">
									{formatAnalysisTimestamp(analysis.timestamp)}
								</p>
							</div>

							<div className="mt-6 grid gap-4 md:grid-cols-2">
								<div>
									<h3 className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200/70">
										Claims
									</h3>
									<div className="mt-4 flex flex-wrap gap-3">
										{analysis.claims.length > 0 ? (
											analysis.claims.map((claim) => (
												<span
													key={claim}
													className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
												>
													{claim}
												</span>
											))
										) : (
											<p className="text-sm text-slate-400">No claims captured.</p>
										)}
									</div>
								</div>

								<div>
									<h3 className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200/70">
										Competitors
									</h3>
									<ul className="mt-4 space-y-3">
										{analysis.competitors.length > 0 ? (
											analysis.competitors.map((competitor) => (
												<li
													key={competitor}
													className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-200"
												>
													{competitor}
												</li>
											))
										) : (
											<li className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-400">
												No competitors captured.
											</li>
										)}
									</ul>
								</div>
							</div>
						</article>

						<aside className="flex flex-col gap-4">
							<section className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl">
								<h3 className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200/70">
									Executive Summary
								</h3>
								<p className="mt-4 text-base leading-8 text-slate-200">
									{executiveSummary}
								</p>
							</section>

							<section className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl">
								<h3 className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200/70">
									Analysis metadata
								</h3>
								<div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-300">
									<p className="text-slate-400">Risk level</p>
									<div className="mt-2">
										<RiskLevelBadge level={analysis.risk_level} />
									</div>
								</div>
							</section>
						</aside>
					</div>
				) : null}
			</section>
		</PrismPageShell>
	);
}