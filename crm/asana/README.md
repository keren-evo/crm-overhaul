# Asana execution kit — CRM Status Architecture Rebuild

Workstream-based project structure for the Link Homecare / Nexus CRM status overhaul. **Not phase-numbered** — organized by what must happen in what order.

## Quick start

| Step | Action | File |
|------|--------|------|
| 1 | Read the full structure | [`asana-structure.md`](asana-structure.md) |
| 2 | Paste project description | [`project-description.md`](project-description.md) |
| 3 | Create 3 Asana Goals + link to project | Goals in `structure.json` |
| 4 | Run Asana AI prompt **or** import CSV | [`asana-ai-apply.prompt.md`](asana-ai-apply.prompt.md) · [`evo-crm-sprint-tasks.csv`](evo-crm-sprint-tasks.csv) |
| 5 | Create 8 custom fields | [`custom-fields.json`](custom-fields.json) |
| 6 | Mark 6 milestones + wire dependencies | [`milestones.json`](milestones.json) · [`dependencies.json`](dependencies.json) |
| 7 | Create saved views | [`saved-views.md`](saved-views.md) |
| 8 | Pin Jul 2026 workshop comment | [`workshop-jul2026-asana-sync.md`](workshop-jul2026-asana-sync.md) |
| 9 | Map sign-off web package → tasks | [`signoff-package-asana-map.md`](signoff-package-asana-map.md) |

## Files

| File | Purpose |
|------|---------|
| **`asana-structure.md`** | **Primary doc** — full Goals → Project → Sections → Tasks → Subtasks tree |
| `workshop-jul2026-asana-sync.md` | **Jul workshop** — pipeline agreement + action items to paste in Asana |
| `../glossary/status-terminology-v1.md` | Glossary draft (Keren) — blocks CRM build until signed |
| `structure.json` | Machine-readable source of truth (71 tasks, subtask rows in sprint CSV) |
| `task-files.json` | Repo artifact paths per task (exported as OneDrive `.html` doc links in CSV) |
| `evo-crm-sprint-tasks.csv` | Import matrix with subtasks |
| `crm_asana_v3.csv` | **Simplified import** — parent tasks + GitHub doc links (regenerate via `_gen_csv.py`) |
| `project-description.md` | Paste into Asana project description |
| `custom-fields.json` | 8 custom field definitions |
| `milestones.json` | 6 outcome-based milestones |
| `dependencies.json` | Cross-section and within-section blockers |
| `signoff-package-asana-map.md` | **Sign-off web package → Asana tasks** (Joel → Avi → Hilleh · cc Leah) |
| `saved-views.md` | 7 saved view specs |

## Structure at a glance

```
10 Sections · 71 Tasks · 6 Milestones · 3 Program Goals

§1 Governance → §2 Definitions (GATE) → §3 Baseline ∥ §4 Architecture
    → §5 Build → §6 Remediation → §7 Dashboards/UAT → §8 Go-Live
    → §9 Training → §10 Growth
```

## Assignees

| Person | Primary workstreams |
|--------|---------------------|
| **Keren** | Governance, Definitions, Baseline, Architecture, UAT, Training, Growth |
| **Joel** | Definitions decisions, edge cases, ops review, playbooks |
| **Avi** | Build, Remediation, Automations, Dashboards, Go-Live |
| **Angelo** | Sales UAT |
| **Leah** | Cutover communications |

## Milestone chain

```
Sign Framework v1 → Baseline complete → Staging build → Remediation validated → UAT passed → Production live
```

## Related

- Workspace doc: [`../Link-Homecare-CRM-Status-Architecture-Execution-Workspace.md`](../Link-Homecare-CRM-Status-Architecture-Execution-Workspace.md)
- CRM artifacts: [`../README.md`](../README.md)
