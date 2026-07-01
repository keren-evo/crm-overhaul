import { NextRequest, NextResponse } from "next/server";
import { corsPreflight, withCors } from "@/lib/cors";
import { getAllLeads } from "@/lib/leads";

export async function OPTIONS(request: NextRequest) {
  return corsPreflight(request);
}

export async function GET(request: NextRequest) {
  try {
    const leads = getAllLeads();
    const headers = [
      "id",
      "first_name",
      "last_name",
      "email",
      "phone",
      "source",
      "medium",
      "campaign",
      "content",
      "landing_page",
      "created_at",
    ];

    const escape = (value: string | number | null | undefined) => {
      const str = String(value ?? "");
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = leads.map((lead) =>
      headers.map((h) => escape(lead[h as keyof typeof lead])).join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");

    const response = new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="leads-export.csv"',
      },
    });

    return withCors(request, response);
  } catch (error) {
    console.error("[api/leads/export] error:", error);
    return withCors(
      request,
      NextResponse.json({ error: "Failed to export leads" }, { status: 500 })
    );
  }
}
