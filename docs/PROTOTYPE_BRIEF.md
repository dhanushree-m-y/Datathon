# Prototype Brief — Drishti (ದೃಷ್ಟಿ)

**Conversational Crime Intelligence & Analytics Platform**
KSPH26 / Datathon 2026 · Deployed on Zoho Catalyst

---

## Problem Statement Addressed

State crime databases hold enormous investigative value, but that value is trapped behind SQL, dashboards, and language barriers. Investigators cannot query the data the way they think; hidden relationships between accused, victims, locations, financial accounts, and modus operandi stay invisible; and any insight produced is neither explainable nor auditable — a hard requirement in law enforcement. Field officers who do not work in English are shut out entirely.

**Drishti makes the crime database conversational.** Users ask questions in plain English or Kannada — by voice or text — and receive answers that are visualized, grounded in a transparent evidence trail, and governed by role-based access.

---

## Key Features & Functionalities

The challenge's 10-area framework is addressed with **four pillars built deeply** and **two governance layers baked into every response**:

| Pillar | What it delivers |
|---|---|
| **1. Conversational Interface** | NL chatbot over FIRs, accused, victims, locations, and criminal history · **English + Kannada** · **voice Q&A** · context-aware follow-ups · **export conversation to PDF** |
| **2. Network & Relationship Analysis** | Interactive graph of accused ↔ victims ↔ locations ↔ **financial accounts** ↔ incidents · repeat-offender & organized-crime cluster detection |
| **3. Pattern & Trend Analytics** | Trends by time / geography / crime type / MO · **hotspot map** · seasonal & emerging-cluster analysis |
| **4. Offender Profiling** | Repeat-offender identification · behavioral/MO profiling · **AI risk scoring** to prioritize investigation |
| **+ Explainable AI** | Every answer cites the FIR IDs, records, and reasoning used, with a confidence indicator |
| **+ Role-Based Access & Governance** | Investigator / Analyst / Supervisor / Policymaker roles · row-level access · full audit log |

Remaining framework areas (sociological insights, decision support, financial link analysis, forecasting & early warning) are addressed partially or scoped on the roadmap — see the coverage matrix in the README.

---

## Technology Stack

**100% Zoho Catalyst-native**, satisfying the "deploy exclusively on Catalyst" requirement:

- **Web app** — React (Vite) SPA on **Web Client Hosting**: chat, network graph (Cytoscape.js), hotspot map (Leaflet), trend charts (Recharts), voice via Web Speech API.
- **Mobile app** — **React Native** (iOS + Android) field-officer client, voice-first, sharing logic with the web app and consuming the same AppSail APIs.
- **Catalyst Authentication** — login, four-role RBAC, sessions.
- **AppSail** (Node.js / Python) — the conversational engine: NL → intent → **parameterized query allowlist** (no raw SQL), RAG over records, and PDF export.
- **Zia Services** — **OCR** (Kannada + 10 Indian languages) for scanned FIRs; **Text Analytics** (NER) for entity extraction.
- **Data Store** (relational) + **NoSQL** (graph/history) + **Stratus** (PDFs/files) + **Cache** (session context).
- **QuickML** — no-code ML pipelines for offender risk scoring and crime forecasting.
- **Serverless Functions + Job Scheduling** — early-warning alerts.
- **Signals** — audit-log event fan-out.
- **LLM API** — invoked server-side from AppSail for language understanding (swappable for QuickML/AutoML).

---

## Proposed Impact & Use Case

**Impact**
- **Cuts investigation time** — retrieval that took hours of manual lookup becomes a single spoken question.
- **Surfaces hidden intelligence** — networks, hotspots, and repeat-offender clusters that rows-and-columns hide.
- **Enables proactive policing** — risk scoring and (roadmap) forecasting shift effort from reactive to preventive.
- **Democratizes access** — Kannada + voice puts the database in the hands of every field officer, not just analysts.
- **Accountable by design** — evidence trails and audit logs meet law-enforcement transparency requirements.

**Representative queries the demo answers**
- *"Show me the FIRs and criminal history of the accused in FIR 142/2025."*
- *"ಬೆಂಗಳೂರು ದಕ್ಷಿಣದಲ್ಲಿ ಕಳೆದ ತ್ರೈಮಾಸಿಕದಲ್ಲಿ ಕಳ್ಳತನದ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು ಯಾವುವು?"* ("What are the theft hotspots in Bengaluru South last quarter?")
- *"Draw the network around this accused and highlight organized-crime links."*
- *"Rank repeat offenders in this jurisdiction by risk."*

**Primary users:** investigating officers, crime analysts, station/district supervisors, and state policymakers — each seeing only what their role permits.
