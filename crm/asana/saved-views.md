# Asana saved views — CRM Status Architecture Rebuild

Create in the project: **Add view** → configure filters → **Save view**.

---

## 1. This week

| Setting | Value |
|---------|-------|
| Layout | List |
| Filter | Due date = This week |
| Filter | Incomplete |
| Sort | Due date ascending |
| Group | Section |

**Use for:** Weekly standup.

---

## 2. Decision gates

| Setting | Value |
|---------|-------|
| Layout | List |
| Filter | Decision Gate = Yes **OR** Requires Stakeholder Decision = Yes |
| Filter | Incomplete |
| Sort | Priority ascending |
| Group | Section |
| Columns | Task, Assignee, Workstream, Baseline / Target Metric |

**Use for:** Joel workshop prep and sign-off sessions.

**Key tasks:** All §2 Definitions decisions · Ops 50-record review · Sales/Ops UAT · Go/no-go · Florida delta

---

## 3. Blocked

| Setting | Value |
|---------|-------|
| Layout | List |
| Filter | Blocker = Yes |
| Filter | Incomplete |
| Group | Section |

**Use for:** Milestone tracking — 6 gates total.

---

## 4. Baseline audit

| Setting | Value |
|---------|-------|
| Layout | List |
| Filter | Workstream = Baseline |
| Sort | Priority |
| Columns | Task, Assignee, Baseline / Target Metric, Subtasks |

**Use for:** Filling census gap and cohort counts during §3.

---

## 5. Avi — implementation

| Setting | Value |
|---------|-------|
| Layout | Board |
| Filter | Assignee = Avi |
| Group | Section |

**Use for:** Build, remediation, dashboards, go-live workload.

---

## 6. Go-live day

| Setting | Value |
|---------|-------|
| Layout | List |
| Filter | Section = Production Go-Live |
| Filter | Incomplete |
| Sort | Dependencies / manual order |

**Critical order:** Go/no-go → Leah comms → Prod remediation → Enable rules → Switch dashboards → Census validation → Hypercare

---

## 7. Growth (post-launch)

| Setting | Value |
|---------|-------|
| Layout | List |
| Filter | Workstream = Growth |
| Filter | Incomplete |

**Use for:** After Production live milestone — do not start early.

---

## Pin recommended

**Decision gates** · **Blocked** · **This week**
