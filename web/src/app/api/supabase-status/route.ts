import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, createAdminClient } from "@/lib/supabase/server";

function maskKey(key: string | undefined): string {
  if (!key) return "missing";
  if (key.length <= 10) return "present but too short";
  return `${key.slice(0, 5)}...${key.slice(-5)} (length: ${key.length})`;
}

export async function GET(request: NextRequest) {
  // Ensure we opt out of static rendering so environment variables are checked dynamically at request time
  // (though in Next.js 15, dynamic route handlers are evaluated dynamically anyway, especially when they touch cookies/headers or are in dynamic mode)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      NEXT_PUBLIC_SUPABASE_URL: url ? url : "missing",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: maskKey(anonKey),
      SUPABASE_SERVICE_ROLE_KEY: maskKey(serviceRoleKey),
    },
    publicClient: {
      configured: !!(url && anonKey),
      connectionTest: "not run",
      details: "",
    },
    adminClient: {
      configured: !!(url && serviceRoleKey),
      connectionTest: "not run",
      details: "",
    },
    status: "unknown",
    advice: [] as string[],
  };

  // 1. Test Public Client
  if (diagnostics.publicClient.configured) {
    try {
      const publicClient = createPublicClient();
      const { data, error } = await publicClient
        .from("packages")
        .select("id, name")
        .limit(1);

      if (error) {
        diagnostics.publicClient.connectionTest = "failed";
        diagnostics.publicClient.details = `Query error: ${error.message} (Code: ${error.code})`;
      } else {
        diagnostics.publicClient.connectionTest = "success";
        diagnostics.publicClient.details = `Successfully queried 'packages' table. Found ${data ? data.length : 0} rows.`;
      }
    } catch (err: any) {
      diagnostics.publicClient.connectionTest = "failed";
      diagnostics.publicClient.details = `Exception: ${err.message || err}`;
    }
  } else {
    diagnostics.publicClient.connectionTest = "skipped (missing config)";
  }

  // 2. Test Admin Client
  if (diagnostics.adminClient.configured) {
    try {
      const adminClient = createAdminClient();
      const { data, error } = await adminClient
        .from("bookings")
        .select("id")
        .limit(1);

      if (error) {
        diagnostics.adminClient.connectionTest = "failed";
        diagnostics.adminClient.details = `Query error: ${error.message} (Code: ${error.code})`;
      } else {
        diagnostics.adminClient.connectionTest = "success";
        diagnostics.adminClient.details = `Successfully queried 'bookings' table. Found ${data ? data.length : 0} rows.`;
      }
    } catch (err: any) {
      diagnostics.adminClient.connectionTest = "failed";
      diagnostics.adminClient.details = `Exception: ${err.message || err}`;
    }
  } else {
    diagnostics.adminClient.connectionTest = "skipped (missing config)";
  }

  // Determine Overall Status
  const publicSuccess = diagnostics.publicClient.connectionTest === "success";
  const adminSuccess = diagnostics.adminClient.connectionTest === "success";

  if (publicSuccess && adminSuccess) {
    diagnostics.status = "fully_operational";
    diagnostics.advice.push("Supabase is fully connected and working properly for both public reads and admin operations.");
  } else if (publicSuccess) {
    diagnostics.status = "partially_operational (public client ok, admin client missing or failed)";
    diagnostics.advice.push("Public queries (fetching packages, testimonials, staff, etc.) are working.");
    if (!serviceRoleKey) {
      diagnostics.advice.push("SUPABASE_SERVICE_ROLE_KEY is missing. Availability checks and bookings will fail. Copy the service_role key from your Supabase dashboard and add it to your environment.");
    } else {
      diagnostics.advice.push("The admin client query failed. Check if the bookings table exists and that your SUPABASE_SERVICE_ROLE_KEY has appropriate privileges.");
    }
  } else {
    diagnostics.status = "not_operational";
    diagnostics.advice.push("Supabase connection is not working.");
    if (!url || !anonKey) {
      diagnostics.advice.push("Please copy web/.env.local.example to web/.env.local and fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    } else if (diagnostics.publicClient.details.includes("PGRST301") || diagnostics.publicClient.details.includes("UNAUTHORIZED")) {
      diagnostics.advice.push("The API keys provided appear to be invalid or unauthorized. Please verify them in your Supabase project settings.");
    } else if (diagnostics.publicClient.details.includes("fetch failed") || diagnostics.publicClient.details.includes("ENOTFOUND")) {
      diagnostics.advice.push("Network error or host unreachable. Check your internet connection and verify that your NEXT_PUBLIC_SUPABASE_URL is correct.");
      diagnostics.advice.push("If your Supabase project is on the free tier and has been inactive for a while, it may have been paused. Log in to the Supabase dashboard to resume it.");
    }
  }

  return NextResponse.json(diagnostics, { status: publicSuccess ? 200 : 500 });
}
