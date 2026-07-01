# CRM Bot — Discovery Prompt Kit

Copy-paste prompts for auditing Nexus/Link CRM during the **EVO CRM Status Label Overhaul Sprint** (Phase 0–1). Discovery only — no configuration changes.

**Related artifacts:** [`audit/data-integrity-audit.sql`](audit/data-integrity-audit.sql), [`schema/enums.json`](schema/enums.json), [discovery session notes](../1-1-CRM%20Status%20Label%20Overhaul%20—%20Lead-to-Patient%20Workflow%20Discovery%20Session.md)

## How to use

1. Paste the **Master prompt** once to set context and output format.
2. Run one **Focus prompt** per session (schema, statuses, baselines, dashboards, edge cases).
3. Paste answers into the open questions log, Phase 0 doc, or Asana tasks.

Adapt bracketed placeholders to what your bot can access (Schema Manager only vs. record lookup vs. SQL).

---

## Master prompt (paste first)

```text
You are helping me audit our CRM (Nexus/Link) for a Status Label Overhaul project. I am in DISCOVERY ONLY — do not suggest or make configuration changes.

## Project goal
Standardize Lead → Referral → Intake → Patient lifecycle labels, fix authorized/census data integrity (~1,960 dashboard "authorized" vs ~1,200–1,300 true active census), and eliminate legacy Salesforce-era statuses (pre-intake, closed, person-level "authorized", conflicting patient/lead/new tags).

## Your role
Extract factual information from the CRM schema, picklists, relationships, and (if you can) record patterns. Separate:
- **What the system allows** (fields, picklists, rules)
- **What records actually show** (counts, examples)
- **What is unclear or undocumented**

## Output rules (required every time)
For each answer use this structure:

### Finding
[One-sentence summary]

### Evidence
- Object(s):
- Field(s) / picklist value(s):
- Count or example record ID(s) if available:
- Where this appears (person, intake, authorization, medicaid ticket, dashboard):

### Operational meaning (if known)
[What staff think this means — or "unknown / inconsistent"]

### Problem for overhaul
[Why this blocks clear pipeline visibility]

### Open question for stakeholders
[Specific question for Joel/ops — one sentence]

### Maps to audit section
[0–14 from data integrity audit, or "Schema", or "Phase 0 decision"]

If you cannot access something, say exactly what is blocked and what I should check manually in Schema Manager.

## Constraints
- NY Operations scope (Florida is out of scope for now)
- Gold LOBs: long-term care, NHTD, OPWDD, private pay, custodial care
- Short-term custodial is usually lead loss unless a gold LOB is also open
- Authorization is NOT a person lifecycle stage — it is a condition on an intake
- One person record; multiple intakes per LOB possible

Confirm you understand, then wait for my specific extraction request.
```

---

## Focus prompt A — Schema inventory (Phase 1)

```text
Extract a complete schema inventory for the Lead-to-Patient lifecycle.

## Objects to document
For each: person (unified record), intake, authorization, medicaid_ticket, service_episode (if exists), and any dashboard/view objects.

## Per object, list
1. Object name and purpose
2. All fields related to status, stage, LOB, dates, or tags
3. Picklist values for each status field (exact strings, active vs deprecated)
4. Required vs optional fields
5. Relationships (parent/child, lookup targets)
6. Computed vs manual fields
7. Fields that look Salesforce-legacy or duplicate meaning (e.g. patient + lead + new on same person)

## Target fields we expect (flag if missing or named differently)
- person.lifecycle_stage (or equivalent)
- intake.status, intake.nia_status
- authorization.status
- medicaid_ticket.status
- line_of_business
- intake_opened_at, anticipated_soc_date, start_of_care_date
- drop_reason_category, hold_reason, void_reason

## Deliverable table
| Object | Field | Type | Picklist values | Related to | Legacy? | Notes |

## Also answer
- How many fields on the intake object? (we've heard ~121)
- Which intake fields appear unused or always null?
```

---

## Focus prompt B — Status & picklist reality check (Phase 0)

```text
Document every status-like label currently used on a person or intake, and how they conflict.

## Inventory these values (with record counts if possible)
Person-level: lead, referral, patient, new, authorized, pre-intake, closed, in-progress, converted, or any other lifecycle tag

Intake-level: new, in-progress, authorized, active, dropped, voided, on hold, etc.

Authorization-level: pending, approved, denied, expired, voided

Medicaid ticket: new, in-progress, approved, deferred, closed

NIA-related: any nia_status or equivalent

## For each value provide
1. Official picklist definition (if any)
2. Approximate count of records using it today
3. 1–2 example record IDs showing typical use
4. 1 example where it conflicts with another field on the same record

## Explicitly answer these open questions
- What is "pre-intake" used for today? (NIA fail, vacation, other?)
- What is "closed" vs "dropped off" vs "discharged" vs "voided" vs "deferred"?
- Can a person show "authorized" without a linked AUTH_APPROVED authorization?
- What happens when short-term is active but long-term intake is in progress — which status wins on the person?
- What is anticipated start of care vs start of care operationally?

Maps each answer to Phase 0 stakeholder decision needed: Yes/No.
```

