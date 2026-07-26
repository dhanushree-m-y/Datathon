# Architecture — Drishti

System design, data model, and request flows for the Drishti Conversational Crime Intelligence Platform. Everything is hosted on **Zoho Catalyst**.

---

## 1. High-Level Architecture

```
          ┌────────────────────────────┐   ┌────────────────────────────┐
          │  Web app — React (Vite)    │   │ Mobile app — React Native  │
          │  Web Client Hosting        │   │ iOS + Android, voice-first │
          │  Chat·Graph·Map·KPIs·Voice │   │ Chat·Voice·Alerts          │
          └──────────────┬─────────────┘   └──────────────┬─────────────┘
                         └─────────────┬──────────────────┘
                                       │  HTTPS (Web SDK v4, auth token)
                    ┌────────────────────▼─────────────────────┐
                    │       Catalyst Authentication (RBAC)      │
                    │  Investigator · Analyst · Supervisor · PM │
                    └────────────────────┬─────────────────────┘
                                         │
                 ┌───────────────────────▼────────────────────────┐
                 │        AppSail — Conversational Engine          │
                 │  1. Parse intent (LLM)                          │
                 │  2. Map intent → parameterized query allowlist  │
                 │  3. Retrieve records (RAG)                      │
                 │  4. Compose answer + evidence trail             │
                 │  5. Log to audit trail (Signals)                │
                 └───┬───────┬───────┬───────┬───────┬────────────┘
                     │       │       │       │       │
         ┌───────────▼─┐ ┌───▼────┐ ┌▼─────┐ ┌▼─────┐ ┌▼──────────┐
         │ Data Store  │ │ NoSQL  │ │Stratus│ │Cache │ │Zia OCR /  │
         │ (relational)│ │(graph/ │ │(PDFs/ │ │(ctx) │ │Text Anal. │
         │  FIR schema │ │history)│ │ files)│ │      │ │(NER,OCR)  │
         └─────────────┘ └────────┘ └───────┘ └──────┘ └───────────┘
                     │
         ┌───────────▼─────────────┐     ┌──────────────────────────┐
         │ QuickML pipelines       │     │ Serverless Functions +   │
         │ risk scoring / forecast │     │ Job Scheduling (alerts)  │
         └─────────────────────────┘     └──────────────────────────┘
```

---

## 2. Data Model (Catalyst Data Store)

Normalized schema modeled on the Karnataka FIR structure. **Synthetic data only** in the prototype.

**`fir`**
`fir_id (PK)` · `fir_number` · `police_station` · `district` · `act_and_section` · `crime_type` · `mo_tags[]` · `reported_at` · `occurred_at` · `latitude` · `longitude` · `investigation_status` · `narrative` · `narrative_kn`

**`person`**
`person_id (PK)` · `full_name` · `aliases[]` · `age` · `gender` · `address` · `socio_economic_tags[]` · `photo_ref (Stratus)`

**`fir_person_role`** *(many-to-many)*
`fir_id (FK)` · `person_id (FK)` · `role` ∈ {accused, victim, complainant, witness}

**`location`**
`location_id (PK)` · `name` · `type` · `latitude` · `longitude` · `district` · `urban_or_rural`

**`financial_account`**
`account_id (PK)` · `holder_person_id (FK)` · `bank` · `ifsc` · `account_type`

**`transaction`**
`txn_id (PK)` · `from_account (FK)` · `to_account (FK)` · `amount` · `timestamp` · `channel`

**`edge`** *(graph adjacency — also mirrored in NoSQL)*
`edge_id (PK)` · `src_type` · `src_id` · `dst_type` · `dst_id` · `edge_type` · `weight` · `evidence_fir_id (FK)`

**`offender_profile`**
`person_id (FK)` · `prior_case_count` · `mo_signature` · `risk_score` · `risk_band` ∈ {High, Medium, Low} · `updated_at`

**`conversation`** *(NoSQL)*
`conv_id (PK)` · `user_id` · `role` · `messages[]` · `created_at`

**`audit_log`**
`log_id (PK)` · `user_id` · `role` · `action` · `query_text` · `records_accessed[]` · `timestamp`

---

## 3. Conversational Request Flow

1. **User asks** (voice or text, EN/KN). Web Speech API transcribes voice; the request carries the auth token and the last N turns of context (from Cache).
2. **AppSail parses intent** with the LLM into a structured object: `{ intent, entities, filters, language }`. Zia Text Analytics assists with NER on named entities.
3. **Intent → query allowlist.** The intent maps to a **pre-defined, parameterized query template** — the model never emits or executes raw SQL. Role-based row filters (jurisdiction, sensitivity) are applied here.
4. **Retrieve** matching records from Data Store / NoSQL (RAG). For network/analytics intents, the graph or aggregation query runs.
5. **Compose answer.** The LLM writes a natural-language answer **in the user's language**, constrained to the retrieved records, and attaches:
   - `evidence[]` — the exact FIR IDs / record IDs used,
   - `reasoning[]` — the steps taken,
   - `confidence` — a qualitative indicator.
6. **Render.** The SPA shows the answer plus the appropriate visualization (graph / map / chart) and an **Evidence Trail** panel.
7. **Audit.** The query, records accessed, user, and role are written to `audit_log`; a Signal fans the event out.
8. **Context saved** to Cache (for follow-ups) and to `conversation` (NoSQL) for history and **PDF export** (rendered by AppSail, stored in Stratus, downloaded locally).

---

## 4. Explainable-AI Contract

Every engine response conforms to a fixed schema so the frontend can always render transparency:

```json
{
  "answer_text": "…",
  "language": "kn",
  "evidence": [{ "type": "fir", "id": "142/2025", "field": "narrative" }],
  "reasoning": ["Resolved 'the accused' to person P-3391 via FIR 142/2025",
                "Retrieved 4 prior FIRs linked to P-3391"],
  "confidence": "high",
  "visualization": { "type": "network", "ref": "graph:P-3391" }
}
```

No answer is shown without its `evidence` array — this is the guardrail against hallucinated or ungrounded claims.

---

## 5. ML Pipelines (QuickML)

- **Offender risk scoring** — classification pipeline over features: prior-case count, MO recurrence, network centrality, recency. Output: `risk_score` + `risk_band`, written back to `offender_profile`.
- **Crime forecasting (roadmap)** — regression / time-series over historical incident density by location + time window → predicted hotspots, consumed by scheduled early-warning jobs.

---

## 6. Security & Governance

- **Authentication & RBAC** via Catalyst Authentication; four roles with distinct data scopes.
- **Query allowlist** — no free-form SQL execution path exists; the LLM only selects and parameterizes vetted templates.
- **Audit trail** — complete, tamper-evident record of access.
- **Data minimization** — responses return only fields the role is permitted to see.
- **Synthetic data** in the prototype; production integration would follow the applicable state data-protection and law-enforcement governance frameworks.

---

## 7. Why Catalyst

The platform requirement ("deploy exclusively on Catalyst") is met natively rather than by hosting a generic stack on top of Catalyst:

- **AppSail** hosts the engine in managed Node/Python — no server management.
- **Zia OCR** already supports **Kannada and 9 other Indian languages**, directly serving the regional-language requirement.
- **QuickML** provides no-code ML for risk scoring and forecasting.
- **Data Store, NoSQL, Stratus, Cache, Authentication, Job Scheduling, Signals** cover every remaining backend need without external infrastructure.
