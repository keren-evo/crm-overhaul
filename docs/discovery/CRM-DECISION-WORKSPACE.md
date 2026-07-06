# ✅ 📋 ASANA TEMPLATE: CRM STATUS OVERHAUL – DECISION WORKSPACE

## 🟦 PROJECT NAME

  **CRM Status Overhaul – Decision Workspace* 
  
  **This is designed as a decision workspace (NOT a pipeline) so your team can collaborate while keeping CRM as the source of truth*

***
***

## 🔥 HOW TO USE THIS (IMPORTANT)

1. Start everything in **PROPOSED FLOW**
2. Move to **DISCUSSION** for team input
3. Break issues into **EDGE CASES**
4. Lock in **FINAL DECISIONS**
5. Then implement → **READY FOR CRM**
6. Publish → **DOCUMENTATION**
***

# 🧱 SECTIONS (Created in order)

```
📥 PROPOSED FLOW
💬 DISCUSSION
⚠️ EDGE CASES / BREAKPOINTS
✅ FINAL DECISIONS (LOCKED)
🚧 READY FOR CRM IMPLEMENTATION
📚 DOCUMENTATION (SOURCE OF TRUTH)
```

***

# 📥 SECTION: PROPOSED FLOW

## 📝 TASK TEMPLATE: Episode Lifecycle (MASTER FLOW)

**Title:**

```
Episode Lifecycle v1 (Lead → Active → End States)
```

**Description (copy-paste):**

```
## 🎯 Objective
Define the single source-of-truth lifecycle for an Episode in CRM.

## 🔄 Proposed Status Flow
LEAD → QUALIFYING → ACCEPTED → SCHEDULED → ACTIVE  
→ DROPPED (never became patient)  
→ DISCHARGED (was active patient)

## ✅ Status Definitions
- LEAD = Patient created, no contact yet
- QUALIFYING = Intake has started
- ACCEPTED = Clinically + operationally approved
- SCHEDULED = SOC date confirmed + visit planned
- ACTIVE = First visit completed
- DROPPED = Never became a patient
- DISCHARGED = Patient completed/ended service

## 🔁 Entry Triggers
- Intake created → QUALIFYING
- Approved → ACCEPTED
- SOC set → SCHEDULED
- First visit → ACTIVE

## 🚫 Explicit Rules
- Only ONE status per episode
- No "converted", "closed", or "pre-intake"
- Status must reflect real business state

## ❓ Open Questions
- What happens if patient fails NIA?
- What if no contact after X days?
- When do we move to DROPPED?

## 📌 Notes
CRM (Nexus/Link) is the source of truth — this is defining its logic.
```

***

## 📝 TASK TEMPLATE: LOB (Line of Business) Logic

**Title:**

```
LOB Handling Logic (Primary vs Secondary)
```

**Description:**

```
## 🎯 Objective
Define how multiple LOBs behave on one patient.

## ✅ Proposal
- One PRIMARY LOB drives status
- Secondary LOBs are tracked only
- Status reflects PRIMARY LOB progression

## 🔄 Example
Short-term ACTIVE + Long-term QUALIFYING  
→ Episode = QUALIFYING

## ❓ Open Questions
- How do we pick primary LOB?
- Can LOB switch mid-episode?

## 🚫 Rule
LOB must not override Episode status structure.
```

***

## 📝 TASK TEMPLATE: Authorization Logic

**Title:**

```
Authorization Handling (Non-Status Logic)
```

**Description:**

```
## 🎯 Objective
Prevent "authorized" from being misused as a status.

## ✅ Proposal
- Authorization is NOT a status
- It is a condition for moving forward

## 🔄 Logic
- ACCEPTED = internal approval
- SCHEDULED = requires auth approval (if needed)

## ❓ Questions
- Can we schedule without auth?
- What about pending auth cases?

## 🚫 Rule
Authorization must never define lifecycle stage.
```

***

# 💬 SECTION: DISCUSSION

👉 Use this section by **moving tasks here when under review**

### Add this comment template to every task:

```
## 💬 Feedback Format (Required)

1. Does this reflect real operations?
2. Is the status instantly understandable?
3. Does this remove ambiguity?
4. Will this help identify drop-offs?

## 🧠 Your Input:
- Agree / Disagree:
- Why:
- Real example:
```

***

# ⚠️ SECTION: EDGE CASES / BREAKPOINTS

## 📝 TASK TEMPLATE: Edge Case

**Title:**

```
[Edge Case] Patient fails NIA
```

**Description:**

```
## ⚠️ Scenario
Patient fails NIA assessment and must wait 6 months.

## ❓ Problem
Current system uses "pre-intake" (invalid).

## ✅ Required Decision
What should the Episode status be?

## 🧠 Options
- Stay in QUALIFYING
- Move to DROPPED
- Create "on hold" (avoid if possible)

## ✅ Final Decision
(To be filled after agreement)

## 🚫 Rule
Every edge case MUST map to a valid status.
```

***

### Create similar tasks:

```
[Edge Case] No contact after 7 days  
[Edge Case] Patient goes to competitor  
[Edge Case] Short-term active, long-term pending  
[Edge Case] Authorized but no intake  
[Edge Case] Multiple intakes conflict  
```

***

# ✅ SECTION: FINAL DECISIONS (LOCKED)

## 📝 TASK TEMPLATE: Finalized Rule

**Title:**

```
FINAL: Episode Status Definitions
```

**Description:**

```
## ✅ Final Definitions

(Write clean, final version)

## 🔒 Locked Rules
- One status per episode
- Status driven only by lifecycle stage

## 📅 Decision Date:
## 👥 Approved By:
```

👉 Only move here when:

* No open questions
* Team aligned
* Ready for CRM

***

# 🚧 SECTION: READY FOR CRM IMPLEMENTATION

## 📝 TASK TEMPLATE: Implementation Task

**Title:**

```
Implement Episode Status Logic in CRM
```

**Description:**

```
## 🎯 Objective
Translate final decisions into CRM configuration

## 🔧 Required Updates
- Update Episode status field values
- Remove:
  - Converted
  - Closed
  - Pre-intake
- Add:
  - QUALIFYING
  - ACCEPTED
  - SCHEDULED

## ⚙️ Dependencies
- Final decision approval

## ✅ Success Criteria
- No conflicting statuses
- Clear pipeline visibility
```

***

# 📚 SECTION: DOCUMENTATION (SOURCE OF TRUTH)

## 📝 TASK TEMPLATE: CRM STATUS PLAYBOOK

**Title:**

```
CRM Status Playbook (Official)
```

**Description:**

```
## 📘 Purpose
Official guide for CRM lifecycle

## 🔄 Lifecycle
(Insert final flow)

## ✅ Status Definitions
(Insert final definitions)

## 🚫 What is NOT allowed
- Pre-intake
- Converted
- Closed

## 🧠 Key Principle
CRM = single source of truth for patient lifecycle
```



***

# ✅ RESULT

With this template you get:

* Structured collaboration ✅
* No more messy debates ✅
* CRM-first thinking ✅
* Clear audit trail of decisions ✅
* Clean implementation path ✅

***
