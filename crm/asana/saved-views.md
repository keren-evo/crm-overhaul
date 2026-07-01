# Asana saved views — EVO CRM Status Label Overhaul Sprint

Create these in the project: **Add view** → configure filters → **Save view**.

---

## 1. This week

| Setting | Value |
|---------|-------|
| Layout | List |
| Filter | Due date = This week |
| Filter | Incomplete tasks |
| Sort | Due date ascending |
| Group | Section |

**Use for:** Weekly standup — what is due now.

---

## 2. Blocked

| Setting | Value |
|---------|-------|
| Layout | List |
| Filter | **Blocker** = Yes |
| Filter | Incomplete tasks |
| OR filter | Tasks with unresolved dependencies (Asana "Blocked" smart list if available) |
| Sort | Section order |
| Group | Section |

**Use for:** Unblock conversation — Phase 0 gates and milestones.

**Manual check:** Project → **Timeline** or task detail → Dependencies tab for tasks waiting on predecessors.

---

## 3. Stakeholder decisions

| Setting | Value |
|---------|-------|
| Layout | List |
| Filter | **Requires Stakeholder Decision** = Yes |
| Filter | Incomplete tasks |
| Sort | Phase ascending |
| Group | Section |
| Columns | Task name, Assignee, Phase, Baseline / Target Metric |

**Use for:** Joel/Speaker 1 decision sessions — workshop items, ops sign-off, UAT, FL checklist.

**Expected tasks (incomplete until resolved):**

- All Phase 0 workshop tasks (7)
- Ops sign-off on 50 remediated records
- UAT with Angelo
- Final stakeholder sign-off on staging UAT
- Create Florida delta checklist

---

## 4. Phase 1 audit

| Setting | Value |
|---------|-------|
| Layout | List |
| Filter | **Phase** = 1 |
| Sort | **Audit Section** ascending |
| Group | None |
| Columns | Task name, Audit Section, Baseline / Target Metric, Assignee, Due date |

**Use for:** Running `data-integrity-audit.sql` section by section; fill Baseline / Target Metric as counts come in.

**Section reference:**

| Audit Section | SQL section |
|---------------|-------------|
| 0 | Baseline summary |
| 1 | Authorized without valid auth |
| 2 | Authorized + dropped/voided intake |
| 3 | CDPAP remediation queue |
| 4 | Third-party referrals (Girling) |
| 5 | Conflicting legacy tags |
| 6 | Multi-intake conflicts |
| 7 | Short-term-only pipeline |
| 8 | Stale anticipated SOC |
| 9 | Census reconciliation |
| 10 | Stale active 12+ mo |
| 11 | Medicaid deferred > 30d |
| 12 | Duplicate candidates |
| 13 | Intake column count |
| 14 | Remediation batch IDs |

---

## 5. Go-live checklist

| Setting | Value |
|---------|-------|
| Layout | List |
| Filter | **Phase** = 6 |
| Filter | Incomplete tasks |
| Sort | Due date ascending |
| Group | None |
| Columns | Task name, Assignee, Blocker, CRM Environment, Depends on |

**Use for:** Production cutover day — sequential execution.

**Critical order:**

1. Final stakeholder sign-off on staging UAT
2. Production migration window scheduled (Leah)
3. Run remediation batch in production
4. Enable validation rules + computed lifecycle
5. Switch dashboards
6. Post-cutover audit Section 9 (milestone)
7. Monitor SLA 2 weeks

---

## 6. By assignee (optional)

Create one saved view per owner filtering **Assignee**:

| View name | Assignee | Phases |
|-----------|----------|--------|
| Avi — implementation | Avi | 2, 3, 4, 5, 6 |
| Keren — discovery | Keren | 0, 1, Ongoing |
| Joel — ops | Joel | 0, 3, 5 |
| Leah — comms | Leah | 6, 7 |
| Angelo — sales UAT | Angelo | 5 |

---

## Pin recommended views

Pin to project header: **Blocked**, **Stakeholder decisions**, **This week**.
