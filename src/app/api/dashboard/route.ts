import { NextRequest, NextResponse } from "next/server";
import { corsPreflight, withCors } from "@/lib/cors";
import { getDashboardMetrics } from "@/lib/leads";

export async function OPTIONS(request: NextRequest) {
  return corsPreflight(request);
}

export async function GET(request: NextRequest) {
  try {
    const metrics = getDashboardMetrics();
    return withCors(request, NextResponse.json(metrics));
  } catch (error) {
    console.error("[api/dashboard] error:", error);
    return withCors(
      request,
      NextResponse.json({ error: "Failed to fetch dashboard metrics" }, { status: 500 })
    );
  }
}
