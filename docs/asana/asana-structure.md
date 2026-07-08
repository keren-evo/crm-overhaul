# Asana Structure — Link Homecare CRM Status Architecture Rebuild

**Version:** 2.1 · **Updated:** July 6, 2026  
**Logic:** Workstream-based dependency chain. **Jul 2026 meeting:** 5-stage pipeline agreed — finalize labels + flowcharts before Avi tech work.

**Meeting notes:** [`meeting-notes/2026-07-pipeline-alignment.md`](../meeting-notes/2026-07-pipeline-alignment.md) · **Glossary v2:** [`glossary-pipeline-v2.md`](../glossary-pipeline-v2.md)

Use this document to create the Asana project manually, or apply via [`asana-ai-apply.prompt.md`](asana-ai-apply.prompt.md) / import [`evo-crm-sprint-tasks.csv`](evo-crm-sprint-tasks.csv).

Machine-readable source: [`structure.json`](structure.json)

---

## Hierarchy overview

```
PROGRAM: Link Homecare — CRM Operating Model Rebuild
│
├── GOAL G1: Trustworthy census and pipeline reporting
├── GOAL G2: Clear lead-to-patient workflow for every team
├── GOAL G3: Clean data foundation for scalable growth
│
└── PROJECT: CRM Status Architecture Rebuild
    │
    ├── §1  Governance & Project Setup
    ├── §2  Business Definitions & Sign-Off          ← GATE: blocks build
    ├── §3  Current State & Data Baseline            ← can start after §1; full value after §2
    ├── §4  Target Architecture & Migration Design   ← after §2 signed
    ├── §5  CRM Build — Staging                      ← after §2 signed
    ├── §6  Data Remediation & QA                    ← after §5 + §3 baseline
    ├── §7  Dashboards & User Acceptance             ← after §6 validated
    ├── §8  Production Go-Live                       ← after §7 UAT
    ├── §9  Documentation, Training & NY Playbook     ← after §8
    └── §10 Growth Enablement                        ← after §8 + data trusted
```

### Dependency chain (milestones)

```
Sign Framework v1
    → Baseline complete
        → Staging build complete
            → Remediation validated
                → UAT passed
                    → Production live
                        → Growth enablement
```

---

## Program goals (Asana Goals — link to project)

| ID | Goal | Owner | Success metric |
|----|------|-------|----------------|
| G1 | Trustworthy census and pipeline reporting | Joel + Keren | True census ~1,200–1,300; ~1,960 authorized inflation removed from leadership views |
| G2 | Clear lead-to-patient workflow for every team | Angelo + Joel | Lead vs referral vs active patient identifiable in ≤3 seconds |
| G3 | Clean data foundation for scalable growth | Keren | Source, drop reason, conversion reporting reliable for campaigns |

---

## Project setup

| Field | Value |
|-------|-------|
| **Project name** | CRM Status Architecture Rebuild |
| **Description** | Paste from [`project-description.md`](project-description.md) |
| **Default view** | Board by Section, or Timeline for milestones |
| **Team members** | Keren, Joel, Avi, Angelo, Leah |

### Custom fields (create in Asana)

| Field | Type | Options |
|-------|------|---------|
| Workstream | Single-select | Governance, Definitions, Baseline, Architecture, Build, Remediation, Dashboards, Go-Live, Training, Growth |
| Decision Gate | Single-select | Yes, No |
| Blocker | Single-select | Yes, No |
| Requires Stakeholder Decision | Single-select | Yes, No |
| CRM Environment | Single-select | Discovery, Staging, Production |
| Effort | Single-select | S, M, L |
| Priority | Single-select | P0, P1, P2, P3 |
| Baseline / Target Metric | Text | e.g. ~1960 → 1200-1300 |

### Milestones (mark these 6 tasks as milestones)

1. Sign Status Framework v1
2. Baseline audit complete — all counts recorded
3. Staging build complete — picklists, UI, rules live
4. Remediation validated — census gap acceptable on staging
5. UAT passed — sales and ops sign-off
6. Production live — census gap closed

---

## §1 — Governance & Project Setup

*Purpose: Charter the program, assign roles, schedule decisions.*

| Task | Owner | Effort | P | Subtasks |
|------|-------|--------|---|----------|
| Confirm project charter and success criteria | Keren | S | P0 | Align on 3 program goals · Document non-negotiables · Link workspace doc |
| Confirm team roles and RACI | Keren | S | P0 | Keren / Joel / Avi / Angelo / Leah role definitions |
| Schedule definitions workshop (90 min) | Keren | S | P0 | Send pre-read · Confirm attendees · Facilitator guide · Decision worksheet |
| Establish change control rules | Keren | S | P0 | No prod changes pre-sign-off · Retain old fields · No dashboard switch until data validated · Manual review queues |

