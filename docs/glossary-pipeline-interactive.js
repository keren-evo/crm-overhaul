/**
 * Interactive pipeline glossary — proposed model, flowchart-first UX.
 */
(function (global) {
  "use strict";

  var STORAGE_PREFIX = "link-crm-signoff:";
  var VIEWS = {
    main: {
      label: "Main path",
      nodes: [
        { id: "lead", label: "Lead" },
        { id: "qualifying", label: "Qualifying" },
        { id: "referral", label: "Referral in Progress" },
        { id: "active", label: "Active" },
        { id: "discharged", label: "Discharged" },
      ],
      drop: { id: "dropped", label: "Dropped Off" },
    },
    shortterm: {
      label: "Short-term",
      nodes: [
        { id: "st-progress", label: "In Progress" },
        { id: "st-accepted", label: "Accepted" },
        { id: "st-startup", label: "Startup" },
        { id: "st-authorized", label: "Authorized" },
        { id: "active", label: "Main bar → Active" },
      ],
    },
    multilob: {
      label: "Multi-LOB",
      nodes: [
        { id: "patient", label: "Patient" },
        { id: "master", label: "Master bar" },
        { id: "lob-ltc", label: "LTC track" },
        { id: "lob-st", label: "Short-term track" },
      ],
    },
    nia: {
      label: "NIA (LTC)",
      nodes: [
        { id: "referral-ltc", label: "Referral in Progress" },
        { id: "nia-scheduled", label: "NIA Scheduled" },
        { id: "nia-outcome", label: "NIA Outcome" },
        { id: "auth-path", label: "Authorization" },
        { id: "active", label: "Active" },
      ],
      drop: { id: "nia-failed", label: "NIA Failed" },
    },
  };

  var STAGES = {
    lead: {
      title: "Lead",
      plain: "New inbound or created record with no qualification yet",
      when: "Record created; little or no outreach yet",
      entry: "Record created · No qualification activity completed",
      exit: "Moves to Qualifying · Or marked Dropped Off",
      not: "Active patient; authorized; already in qualification",
      who: "Growth / Sales / Intake (confirm)",
      impact: "Feeds top-of-funnel volume · Impacts true demand measurement",
      map: '"New", "Lead" → Lead',
      crmToday: 'EpisodeStatus "New" or "Lead"; LeadStatus "New"',
      anchor: "#1-master-patient-pipeline-agreed",
    },
    qualifying: {
      title: "Qualifying",
      plain: "Lead in progress — checking fit before intake opens",
      when: "Contact started; insurance, diagnosis, and LOB eligibility confirmed; intake not yet opened",
      entry: "Outreach / eligibility work started · Intake not opened",
      exit: "Moves to Referral in Progress · Or marked Dropped Off",
      not: "Referral in Progress; intake opened",
      who: "Enrollment specialists (confirm)",
      impact: "Separates real qualification from vague In Progress · Protects funnel conversion accuracy",
      map: '"In Progress" (pre-intake) → Qualifying',
      crmToday: 'LeadStatus "In Progress" (often used for everyone — ~56 leads today); EpisodeStatus "Lead"',
      anchor: "#1-master-patient-pipeline-agreed",
    },
    referral: {
      title: "Referral in Progress",
      plain: "Intake opened for a specific line of business",
      when: "Enrollment opened intake and is processing patient for a specific line of business",
      entry: "Intake opened for a LOB · Pre-Active work underway",
      exit: "Moves to Active (SOC) · Or marked Dropped Off",
      not: 'Generic "in progress"; master label "Intake"; legacy "Converted"',
      who: "Enrollment specialists / Intake (confirm)",
      impact: "Makes intake-open work explicit · Improves LOB handoffs and stage conversion",
      map: '"In Progress" / "Converted" / "On Hold" → Referral in Progress',
      crmToday: 'LeadStatus "In Progress" or legacy "Converted"; EpisodeStatus "Converted" / "On Hold"',
      anchor: "#1-master-patient-pipeline-agreed",
    },
    active: {
      title: "Active",
      plain: "Receiving agency service under at least one LOB",
      when: "Patient is actively serviced under at least one LOB (SOC confirmed)",
      entry: "SOC confirmed · Service started on at least one LOB",
      exit: "Moves to Discharged when no active LOBs remain",
      not: "Authorized only; referral still being worked",
      who: "Operations / Enrollment (confirm)",
      impact: "Census accuracy · Eliminates inflated Active counts from authorization-only records",
      map: '"Active" (true SOC) stays Active · "Authorized" alone does not',
      crmToday: 'EpisodeStatus "Active" — but "authorized" inflates census (~1,960 vs ~1,200 true active)',
      anchor: "#1-master-patient-pipeline-agreed",
    },
    discharged: {
      title: "Discharged",
      plain: "Left the agency after having been Active",
      when: "No active LOBs remain; patient ended relationship with Link",
      entry: "Was Active · All LOBs ended · Relationship closed",
      exit: "Terminal — no further main-path stage",
      not: "Dropped Off; temporary pause",
      who: "Operations (confirm)",
      impact: "Preserves outcomes reporting · Separates never-started from previously active",
      map: '"Discharged" → Discharged (only if previously Active)',
      crmToday: 'EpisodeStatus "Discharged" (same label — requires patient was Active once)',
      anchor: "#1-master-patient-pipeline-agreed",
    },
    dropped: {
      title: "Dropped Off",
      plain: "Terminal exit before ever becoming Active",
      when: "Opted out, ineligible, or failed qualification before first Active service",
      entry: "Any pre-Active stage · Record will not proceed to Active",
      exit: "Terminal — not Discharged",
      not: 'Discharged; legacy "Closed"',
      who: "Enrollment specialists (confirm)",
      impact: "Keeps drop reasons measurable · Prevents false discharge / census distortion",
      map: '"Dropped" / "Dropped Off" → Dropped Off (pre-Active only)',
      crmToday: 'EpisodeStatus "Dropped"; LeadStatus "Dropped Off" — not the same as Discharged',
      anchor: "#1-master-patient-pipeline-agreed",
    },
    "st-progress": {
      title: "Short-term — In Progress",
      plain: "NH referral received; CHHA evaluating",
      when: "Parallel icon track — does not move main bar yet",
      not: "Main pipeline Active",
      who: "Enrollment / intake",
      crmToday: "Short-term LOB fields exist; main bar often unchanged until authorized",
      anchor: "#3-short-term-care-parallel-track-agreed",
    },
    "st-accepted": {
      title: "Short-term — Accepted",
      plain: "CHHA agrees to take patient",
      when: "Hours may be limited while startup continues",
      not: "Main bar Active until Authorized",
      who: "Enrollment",
      crmToday: "Per-LOB short-term substatus — not always visible on master bar",
      anchor: "#3-short-term-care-parallel-track-agreed",
    },
    "st-startup": {
      title: "Short-term — Startup",
      plain: "Pre-service setup",
      when: "Still on parallel short-term track",
      not: "Main census Active",
      who: "Operations",
      crmToday: "Parallel track only — main bar stays on Referral path",
      anchor: "#3-short-term-care-parallel-track-agreed",
    },
    "st-authorized": {
      title: "Short-term — Authorized",
      plain: "Receiving short-term services",
      when: "Promote main pipeline bar to Active",
      not: "Payer authorized only without service",
      who: "Operations",
      crmToday: "Authorized often confused with Active today — new model promotes main bar here",
      anchor: "#3-short-term-care-parallel-track-agreed",
    },
    patient: {
      title: "Patient (multi-LOB)",
      plain: "One person, multiple programs possible",
      when: "Each LOB can be at a different work substep",
      not: "One status fits all programs",
      who: "Enrollment specialists",
      crmToday: "Patient object (278 fields) — LOB timeline separate from Episode",
      anchor: "#4-multi-lob-view-agreed",
    },
    master: {
      title: "Master bar",
      plain: "Single stage on the main path",
      when: "Shows highest forward progress on any open gold LOB",
      not: "Per-LOB detail (see LOB row)",
      who: "System + enrollment updates",
      crmToday: "Episode.status today mixes Referral + Active + legacy values on one picklist",
      anchor: "#4-multi-lob-view-agreed",
    },
    "lob-ltc": {
      title: "LTC per-LOB track",
      plain: "Long-term care intake at its own stage",
      when: "Example: LTC still in Referral in Progress while another LOB is Active",
      not: "Same as master bar automatically",
      who: "Enrollment specialists",
      crmToday: "Patient LOB fields (lobLTC, etc.) — stage can differ from master",
      anchor: "#4-multi-lob-view-agreed",
    },
    "lob-st": {
      title: "Short-term per-LOB track",
      plain: "Short-term program at its own stage",
      when: "Example: Short-term Active while LTC still in referral funnel",
      not: "Discharge of one LOB unless it was the last active LOB",
      who: "Enrollment specialists",
      crmToday: "Short-term custodial on Patient — icon track in new UI",
      anchor: "#4-multi-lob-view-agreed",
    },
    "referral-ltc": {
      title: "Referral in Progress (LTC)",
      plain: "LTC intake open; NIA path applies",
      when: "MLTC/LTC line — NIA required before authorization",
      not: "NIA passed without scheduling",
      who: "Enrollment specialists",
      crmToday: "Same ambiguous In Progress / Converted labels on Episode today",
      anchor: "#7-nia-new-york-independent-assessor-agreed",
    },
    "nia-scheduled": {
      title: "NIA Scheduled",
      plain: "NY Independent Assessor appointment set",
      when: "Inside Referral in Progress — intake.nia_status layer",
      not: "Master pipeline stage (chip/filter only)",
      who: "Enrollment specialists",
      crmToday: "nia_status field on Intake — not a master bar label",
      anchor: "#7-nia-new-york-independent-assessor-agreed",
    },
    "nia-outcome": {
      title: "NIA Outcome",
      plain: "Pass or fail from assessor",
      when: "Pass → authorization path; Fail → drop or ~180-day wait",
      not: "Automatic Active on pass without SOC",
      who: "Enrollment specialists",
      crmToday: "NIA Passed / NIA Failed on intake — separate from Episode.status",
      anchor: "#7-nia-new-york-independent-assessor-agreed",
    },
    "auth-path": {
      title: "Authorization path",
      plain: "Payer approved services",
      when: "After NIA pass — authorization linked to intake",
      not: "Active — service not started until SOC",
      who: "Operations, enrollment",
      crmToday: '"Authorized" used as pseudo-status today — inflates census; becomes chip only',
      anchor: "#6-intake-authorization-medicaid-layers-not-master-status",
    },
    "nia-failed": {
      title: "NIA Failed → Dropped Off",
      plain: "Did not pass independent assessor",
      when: "Terminal drop or ~180-day re-engage queue",
      not: "Discharged; On Hold without follow-up date",
      who: "Enrollment specialists",
      crmToday: "Often mixed with Pre-Intake / On Hold — new model uses drop reason + follow-up",
      anchor: "#7-nia-new-york-independent-assessor-agreed",
    },
  };

  var activeView = "main";
  var activeStage = null;
  var activeLayerTab = null;
  var activeLayerItem = null;
  var activeDetailPanel = "status";
  var tooltipEl = null;

  function docIdFromPath() {
    return location.pathname.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "") || "signoff";
  }

  function storageKey(docId, fieldId) {
    return STORAGE_PREFIX + docId + ":" + fieldId;
  }

  function commentFieldId(stageId) {
    return "explorer:" + activeView + ":" + stageId;
  }

  function el(id) {
    return document.getElementById(id);
  }

  function stageMeta(id) {
    if (id === "dropped" || id === "nia-failed") return { badge: "Terminal", tone: "warning" };
    if (id.indexOf("st-") === 0) return { badge: "Short-term", tone: "shortterm" };
    if (id === "patient" || id === "master" || id.indexOf("lob-") === 0)
      return { badge: "Multi-LOB", tone: "multilob" };
    if (id.indexOf("nia-") === 0 || id === "referral-ltc" || id === "auth-path")
      return { badge: "NIA branch", tone: "nia" };
    if (id === "active") return { badge: "Main path", tone: "success" };
    if (id === "discharged") return { badge: "Main path", tone: "neutral" };
    return { badge: "Main path", tone: "default" };
  }

  function needsCompare(s) {
    return s.crmToday && s.crmToday.indexOf("same label") === -1;
  }

  function displayStageId() {
    if (activeStage && STAGES[activeStage]) return activeStage;
    var view = VIEWS[activeView];
    return view && view.nodes.length ? view.nodes[0].id : null;
  }

  function whyBetter(stageId) {
    if (stageId === "lead") {
      return "Protects true demand measurement — brand-new volume is not mixed with qualification work.";
    }
    if (stageId === "qualifying") {
      return "Fixes funnel visibility — pre-intake work is no longer buried in a vague In Progress bucket.";
    }
    if (stageId === "referral" || stageId === "referral-ltc") {
      return "Makes intake-open work explicit — stage-to-stage conversion and LOB handoffs become measurable.";
    }
    if (stageId === "active" || stageId === "auth-path") {
      return "Protects census accuracy — payer approval alone can no longer inflate Active counts.";
    }
    if (stageId === "discharged" || stageId === "dropped" || stageId === "nia-failed") {
      return "Keeps outcomes honest — never-started is not reported as previously active.";
    }
    if (stageId.indexOf("st-") === 0) {
      return "Keeps short-term progress visible without distorting main-path census before service starts.";
    }
    if (stageId === "patient" || stageId === "master" || stageId.indexOf("lob-") === 0) {
      return "Supports multi-program reality — one patient can have different LOB states without ambiguous master labels.";
    }
    if (stageId.indexOf("nia-") === 0) {
      return "Surfaces NIA/auth work as explicit substeps — not hidden inside one disputed status.";
    }
    return "One meaning per label — reporting and decisions stop depending on tribal knowledge.";
  }

  function businessImpactCopy() {
    return (
      "Census accuracy (eliminates inflated counts) · Funnel visibility (clean stage-to-stage conversion) · " +
      "Growth attribution (source → active tracking) · Operational consistency (same logic across teams)"
    );
  }

  function stageEntry(s) {
    return s.entry || s.when;
  }

  function stageExit(s) {
    return s.exit || ("Should NOT mean: " + s.not);
  }

  function stageMap(s) {
    return s.map || s.crmToday || "Confirm current → proposed mapping";
  }

  function stageImpact(s, stageId) {
    return s.impact || whyBetter(stageId);
  }

  function stageDescriptor(stageId) {
    if (stageId === "lead") return "Main status · Layer A · pre-intake funnel";
    if (stageId === "qualifying") return "Main status · Layer A · pre-intake qualification";
    if (stageId === "referral") return "Main status · Layer A with Layer B/C underneath";
    if (stageId === "active") return "Main status · Episode.status · post-SOC service";
    if (stageId === "discharged") return "Main status · Episode.status terminal";
    if (stageId === "dropped") return "Main status · Layer A terminal · before Active";
    if (stageId.indexOf("st-") === 0) return "Short-term track · separate dimension";
    if (stageId === "patient" || stageId === "master" || stageId.indexOf("lob-") === 0) {
      return "Multi-LOB layer · patient and per-LOB context";
    }
    if (stageId === "referral-ltc" || stageId.indexOf("nia-") === 0 || stageId === "auth-path") {
      return "Referral work layer · under Referral in Progress";
    }
    return "Glossary layer";
  }

  function layerSetsForView(viewKey, stageId) {
    if (viewKey === "main") {
      if (!stageId || stageId === "lead" || stageId === "discharged") return [];
      if (stageId === "qualifying") {
        return [
          {
            key: "qualifying-work",
            label: "Qualifying",
            title: "Eligibility and pre-intake work",
            note: "Qualifying is still pre-intake. It is about fit, not intake-open operations.",
            items: [
              { id: "qual-eligibility", title: "Eligibility check", summary: "Confirm insurance, diagnosis, and line-of-business fit", lives: "Enrollment review", rule: "This is why Qualifying exists separately from Referral in Progress" },
              { id: "qual-lob", title: "Potential LOBs", summary: "Identify which programs may apply before opening intake", lives: "Enrollment specialist judgment", rule: "A LOB can be considered before any intake record exists" },
              { id: "qual-medicaid", title: "Medicaid / payer context", summary: "Coverage can be known early, but it does not make the patient Referral in Progress", lives: "Insurance and payer verification", rule: "No intake, NIA, auth, or SOC layers yet" },
            ],
          },
          {
            key: "qual-transitions",
            label: "Transitions",
            title: "What can happen next",
            note: "Qualifying has only two true exits in the agreed model.",
            items: [
              { id: "qual-to-rip", title: "Qualifying → Referral in Progress", summary: "Intake opened for a LOB", lives: "Master pipeline", rule: "This is the moment intake-open work begins", stageId: "referral" },
              { id: "qual-to-drop", title: "Qualifying → Dropped Off", summary: "Patient never became Active", lives: "Master pipeline + drop reason", rule: "Use when qualification fails or the patient opts out", stageId: "dropped" },
            ],
          },
        ];
      }
      if (stageId === "referral") {
        return [
          {
            key: "transitions",
            label: "Transitions",
            title: "Transition rules",
            note: "Referral in Progress has the richest operational layers behind it.",
            items: [
              { id: "t-qual-rip", title: "Qualifying → Referral in Progress", summary: "Intake opened for a LOB", lives: "Master pipeline", rule: "Intake-open work starts here" },
              { id: "t-rip-active", title: "Referral in Progress → Active", summary: "SOC confirmed on at least one LOB", lives: "Master pipeline + SOC gate", rule: "Assumption: SOC required — confirm at sign-off", stageId: "active" },
              { id: "t-preactive-drop", title: "Referral in Progress → Dropped Off", summary: "Terminal before Active", lives: "Master pipeline + drop reason", rule: "Requires drop reason (~10 categories)", stageId: "dropped" },
            ],
          },
          {
            key: "layer-b",
            label: "Layer B",
            title: "Work substeps inside Referral in Progress",
            note: "These do not replace Referral in Progress on the main bar.",
            items: [
              { id: "pending-docs", title: "Pending documents", summary: "Missing required paperwork", lives: "Intake tasks / checklist", rule: "Dashboard filter: yes" },
              { id: "pending-nia", title: "Pending NIA", summary: "NIA not yet scheduled", lives: "intake.nia_status", rule: "Enrollment priority queue" },
              { id: "nia-scheduled", title: "NIA scheduled", summary: "Appointments booked", lives: "intake.nia_status", rule: "Still Referral in Progress", stageId: "nia-scheduled" },
              { id: "nia-passed", title: "NIA passed", summary: "Eligible for MLTC path", lives: "intake.nia_status", rule: "Moves toward authorization, not directly to Active" },
              { id: "pending-auth", title: "Pending authorization", summary: "Auth submitted, awaiting payer", lives: "Authorization.status", rule: "Dashboard filter: yes" },
              { id: "authorized-pending-soc", title: "Authorized — pending SOC", summary: "Approved but service not started", lives: "Authorization + anticipated SOC", rule: "Do not call this Active yet", stageId: "auth-path" },
              { id: "on-hold", title: "On hold", summary: "Paused for NIA wait, vacation, or docs", lives: "hold_reason + hold_until_date", rule: "Replaces legacy Pre-Intake" },
              { id: "medicaid-pending", title: "Pending Medicaid", summary: "Medicaid application/eligibility in flight", lives: "Medicaid ticket", rule: "Orthogonal badge; does not change leadStage" },
            ],
          },
          {
            key: "layer-c",
            label: "Layer C",
            title: "Per-LOB referral substatus",
            note: "Each LOB can be at its own referral state while the master bar rolls up.",
            items: [
              { id: "lob-not-started", title: "Not started", summary: "LOB identified; no intake yet", lives: "LOB row", rule: "Not the same as the patient master bar" },
              { id: "lob-rip", title: "Referral in Progress", summary: "Intake open for this specific LOB", lives: "LOB row", rule: "May coexist with another LOB that is Active" },
              { id: "lob-drop", title: "Dropped Off", summary: "This LOB attempt ended", lives: "LOB row + outcome", rule: "Dropping one LOB ≠ discharging the patient" },
              { id: "lob-post", title: "Active / Discharged", summary: "Post-referral state on the LOB row only", lives: "LOB row", rule: "Master bar shows highest forward progress across open gold LOBs" },
            ],
          },
        ];
      }
      if (stageId === "active") {
        return [
          {
            key: "active-chips",
            label: "Active chips",
            title: "Active sub-status chips",
            note: "Once the patient is Active, referral work layers stop driving the master status.",
            items: [
              { id: "active-auth", title: "Authorized", summary: "Valid payer authorization on at least one active LOB", lives: "Authorization + active LOB", rule: "Useful chip, but never the master pipeline stage" },
              { id: "active-nonauth", title: "Non-Authorized / Expired", summary: "Active service but missing or stale authorization", lives: "Authorization + ops follow-up", rule: "Still Active, but needs ops attention" },
              { id: "active-soc", title: "SOC confirmed", summary: "Start of Care is what allowed Active in the first place", lives: "Intake / LOB date field", rule: "Auth alone is not enough" },
            ],
          },
          {
            key: "active-lobs",
            label: "LOBs",
            title: "Active multi-LOB behavior",
            note: "Active is a patient-level rollup across one or more programs.",
            items: [
              { id: "active-master", title: "Master bar stays Active", summary: "At least one LOB is actively receiving service", lives: "Episode/status rollup", rule: "Master bar remains Active until the last active LOB ends" },
              { id: "active-lob-row", title: "Per-LOB rows still matter", summary: "Each LOB can have its own auth state and operational detail", lives: "Patient LOB fields", rule: "Use LOB rows for detail, not extra master stages" },
              { id: "active-discharge", title: "Leaving one LOB is not discharge", summary: "Patient discharges only when no active LOBs remain", lives: "LOB row + master bar", rule: "This prevents false discharges" },
            ],
          },
        ];
      }
      if (stageId === "dropped") {
        return [
          {
            key: "drop-outcome",
            label: "Outcome",
            title: "Dropped Off follow-up",
            note: "Dropped Off is terminal before first Active, and should capture why the patient never started.",
            items: [
              { id: "drop-reason", title: "Drop reason required", summary: "Dropped Off requires a drop reason category", lives: "Episode.outcome / drop reason", rule: "This is what keeps Dropped Off separate from Discharged" },
              { id: "drop-nia", title: "NIA Failed if applicable", summary: "If NIA caused the drop, keep it explicit", lives: "Outcome + follow-up queue", rule: "Supports reapply tracking after the wait period", stageId: "nia-failed" },
              { id: "drop-reengage", title: "Re-engage starts new episode", summary: "A returning patient comes back at Lead or Qualifying", lives: "Episode lifecycle", rule: "Do not reopen the old pre-Active path" },
            ],
          },
        ];
      }
      return [];
    }
    if (viewKey === "shortterm") {
      return [
        {
          key: "shortterm-layers",
          label: "Layers",
          title: "Short-term care layers",
          note: "Short-term is a separate dimension and should not distort the main funnel.",
          items: [
            { id: "st-icon", title: "Separate icon track", summary: "Short-term sits beside the main path", lives: "UI icon / separate track", rule: "Do not use the main bar for early short-term work" },
            { id: "st-authorized-rule", title: "Authorized promotes main bar", summary: "Only short-term Authorized moves the main bar to Active", lives: "Short-term stage + main bar", rule: "Prevents pipeline inflation" },
            { id: "st-no-inflation", title: "Never authorized", summary: "Main pipeline may stay Qualifying, Referral in Progress, or Dropped Off", lives: "Main path + short-term track", rule: "Short-term activity alone does not score as Active" },
          ],
        },
      ];
    }
    if (viewKey === "multilob") {
      return [
        {
          key: "multilob-layers",
          label: "Layers",
          title: "Multi-LOB layers",
          note: "The patient can have one master bar and several LOB-level states at the same time.",
          items: [
            { id: "multi-master", title: "Master bar", summary: "Single stage reflecting highest forward progress on any open gold LOB", lives: "Episode/master view", rule: "Joel to confirm exact precedence", stageId: "master" },
            { id: "multi-lob-row", title: "Per-LOB row", summary: "Each LOB shows its own status, intake step, and auth state", lives: "Patient LOB fields", rule: "This is where real multi-program work appears" },
            { id: "multi-drop", title: "LOB drop rule", summary: "Dropping one LOB is not the same as patient discharge", lives: "LOB row + master bar", rule: "Only last active LOB ending can discharge the patient" },
          ],
        },
      ];
    }
    return [
      {
        key: "nia-layers",
        label: "Layers",
        title: "NIA / authorization layers",
        note: "NIA and authorization are visible layers inside referral work, not replacement master stages.",
        items: [
          { id: "nia-layer", title: "NIA status", summary: "Scheduled / passed / failed live on intake.nia_status", lives: "Intake", rule: "Keep visible as chips or filters, not master labels", stageId: "nia-scheduled" },
          { id: "auth-layer", title: "Authorization", summary: "Payer approval belongs on Authorization, not the master bar", lives: "Authorization object", rule: "Authorized ≠ Active", stageId: "auth-path" },
          { id: "soc-layer", title: "SOC gate", summary: "Start of Care confirms the move to Active", lives: "Intake / LOB date field", rule: "Pass or auth alone does not make the patient Active", stageId: "active" },
          { id: "nia-fail-layer", title: "NIA fail handling", summary: "Fail usually drops the patient unless another LOB applies", lives: "Outcome + follow-up queue", rule: "Queue reapply after wait period", stageId: "nia-failed" },
        ],
      },
    ];
  }

  function selectedLayerStageId() {
    if (activeView === "main") return activeStage;
    return displayStageId();
  }

  function ensureLayerState() {
    var sets = layerSetsForView(activeView, selectedLayerStageId());
    if (!sets.length) return;
    var currentSet = sets.find(function (set) {
      return set.key === activeLayerTab;
    });
    if (!currentSet) {
      currentSet = sets[0];
      activeLayerTab = currentSet.key;
    }
    var currentItem = currentSet.items.find(function (item) {
      return item.id === activeLayerItem;
    });
    if (!currentItem) {
      activeLayerItem = currentSet.items[0].id;
    }
  }

  function syncLayerFromStage() {
    var stageId = selectedLayerStageId();
    if (!stageId) return;
    var sets = layerSetsForView(activeView, stageId);
    if (!sets.length) {
      activeLayerTab = null;
      activeLayerItem = null;
      return;
    }
    sets.some(function (set) {
      var found = set.items.find(function (item) {
        return item.stageId === stageId || item.id === stageId;
      });
      if (found) {
        activeLayerTab = set.key;
        activeLayerItem = found.id;
        return true;
      }
      return false;
    });
  }

  function renderLayersPanel() {
    var panel = el("glossary-layers-panel");
    var wrap = el("glossary-layers-wrap");
    if (!panel || !wrap) return;
    var sets = layerSetsForView(activeView, selectedLayerStageId());
    if (!sets.length) {
      wrap.hidden = true;
      panel.innerHTML = "";
      activeLayerTab = null;
      activeLayerItem = null;
      return;
    }
    wrap.hidden = false;
    ensureLayerState();
    syncLayerFromStage();
    ensureLayerState();
    sets = layerSetsForView(activeView, selectedLayerStageId());
    var currentSet = sets.find(function (set) {
      return set.key === activeLayerTab;
    }) || sets[0];
    var currentItem = currentSet.items.find(function (item) {
      return item.id === activeLayerItem;
    }) || currentSet.items[0];
    panel.innerHTML =
      '<div class="glossary-layers-header">' +
      "<h3>Interactive layers</h3>" +
      "<p>" +
      currentSet.note +
      "</p>" +
      "</div>" +
      '<div class="glossary-layers-tabs">' +
      sets
        .map(function (set) {
          return (
            '<button type="button" class="glossary-layers-tab' +
            (set.key === currentSet.key ? " active" : "") +
            '" data-layer-tab="' +
            set.key +
            '">' +
            set.label +
            "</button>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="glossary-layers-body">' +
      '<div class="glossary-layers-items">' +
      currentSet.items
        .map(function (item) {
          return renderLayerItemButton(item, item.id === currentItem.id);
        })
        .join("") +
      "</div>" +
      renderLayerDetail(currentSet, currentItem) +
      "</div>";
    panel.querySelectorAll(".glossary-layers-tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeLayerTab = btn.dataset.layerTab;
        activeLayerItem = null;
        renderLayersPanel();
      });
    });
    panel.querySelectorAll(".glossary-layer-item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeLayerItem = btn.dataset.layerItem;
        var item = currentSet.items.find(function (x) {
          return x.id === activeLayerItem;
        });
        if (item && item.stageId && STAGES[item.stageId]) {
          activeStage = item.stageId;
          syncLayerFromStage();
          renderDiagram();
          renderIntroCompare();
          renderDetail();
        }
        renderLayersPanel();
      });
    });
  }

  function renderIntroCompare() {
    var box = el("glossary-intro-compare");
    if (!box) return;
    if (!activeStage || !STAGES[activeStage]) {
      box.hidden = true;
      box.innerHTML = "";
      return;
    }
    var s = STAGES[activeStage];
    box.hidden = false;
    box.innerHTML =
      '<div class="glossary-intro-compare__head">' +
      "<h3>How current CRM maps to this model</h3>" +
      "<p>We are not removing data — we are standardizing how it’s interpreted. Review carefully — this drives migration accuracy.</p>" +
      "</div>" +
      '<div class="glossary-intro-compare__card glossary-intro-compare__card--current">' +
      '<span class="glossary-intro-compare__label">' +
      '<span class="glossary-detail-card__icon" aria-hidden="true">' +
      fieldIcon("current") +
      "</span>Current CRM</span>" +
      "<p>" +
      (s.crmToday || "No current CRM comparison noted.") +
      "</p>" +
      "</div>" +
      '<div class="glossary-intro-compare__arrow" aria-hidden="true">→</div>' +
      '<div class="glossary-intro-compare__card glossary-intro-compare__card--proposed">' +
      '<span class="glossary-intro-compare__label">' +
      '<span class="glossary-detail-card__icon" aria-hidden="true">' +
      fieldIcon("proposed") +
      "</span>Proposed</span>" +
      "<p><strong>" +
      s.title +
      "</strong> — " +
      s.plain +
      "</p>" +
      "</div>" +
      '<div class="glossary-intro-compare__why">' +
      '<span class="glossary-intro-compare__label">' +
      '<span class="glossary-detail-card__icon" aria-hidden="true">' +
      fieldIcon("impact") +
      "</span>Business impact</span>" +
      "<p>" +
      stageImpact(s, activeStage) +
      "</p>" +
      "</div>";
  }

  function renderTabs(container) {
    var tabs = document.createElement("div");
    tabs.className = "glossary-tabs";
    tabs.setAttribute("role", "tablist");
    Object.keys(VIEWS).forEach(function (key) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "glossary-tab" + (key === activeView ? " active" : "");
      btn.textContent = VIEWS[key].label;
      btn.dataset.view = key;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", key === activeView ? "true" : "false");
      btn.addEventListener("click", function () {
        activeView = key;
        activeStage = null;
        activeLayerTab = null;
        activeLayerItem = null;
        activeDetailPanel = "status";
        hideTooltip();
        renderDiagram();
        renderIntroCompare();
        renderDetail();
        container.querySelectorAll(".glossary-tab").forEach(function (t) {
          var on = t.dataset.view === activeView;
          t.classList.toggle("active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
      });
      tabs.appendChild(btn);
    });
    return tabs;
  }

  function showTooltip(node, btn) {
    var s = STAGES[node.id];
    if (!s || !tooltipEl) return;
    var html =
      '<strong>' +
      s.title +
      "</strong>";
    if (s.crmToday) {
      html +=
        '<div class="glossary-tooltip__row"><span class="glossary-tooltip__tag glossary-tooltip__tag--current">Current CRM</span> ' +
        s.crmToday +
        "</div>";
    }
    html +=
      '<div class="glossary-tooltip__row"><span class="glossary-tooltip__tag glossary-tooltip__tag--new">Proposed</span> ' +
      s.plain +
      "</div>";
    tooltipEl.innerHTML = html;
    tooltipEl.hidden = false;
    var rect = btn.getBoundingClientRect();
    var rootRect = el("glossary-pipeline-explorer").getBoundingClientRect();
    var top = rect.bottom - rootRect.top + 8;
    var left = rect.left - rootRect.left + rect.width / 2;
    tooltipEl.style.top = top + "px";
    tooltipEl.style.left = left + "px";
  }

  function hideTooltip() {
    if (tooltipEl) tooltipEl.hidden = true;
  }

  function makeNode(node, isTerminal) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "glossary-node" +
      (isTerminal ? " terminal" : "") +
      (activeStage === node.id ? " active" : "") +
      (STAGES[node.id] && needsCompare(STAGES[node.id]) ? " has-change" : "");
    btn.textContent = node.label;
    btn.dataset.stage = node.id;
    btn.setAttribute("aria-describedby", "glossary-node-tooltip");
    btn.addEventListener("click", function () {
      activeStage = node.id;
      syncLayerFromStage();
      hideTooltip();
      renderDiagram();
      renderIntroCompare();
      renderDetail();
      renderLayersPanel();
    });
    btn.addEventListener("mouseenter", function () {
      showTooltip(node, btn);
    });
    btn.addEventListener("mouseleave", hideTooltip);
    btn.addEventListener("focus", function () {
      showTooltip(node, btn);
    });
    btn.addEventListener("blur", hideTooltip);
    return btn;
  }

  function escapeLabel(text) {
    return text.replace(/"/g, "'");
  }

  function mermaidDirection(viewKey) {
    if (viewKey === "multilob") return "TB";
    if (viewKey === "nia") return "TD";
    return "LR";
  }

  function dropSources(viewKey, nodes, dropId) {
    if (!dropId) return [];
    if (viewKey === "main") {
      return nodes.filter(function (n) {
        return n.id !== "active" && n.id !== "discharged";
      });
    }
    if (viewKey === "nia") {
      return [{ id: "nia-outcome" }];
    }
    return [];
  }

  function buildMermaidChart(viewKey) {
    var view = VIEWS[viewKey];
    var dir = mermaidDirection(viewKey);
    var lines = ["flowchart " + dir];
    var allNodes = view.nodes.slice();
    if (view.drop) allNodes.push(view.drop);

    allNodes.forEach(function (node) {
      lines.push('    ' + node.id + '["' + escapeLabel(node.label) + '"]');
    });

    for (var i = 0; i < view.nodes.length - 1; i++) {
      lines.push("    " + view.nodes[i].id + " --> " + view.nodes[i + 1].id);
    }

    if (viewKey === "multilob") {
      lines.push("    patient --> master");
      lines.push("    patient --> lob-ltc");
      lines.push("    patient --> lob-st");
      lines.push("    master --> lob-st");
    }

    if (view.drop) {
      dropSources(viewKey, view.nodes, view.drop.id).forEach(function (n) {
        lines.push("    " + n.id + " -.-> " + view.drop.id);
      });
      lines.push(
        "    classDef terminal fill:#fffbeb,stroke:#f59e0b,stroke-width:2px,stroke-dasharray:5 5"
      );
      lines.push("    class " + view.drop.id + " terminal");
    }

    allNodes.forEach(function (node) {
      if (STAGES[node.id]) {
        lines.push("    click " + node.id + " call glossaryNodeClick()");
      }
    });

    return lines.join("\n");
  }

  function stageIdFromMermaidNode(nodeEl) {
    var id = nodeEl.id || "";
    var match = id.match(/^flowchart-(.+)-\d+$/);
    return match ? match[1] : null;
  }

  function highlightMermaidNode(diagram) {
    diagram.querySelectorAll(".node").forEach(function (nodeEl) {
      nodeEl.classList.remove("glossary-mermaid-active");
      var stageId = stageIdFromMermaidNode(nodeEl);
      if (stageId === activeStage) nodeEl.classList.add("glossary-mermaid-active");
    });
  }

  function bindMermaidInteractions(diagram) {
    diagram.querySelectorAll(".node").forEach(function (nodeEl) {
      var stageId = stageIdFromMermaidNode(nodeEl);
      if (!stageId || !STAGES[stageId]) return;
      nodeEl.style.cursor = "pointer";
      nodeEl.addEventListener("mouseenter", function () {
        showTooltip({ id: stageId }, nodeEl);
      });
      nodeEl.addEventListener("mouseleave", hideTooltip);
      nodeEl.addEventListener("click", function () {
        activeStage = stageId;
        syncLayerFromStage();
        hideTooltip();
        highlightMermaidNode(diagram);
        renderIntroCompare();
        renderDetail();
        renderLayersPanel();
      });
    });
  }

  function configureMermaid() {
    if (typeof mermaid === "undefined") return;
    if (configureMermaid.done) return;
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: "base",
      themeVariables: {
        primaryColor: "#f3e8ff",
        primaryTextColor: "#5b21b6",
        primaryBorderColor: "#c4b5fd",
        lineColor: "#64748b",
        secondaryColor: "#faf8ff",
        tertiaryColor: "#ffffff",
        fontFamily: "Inter, Segoe UI, system-ui, sans-serif",
      },
      flowchart: { htmlLabels: true, curve: "basis" },
    });
    configureMermaid.done = true;
  }

  var renderSeq = 0;

  function renderDiagramFallback(diagram) {
    diagram.textContent = "";
    var view = VIEWS[activeView];
    var track = document.createElement("div");
    track.className = "glossary-flow-track";
    view.nodes.forEach(function (node, i) {
      if (i > 0) {
        var arrow = document.createElement("span");
        arrow.className = "glossary-arrow";
        arrow.setAttribute("aria-hidden", "true");
        track.appendChild(arrow);
      }
      track.appendChild(makeNode(node, false));
    });
    diagram.appendChild(track);
    if (view.drop) {
      var branch = document.createElement("div");
      branch.className = "glossary-drop-branch";
      var lbl = document.createElement("span");
      lbl.className = "glossary-drop-label";
      lbl.textContent = activeView === "nia" ? "If NIA fails" : "Before Active";
      branch.appendChild(lbl);
      branch.appendChild(makeNode(view.drop, true));
      diagram.appendChild(branch);
    }
  }

  function renderDiagram() {
    var diagram = el("glossary-flow-diagram");
    if (!diagram) return;

    configureMermaid();
    if (typeof mermaid === "undefined" || !mermaid.render) {
      renderDiagramFallback(diagram);
      return;
    }

    diagram.innerHTML = '<p class="glossary-diagram-loading">Loading flowchart…</p>';
    var chart = buildMermaidChart(activeView);
    var renderId = "glossary-chart-" + activeView + "-" + ++renderSeq;

    mermaid
      .render(renderId, chart)
      .then(function (result) {
        if (el("glossary-flow-diagram") !== diagram) return;
        diagram.innerHTML = result.svg;
        diagram.classList.add("glossary-flow-diagram--mermaid");
        if (result.bindFunctions) result.bindFunctions(diagram);
        highlightMermaidNode(diagram);
        bindMermaidInteractions(diagram);
      })
      .catch(function () {
        renderDiagramFallback(diagram);
      });
  }

  function nodeClick(nodeId) {
    activeStage = nodeId;
    activeDetailPanel = "status";
    syncLayerFromStage();
    hideTooltip();
    var diagram = el("glossary-flow-diagram");
    if (diagram) highlightMermaidNode(diagram);
    renderIntroCompare();
    renderDetail();
  }

  function fieldIcon(kind) {
    var icons = {
      definition:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8M8 11h6"/></svg>',
      entry:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>',
      exit:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
      mapping:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
      impact:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-6"/></svg>',
      ownership:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      decision:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
      edge:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      current:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      proposed:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      lives:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v6c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 11v6c0 1.7 4 3 9 3s9-1.3 9-3v-6"/></svg>',
      rule:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      reason:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
      nia:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/></svg>',
      reengage:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
      auth:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
      hold:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/></svg>',
      payer:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
      eligibility:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      lob:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
      schedule:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
      layer:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    };
    return icons[kind] || icons.definition;
  }

  function layerIconKind(item) {
    var text = (((item && item.id) || "") + " " + ((item && item.title) || "")).toLowerCase();
    if (/drop.?reason|reason required/.test(text)) return "reason";
    if (/nia|assessor|failed/.test(text)) return "nia";
    if (/re-?engage|return|new episode/.test(text)) return "reengage";
    if (/auth|authorized|soc|pending auth/.test(text)) return "auth";
    if (/hold|pause/.test(text)) return "hold";
    if (/medicaid|payer|insurance|coverage/.test(text)) return "payer";
    if (/eligib|fit|qual/.test(text)) return "eligibility";
    if (/lob|program|track/.test(text)) return "lob";
    if (/schedul|appointment/.test(text)) return "schedule";
    if (/outcome|pass|fail/.test(text)) return "decision";
    return "layer";
  }

  function renderLayerItemButton(item, isActive) {
    var kind = layerIconKind(item);
    return (
      '<button type="button" class="glossary-layer-item glossary-layer-item--' +
      kind +
      (isActive ? " active" : "") +
      '" data-layer-item="' +
      item.id +
      '">' +
      '<span class="glossary-layer-item__icon" aria-hidden="true">' +
      fieldIcon(kind) +
      "</span>" +
      '<span class="glossary-layer-item__text">' +
      "<strong>" +
      item.title +
      "</strong>" +
      "<span>" +
      item.summary +
      "</span>" +
      "</span>" +
      "</button>"
    );
  }

  function renderLayerDetail(currentSet, currentItem) {
    return (
      '<div class="glossary-layer-detail">' +
      '<span class="glossary-layer-detail__eyebrow">' +
      '<span class="glossary-detail-card__icon" aria-hidden="true">' +
      fieldIcon("layer") +
      "</span>" +
      currentSet.title +
      "</span>" +
      "<h4>" +
      currentItem.title +
      "</h4>" +
      "<p>" +
      currentItem.summary +
      "</p>" +
      '<dl class="glossary-layer-detail__grid">' +
      '<div class="glossary-layer-detail__row">' +
      '<dt><span class="glossary-detail-card__icon" aria-hidden="true">' +
      fieldIcon("lives") +
      "</span>Lives on</dt>" +
      "<dd>" +
      (currentItem.lives || "Business layer") +
      "</dd>" +
      "</div>" +
      '<div class="glossary-layer-detail__row">' +
      '<dt><span class="glossary-detail-card__icon" aria-hidden="true">' +
      fieldIcon("rule") +
      "</span>Rule</dt>" +
      "<dd>" +
      (currentItem.rule || "Keep separate from the master bar.") +
      "</dd>" +
      "</div>" +
      "</dl>" +
      "</div>"
    );
  }

  function detailCard(label, value, variant) {
    return (
      '<div class="glossary-detail-card glossary-detail-card--' +
      variant +
      '">' +
      '<span class="glossary-detail-card__label">' +
      '<span class="glossary-detail-card__icon" aria-hidden="true">' +
      fieldIcon(variant) +
      "</span>" +
      "<span>" +
      label +
      "</span>" +
      "</span>" +
      '<p class="glossary-detail-card__value">' +
      value +
      "</p>" +
      "</div>"
    );
  }

  function renderCompare(s) {
    if (!s.crmToday && !s.map) return "";
    var changed = needsCompare(s);
    return (
      '<div class="glossary-compare' +
      (changed ? "" : " glossary-compare--aligned") +
      '">' +
      '<div class="glossary-compare__col glossary-compare__col--current">' +
      '<span class="glossary-compare__heading">' +
      '<span class="glossary-detail-card__icon" aria-hidden="true">' +
      fieldIcon("current") +
      "</span>Current CRM</span>" +
      "<p>" +
      (s.crmToday || "Confirm current labels") +
      "</p>" +
      "</div>" +
      '<div class="glossary-compare__arrow" aria-hidden="true">→</div>' +
      '<div class="glossary-compare__col glossary-compare__col--new">' +
      '<span class="glossary-compare__heading">' +
      '<span class="glossary-detail-card__icon" aria-hidden="true">' +
      fieldIcon("proposed") +
      "</span>Proposed mapping</span>" +
      "<p><strong>" +
      stageMap(s) +
      "</strong></p>" +
      "</div>" +
      "</div>"
    );
  }

  function detailNeighbors() {
    var stages = currentViewStages();
    var idx = stages.findIndex(function (item) {
      return item.id === activeStage;
    });
    if (idx === -1) return { prev: null, next: null };
    return {
      prev: idx > 0 ? stages[idx - 1] : null,
      next: idx < stages.length - 1 ? stages[idx + 1] : null,
    };
  }

  function renderLayersInline() {
    var sets = layerSetsForView(activeView, selectedLayerStageId());
    if (!sets.length) return "";
    ensureLayerState();
    syncLayerFromStage();
    ensureLayerState();
    sets = layerSetsForView(activeView, selectedLayerStageId());
    var currentSet = sets.find(function (set) {
      return set.key === activeLayerTab;
    }) || sets[0];
    var currentItem = currentSet.items.find(function (item) {
      return item.id === activeLayerItem;
    }) || currentSet.items[0];
    return (
      '<div class="glossary-layers-header glossary-layers-header--inline">' +
      "<h3>" +
      currentSet.title +
      "</h3>" +
      "<p>" +
      currentSet.note +
      "</p>" +
      "</div>" +
      '<div class="glossary-layers-tabs">' +
      sets
        .map(function (set) {
          return (
            '<button type="button" class="glossary-layers-tab' +
            (set.key === currentSet.key ? " active" : "") +
            '" data-layer-tab="' +
            set.key +
            '">' +
            set.label +
            "</button>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="glossary-layers-body">' +
      '<div class="glossary-layers-items">' +
      currentSet.items
        .map(function (item) {
          return renderLayerItemButton(item, item.id === currentItem.id);
        })
        .join("") +
      "</div>" +
      renderLayerDetail(currentSet, currentItem) +
      "</div>"
    );
  }

  function renderDetail() {
    var panel = el("glossary-stage-detail");
    if (!panel) return;
    if (!activeStage || !STAGES[activeStage]) {
      panel.className = "glossary-stage-detail empty";
      panel.innerHTML =
        '<div class="glossary-detail-empty">' +
        "<p>Select a stage to approve definition, entry/exit logic, and mapping.</p>" +
        "</div>";
      return;
    }
    var s = STAGES[activeStage];
    var meta = stageMeta(activeStage);
    var layerSets = layerSetsForView(activeView, selectedLayerStageId());
    var hasLayers = !!layerSets.length;
    var neighbors = detailNeighbors();
    if (!hasLayers) activeDetailPanel = "status";
    panel.className = "glossary-stage-detail glossary-stage-detail--" + meta.tone;
    panel.innerHTML =
      '<div class="glossary-detail-header">' +
      '<div class="glossary-detail-topline">' +
      '<span class="glossary-detail-badge">' +
      meta.badge +
      "</span>" +
      '<div class="glossary-detail-nav">' +
      '<button type="button" class="glossary-detail-navbtn" data-nav-stage="' +
      (neighbors.prev ? neighbors.prev.id : "") +
      '"' +
      (neighbors.prev ? "" : " disabled") +
      ">← " +
      (neighbors.prev ? neighbors.prev.label : "Previous") +
      "</button>" +
      '<button type="button" class="glossary-detail-navbtn" data-nav-stage="' +
      (neighbors.next ? neighbors.next.id : "") +
      '"' +
      (neighbors.next ? "" : " disabled") +
      ">" +
      (neighbors.next ? neighbors.next.label : "Next") +
      " →</button>" +
      "</div>" +
      "</div>" +
      '<div class="glossary-detail-heading">' +
      "<h3>Stage: " +
      s.title +
      "</h3>" +
      '<p class="glossary-detail-subtitle">' +
      stageDescriptor(activeStage) +
      "</p>" +
      "</div>" +
      '<div class="glossary-detail-viewtabs" role="tablist">' +
      '<button type="button" class="glossary-detail-viewtab' +
      (activeDetailPanel === "status" ? " active" : "") +
      '" data-detail-view="status">' +
      "Status" +
      "</button>" +
      (hasLayers
        ? '<button type="button" class="glossary-detail-viewtab' +
          (activeDetailPanel === "layers" ? " active" : "") +
          '" data-detail-view="layers">Layers</button>'
        : "") +
      "</div>" +
      "</div>" +
      (activeDetailPanel === "layers"
        ? renderLayersInline()
        : renderCompare(s) +
          '<div class="glossary-detail-cards">' +
          detailCard("Definition", s.plain, "definition") +
          detailCard("Entry criteria", stageEntry(s), "entry") +
          detailCard("Exit criteria", stageExit(s), "exit") +
          detailCard("System mapping", stageMap(s), "mapping") +
          detailCard("Downstream impact", stageImpact(s, activeStage), "impact") +
          detailCard("Ownership", s.who, "ownership") +
          "</div>" +
          '<div class="glossary-decision">' +
          '<div class="glossary-decision__title">' +
          '<span class="glossary-detail-card__icon" aria-hidden="true">' +
          fieldIcon("decision") +
          "</span>Decision required</div>" +
          "<ul>" +
          "<li>Is this definition correct?</li>" +
          "<li>Are entry/exit conditions sufficient?</li>" +
          "<li>Any missing edge cases?</li>" +
          "</ul>" +
          "</div>" +
          '<div class="glossary-edge">' +
          '<div class="glossary-edge__title">' +
          '<span class="glossary-detail-card__icon" aria-hidden="true">' +
          fieldIcon("edge") +
          "</span>Edge cases &amp; exceptions</div>" +
          "<p>Call out scenarios where records don’t follow the standard flow, status is unclear/disputed, or multiple interpretations exist. These must be resolved before build.</p>" +
          "</div>" +
          '<div class="glossary-detail-comment">' +
          '<label class="glossary-detail-comment__label" for="glossary-comment-' +
          activeStage +
          '">Decision notes — ' +
          s.title +
          "</label>" +
          '<textarea id="glossary-comment-' +
          activeStage +
          '" class="section-comment glossary-detail-comment__input" data-stage-id="' +
          activeStage +
          '" data-stage-label="' +
          s.title.replace(/"/g, "&quot;") +
          '" placeholder="Approve, challenge, or flag an edge case for ' +
          s.title.replace(/"/g, "&quot;") +
          '…">' +
          getExplorerComment(activeStage) +
          "</textarea>" +
          "</div>" +
          (s.anchor
            ? '<a class="glossary-detail-link" href="' +
              s.anchor +
              '"><span>Jump to reference table</span><span class="glossary-detail-link__arrow" aria-hidden="true">↓</span></a>'
            : ""));
    panel.querySelectorAll("[data-detail-view]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeDetailPanel = btn.dataset.detailView || "status";
        renderDetail();
      });
    });
    panel.querySelectorAll("[data-nav-stage]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.disabled || !btn.dataset.navStage) return;
        activeStage = btn.dataset.navStage;
        activeDetailPanel = "status";
        syncLayerFromStage();
        renderDiagram();
        renderIntroCompare();
        renderDetail();
      });
    });
    var commentInput = panel.querySelector(".glossary-detail-comment__input");
    if (commentInput) {
      commentInput.addEventListener("input", function () {
        saveExplorerComment(
          commentInput.dataset.stageId,
          commentInput.dataset.stageLabel || s.title,
          commentInput.value
        );
      });
    }
    panel.querySelectorAll(".glossary-layers-tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeLayerTab = btn.dataset.layerTab;
        activeLayerItem = null;
        activeDetailPanel = "layers";
        renderDetail();
      });
    });
    panel.querySelectorAll(".glossary-layer-item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeLayerItem = btn.dataset.layerItem;
        var sets = layerSetsForView(activeView, selectedLayerStageId());
        var currentSet = sets.find(function (set) {
          return set.key === activeLayerTab;
        }) || sets[0];
        var item = currentSet.items.find(function (x) {
          return x.id === activeLayerItem;
        });
        if (item && item.stageId && STAGES[item.stageId]) {
          activeStage = item.stageId;
          activeDetailPanel = "status";
          syncLayerFromStage();
          renderDiagram();
          renderIntroCompare();
        }
        renderDetail();
      });
    });
  }

  function currentViewStages() {
    var view = VIEWS[activeView];
    var stages = view.nodes.slice();
    if (view.drop) stages.push(view.drop);
    return stages;
  }

  function flashSaveStatus(id) {
    var node = document.getElementById(id);
    if (!node) return;
    node.textContent = "Saved";
    node.classList.add("visible");
    clearTimeout(flashSaveStatus.timer);
    flashSaveStatus.timer = setTimeout(function () {
      node.classList.remove("visible");
    }, 1800);
  }

  function updateCommentCount() {
    var n = 0;
    document.querySelectorAll("textarea.signoff-comment, textarea.section-comment").forEach(function (ta) {
      if (ta.value.trim()) n++;
    });
    var pageCount = document.getElementById("comment-count");
    if (pageCount) {
      pageCount.textContent = n ? n + " comment(s) autosaved on this page" : "No comments on this page yet";
    }
    var packageCount = document.getElementById("package-comment-count");
    if (packageCount && global.LinkCrmSignoff && global.LinkCrmSignoff.countAllComments) {
      var total = global.LinkCrmSignoff.countAllComments();
      packageCount.textContent = total ? total + " comment(s) autosaved across package" : "No comments saved yet";
    }
  }

  function saveExplorerComment(stageId, label, value) {
    var docId = docIdFromPath();
    var fieldId = commentFieldId(stageId);
    try {
      if (value.trim()) {
        localStorage.setItem(storageKey(docId, fieldId), value);
        localStorage.setItem(storageKey(docId, fieldId + ":label"), label);
      } else {
        localStorage.removeItem(storageKey(docId, fieldId));
        localStorage.removeItem(storageKey(docId, fieldId + ":label"));
      }
    } catch (e) {}
    updateCommentCount();
    flashSaveStatus("save-status");
    flashSaveStatus("package-save-status");
    try {
      document.dispatchEvent(new CustomEvent("link-crm-signoff-change"));
    } catch (e) {}
  }

  function getExplorerComment(stageId) {
    try {
      return localStorage.getItem(storageKey(docIdFromPath(), commentFieldId(stageId))) || "";
    } catch (e) {
      return "";
    }
  }

  function wrapReference() {
    var root = el("glossary-pipeline-explorer");
    if (!root || !root.parentElement || root.parentElement.dataset.refWrapped) return;
    var article = root.parentElement;
    var nodes = [];
    var pastExplorer = false;
    Array.from(article.children).forEach(function (ch) {
      if (ch === root) {
        pastExplorer = true;
        return;
      }
      if (!pastExplorer) return;
      nodes.push(ch);
    });
    if (!nodes.length) return;
    var det = document.createElement("details");
    det.className = "glossary-reference";
    det.innerHTML = "<summary>Show full reference tables and sign-off details</summary>";
    var inner = document.createElement("div");
    inner.className = "glossary-reference__body";
    nodes.forEach(function (n) {
      inner.appendChild(n);
    });
    det.appendChild(inner);
    article.appendChild(det);
    article.dataset.refWrapped = "1";
  }

  function isEmbedded() {
    try {
      var root = el("glossary-pipeline-explorer");
      if (root && root.getAttribute("data-embed") === "1") return true;
      return /(?:^|[?&])embed=1(?:&|$)/.test(location.search) || window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  function init() {
    var root = el("glossary-pipeline-explorer");
    if (!root || root.dataset.bound) return;
    root.dataset.bound = "1";

    var embedded = isEmbedded();

    if (embedded) {
      root.classList.add("glossary-explorer--embedded");
      document.body.classList.add("glossary-embedded");
    }

    var layout = document.createElement("div");
    layout.className = "glossary-explorer-layout";

    if (!embedded) {
      var overview = document.createElement("div");
      overview.className = "glossary-overview";
      overview.innerHTML =
        "<h3>Proposed lifecycle (single source of truth)</h3>" +
        "<p>Every record must follow a consistent lifecycle:</p>" +
        '<p class="glossary-overview__path"><strong>Lead → Qualifying → Referral in Progress → Active → Discharged</strong></p>' +
        "<ul>" +
        '<li>"Dropped Off" is a terminal state from any pre-Active stage</li>' +
        "<li>No parallel or ambiguous statuses</li>" +
        "</ul>" +
        '<p class="glossary-overview__goal">Goal: eliminate multiple interpretations of the same record</p>';
      layout.appendChild(overview);

      var impact = document.createElement("div");
      impact.className = "glossary-impact";
      impact.innerHTML =
        "<h3>Business impact</h3>" +
        "<p>This directly affects:</p>" +
        "<p>" +
        businessImpactCopy() +
        "</p>" +
        '<p class="glossary-impact__risk">If this is wrong, reporting and decisions will remain unreliable.</p>';
      layout.appendChild(impact);
    } else {
      var embedCue = document.createElement("p");
      embedCue.className = "glossary-embed-cue";
      embedCue.textContent =
        "Lead → Qualifying → Referral in Progress → Active → Discharged · Click a stage to decide";
      layout.appendChild(embedCue);
    }

    layout.appendChild(renderTabs(root));

    var diagramWrap = document.createElement("div");
    diagramWrap.className = "glossary-diagram-wrap";
    var diagram = document.createElement("div");
    diagram.id = "glossary-flow-diagram";
    diagram.className = "glossary-flow-diagram";
    diagramWrap.appendChild(diagram);
    tooltipEl = document.createElement("div");
    tooltipEl.id = "glossary-node-tooltip";
    tooltipEl.className = "glossary-node-tooltip";
    tooltipEl.setAttribute("role", "tooltip");
    tooltipEl.hidden = true;
    diagramWrap.appendChild(tooltipEl);
    layout.appendChild(diagramWrap);

    var rules = document.createElement("div");
    rules.className = "glossary-rules";
    rules.innerHTML =
      '<span class="glossary-rule-pill"><strong>Authorized ≠ Active</strong></span>' +
      '<span class="glossary-rule-pill"><strong>Dropped Off ≠ Discharged</strong></span>';
    layout.appendChild(rules);

    if (!embedded) {
      var migration = document.createElement("div");
      migration.className = "glossary-migration";
      migration.innerHTML =
        "<h3>Why this review is critical</h3>" +
        "<p>These definitions will be used to map all existing records, drive migration logic, and power dashboards and reporting.</p>" +
        '<p class="glossary-migration__risk">Incorrect definitions = incorrect data at scale</p>';
      layout.appendChild(migration);
    }

    var compareIntro = document.createElement("div");
    compareIntro.id = "glossary-intro-compare";
    compareIntro.className = "glossary-intro-compare";
    compareIntro.hidden = true;
    layout.appendChild(compareIntro);

    var detail = document.createElement("div");
    detail.id = "glossary-stage-detail";
    detail.className = "glossary-stage-detail empty";
    layout.appendChild(detail);

    root.appendChild(layout);

    renderDiagram();
    renderIntroCompare();
    renderDetail();
    wrapReference();
  }

  global.LinkGlossaryPipeline = { init: init, STAGES: STAGES, nodeClick: nodeClick };
  global.glossaryNodeClick = nodeClick;
})(typeof window !== "undefined" ? window : globalThis);
