# EVO CRM Status Label Overhaul Sprint

## Goal

Standardize Lead → Referral → Intake → Patient lifecycle labels, fix authorized/census data integrity (~1,960 dashboard vs ~1,200–1,300 true census), and rebuild dashboards. **Baseline status labels before downstream reporting.**

## Success criteria

- Single computed `lifecycle_stage` per person — no conflicting patient/lead/new tags
- `Authorized` only on intakes with valid linked Authorization object
- True active census matches operational estimate (~1,200–1,300)
- Sales dashboard: gold LOBs only; short-term-only hidden
- `pre-intake` and `closed` eliminated → ON_HOLD, DROPPED_OFF, DISCHARGED
- CDPAP cohort remediated (post 2025-04-01)
- Funnel leakage reportable by `drop_reason_category`

## Rule

**Do not start Phase 2+ until Phase 0 milestone (Status Framework v1 signed) is complete.**

## Repo artifacts (source of truth)

| Artifact | Path |
|----------|------|
| Migration order | `crm/README.md` |
| Picklists / enums | `crm/schema/enums.json` |
| Legacy status map | `crm/schema/legacy-status-map.json` |
| Lifecycle computation | `crm/schema/lifecycle.ts` |
| Validation + automation | `crm/schema/validation-rules.ts` |
| Pre-migration audit SQL | `crm/audit/data-integrity-audit.sql` |
| Dashboard queries | `crm/audit/dashboard-queries.sql` |
| Asana execution kit | `crm/asana/` |
| Discovery session notes | `1-1-CRM Status Label Overhaul — Lead-to-Patient Workflow Discovery Session.md` |

## Team

| Role | Owner | Scope |
|------|-------|-------|
| Framework + audit | Keren | Phase 0–1, sign-off, discovery |
| CRM implementation | Avi | Phase 2–4, Phase 6 cutover |
| Operational definitions | Joel | Phase 0 playbooks, ops sign-off |
| Project comms | Leah | Phase 6 migration comms, Teams |
| Sales UAT | Angelo | Phase 5 UAT |

## Phase milestones

1. Status Framework v1 signed (Phase 0)
2. Baseline audit complete (Phase 1)
3. Staging remediation validated (Phase 3)
4. UAT passed (Phase 5)
5. Production cutover — census gap closed (Phase 6)
