"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

const ANALYSIS_ENDPOINT = "http://127.0.0.1:8000/api/v1/analysis";
const UPLOAD_ENDPOINT = "http://127.0.0.1:8000/api/v1/upload";

const highlights = [
	"\u2713 Claim Extraction",
	"\u2713 Competitor Research",
	"\u2713 Risk Assessment",
	"\u2713 Evidence Verification",
];

const steps = [
	"Capture the company context",
	"Attach the pitch deck or memo",
	"Run the multi-agent diligence workflow",
];

const industryOptions = [
	"AI / SaaS",
	"FinTech",
	"HealthTech",
	"EdTech",
	"E-commerce",
	"ClimateTech",
	"Other",
] as const;

type IndustryOption = (typeof industryOptions)[number];

type AnalysisResult = {
	analysis_id: string;
	status: string;
	claims?: string[];
	competitors?: string[];
	risk_score?: number | null;
	risk_level?: string | null;
};

type UploadResult = {
	file_id: string;
	filename: string;
	size: number;
	status: string;
};

type FormErrors = Partial<{
	startupName: string;
	description: string;
	websiteUrl: string;
	industry: string;
}>;

const isValidUrl = (value: string) => {
	try {
		new URL(value);
		return true;
	} catch {
		return false;
 	}
};

