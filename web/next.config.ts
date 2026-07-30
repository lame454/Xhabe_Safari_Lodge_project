import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The repo root holds a leftover stub package.json/package-lock.json, so Next
  // guesses the workspace root is one level up and warns about two lockfiles.
  // Pin it to this directory — the app is entirely self-contained in web/.
  outputFileTracingRoot: path.join(__dirname),

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
