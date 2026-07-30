import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Thrown when a client is requested without its credentials configured. */
export class SupabaseNotConfiguredError extends Error {
  constructor(missing: string) {
    super(
      `Supabase is not configured: ${missing} is missing. ` +
        `Copy web/.env.local.example to web/.env.local and fill it in.`
    );
    this.name = "SupabaseNotConfiguredError";
  }
}

/**
 * Anonymous client for reading public content (packages, gallery, testimonials,
 * staff, rate seasons).
 *
 * Deliberately cookie-free. The cookie-based client below reads `cookies()`,
 * which opts the calling page out of static rendering entirely — so using it
 * for content that is identical for every visitor made every page dynamic and
 * made `next build` log a DYNAMIC_SERVER_USAGE error that the data helpers then
 * swallowed into their fallback path. Public reads need no session, so they
 * don't pay that cost.
 */
export function createPublicClient() {
  if (!SUPABASE_URL) throw new SupabaseNotConfiguredError("NEXT_PUBLIC_SUPABASE_URL");
  if (!ANON_KEY) throw new SupabaseNotConfiguredError("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createSupabaseClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Cookie-aware client, for anything that needs the visitor's session.
 *
 * Nothing on the public site currently does — kept for a future admin area.
 * Prefer `createPublicClient()` for content reads.
 */
export async function createClient() {
  if (!SUPABASE_URL) throw new SupabaseNotConfiguredError("NEXT_PUBLIC_SUPABASE_URL");
  if (!ANON_KEY) throw new SupabaseNotConfiguredError("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method can be called from a Server Component.
          // This can be ignored if you have middleware refreshing sessions.
        }
      },
    },
  });
}

/**
 * Service-role client for privileged server-side work — inserting bookings and
 * enquiries, and reading availability. Bypasses Row Level Security.
 *
 * Must only ever be called from route handlers or server actions. Cookie-free,
 * because it authenticates with the service key rather than a user session.
 */
export function createAdminClient() {
  if (!SUPABASE_URL) throw new SupabaseNotConfiguredError("NEXT_PUBLIC_SUPABASE_URL");
  if (!SERVICE_ROLE_KEY) throw new SupabaseNotConfiguredError("SUPABASE_SERVICE_ROLE_KEY");

  return createSupabaseClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
