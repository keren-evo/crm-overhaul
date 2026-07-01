import {
  AuthorizationStatus,
  IntakeStatus,
  LifecycleStage,
  LineOfBusiness,
} from "./enums";

export type ValidationSeverity = "block" | "warn";

export interface ValidationRule {
  id: string;
  object: "person" | "intake" | "authorization";
  severity: ValidationSeverity;
  description: string;
  when: Record<string, unknown>;
  require?: string[];
  forbid?: Record<string, unknown>;
  expression?: string;
}

/**
 * Blocking validation rules for Schema Manager / API layer.
 * `expression` uses pseudo-SQL for documentation; implement in your ORM layer.
 */
export const VALIDATION_RULES: ValidationRule[] = [
  {
    id: "person-authorized-requires-valid-auth",
    object: "person",
    severity: "block",
    description: "Person cannot be AUTHORIZED_PENDING_SOC without a valid approved authorization on an intake.",
    when: { lifecycle_stage: LifecycleStage.AUTHORIZED_PENDING_SOC },
    require: ["authorization_id"],
    expression: `
      EXISTS (
        SELECT 1 FROM intakes i
        JOIN authorizations a ON a.id = i.authorization_id
        WHERE i.person_id = person.id
          AND i.status IN ('INTAKE_AUTHORIZED', 'INTAKE_ACTIVE')
          AND a.status = 'AUTH_APPROVED'
          AND a.end_date >= CURRENT_DATE
      )
    `,
  },
  {
    id: "person-active-requires-soc",
    object: "person",
    severity: "block",
    description: "PATIENT_ACTIVE requires confirmed start_of_care on at least one intake.",
    when: { lifecycle_stage: LifecycleStage.PATIENT_ACTIVE },
    expression: `
      EXISTS (
        SELECT 1 FROM intakes i
        WHERE i.person_id = person.id
          AND i.status = 'INTAKE_ACTIVE'
          AND i.start_of_care_date IS NOT NULL
      )
    `,
  },
  {
    id: "intake-authorized-requires-auth-approved",
    object: "intake",
    severity: "block",
    description: "Intake cannot be authorized without linked AUTH_APPROVED authorization.",
    when: { status: IntakeStatus.INTAKE_AUTHORIZED },
    require: ["authorization_id"],
    expression: `
      authorization.status = 'AUTH_APPROVED'
      AND authorization.end_date >= CURRENT_DATE
      AND authorization.lob = intake.lob
    `,
  },
  {
    id: "dropped-off-requires-reason",
    object: "person",
    severity: "block",
    description: "Dropped off requires reason and category.",
    when: { lifecycle_stage: LifecycleStage.DROPPED_OFF },
    require: ["drop_reason", "drop_reason_category", "dropped_at"],
  },
  {
    id: "discharged-requires-reason",
    object: "person",
    severity: "block",
    description: "Discharged requires date and reason.",
    when: { lifecycle_stage: LifecycleStage.DISCHARGED },
    require: ["discharge_date", "discharge_reason"],
  },
  {
    id: "on-hold-requires-until-date",
    object: "person",
    severity: "block",
    description: "On hold requires reason and hold_until_date.",
    when: { lifecycle_stage: LifecycleStage.ON_HOLD },
    require: ["hold_reason", "hold_until_date"],
  },
  {
    id: "voided-intake-requires-reason",
    object: "intake",
    severity: "block",
    description: "Voided intake requires void_reason and voided_by.",
    when: { status: IntakeStatus.INTAKE_VOIDED },
    require: ["void_reason", "voided_by", "voided_at"],
  },
  {
    id: "no-legacy-tags-with-lifecycle",
    object: "person",
    severity: "block",
    description: "Legacy tags (patient, lead, authorized) must not coexist with lifecycle_stage.",
    when: {},
    forbid: { legacy_tags: ["patient", "lead", "authorized"] },
  },
  {
    id: "short-term-only-cannot-elevate-authorized",
    object: "person",
    severity: "block",
    description: "Short-term-only open intakes cannot set person stage above REFERRAL_ACTIVE.",
    when: { lifecycle_stage: LifecycleStage.AUTHORIZED_PENDING_SOC },
    expression: `
      EXISTS (
        SELECT 1 FROM intakes i
        WHERE i.person_id = person.id
          AND i.status NOT IN ('INTAKE_VOIDED', 'INTAKE_DROPPED')
          AND i.lob IN ('LONG_TERM_CARE', 'NHTD', 'OPWDD', 'PRIVATE_PAY', 'CUSTODIAL_CARE')
      )
    `,
  },
  {
    id: "terminal-intake-clears-auth-display",
    object: "intake",
    severity: "block",
    description: "Voided or dropped intake cannot remain in authorized status.",
    when: { status: [IntakeStatus.INTAKE_VOIDED, IntakeStatus.INTAKE_DROPPED] },
    forbid: { status: IntakeStatus.INTAKE_AUTHORIZED },
  },
  {
    id: "cdpap-post-sunset-warn",
    object: "intake",
    severity: "warn",
    description: "CDPAP intakes after 2025-04-01 should be remediated.",
    when: { lob: LineOfBusiness.CDPAP },
    expression: `intake.intake_opened_at >= '2025-04-01'`,
  },
  {
    id: "anticipated-soc-stale-warn",
    object: "intake",
    severity: "warn",
    description: "Anticipated SOC passed without confirmed SOC.",
    when: { status: IntakeStatus.INTAKE_AUTHORIZED },
    expression: `
      anticipated_soc_date < CURRENT_DATE
      AND start_of_care_date IS NULL
      AND CURRENT_DATE - anticipated_soc_date >= 7
    `,
  },
  {
    id: "orphan-authorized-warn",
    object: "person",
    severity: "warn",
    description: "Legacy authorized flag or stage without valid authorization object.",
    when: {},
    expression: `
      (person.legacy_status = 'authorized' OR person.lifecycle_stage = 'AUTHORIZED_PENDING_SOC')
      AND NOT EXISTS (
        SELECT 1 FROM intakes i
        JOIN authorizations a ON a.id = i.authorization_id
        WHERE i.person_id = person.id AND a.status = 'AUTH_APPROVED'
      )
    `,
  },
];

