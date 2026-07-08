# Sign-Off Package → Asana Map

**Gate:** Joel → Avi → Hillel (CEO) · cc Leah  
**Web package:** [Sign-off index](https://keren-evo.github.io/crm-overhaul/)  
**Asana section:** §2 Business Definitions & Sign-Off  
**Milestone:** 🏁 Sign Status Framework v1 *(blocks §5 CRM Build — Staging)*

---

## Web docs → Asana tasks

| # | Sign-off package page | Repo / URL | Primary Asana task |
|---|------------------------|------------|-------------------|
| — | **Index** (landing) | `onedrive-hub/index.html` | **Sign Status Framework v1** (milestone) |
| 1 | **Patient path — one-pager** | `glossary/joel-model-signoff-onepager.md` | **Confirm master lifecycle model** (Joel) |
| 2 | **Full glossary** | `glossary-pipeline-v2.md` | **Refine CRM glossary** (Keren) |
| 3 | **Pipeline flowcharts** | `flowcharts/pipeline-flowcharts-v1.md` | **Finalize patient status labels and lifecycle flowcharts** (Keren) |
| 4 | **Drop reasons** | `glossary/drop-reasons-for-signoff.md` | **Simplify drop reasons to ~10 categories** (Keren) + **Export and sign off ReferralOutcome picklist** (Avi) |

**Supporting tasks** (same section, not separate web pages):

| Topic | Asana task | Assignee |
|-------|------------|----------|
| SOC / census definition | Confirm census definition | Joel |
| NIA 180-day wait | Joel: Confirm NIA re-application waiting period | Joel |
| LOB checklists | Document LOB eligibility criteria matrix | Joel |
| Short-term icon model | Document short-term care integration rules | Keren |
| Layer model (Episode vs intake vs auth) | Confirm layer separation model | Keren |

---

## Sign-off steps → Asana (who does what)

| Step | Who | Asana task / action |
|------|-----|---------------------|
| **1** | **Joel** | **Confirm master lifecycle model** — mark complete when one-pager path is yes |
| **2** | **Avi** | **Export and sign off ReferralOutcome picklist** — feasibility + drop-reason mapping |
| **3** | **Hillel** | Subtask on **Sign Status Framework v1**: executive sign-off (final) |
| **cc** | **Leah** | Collaborator on milestone; subtask: schedule Avi review + calendar after Joel signs |
| **Compile** | **Keren** | **Sign Status Framework v1** — publish package, collect comments, mark milestone when all three sign |

**Dependency chain in Asana:**

```
Finalize flowcharts
    → Sign Status Framework v1  🏁
        → §5 CRM Build — Staging (blocked until milestone)
```

---

## Comments → Asana (consolidated feedback)

| What | Where |
|------|--------|
| Executives type comments | Web package — Comments column on each doc |
| Each person exports | Index → **Copy all comments** |
| **You consolidate** | Paste as **one comment** on **Sign Status Framework v1** (pin this task) |
| Optional inbox | Duplicate task: **Sign-off feedback inbox** — only for pasted comments, not the full board |

Do **not** send executives into §1–§10 task lists during sign-off. One milestone task + one-pager link is enough.

---

## Minimal Asana view for leadership

Create a saved view **“Sign-off only”**:

| Filter | Value |
|--------|--------|
| Section | Business Definitions & Sign-Off |
| Tasks | Confirm master lifecycle model · Sign Status Framework v1 · Export ReferralOutcome picklist |
| Or | Decision Gate = Yes |

**3 tasks visible.** Everything else hidden until gate clears.

---

## After gate complete

| Next Asana work | Trigger |
|-----------------|---------|
| Joel: Schedule CRM implementation review with Avi's team | Joel signed |
| §5 CRM Build — Staging | Sign Status Framework v1 milestone ✅ |
| Leah: coordinate Avi calendar | cc on milestone — not a signatory row |

---

## Quick paste for Asana project description

```
Sign-off package: https://keren-evo.github.io/crm-overhaul/
Gate: Joel → Avi → Hillel (CEO) · cc Leah
Milestone: Sign Status Framework v1 blocks CRM build.
Feedback: paste Copy all comments onto Sign Status Framework v1 task.
```
