-- =============================================================================
-- CRM Dashboard Query Pack
-- Version: 1.0.0
-- Implements sales, ops, census, and funnel leakage specs
-- =============================================================================

-- ---------------------------------------------------------------------------
-- SALES DASHBOARD — pre-patient gold LOB pipeline
-- Columns: name, lifecycle_stage, primary_lob, intake_opened_at, next_action_date, nia_status, rep, days_in_stage
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_sales_dashboard AS
SELECT
  p.id,
  p.first_name,
  p.last_name,
  p.lifecycle_stage,
  p.primary_lob,
  p.assigned_rep,
  MIN(i.intake_opened_at) AS intake_opened_at,
  COALESCE(p.next_action_date, MIN(i.next_action_date)) AS next_action_date,
  MAX(i.nia_status) FILTER (WHERE i.nia_status IS NOT NULL) AS nia_status,
  CURRENT_DATE - COALESCE(p.stage_entered_at, p.created_at)::date AS days_in_stage,
  BOOL_OR(mt.status IN ('MEDICAID_NEW', 'MEDICAID_IN_PROGRESS', 'MEDICAID_DEFERRED')) AS has_open_medicaid_ticket
FROM persons p
JOIN intakes i ON i.person_id = p.id
LEFT JOIN medicaid_tickets mt ON mt.person_id = p.id AND mt.status NOT IN ('MEDICAID_CLOSED', 'closed')
WHERE
  p.lifecycle_stage IN (
    'LEAD_NEW',
    'LEAD_CONTACTING',
    'REFERRAL_ACTIVE',
    'INTAKE_IN_PROGRESS',
    'AUTHORIZED_PENDING_SOC',
    'ON_HOLD'
  )
  AND i.lob IN ('LONG_TERM_CARE', 'NHTD', 'OPWDD', 'PRIVATE_PAY', 'CUSTODIAL_CARE')
  AND i.status NOT IN ('INTAKE_DROPPED', 'INTAKE_VOIDED', 'dropped', 'voided')
  AND i.lob != 'CDPAP'
  AND NOT (
    -- Exclude short-term-only: all open intakes are short-term
    NOT EXISTS (
      SELECT 1 FROM intakes i2
      WHERE i2.person_id = p.id
        AND i2.status NOT IN ('INTAKE_DROPPED', 'INTAKE_VOIDED', 'dropped', 'voided')
        AND i2.lob != 'SHORT_TERM_CUSTODIAL'
    )
    AND EXISTS (
      SELECT 1 FROM intakes i3
      WHERE i3.person_id = p.id
        AND i3.status NOT IN ('INTAKE_DROPPED', 'INTAKE_VOIDED', 'dropped', 'voided')
        AND i3.lob = 'SHORT_TERM_CUSTODIAL'
    )
  )
GROUP BY p.id, p.first_name, p.last_name, p.lifecycle_stage, p.primary_lob, p.assigned_rep, p.next_action_date, p.stage_entered_at, p.created_at;

-- ---------------------------------------------------------------------------
-- OPERATIONS DASHBOARD — all non-dropped + remediation queues
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_ops_dashboard AS
SELECT
  p.id,
  p.first_name,
  p.last_name,
  p.lifecycle_stage,
  i.id AS intake_id,
  i.lob,
  i.status AS intake_status,
  i.anticipated_soc_date,
  i.start_of_care_date,
  p.hold_reason,
  p.hold_until_date,
  mt.status AS medicaid_ticket_status
FROM persons p
LEFT JOIN intakes i ON i.person_id = p.id
  AND i.status NOT IN ('INTAKE_VOIDED', 'voided')
LEFT JOIN medicaid_tickets mt ON mt.person_id = p.id AND mt.status NOT IN ('MEDICAID_CLOSED', 'closed')
WHERE p.lifecycle_stage NOT IN ('DROPPED_OFF', 'DISCHARGED')
   OR i.status NOT IN ('INTAKE_DROPPED', 'dropped');

