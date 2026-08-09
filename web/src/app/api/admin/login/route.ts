import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  clearAttempts,
  isAdminConfigured,
  recordFailedAttempt,
  startSession,
  tooManyAttempts,
  verifyPassword,
} from "@/lib/admin/auth";

const bodySchema = z.object({ password: z.string().min(1, "Enter the password.") });

/** Best-effort client IP, for throttling only. */
function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    // Refuse rather than fall open when no password is set.
    return NextResponse.json(
      { error: "The admin area is not configured on this deployment." },
      { status: 503 }
    );
  }

  const ip = clientIp(request);
  if (tooManyAttempts(ip)) {
    return NextResponse.json(
      { error: "Too many failed attempts. Wait a few minutes and try again." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter the password." }, { status: 400 });
  }

  if (!verifyPassword(parsed.data.password)) {
    recordFailedAttempt(ip);
    // Deliberately vague: no hint about whether the password was close.
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  clearAttempts(ip);
  await startSession();

  return NextResponse.json({ ok: true });
}