---

## Agreed pipeline (Jul 2026)

```
Lead → Qualifying → Referral in Progress → Active → Discharged
              Dropped Off (any time before Active)

Short-term care: parallel track (icon) → Active when authorized
Multi-LOB: per-LOB status chips alongside master pipeline
```

| Stage | Meaning |
|-------|---------|
| Lead | New contact |
| Qualifying | Lead in progress — eligibility being confirmed |
| Referral in Progress | Intake opened for a LOB |
| Active | Receiving service on ≥1 LOB |
| Discharged | No active LOBs; left agency |
| Dropped Off | Before Active — opt-out or failed qualification |

---

## §2 — Business Definitions & Sign-Off

*Purpose: Lock language, lifecycle, flowcharts. **Blocks Avi meeting and all CRM build.***

| Task | Owner | P | Decision? | Subtasks |
|------|-------|---|-----------|----------|
| Refine CRM glossary (living doc) | Keren | P0 | | Pipeline v2 terms · short-term track · retire Pre-Intake/Closed/Converted |
| **Finalize patient status labels and lifecycle flowcharts** | Keren | P0 | **Yes** | Main + short-term + multi-LOB wireframes · **Joel → Avi → Hillel sign-off** |
| Confirm master lifecycle model (Jul 2026 alignment) | Joel | P0 | **Yes** | 5-stage pipeline agreed · map to Nexus at Avi meeting |
| Confirm layer separation model | Keren | P0 | **Yes** | Master pipeline + LOB + intake + auth + Medicaid + outcome |
| Resolve edge case decision log | Joel | L | P0 | **Yes** | NIA ~180-day wait · multi-LOB · CDPAP · Girling · return patient |
| Confirm census definition | Joel | S | P0 | **Yes** | Active + valid auth + SOC |
| Simplify drop reasons to ~10 categories | Keren | S | P0 | **Yes** | Draft in glossary v2 · Joel signs |
| Joel: Confirm NIA re-application waiting period | Joel | S | P0 | | 180-day confirm · appeals · follow-up bucket |
| Document short-term care integration rules | Keren | M | P0 | | Icon UI · parallel statuses · promote to Active when authorized |
| Document LOB eligibility criteria matrix | Joel | M | P0 | | MLTC · Custodial · Short-term · NHTD/OPWDD/Private Pay |
| Export and sign off ReferralOutcome picklist | Avi | S | P0 | **Yes** | After ~10 drop reasons finalized |
| **🏁 Sign Status Framework v1** | Keren | S | P0 | **Yes** | Compile artifacts · Joel → Avi → Leah coordinates → Hillel (CEO) final · unlocks CRM build |

### §1 additions (from meeting)

| Task | Owner | P |
|------|-------|---|
| Joel: Schedule CRM implementation review with Avi's team | Joel | P0 |
| Leah: Follow-up and coordinate Avi meeting scheduling | Leah | P0 |

---

## §3 — Current State & Data Baseline

*Purpose: Measure how much the CRM is lying today.*

| Task | Owner | Effort | P | Subtasks |
|------|-------|--------|---|----------|
| Schema Manager object inventory | Keren | M | P0 | Episode · Patient · Intake · Authorization · Shared LeadStatus objects |
| Map Nexus objects to audit queries | Avi | M | P0 | Retarget audit SQL · Query Console equivalents · Baseline template |
| Run distribution baselines | Avi | M | P0 | Episode.status · leadStage · Converted review · baseStatus STRING |
| Run integrity baselines — critical cohorts | Keren | L | P0 | Orphan authorized · Auth+dropped intake · Active no auth · CDPAP · Girling · Pre-intake/closed · Multi-intake · Short-term-only · Stale SOC · 12mo stale · Medicaid deferred |
| Record census gap baseline | Keren | S | P0 | ~1960 vs ~1200-1300 · Gap ~760 · Top 3 drivers |
| Export manual review batch IDs | Avi | S | P1 | Converted · Active no auth · Discharged never active · Dropped was active |
| **🏁 Baseline audit complete** | Keren | S | P0 | Fill audit matrix · Review with Joel · **Unlock Remediation** |

---

## §4 — Target Architecture & Migration Design

