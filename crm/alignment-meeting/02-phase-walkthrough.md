# Phase Walkthrough (0–7)

I've drafted this phased plan in Asana based on discovery. I'm still learning your processes — **please edit phases, tasks, and dependencies freely.** Phase 2+ stays blocked until Phase 0 is signed, but we're here to shape Phase 0 and validate the rest.

***

## Why phases exist

| Principle               | Meaning                                                                            |
| ----------------------- | ---------------------------------------------------------------------------------- |
| **Decide before build** | Phase 0 locks business definitions so engineering doesn't encode wrong assumptions |
| **Measure before fix**  | Phase 1 baselines the mess so we can prove remediation worked                      |
| **Staging first**       | Phases 2–5 on staging; production only after UAT                                   |
| **One source of truth** | Lifecycle computed from intake/auth data — not legacy tags                         |

**Hard rule (proposed):** No Phase 2+ until **Status Framework v1** is signed.

***

## Phase 0 — Stakeholder Sign-Off

**Purpose:** Lock business definitions before any schema or data changes.

| Item                    | Detail                                                                     |
| ----------------------- | -------------------------------------------------------------------------- |
| **Workshop topics**     | dropped off vs discharged vs voided vs deferred vs authorized vs SOC dates |
| **LOB checklists**      | LTC, NHTD, OPWDD, private pay                                              |
| **Short-term rule**     | Lead loss unless gold LOB open; hidden from sales dashboard                |
| **NIA fail (proposed)** | 6-month ON\_HOLD, then re-engage                                           |
| **CDPAP**               | Remediation approach post-April 2025 sunset                                |
| **Census**              | Billing vs EVV vs CRM service episodes — which is truth?                   |
| **Deliverable**         | Signed Status Framework v1                                                 |
| **Owners**              | Keren (framework), Joel (operational truth)                                |
| **Gates**               | Everything in Phase 1+                                                     |

### PAUSE — collect edits (10 min)

Ask: *"What's missing from Phase 0? What decisions belong here vs later?"*

Capture in [`03-decision-worksheet.md`](03-decision-worksheet.md) and Asana Phase 0 section.

***

## Phase 1 — Access & Baseline Audit

**Purpose:** Read-only discovery + SQL audit to quantify data integrity problems.

| Item                | Detail                                                                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Activities**      | Schema Manager audit; map tables to [`data-integrity-audit.sql`](../audit/data-integrity-audit.sql); run audit on staging/replica |
| **Baselines**       | Orphan authorized, CDPAP queue, pre-intake/closed counts, multi-intake conflicts, census gap, stale anticipated SOC               |
| **Deliverable**     | All baseline counts in project doc                                                                                                |
| **Owners**          | Keren (audit), Avi (SQL/DB access)                                                                                                |
| **Gates**           | All Phase 2 tasks                                                                                                                 |
| **CRM bot prompts** | [`crm-bot-discovery.prompt.md`](../crm-bot-discovery.prompt.md)                                                                   |

### PAUSE — collect edits (5 min)

Ask: *"Are we measuring the right things? Any baseline ops/sales care about that's missing?"*

***

## Phase 2 — Schema Design (Staging)

**Purpose:** New picklists, enums, field structure in staging — no production changes.

| Item                | Detail                                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Key work**        | Import [`enums.json`](../schema/enums.json); add `lifecycle_stage`; hide legacy tags; normalize dates; `person_stage_history`                                      |
| **Owners**          | Avi (build), Keren (review vs Framework v1)                                                                                                                        |
| **Proposed stages** | `LEAD_NEW` → `LEAD_CONTACTING` → `REFERRAL_ACTIVE` → `INTAKE_IN_PROGRESS` → `ON_HOLD` → `AUTHORIZED_PENDING_SOC` → `PATIENT_ACTIVE` → `DROPPED_OFF` / `DISCHARGED` |

Ask: *"Do stage names match how staff talk? Is ON\_HOLD acceptable?"*

