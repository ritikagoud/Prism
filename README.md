# Prism

### AI-Powered Startup Due Diligence Platform

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge\&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge\&logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green?style=for-the-badge\&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.11-yellow?style=for-the-badge\&logo=python)
![Multi-Agent](https://img.shields.io/badge/Multi--Agent-AI-purple?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-brightgreen?style=for-the-badge)

---

## From Pitch Decks to Investment Intelligence

Prism is an AI-powered startup due diligence platform that helps investors, analysts, accelerators, and innovation teams evaluate startup opportunities faster and more consistently.

By combining document intelligence, PDF processing, and a multi-agent analysis architecture, Prism transforms startup pitch decks into structured investment insights, uncovering claims, identifying competitors, assessing risks, and generating detailed due diligence reports.

---

## Built For

**Microsoft Agents League Hackathon 2026**

Prism demonstrates how specialized AI agents can collaborate to automate startup due diligence workflows. The platform converts unstructured startup information into actionable investment intelligence through coordinated agent execution, report generation, and historical analysis tracking.

---

## Problem Statement

Evaluating startup opportunities is a time-consuming and research-intensive process.

Investors and analysts often review hundreds of startup pitch decks containing:

* Unverified business claims
* Limited competitive context
* Incomplete market intelligence
* Hidden operational risks
* Inconsistent reporting formats

Traditional due diligence requires significant manual effort across research, validation, and risk assessment. As startup deal flow increases, maintaining evaluation quality becomes increasingly difficult.

---

## Solution

Prism automates the early-stage due diligence process using a specialized multi-agent architecture.

Users upload a startup pitch deck, and Prism automatically:

* Extracts information from the document
* Identifies key startup claims
* Analyzes competitors
* Assesses business risks
* Generates structured reports
* Stores historical analyses for future reference

This enables investors and analysts to evaluate opportunities faster while maintaining consistency across startup reviews.

---

## Product Workflow

```text
Pitch Deck Upload
        │
        ▼
PDF Text Extraction
        │
        ▼
Claim Extraction Agent
        │
        ▼
Competitor Research Agent
        │
        ▼
Risk Assessment Agent
        │
        ▼
Orchestrator Agent
        │
        ▼
Analysis Report Generation
        │
        ▼
Analysis Persistence
        │
        ▼
Dashboard & Historical Insights
```

---

## Key Features

### Startup Analysis Submission

Submit startup opportunities through a streamlined analysis interface.

### PDF Pitch Deck Upload

Upload startup pitch decks in PDF format for automated processing.

### PDF Text Extraction

Automatically extract text from uploaded pitch decks for downstream analysis.

### Claim Extraction Agent

Identifies startup claims, traction statements, metrics, and business assertions.

### Competitor Research Agent

Analyzes competitive positioning and identifies market competitors.

### Risk Assessment Agent

Evaluates operational, market, execution, and business risks.

### Orchestrator Agent

Coordinates agent execution and consolidates outputs into a unified analysis.

### Historical Dashboard

Browse and review previously generated startup analyses.

### Detailed Analysis Reports

View comprehensive due diligence reports for each startup.

### Analysis Persistence

Store startup evaluations for future review and comparison.

---

## Example Analysis Output

```json
{
  "analysis_id": "ca24854a-dca6-4106-b83a-f9317b142810",
  "startup_name": "Prism Analytics",
  "risk_score": 52,
  "risk_level": "medium",
  "claims": [
    "AI platform helping investors evaluate startups"
  ],
  "competitors": [
    "OpenAI",
    "Anthropic",
    "Perplexity"
  ]
}
```

---

## Architecture

```text
                        ┌──────────────────┐
                        │   Startup Deck   │
                        │      (PDF)       │
                        └─────────┬────────┘
                                  │
                                  ▼
                     ┌────────────────────────┐
                     │   PDF Text Extraction  │
                     └─────────┬──────────────┘
                               │
                               ▼
                    ┌─────────────────────────┐
                    │  Orchestrator Agent     │
                    └──────┬────────┬─────────┘
                           │        │
                           │        │
                           ▼        ▼
               ┌──────────────┐  ┌──────────────┐
               │ Claim Agent  │  │ Competitor   │
               │              │  │ Agent        │
               └──────┬───────┘  └──────┬───────┘
                      │                 │
                      ▼                 ▼
                ┌──────────────────────────┐
                │      Risk Agent          │
                └────────────┬─────────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │ Analysis Report     │
                  └─────────┬───────────┘
                            │
                            ▼
                  ┌─────────────────────┐
                  │ Persistence Layer   │
                  └─────────┬───────────┘
                            │
                            ▼
                  ┌─────────────────────┐
                  │ Dashboard & Reports │
                  └─────────────────────┘
```

---

## Screenshots

### Analyze Startup

![Analyze Startup](screenshots/analyze.png)

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Analysis Report

![Analysis Report](screenshots/report.png)

### System Architecture

![Architecture](screenshots/architecture.png)

---

## Tech Stack

### Frontend

* Next.js
* TypeScript
* React
* Tailwind CSS

### Backend

* FastAPI
* Python
* JSON Persistence
* PDF Processing

### AI Architecture

* Orchestrator Agent
* Claim Agent
* Competitor Agent
* Risk Agent

---

## Installation

### Clone Repository

```bash
git clone https://github.com/ritikagoud/Prism.git

cd Prism
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:3000
```

### Backend Setup

```bash
cd backend

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

---

## Project Structure

```text
Prism/
│
├── frontend/
│
├── backend/
│   ├── agents/
│   ├── services/
│   ├── models/
│   ├── api/
│   └── data/
│
├── screenshots/
│
├── README.md
│
└── requirements.txt
```

---

## Future Roadmap

### Phase 1

* Enhanced claim verification
* Market sizing analysis
* Financial signal extraction

### Phase 2

* Real-time web research
* Industry benchmarking
* Competitor intelligence expansion

### Phase 3

* Investment scoring engine
* Startup comparison workspace
* Portfolio monitoring

### Phase 4

* Azure AI Foundry integration
* Investor collaboration tools
* Enterprise deployment

---

## Use Cases

### Venture Capital Firms

Accelerate startup screening and due diligence.

### Angel Investors

Perform structured startup evaluations without dedicated analyst teams.

### Accelerators & Incubators

Review startup cohorts efficiently at scale.

### Corporate Innovation Teams

Assess emerging technologies and startup partnerships.

### Investment Analysts

Generate repeatable and consistent research workflows.

---

## Why Prism Matters

Startup investing is fundamentally an information problem.

The quality of investment decisions depends on the quality, consistency, and speed of analysis.

Prism transforms unstructured startup information into actionable investment intelligence through document processing, agent-based reasoning, risk assessment, and structured reporting.

The result is faster due diligence, more consistent evaluations, and improved decision-making.

---

## Team

**Ritika Goud**

---

## Prism

**From Pitch Decks to Investment Intelligence.**