---

## Focus prompt C — Data integrity baselines (Phase 1)

Use if the bot can query or summarize data. If not, ask for exact filter criteria to run in the CRM UI.

```text
Run or approximate counts for each audit section below. If you cannot query, give me the exact filter criteria I should use in the CRM UI.

## Baseline counts needed
0. Total persons, intakes, authorizations
1. Orphan authorized: person/intake shows authorized but no valid AUTH_APPROVED authorization (or expired)
2. Authorized + dropped or voided intake
3. CDPAP remediation queue (LOB=CDPAP, post 2025-04-01 sunset context)
4. Third-party referrals counted as our patient (e.g. sent to Girling, is_agency_patient=false)
5. Conflicting legacy tags on one person (e.g. patient + lead + new)
6. Multi-intake open conflicts (2+ open intakes with incompatible statuses)
7. Short-term-only pipeline (no gold LOB open)
8. Stale anticipated SOC (anticipated date passed, no start_of_care_date)
9. Census gap: legacy "authorized" count vs true active census (SOC + valid auth)
10. Authorized/active but no service in 12+ months
11. Medicaid deferred > 30 days
12. Duplicate person candidates
13. Intake field count
14. Exportable list of person IDs for orphan authorized remediation batch

## Output format
| Audit # | Metric name | Count | Severity (High/Med/Low) | Sample IDs (max 5) | Suggested remediation |

Flag anything that explains the ~1,960 vs ~1,200–1,300 census gap.
```

---

## Focus prompt D — Dashboard & ops friction (Phase 5 prep)

```text
Describe how sales and ops currently use CRM dashboards for pipeline visibility.

## Sales (Angelo's view)
1. Which dashboard/view do sales reps use for leads/referrals?
2. Default columns and filters
3. Are gold LOBs filtered by default? Is short-term visible?
4. Can a rep tell lead vs referral vs patient in one glance? If not, how many clicks?
5. Is intake_opened_at visible on list views?
6. Why do dropped intakes appear in sales views?

## Ops
1. Queues for stale SOC, NIA status, Medicaid tickets
2. Where census / authorized count is displayed and how it's calculated
3. Any saved views or reports that depend on legacy statuses (pre-intake, closed)

## Output
| Role | View name | Problem | Data field causing confusion | What they need instead |
```

---

## Focus prompt E — Edge case extraction (Phase 0 workshop)

```text
For each scenario below, tell me:
- What status(es) the CRM uses today
- Example record ID if available
- What ops/sales actually did
- What status the proposed framework should use (your best guess — mark as PROPOSAL)

## Scenarios
1. Patient fails NIA — must wait 6 months
2. No contact after 7 days on a new lead
3. Patient goes to a competitor agency
4. Short-term active, long-term intake still in progress
5. Authorized on dashboard but intake dropped/voided
6. Authorized without intake opened
7. Multiple intakes on same person (one dropped custodial + one in-progress LTC)
8. CDPAP patient post April 2025 sunset still showing authorized
9. Third-party referral (e.g. Girling) — never our patient
10. Medicaid ticket deferred — how does that differ from dropped?

Use the feedback format:
- Real operations? (Y/N/unclear)
- Instantly understandable? (Y/N)
- Removes ambiguity? (Y/N)
- Helps identify drop-offs? (Y/N)
```

---

## Focus prompt F — Single record deep dive

Use when you find a confusing record in the UI.

```text
Deep-dive record [PASTE PERSON ID OR NAME].

List every status-related field on the person and all child records (intakes, authorizations, medicaid tickets, service episodes).

## Output
| Level | Object | Field | Value | Should mean | Conflicts with |
| Timeline | Key dates: created, first contact, intake opened, NIA, auth approved, anticipated SOC, SOC, last service |
| Master question | In plain English: is this a lead, referral, or patient right now? Why is the dashboard wrong? |
| Remediation | What should change under the new framework (do not apply — recommend only) |
```

---

## Follow-up one-liner

```text
Using the same output format as before: [your specific question]. Maps to audit section [#]. Discovery only — no config changes.
```

---

## Tips

| If the bot… | Do this |
|-------------|---------|
| Hallucinates counts | Ask for **record IDs** and verify 2–3 manually |
| Only knows schema | Use prompts A + B; run counts from `audit/data-integrity-audit.sql` |
| Forgets context | Re-paste the **Output rules** block from the Master prompt |
| Gives vague definitions | Ask: *"Give the exact picklist API value and label, and one real example record"* |
| Suggests changes | Remind: *"Discovery only — recommendations go under Open question for stakeholders"* |
