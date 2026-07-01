# Pre-Meeting — Share With Team

**Send this before the alignment meeting** (Teams, email, or Asana project description).  
**From:** Keren · **Re:** EVO CRM Status Label Overhaul — alignment session

---

## Subject line (copy)

```
CRM Status Overhaul — alignment on phased plan (your input needed)
```

---

## Message body (copy-paste)

Hi team,

We're scheduling an alignment session on the **CRM Status Label Overhaul Sprint** — standardizing lifecycle labels, fixing the authorized/census gap (~1,960 on the dashboard vs ~1,200–1,300 true active census), and rebuilding dashboards so sales and ops can trust pipeline data at a glance.

### Why we're meeting

The CRM still carries Salesforce-era labels (`pre-intake`, `closed`, person-level `authorized`) that don't match how we operate today. A single record can show conflicting signals (e.g. "patient" + "lead" + "new"). That makes funnel reporting and drop-off analysis unreliable.

### How this plan was built

I've drafted a **phased approach** in Asana (source files in [`crm/asana/`](../asana/)) based on discovery notes and repo artifacts. I'm still learning your operational processes and CRM history — **this is a proposal, not a final plan.**

### What I need from you in the meeting

- Does each phase reflect how work actually happens?
- Are tasks missing, redundant, or in the wrong order?
- Are dependencies too strict or too loose?
- Who should own what?

**Please edit freely** in Asana (or flag in the meeting). Nothing in Phase 2+ should start until we agree Phase 0 is locked — but the shape of Phase 0 itself is what we're here to finalize.

### Please review before we meet (15 min)

| Artifact | Link |
|----------|------|
| Asana project | [EVO CRM Status Label Overhaul Sprint] |
| Discovery session notes | [`1-1-CRM Status Label Overhaul — Lead-to-Patient Workflow Discovery Session.md`](../../1-1-CRM%20Status%20Label%20Overhaul%20—%20Lead-to-Patient%20Workflow%20Discovery%20Session.md) |
| Decision workspace template | [`CRM DECISION WORKSPACE.md`](../../CRM%20DECISION%20WORKSPACE.md) |
| CRM repo overview | [`crm/README.md`](../README.md) |

### Proposed attendees

Keren, Joel, Avi, Leah, Angelo (+ ops leads for Phase 0 definitions if available)

Thanks — looking forward to aligning.

Keren

---

## Problem recap (for meeting opener — 5 min)

Use these bullets if you need a spoken recap:

1. **Dashboard inflation:** ~1,960 "authorized" patients on the dashboard vs ~1,200–1,300 true active census.
2. **Legacy labels:** `pre-intake`, `closed`, and person-level `authorized` are Salesforce workarounds, not business logic.
3. **Conflicting signals:** One record can be tagged patient + lead + new at the same time.
4. **Funnel blindness:** Cannot reliably tell if drop-offs are NIA failures, no follow-up, or competitor loss.
5. **Foundation first:** Keren's mandate is to fix baseline status labels before dashboards, sales reporting, or marketing analytics.
6. **Single-record architecture:** The new CRM follows one person from first contact through end of life — we need one computed lifecycle stage, not overlapping tags.

---

## Success criteria (remind team what "done" looks like)

- Single computed `lifecycle_stage` per person — no conflicting patient/lead/new tags
- `Authorized` only on intakes with a valid linked Authorization object
- True active census matches operational estimate (~1,200–1,300)
- Sales dashboard: gold LOBs only; short-term-only hidden
- `pre-intake` and `closed` eliminated → ON_HOLD, DROPPED_OFF, DISCHARGED
- CDPAP cohort remediated (post 2025-04-01)
- Funnel leakage reportable by `drop_reason_category`