*Purpose: Build-ready specs for Avi — after Framework v1 signed.*

| Task | Owner | Effort | P | Subtasks |
|------|-------|--------|---|----------|
| Finalize status architecture tables | Keren | M | P0 | Lifecycle transitions · Referral rules · Intake per LOB · Auth validity · Invalid transitions |
| Complete old-to-new status mapping | Keren | M | P0 | Episode migration · LeadStatus · Patient legacy · Safe/conditional/manual/deprecate · Update nexus-episode-status-map.json |
| Define required field matrix | Keren | M | P0 | Per-status required fields · Map to validation-rules.ts |
| Draft dashboard logic spec | Keren | M | P1 | Leadership · Intake · Ops · Growth views |
| Publish Implementation Brief for Avi | Keren | M | P0 | Picklists · UI · Validation · Migration safety · Rollback · Open tech questions |

---

## §5 — CRM Build — Staging

*Purpose: Picklists, UI, rules, automations in staging only.*

| Task | Owner | Effort | P | Subtasks |
|------|-------|--------|---|----------|
| Episode picklist rebuild | Avi | M | P0 | 3-value EpisodeStatus · Deprecate legacy · Rename LeadStatus · Retire Converted |
| Authorization picklist migration | Avi | M | P0 | Replace baseStatus STRING · Map values · Link to LOB timeline |
| Episode UI updates | Avi | L | P0 | Progress bar · Sub-status chip · Conditional leadStage · Outcome modal · Hide legacy Patient fields |
| Validation rules — blocking saves | Avi | M | P0 | Outcome required · Discharge rules · leadStage cleared · LOB drop confirm |
| Automations | Avi | L | P0 | Auth save recalc (Ntelekos) · Nightly expiry · NIA fail hold · SOC → Active · SLA timers |
| **🏁 Staging build complete** | Avi | S | P0 | Demo to Keren + Joel · **Unlock Remediation execution** |

---

## §6 — Data Remediation & QA

*Purpose: Clean staging data; validate before dashboards.*

| Task | Owner | Effort | P | Subtasks |
|------|-------|--------|---|----------|
| Build staging migration script | Avi | L | P0 | nexus-episode-status-map.json · Safe → conditional → manual review |
| Migrate Episode statuses | Avi | M | P0 | New/Lead/Converted/On Hold → Referral · Dropped → Dropped Off · Active sub-status · Discharged backfill |
| Remediate legacy Patient picklists | Avi | M | P0 | pre-intake → hold · closed split · remove person-level authorized |
| Run specialty remediation batches | Avi | L | P0 | CDPAP · Girling · Orphan authorized · Voided/dropped intakes · leadStage None/Converted |
| Re-run baselines on staging | Keren | M | P0 | Compare to baseline · Document exceptions · Orphan authorized → 0 |
| Ops review — 50 remediated records | Joel | M | P0 | Sample LOBs and edge cases · Confirm operational truth |
| **🏁 Remediation validated** | Avi | S | P0 | Joel ops acceptance · **Unlock Dashboards** |

---

## §7 — Dashboards & User Acceptance

*Purpose: Rebuild reporting on clean data; validate with users.*

| Task | Owner | Effort | P | Subtasks |
|------|-------|--------|---|----------|
| Rebuild Leads / Referral list view | Avi | M | P0 | Granular leadStage · Intake date · LOB filter · Hide irrelevant drops |
| Rebuild leadership widgets | Avi | M | P0 | True census · Authorized pipeline · Non-authorized risk · Referral funnel |
| Rebuild ops queues | Avi | M | P1 | Expiring auth · Stale SOC · Missing fields · Multi-LOB conflicts |
| Rebuild growth / funnel reporting | Avi | M | P2 | Outcome by source · Conversion · Geography |
| QA — zero orphan authorized on census widget | Avi | S | P0 | Run query · 0 violations · Document exceptions |
| Sales UAT — Angelo | Angelo | M | P0 | ≤3 second identification · Funnel granularity · Drop reasons visible |
| Ops UAT — Joel + intake | Joel | M | P0 | NIA hold · Auth recalc · LOB drop vs discharge |
| **🏁 UAT passed** | Keren | S | P0 | Written sign-off · **Unlock Go-Live** |

---

## §8 — Production Go-Live

*Purpose: Cut over with safety controls and monitoring.*

