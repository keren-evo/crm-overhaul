-- =============================================================================
-- CRM Data Integrity Audit Pack
-- Version: 1.0.0
-- Database: PostgreSQL (adjust syntax for MySQL/SQL Server as needed)
--
-- BEFORE RUNNING: Replace table/column names to match your Schema Manager export.
-- Expected tables: persons, intakes, authorizations, medicaid_tickets, service_episodes
-- =============================================================================

\set ON_ERROR_STOP on

-- ---------------------------------------------------------------------------
-- 0. BASELINE SUMMARY
-- ---------------------------------------------------------------------------
SELECT '=== AUDIT BASELINE SUMMARY ===' AS report_section;

SELECT
  (SELECT COUNT(*) FROM persons) AS total_persons,
  (SELECT COUNT(*) FROM intakes) AS total_intakes,
  (SELECT COUNT(*) FROM authorizations) AS total_authorizations;

-- Legacy status distribution (adjust column: legacy_status OR lifecycle_stage)
SELECT
  COALESCE(legacy_status, lifecycle_stage::text, 'NULL') AS status_value,
  COUNT(*) AS record_count
FROM persons
GROUP BY 1
ORDER BY record_count DESC;

-- ---------------------------------------------------------------------------
-- 1. AUTHORIZED WITHOUT VALID AUTHORIZATION (critical)
-- Dashboard inflation: 1,960 authorized vs ~1,200 census
-- ---------------------------------------------------------------------------
SELECT '=== 1. AUTHORIZED WITHOUT VALID AUTH ===' AS report_section;

SELECT
  p.id AS person_id,
  p.legacy_status,
  p.lifecycle_stage,
  i.id AS intake_id,
  i.lob,
  i.status AS intake_status,
  a.id AS authorization_id,
  a.status AS authorization_status,
  a.end_date AS auth_end_date
FROM persons p
LEFT JOIN intakes i ON i.person_id = p.id
LEFT JOIN authorizations a ON a.id = i.authorization_id
WHERE
  (
    p.legacy_status ILIKE '%authorized%'
    OR p.lifecycle_stage IN ('AUTHORIZED_PENDING_SOC', 'authorized', 'patient')
    OR i.status IN ('INTAKE_AUTHORIZED', 'authorized', 'INTAKE_ACTIVE')
  )
  AND (
    a.id IS NULL
    OR a.status != 'AUTH_APPROVED'
    OR a.end_date < CURRENT_DATE
  )
ORDER BY p.id
LIMIT 500;

SELECT COUNT(DISTINCT p.id) AS orphan_authorized_person_count
FROM persons p
LEFT JOIN intakes i ON i.person_id = p.id
LEFT JOIN authorizations a ON a.id = i.authorization_id AND a.status = 'AUTH_APPROVED' AND a.end_date >= CURRENT_DATE
WHERE
  (p.legacy_status ILIKE '%authorized%' OR i.status IN ('INTAKE_AUTHORIZED', 'authorized'))
  AND a.id IS NULL;

-- ---------------------------------------------------------------------------
-- 2. AUTHORIZED WITH DROPPED OR VOIDED INTAKE
-- ---------------------------------------------------------------------------
SELECT '=== 2. AUTHORIZED + DROPPED/VOIDED INTAKE ===' AS report_section;

SELECT
  p.id AS person_id,
  i.id AS intake_id,
  i.status AS intake_status,
  i.lob,
  i.updated_at
FROM persons p
JOIN intakes i ON i.person_id = p.id
WHERE
  i.status IN ('INTAKE_DROPPED', 'INTAKE_VOIDED', 'dropped', 'voided', 'dropped intake')
  AND (
    p.legacy_status ILIKE '%authorized%'
    OR p.lifecycle_stage IN ('AUTHORIZED_PENDING_SOC', 'PATIENT_ACTIVE')
    OR EXISTS (
      SELECT 1 FROM intakes i2
      WHERE i2.person_id = p.id
        AND i2.status IN ('INTAKE_AUTHORIZED', 'authorized')
    )
  )
ORDER BY p.id;

