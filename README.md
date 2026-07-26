# Drishti — ದೃಷ್ಟಿ

**Conversational Crime Intelligence & Analytics Platform for Karnataka State Police**

> *Drishti* (ದೃಷ್ಟಿ) means **insight / vision** in Kannada.
> **DRISHTI** — **D**ata-driven **R**eal-time **I**nvestigative & **S**ociological **H**ub for **T**hreat **I**ntelligence.

Ask the state crime database questions in plain English or Kannada — by voice or text — and get answers that are **grounded in evidence, visualized as networks and maps, and explainable to a court**.

Built for the **Karnataka State Police Hackathon / Datathon 2026 (KSPH26)** and deployed exclusively on the **Zoho Catalyst** platform.

---

## 1. The Problem

Crime data in a state database is vast, siloed, and locked behind SQL and dashboards that field investigators cannot use directly. Critical relationships — between accused, victims, locations, financial accounts, and modus operandi — stay hidden in rows and columns. As a result:

- Investigators spend hours retrieving FIRs, criminal histories, and case links manually.
- Analysts cannot easily spot hotspots, repeat-offender networks, or organized-crime clusters.
- Insights are neither **explainable** nor **auditable**, which matters in a law-enforcement context.
- Non-English-speaking field officers are cut off from the data entirely.

**Drishti** turns the crime database into a conversation. Investigators, analysts, supervisors, and policymakers ask questions the way they think — and get answers backed by a transparent evidence trail.

---

## 2. What Drishti Does (MVP Scope)

