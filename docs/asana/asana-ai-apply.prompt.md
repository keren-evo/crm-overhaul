# Asana AI apply prompt — CRM Status Architecture Rebuild

Copy everything below the line into **Asana AI** chat for the project **CRM Status Architecture Rebuild**.

---

You are setting up the Link Homecare CRM transformation project in Asana. Use workstream-based sections — **not phase numbers**.

## Project

- **Name:** CRM Status Architecture Rebuild
- **Description:** Paste from `crm/asana/project-description.md` in the repo
- **Goals (link to project):**
  1. Trustworthy census and pipeline reporting (~1,200–1,300 true census, not ~1,960 authorized)
  2. Clear lead-to-patient workflow (identify status in ≤3 seconds)
  3. Clean data foundation for scalable growth

## Custom fields (create exactly these 8)

Workstream (Governance, Definitions, Baseline, Architecture, Build, Remediation, Dashboards, Go-Live, Training, Growth) · Decision Gate (Yes/No) · Blocker (Yes/No) · Requires Stakeholder Decision (Yes/No) · CRM Environment (Discovery, Staging, Production) · Effort (S, M, L) · Priority (P0–P3) · Baseline / Target Metric (text)

## Sections (create in this order)

1. Governance & Project Setup
2. Business Definitions & Sign-Off
3. Current State & Data Baseline
4. Target Architecture & Migration Design
5. CRM Build — Staging
6. Data Remediation & QA
7. Dashboards & User Acceptance
8. Production Go-Live
9. Documentation, Training & NY Playbook
10. Growth Enablement

## Tasks

Create **65 parent tasks** from `crm/asana/structure.json` (one per task object). For each task, create **subtasks** from the `subtasks` array in that JSON file.

Assignees:
- **Keren** — Governance, Definitions, Baseline, Architecture, UAT coordination, Training, Growth
- **Joel** — Definitions decisions, edge cases, LOB checklists, ops review, ops UAT, playbooks
- **Avi** — Build, Remediation, Automations, Dashboards, Go-Live
- **Angelo** — Sales UAT
- **Leah** — Cutover communications

## Milestones (mark exactly 6 tasks)

1. Sign Status Framework v1
2. Baseline audit complete — all counts recorded
3. Staging build complete — picklists, UI, rules live
4. Remediation validated — census gap acceptable on staging
5. UAT passed — sales and ops sign-off
6. Production live — census gap closed

## Dependencies

Wire per `crm/asana/dependencies.json`:
- §4 and §5 blocked by **Sign Status Framework v1**
- §6 migration blocked by **Baseline complete** AND **Staging build complete**
- §7 blocked by **Remediation validated**
- §8 blocked by **UAT passed**
- §10 blocked by **Production live**

## Field defaults

- §2 Definitions: Requires Stakeholder Decision = Yes for decision tasks
- Milestones: Blocker = Yes, Decision Gate = Yes where applicable
- §5–§7: CRM Environment = Staging
- §8: CRM Environment = Production
- §10 Growth: Priority = P2 or P3

## Saved views to create

1. **This week** — due this week, incomplete, group by section
2. **Decision gates** — Decision Gate = Yes OR Requires Stakeholder Decision = Yes
3. **Blocked** — Blocker = Yes, incomplete
4. **Go-live day** — Section = Production Go-Live

Pin: Decision gates, Blocked, This week.

## Do not

- Use Phase 0–7 numbering in section names
- Start CRM build tasks before Framework v1 milestone is complete
- Switch dashboard tasks before Remediation validated milestone

Source of truth: `crm/asana/asana-structure.md` and `crm/asana/structure.json`.
