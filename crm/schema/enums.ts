/**
 * CRM status enums — authoritative TypeScript mirror of enums.json.
 * Use for app logic, webhooks, and CRM sync from evo-growth.
 */

export const LifecycleStage = {
  LEAD_NEW: "LEAD_NEW",
  LEAD_CONTACTING: "LEAD_CONTACTING",
  REFERRAL_ACTIVE: "REFERRAL_ACTIVE",
  INTAKE_IN_PROGRESS: "INTAKE_IN_PROGRESS",
  ON_HOLD: "ON_HOLD",
  AUTHORIZED_PENDING_SOC: "AUTHORIZED_PENDING_SOC",
  PATIENT_ACTIVE: "PATIENT_ACTIVE",
  DROPPED_OFF: "DROPPED_OFF",
  DISCHARGED: "DISCHARGED",
} as const;

export type LifecycleStage = (typeof LifecycleStage)[keyof typeof LifecycleStage];

export const IntakeStatus = {
  INTAKE_NEW: "INTAKE_NEW",
  INTAKE_IN_PROGRESS: "INTAKE_IN_PROGRESS",
  INTAKE_ON_HOLD: "INTAKE_ON_HOLD",
  INTAKE_AUTHORIZED: "INTAKE_AUTHORIZED",
  INTAKE_ACTIVE: "INTAKE_ACTIVE",
  INTAKE_VOIDED: "INTAKE_VOIDED",
  INTAKE_DROPPED: "INTAKE_DROPPED",
} as const;

export type IntakeStatus = (typeof IntakeStatus)[keyof typeof IntakeStatus];

export const NiaStatus = {
  NIA_NOT_REQUIRED: "NIA_NOT_REQUIRED",
  NIA_NOT_SCHEDULED: "NIA_NOT_SCHEDULED",
  NIA_SCHEDULED: "NIA_SCHEDULED",
  NIA_IN_PROGRESS: "NIA_IN_PROGRESS",
  NIA_PASSED: "NIA_PASSED",
  NIA_FAILED: "NIA_FAILED",
  NIA_DEFERRED: "NIA_DEFERRED",
} as const;

export type NiaStatus = (typeof NiaStatus)[keyof typeof NiaStatus];

export const AuthorizationStatus = {
  AUTH_PENDING: "AUTH_PENDING",
  AUTH_APPROVED: "AUTH_APPROVED",
  AUTH_DENIED: "AUTH_DENIED",
  AUTH_EXPIRED: "AUTH_EXPIRED",
  AUTH_VOIDED: "AUTH_VOIDED",
} as const;

export type AuthorizationStatus =
  (typeof AuthorizationStatus)[keyof typeof AuthorizationStatus];

export const MedicaidTicketStatus = {
  MEDICAID_NEW: "MEDICAID_NEW",
  MEDICAID_IN_PROGRESS: "MEDICAID_IN_PROGRESS",
  MEDICAID_APPROVED: "MEDICAID_APPROVED",
  MEDICAID_DEFERRED: "MEDICAID_DEFERRED",
  MEDICAID_CLOSED: "MEDICAID_CLOSED",
} as const;

export type MedicaidTicketStatus =
  (typeof MedicaidTicketStatus)[keyof typeof MedicaidTicketStatus];

export const LineOfBusiness = {
  LONG_TERM_CARE: "LONG_TERM_CARE",
  NHTD: "NHTD",
  OPWDD: "OPWDD",
  PRIVATE_PAY: "PRIVATE_PAY",
  CUSTODIAL_CARE: "CUSTODIAL_CARE",
  SHORT_TERM_CUSTODIAL: "SHORT_TERM_CUSTODIAL",
  CDPAP: "CDPAP",
} as const;

export type LineOfBusiness = (typeof LineOfBusiness)[keyof typeof LineOfBusiness];

export const GOLD_LOBS: readonly LineOfBusiness[] = [
  LineOfBusiness.LONG_TERM_CARE,
  LineOfBusiness.NHTD,
  LineOfBusiness.OPWDD,
  LineOfBusiness.PRIVATE_PAY,
  LineOfBusiness.CUSTODIAL_CARE,
];

export const DropReasonCategory = {
  NIA_FAILED: "NIA_FAILED",
  NO_FOLLOW_UP: "NO_FOLLOW_UP",
  COMPETITOR: "COMPETITOR",
  PAYER_DENIED: "PAYER_DENIED",
  SHORT_TERM_ONLY: "SHORT_TERM_ONLY",
  THIRD_PARTY_REFERRAL: "THIRD_PARTY_REFERRAL",
  DOC_INCOMPLETE: "DOC_INCOMPLETE",
  CDPAP_SUNSET: "CDPAP_SUNSET",
  OTHER: "OTHER",
} as const;

export type DropReasonCategory =
  (typeof DropReasonCategory)[keyof typeof DropReasonCategory];

/** Legacy values that must not appear after migration */
export const DEPRECATED_PERSON_STATUSES = [
  "pre-intake",
  "closed",
  "authorized",
  "patient",
  "lead",
  "new",
  "in-progress",
] as const;

export const TERMINAL_LIFECYCLE_STAGES: readonly LifecycleStage[] = [
  LifecycleStage.DROPPED_OFF,
  LifecycleStage.DISCHARGED,
];

export const TERMINAL_INTAKE_STATUSES: readonly IntakeStatus[] = [
  IntakeStatus.INTAKE_VOIDED,
  IntakeStatus.INTAKE_DROPPED,
];

export const OPEN_INTAKE_STATUSES: readonly IntakeStatus[] = [
  IntakeStatus.INTAKE_NEW,
  IntakeStatus.INTAKE_IN_PROGRESS,
  IntakeStatus.INTAKE_ON_HOLD,
  IntakeStatus.INTAKE_AUTHORIZED,
  IntakeStatus.INTAKE_ACTIVE,
];

export function isGoldLob(lob: LineOfBusiness): boolean {
  return (GOLD_LOBS as readonly string[]).includes(lob);
}

export function isTerminalLifecycle(stage: LifecycleStage): boolean {
  return (TERMINAL_LIFECYCLE_STAGES as readonly string[]).includes(stage);
}

export function isOpenIntake(status: IntakeStatus): boolean {
  return (OPEN_INTAKE_STATUSES as readonly string[]).includes(status);
}