***

## Phase 3 — Data Remediation (Staging)

**Purpose:** Batch-fix legacy data on staging using signed mapping.

| Item            | Detail                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------- |
| **Key work**    | pre-intake → ON\_HOLD; closed → DROPPED\_OFF/DISCHARGED; CDPAP batch; orphan authorized downgrade |
| **Deliverable** | Staging remediation validated — ops sign-off on 50-record sample                                  |
| **Owners**      | Avi (scripts), Joel + ops (sign-off), Keren (validation)                                          |
| **Gates**       | All Phase 4 tasks                                                                                 |

***

## Phase 4 — Validation & Automation (Staging)

**Purpose:** Block bad data re-entry; automate lifecycle computation.

| Item                | Detail                                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Key work**        | Blocking rules from [`validation-rules.ts`](../schema/validation-rules.ts); `computeLifecycleStage`; SLA timers |
| **SLAs (proposed)** | Lead 24h · follow-up 3d · referral→intake 7d · authorized→SOC 14d                                               |
| **Owner**           | Avi                                                                                                             |
| **Gates**           | Phase 5 (after SLA timers)                                                                                      |

Ask: *"Are SLAs realistic? Any rule that blocks legitimate workflows?"*

***

## Phase 5 — Dashboard Rebuild + UAT

**Purpose:** One glance = lead, referral, or patient. **UAT** = sales and ops test on staging before go-live.

| Item         | Detail                                                                                                                     |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| **Key work** | [`dashboard-queries.sql`](../audit/dashboard-queries.sql); sales view (gold LOBs only); true census widget; funnel leakage |
| **UAT**      | Angelo (sales) + ops leads — pass = no multi-click drill-down                                                              |
| **Gates**    | All Phase 6 tasks                                                                                                          |

Ask: *"What columns/filters does each role need on day one?"*

***

## Phase 6 — Production Cutover

**Purpose:** Go live with communicated migration window.

| Item         | Detail                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------- |
| **Key work** | Production remediation; enable rules + computed stage; switch dashboards; re-run audit §9 |
| **Owners**   | Avi (cutover), Leah (comms), Keren (post-cutover audit)                                   |
| **Gates**    | Phase 7                                                                                   |

***

## Phase 7 — Cleanup & Florida Handoff

**Purpose:** Field deprecation; NY canonical playbook; FL delta later.

| Item         | Detail                                                                       |
| ------------ | ---------------------------------------------------------------------------- |
| **Key work** | Intake fields 121 → \~40; publish Status Framework v1 playbook; FL checklist |
| **Owners**   | Avi + Keren (deprecation), Joel (playbook)                                   |

***

## Ongoing — Discovery (parallel)

Runs alongside Phase 0–1. No production changes.

* CRM bot / Schema Manager discovery ([`crm-bot-discovery.prompt.md`](../crm-bot-discovery.prompt.md))

* Open questions log until Phase 0 closed

* Joel playbooks → feed Framework v1

**Confirm in meeting:** Admin access, Teams rename, Angela playbook — done per discovery notes?

***

## Milestone chain

| # | Milestone                        | Blocks      |
| - | -------------------------------- | ----------- |
| 1 | Status Framework v1 signed       | All Phase 1 |
| 2 | Baseline audit complete          | All Phase 2 |
| 3 | Staging remediation validated    | All Phase 4 |
| 4 | UAT passed                       | All Phase 6 |
| 5 | Census gap closed (post-cutover) | All Phase 7 |

***

## Proposed roles (validate now)

| Person     | Scope                                         |
| ---------- | --------------------------------------------- |
| **Keren**  | Phase 0–1, framework sign-off, discovery, UAT |
| **Avi**    | Phase 2–4, Phase 6 cutover                    |
| **Joel**   | Phase 0 workshops, playbooks, ops sign-off    |
| **Leah**   | Migration comms, Teams                        |
| **Angelo** | Phase 5 sales UAT                             |

