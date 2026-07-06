# Asana comment — Phase walkthrough + CTA

Copy-paste into the **EVO CRM Status Label Overhaul Sprint** project (or pin as project description update).

---

## Comment text

Hi team — quick walkthrough of the phased plan and what I need from you.

I've drafted this in Asana based on discovery. I'm still learning your processes, so **please treat this as a proposal, not a final plan.** Edit tasks, dependencies, and owners directly in Asana, or reply here with changes.

**Proposed rule:** Nothing in Phase 2+ starts until **Status Framework v1** is signed (Phase 0). We're here especially to shape Phase 0 and sanity-check the rest.

---

**Why we're doing it in phases**
• **Decide before build** — Phase 0 locks definitions so we don't encode wrong assumptions
• **Measure before fix** — Phase 1 baselines the data mess so we can prove remediation worked
• **Staging first** — Phases 2–5 on staging; production only after UAT
• **One source of truth** — Lifecycle comes from intake/auth data, not legacy tags like pre-intake or person-level authorized

---

**Phase 0 — Stakeholder sign-off**
Lock business definitions before any CRM changes.
Topics: dropped off vs discharged vs voided vs deferred vs authorized vs SOC dates · LOB checklists (LTC, NHTD, OPWDD, private pay) · short-term rule · NIA fail · CDPAP · census definition
Deliverable: Signed Status Framework v1 · Owners: @Keren (framework), @Joel (ops truth) · Gates everything in Phase 1+

👉 **CTA:** Reply on Phase 0 tasks — what's missing? What belongs here vs later?

---

**Phase 1 — Baseline audit**
Read-only discovery + SQL audit to quantify problems (orphan authorized, CDPAP queue, pre-intake/closed counts, census gap, etc.)
Deliverable: All baseline counts recorded · Owners: @Keren, @Avi · Gates Phase 2

👉 **CTA:** Are we measuring the right things? Any baseline sales/ops need that's missing?

---

**Phase 2 — Schema (staging)**
New picklists + lifecycle_stage; hide legacy tags. No production changes.
Proposed flow: Lead New → Lead Contacting → Referral Active → Intake In Progress → On Hold → Authorized Pending SOC → Patient Active → Dropped Off / Discharged
Owners: @Avi (build), @Keren (review)

👉 **CTA:** Do these stage names match how staff talk? Is "On Hold" OK?

---

**Phase 3 — Data remediation (staging)**
Batch-fix legacy data (pre-intake → On Hold, closed → dropped/discharged, CDPAP, orphan authorized, etc.)
Ops sign-off on 50-record sample · Gates Phase 4

---

**Phase 4 — Validation & automation (staging)**
Blocking rules + computed lifecycle + SLAs (lead 24h, follow-up 3d, referral→intake 7d, authorized→SOC 14d) · Owner: @Avi · Gates Phase 5

👉 **CTA:** Are those SLAs realistic? Any rule that would block real workflows?

---

**Phase 5 — Dashboards + UAT**
Rebuild views so one glance = lead, referral, or patient. UAT = @Angelo (sales) + ops test on staging before go-live. Gates Phase 6.

👉 **CTA:** What columns/filters does each role need on day one?

---

**Phase 6 — Production cutover** · **Phase 7 — Cleanup & FL handoff**
Go-live with comms (@Leah), post-cutover audit, field cleanup, NY playbook.

**Ongoing — Discovery** runs in parallel (no prod changes): CRM bot prompts, open questions, playbooks → feed Framework v1.

---

**Milestones (phase gates)**
1. Framework v1 signed → blocks Phase 1
2. Baseline audit complete → blocks Phase 2
3. Staging remediation validated → blocks Phase 4
4. UAT passed → blocks Phase 6
5. Census gap closed → blocks Phase 7

**Proposed owners:** @Keren 0–1 + framework · @Avi 2–4 + cutover · @Joel Phase 0 + ops sign-off · @Leah comms · @Angelo sales UAT

---

**Main ask — please do one of these by [DATE]:**
1. **Comment** on this thread with phase/task/dependency/owner changes, or
2. **Edit tasks directly** in Asana and tag me on what you changed, or
3. **Flag blockers** — especially Phase 0 decisions (NIA fail, short-term rule, CDPAP, census definition)

If you're aligned on the structure, we'll schedule the Phase 0 definitions workshop next.

Thanks — @Joel @Avi @Leah @Angelo
