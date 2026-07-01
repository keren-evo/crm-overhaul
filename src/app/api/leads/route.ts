import { NextRequest, NextResponse } from "next/server";
import { corsPreflight, withCors } from "@/lib/cors";
import { createLead, getAllLeads, type LeadInput } from "@/lib/leads";

export async function OPTIONS(request: NextRequest) {
  return corsPreflight(request);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<LeadInput>;

    if (!body.first_name?.trim() || !body.last_name?.trim() || !body.email?.trim()) {
      return withCors(
        request,
        NextResponse.json(
          { error: "first_name, last_name, and email are required" },
          { status: 400 }
        )
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return withCors(
        request,
        NextResponse.json({ error: "Invalid email address" }, { status: 400 })
      );
    }

    const input: LeadInput = {
      first_name: body.first_name.trim(),
      last_name: body.last_name.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() || undefined,
      source: body.source?.trim() || undefined,
      medium: body.medium?.trim() || undefined,
      campaign: body.campaign?.trim() || undefined,
      content: body.content?.trim() || undefined,
      landing_page: body.landing_page?.trim() || undefined,
    };

    console.log("[api/leads] incoming:", JSON.stringify(input));

    const { lead, deduplicated } = createLead(input);

    return withCors(
      request,
      NextResponse.json({ lead, deduplicated }, { status: deduplicated ? 200 : 201 })
    );
  } catch (error) {
    console.error("[api/leads] error:", error);
    return withCors(
      request,
      NextResponse.json({ error: "Failed to save lead" }, { status: 500 })
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const leads = getAllLeads();
    return withCors(request, NextResponse.json({ leads }));
  } catch (error) {
    console.error("[api/leads] error:", error);
    return withCors(
      request,
      NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 })
    );
  }
}
