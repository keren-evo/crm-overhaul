# Decision Worksheet — Alignment Meeting

**Facilitator:** Keren · **Fill during meeting** · **Owner for capture:** Keren (sync to Asana same day per [`04-post-meeting-asana-sync.md`](04-post-meeting-asana-sync.md))

Mark each decision **Agreed** / **Deferred** / **Rejected** and note the outcome.

---

## Decision 1 — Phased structure

| Field | Value |
|-------|-------|
| **Question** | Approve Phases 0–7 + Ongoing as proposed, or restructure? |
| **Proposal** | 0 Sign-off → 1 Baseline → 2 Schema → 3 Remediation → 4 Validation → 5 Dashboards/UAT → 6 Cutover → 7 Cleanup |
| **Status** | ☐ Agreed ☐ Deferred ☐ Rejected |
| **Outcome** | |
| **Changes requested** | |
| **Decided by** | |
| **Date** | |

---

## Decision 2 — Phase 0 workshop

| Field | Value |
|-------|-------|
| **Question** | When is the definitions workshop, and who attends? |
| **Proposal** | See [`05-phase0-workshop.md`](05-phase0-workshop.md) — Joel + ops leads + Keren + Avi |
| **Status** | ☐ Agreed ☐ Deferred ☐ Rejected |
| **Workshop date/time** | |
| **Attendees** | |
| **Out of scope for workshop** | |

---

## Decision 3 — NIA fail rule

| Field | Value |
|-------|-------|
| **Question** | Patient fails NIA and must wait ~6 months — what status? |
| **Proposal** | `ON_HOLD` with `hold_reason=NIA_FAILED`, `hold_until_date` = 6 months; then re-engage |
| **Status** | ☐ Agreed ☐ Deferred ☐ Rejected |
| **Outcome** | |
| **Alternative (if rejected)** | |
| **Maps to** | Phase 0 task: Confirm NIA fail rule |

---

## Decision 4 — Short-term-only rule

| Field | Value |
|-------|-------|
| **Question** | How do we treat short-term custodial when no gold LOB is open? |
| **Proposal** | Lead loss; person stage capped at `REFERRAL_ACTIVE`; hidden from sales dashboard |
| **Status** | ☐ Agreed ☐ Deferred ☐ Rejected |
| **Outcome** | |
| **Exception cases** | |
| **Maps to** | Phase 0 task: Confirm short-term rule |

---

## Decision 5 — CDPAP cohort

| Field | Value |
|-------|-------|
| **Question** | Post–April 1, 2025 CDPAP sunset — discharge, drop, or archive? |
| **Context** | ~$125M revenue line eliminated; cohort may still show authorized |
| **Status** | ☐ Agreed ☐ Deferred ☐ Rejected |
| **Outcome** | |
| **Remediation approach** | |
| **Maps to** | Phase 0 task + Phase 3 CDPAP batch |

---

## Decision 6 — Census definition

| Field | Value |
|-------|-------|
| **Question** | What is the source of truth for "active patient" / true census? |
| **Options** | ☐ Billing ☐ EVV ☐ CRM service episodes ☐ Hybrid (specify) |
| **Status** | ☐ Agreed ☐ Deferred ☐ Rejected |
| **Outcome** | |
| **Target number to reconcile to** | ~1,200–1,300 |
| **Maps to** | Phase 0 task: Confirm census definition; audit §9 |

---

## Decision 7 — Dependencies

| Field | Value |
|-------|-------|
| **Question** | Is Phase 1 blocked until Framework v1 signed, or can discovery/audit run in parallel? |
| **Proposal** | Phase 1 **blocked** until Phase 0 milestone; Ongoing discovery runs in parallel |
| **Status** | ☐ Agreed ☐ Deferred ☐ Rejected |
| **Outcome** | |
| **Dependency changes** | |
| **Maps to** | [`dependencies.json`](../asana/dependencies.json) |

---

## Additional decisions captured (open floor)

| # | Topic | Outcome | Owner | Phase |
|---|-------|---------|-------|-------|
| 8 | | | | |
| 9 | | | | |
| 10 | | | | |

---

## Open questions → Phase 0 backlog

Carry unresolved items from [discovery notes](../discovery/1-1-CRM-Discovery-Session.md):

| Open question | Assigned to | Target resolution |
|---------------|-------------|-------------------|
| closed vs dropped off vs discharged | Joel | Phase 0 workshop |
| pre-intake audit — eliminate? | Keren + Avi | Phase 0 + Phase 3 |
| authorized without valid auth object | Avi | Phase 1 baseline + Phase 4 rules |
| anticipated SOC vs SOC date | Joel | Phase 0 workshop |
| LOB coexistence master status | Joel | Phase 0 workshop |
| voided vs dropped on intake | Joel | Phase 0 workshop |
| deferred on Medicaid ticket | Joel | Phase 0 workshop |

---

## Sign-off block (end of meeting)

| Role | Name | Aligned on phased plan? | Notes |
|------|------|-------------------------|-------|
| Framework | Keren | ☐ | |
| Operations | Joel | ☐ | |
| CRM implementation | Avi | ☐ | |
| Comms | Leah | ☐ | |
| Sales UAT | Angelo | ☐ | |

**Next action owner for Asana sync:** _______________  
**Due:** Same day as alignment meeting
