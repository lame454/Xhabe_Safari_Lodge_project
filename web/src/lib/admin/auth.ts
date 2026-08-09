import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Shared-password gate for the lodge admin area.
 *
 * One password, held in ADMIN_PASSWORD, is exchanged for a signed session
 * cookie. The cookie carries only an expiry plus an HMAC of it, so it proves a
 * successful login without ever holding the password — and because it is
 * signed, a visitor cannot simply set `admin=true` in their browser.
 *
 * The signing key is derived from the password itself, which means changing the
 * password immediately invalidates every existing session. That is the desired
 * behaviour for a shared credential, and it avoids a second secret to manage.
 *
 * This is deliberately modest security, appropriate for one or two trusted
 * staff: there are no per-user accounts and no audit trail of who did what. If
 * the lodge ever needs those, move to Supabase Auth and gate the RLS policies
 * on a real admin check — see supabase/migrations/20260730130000_harden_security.sql.
 */

const COOKIE_NAME = "xhabe_admin_session";
const SESSION_TTL_SECONDS = 8 * 60 * 60; // A working day; re-login next morning.

/** The configured password, or null when the admin area is switched off. */
function configuredPassword(): string | null {
  const value = process.env.ADMIN_PASSWORD?.trim();
  return value ? value : null;
}

/** True when ADMIN_PASSWORD is set. Without it the admin area refuses all access. */
export function isAdminConfigured(): boolean {
  return configuredPassword() !== null;
}

function sha256(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

/** Session signing key, derived from the password. */
function signingKey(secret: string): Buffer {
  return createHmac("sha256", "xhabe-admin-session-v1").update(secret, "utf8").digest();
}

function signature(expiresAt: number, secret: string): Buffer {
  return createHmac("sha256", signingKey(secret)).update(String(expiresAt)).digest();
}

/**
 * Constant-time password check.
 *
 * Both sides are hashed first so the comparison is always over equal-length
 * buffers — otherwise `timingSafeEqual` throws on a length mismatch, and the
 * length of the real password would leak through how the request failed.
 */
export function verifyPassword(attempt: string): boolean {
  const expected = configuredPassword();
  if (!expected) return false;
  return timingSafeEqual(sha256(attempt), sha256(expected));
}

/** Mints a signed token for a freshly authenticated session. */
export function createSessionToken(): string {
  const secret = configuredPassword();
  if (!secret) throw new Error("ADMIN_PASSWORD is not configured.");

  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  return `${expiresAt}.${signature(expiresAt, secret).toString("hex")}`;
}

function isValidSessionToken(token: string): boolean {
  const secret = configuredPassword();
  if (!secret) return false;

  const separator = token.indexOf(".");
  if (separator === -1) return false;

  const expiresAt = Number(token.slice(0, separator));
  if (!Number.isFinite(expiresAt)) return false;

  let provided: Buffer;
  try {
    provided = Buffer.from(token.slice(separator + 1), "hex");
  } catch {
    return false;
  }

  const expected = signature(expiresAt, secret);
  if (provided.length !== expected.length) return false;
  // Verify the signature before trusting the expiry it protects.
  if (!timingSafeEqual(provided, expected)) return false;

  return expiresAt > Date.now();
}

/** Whether the current request carries a valid admin session. */
export async function isAuthenticated(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return token ? isValidSessionToken(token) : false;
}

export async function startSession(): Promise<void> {
  (await cookies()).set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true, // Never readable from JavaScript.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}

/**
 * Crude per-IP throttle on failed logins.
 *
 * In-memory, so it resets on redeploy and is per-instance on serverless — it
 * slows down casual guessing rather than a determined distributed attack. The
 * real protection is choosing a long password.
 */
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 10 * 60 * 1000;

export function tooManyAttempts(ip: string): boolean {
  const record = attempts.get(ip);
  if (!record || Date.now() > record.resetAt) return false;
  return record.count >= MAX_ATTEMPTS;
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const record = attempts.get(ip);
  if (!record || now > record.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  record.count += 1;
}

export function clearAttempts(ip: string): void {
  attempts.delete(ip);
}
