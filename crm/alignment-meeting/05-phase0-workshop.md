# Phase 0 — Definitions Workshop

**Purpose:** Lock business definitions before Phase 1 baseline audit and any Phase 2+ implementation.  
**Output:** Status Framework v1 (signed document → Phase 0 milestone)

---

## Schedule (fill after alignment meeting)

| Field | Value |
|-------|-------|
| **Proposed duration** | 90 minutes |
| **Date** | _______________ |
| **Time** | _______________ |
| **Location / link** | _______________ |
| **Scheduled by** | Keren |
| **Calendar sent** | ☐ |

---

## Calendar invite — copy-paste

**Title:** CRM Status Overhaul — Phase 0 Definitions Workshop

**Description:**

```
We're locking business definitions for the CRM Status Label Overhaul before any schema or data changes.

Agenda:
1. Terminal states: dropped off vs discharged vs voided vs deferred
2. Authorization vs lifecycle stage (authorized is NOT a person status)
3. SOC dates: anticipated vs confirmed start of care
4. LOB rules: gold LOBs, short-term-only, multi-intake master status
5. NIA fail / on-hold approach
6. CDPAP post-sunset remediation
7. Census definition (billing vs EVV vs CRM)
8. LOB qualification checklists (LTC, NHTD, OPWDD, private pay)

Pre-read:
- Discovery notes (Teams / repo)
- Decision worksheet from alignment meeting

Deliverable: Status Framework v1 draft for sign-off

Facilitator: Joel (operational truth) + Keren (framework)
```

**Required attendees:**

| Name | Role | RSVP |
|------|------|------|
| Joel | Operational definitions, facilitator | ☐ |
| Keren | Framework author, facilitator | ☐ |
| Avi | CRM feasibility / Schema Manager | ☐ |
| Ops lead(s) | Intake / authorization reality check | ☐ |
| Leah | Optional — comms awareness | ☐ |
| Angelo | Optional — sales dashboard needs | ☐ |

---

## Workshop agenda (90 min)

| Time | Topic | Lead | Decision output |
|------|-------|------|-----------------|
| 0:00–0:10 | Goals + rules (one status per episode; CRM = source of truth) | Keren | Ground rules agreed |
| 0:10–0:25 | Terminal states: DROPPED_OFF vs DISCHARGED vs voided vs deferred | Joel | Written definitions |
| 0:25–0:35 | Authorization object vs lifecycle stage | Joel + Avi | Auth never = person status |
| 0:35–0:45 | Anticipated SOC vs start of care | Joel | Date field rules |
| 0:45–0:55 | LOB coexistence + short-term-only rule | Joel | Primary LOB + sales dash rule |
| 0:55–1:05 | NIA fail → ON_HOLD (or alternative) | Joel | Hold reason + duration |
| 1:05–1:15 | CDPAP remediation | Joel + Avi | Batch rule for Phase 3 |
| 1:15–1:25 | Census definition | Joel + ops | Reconciliation target |
| 1:25–1:30 | Next steps: Framework v1 owners + due date | Keren | Sign-off schedule |

Use [`CRM DECISION WORKSPACE.md`](../../CRM%20DECISION%20WORKSPACE.md) sections: move agreed items to **FINAL DECISIONS (LOCKED)**.

---

## Status Framework v1 — owners

| Deliverable | Primary owner | Reviewer | Approver | Due |
|-------------|---------------|----------|----------|-----|
| Status definitions (lifecycle stages) | Keren | Joel | Joel + Avi | __________ |
| LOB qualification checklists | Joel | Ops leads | Joel | __________ |
| Edge case decisions (NIA, short-term, CDPAP) | Keren | Joel | Stakeholders | __________ |
| Legacy term mapping (pre-intake, closed, authorized) | Keren | Avi | Avi | __________ |
| **Signed Status Framework v1** | Keren | All above | Joel (ops) + Avi (CRM) | __________ |

**Format:** PowerPoint or doc — team preference from alignment meeting: _______________

**Sign-off method:** ☐ Email ☐ Asana milestone ☐ Teams thread ☐ Other: _______

---

## Framework v1 minimum contents

1. **Lifecycle diagram** — Lead → Referral → Intake → Patient → terminal states
2. **Status definitions** — one sentence each; maps to [`enums.json`](../schema/enums.json) values
3. **Entry triggers** — what moves a record between stages
4. **Explicit rules** — one status per person; auth is not a stage; short-term rule
5. **LOB matrix** — gold LOBs; primary LOB when multiple intakes open
6. **Edge case table** — scenario → status → drop/hold reason
7. **Deprecated terms** — pre-intake, closed, person-level authorized → replacement
8. **Census definition** — how "active patient" is counted
9. **Approval block** — names, dates

---

## Unblocks when complete

| Milestone | Asana task name |
|-----------|-----------------|
| Phase 0 sign-off | Document signed decisions — Status Framework v1 (PowerPoint / doc) |

This milestone **blocks all Phase 1 tasks** per [`dependencies.json`](../asana/dependencies.json) (unless Decision 7 changed that in alignment meeting).

---

## After workshop

- [ ] Keren publishes Framework v1 draft within _____ business days
- [ ] Review cycle: _____ days
- [ ] Mark Phase 0 milestone complete in Asana
- [ ] Notify team in Teams — Phase 1 baseline audit may begin
- [ ] Update [`03-decision-worksheet.md`](03-decision-worksheet.md) with any deferred alignment decisions
