import {
  AuthorizationStatus,
  GOLD_LOBS,
  IntakeStatus,
  isGoldLob,
  isOpenIntake,
  isTerminalLifecycle,
  LifecycleStage,
  LineOfBusiness,
  TERMINAL_INTAKE_STATUSES,
} from "./enums";

export interface IntakeRecord {
  id: string;
  lob: LineOfBusiness;
  status: IntakeStatus;
  authorization_id?: string | null;
  authorization_status?: AuthorizationStatus | null;
  authorization_end_date?: string | null;
  start_of_care_date?: string | null;
  anticipated_soc_date?: string | null;
  intake_opened_at?: string | null;
}

export interface PersonRecord {
  id: string;
  lifecycle_stage?: LifecycleStage | null;
  contact_attempt_count?: number;
  converted_at?: string | null;
  hold_until_date?: string | null;
  legacy_tags?: string[];
}

/** Higher number = higher priority for master person stage */
const LIFECYCLE_PRIORITY: Record<LifecycleStage, number> = {
  [LifecycleStage.LEAD_NEW]: 10,
  [LifecycleStage.LEAD_CONTACTING]: 20,
  [LifecycleStage.REFERRAL_ACTIVE]: 30,
  [LifecycleStage.ON_HOLD]: 45,
  [LifecycleStage.INTAKE_IN_PROGRESS]: 40,
  [LifecycleStage.AUTHORIZED_PENDING_SOC]: 50,
  [LifecycleStage.PATIENT_ACTIVE]: 60,
  [LifecycleStage.DROPPED_OFF]: 0,
  [LifecycleStage.DISCHARGED]: 0,
};

const INTAKE_STATUS_TO_LIFECYCLE: Partial<Record<IntakeStatus, LifecycleStage>> = {
  [IntakeStatus.INTAKE_NEW]: LifecycleStage.INTAKE_IN_PROGRESS,
  [IntakeStatus.INTAKE_IN_PROGRESS]: LifecycleStage.INTAKE_IN_PROGRESS,
  [IntakeStatus.INTAKE_ON_HOLD]: LifecycleStage.ON_HOLD,
  [IntakeStatus.INTAKE_AUTHORIZED]: LifecycleStage.AUTHORIZED_PENDING_SOC,
  [IntakeStatus.INTAKE_ACTIVE]: LifecycleStage.PATIENT_ACTIVE,
};

function intakeToLifecycleStage(intake: IntakeRecord): LifecycleStage | null {
  if ((TERMINAL_INTAKE_STATUSES as readonly string[]).includes(intake.status)) {
    return null;
  }

  if (intake.status === IntakeStatus.INTAKE_AUTHORIZED) {
    const authValid =
      intake.authorization_status === AuthorizationStatus.AUTH_APPROVED &&
      (!intake.authorization_end_date ||
        intake.authorization_end_date >= new Date().toISOString().slice(0, 10));
    if (!authValid) return LifecycleStage.INTAKE_IN_PROGRESS;
  }

  if (intake.status === IntakeStatus.INTAKE_ACTIVE) {
    if (!intake.start_of_care_date) return LifecycleStage.AUTHORIZED_PENDING_SOC;
  }

  return INTAKE_STATUS_TO_LIFECYCLE[intake.status] ?? null;
}

function shortTermOnly(intakes: IntakeRecord[]): boolean {
  const open = intakes.filter((i) => isOpenIntake(i.status));
  if (open.length === 0) return false;
  return open.every((i) => i.lob === LineOfBusiness.SHORT_TERM_CUSTODIAL);
}

/**
 * Computes the single master lifecycle stage for a person from their intakes.
 * Resolves multi-intake conflicts per framework priority rules.
 */
export function computeLifecycleStage(
  person: PersonRecord,
  intakes: IntakeRecord[]
): LifecycleStage {
  const openIntakes = intakes.filter((i) => isOpenIntake(i.status));
  const goldOpen = openIntakes.filter((i) => isGoldLob(i.lob));

  const stagesFromIntakes = goldOpen
    .map(intakeToLifecycleStage)
    .filter((s): s is LifecycleStage => s !== null);

  if (stagesFromIntakes.length > 0) {
    return stagesFromIntakes.reduce((best, current) =>
      LIFECYCLE_PRIORITY[current] > LIFECYCLE_PRIORITY[best] ? current : best
    );
  }

  if (shortTermOnly(openIntakes)) {
    return LifecycleStage.REFERRAL_ACTIVE;
  }

  if (person.converted_at) {
    return LifecycleStage.REFERRAL_ACTIVE;
  }

  if ((person.contact_attempt_count ?? 0) > 0) {
    return LifecycleStage.LEAD_CONTACTING;
  }

  return LifecycleStage.LEAD_NEW;
}

