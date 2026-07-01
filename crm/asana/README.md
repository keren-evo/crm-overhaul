# Asana execution kit — EVO CRM Status Label Overhaul Sprint

One-click artifacts to organize the Asana project per the sprint organization plan. **Asana itself must be updated manually or via Asana AI** — this folder is the source of truth.

## Quick start (30 minutes)

| Step | Action | File |
|------|--------|------|
| 1 | Paste project description into Asana | [`project-description.md`](project-description.md) |
| 2 | Paste prompt into Asana AI chat | [`asana-ai-apply.prompt.md`](asana-ai-apply.prompt.md) |
| 3 | Or: create 9 sections and drag tasks | [`sections.json`](sections.json) |
| 4 | Create 6 custom fields | [`custom-fields.json`](custom-fields.json) |
| 5 | Bulk-set fields from CSV | [`evo-crm-sprint-tasks.csv`](evo-crm-sprint-tasks.csv) |
| 6 | Mark 5 milestones | [`milestones.json`](milestones.json) |
| 7 | Wire dependencies | [`dependencies.json`](dependencies.json) |
| 8 | Create 5 saved views | [`saved-views.md`](saved-views.md) |

## Files

| File | Purpose |
|------|---------|
| `sections.json` | 9 sections + task names per section |
| `custom-fields.json` | Field definitions + bulk defaults + exceptions |
| `evo-crm-sprint-tasks.csv` | Full task matrix: fields, assignees, dependencies |
| `milestones.json` | 5 phase-gate milestones |
| `dependencies.json` | Cross-phase + within-phase dependency chains |
| `project-description.md` | Paste into Asana project description |
| `saved-views.md` | Filter specs for 5 saved views |
| `asana-ai-apply.prompt.md` | Single prompt for Asana AI to apply everything |

## Assignee map

| Person | Tasks |
|--------|-------|
| **Avi** | Schema, remediation, validation, dashboards, production cutover |
| **Keren** | Phase 0–1, audit baselines, framework sign-off, discovery, UAT |
| **Joel** | Workshops, playbooks, ops sign-off |
| **Leah** | Migration comms, Teams rename |
| **Angelo** | Sales dashboard UAT |

Primary assignee is `Assignee Primary` in CSV; `Assignee Secondary` = collaborator.

## Milestone chain

```
Phase 0 sign-off → Phase 1 baseline → Phase 3 remediation → Phase 5 UAT → Phase 6 cutover → Phase 7
```

Phase 2 starts after Phase 1 milestone. Phase 4 after Phase 3 milestone. Phase 5 after Phase 4 complete.

## CSV import notes

- Asana CSV import creates **new** tasks — prefer Asana AI prompt to **update existing** tasks
- Custom field names in CSV must match Asana field names exactly
- `Depends On` column is for manual/AI dependency wiring (not auto-imported by Asana CSV)

## Related CRM artifacts

See [`../README.md`](../README.md) for schema, audit SQL, and migration order.
