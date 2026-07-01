import { NextResponse } from "next/server";

const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS ?? "http://localhost:3000")
  .split(",")
  .map((o) => o.trim());

export function withCors(request: Request, response: NextResponse): NextResponse {
  const origin = request.headers.get("origin");

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  } else if (!origin) {
    response.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGINS[0]);
  }

  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

export function corsPreflight(request: Request): NextResponse {
  return withCors(request, new NextResponse(null, { status: 204 }));
}
