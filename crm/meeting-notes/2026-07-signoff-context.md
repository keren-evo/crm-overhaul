# Sign-Off Context — Jul 2026 (chat handoff)

**Purpose:** Full context from CRM sign-off prep work — leadership feedback, meeting playbook, artifacts, gates, and next steps.  
**Audience:** Keren (handoff / new chat / stakeholders joining mid-stream)  
**Status:** Pending sign-off — Joel (ops) → Avi → Leah coordinates → Hillel (CEO) final  
**Hub:** [`../onedrive-hub/index.html`](../onedrive-hub/index.html) · [GitHub Pages](https://keren-evo.github.io/crm-overhaul/)

---

## 1. Situation & leadership feedback

**What happened:** Leah relayed feedback from Hillel (CEO). Leadership finds the **Asana board and technical language too complicated** — nobody is following it. They want the **simple idea first**, not actionables, glossary walkthroughs, or project machinery.

**Core tension:** Process was leading (Asana → glossary → Avi). Leadership wants Joel’s operating picture in plain English.

**Problem is already agreed (don’t re-teach in meetings):**

- Screens and ops don’t share language
- **Authorized ≠ Active** (~1,960 dashboard vs ~1,200–1,300 true census)
- Legacy Salesforce labels cause conflicting tags on one record

**Why sign-off was paused:** On an alignment call, COO and CEO were still working through points live — nothing was treated as locked without an explicit yes.

**Polite framing:**

> “On the alignment call, leadership was still working through a few points live, so I held off treating the glossary as approved. I’m bringing back one simple path for a clean yes.”

---

## 2. What this build is

**Not** a marketing campaign launch. **Primary work:** CRM status/lifecycle rebuild for **Link Homecare NY** on **Nexus** (`crm.linkhomecare.com`).

**Secondary (later):** Evo Growth stack (LeadTrap, Meta, attribution) — only after CRM stages are trustworthy.

**Program goals:**

1. Trustworthy census (Active = in care, not “authorized”)
2. Clear workflow (stage visible in ≤3 seconds)
3. Growth-ready data (~10 drop reasons, reliable funnel)

**Gate:** Joel (ops) signs → Avi signs *(Joel schedules review)* → Leah coordinates → **Hillel (CEO)** final sign → **one-pass** CRM update (labels + filters + backfill). **No CRM field changes until Joel, Avi, and Hillel sign.**

---

## 3. Joel’s model — freeze this

```
Lead → Qualifying → Referral in Progress → Active → Discharged
                    ↘ Dropped Off (never became Active)
```

| Stage | Plain English |
|-------|----------------|
| **Lead** | Brand-new inquiry |
| **Qualifying** | Checking fit — intake **not** open yet |
| **Referral in Progress** | Intake open for a specific program |
| **Active** | **Receiving care** = real census |
| **Discharged** | Left agency after being Active |
| **Dropped Off** | Never became Active |

**Two rules:**

1. **Authorized ≠ Active** — payer yes vs we are giving care
2. **Dropped Off ≠ Discharged** — never started vs was in care, then left

**Extras (if room):**

- **Short-term:** parallel icon track until ST authorized → main bar = Active
- **Multi-LOB:** one person, multiple programs; drop one LOB ≠ discharge patient

---

## 4. Meeting playbook

**Open (20–30 sec):**

> “We already agreed the problem — screens and ops don’t match, authorized isn’t census. Today is only: confirm Joel’s path as the language we freeze. No board, no slides.”

**Center (2–3 min):** Walk five stages + Dropped Off. Hard pause: *“Does this match how Link works?”*

**Ask (45 sec):**

> “Is Joel’s path the language we freeze? Yes → sign and move. No → we fix the one sentence that’s off, here.”

**Do not:** Open Asana, walk glossary line-by-line, preview Avi tickets, or pitch growth/LeadTrap.

**Reset if they drift:**

> “Reset — problem’s locked. We’re only confirming Joel’s path. Still on that?”

**Pocket card:** Idea first · Authorized ≠ Active · Joel’s path · Dropped ≠ Discharged · Joel → Avi → Leah → Hillel sign · No Asana in room

---

## 5. Sign-off roles

| Who | Role |
|-----|------|
| **Joel Schlanger** | Ops truth — signs first; path, SOC, NIA, drop reasons; schedules Avi review |
| **Avi** | CRM implementation — signs after Joel |
| **Hillel** | CEO — final executive sign-off |
| **Leah Adelman** | Calendar and team scheduling |
| **Keren** | Prepared framework docs |

**Hillel (30 sec):**

> “I need your final executive sign-off on Joel’s simple path. Joel locks ops truth, Avi confirms we can build it, then my yes lets the CRM update proceed. Joel owns the details.”

---

## 6. Artifacts

| Artifact | Path |
|----------|------|
| Hub / index | `crm/onedrive-hub/index.html` → `docs/index.html` |
| One-pager (**send first**) | `crm/glossary/joel-model-signoff-onepager.md` |
| Full glossary v2.1 | `crm/glossary-pipeline-v2.md` |
| Flowcharts | `crm/flowcharts/pipeline-flowcharts-v1.md` |
| Drop reasons (10) | `crm/glossary/drop-reasons-for-signoff.md` |
| Teams/email ask (**internal**) | `crm/glossary/_teams-ask-glossary-signoff.md` |
| Full hub index | `crm/onedrive-hub/hub.html` |
| Comment UI | `crm/onedrive-hub/signoff-comments.css`, `signoff-comments.js` |

**Build:** `powershell -File crm/build-pages.ps1`  
**OneDrive sync:** `powershell -File crm/sync-to-onedrive.ps1`

**Comments:** Each glossary row has a **Comments** column on web pages. Reviewers use **Copy all comments** and share feedback when finished (saved in browser localStorage).

**Canvas (Cursor only, not in hub):** `canvases/joel-patient-pipeline.canvas.tsx` — visual for Keren’s prep; facilitator script removed.

---

## 7. Open items at Joel sign-off

| Item | Default |
|------|---------|
| Active requires confirmed **SOC** | Yes |
| NIA fail → reapply wait | ~180 days (Joel confirm) |
| Multi-LOB master bar | Most advanced open gold LOB |
| 10 drop reasons | Sign drop-reasons sheet |
| Short-term icon model | Parallel until Authorized → Active |
| NHTD / OPWDD / Private Pay checklists | Joel-owned; doesn’t block Avi meeting |

---

## 8. What to send

**Send:** Index or one-pager — not Asana.

**Subject:** Approve Joel’s patient path — Joel → Avi → Hillel sign-off

**Voice (30 sec):**

> “Problem’s locked. I need Joel’s ops yes on five stages plus Dropped Off, Avi’s build yes, then Hillel’s final executive yes. That unlocks the CRM update. Board stays out of this.”

**After gate complete:** Joel → Avi · Leah → calendar · one-pass build

---

## 9. Repo layout

```
crm/                    ← source of truth
  glossary/             ← sign-off markdown
  onedrive-hub/         ← index, hub, signoff-comments.*
  meeting-notes/        ← this file + workshop notes
  scripts/md-to-html.py
  build-pages.ps1       ← crm → docs/
  sync-to-onedrive.ps1
docs/                   ← built static site (GitHub Pages)
```

`crm/README.md` ends after Sign-off package + GitHub links (OneDrive/internal sections removed).

---

## 10. One-sentence summary

**Fix how Link counts patients from inquiry to Active census — Joel, Avi, and Hillel sign Joel’s simple path (Leah coordinates) — then Avi updates Nexus once; growth and Asana wait until the words match the floor.**
