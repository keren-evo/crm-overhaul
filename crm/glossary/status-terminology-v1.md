# Link Homecare CRM — Status Terminology Glossary v1 (Draft)

> **Superseded by:** [`../glossary-pipeline-v2.md`](../glossary-pipeline-v2.md) (sign-off draft v2.1)  
> Retained for history. Use v2 + [`../flowcharts/pipeline-flowcharts-v1.md`](../flowcharts/pipeline-flowcharts-v1.md) for Joel/Leah review.

**Owner:** Keren Hapuch Lacadin  
**Operational review:** Joel Schlanger, Leah Adelman  
**Technical review:** Avi (pending implementation review meeting)  
**Status:** Draft — **do not implement in CRM until Framework v1 signed**  
**Last updated:** July 6, 2026 (workshop notes incorporated)

---

## How to use this document

- **Known** — confirmed in Nexus Schema Manager or workshop discussion  
- **Agreed** — team consensus from July 2026 workshop; pending final sign-off  
- **Assumption** — recommended; needs Joel/ops confirmation  
- **Retired** — do not use for new records after cutover  

---

## Master patient pipeline (Agreed)

Logical flow for enrollment specialists and dashboards:

```
Lead → Qualifying → Referral in Progress → Active → Discharged
                              │
                              └── Dropped Off (anytime before Active)
```

| Stage | Definition | Who updates | Nexus home (proposed) |
|-------|------------|-------------|------------------------|
| **Lead** | Raw inquiry; minimal or no outreach yet | Sales, growth | `Episode.leadStage` = New (or pre-Episode lead capture) |
| **Qualifying** | Lead in progress — contact, insurance, eligibility screening | Enrollment specialists | `Episode.leadStage` = **Qualifying** (new value) |
| **Referral in Progress** | Intake opened; patient processed for a specific LOB | Enrollment specialists, intake | `Episode.leadStage` = **Referral in Progress** (replaces "In Progress") |
| **Active** | Receiving service under at least one LOB | Operations | `Episode.status` = Active |
| **Discharged** | No active LOBs remain; left agency entirely | Operations | `Episode.status` = Discharged + `outcome` |
| **Dropped Off** | Opted out or failed qualification before Active | Enrollment specialists, intake | `Episode.leadStage` = Dropped Off + `outcome` (before Active only) |

**Agreed:** "Referral in Progress" replaces ambiguous labels **In Progress**, **Intake** (as a patient status), and legacy **Converted**.

**Agreed:** Dropped Off is **not** Discharged — patient never became Active.

---

## Sub-statuses and chips

### Active (when `Episode.status` = Active)

| Chip | Meaning |
|------|---------|
| **Authorized** | Valid payer authorization on at least one active LOB |
| **Non-Authorized / Expired** | Active but missing or expired authorization — ops follow-up required |

**Agreed:** Authorized is never a top-level patient pipeline stage.

### Multi-LOB view (Agreed)

A patient may have **multiple simultaneous** referral or active states across LOBs. The UI shows per-LOB cards so staff can see which services are active, in progress, dropped, or pending — without collapsing to one misleading master label.

---

## Short-term care (parallel dimension — Agreed)

Short-term care runs **parallel** to the main pipeline until authorized.

| Concept | Rule |
|---------|------|
| **Source** | Primarily nursing home discharge planners |
| **Main pipeline** | Short-term status does **not** change main patient stage until **authorized** for service |
| **UI** | Separate **icon** (not main progress bar) until authorized |
| **Once authorized** | Patient becomes **Active** in main pipeline |

**Short-term LOB stages (Agreed):**

| Stage | Meaning |
|-------|---------|
| In Progress | Referral received; CHHA evaluating |
| Accepted | CHHA agrees to take patient; hours may be limited |
| Startup | Pre-service setup |
| Authorized | Actively receiving short-term services → **main status = Active** |

If not authorized: main status may remain Dropped Off or appropriate referral terminal state.

---

## Line of business (LOB) eligibility (Agreed framework)

Patients are assigned to LOBs only when eligibility criteria are met. Enrollment specialists confirm at **Qualifying** and **Referral in Progress**.

