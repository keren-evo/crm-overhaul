# CRM Status Framework — Implementation Artifacts

Executable specs for the Lead → Referral → Intake → Patient lifecycle overhaul (NY Operations).

## Contents

| Path | Purpose |
|------|---------|
| `schema/enums.ts` | TypeScript enums + metadata for app code |
| `schema/enums.json` | Schema Manager / picklist import |
| `schema/lifecycle.ts` | Master stage computation + transition gates |
| `schema/validation-rules.ts` | Blocking validation rule definitions |
| `schema/legacy-status-map.json` | Salesforce-era → new status migration map |
| `audit/data-integrity-audit.sql` | Run against live CRM DB before migration |
| `audit/dashboard-queries.sql` | Sales, ops, census, funnel leakage queries |
| `asana/` | **Asana sprint organization kit** — CSV, sections, dependencies, AI prompt |

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
