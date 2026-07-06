# Meeting Notes — Patient Status Pipeline Alignment

**Date:** July 2026 (post–definitions workshop)  
**Captured by:** Keren  
**Attendees (referenced):** Joel Schlanger, Leah Adelman, Keren, enrollment specialists  
**CRM implementation lead:** Avi  
**Status:** Operational consensus reached — **labels and flowcharts must be finalized before Avi/tech implementation**

---

## Agreed master pipeline (main status bar)

```
Lead → Qualifying → Referral in Progress → Active → Discharged
                              │
                    Dropped Off (any time before Active)
```

| Stage | Definition | Who updates |
|-------|------------|-------------|
| **Lead** | New contact; not yet in qualification | Enrollment / case managers |
| **Qualifying** | Lead in progress — contact, insurance, diagnosis, LOB eligibility being confirmed | Enrollment specialists |
| **Referral in Progress** | Intake opened; patient being processed for a specific LOB. Replaces ambiguous "in progress" / "intake" labels | Enrollment specialists |
| **Active** | Patient receiving service under at least one LOB | Ops / enrollment |
| **Discharged** | No active LOBs remain; patient left agency entirely | Ops |
| **Dropped Off** | Opted out or failed qualification before becoming Active | Enrollment specialists |

**Consensus:** Strong agreement on this flow. Reduces confusion vs legacy Salesforce-era labels.

---

## Short-term care — parallel dimension (not main status bar)

Short-term care runs **parallel** to the main pipeline until authorized.

| Short-term stage | Meaning |
|------------------|---------|
| In Progress | Referral from nursing home discharge planner being worked |
| Accepted | CHHA agrees to take patient; hours may be limited |
| Startup | Pre-service setup |
| Authorized | Actively receiving short-term services |

**UI rule (agreed):** Show short-term status via a **distinct icon** — not the main status bar — until authorized.  
**Integration rule:** Once short-term **authorized**, patient becomes **Active** in main pipeline.  
**Source:** Primarily nursing home discharge planners.  
**Duration:** Typically 2 weeks – 3 months (nursing, PT, HHA).

If not authorized, main status may remain Dropped Off or Discharged — short-term activity does not inflate main pipeline metrics.

---

## Multi-dimensional view (LOB + intake)

- Patients can have **multiple simultaneous** referral or active statuses across LOBs.
- System must show which services are active, in progress, dropped, or pending **per LOB**.
- Intake status and LOB detail sit **under** the master pipeline — not as duplicate top-level language.

---

## LOB eligibility criteria (agreed direction)

| LOB | Eligibility (summary) |
|-----|------------------------|
| **MLTC / Long-Term Care** | Medicaid + qualifying diagnosis (e.g. dementia, brain injury) |
| **Custodial Care** | Medicaid + developmental delay diagnosis |
| **Short-Term Care** | Skilled nursing need + Medicare/Medicaid |
| *(NHTD, OPWDD, Private Pay)* | Document in Joel's checklists — not fully captured in this session |

**Workflow:** Enrollment confirms eligibility at **Qualifying** and **Referral in Progress** before opening intakes.

**Planned enhancement:** Dynamic UI to "light up" eligible LOBs as insurance + diagnosis entered (Joel confirmed as future improvement).

---

## NIA process

| Item | Decision / note |
|------|-----------------|
| What | Mandatory 2-appointment state assessment for MLTC / long-term care |
| Pass | → MLTC enrollment path |
| Fail | → Dropped Off unless alternate LOB applies |
| Appeals | No limit on appeals |
| Re-application wait | **~180 days** — Joel to confirm exact period |
| CRM need | Track NIA outcomes; filter failed cases for follow-up bucket after wait |

---

## Drop reasons

- Current picklist **too long and confusing**.
- **Target: ~10 clear categories** for filtering and reporting.
- Keren + Joel to draft simplified list before tech implementation.

---

## CRM implementation strategy (agreed)

| Rule | Detail |
|------|--------|
| **Gate** | Finalize status labels + flowcharts **before** CRM field updates and backfill |
| **CRM org work** | On hold until labels agreed (Leah confirmed) |
| **Next step** | Joel coordinates review meeting with **Avi's** tech team |
| **Approach** | **One-pass** update: new pipeline + filtering + backfill together |
| **Dashboards** | Segment by status, NIA results, priority; enrollment specialist views |

---

## Action items

| Owner | Action |
|-------|--------|
| **Keren** | Continue refining glossary and terminology doc; incorporate these notes |
| **Team** | Finalize patient status labels and flowcharts (blocks tech) |
| **Joel** | Coordinate with Avi — schedule CRM implementation review with tech team |
| **Leah** | Follow-up via chat; coordinate scheduling with Avi's team after labels finalized |
| **Joel** | Confirm NIA re-application waiting period (180 days?) |
| **Keren + Joel** | Draft ~10 standardized drop reason categories |
| **Enrollment specialists** | Use updated dashboards/filters when implemented (NIA, qualifying, dropped cases) |

---

## Open items for Avi meeting

1. Map agreed 5-stage pipeline to Nexus Episode fields vs new computed display field
2. Short-term care icon + parallel status object model
3. Multi-LOB simultaneous status UI (per-LOB chips vs timeline)
4. NIA outcome fields and failed-NIA follow-up queue (180-day hold automation?)
5. LOB eligibility "light up" — phase 1 vs phase 2
6. One-pass migration plan: picklists + backfill + dashboard filters

---

## Reconciliation with prior Nexus draft

| Prior draft | This meeting |
|-------------|--------------|
| Referral → Active → Discharged (3-stage) | **Lead → Qualifying → Referral in Progress → Active → Discharged** (5-stage) |
| leadStage: New / In Progress / Dropped Off | **Qualifying** is explicit stage; **Referral in Progress** replaces "In Progress" |
| Short-term = lead loss unless gold LOB | Short-term = **parallel track** with icon; enters Active when authorized |
| NIA fail → 6-month hold | **~180-day** wait before re-application (confirm with Joel) |

**Implementation note:** Business layer follows this meeting. Technical mapping to Episode.status is an **Avi meeting deliverable** — do not build until flowcharts signed.
