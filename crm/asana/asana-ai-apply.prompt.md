In project "EVO CRM Status Label Overhaul Sprint", apply the full organization spec below. Match existing tasks by title (fuzzy match OK). Do not create duplicate tasks if a close match exists.

## 1. Create sections (in this order, top to bottom)

1. Phase 0 — Stakeholder Sign-Off
2. Phase 1 — Access & Baseline Audit
3. Phase 2 — Schema Design (Staging)
4. Phase 3 — Data Remediation (Staging)
5. Phase 4 — Validation & Automation (Staging)
6. Phase 5 — Dashboard Rebuild
7. Phase 6 — Production Cutover
8. Phase 7 — Cleanup & Florida Handoff
9. Ongoing — Discovery (Keren)

Move each task into the section listed in the CSV/repo file crm/asana/evo-crm-sprint-tasks.csv (Section column).

## 2. Create custom fields (exact names)

- Phase (single-select): 0, 1, 2, 3, 4, 5, 6, 7, Ongoing
- Blocker (single-select): Yes, No
- Requires Stakeholder Decision (single-select): Yes, No
- CRM Environment (single-select): Discovery, Staging, Production
- Audit Section (single-select): 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0-14
- Baseline / Target Metric (text)

Set field values from evo-crm-sprint-tasks.csv columns: Phase, Blocker, Requires Stakeholder Decision, CRM Environment, Audit Section, Baseline / Target Metric.

## 3. Mark milestones (5 tasks)

Mark as milestone:
1. Document signed decisions — Status Framework v1 (PowerPoint / doc)
2. Milestone: Baseline audit complete — all counts recorded in project doc
3. Milestone: Staging remediation validated — gap acceptable
4. UAT with Angelo (sales) and ops leads — no multi-click drill-down needed
5. Post-cutover: re-run audit Section 9 — confirm census gap closed

## 4. Set dependencies

Use Depends On column in evo-crm-sprint-tasks.csv. Also block entire next phases on prior milestone:

- All Phase 1 → blocked by Phase 0 milestone (Framework v1 signed)
- All Phase 2 → blocked by Phase 1 milestone (Baseline audit complete)
- All Phase 4 → blocked by Phase 3 milestone (Staging remediation validated)
- All Phase 6 → blocked by Phase 5 milestone (UAT passed)
- All Phase 7 → blocked by Phase 6 milestone (Post-cutover audit)

## 5. Reassign owners

Use Assignee Primary from CSV; add Assignee Secondary as collaborator where listed:

- Avi: Phase 2, 3, 4, 5 implementation, Phase 6 cutover
- Keren: Phase 0, 1 audit, framework sign-off, Ongoing discovery
- Joel: Phase 0 playbooks, ops sign-off, stakeholder workshops
- Leah: Production migration comms, Teams rename
- Angelo: Sales UAT (Phase 5)

Do NOT leave all tasks assigned to Keren.

## 6. Update project description

Paste content from crm/asana/project-description.md including success criteria and repo artifact links.

## 7. Create saved views

Per crm/asana/saved-views.md:
- This week
- Blocked (Blocker = Yes)
- Stakeholder decisions (Requires Stakeholder Decision = Yes)
- Phase 1 audit (Phase = 1, sort by Audit Section)
- Go-live checklist (Phase = 6)

## Critical rule

Phase 2+ work must remain blocked until Phase 0 milestone is complete.
