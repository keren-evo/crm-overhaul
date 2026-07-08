# Joel’s Model — Glossary Sign-Off One-Pager

**For:** Joel Schlanger (ops), Avi, Hillel (CEO)  
**From:** Keren · Link Homecare CRM Status Framework  
**Purpose:** Approve the **patient status framework** for CRM implementation  
**Problem (already agreed):** Screens and ops don’t share language; authorized ≠ active census  
**Status:** Ready for sign-off  

> **Comments:** Use the **Comments** column on each row.

**Full glossary:** [`glossary-pipeline-v2.md`](../glossary-pipeline-v2.md)  
**Flowcharts:** [`flowcharts/pipeline-flowcharts-v1.md`](../flowcharts/pipeline-flowcharts-v1.md)  
**Drop reasons:** [`drop-reasons-for-signoff.md`](drop-reasons-for-signoff.md)

---

## The idea (freeze this)

```
Lead → Qualifying → Referral in Progress → Active → Discharged
                    ↘ Dropped Off (never became Active)
```

| Stage | Plain English | Not this | Comments |
|-------|---------------|----------|----------|
| **Lead** | Brand-new inquiry | Already a patient | |
| **Qualifying** | Checking fit (contact, insurance, diagnosis, program) — **intake not open** | Intake already open | |
| **Referral in Progress** | Intake open for a specific program | Vague “in progress” / old “Converted” | |
| **Active** | Receiving care from us | Payer said yes only (“authorized”) | |
| **Discharged** | Left the agency after being Active | Never started with us | |
| **Dropped Off** | Never became Active | Same as Discharged | |

**Two rules everyone must keep:**
1. **Authorized ≠ Active.** Authorized = payer approved. Active = we are giving care.
2. **Dropped Off ≠ Discharged.** Dropped = never started. Discharged = was in care, then left.

---

## Two extras (still simple)

| Extra | Rule | Comments |
|-------|------|----------|
| **Short-term care** | Sits **beside** the main path (icon) until short-term care starts → then main bar becomes **Active** | |
| **Multi-program (multi-LOB)** | One person can be in more than one program; dropping one program ≠ discharging the patient | |

---

## What “approve” unlocks

1. **Joel (ops)** signs → operational truth locked  
2. **Avi** signs → CRM implementation feasibility confirmed *(Joel schedules Avi’s review)*  
3. **Leah** coordinates calendar and team follow-up  
4. **Hillel (CEO)** signs → final executive approval  
5. Avi does **one-pass** update: labels + filters + backfill together  
6. Growth / marketing reporting waits until these stages are live  

**No CRM field changes until Joel, Avi, and Hillel (CEO) sign this page (or full glossary).**

---

## Confirm or change at sign-off (ops truth)

Check yes / revise. Defaults are workshop recommendations.

| # | Item | Proposed default | Agree? | Comments |
|---|------|------------------|--------|----------|
| 1 | Master path labels above | Keep as written | ☐ Yes ☐ Revise | |
| 2 | Active requires confirmed **start of care (SOC)** | Yes | ☐ Yes ☐ No | |
| 3 | NIA fail → reapply wait | **~180 days** | ☐ 180 ☐ Other: ___ | |
| 4 | Multi-LOB master bar | Show **most advanced** open gold LOB | ☐ Yes ☐ Other: ___ | |
| 5 | 10 drop reasons sheet | Approve [`drop-reasons-for-signoff.md`](drop-reasons-for-signoff.md) | ☐ Yes ☐ Revise | |
| 6 | Short-term icon model | Parallel until Authorized → Active | ☐ Yes ☐ Revise | |

**Still Joel-owned after yes (does not block Avi meeting):** NHTD / OPWDD / Private Pay eligibility checklists.

---

## Who signs (in order)

| Order | Who | Role | Agree? | Comments |
|-------|-----|------|--------|----------|
| 1 | Joel Schlanger | Operations | ☐ Yes | |
| 2 | Avi | CRM implementation | ☐ Yes | |
| 3 | **Hillel** | **CEO** *(final)* | ☐ Yes | |

Once all three agree, this one-pager (and companion glossary / flowcharts) is the **business source of truth** for CRM status work. cc Leah on scheduling.

---