| Task | Owner | Effort | P | Subtasks |
|------|-------|--------|---|----------|
| Final go/no-go review | Keren | S | P0 | Staging gap OK · Rollback plan · Comms sent · Decision recorded |
| Schedule and communicate migration window | Leah | S | P0 | Announce · Day-1 changes · Support channel |
| Execute production remediation batch | Avi | L | P0 | Run script · Manual review queue · Sample verification |
| Enable production rules and automations | Avi | M | P0 | Validation · Auth recalc · Expiry alerts · SLAs |
| Switch production dashboards and list views | Avi | M | P0 | New census · New Leads list · Hide legacy authorized · Archive old dashboards |
| Post-cutover census validation | Keren | S | P0 | Re-run gap audit · Compare to baseline |
| **🏁 Production live** | Avi | S | P0 | Leadership briefed · Begin hypercare |
| Hypercare monitoring (2 weeks) | Avi | M | P1 | Auth recalc · SLA false positives · Daily check-ins · Defect triage |

---

## §9 — Documentation, Training & NY Playbook

*Purpose: Make the new model stick.*

| Task | Owner | Effort | P | Subtasks |
|------|-------|--------|---|----------|
| Publish NY Status Framework v1 (canonical) | Keren | M | P1 | Glossary · Per-team quick refs · Edge cases · Teams + repo |
| Update department playbooks | Joel | L | P1 | Intake · Sales · Ops · Angela playbook |
| Conduct team training sessions | Keren | M | P1 | Sales 30m · Intake 45m · Ops 30m · Record sessions |
| Deprecate legacy fields (write-block only) | Avi | M | P2 | Write-block legacy values · Hide Patient picklists · Plan intake field reduction |
| Florida delta checklist | Keren | M | P3 | NY vs FL differences · LeadTrap note · FL effort estimate |

---

## §10 — Growth Enablement

*Purpose: Connect growth systems only after CRM logic is trustworthy.*

| Task | Owner | Effort | P | Subtasks |
|------|-------|--------|---|----------|
| Confirm growth readiness prerequisites | Keren | S | P2 | Source standardized · Outcomes populated · Conversion validated |
| UTM and campaign attribution standards | Keren | M | P2 | UTM params · Map to Episode source · Naming convention |
| Website forms → CRM integration audit | Avi | M | P2 | New Referral landing · Source preserved · E2E test |
| LeadTrap / Ava integration | Keren | L | P3 | Bot → sub-status · Drop reasons · Conversion reporting |
| Meta / paid social attribution | Keren | M | P3 | Campaign IDs · Drop by campaign · Retargeting rules |
| Referral partner tracking | Keren | M | P2 | referral_partner field · Partner conversion · Geography |
| Growth dashboard — qualified referral → active | Avi | M | P2 | Cohort conversion · Drop by source/LOB · Monthly review template |

---

## Saved views (recommended)

| View | Filter |
|------|--------|
| **This week** | Due this week · Incomplete · Group by Section |
| **Decision gates** | Decision Gate = Yes OR Requires Stakeholder Decision = Yes |
| **Blocked** | Blocker = Yes · Incomplete |
| **Keren** | Assignee = Keren |
| **Avi — build** | Assignee = Avi · Workstream in Build, Remediation, Dashboards, Go-Live |
| **Joel — ops** | Assignee = Joel · Requires Stakeholder Decision = Yes |
| **Go-live day** | Section = Production Go-Live · Incomplete · Sort by dependency |
| **Growth (later)** | Workstream = Growth |

---

## Task count summary

| Section | Tasks | Milestones |
|---------|-------|------------|
| §1 Governance | 6 | — |
| §2 Definitions | 12 | Sign Framework v1 |
| §3 Baseline | 7 | Baseline complete |
| §4 Architecture | 5 | — |
| §5 Build | 6 | Staging build complete |
| §6 Remediation | 7 | Remediation validated |
| §7 Dashboards & UAT | 8 | UAT passed |
| §8 Go-Live | 8 | Production live |
| §9 Training | 5 | — |
| §10 Growth | 7 | — |
| **Total** | **71 tasks** | **6 milestones** |

---

## How to apply in Asana

1. Create project **CRM Status Architecture Rebuild**
2. Paste [`project-description.md`](project-description.md) into project description
3. Link 3 program goals to the project
4. Create 10 sections (§1–§10 names above)
5. Create 6 custom fields
6. Import [`evo-crm-sprint-tasks.csv`](evo-crm-sprint-tasks.csv) **or** run [`asana-ai-apply.prompt.md`](asana-ai-apply.prompt.md)
7. Mark 6 milestone tasks
8. Wire dependencies per chain above
9. Pin saved views: Decision gates, Blocked, This week
