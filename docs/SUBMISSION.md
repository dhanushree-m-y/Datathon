# Submission — Drishti (ದೃಷ್ಟಿ)

**Event:** KSPH26 / Datathon 2026 · **Track:** Intelligent Conversational AI & Crime Analytics Platform
**Submission portal:** <https://hack2skill.com/event/datathon2026>

> Fill the bracketed `[ … ]` placeholders before final submission. All narrative content below is ready to paste into the official submission template.

---

## 1. Prototype Brief

**Solution name:** Drishti (ದೃಷ್ಟಿ) — Conversational Crime Intelligence & Analytics Platform.

**Problem statement addressed**
State crime databases hold enormous investigative value that is trapped behind SQL, dashboards, and language barriers. Investigators cannot query data the way they think; hidden relationships between accused, victims, locations, financial accounts, and modus operandi stay invisible; insights are neither explainable nor auditable; and non-English-speaking field officers are excluded. Drishti makes the crime database **conversational, visual, explainable, and multilingual**.

**Key features & functionalities**
1. **Conversational Crime Intelligence** — NL chatbot over FIRs, accused, victims, locations, and criminal history; **English + Kannada**; **voice Q&A**; context-aware follow-ups; **export conversation to PDF**.
2. **Criminal Network & Relationship Analysis** — interactive graph of accused ↔ victims ↔ locations ↔ financial accounts ↔ incidents; repeat-offender and organized-crime cluster detection.
3. **Crime Pattern & Trend Analytics** — trends by time/geography/type/MO; hotspot map; seasonal and emerging-cluster analysis.
4. **Criminology-Based Offender Profiling** — repeat-offender identification, behavioral/MO profiling, and **AI risk scoring** to prioritize investigation.
5. **Explainable AI (cross-cutting)** — every answer cites the FIR IDs, records, and reasoning used, with a confidence indicator.
6. **Role-Based Access & Governance (cross-cutting)** — Investigator / Analyst / Supervisor / Policymaker roles, row-level access, full audit log.

**Technology stack** — **cross-platform front end, Catalyst-native back end**: React (Vite) web app on Web Client Hosting + a React Native mobile app (iOS + Android); Catalyst Authentication (RBAC); AppSail (conversational engine, Node/Python); Zia OCR + Text Analytics (Kannada + Indian-language OCR, NER); Data Store + NoSQL + Stratus + Cache; QuickML (risk scoring / forecasting); Serverless Functions + Job Scheduling (early warning); Signals (audit). LLM API called server-side from AppSail for language understanding.

**Proposed impact & use case** — Cuts investigation time from hours to a single spoken question; surfaces hidden networks, hotspots, and repeat-offender clusters; enables proactive, preventive policing via risk scoring and forecasting; puts the database in every field officer's hands through Kannada and voice; and remains accountable through evidence trails and audit logs. Primary users: investigating officers, crime analysts, supervisors, and policymakers.

*(Full brief: [`PROTOTYPE_BRIEF.md`](PROTOTYPE_BRIEF.md). Architecture: [`ARCHITECTURE.md`](ARCHITECTURE.md).)*

---

## 2. Public GitHub Repository Link

`[ https://github.com/<your-org>/drishti-crime-intel ]`

The repository contains complete source code, README documentation, and setup/execution instructions.
Ensure repository visibility is set to **Public** before submission.

---

## 3. Demo Video Link

`[ https://youtu.be/<unlisted-id>  — or —  https://drive.google.com/<public-share-link> ]`

The demo video showcases:
- **Problem statement overview**
- **Working prototype demonstration** — a live conversation (English + Kannada, voice), the network graph, the hotspot map, and offender risk scoring
- **Key functionalities & workflows** — including the explainability evidence trail and role-based access

Set access to **Unlisted (YouTube)** or **public/anyone-with-link (Google Drive)**.

---

## 4. Deployed Solution Link (Catalyst — mandatory)

`[ https://<your-project>.catalystserverless.com ]`

Deployed **exclusively on the Zoho Catalyst platform** as required for evaluation
(promotion: <https://catalyst.zoho.com/promotions.html?cn=KSPH26>).

**Demo credentials** *(synthetic environment)*
| Role | Username | Password |
|---|---|---|
| Investigator | `[ … ]` | `[ … ]` |
| Analyst | `[ … ]` | `[ … ]` |
| Supervisor | `[ … ]` | `[ … ]` |
| Policymaker | `[ … ]` | `[ … ]` |

---

## 5. Submission Checklist

- [ ] Prototype brief completed (section 1)
- [ ] GitHub repository is **public** and link added (section 2)
- [ ] README with setup & execution instructions present in the repo
- [ ] Demo video uploaded, access verified, link added (section 3)
- [ ] Solution deployed on **Catalyst**, live link verified, link added (section 4)
- [ ] Demo credentials for each role tested and added (section 4)
- [ ] Submitted via the **official hack2skill submission template**
- [ ] Confirmed prototype uses **synthetic data only**

---

## 6. Team Details

| Field | Value |
|---|---|
| Team name | `[ … ]` |
| Team lead | `[ … ]` |
| Members | `[ … ]` |
| Contact email | `[ … ]` |
| Submission ID | `69d9ddd216edfa8a2154893d` |
