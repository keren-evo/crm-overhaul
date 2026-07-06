# Asana sync — Nexus CRM discovery (paste into project)

Use this after the original sprint kit. Updates **EVO CRM Status Label Overhaul Sprint** with findings from [crm.linkhomecare.com](https://crm.linkhomecare.com/) Schema Manager and operational screens.

---

## Project description update (paste into Asana project description)

### Architecture (locked by discovery)

**Nexus CRM** at `https://crm.linkhomecare.com/` — not a generic `persons` table.

| Layer | Object | Master fields |
|-------|--------|---------------|
| Lifecycle | **Episode** | `status` (EpisodeStatus), `leadStage` (LeadStatus), `outcome` (ReferralOutcome) |
| Service line | **Patient** | Per-LOB fields (`lobLTC`, `lobSkilled`, …) + LOB timeline widget |
| Intake process | **Intake** | 130 fields, 24 picklists (subprocess only) |
| Authorization | **Authorization** | `baseStatus` (STRING today — migrate to picklist), `endDate` |

Episode description in Schema Manager: *"Tracks a single lifecycle from lead to discharge or drop. A patient can have many episodes."*

### Current Episode picklists (confirmed)

**EpisodeStatus (required):** New · Lead · Active · Converted · On Hold · Dropped · Discharged

**LeadStatus:** — None — · New · In Progress · Dropped Off · Converted

### Target model (Phase 0 sign-off)

| Top stage | Sub-status chip | Nexus home |
|-----------|-----------------|------------|
| Referral | New Referral | `leadStage` = New |
| Referral | In Progress Referral | `leadStage` = In Progress |
| Referral | Dropped Off Referral | `leadStage` = Dropped Off + `outcome` |
| Active | Authorized | `status` = Active + valid Authorization |
| Active | Non-Authorized / Expired | `status` = Active + missing/expired auth |
| Discharged | (reason) | `status` = Discharged + `outcome` |

**Retire from EpisodeStatus after migration:** New, Lead, Converted, On Hold (fold into Referral + leadStage). **Retire from LeadStatus:** Converted.

### Known production bug

Ticket *Episode Status* (Joel → Avi): auth end date updated but **top-line LOB status stays expired** (patient Ntelekos, Evdokia). Phase 4 must ship **auth save → recalc** automation.

### Success criteria (updated)

- Episode.status collapsed to **Referral / Active / Discharged** (3 values)
- Authorized **never** a top-level Episode status; only Active sub-status
- Leads list (56 today) shows granular Referral sub-status, not all "In Progress"
- True census = Episode Active + valid auth + SOC — not ~1,960 authorized
- `baseStatus` on Authorization migrated from free-text STRING to picklist
- Auth update recalculates display status immediately

### Repo artifacts

| Artifact | Path |
|----------|------|
| Nexus migration map | `crm/schema/nexus-episode-status-map.json` |
| Legacy map (superseded for Episode) | `crm/schema/legacy-status-map.json` |
| Asana task CSV | `crm/asana/evo-crm-sprint-tasks.csv` |

---

## Comment to pin on project (copy-paste)

Hi team — **Nexus discovery update** from Schema Manager + live CRM review. Please adjust tasks in Asana; do not start Phase 2 until Phase 0 signs the **Episode-centric** model below.

### What we learned

1. **Episode is the master lifecycle** — not a Patient-level status field. Fields: `status` (EpisodeStatus), `leadStage` (LeadStatus), `outcome` (ReferralOutcome).
2. **Patient** has 278 fields / 53 picklists — LOB timeline is separate from Episode.
3. **Intake** = subprocess (130 fields). **Authorization** `baseStatus` is a STRING (data integrity risk).
4. **Leads list** (56 records) — all show Lead Status "In Progress" → no funnel granularity today.
5. **Production bug** — updating auth end date does not refresh top-line expired status (ticket resolved; fix needed in automations).

### Current → target (Episode.status)

| Today | Target stage | Sub-status |
|-------|--------------|------------|
| New, Lead, Converted, On Hold | **Referral** | New / In Progress / Dropped Off Referral via `leadStage` |
| Active | **Active** | Authorized or Non-Authorized (computed from auth) |
| Dropped | **Referral** | Dropped Off Referral + outcome |
| Discharged | **Discharged** | outcome required |

### Phase 0 decisions still needed

- [ ] Active threshold: **SOC required** vs cleared-to-start?
- [ ] Export **ReferralOutcome** picklist values (drop + discharge reasons)
- [ ] One open Episode per patient vs multiple per LOB?
- [ ] Sign Framework v1 with Episode-centric model

### Owners (unchanged)

@Keren framework + audit · @Avi build + cutover · @Joel ops truth · @Angelo sales UAT · @Leah comms

**Next:** Phase 1 baselines via **Query Console** on Episode/Patient/Authorization — not legacy `persons` SQL.

---

## New / updated tasks by phase

### Phase 0 — add to sign-off

- [ ] Confirm **Episode** as master lifecycle (not Patient-level status)
- [ ] Confirm **Active threshold** (SOC vs cleared-to-start)
- [ ] Export and sign off **ReferralOutcome** picklist values
- [ ] Confirm **3-stage UI**: Referral → Active → Discharged + one sub-status chip
- [ ] Confirm **Leads list** shows computed Referral sub-status (not raw In Progress for all)

### Phase 1 — discovery complete / remaining

- [x] Document EpisodeStatus picklist values (7 values confirmed)
- [x] Document LeadStatus picklist values (5 values confirmed)
- [ ] Export ReferralOutcome picklist values
- [ ] Document which 3 objects share LeadStatus picklist
- [ ] Baseline: Episode.status distribution (Query Console)
- [ ] Baseline: leadStage = In Progress count (expect ~56+ on Leads view)
- [ ] Baseline: Episode.status = Converted (manual review queue)
- [ ] Baseline: Episode Active without valid Authorization
- [ ] Baseline: Authorization baseStatus value distribution (STRING audit)
- [ ] Map Nexus objects to audit SQL (Episode, Patient, Intake, Authorization — not `persons`)

### Phase 2 — schema (staging) — replace person.lifecycle_stage tasks

- [ ] Collapse **EpisodeStatus** → REFERRAL | ACTIVE | DISCHARGED
- [ ] Rename **LeadStatus** labels (New Referral, In Progress Referral, Dropped Off Referral)
- [ ] Retire **LeadStatus** value Converted
- [ ] Retire **EpisodeStatus** values New, Lead, Converted, On Hold (after backfill)
- [ ] Add **Authorization status picklist**; migrate off `baseStatus` STRING
- [ ] UI: show **leadStage** only when Episode.status = Referral
- [ ] UI: **Episode progress bar** Referral → Active → Discharged
- [ ] Publish `crm/schema/nexus-episode-status-map.json` in Schema Manager docs

### Phase 3 — remediation batches (Episode-centric)

- [ ] Migrate Episode.status New/Lead/Converted/On Hold → REFERRAL + leadStage
- [ ] Migrate Episode.status Dropped → REFERRAL + Dropped Off + outcome
- [ ] Split legacy Patient **closed** → Discharged vs Dropped Off Referral
- [ ] Remediate Episode Active without valid auth → flag Non-Authorized
- [ ] Remediate leadStage = None with open pipeline status
- [ ] Remediate leadStage = Converted (retire value)
- [ ] CDPAP / Girling / orphan authorized batches (unchanged intent)

### Phase 4 — automations (add)

- [ ] **Auth save → recalc** Episode sub-status + LOB timeline (Ntelekos fix)
- [ ] Nightly auth expiry → Active Non-Authorized alert
- [ ] Block Discharged unless Episode was Active historically
- [ ] Require **outcome** on Dropped Off Referral and Discharged
- [ ] Service-line drop ≠ patient discharge unless last active LOB + confirm

### Phase 5 — dashboards (add)

- [ ] **Patients → Leads** list: computed status column (Referral / sub-status)
- [ ] **Episode Status** header widget aligned to 3-stage model
- [ ] True census widget: Episode ACTIVE + valid auth + SOC (not authorized count)
- [ ] Funnel: drop by **outcome** + referral source
- [ ] Ops queue: Active Non-Authorized / expired auth on active episodes