| LOB | Eligibility (summary — Joel to finalize checklists) |
|-----|-----------------------------------------------------|
| **MLTC / Long-Term Care** | Medicaid + qualifying diagnosis (e.g. dementia, brain injury) |
| **Custodial** | Medicaid + developmental delay diagnosis |
| **Short-Term / Skilled** | Skilled nursing need + Medicare/Medicaid |
| **NHTD, OPWDD, Private Pay** | Program-specific — see Joel's LOB checklists |

**Planned (Assumption):** System will "light up" eligible LOB options as insurance and diagnosis are entered — Joel confirmed as future improvement.

---

## NIA — New York Independent Assessor (Agreed)

| Item | Detail |
|------|--------|
| **Purpose** | Mandatory assessment for MLTC / long-term care eligibility |
| **Process** | Two appointments (in person or Zoom) |
| **Pass** | → MLTC enrollment path; continue Referral in Progress → Active |
| **Fail** | → typically **Dropped Off** unless alternate service applies |
| **Reapply** | Appeals allowed; **minimum wait before reapply** — Joel estimated **180 days** (**Needs confirmation**; prior spec said 6 months) |
| **Dashboards** | Track pass/fail, upcoming NIAs, failed bucket for follow-up after wait period |

**Assumption:** NIA fail hold may use follow-up/recycle date rather than legacy "Pre-Intake."

---

## Drop reasons (Agreed direction)

Simplify to **~10 clear categories** for filtering and reporting. Current lists are too long.

**Draft categories (Joel to finalize):**

1. No follow-up / unresponsive  
2. Chose competitor  
3. Payer denied  
4. NIA failed  
5. Patient/family declined services  
6. Not eligible (insurance/diagnosis)  
7. Short-term only / third-party referral  
8. Documentation incomplete  
9. Moved out of service area  
10. Other (free text required)

Map to `Episode.outcome` / ReferralOutcome picklist in Nexus.

---

## Discharge reasons (Agreed direction)

Use when `Episode.status` = Discharged (was Active). Align with ReferralOutcome picklist — Joel to sign final list.

Suggested: nursing home placement, deceased, transferred to another agency, lost Medicaid/MLTC, goals met, moved out of area, patient/family declined, other.

---

## Retired terms (do not use for new decisions)

| Term | Replace with |
|------|--------------|
| **Pre-Intake** | Qualifying hold / Referral in Progress + hold reason + follow-up date |
| **Closed** | Dropped Off (never Active) or Discharged (was Active) — manual split for legacy |
| **Converted** (top-level) | Qualifying or Referral in Progress |
| **Authorized** (top-level patient status) | Active sub-status chip only |
| **In Progress** (alone) | **Referral in Progress** (when intake opened) or **Qualifying** (when still qualifying) |

---

## Layer model (Nexus — technical)

| Layer | Object.field | Purpose |
|-------|--------------|---------|
| 1 | `Episode.status` | Master: Referral bucket / Active / Discharged |
| 2 | `Episode.leadStage` | Pipeline: Lead → Qualifying → Referral in Progress → Dropped Off |
| 3 | `Episode.outcome` | Terminal reason (drop or discharge) |
| 4 | `Intake.status` | LOB intake subprocess |
| 5 | `Authorization` | Validity, dates, hours — not census alone |
| 6 | Patient LOB fields | Per-line service status |
| 7 | Short-term icon/track | Parallel until ST authorized |
| 8 | Medicaid ticket | Orthogonal eligibility track |

---

## Open items for Framework v1 sign-off

- [ ] Joel: Confirm NIA reapply wait (180 days vs 6 months)  
- [ ] Joel: Finalize LOB eligibility checklists per line  
- [ ] Joel + team: Sign final ~10 drop reason categories  
- [ ] Export ReferralOutcome picklist from Schema Manager  
- [ ] Active threshold: SOC required vs cleared-to-start  
- [ ] Avi: Technical feasibility review meeting (Joel to schedule)  

---

## Workshop action items (July 2026)

| Owner | Action |
|-------|--------|
| **Joel** | Coordinate with Avi; schedule CRM implementation review with tech team |
| **Leah** | Follow-up via chat; coordinate scheduling after status labels finalized |
| **Keren** | Continue this glossary; incorporate feedback and meeting notes |
| **Team** | Finalize patient status labels and flowcharts before CRM build |
| **Enrollment specialists** | Use updated dashboards/filters when implemented (training TBD) |

**Agreed:** CRM field organization and backfill **on hold** until labels and glossary are finalized — then **one-pass** implementation with Avi's team.
