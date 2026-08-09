import fs from 'fs';
import path from 'path';

function maskKey(key) {
  if (!key) return "missing";
  if (key.length <= 10) return "present but too short";
  return `${key.slice(0, 5)}...${key.slice(-5)} (length: ${key.length})`;
}

async function run() {
  console.log("=================================================");
  console.log("   Xhabe Safari Lodge - Supabase Diagnostic      ");
  console.log("=================================================\n");

  const envPath = path.resolve(process.cwd(), '.env.local');
  let envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  };

  console.log(`Checking for .env.local file at: ${envPath}`);
  if (fs.existsSync(envPath)) {
    console.log("✅ Found .env.local file. Parsing variables...");
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        // Strip potential quotes
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (key in envVars && !process.env[key]) {
          envVars[key] = val;
        }
      }
    }
  } else {
    console.log("⚠️  .env.local file not found. Falling back to system environment variables.");
  }

  // Use process.env override if available
  for (const key in envVars) {
    if (process.env[key]) {
      envVars[key] = process.env[key];
    }
  }

  console.log("\n--- Environment Variables Configuration ---");
  console.log(`NEXT_PUBLIC_SUPABASE_URL:      ${envVars.NEXT_PUBLIC_SUPABASE_URL || "missing"}`);
  console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${maskKey(envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY)}`);
  console.log(`SUPABASE_SERVICE_ROLE_KEY:     ${maskKey(envVars.SUPABASE_SERVICE_ROLE_KEY)}\n`);

  if (!envVars.NEXT_PUBLIC_SUPABASE_URL) {
    console.log("❌ Error: NEXT_PUBLIC_SUPABASE_URL is not configured.");
    console.log("Please copy '.env.local.example' to '.env.local' and set the variables.");
    process.exit(1);
  }

  const url = envVars.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "");

  // Test 1: Public Client Connection (using fetch directly)
  if (envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log("📡 Testing Public Connection (Anon Key)...");
    try {
      const start = Date.now();
      const res = await fetch(`${url}/rest/v1/packages?select=id&limit=1`, {
        headers: {
          'apikey': envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        }
      });
      const duration = Date.now() - start;

      if (res.ok) {
        const data = await res.json();
        console.log(`✅ Public Client: SUCCESS! Connected in ${duration}ms.`);
        console.log(`   Fetched packages successfully. Database is reachable and working.`);
      } else {
        const body = await res.text();
        console.log(`❌ Public Client: FAILED (HTTP ${res.status})`);
        console.log(`   Response details: ${body}`);
      }
    } catch (err) {
      console.log(`❌ Public Client: FAILED with exception.`);
      console.log(`   Error: ${err.message || err}`);
    }
  } else {
    console.log("⚠️  Skipping Public Connection Test: NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.");
  }

  console.log("");

  // Test 2: Admin Client Connection (using fetch directly)
  if (envVars.SUPABASE_SERVICE_ROLE_KEY) {
    console.log("📡 Testing Admin Connection (Service Role Key)...");
    try {
      const start = Date.now();
      const res = await fetch(`${url}/rest/v1/bookings?select=id&limit=1`, {
        headers: {
          'apikey': envVars.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${envVars.SUPABASE_SERVICE_ROLE_KEY}`,
        }
      });
      const duration = Date.now() - start;

      if (res.ok) {
        const data = await res.json();
        console.log(`✅ Admin Client: SUCCESS! Connected in ${duration}ms.`);
        console.log(`   Fetched bookings successfully. Service role has bypass RLS privileges.`);
      } else {
        const body = await res.text();
        console.log(`❌ Admin Client: FAILED (HTTP ${res.status})`);
        console.log(`   Response details: ${body}`);
      }
    } catch (err) {
      console.log(`❌ Admin Client: FAILED with exception.`);
      console.log(`   Error: ${err.message || err}`);
    }
  } else {
    console.log("⚠️  Skipping Admin Connection Test: SUPABASE_SERVICE_ROLE_KEY is missing.");
  }

  console.log("\n=================================================");
  const fullyOperational = envVars.NEXT_PUBLIC_SUPABASE_URL && envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY && envVars.SUPABASE_SERVICE_ROLE_KEY;
  if (fullyOperational) {
    console.log("🎉 All configured variables are present. If tests succeeded, your setup is complete!");
  } else {
    console.log("💡 Tip: To complete setup, ensure all 3 keys are configured in '.env.local'.");
  }
  console.log("=================================================");
}

run();
