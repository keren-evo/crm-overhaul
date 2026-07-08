# Joel’s Model — Glossary Sign-Off One-Pager

**For:** Joel Schlanger (ops), Leah Adelman (coordination)  
**From:** Keren · Link Homecare CRM Status Framework  
**Purpose:** Approve the **patient status framework** for CRM implementation  
**Problem (already agreed):** Screens and ops don’t share language; authorized ≠ active census  
**Status:** Ready for sign-off  

**Full glossary:** [`glossary-pipeline-v2.md`](../glossary-pipeline-v2.md)  
**Flowcharts:** [`flowcharts/pipeline-flowcharts-v1.md`](../flowcharts/pipeline-flowcharts-v1.md)  
**Drop reasons:** [`drop-reasons-for-signoff.md`](drop-reasons-for-signoff.md)

---

## The idea (freeze this)

```
Lead → Qualifying → Referral in Progress → Active → Discharged
                    ↘ Dropped Off (never became Active)
```

| Stage | Plain English | Not this |
|-------|---------------|----------|
| **Lead** | Brand-new inquiry | Already a patient |
| **Qualifying** | Checking fit (contact, insurance, diagnosis, program) — **intake not open** | Intake already open |
| **Referral in Progress** | Intake open for a specific program | Vague “in progress” / old “Converted” |
| **Active** | Receiving care from us | Payer said yes only (“authorized”) |
| **Discharged** | Left the agency after being Active | Never started with us |
| **Dropped Off** | Never became Active | Same as Discharged |

**Two rules everyone must keep:**
1. **Authorized ≠ Active.** Authorized = payer approved. Active = we are giving care.
2. **Dropped Off ≠ Discharged.** Dropped = never started. Discharged = was in care, then left.

---

## Two extras (still simple)

| Extra | Rule |
|-------|------|
| **Short-term care** | Sits **beside** the main path (icon) until short-term care starts → then main bar becomes **Active** |
| **Multi-program (multi-LOB)** | One person can be in more than one program; dropping one program ≠ discharging the patient |

---

## What “approve” unlocks

1. Joel schedules Avi’s CRM implementation review  
2. Leah coordinates calendar  
3. Avi does **one-pass** update: labels + filters + backfill together  
4. Growth / marketing reporting waits until these stages are live  

**No CRM field changes until this page (or full glossary) is signed.**

---

## Confirm or change at sign-off (ops truth)

Check yes / revise. Defaults are workshop recommendations.

| # | Item | Proposed default | Joel |
|---|------|------------------|------|
| 1 | Master path labels above | Keep as written | ☐ Yes ☐ Revise: ___ |
| 2 | Active requires confirmed **start of care (SOC)** | Yes | ☐ Yes ☐ No |
| 3 | NIA fail → reapply wait | **~180 days** | ☐ 180 ☐ Other: ___ |
| 4 | Multi-LOB master bar | Show **most advanced** open gold LOB | ☐ Yes ☐ Other: ___ |
| 5 | 10 drop reasons sheet | Approve [`drop-reasons-for-signoff.md`](drop-reasons-for-signoff.md) | ☐ Yes ☐ Revise |
| 6 | Short-term icon model | Parallel until Authorized → Active | ☐ Yes ☐ Revise |

**Still Joel-owned after yes (does not block Avi meeting):** NHTD / OPWDD / Private Pay eligibility checklists.

---

## Signatures

By signing, this one-pager (and companion glossary / flowcharts) is the **business source of truth** for CRM status work.

| Role | Name | Initials | Date |
|------|------|----------|------|
| Framework | Keren Hapuch Lacadin | | |
| Operations | Joel Schlanger | | |
| Coordination | Leah Adelman | | |
| CRM build *(after tech review)* | Avi | | |

---