-- Stale anticipated SOC queue
CREATE OR REPLACE VIEW v_ops_stale_anticipated_soc AS
SELECT p.id, i.id AS intake_id, i.lob, i.anticipated_soc_date,
       CURRENT_DATE - i.anticipated_soc_date::date AS days_overdue
FROM persons p
JOIN intakes i ON i.person_id = p.id
WHERE i.status IN ('INTAKE_AUTHORIZED', 'authorized')
  AND i.anticipated_soc_date IS NOT NULL
  AND i.start_of_care_date IS NULL
  AND i.anticipated_soc_date::date < CURRENT_DATE - 7;

-- CDPAP remediation queue
CREATE OR REPLACE VIEW v_ops_cdpap_remediation AS
SELECT p.id, i.id AS intake_id, p.lifecycle_stage, i.status, a.end_date
FROM persons p
JOIN intakes i ON i.person_id = p.id AND i.lob = 'CDPAP'
LEFT JOIN authorizations a ON a.id = i.authorization_id
WHERE p.lifecycle_stage IN ('AUTHORIZED_PENDING_SOC', 'PATIENT_ACTIVE')
   OR p.legacy_status ILIKE '%authorized%'
   OR i.status IN ('INTAKE_AUTHORIZED', 'INTAKE_ACTIVE');

-- ---------------------------------------------------------------------------
-- TRUE ACTIVE CENSUS
-- Target: ~1,200–1,300 (not 1,960 authorized)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_active_census AS
SELECT DISTINCT
  p.id,
  p.first_name,
  p.last_name,
  i.lob,
  i.start_of_care_date,
  a.end_date AS auth_end_date,
  se.id AS service_episode_id
FROM persons p
JOIN intakes i ON i.person_id = p.id
JOIN authorizations a ON a.id = i.authorization_id
JOIN service_episodes se ON se.intake_id = i.id
WHERE
  p.lifecycle_stage = 'PATIENT_ACTIVE'
  AND i.status = 'INTAKE_ACTIVE'
  AND i.start_of_care_date IS NOT NULL
  AND a.status = 'AUTH_APPROVED'
  AND a.end_date >= CURRENT_DATE
  AND se.status = 'ACTIVE'
  AND i.lob != 'CDPAP';

-- SELECT COUNT(*) FROM v_active_census;

-- ---------------------------------------------------------------------------
-- FUNNEL LEAKAGE BY STAGE AND REASON
-- Leakage = entered stage X, exited to DROPPED_OFF without PATIENT_ACTIVE
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_funnel_leakage AS
SELECT
  DATE_TRUNC('month', p.dropped_at) AS drop_month,
  p.last_pipeline_stage AS stage_before_drop,
  p.drop_reason_category,
  COUNT(*) AS drop_count
FROM persons p
WHERE p.lifecycle_stage = 'DROPPED_OFF'
  AND p.dropped_at IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM person_stage_history h
    WHERE h.person_id = p.id AND h.lifecycle_stage = 'PATIENT_ACTIVE'
  )
GROUP BY 1, 2, 3
ORDER BY 1 DESC, drop_count DESC;

-- Stage conversion rates (requires person_stage_history table)
CREATE OR REPLACE VIEW v_funnel_conversion AS
WITH stage_entries AS (
  SELECT
    lifecycle_stage,
    DATE_TRUNC('month', entered_at) AS period,
    COUNT(*) AS entries
  FROM person_stage_history
  GROUP BY 1, 2
),
stage_exits AS (
  SELECT
    lifecycle_stage,
    DATE_TRUNC('month', exited_at) AS period,
    COUNT(*) FILTER (WHERE next_stage NOT IN ('DROPPED_OFF')) AS progressed,
    COUNT(*) FILTER (WHERE next_stage = 'DROPPED_OFF') AS dropped
  FROM person_stage_history
  WHERE exited_at IS NOT NULL
  GROUP BY 1, 2
)
SELECT
  e.lifecycle_stage,
  e.period,
  e.entries,
  COALESCE(x.progressed, 0) AS progressed,
  COALESCE(x.dropped, 0) AS dropped,
  ROUND(100.0 * COALESCE(x.progressed, 0) / NULLIF(e.entries, 0), 1) AS conversion_pct,
  ROUND(100.0 * COALESCE(x.dropped, 0) / NULLIF(e.entries, 0), 1) AS leak_pct
