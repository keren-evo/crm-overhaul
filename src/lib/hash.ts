import { createHash } from "crypto";

/** SHA-256 hash for Meta Conversions API / Pixel advanced matching */
export function hashEmail(email: string): string {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}