export interface AutomationTrigger {
  id: string;
  event: string;
  condition?: string;
  actions: Array<{
    type: "set_field" | "notify" | "recalc" | "create_task";
    target?: string;
    field?: string;
    value?: unknown;
    template?: string;
  }>;
}

export const AUTOMATION_TRIGGERS: AutomationTrigger[] = [
  {
    id: "contact-logged",
    event: "contact.logged",
    condition: "person.lifecycle_stage = LEAD_NEW",
    actions: [
      { type: "set_field", target: "person", field: "lifecycle_stage", value: LifecycleStage.LEAD_CONTACTING },
    ],
  },
  {
    id: "nia-scheduled",
    event: "nia.scheduled",
    actions: [
      { type: "set_field", target: "intake", field: "status", value: IntakeStatus.INTAKE_IN_PROGRESS },
      { type: "set_field", target: "intake", field: "nia_status", value: "NIA_SCHEDULED" },
    ],
  },
  {
    id: "nia-failed",
    event: "nia.failed",
    actions: [
      { type: "set_field", target: "intake", field: "status", value: IntakeStatus.INTAKE_ON_HOLD },
      { type: "set_field", target: "person", field: "lifecycle_stage", value: LifecycleStage.ON_HOLD },
      { type: "set_field", target: "person", field: "hold_reason", value: "NIA_FAILED_WAIT" },
      { type: "notify", template: "nia_failed_6mo_hold" },
      { type: "create_task", template: "reengage_at_hold_until" },
    ],
  },
  {
    id: "auth-approved",
    event: "auth.approved",
    actions: [
      { type: "set_field", target: "intake", field: "status", value: IntakeStatus.INTAKE_AUTHORIZED },
      { type: "recalc", target: "person.lifecycle_stage" },
      { type: "notify", template: "authorization_approved" },
    ],
  },
  {
    id: "soc-confirmed",
    event: "soc.confirmed",
    actions: [
      { type: "set_field", target: "intake", field: "status", value: IntakeStatus.INTAKE_ACTIVE },
      { type: "set_field", target: "person", field: "lifecycle_stage", value: LifecycleStage.PATIENT_ACTIVE },
      { type: "notify", template: "patient_active_win" },
    ],
  },
  {
    id: "auth-expired-nightly",
    event: "cron.nightly",
    condition: "authorization.status = AUTH_APPROVED AND authorization.end_date < CURRENT_DATE",
    actions: [
      { type: "set_field", target: "authorization", field: "status", value: AuthorizationStatus.AUTH_EXPIRED },
      { type: "recalc", target: "person.lifecycle_stage" },
      { type: "notify", template: "auth_expired_ops" },
    ],
  },
  {
    id: "intake-voided-recalc",
    event: "intake.voided",
    actions: [{ type: "recalc", target: "person.lifecycle_stage" }],
  },
  {
    id: "all-intakes-terminal-drop",
    event: "intake.dropped",
    condition: "no open intakes AND never PATIENT_ACTIVE",
    actions: [
      { type: "set_field", target: "person", field: "lifecycle_stage", value: LifecycleStage.DROPPED_OFF },
      { type: "notify", template: "pipeline_dropped" },
    ],
  },
];