export interface TransitionGate {
  from: LifecycleStage | "*";
  to: LifecycleStage;
  required_fields: string[];
  condition?: string;
}

export const TRANSITION_GATES: TransitionGate[] = [
  {
    from: LifecycleStage.LEAD_NEW,
    to: LifecycleStage.LEAD_CONTACTING,
    required_fields: ["contact_attempt_count"],
    condition: "contact_attempt_count >= 1",
  },
  {
    from: LifecycleStage.LEAD_CONTACTING,
    to: LifecycleStage.REFERRAL_ACTIVE,
    required_fields: ["converted_at", "primary_lob"],
  },
  {
    from: LifecycleStage.REFERRAL_ACTIVE,
    to: LifecycleStage.INTAKE_IN_PROGRESS,
    required_fields: ["intake_opened_at"],
  },
  {
    from: LifecycleStage.INTAKE_IN_PROGRESS,
    to: LifecycleStage.AUTHORIZED_PENDING_SOC,
    required_fields: ["authorization_id"],
    condition: "authorization.status = AUTH_APPROVED",
  },
  {
    from: LifecycleStage.AUTHORIZED_PENDING_SOC,
    to: LifecycleStage.PATIENT_ACTIVE,
    required_fields: ["start_of_care_date"],
  },
  {
    from: "*",
    to: LifecycleStage.ON_HOLD,
    required_fields: ["hold_reason", "hold_until_date"],
  },
  {
    from: "*",
    to: LifecycleStage.DROPPED_OFF,
    required_fields: ["drop_reason", "drop_reason_category", "dropped_at"],
  },
  {
    from: LifecycleStage.PATIENT_ACTIVE,
    to: LifecycleStage.DISCHARGED,
    required_fields: ["discharge_date", "discharge_reason"],
  },
];

/** Sales dashboard: pre-patient pipeline on gold LOBs only */
export function isSalesDashboardVisible(
  lifecycleStage: LifecycleStage,
  intakes: IntakeRecord[]
): boolean {
  if (isTerminalLifecycle(lifecycleStage)) return false;
  if (lifecycleStage === LifecycleStage.PATIENT_ACTIVE) return false;

  const hasGoldOpen = intakes.some(
    (i) => isOpenIntake(i.status) && isGoldLob(i.lob) && i.lob !== LineOfBusiness.CDPAP
  );

  if (shortTermOnly(intakes.filter((i) => isOpenIntake(i.status)))) {
    return false;
  }

  return hasGoldOpen;
}

/** True active census — not authorized pipeline */
export function isActiveCensusMember(
  lifecycleStage: LifecycleStage,
  intakes: IntakeRecord[]
): boolean {
  if (lifecycleStage !== LifecycleStage.PATIENT_ACTIVE) return false;

  return intakes.some(
    (i) =>
      i.status === IntakeStatus.INTAKE_ACTIVE &&
      i.start_of_care_date != null &&
      i.authorization_status === AuthorizationStatus.AUTH_APPROVED &&
      i.lob !== LineOfBusiness.CDPAP
  );
}

/** NIA scheduled → intake in progress (automation rule) */
export function onNiaScheduled(intake: IntakeRecord): IntakeRecord {
  return {
    ...intake,
    status: IntakeStatus.INTAKE_IN_PROGRESS,
  };
}

/** NIA failed → 6-month hold */
export function onNiaFailed(
  intake: IntakeRecord,
  holdUntilDate: string
): { intake: IntakeRecord; personStage: LifecycleStage; holdReason: string } {
  return {
    intake: { ...intake, status: IntakeStatus.INTAKE_ON_HOLD },
    personStage: LifecycleStage.ON_HOLD,
    holdReason: "NIA_FAILED_WAIT",
  };
}

export const SLA_DAYS: Record<string, number> = {
  LEAD_NEW_CONTACT: 1,
  LEAD_CONTACTING_FOLLOWUP: 3,
  LEAD_CONTACTING_DROP_CANDIDATE: 14,
  REFERRAL_TO_INTAKE: 7,
  INTAKE_NEXT_ACTION: 5,
  AUTHORIZED_TO_SOC: 14,
  ANTICIPATED_SOC_STALE: 7,
  MEDICAID_DEFERRED_REVIEW: 30,
  NIA_FAILED_HOLD_MONTHS: 6,
};