export default function AnalyzePage() {
	const comboboxId = useId();
	const listboxId = useId();
	const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
	const dropdownRef = useRef<HTMLDivElement | null>(null);
	const pdfInputRef = useRef<HTMLInputElement | null>(null);
	const [startupName, setStartupName] = useState("");
	const [description, setDescription] = useState("");
	const [websiteUrl, setWebsiteUrl] = useState("");
	const [industry, setIndustry] = useState<IndustryOption | "">("");
	const [errors, setErrors] = useState<FormErrors>({});
	const [submitError, setSubmitError] = useState("");
	const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedPdfName, setSelectedPdfName] = useState("");
	const [uploadedFileId, setUploadedFileId] = useState("");
	const [uploadState, setUploadState] = useState<"idle" | "uploading" | "uploaded" | "error">("idle");
	const [uploadMessage, setUploadMessage] = useState("");
	const [isIndustryOpen, setIsIndustryOpen] = useState(false);
	const [activeIndustryIndex, setActiveIndustryIndex] = useState(0);

	const claims = analysisResult?.claims ?? [];
	const competitors = analysisResult?.competitors ?? [];
	const riskScore = typeof analysisResult?.risk_score === "number" ? analysisResult.risk_score : null;
	const riskLevel = analysisResult?.risk_level?.trim().toLowerCase() ?? "unknown";

	const riskLevelBadgeClass =
		riskLevel === "low"
			? "border-emerald-300/30 bg-emerald-400/15 text-emerald-100"
			: riskLevel === "medium"
				? "border-amber-300/30 bg-amber-400/15 text-amber-100"
				: riskLevel === "high"
					? "border-rose-300/30 bg-rose-400/15 text-rose-100"
					: "border-slate-300/20 bg-slate-400/10 text-slate-200";

	const openIndustryMenu = () => {
		setIsIndustryOpen(true);
		setActiveIndustryIndex(
			industry ? industryOptions.indexOf(industry as (typeof industryOptions)[number]) : 0,
		);
	};

	const closeIndustryMenu = () => {
		setIsIndustryOpen(false);
	};

	const selectIndustry = (value: IndustryOption) => {
		setIndustry(value);
		setErrors((current) => ({ ...current, industry: undefined }));
		closeIndustryMenu();
	};

	const uploadSelectedPdf = async (file: File) => {
		setSubmitError("");
		setAnalysisResult(null);
		setUploadState("uploading");
		setUploadMessage("Uploading PDF...");
		setUploadedFileId("");

		try {
			const formData = new FormData();
			formData.append("file", file);

			const response = await fetch(UPLOAD_ENDPOINT, {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const payload = (await response.json().catch(() => null)) as { detail?: string } | null;
				throw new Error(payload?.detail || "Upload failed.");
			}

			const data = (await response.json()) as UploadResult;
			setUploadedFileId(data.file_id);
			setUploadState("uploaded");
			setUploadMessage(`${data.filename} uploaded successfully.`);
		} catch (error) {
			setUploadState("error");
			setUploadMessage(error instanceof Error ? error.message : "Unable to upload PDF.");
		}
	};

	const handlePdfChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) {
			return;
		}

		event.target.value = "";

		setSelectedPdfName(file.name);
		setUploadMessage("");
		setUploadState("idle");
		setUploadedFileId("");
		setSubmitError("");

		const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
		if (!isPdf) {
			setUploadState("error");
			setUploadMessage("Only PDF files are allowed.");
			event.target.value = "";
			setSelectedPdfName("");
			return;
		}

		await uploadSelectedPdf(file);
	};

	const validate = () => {
		const nextErrors: FormErrors = {};

		if (!startupName.trim()) {
			nextErrors.startupName = "Startup name is required.";
		}
		if (!description.trim()) {
			nextErrors.description = "Description is required.";
		}
		if (!websiteUrl.trim()) {
			nextErrors.websiteUrl = "Website URL is required.";
		} else if (!isValidUrl(websiteUrl.trim())) {
			nextErrors.websiteUrl = "Enter a valid website URL.";
		}
		if (!industry) {
			nextErrors.industry = "Industry is required.";
		}

		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSubmitError("");
		setAnalysisResult(null);

		if (!validate()) {
			return;
		}

		if (selectedPdfName && uploadState === "uploading") {
			setSubmitError("Please wait for the PDF upload to finish.");
			return;
		}

		if (selectedPdfName && !uploadedFileId) {
			setSubmitError("Please upload a valid PDF before starting analysis.");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch(ANALYSIS_ENDPOINT, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					startup_name: startupName.trim(),
					description: description.trim(),
					website_url: websiteUrl.trim(),
					industry,
					uploaded_file_id: uploadedFileId || undefined,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to queue analysis.");
			}

			const data = (await response.json()) as AnalysisResult;
			setAnalysisResult(data);
		} catch {
			setSubmitError(
				"We could not start the analysis right now. Please check your connection and try again.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				closeIndustryMenu();
			}
		};

		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, []);

	useEffect(() => {
		if (isIndustryOpen) {
			optionRefs.current[activeIndustryIndex]?.focus();
		}
	}, [activeIndustryIndex, isIndustryOpen]);

	return (
		<main className="min-h-screen overflow-hidden bg-[#050816] text-white">
			<div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(84,114,255,0.20),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.12),transparent_28%),linear-gradient(180deg,#050816_0%,#060b16_50%,#04050b_100%)]" />
			<div className="pointer-events-none fixed inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.18)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.95),transparent_92%)]" />

			<div className="relative mx-auto flex w-full max-w-7xl flex-col px-6 pb-20 pt-8 sm:px-8 lg:px-12">
				<header className="flex flex-col gap-4 rounded-full border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#7c8cff,#3dd6d0)] text-sm font-semibold text-slate-950 shadow-[0_0_40px_rgba(125,140,255,0.35)]">
							P
						</div>
						<div>
							<p className="text-sm font-semibold tracking-[0.22em] text-slate-200 uppercase">
								Prism
							</p>
							<p className="text-xs text-slate-400">
								Startup diligence intake
							</p>
						</div>
					</div>
					<Link
						href="/"
						className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-400/40 hover:bg-cyan-400/10"
					>
						Back to home
					</Link>
				</header>

				<section className="grid gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:py-16">
					<div className="max-w-3xl">
						<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
							<span className="h-2 w-2 rounded-full bg-cyan-300" />
							Analyze a startup in minutes, not hours
						</div>

						<h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.06em] text-balance sm:text-5xl lg:text-6xl">
							Submit a startup and get a structured diligence workflow.
						</h1>

						<p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
							Add the company name, a short description, and the website URL.
							Upload a pitch deck PDF and Prism will prepare the startup for
							multi-agent analysis.
						</p>

						<div className="mt-8 flex flex-wrap gap-3">
							{highlights.map((item) => (
								<span
									key={item}
									className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
								>
									{item}
								</span>
							))}
						</div>
					</div>

					<div className="relative">
						<div className="absolute -inset-5 rounded-[2rem] bg-[radial-gradient(circle,rgba(61,214,208,0.18),transparent_50%)] blur-2xl" />
						<div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-[0_32px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-6">
							<div className="flex items-center justify-between border-b border-white/10 pb-4">
								<div>
									<p className="text-xs uppercase tracking-[0.24em] text-slate-400">
										Intake status
									</p>
									<p className="mt-1 text-lg font-medium text-white">
										Ready for analysis
									</p>
									<p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
										Prism will coordinate multiple specialized agents to validate claims,
										research competitors, assess risks, and generate an evidence-backed
										due diligence report.
									</p>
								</div>
								<div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
									3-step intake
								</div>
							</div>

							{analysisResult ? (
								<div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5 shadow-[0_0_40px_rgba(16,185,129,0.10)]">
									<p className="text-xs uppercase tracking-[0.24em] text-emerald-200/80">
										Analysis completed
									</p>
									<div className="mt-3 grid gap-3 sm:grid-cols-2">
										<div>
											<p className="text-sm text-emerald-100/80">Analysis ID</p>
											<p className="mt-1 break-all text-sm font-medium text-white">
												{analysisResult.analysis_id}
											</p>
										</div>
										<div>
											<p className="text-sm text-emerald-100/80">Status</p>
											<p className="mt-1 text-sm font-medium text-white">
												{analysisResult.status}
											</p>
										</div>
									</div>

									<div className="mt-5 grid gap-4">
										<div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
											<p className="text-xs uppercase tracking-[0.2em] text-cyan-100/80">
												Claims Found
											</p>
											<div className="mt-3 flex flex-wrap gap-2">
												{claims.length > 0 ? (
													claims.map((claim) => (
														<span
															key={claim}
															className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-50"
														>
															{claim}
														</span>
													))
												) : (
													<p className="text-sm text-slate-300">No claims returned yet.</p>
												)}
											</div>
										</div>

										<div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
											<p className="text-xs uppercase tracking-[0.2em] text-cyan-100/80">
												Competitors Identified
											</p>
											<div className="mt-3 space-y-2">
												{competitors.length > 0 ? (
													competitors.map((competitor) => (
														<p key={competitor} className="text-sm text-white">
															- {competitor}
														</p>
													))
												) : (
													<p className="text-sm text-slate-300">No competitors returned yet.</p>
												)}
											</div>
										</div>

										<div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
											<p className="text-xs uppercase tracking-[0.2em] text-cyan-100/80">
												Risk Assessment
											</p>
											<div className="mt-3 flex flex-wrap items-center justify-between gap-3">
												<div>
													<p className="text-xs text-slate-300">Risk score</p>
													<p className="text-3xl font-semibold tracking-tight text-white">
														{riskScore ?? "N/A"}
													</p>
												</div>
												<span
													className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${riskLevelBadgeClass}`}
												>
													{riskLevel}
												</span>
											</div>
										</div>
									</div>
								</div>
							) : null}

							{submitError ? (
								<div className="mt-6 rounded-3xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-100">
									{submitError}
								</div>
							) : null}

							<form className="mt-6 space-y-5" onSubmit={handleSubmit}>
								<div className="grid gap-5 sm:grid-cols-2">
									<label className="space-y-2 sm:col-span-2">
										<span className="text-sm font-medium text-slate-200">
											Startup name
										</span>
										<input
											type="text"
											placeholder="e.g. Northstar AI"
											value={startupName}
											onChange={(event) => {
												setStartupName(event.target.value);
												setErrors((current) => ({ ...current, startupName: undefined }));
											}}
											aria-invalid={Boolean(errors.startupName)}
											aria-describedby={errors.startupName ? "startup-name-error" : undefined}
											className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
										/>
										{errors.startupName ? (
											<p id="startup-name-error" className="text-sm text-rose-200">
												{errors.startupName}
											</p>
										) : null}
									</label>

									<label className="space-y-2 sm:col-span-2">
										<span className="text-sm font-medium text-slate-200">
											Startup description
										</span>
										<textarea
											placeholder="Describe the product, market, traction, or any specific diligence angle you want Prism to focus on."
											rows={5}
											value={description}
											onChange={(event) => {
												setDescription(event.target.value);
												setErrors((current) => ({ ...current, description: undefined }));
											}}
											aria-invalid={Boolean(errors.description)}
											aria-describedby={errors.description ? "startup-description-error" : undefined}
											className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
										/>
										{errors.description ? (
											<p id="startup-description-error" className="text-sm text-rose-200">
												{errors.description}
											</p>
										) : null}
									</label>

									<label className="space-y-2 sm:col-span-2">
										<span className="text-sm font-medium text-slate-200">
											Website URL
										</span>
										<input
											type="url"
											placeholder="https://company.com"
											value={websiteUrl}
											onChange={(event) => {
												setWebsiteUrl(event.target.value);
												setErrors((current) => ({ ...current, websiteUrl: undefined }));
											}}
											aria-invalid={Boolean(errors.websiteUrl)}
											aria-describedby={errors.websiteUrl ? "website-url-error" : undefined}
											className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
										/>
										{errors.websiteUrl ? (
											<p id="website-url-error" className="text-sm text-rose-200">
												{errors.websiteUrl}
											</p>
										) : null}
									</label>

									<label className="space-y-2 sm:col-span-2">
										<span className="text-sm font-medium text-slate-200">
											Industry
										</span>
										<div ref={dropdownRef} className="relative">
											<input type="hidden" name="industry" value={industry} />
											<button
												type="button"
												id={comboboxId}
												aria-controls={listboxId}
												aria-expanded={isIndustryOpen}
												aria-haspopup="listbox"
												className="flex h-12 w-full items-center justify-between rounded-2xl border border-cyan-400/30 bg-[#07111f] px-4 text-left text-sm text-white outline-none transition hover:border-cyan-300/50 hover:bg-[#0a1526] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
												onClick={() => (isIndustryOpen ? closeIndustryMenu() : openIndustryMenu())}
												onKeyDown={(event) => {
													if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
														event.preventDefault();
														openIndustryMenu();
														return;
													}
													if (event.key === "Escape") {
														closeIndustryMenu();
													}
												}}
											>
												<span className={industry ? "text-white" : "text-slate-400"}>
													{industry || "Select an industry"}
												</span>
												<svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-cyan-200/80">
													<path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</button>
												{errors.industry ? (
													<p className="text-sm text-rose-200">{errors.industry}</p>
												) : null}

											{isIndustryOpen ? (
												<div
													id={listboxId}
													role="listbox"
													aria-labelledby={comboboxId}
													className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-cyan-400/20 bg-[#09111f] shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
												>
													<div className="border-b border-white/5 bg-[#0a1322] px-4 py-3 text-xs uppercase tracking-[0.22em] text-slate-500">
														Choose one industry
													</div>
													<div className="max-h-64 overflow-auto py-1">
														{industryOptions.map((option, index) => {
															const isSelected = option === industry;
															const isActive = index === activeIndustryIndex;
															return (
																<button
																	key={option}
																	type="button"
																	role="option"
																	aria-selected={isSelected}
																	ref={(node) => {
																		optionRefs.current[index] = node;
																	}}
																	className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition focus:outline-none ${
																		isSelected
																			? "bg-cyan-400/15 text-white"
																			: isActive
																				? "bg-[#11233d] text-white"
																				: "text-slate-200 hover:bg-[#11233d] hover:text-white"
																	}`}
																	onClick={() => selectIndustry(option)}
																	onMouseEnter={() => setActiveIndustryIndex(index)}
																	onKeyDown={(event) => {
																		if (event.key === "ArrowDown") {
																			event.preventDefault();
																			setActiveIndustryIndex((index + 1) % industryOptions.length);
																			return;
																		}
																		if (event.key === "ArrowUp") {
																			event.preventDefault();
																			setActiveIndustryIndex((index - 1 + industryOptions.length) % industryOptions.length);
																			return;
																		}
																		if (event.key === "Enter" || event.key === " ") {
																			event.preventDefault();
																			selectIndustry(option);
																			return;
																		}
																		if (event.key === "Escape") {
																			event.preventDefault();
																			closeIndustryMenu();
																			document.getElementById(comboboxId)?.focus();
																		}
																	}}
																>
																	<span>{option}</span>
																	{isSelected ? <span className="text-cyan-200">Selected</span> : null}
																</button>
															);
														})}
													</div>
												</div>
											) : null}
										</div>
									</label>

									<label className="space-y-2 sm:col-span-2">
										<span className="text-sm font-medium text-slate-200">
											PDF upload
										</span>
										<div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.04] p-4 transition hover:border-cyan-400/35 hover:bg-white/[0.06]">
											<label
												className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/8 bg-slate-950/50 px-6 py-8 text-center ${
													isSubmitting || uploadState === "uploading" ? "cursor-not-allowed" : "cursor-pointer"
												}`}
											>
												<div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
													<svg
														aria-hidden="true"
														viewBox="0 0 24 24"
														fill="none"
														className="h-5 w-5"
													>
														<path
															d="M12 16V8m0 0-3 3m3-3 3 3M5 16.5A4.5 4.5 0 0 1 8.5 9h1.08A5.5 5.5 0 0 1 20 11.5a4 4 0 0 1-1 7.9H6A4.5 4.5 0 0 1 5 16.5Z"
															stroke="currentColor"
															strokeWidth="1.6"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
												</div>
												<div>
													<p className="text-sm font-medium text-white">
														Drag and drop a PDF deck here
													</p>
													<p className="mt-1 text-sm text-slate-400">
														or click to browse files
													</p>
												</div>
												<input
													ref={pdfInputRef}
													type="file"
													accept=".pdf,application/pdf"
													disabled={isSubmitting || uploadState === "uploading"}
													className="sr-only"
													onChange={handlePdfChange}
												/>
											</label>
											<div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
												<div>
													<p className="text-sm font-medium text-white">
														{selectedPdfName || "No PDF selected"}
													</p>
													<p className="mt-1 text-sm text-slate-400">
														Only PDF files up to 10 MB are accepted.
													</p>
												</div>
												<div
													className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] ${
														uploadState === "uploaded"
															? "border-emerald-300/30 bg-emerald-400/15 text-emerald-100"
															: uploadState === "uploading"
																? "border-cyan-300/30 bg-cyan-400/15 text-cyan-100"
																: uploadState === "error"
																	? "border-rose-300/30 bg-rose-400/15 text-rose-100"
																	: "border-white/15 bg-white/5 text-slate-200"
													}`}
												>
													{uploadState === "uploaded"
														? "Uploaded"
														: uploadState === "uploading"
															? "Uploading"
															: uploadState === "error"
																? "Upload error"
																: "Awaiting file"}
												</div>
											</div>
											{uploadMessage ? (
												<p
													className={`mt-3 text-sm ${
														uploadState === "uploaded"
															? "text-emerald-200"
															: uploadState === "error"
																? "text-rose-200"
																: "text-slate-300"
													}`}
												>
													{uploadMessage}
												</p>
											) : null}
											{uploadState === "uploading" ? (
												<p className="mt-2 text-sm text-cyan-200">
													PDF upload is in progress. You can submit once it completes.
												</p>
											) : null}
										</div>
									</label>
								</div>

								<button
									type="submit"
									disabled={isSubmitting || uploadState === "uploading"}
									className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
								>
									{isSubmitting
										? "Queueing analysis..."
										: uploadState === "uploading"
											? "Uploading PDF..."
											: "Start Prism Analysis"}
								</button>
							</form>
						</div>
					</div>
				</section>

				<section className="grid gap-4 border-t border-white/10 py-6 sm:grid-cols-3">
					{steps.map((step, index) => (
						<div
							key={step}
							className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
						>
							<p className="text-sm font-medium text-cyan-200/80">
								0{index + 1}
							</p>
							<p className="mt-2 text-base font-semibold text-white">
								{step}
							</p>
						</div>
					))}
				</section>
			</div>
		</main>
	);
}