FROM stage_entries e
LEFT JOIN stage_exits x ON x.lifecycle_stage = e.lifecycle_stage AND x.period = e.period
ORDER BY e.period DESC, e.lifecycle_stage;

-- ---------------------------------------------------------------------------
-- NEVER SHOW ON DASHBOARD (QA query — should return 0 rows on clean data)
-- ---------------------------------------------------------------------------
SELECT p.id, 'terminal_on_sales' AS violation
FROM persons p
WHERE p.lifecycle_stage IN ('DROPPED_OFF', 'DISCHARGED')
  AND p.id IN (SELECT id FROM v_sales_dashboard)

UNION ALL

SELECT p.id, 'voided_on_sales'
FROM persons p
JOIN intakes i ON i.person_id = p.id
WHERE i.status IN ('INTAKE_VOIDED', 'voided')
  AND p.id IN (SELECT id FROM v_sales_dashboard)

UNION ALL

SELECT p.id, 'orphan_authorized_on_census'
FROM persons p
WHERE p.id IN (SELECT id FROM v_active_census)
  AND NOT EXISTS (
    SELECT 1 FROM intakes i
    JOIN authorizations a ON a.id = i.authorization_id
    WHERE i.person_id = p.id AND a.status = 'AUTH_APPROVED'
  );

-- ---------------------------------------------------------------------------
-- LEAD AGING BUCKETS
-- ---------------------------------------------------------------------------
SELECT
  CASE
    WHEN CURRENT_DATE - p.created_at::date <= 3 THEN '0-3d'
    WHEN CURRENT_DATE - p.created_at::date <= 7 THEN '4-7d'
    WHEN CURRENT_DATE - p.created_at::date <= 14 THEN '8-14d'
    WHEN CURRENT_DATE - p.created_at::date <= 30 THEN '15-30d'
    ELSE '30d+'
  END AS lead_age_bucket,
  p.lifecycle_stage,
  COUNT(*) AS cnt
FROM persons p
WHERE p.lifecycle_stage IN ('LEAD_NEW', 'LEAD_CONTACTING')
GROUP BY 1, 2
ORDER BY 1, 2;

-- SLA breaches
SELECT p.id, p.lifecycle_stage, p.assigned_rep,
       CURRENT_DATE - p.stage_entered_at::date AS days_in_stage
FROM persons p
WHERE
  (p.lifecycle_stage = 'LEAD_NEW' AND CURRENT_DATE - p.stage_entered_at::date > 1)
  OR (p.lifecycle_stage = 'LEAD_CONTACTING' AND CURRENT_DATE - COALESCE(p.last_contact_at, p.stage_entered_at)::date > 3)
  OR (p.lifecycle_stage = 'REFERRAL_ACTIVE' AND CURRENT_DATE - p.stage_entered_at::date > 7)
  OR (p.lifecycle_stage = 'INTAKE_IN_PROGRESS' AND CURRENT_DATE - COALESCE(p.next_action_date, p.stage_entered_at)::date > 5)
  OR (p.lifecycle_stage = 'AUTHORIZED_PENDING_SOC' AND EXISTS (
    SELECT 1 FROM intakes i
    WHERE i.person_id = p.id
      AND i.anticipated_soc_date IS NOT NULL
      AND i.start_of_care_date IS NULL
      AND i.anticipated_soc_date::date < CURRENT_DATE - 7
  ));
