# CRM Status Framework — Implementation Artifacts

Executable specs for the Lead → Referral → Intake → Patient lifecycle overhaul (NY Operations).

## Sign-off package (Jul 2026 — pending Joel/Leah)

| Path | Purpose |
|------|---------|
| **`glossary/joel-model-signoff-onepager.md`** | Plain-language patient path summary |
| **`glossary-pipeline-v2.md`** | Full status terminology |
| **`flowcharts/pipeline-flowcharts-v1.md`** | Main pipeline + short-term icon + multi-LOB Mermaid |
| **`glossary/drop-reasons-for-signoff.md`** | 10 drop categories — sign-off sheet |
| `meeting-notes/2026-07-pipeline-alignment.md` | Workshop capture |
| `Link-Homecare-CRM-Status-Architecture-Execution-Workspace.md` | Full execution workspace |

**Gate:** Sign one-pager (or full glossary) + flowcharts → Joel schedules Avi · Leah coordinates calendar.

## GitHub & web hub

| Item | Link |
|------|------|
| **CRM hub (browse)** | [keren-evo.github.io/crm-overhaul](https://keren-evo.github.io/crm-overhaul/) |
| **Repo** | [github.com/keren-evo/crm-overhaul](https://github.com/keren-evo/crm-overhaul) |
| **Sign-off glossary** | [glossary-pipeline-v2.html](https://keren-evo.github.io/crm-overhaul/glossary-pipeline-v2.html) |
| **Flowcharts** | [pipeline-flowcharts-v1.html](https://keren-evo.github.io/crm-overhaul/flowcharts/pipeline-flowcharts-v1.html) |
| **Execution workspace** | [execution workspace](https://keren-evo.github.io/crm-overhaul/Link-Homecare-CRM-Status-Architecture-Execution-Workspace.html) |
| **Asana task CSV** | [crm_asana_v3.csv](https://keren-evo.github.io/crm-overhaul/asana/crm_asana_v3.csv) (Related Docs = hub links) |

## OneDrive hub (clickable — share with team)

| Item | Path |
|------|------|
| **Open in browser** | `O:\EVO\OneDrive - EVO Healthcare Group\Documents\Link Homecare - CRM Overhaul\index.html` |
| **Re-sync after repo edits** | `powershell -File crm/sync-to-onedrive.ps1` |

Hub source in repo: `crm/onedrive-hub/index.html`. Share the OneDrive folder with Joel/Leah for clickable links (glossary, flowcharts HTML, drop reasons, workspace, Asana).

**OneDrive web:** Open `index.html` with **Open in browser** (not the side preview). All pages include a cloud navigation script so links open in a new tab with full SharePoint URLs.

## Contents

| Path | Purpose |
|------|---------|
| `schema/enums.ts` | TypeScript enums + metadata for app code |
| `schema/enums.json` | Schema Manager / picklist import |
| `schema/lifecycle.ts` | Master stage computation + transition gates |
| `schema/validation-rules.ts` | Blocking validation rule definitions |
| `schema/nexus-episode-status-map.json` | Episode-centric migration map (Nexus CRM) |
| `schema/legacy-status-map.json` | Legacy Salesforce-era → unified framework |
| `audit/data-integrity-audit.sql` | Run against live CRM DB before migration |
| `audit/dashboard-queries.sql` | Sales, ops, census, funnel leakage queries |
| `asana/` | **Asana sprint organization kit** — CSV, sections, dependencies, AI prompt |
| `alignment-meeting/` | **Alignment meeting package** — share-with-team, walkthrough, decisions, Asana sync, Phase 0 workshop |
| `crm-bot-discovery.prompt.md` | Copy-paste prompts for CRM bot discovery (Phase 0–1) |

## Asana project setup

For **EVO CRM Status Label Overhaul Sprint**, use [`asana/README.md`](asana/README.md):

1. Paste [`asana/project-description.md`](asana/project-description.md) into the Asana project description
2. Run [`asana/asana-ai-apply.prompt.md`](asana/asana-ai-apply.prompt.md) in Asana AI, or apply [`asana/evo-crm-sprint-tasks.csv`](asana/evo-crm-sprint-tasks.csv) manually

## Table name assumptions (SQL)

Adjust aliases in SQL files to match your CRM:

| Spec name | Expected table | Notes |
|-----------|----------------|-------|
| `persons` | Person / Contact unified record | |
| `intakes` | Intake child records | One row per LOB attempt |
| `authorizations` | Authorization object | Linked from intake |
| `medicaid_tickets` | Medicaid application track | Orthogonal to lifecycle |
| `service_episodes` | Active service post-SOC | Required for census |

## Usage

```bash
# Type-check lifecycle logic (from repo root)
npx tsc --noEmit crm/schema/*.ts

# Run audit pack (PostgreSQL example)
psql "$CRM_DATABASE_URL" -f crm/audit/data-integrity-audit.sql
```

## Migration order

1. Run `audit/data-integrity-audit.sql` — baseline counts
2. Import `schema/enums.json` picklists into Schema Manager
3. Apply `legacy-status-map.json` in a staging batch job
4. Deploy validation rules from `validation-rules.ts`
5. Enable computed `lifecycle_stage` + rebuild dashboards using `dashboard-queries.sql`
