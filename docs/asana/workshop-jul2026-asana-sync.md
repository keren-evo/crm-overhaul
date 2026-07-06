# Asana sync — July 2026 workshop (patient status pipeline)

Paste into **EVO CRM Status Label Overhaul Sprint** after the team workshop. Updates glossary, pipeline stages, and action items.

---

## Pin this comment

**Workshop outcome — Patient Status Pipeline (Jul 2026)**

The team agreed on a **5-stage main pipeline** plus Dropped Off:

**Lead → Qualifying → Referral in Progress → Active → Discharged**  
(Dropped Off anytime before Active)

### Key agreements

- **Qualifying** = lead in progress (contact, insurance, eligibility)  
- **Referral in Progress** = intake opened for a LOB — **replaces** "In Progress" / "Intake" as patient status labels  
- **Active** = receiving service under ≥1 LOB  
- **Authorized** = sub-status of Active only — never top-level  
- **Short-term care** = parallel track with **icon** until authorized; then Active in main pipeline  
- **NIA fail** → typically Dropped Off; reapply wait ~180 days (Joel to confirm)  
- **Drop reasons** → simplify to ~10 categories  
- **CRM implementation on hold** until labels + glossary + flowcharts finalized → **one-pass** build with Avi  

### Action items (create/update in Asana)

| Owner | Task |
|-------|------|
| **Joel** | Coordinate with Avi — schedule CRM implementation review meeting with tech team |
| **Leah** | Send follow-up via chat; coordinate scheduling after labels finalized |
| **Keren** | Continue glossary (`crm/glossary/status-terminology-v1.md`) — incorporate workshop notes |
| **Team** | Finalize patient status labels and flowcharts (blocks CRM build) |
| **Enrollment specialists** | Training placeholder: use new dashboards/filters when live |

### Blocks Phase 2 until done

- [ ] Glossary v1 signed (Keren + Joel)  
- [ ] Flowcharts published (Lead → … → Discharged + ST icon + multi-LOB)  
- [ ] Joel schedules Avi technical review  
- [ ] Drop reason list (~10) signed  
- [ ] NIA reapply wait confirmed  

### Repo artifacts updated

- `crm/glossary/status-terminology-v1.md`  
- `crm/schema/nexus-episode-status-map.json` (v1.1 workshop pipeline)  
- `crm/asana/evo-crm-sprint-tasks.csv` (workshop tasks appended)  

---

## CSV rows added

Import or merge from CSV — section **Workshop Follow-Up (Jul 2026)**:

- Joel: Schedule Avi CRM implementation review meeting  
- Leah: Post-workshop follow-up and scheduling coordination  
- Keren: Publish glossary v1 draft for Joel/Leah review  
- Team: Finalize status labels and flowcharts  
- Joel: Confirm NIA reapply wait period (180d vs 6mo)  
- Joel: Sign final drop reason categories (~10)  
- Avi: Attend implementation review — feasibility + one-pass plan  
- Enrollment: Dashboard/filter training plan (after Phase 5)  

---

## Progress bar change (stakeholder decision)

**Previous draft:** Referral → Active → Discharged (3 steps)  
**Workshop agreed:** Lead → Qualifying → Referral in Progress → Active → Discharged (5 steps)

**Recommendation for UI:** 5-step bar for enrollment specialists; leadership census views still roll up to **Active** vs **not Active**.

Update task **Confirm 3-stage UI** → **Confirm 5-stage pipeline UI** in Business Definitions section.