-- ---------------------------------------------------------------------------
-- 3. CDPAP LEGACY COHORT (post 2025-04-01 sunset)
-- ---------------------------------------------------------------------------
SELECT '=== 3. CDPAP REMEDIATION QUEUE ===' AS report_section;

SELECT
  p.id AS person_id,
  i.id AS intake_id,
  i.lob,
  i.status AS intake_status,
  a.end_date AS auth_end_date,
  se.last_service_date
FROM persons p
JOIN intakes i ON i.person_id = p.id AND i.lob = 'CDPAP'
LEFT JOIN authorizations a ON a.id = i.authorization_id
LEFT JOIN LATERAL (
  SELECT MAX(service_date) AS last_service_date
  FROM service_episodes se
  WHERE se.intake_id = i.id AND se.status = 'ACTIVE'
) se ON TRUE
WHERE
  i.status NOT IN ('INTAKE_DROPPED', 'INTAKE_VOIDED', 'dropped', 'voided')
  OR p.lifecycle_stage IN ('AUTHORIZED_PENDING_SOC', 'PATIENT_ACTIVE')
  OR p.legacy_status ILIKE '%authorized%'
ORDER BY se.last_service_date NULLS FIRST;

SELECT COUNT(DISTINCT p.id) AS cdpap_stale_person_count
FROM persons p
JOIN intakes i ON i.person_id = p.id AND i.lob = 'CDPAP'
WHERE p.lifecycle_stage IN ('AUTHORIZED_PENDING_SOC', 'PATIENT_ACTIVE')
   OR p.legacy_status ILIKE '%authorized%';

-- ---------------------------------------------------------------------------
-- 4. THIRD-PARTY REFERRALS (e.g. Girling) STILL COUNTED AS PATIENTS
-- ---------------------------------------------------------------------------
SELECT '=== 4. THIRD-PARTY REFERRAL NOT OUR PATIENT ===' AS report_section;

SELECT
  p.id,
  p.referral_destination,
  p.lifecycle_stage,
  p.legacy_status,
  i.lob,
  i.status
FROM persons p
LEFT JOIN intakes i ON i.person_id = p.id
WHERE
  (
    p.referral_destination ILIKE '%Girling%'
    OR p.is_agency_patient = FALSE
    OR i.referral_destination ILIKE '%Girling%'
  )
  AND (
    p.lifecycle_stage IN ('AUTHORIZED_PENDING_SOC', 'PATIENT_ACTIVE')
    OR p.legacy_status ILIKE ANY (ARRAY['%authorized%', '%patient%'])
  );

-- ---------------------------------------------------------------------------
-- 5. CONFLICTING LABELS (patient tag + lead tag + new status)
-- ---------------------------------------------------------------------------
SELECT '=== 5. CONFLICTING LEGACY TAGS ===' AS report_section;

SELECT
  p.id,
  p.lifecycle_stage,
  p.legacy_status,
  p.legacy_tags,
  p.contact_attempt_count
FROM persons p
WHERE
  (p.legacy_tags && ARRAY['patient', 'lead']::text[])
  OR (p.legacy_status ILIKE '%patient%' AND p.lifecycle_stage LIKE 'LEAD_%')
  OR (p.legacy_status = 'new' AND COALESCE(p.contact_attempt_count, 0) > 0)
  OR p.legacy_status = 'pre-intake';

SELECT legacy_status, COUNT(*) FROM persons WHERE legacy_status = 'pre-intake' GROUP BY 1;
SELECT legacy_status, COUNT(*) FROM persons WHERE legacy_status = 'closed' GROUP BY 1;

-- ---------------------------------------------------------------------------
-- 6. MULTI-INTAKE CONFLICTS
-- ---------------------------------------------------------------------------
SELECT '=== 6. MULTI-INTAKE OPEN CONFLICTS ===' AS report_section;

SELECT
  p.id AS person_id,
  COUNT(*) FILTER (WHERE i.status NOT IN ('INTAKE_DROPPED', 'INTAKE_VOIDED', 'dropped', 'voided')) AS open_intake_count,
  ARRAY_AGG(DISTINCT i.lob) AS lobs,
  ARRAY_AGG(DISTINCT i.status) AS intake_statuses
