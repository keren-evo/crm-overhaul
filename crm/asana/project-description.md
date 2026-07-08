# Link Homecare — CRM Status Architecture Rebuild

**Program:** CRM Operating Model Rebuild (NY Operations)  
**CRM:** Nexus at [crm.linkhomecare.com](https://crm.linkhomecare.com/)  
**Framework author:** Keren *(not a signatory)* · **Operational truth:** Joel · **CRM build:** Avi · **Executive approval:** Hillel (CEO) · **Comms/scheduling:** Leah

---

## Why this project exists

The CRM inherited Salesforce-era labels that no longer match how Link Homecare operates. Dashboards show ~1,960 "authorized" patients while true active census is ~1,200–1,300. This project fixes **business logic first**, then data, then dashboards.

## Agreed pipeline (Jul 2026 — operational sign-off)

```
Lead → Qualifying → Referral in Progress → Active → Discharged
         Dropped Off (any time before Active)
```

- **Qualifying** = lead in progress (contact, insurance, diagnosis, LOB fit)
- **Referral in Progress** = intake opened for a LOB (replaces ambiguous "in progress" / "intake")
- **Short-term care** = parallel track with icon UI until authorized; then Active on main pipeline
- **Multi-LOB** = simultaneous per-LOB statuses displayed alongside master pipeline

**Gate:** Joel (ops) → Avi → Leah coordinates → Hillel (CEO) final sign on labels + flowcharts. **One-pass** CRM update after gate complete.

## Program goals

| Goal | Success looks like |
|------|-------------------|
| **Trustworthy census** | ~1,200–1,300 true active — not ~1,960 authorized inflation |
| **Clear workflow** | Enrollment can identify stage in ≤3 seconds |
| **Growth-ready data** | ~10 drop reasons; source and conversion reporting reliable |

## How work is organized

```
Governance → Definitions (GATE) → Baseline ∥ Architecture → Build → Remediation → Dashboards → Go-Live → Training → Growth
```

**Next actions (from Jul 2026 meeting):**
- Keren — refine glossary (`crm/glossary-pipeline-v2.md`) *(author — not a signatory)*
- Team — finalize labels + flowcharts
- **Joel — sign ops truth first**; schedule Avi tech review
- **Avi — sign CRM implementation feasibility**
- **Leah — coordinate calendar** *(not a signatory)*
- **Hillel (CEO) — final executive sign-off** on patient path framework

## Team

| Person | Role |
|--------|------|
| Keren | Glossary, flowcharts, audit, UAT *(author — not a signatory)* |
| Joel | Pipeline definitions, LOB eligibility; **signs ops truth first** |
| Avi | CRM build; **signs implementation feasibility** |
| Leah | Follow-up comms, meeting scheduling *(coordinates — not a signatory)* |
| Hillel | **CEO — final executive sign-off** |
| Angelo | Sales UAT |
| Enrollment specialists | Status updates; dashboard users when live |

## Repo artifacts

| Artifact | Path |
|----------|------|
| Meeting notes | `crm/meeting-notes/2026-07-pipeline-alignment.md` |
| Glossary v2 | `crm/glossary-pipeline-v2.md` |
| Asana structure | `crm/asana/asana-structure.md` |
| Workspace | `crm/Link-Homecare-CRM-Status-Architecture-Execution-Workspace.md` |

## Rule

**No CRM field updates or backfill until Joel, Avi, and Hillel (CEO) sign status labels and flowcharts.**
