## Key Updates

- **Core problem identified:** The CRM system suffers from inconsistent, inherited labeling from Salesforce that creates confusion across dashboards — records are labeled "patient" even when they are still leads or referrals, making it impossible to assess true pipeline status at a glance. 
- **Single-record architecture:** The new CRM (built as a reverse-engineered replacement for Salesforce) uses **one unified record** that follows a person from first contact through end of life, eliminating the Salesforce limitation where converting a lead created a separate, disconnected object. 
- **Legacy statuses still active:** Several statuses carried over from Salesforce — most notably **"pre-intake"** — remain in use today despite being workarounds for Salesforce's technical limitations, not genuine business logic. 
- **CDPAP revenue loss context:** Approximately **$125 million in top-line revenue** was lost when New York's governor effectively eliminated CDPAP as a line of business on **April 1, 2025**, affecting a significant patient cohort still showing as "authorized" in the system. 
- **Authorized patient count discrepancy:** The dashboard shows **1,960 authorized patients**, but actual active census is estimated between **1,200–1,300**, indicating mass data integrity issues with the "authorized" status.

---



## What to Care About

- **Keren's mandate:** Keren (Speaker 2) has been brought in with a **fresh perspective** to audit the CRM's labeling system, propose a standardized status/tagging framework, and identify where leads are dropping off in the funnel — without being anchored to existing terminology or assumptions. 
- **Foundation first:** The explicit instruction is to focus on **getting the baseline status labels correct** before addressing downstream outcomes (dashboards, sales reporting, Facebook/SEO, etc.). 
- **Proposed terminology framework** (Speaker 1's mental model, not yet finalized):
  - **Lead** = raw name/number/Medicaid ID; no contact made yet 
  - **Referral** = lead that has expressed interest, provided more info, and been converted; still not a patient 
  - **Patient** = someone the company is actively responsible to service
- **Lines of business (LOBs) that matter most** ("gold" categories): Long-term care, NHTD (Nursing Home Transition and Diversion), OPWDD, private pay, custodial care 
- **Short-term care** is treated as a **lead loss** in most cases — only retained if the company is simultaneously working up the patient for long-term care services 
- **Funnel leak identification** is a primary goal: understanding whether drop-offs are due to failed NIA assessments, lack of follow-up, or patients going to competing agencies — currently impossible to determine with the existing labeling.

---



## Feedback & Concerns



### Data Integrity Issues

- **"Authorized" status is unreliable:** Records show as "authorized" with no corresponding active intake, no valid authorization record, or intakes that were dropped/voided — making the status meaningless for operational decisions. 
  - Example: A patient authorized for **short-term care in 2020** (CDPAP) still shows as "authorized" with a dropped intake and no current service activity. 
  - Example: A patient processed for short-term care was sent to a company called **Girling** (never accepted as the agency's own patient) but still appears as an authorized patient on their dashboard.
- **121 fields on a single intake record** — described as "insanity" — reflects accumulated technical debt from the Salesforce migration. 
- **"Closed" status** has no agreed-upon definition; Speaker 1 argues it should not exist — only **"dropped off"** (never became a patient) and **"discharged"** (was a patient, then left) are meaningful distinctions. 
- **"Pre-intake" status** was a Salesforce workaround for records that couldn't be reverted to lead status (e.g., failed NIA, patient went on vacation). It is still being used today with no clear rationale, and is suspected to have caused patient/revenue loss.



### Labeling Confusion in Practice

- A single record can simultaneously carry the label "patient" with a tag of "lead" and a status of "new" — three conflicting signals on one record. 
- **NIA (state assessment in New York)** is the mandatory first step for long-term care approval; a patient with a scheduled NIA is moved to "in-progress," but this logic is not consistently applied or documented. 
- **Multiple intakes per record** (e.g., one dropped custodial + one in-progress long-term) generate multiple conflicting status boxes on the same record, making dashboard interpretation require deep manual investigation. 
- **Medicaid tickets** add another layer: a record can have an open Medicaid application (new/in-progress/approved/deferred) running concurrently with lead/referral/intake statuses, further complicating pipeline visibility. 
- **No visible line-of-business filter** on lead views by default, though it can be added; LOBs available include long-term care, NHTD, OPWDD, private pay, short-term custodial care.



### Operational Friction

- Sales reps (e.g., Angelo's dashboard) must click multiple levels deep into a record to determine whether something is a patient, referral, or lead — defeating the purpose of a dashboard. 
- **No intake date visible** on lead list views; follow-up dates exist but without intake date context, recency of leads cannot be assessed. 
- **"Dropped intake" vs. "dropped patient"** distinction is unclear; sales teams question why dropped intakes appear in their view at all. 
- The system currently keeps a lead in **"new" status** until real contact is made, even if follow-up activity has occurred — but this decision is inconsistently applied.

---



## Action Items

- [x] **Grant Keren admin access** to the CRM's Schema Manager (read-only preferred, but full admin if read-only isn't configurable) so she can review all objects, field names, relationships, and picklists. (Assigned to: Avi/Speaker 3, Due: Immediately) 
- [x] **Rename the Teams group** from "Florida Marketing Operations" to "New York Operations" to reflect the actual scope of this project. (Assigned to: Leah, Due: Immediately) 
- [x] **Add Joel to the Teams group** (Speaker 1 + Leah + Keren + Avi + Joel) for real-time Q&A on CRM/operational questions. (Assigned to: Leah, Due: Done/Confirmed) 
- [x] **Send Keren the Angela playbook** (the intake/lead process document recently created for Angela) as a starting reference for the operational flow. (Assigned to: Joel/Speaker 4, Due: ASAP) 
- [x] **Joel to compile and share** any existing department playbooks, process guides, or documentation relevant to the lead-to-patient workflow. (Assigned to: Joel, Due: ASAP) 
- [x] **Keren to conduct discovery** by exploring the CRM system, identifying inconsistencies, and raising pointed questions via Teams (or email) — no changes to be made in the system. (Assigned to: Keren, Due: Ongoing) 
- [x] **Keren to produce a deliverable** (PowerPoint/framework) that proposes: standardized status labels, parameters for LOB coexistence, use cases for each tag/status, and a lead-to-patient flow. (Assigned to: Keren, Due: TBD — next meeting milestone) 

---



## Open Questions / Follow-Ups

- **What is the definition of "closed" vs. "dropped off" vs. "discharged"?** These three statuses are currently used inconsistently; a formal definition needs to be agreed upon and documented. 
- **Why is "pre-intake" still being used today?** The original technical reason (Salesforce limitation) no longer applies; current usage needs to be audited and likely eliminated. 
- **What is the correct status for a patient who failed their NIA and must wait 6 months?** The pre-intake workaround was used for this case; a proper solution is needed. 
- **Can a record show as "authorized" without an active, valid authorization?** Current data suggests yes — the authorization object and the intake/patient status are not properly linked or validated. 
- **What does "anticipated start of care date" vs. "start of care date" mean operationally**, and how should records be treated when an anticipated date passes without a confirmed start? 
- **What is the rule for when a short-term intake should appear on a sales dashboard** vs. being handled purely operationally? 
- **How should LOB coexistence be handled on a single record?** Specifically: when short-term is active but long-term is still in progress, what is the master status of the record? 
- **What are the checklist/qualification criteria for each LOB** to move from referral to authorized to active patient? No documented criteria currently exist in an accessible format. 
- **What does "deferred" mean on a Medicaid ticket**, and how does it differ from "dropped off"? 
- **What does "voided" mean on an intake**, and how does it differ from "dropped off"? 
- **Keren to identify additional legacy/unused fields** in Schema Manager that can be deprecated, using the Salesforce-era structure as a comparison baseline. 
- **Florida CRM setup:** Acknowledged as slightly different from New York; once New York is resolved, Florida adaptation is expected to be quick — but specifics are deferred.