FROM persons p
JOIN intakes i ON i.person_id = p.id
GROUP BY p.id
HAVING COUNT(*) FILTER (WHERE i.status NOT IN ('INTAKE_DROPPED', 'INTAKE_VOIDED', 'dropped', 'voided')) > 1
ORDER BY open_intake_count DESC
LIMIT 200;

-- ---------------------------------------------------------------------------
-- 7. SHORT-TERM ONLY (should not appear on sales dashboard)
-- ---------------------------------------------------------------------------
SELECT '=== 7. SHORT-TERM ONLY PIPELINE ===' AS report_section;

WITH open_intakes AS (
  SELECT
    i.person_id,
    BOOL_AND(i.lob = 'SHORT_TERM_CUSTODIAL') AS short_term_only,
    COUNT(*) AS open_count
  FROM intakes i
  WHERE i.status NOT IN ('INTAKE_DROPPED', 'INTAKE_VOIDED', 'dropped', 'voided')
  GROUP BY i.person_id
)
SELECT
  p.id,
  p.lifecycle_stage,
  oi.open_count
FROM open_intakes oi
JOIN persons p ON p.id = oi.person_id
WHERE oi.short_term_only = TRUE
  AND oi.open_count >= 1;

-- ---------------------------------------------------------------------------
-- 8. ANTICIPATED SOC PASSED WITHOUT CONFIRMED SOC
-- ---------------------------------------------------------------------------
SELECT '=== 8. STALE ANTICIPATED SOC ===' AS report_section;

SELECT
  p.id AS person_id,
  i.id AS intake_id,
  i.lob,
  i.anticipated_soc_date,
  i.start_of_care_date,
  CURRENT_DATE - i.anticipated_soc_date::date AS days_past_anticipated
FROM intakes i
JOIN persons p ON p.id = i.person_id
WHERE
  i.anticipated_soc_date IS NOT NULL
  AND i.start_of_care_date IS NULL
  AND i.anticipated_soc_date::date < CURRENT_DATE
  AND i.status IN ('INTAKE_AUTHORIZED', 'authorized')
ORDER BY days_past_anticipated DESC
LIMIT 200;

-- ---------------------------------------------------------------------------
-- 9. TRUE ACTIVE CENSUS vs LEGACY AUTHORIZED COUNT
-- ---------------------------------------------------------------------------
SELECT '=== 9. CENSUS RECONCILIATION ===' AS report_section;

-- Legacy authorized count (what dashboard likely shows today)
SELECT COUNT(DISTINCT p.id) AS legacy_authorized_dashboard_count
FROM persons p
WHERE p.legacy_status ILIKE '%authorized%'
   OR p.lifecycle_stage IN ('AUTHORIZED_PENDING_SOC', 'PATIENT_ACTIVE');

-- True active census (target: ~1,200–1,300)
SELECT COUNT(DISTINCT p.id) AS true_active_census
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

-- Gap analysis
SELECT
  (SELECT COUNT(DISTINCT p.id) FROM persons p
   WHERE p.legacy_status ILIKE '%authorized%' OR p.lifecycle_stage IN ('AUTHORIZED_PENDING_SOC', 'PATIENT_ACTIVE')
  ) AS legacy_count,
  (SELECT COUNT(DISTINCT p.id) FROM persons p
   JOIN intakes i ON i.person_id = p.id
   JOIN authorizations a ON a.id = i.authorization_id
   JOIN service_episodes se ON se.intake_id = i.id
   WHERE p.lifecycle_stage = 'PATIENT_ACTIVE'
     AND i.status = 'INTAKE_ACTIVE'
     AND a.status = 'AUTH_APPROVED'
     AND se.status = 'ACTIVE'
     AND i.lob != 'CDPAP'
  ) AS true_census,
  (SELECT COUNT(DISTINCT p.id) FROM persons p
   WHERE p.legacy_status ILIKE '%authorized%' OR p.lifecycle_stage IN ('AUTHORIZED_PENDING_SOC', 'PATIENT_ACTIVE')
  ) -
  (SELECT COUNT(DISTINCT p.id) FROM persons p
   JOIN intakes i ON i.person_id = p.id
   JOIN authorizations a ON a.id = i.authorization_id
   JOIN service_episodes se ON se.intake_id = i.id
   WHERE p.lifecycle_stage = 'PATIENT_ACTIVE'
     AND i.status = 'INTAKE_ACTIVE'
     AND a.status = 'AUTH_APPROVED'
     AND se.status = 'ACTIVE'
     AND i.lob != 'CDPAP'
  ) AS inflation_gap;

