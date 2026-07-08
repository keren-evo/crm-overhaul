# Link Homecare — CRM Status Architecture Rebuild

**Program:** CRM Operating Model Rebuild (NY Operations)  
**CRM:** Nexus at [crm.linkhomecare.com](https://crm.linkhomecare.com/)  
**Framework owner:** Keren · **Operational truth:** Joel · **Executive approval:** Hillel (CEO) · **Build:** Avi · **Comms/scheduling:** Leah

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

**Gate:** Joel + Hillel (CEO) sign labels + flowcharts → Joel schedules Avi tech implementation. **One-pass** CRM update planned.

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
- Keren — refine glossary (`crm/glossary-pipeline-v2.md`)
- Team — finalize labels + flowcharts
- **Hillel (CEO) + Joel — sign off** on patient path framework
- Joel — schedule Avi tech review after sign-off
- Leah — follow-up chat + coordinate meeting scheduling

## Team

| Person | Role |
|--------|------|
| Keren | Glossary, flowcharts, audit, UAT |
| Joel | Pipeline definitions, LOB eligibility, ops sign-off, Avi meeting |
| Hillel | CEO executive approval — unlocks next step |
| Avi | CRM build, one-pass implementation, backfill |
| Leah | Follow-up comms, meeting scheduling |
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

**No CRM field updates or backfill until Joel + Hillel (CEO) sign status labels and flowcharts.**