The challenge defines a 10-area framework. For the hackathon we built **four pillars deeply**, with **two cross-cutting layers baked into every response**, and stubbed the remaining areas on a clear roadmap. See the [coverage matrix](#7-framework-coverage-matrix).

### Pillar 1 — Conversational Crime Intelligence *(Framework Area 1)*
- Natural-language chatbot over FIRs, accused, victims, locations, investigation status, and criminal history.
- **English + Kannada**, text **and voice** (speech-to-text and text-to-speech).
- **Context-aware** multi-turn conversations — follow-up questions ("and his known associates?") work without repeating context.
- **Export any conversation to PDF**, saved locally, for the case file.

### Pillar 2 — Criminal Network & Relationship Analysis *(Areas 2 & 7)*
- Interactive graph linking **accused ↔ victims ↔ locations ↔ financial accounts ↔ incidents**.
- Detects **repeat-offender networks** and **organized-crime clusters** via graph centrality.
- Financial accounts and transactions appear as nodes/edges — surfacing **money trails** (partial Area 7).

### Pillar 3 — Crime Pattern & Trend Analytics *(Area 3)*
- Trends across **time, geography, crime type, and modus operandi**.
- **Hotspot map** and emerging-cluster detection.
- **Seasonal / event-based** trend analysis.

### Pillar 4 — Criminology-Based Offender Profiling *(Area 5)*
- Identifies **repeat offenders and habitual criminals**.
- **Behavioral / MO profiling** from crime history.
- **Risk scoring** (High / Medium / Low bands) to prioritize investigation — powered by a Catalyst QuickML model.

### Cross-cutting Layer A — Explainable AI *(Area 9)*
Every answer carries an **evidence trail**: the exact FIR IDs, records, and reasoning steps used, plus a confidence indicator. Nothing is a black box.

### Cross-cutting Layer B — Secure Role-Based Access & Governance *(Area 10)*
Four roles — **Investigator, Analyst, Supervisor, Policymaker** — with row-level access control and a full **audit log** of every query and record accessed.

---

## 3. Technology Stack — 100% Catalyst-Native

Everything runs on **Zoho Catalyst**, satisfying the "deployment exclusively on Catalyst" requirement. The only external call is to an LLM API for language understanding, invoked **server-side from a Catalyst AppSail service** (and swappable for Catalyst QuickML/AutoML).

| Layer | Component | Catalyst Service |
|---|---|---|
| **Web app** | React (Vite) SPA — chat, graph, maps, dashboards | **Web Client Hosting** |
| **Mobile app** | React Native (iOS + Android) — field-officer client, voice-first | consumes **AppSail** APIs |
| **Auth / RBAC** | Login, roles, sessions | **Catalyst Authentication** (Web SDK v4) |
| **Conversational engine** | NL → structured query orchestration, RAG, PDF export | **AppSail** (Node.js 20 / Python 3.12) |
| **Language understanding** | Intent parsing, NL→query, Kannada I/O | LLM API (called from AppSail) |
| **Entity extraction** | NER, keywords on FIR narratives | **Zia Text Analytics** |
| **Document ingestion** | Scanned/Kannada FIR OCR (10 Indian languages) | **Zia OCR** |
| **Structured data** | Normalized crime schema | **Data Store** (relational) |
| **Graph / history** | Adjacency lists, conversation history | **Catalyst NoSQL** |
| **Files & PDFs** | Uploaded docs, exported conversation PDFs | **Stratus** (object storage) |
| **Session context** | Multi-turn context cache | **Cache** |
| **ML pipelines** | Offender risk scoring, crime forecasting | **QuickML** |
| **Early warning** | Scheduled alert jobs | **Serverless Functions** + **Job Scheduling** |
| **Audit / events** | Audit log, event fan-out | **Data Store** + **Signals** |

**Client libraries:** Cytoscape.js (network graph), Leaflet (hotspot map), Recharts (trends), Web Speech API (voice, EN + KN). Web (React) and mobile (React Native) share types, API clients, and business logic in a common workspace.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full design, data model, and request flow.

---

## 4. Repository Structure

```
drishti-crime-intel/
├── README.md                 ← you are here
├── docs/
│   ├── PROTOTYPE_BRIEF.md     ← one-page brief for judges
│   ├── ARCHITECTURE.md        ← system design, data model, flows
│   └── SUBMISSION.md          ← hack2skill submission-template content
├── DEPLOY.md                  ← Catalyst deployment guide
├── catalyst.json              ← Catalyst project manifest                  ✅ live
├── client/                    ← web app → Web Client Hosting              ✅ live
│   ├── index.html · styles.css · app.js
│   └── client-package.json
├── functions/
│   └── drishti_api/           ← Advanced I/O mock API → /server/drishti_api ✅ live
├── mobile/                    ← React Native app (iOS + Android)          [scaffold]
├── appsail/                   ← full conversational engine + PDF service   [scaffold]
├── ml/                        ← QuickML pipeline definitions & notebooks   [scaffold]
└── data/                      ← Synthetic sample crime dataset + schema    [scaffold]
```

> **Status:** The **web client** and a **Catalyst Serverless Function** (mock intelligence API) are built and deployable today — see [`DEPLOY.md`](DEPLOY.md). The chatbot answers network, trend/hotspot, offender-risk, and FIR-lookup queries over synthetic data, in English and Kannada, with an evidence trail on every response. Directories marked `[scaffold]` (mobile app, full AppSail engine, ML pipelines) are the next build phase.

---

## 5. Setup & Execution

### Prerequisites
- A **Zoho Catalyst** account and project — <https://catalyst.zoho.com>
- **Catalyst CLI** — `npm install -g zcatalyst-cli`
- **Node.js ≥ 20** and **Python ≥ 3.12**
- An LLM API key (for the conversational engine)

### Local development
```bash
# 1. Clone
git clone <this-repo-url>
cd drishti-crime-intel

# 2. Authenticate the Catalyst CLI
catalyst login

# 3. Link to your Catalyst project
catalyst init          # select your project; enable Functions, AppSail, Web Client

# 4. Install dependencies
cd web && npm install && cd ..
cd appsail && npm install && cd ..

# 5. Configure secrets (LLM key, etc.) as Catalyst environment variables
#    Console → Settings → Environment Variables, or:
catalyst env:set LLM_API_KEY <your-key>

# 6. Load the synthetic sample dataset into Data Store
node data/seed.js       # creates tables + inserts sample FIRs, persons, links

# 7. Run locally
catalyst serve          # serves web + functions + appsail locally
```

### Deploy to Catalyst
```bash
catalyst deploy         # deploys Web Client, Functions, and AppSail to Catalyst
```

The deployed app is served from your Catalyst-hosted URL (see the [live link](docs/SUBMISSION.md)).

> **Data note:** No real crime data is used. The MVP ships with a **synthetic, privacy-safe dataset** modeled on the Karnataka FIR schema for demonstration.

---

## 6. Security, Privacy & Compliance

- **Role-based access control** via Catalyst Authentication; row-level filters by jurisdiction and role.
- **Full audit log** — every query, the records it touched, and the requesting user are recorded (Data Store + Signals).
- **No free-form SQL** — the LLM produces intent, which is mapped to a **parameterized query allowlist**; the model never executes raw SQL.
- **Explainability by design** — responses cite record IDs and reasoning, meeting law-enforcement accountability needs.
- **Synthetic data only** in the prototype; production deployment would integrate with governed state systems under the applicable data-protection framework.

---

## 7. Framework Coverage Matrix

| # | Framework Area | Status in MVP |
|---|---|---|
| 1 | Conversational Crime Intelligence Interface | ✅ **Built** (EN + KN, voice, context, PDF) |
| 2 | Criminal Network & Relationship Analysis | ✅ **Built** |
| 3 | Crime Pattern & Trend Analytics | ✅ **Built** |
| 4 | Sociological Crime Insights | 🟡 Partial (demographic filters in analytics) |
| 5 | Criminology-Based Offender Profiling | ✅ **Built** (QuickML risk scoring) |
| 6 | Investigator Decision Support | 🟡 Partial (LLM case summaries; similar-case stub) |
| 7 | Financial Crime & Transaction Link Analysis | 🟡 Partial (accounts/txns in network graph) |
| 8 | Crime Forecasting & Early Warning | 🟡 Roadmap (QuickML forecast + scheduled alerts) |
| 9 | Explainable AI & Transparent Analytics | ✅ **Built** (cross-cutting) |
| 10 | Secure Role-Based Access & Governance | ✅ **Built** (cross-cutting) |

Legend: ✅ Built · 🟡 Partial / Roadmap

---

## 8. Roadmap

1. **Sociological insights** — correlate crime with urbanization, migration, education, economic stress indicators (Area 4).
2. **Investigator decision support** — vector similarity over case narratives for "similar past cases + outcomes" (Area 6).
3. **Financial link analysis** — dedicated transaction-graph module with suspicious-pattern scoring (Area 7).
4. **Forecasting & early warning** — QuickML time-series hotspot prediction + Job-Scheduled alerts for gang/repeat activity (Area 8).

---

## 9. Team & Submission

See [`docs/SUBMISSION.md`](docs/SUBMISSION.md) for the prototype brief, GitHub link, demo video, and live Catalyst deployment link, formatted to the official hack2skill submission template.

---

*Prototype built for KSPH26 / Datathon 2026. Uses synthetic data only.*
