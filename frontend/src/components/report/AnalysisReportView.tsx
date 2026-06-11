"use client";

import { useEffect, useMemo, useState } from "react";

import { PrismHeader } from "@/components/layout/PrismHeader";
import { PrismPageShell } from "@/components/layout/PrismPageShell";
import { NavLink } from "@/components/ui/NavLink";
import EvidenceStatusBadge from "@/components/ui/EvidenceStatusBadge";
import RecommendationBadge from "@/components/ui/RecommendationBadge";
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
					<>
						{/* Agent Workflow Section */}
						<div className="mt-8">
							<div className="mb-2">
								<h2 className="text-2xl font-semibold tracking-tight text-white">
									Prism Agent Execution Trace
								</h2>
								<p className="mt-2 text-sm leading-6 text-slate-400">
									Transparent view of how specialized AI agents collaborated to produce the final investment recommendation.
								</p>
							</div>
							
							<div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
								{/* Claim Extraction Agent */}
								<div className="relative rounded-xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur-sm">
									<div className="absolute -right-2 top-1/2 h-0.5 w-4 bg-slate-700/50 hidden lg:block" />
									<div className="mb-3 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-400">
												<svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
												</svg>
											</div>
											<span className="text-xs font-medium uppercase tracking-wider text-slate-500">Step 1</span>
										</div>
										<div className="flex items-center gap-1 text-emerald-400">
											<svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
												<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
											</svg>
											<span className="text-xs font-medium">Completed</span>
										</div>
									</div>
									<h3 className="text-sm font-semibold text-white mb-1">Claim Extraction Agent</h3>
									<p className="text-2xl font-bold text-white mb-2">{analysis.claims.length}</p>
									<p className="text-xs leading-relaxed text-slate-400">
										Extracted {analysis.claims.length} startup {analysis.claims.length === 1 ? 'claim' : 'claims'} from pitch materials
									</p>
								</div>

								{/* Evidence Verification Agent */}
								<div className="relative rounded-xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur-sm">
									<div className="absolute -right-2 top-1/2 h-0.5 w-4 bg-slate-700/50 hidden lg:block" />
									<div className="mb-3 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-400">
												<svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
												</svg>
											</div>
											<span className="text-xs font-medium uppercase tracking-wider text-slate-500">Step 2</span>
										</div>
										<div className="flex items-center gap-1 text-emerald-400">
											<svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
												<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
											</svg>
											<span className="text-xs font-medium">Completed</span>
										</div>
									</div>
									<h3 className="text-sm font-semibold text-white mb-1">Evidence Verification Agent</h3>
									<div className="flex items-baseline gap-2 mb-2">
										<p className="text-2xl font-bold text-white">
											{analysis.evidence_verification.filter(e => e.status === "Verified").length}
										</p>
										<span className="text-xs text-slate-500">/</span>
										<p className="text-lg font-semibold text-slate-400">
											{analysis.evidence_verification.filter(e => e.status === "Partially Verified").length}
										</p>
										<span className="text-xs text-slate-500">/</span>
										<p className="text-lg font-semibold text-slate-600">
											{analysis.evidence_verification.filter(e => e.status === "Unverified").length}
										</p>
									</div>
									<p className="text-xs leading-relaxed text-slate-400">
										{analysis.evidence_verification.filter(e => e.status === "Verified").length} verified, {analysis.evidence_verification.filter(e => e.status === "Partially Verified").length} partially verified
									</p>
								</div>

								{/* Competitor Research Agent */}
								<div className="relative rounded-xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur-sm">
									<div className="absolute -right-2 top-1/2 h-0.5 w-4 bg-slate-700/50 hidden lg:block" />
									<div className="mb-3 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-400">
												<svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
												</svg>
											</div>
											<span className="text-xs font-medium uppercase tracking-wider text-slate-500">Step 3</span>
										</div>
										<div className="flex items-center gap-1 text-emerald-400">
											<svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
												<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
											</svg>
											<span className="text-xs font-medium">Completed</span>
										</div>
									</div>
									<h3 className="text-sm font-semibold text-white mb-1">Competitor Research Agent</h3>
									<p className="text-2xl font-bold text-white mb-2">{analysis.competitors.length}</p>
									<p className="text-xs leading-relaxed text-slate-400">
										Identified {analysis.competitors.length} {analysis.competitors.length === 1 ? 'competitor' : 'competitors'}
									</p>
								</div>

								{/* Risk Assessment Agent */}
								<div className="relative rounded-xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur-sm">
									<div className="absolute -right-2 top-1/2 h-0.5 w-4 bg-slate-700/50 hidden lg:block" />
									<div className="mb-3 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-400">
												<svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
												</svg>
											</div>
											<span className="text-xs font-medium uppercase tracking-wider text-slate-500">Step 4</span>
										</div>
										<div className="flex items-center gap-1 text-emerald-400">
											<svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
												<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
											</svg>
											<span className="text-xs font-medium">Completed</span>
										</div>
									</div>
									<h3 className="text-sm font-semibold text-white mb-1">Risk Assessment Agent</h3>
									<p className={`text-2xl font-bold mb-2 ${getRiskScoreAccentClass(analysis.risk_score)}`}>
										{analysis.risk_score}
									</p>
									<p className="text-xs leading-relaxed text-slate-400 capitalize">
										{analysis.risk_level} risk profile detected
									</p>
								</div>

								{/* Investment Committee Agent */}
								<div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur-sm">
									<div className="mb-3 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-400">
												<svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
												</svg>
											</div>
											<span className="text-xs font-medium uppercase tracking-wider text-slate-500">Step 5</span>
										</div>
										<div className="flex items-center gap-1 text-emerald-400">
											<svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
												<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
											</svg>
											<span className="text-xs font-medium">Completed</span>
										</div>
									</div>
									<h3 className="text-sm font-semibold text-white mb-1">Investment Committee Agent</h3>
									<div className="mb-2">
										<RecommendationBadge recommendation={analysis.recommendation} />
									</div>
									<p className="text-xs leading-relaxed text-slate-400">
										Recommended {analysis.recommendation} ({(analysis.confidence * 100).toFixed(0)}% confidence)
									</p>
								</div>
							</div>
							
							{/* Workflow Summary Banner */}
							<div className="mt-4 rounded-xl border border-slate-700/50 bg-slate-900/30 p-4 backdrop-blur-sm">
								<div className="flex items-start gap-3">
									<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-800 border border-slate-700">
										<svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
									<div className="flex-1">
										<h4 className="text-sm font-semibold text-white mb-1">Agent Execution Summary</h4>
										<p className="text-sm leading-relaxed text-slate-400">
											Prism processed {analysis.startup_name} through 5 specialized AI agents. The workflow identified{' '}
											<span className="font-medium text-slate-300">{analysis.claims.length} {analysis.claims.length === 1 ? 'claim' : 'claims'}</span>, verified supporting evidence from source materials, analyzed{' '}
											<span className="font-medium text-slate-300">{analysis.competitors.length} {analysis.competitors.length === 1 ? 'competitor' : 'competitors'}</span>, assessed a{' '}
											<span className={`font-medium ${getRiskScoreAccentClass(analysis.risk_score)}`}>{analysis.risk_level} risk profile</span>, and produced a{' '}
											<span className="font-medium text-slate-300">{analysis.recommendation}</span> recommendation with{' '}
											<span className="font-medium text-slate-300">{(analysis.confidence * 100).toFixed(0)}%</span> confidence.
										</p>
									</div>
								</div>
							</div>
						</div>

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

							{analysis.evidence_verification && analysis.evidence_verification.length > 0 && (
								<div className="mt-6">
									<h3 className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200/70">
										Evidence Verification
									</h3>
									<div className="mt-4 space-y-4">
										{analysis.evidence_verification.map((evidence, index) => (
											<div
												key={index}
												className="rounded-2xl border border-white/10 bg-slate-950/50 p-4"
											>
												<div className="flex items-start justify-between gap-3">
													<p className="text-sm font-medium text-slate-200 flex-1">
														{evidence.claim}
													</p>
													<EvidenceStatusBadge status={evidence.status} />
												</div>
												
												<div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
													<span>Confidence:</span>
													<span className="font-medium text-slate-300">
														{(evidence.confidence * 100).toFixed(0)}%
													</span>
												</div>
												
												{evidence.evidence_sources && evidence.evidence_sources.length > 0 && (
													<div className="mt-3">
														<p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-2">
															Evidence Sources
														</p>
														<div className="space-y-2">
															{evidence.evidence_sources.map((source, idx) => (
																<div
																	key={idx}
																	className="rounded-lg border border-white/5 bg-slate-900/50 p-2"
																>
																	<div className="flex items-start gap-2">
																		<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyan-400/10 text-cyan-200 border border-cyan-400/20 whitespace-nowrap">
																			{source.source_type}
																		</span>
																		<div className="flex-1">
																			<p className="text-xs text-slate-300">
																				{source.evidence}
																			</p>
																			{source.source_reference && (
																				<p className="mt-1 text-[10px] text-slate-500">
																					{source.source_reference}
																				</p>
																			)}
																		</div>
																	</div>
																</div>
															))}
														</div>
													</div>
												)}
												
												{evidence.verification_reasoning && (
													<div className="mt-3 pt-3 border-t border-white/5">
														<p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">
															Verification Reasoning
														</p>
														<p className="text-xs leading-relaxed text-slate-400">
															{evidence.verification_reasoning}
														</p>
													</div>
												)}
											</div>
										))}
									</div>
								</div>
							)}
						</article>

						<aside className="flex flex-col gap-4">
							<section className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl">
								<h3 className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200/70">
									Investment Decision
								</h3>
								<div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/50 p-5">
									<div className="flex items-center justify-between">
										<span className="text-sm uppercase tracking-[0.2em] text-slate-400">
											Recommendation
										</span>
										<RecommendationBadge recommendation={analysis.recommendation} />
									</div>
									<div className="mt-4 flex items-center justify-between">
										<span className="text-sm uppercase tracking-[0.2em] text-slate-400">
											Confidence
										</span>
										<span className="text-xl font-semibold text-white">
											{(analysis.confidence * 100).toFixed(0)}%
										</span>
									</div>
								</div>
								<div className="mt-4">
									<h4 className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
										Rationale
									</h4>
									<ul className="mt-3 space-y-2">
										{analysis.rationale.map((reason, index) => (
											<li
												key={index}
												className="flex items-start gap-2 text-sm leading-6 text-slate-300"
											>
												<span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400" />
												<span>{reason}</span>
											</li>
										))}
									</ul>
								</div>
							</section>

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

					{analysis.investment_memo && analysis.investment_memo !== "Investment memo not available for historical records." && (
						<div className="mt-8">
							<section className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-8 backdrop-blur-xl">
								<div className="mb-6 flex items-start justify-between gap-4">
									<div>
										<h2 className="text-xl font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
											Investment Memo
										</h2>
										<p className="mt-2 text-sm text-slate-400">
											Professional VC-style investment analysis
										</p>
									</div>
									<button
										onClick={() => {
											const blob = new Blob([analysis.investment_memo], { type: 'text/plain' });
											const url = URL.createObjectURL(blob);
											const a = document.createElement('a');
											a.href = url;
											a.download = `${analysis.startup_name.replace(/\s+/g, '_')}_Investment_Memo.txt`;
											document.body.appendChild(a);
											a.click();
											document.body.removeChild(a);
											URL.revokeObjectURL(url);
										}}
										className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-400/40 hover:bg-cyan-400/20"
									>
										<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
										</svg>
										Download Memo
									</button>
								</div>
								<div className="rounded-2xl border border-white/10 bg-slate-950/50 p-6">
									<pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-200">
										{analysis.investment_memo}
									</pre>
								</div>
							</section>
						</div>
					)}
					</>
				) : null}
			</section>
		</PrismPageShell>
	);
}