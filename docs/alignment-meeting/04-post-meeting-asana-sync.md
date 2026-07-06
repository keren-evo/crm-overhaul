# Post-Meeting — Asana Sync Checklist

**Do same day as alignment meeting.**  
**Owner:** Keren (or assignee from [`03-decision-worksheet.md`](03-decision-worksheet.md) sign-off block)

Repo source of truth for structure: [`crm/asana/`](../asana/). Asana must be updated manually or via Asana AI.

---

## Step 1 — Capture meeting outcomes (15 min)

- [ ] Fill all rows in [`03-decision-worksheet.md`](03-decision-worksheet.md)
- [ ] Screenshot or export decision outcomes to Asana project description / wiki
- [ ] List any new tasks, removed tasks, or reordered phases

---

## Step 2 — Update Asana project (30 min)

### Option A — Asana AI (recommended)

1. Open project **EVO CRM Status Label Overhaul Sprint**
2. Paste [`../asana/asana-ai-apply.prompt.md`](../asana/asana-ai-apply.prompt.md)
3. Append a **Meeting deltas** block (template below) with today's decisions
4. Run AI; verify no duplicate tasks

### Option B — Manual

Follow [`../asana/README.md`](../asana/README.md) quick start (sections, CSV, dependencies, milestones).

---

## Meeting deltas block (paste into Asana AI after base prompt)

```text
## Meeting deltas — [DATE]

Apply these changes on top of the base spec:

### Phase / section changes
- [e.g. Added task to Phase 0: "Define voided vs dropped on intake"]
- [e.g. Moved task X from Phase 1 to Ongoing]

### Dependency changes
- [e.g. Phase 1 no longer blocked by Framework v1 — only Phase 2 blocked]
- [Reference: crm/asana/dependencies.json cross_phase section]

### Owner changes
- [e.g. Angelo → collaborator on Phase 5 funnel leakage task]

### Milestone changes
- [e.g. No change / renamed milestone]

### Custom field updates
- Requires Stakeholder Decision = Yes on: [task names]
```

---

## Step 3 — Verify Asana structure

| Check | Source file | Done |
|-------|-------------|------|
| 9 sections in order | [`sections.json`](../asana/sections.json) | ☐ |
| Custom fields exist | [`custom-fields.json`](../asana/custom-fields.json) | ☐ |
| Task fields match CSV | [`evo-crm-sprint-tasks.csv`](../asana/evo-crm-sprint-tasks.csv) | ☐ |
| 5 milestones marked | [`milestones.json`](../asana/milestones.json) | ☐ |
| Cross-phase dependencies wired | [`dependencies.json`](../asana/dependencies.json) | ☐ |
| Assignees not all Keren | CSV `Assignee Primary` column | ☐ |
| 5 saved views | [`saved-views.md`](../asana/saved-views.md) | ☐ |

---

## Step 4 — Sync repo if structure changed (10 min)

If the team changed phases, tasks, or dependencies in Asana, update these files to match:

| File | Update when |
|------|-------------|
| [`sections.json`](../asana/sections.json) | Tasks added/removed/moved between phases |
| [`dependencies.json`](../asana/dependencies.json) | Blocked-by relationships changed |
| [`milestones.json`](../asana/milestones.json) | Milestone tasks renamed or reordered |
| [`evo-crm-sprint-tasks.csv`](../asana/evo-crm-sprint-tasks.csv) | Assignees, phases, depends-on, custom fields |
| [`project-description.md`](../asana/project-description.md) | Success criteria or team roles changed |

**Do not edit migration SQL files** unless audit sections changed — create new artifacts instead.

---

## Step 5 — Communicate back to team (5 min)

- [ ] Post in Teams: "Asana updated per alignment — [link]. Phase 0 workshop: [date]."
- [ ] Tag owners for new/changed tasks
- [ ] Attach [`05-phase0-workshop.md`](05-phase0-workshop.md) invite or summary

---

## Dependency reference (default — change only if Decision 7 differs)

```
Phase 0 milestone (Framework v1)     → blocks all Phase 1
Phase 1 milestone (Baseline audit)   → blocks all Phase 2
Phase 2 mapping doc                  → blocks all Phase 3
Phase 3 milestone (Remediation)      → blocks all Phase 4
Phase 4 SLA timers                   → blocks all Phase 5
Phase 5 milestone (UAT passed)       → blocks all Phase 6
Phase 6 milestone (Census gap closed)→ blocks all Phase 7
```

Full within-phase chains: [`dependencies.json`](../asana/dependencies.json) → `within_phase`.
