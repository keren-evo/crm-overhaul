import { getDb } from "./db";

export interface LeadInput {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  landing_page?: string;
}

export interface Lead extends LeadInput {
  id: number;
  created_at: string;
}

export interface CreateLeadResult {
  lead: Lead;
  deduplicated: boolean;
}

const LEAD_COLUMNS = `id, first_name, last_name, email, phone, source, medium, campaign, content, landing_page, created_at`;

export function createLead(input: LeadInput): CreateLeadResult {
  const normalizedEmail = input.email.trim().toLowerCase();
  const payload: LeadInput = { ...input, email: normalizedEmail };
  const db = getDb();

  const existing = db
    .prepare(`SELECT ${LEAD_COLUMNS} FROM leads WHERE email = ?`)
    .get(normalizedEmail) as Lead | undefined;

  if (existing) {
    console.log("[leads] deduplicated:", normalizedEmail);
    return { lead: existing, deduplicated: true };
  }

  const result = db
    .prepare(
      `INSERT INTO leads (first_name, last_name, email, phone, source, medium, campaign, content, landing_page)
       VALUES (@first_name, @last_name, @email, @phone, @source, @medium, @campaign, @content, @landing_page)`
    )
    .run(payload);

  const lead = db
    .prepare(`SELECT ${LEAD_COLUMNS} FROM leads WHERE id = ?`)
    .get(Number(result.lastInsertRowid)) as Lead;

  console.log("[leads] created:", lead.id, lead.email);
  return { lead, deduplicated: false };
}

export function getAllLeads(): Lead[] {
  return getDb()
    .prepare(`SELECT ${LEAD_COLUMNS} FROM leads ORDER BY created_at DESC`)
    .all() as Lead[];
}

export function getDashboardMetrics() {
  const db = getDb();

  const total = (db.prepare("SELECT COUNT(*) as count FROM leads").get() as { count: number })
    .count;

  const bySource = db
    .prepare(
      `SELECT COALESCE(source, 'unknown') as source, COUNT(*) as count
       FROM leads GROUP BY source ORDER BY count DESC`
    )
    .all() as { source: string; count: number }[];

  const byCampaign = db
    .prepare(
      `SELECT COALESCE(campaign, 'unknown') as campaign, COUNT(*) as count
       FROM leads GROUP BY campaign ORDER BY count DESC`
    )
    .all() as { campaign: string; count: number }[];

  const daily = db
    .prepare(
      `SELECT date(created_at) as date, COUNT(*) as count
       FROM leads GROUP BY date(created_at) ORDER BY date DESC LIMIT 30`
    )
    .all() as { date: string; count: number }[];

  return { total, bySource, byCampaign, daily };
}
