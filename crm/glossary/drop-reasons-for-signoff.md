# Drop Reasons — Sign-Off Sheet for Joel

**Purpose:** Replace long, confusing drop-reason picklists with **10 clear categories** for CRM filtering, reporting, and enrollment specialist workflow.  
**Maps to:** Nexus `Episode.outcome` / ReferralOutcome picklist  
**Owner:** Keren · **Sign-off:** Joel Schlanger  
**Status:** **Pending Joel sign-off** — required before ReferralOutcome export and backfill

**Use when:** Master pipeline moves to **Dropped Off** (anytime before Active).  
**Not for:** Discharge reasons — see discharge list at bottom.

---

## Proposed drop reasons (10)

| # | Category | Definition | When enrollment uses it | Example |
|---|----------|------------|-------------------------|---------|
| 1 | **NIA Failed** | Patient did not pass NY Independent Assessor for MLTC/LTC | NIA outcome = fail; no alternate LOB | Failed both NIA appointments |
| 2 | **Not Eligible — Insurance or Diagnosis** | Does not meet LOB eligibility (payer or clinical) | Qualifying or Referral in Progress | Medicare-only for MLTC path |
| 3 | **Payer Denied** | Authorization or payer explicitly denied | Referral in Progress after auth denial | MLTC denial letter |
| 4 | **Patient / Family Declined** | Patient or family chose not to proceed | Any pre-Active stage | "Changed mind about home care" |
| 5 | **No Follow-Up / Unresponsive** | Could not reach after defined outreach attempts | Qualifying — SLA exceeded | 3+ calls, no response |
| 6 | **Chose Competitor** | Patient went to another agency | Qualifying or Referral in Progress | Signed with competing CHHA |
| 7 | **Documentation Incomplete** | Required docs not obtained in reasonable time | Referral in Progress | Missing POA after 30 days |
| 8 | **Short-Term Only / Not Continuing** | Accepted short-term path only; not pursuing long-term | Short-term complete or declined LTC upsell | NH discharge only; no LTC interest |
| 9 | **Referred to Third Party** | Link routed patient elsewhere (not Link patient) | Qualifying or Referral in Progress | Sent to Girling or partner agency |
| 10 | **Other** | None of above | Last resort | **Free-text note required** |

### Special cohort mappings (backfill)

| Legacy / special case | Map to category |
|-----------------------|-----------------|
| CDPAP post–Apr 2025 sunset | **Not Eligible** or **Other** + note "CDPAP sunset" |
| Pre-Intake NIA wait | Do **not** drop — use follow-up date; if terminal drop → **NIA Failed** |
| Voided intake (error) | Not a drop reason — intake subprocess only |

---

## Validation rules (proposed for Avi)

| Rule | Detail |
|------|--------|
| Required on Dropped Off | Drop reason required before save |
| Other | Requires `outcome_notes` (free text) |
| NIA Failed | Suggest auto-set follow-up date = today + 180 days *(Joel confirming)* |
| Discharged | May **not** use drop reasons — use discharge reasons |

---

## Discharge reasons (separate — was Active)

Use when master pipeline = **Discharged**. Joel to confirm final list; suggested starter set:

| # | Discharge reason |
|---|------------------|
| 1 | Goals met / care plan complete |
| 2 | Admitted to nursing home / facility |
| 3 | Deceased |
| 4 | Transferred to another agency |
| 5 | Lost Medicaid / MLTC eligibility |
| 6 | Patient / family voluntary exit |
| 7 | Moved out of service area |
| 8 | Other *(note required)* |

*Keep discharge list separate from drop list in CRM picklists or use typed outcome field.*

---

## Joel sign-off

| Item | Agree? | Changes requested |
|------|--------|-------------------|
| 10 drop categories above | ☐ Yes ☐ Revise | |
| NIA Failed → 180-day follow-up queue | ☐ Yes ☐ No ☐ Different: ___ days | |
| Discharge starter set (8) | ☐ Yes ☐ Revise | |
| "Short-Term Only" vs merge with "Referred to Third Party" | ☐ Keep separate ☐ Merge | |

**Signature:** _________________________ **Date:** __________

---

## After sign-off

1. Keren updates `glossary-pipeline-v2.md` and flowcharts if needed  
2. Avi exports current ReferralOutcome values and maps old → new for backfill  
3. Leah may coordinate Avi meeting per project gate  
