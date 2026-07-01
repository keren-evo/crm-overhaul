import { NextRequest, NextResponse } from "next/server";
import { corsPreflight, withCors } from "@/lib/cors";
import { getAllLeads } from "@/lib/leads";

/**
 * CRM webhook stub — forwards lead payload to an external CRM when configured.
 * Set CRM_WEBHOOK_URL in .env to enable forwarding.
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflight(request);
}

export async function POST(request: NextRequest) {
  try {
    const webhookUrl = process.env.CRM_WEBHOOK_URL;

    if (!webhookUrl) {
      console.log("[api/webhooks/crm] stub: CRM_WEBHOOK_URL not configured");
      return withCors(
        request,
        NextResponse.json({
          status: "stub",
          message: "CRM webhook not configured. Set CRM_WEBHOOK_URL in .env",
        })
      );
    }

    const leads = getAllLeads();
    const payload = { synced_at: new Date().toISOString(), leads };

    const crmResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!crmResponse.ok) {
      throw new Error(`CRM webhook returned ${crmResponse.status}`);
    }

    console.log("[api/webhooks/crm] forwarded", leads.length, "leads");
    return withCors(
      request,
      NextResponse.json({ status: "synced", count: leads.length })
    );
  } catch (error) {
    console.error("[api/webhooks/crm] error:", error);
    return withCors(
      request,
      NextResponse.json({ error: "CRM webhook failed" }, { status: 500 })
    );
  }
}