-- ---------------------------------------------------------------------------
-- 10. NO SERVICE ACTIVITY 12+ MONTHS BUT STILL AUTHORIZED/ACTIVE
-- ---------------------------------------------------------------------------
SELECT '=== 10. STALE ACTIVE / AUTHORIZED (12+ MO NO SERVICE) ===' AS report_section;

SELECT
  p.id,
  i.lob,
  i.status,
  se.last_service_date,
  CURRENT_DATE - se.last_service_date::date AS days_since_service
FROM persons p
JOIN intakes i ON i.person_id = p.id
LEFT JOIN LATERAL (
  SELECT MAX(service_date) AS last_service_date
  FROM service_episodes se
  WHERE se.intake_id = i.id
) se ON TRUE
WHERE
  (p.legacy_status ILIKE '%authorized%' OR i.status IN ('INTAKE_AUTHORIZED', 'INTAKE_ACTIVE'))
  AND (se.last_service_date IS NULL OR se.last_service_date < CURRENT_DATE - INTERVAL '12 months')
ORDER BY days_since_service DESC NULLS FIRST
LIMIT 200;

-- ---------------------------------------------------------------------------
-- 11. MEDICAID TICKET ORPHANS / LONG DEFERRED
-- ---------------------------------------------------------------------------
SELECT '=== 11. MEDICAID DEFERRED > 30 DAYS ===' AS report_section;

SELECT
  p.id,
  mt.id AS ticket_id,
  mt.status,
  mt.updated_at,
  CURRENT_DATE - mt.updated_at::date AS days_in_status
FROM medicaid_tickets mt
JOIN persons p ON p.id = mt.person_id
WHERE mt.status IN ('MEDICAID_DEFERRED', 'deferred')
  AND mt.updated_at < CURRENT_DATE - INTERVAL '30 days'
ORDER BY days_in_status DESC;

-- ---------------------------------------------------------------------------
-- 12. DUPLICATE PERSON CANDIDATES
-- ---------------------------------------------------------------------------
SELECT '=== 12. DUPLICATE CANDIDATES ===' AS report_section;

SELECT medicaid_id, COUNT(*) AS cnt
FROM persons
WHERE medicaid_id IS NOT NULL AND medicaid_id != ''
GROUP BY medicaid_id
HAVING COUNT(*) > 1;

SELECT phone, date_of_birth, COUNT(*) AS cnt
FROM persons
WHERE phone IS NOT NULL AND date_of_birth IS NOT NULL
GROUP BY phone, date_of_birth
HAVING COUNT(*) > 1
ORDER BY cnt DESC
LIMIT 50;

-- ---------------------------------------------------------------------------
-- 13. INTAKE FIELD BLOAT (121 fields — usage audit starter)
-- Requires information_schema access; skip if unavailable
-- ---------------------------------------------------------------------------
SELECT '=== 13. INTAKE TABLE COLUMN COUNT ===' AS report_section;

SELECT COUNT(*) AS intake_column_count
FROM information_schema.columns
WHERE table_name = 'intakes';

-- ---------------------------------------------------------------------------
-- 14. EXPORT REMEDIATION BATCH IDS (for staging migration)
-- ---------------------------------------------------------------------------
SELECT '=== 14. REMEDIATION BATCH — ORPHAN AUTHORIZED ===' AS report_section;

SELECT ARRAY_AGG(DISTINCT p.id) AS person_ids_orphan_authorized
FROM persons p
LEFT JOIN intakes i ON i.person_id = p.id
LEFT JOIN authorizations a ON a.id = i.authorization_id AND a.status = 'AUTH_APPROVED' AND a.end_date >= CURRENT_DATE
WHERE (p.legacy_status ILIKE '%authorized%' OR i.status IN ('INTAKE_AUTHORIZED', 'authorized'))
  AND a.id IS NULL;

SELECT '=== AUDIT COMPLETE ===' AS report_section;
