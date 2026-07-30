import { createPublicClient } from "@/lib/supabase/server";
import type { PackageRow, RateSeasonRow } from "./types";

// Fallback content — used if Supabase is unreachable or the tables are
// still empty (e.g. before the lodge has entered its real package data).
// Keeping the copy here (rather than only in the page) means the site
// always renders something reasonable even pre-launch.
export const FALLBACK_PACKAGES: PackageRow[] = [
  {
    id: "pkg-1",
    name: "Package One",
    slug: "package-one",
    nights: 1,
    min_pax: null,
    description:
      "An ideal introduction to the Chobe wilderness — one night under the stars, one golden sunset on the plateau, and a morning in the wild.",
    inclusions: [
      "Accommodation in luxury tented chalet",
      "All meals (dinner, breakfast)",
      "Local beverages throughout",
      "Sunset game drive + sundowner",
      "Guided morning walk or bush experience",
    ],
    activity_slugs: ["morning-game-drive", "sundowners"],
    sort_order: 1,
    created_at: "",
  },
  {
    id: "pkg-2",
    name: "Package Two",
    slug: "package-two",
    nights: 2,
    min_pax: 4,
    description:
      "The most popular choice. Two immersive nights with the full river-and-bush experience, plus a full day at Victoria Falls — one of the Seven Wonders.",
    inclusions: [
      "2 nights accommodation in luxury tented chalet",
      "All meals (dinner × 2, breakfasts × 2, lunches × 2)",
      "Local beverages throughout",
      "Sunset & morning game drives",
      "Chobe River boat cruise",
      "Victoria Falls day trip (Zimbabwe)",
      "Sundowner cocktails each evening",
    ],
    activity_slugs: [
      "morning-game-drive",
      "river-boat-cruise",
      "victoria-falls-day-trip",
      "sundowners",
    ],
    sort_order: 2,
    created_at: "",
  },
  {
    id: "pkg-3",
    name: "Package Three",
    slug: "package-three",
    nights: 3,
    min_pax: 4,
    description:
      "The complete Xhabe experience. Three nights, every activity, the full spectrum of Chobe — from pre-dawn game drives to star-drenched boma dinners. Nothing held back.",
    inclusions: [
      "3 nights accommodation in luxury tented chalet",
      "All meals throughout",
      "Local beverages throughout",
      "Sunset & morning game drives each day",
      "Chobe River boat cruise",
      "Victoria Falls day trip (Zimbabwe)",
      "Traditional boma dinner with cultural dance",
      "Guided stargazing session",
      "Sundowner cocktails each evening",
    ],
    activity_slugs: [
      "morning-game-drive",
      "river-boat-cruise",
      "victoria-falls-day-trip",
      "boma-dinner",
      "stargazing",
      "sundowners",
    ],
    sort_order: 3,
    created_at: "",
  },
];

/**
 * URL segment for a package's detail page.
 *
 * Prefers the stored `slug`, falling back to a slugified name so packages the
 * lodge adds without setting a slug still get a working, stable URL.
 */
export function packageSlug(pkg: PackageRow): string {
  if (pkg.slug) return pkg.slug;
  return pkg.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Packages ordered for display, from Supabase with a static fallback. */
export async function getPackages(): Promise<{
  packages: PackageRow[];
  isLive: boolean;
}> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Packages query failed, serving fallback packages:", error.message);
      return { packages: FALLBACK_PACKAGES, isLive: false };
    }
    if (!data || data.length === 0) {
      return { packages: FALLBACK_PACKAGES, isLive: false };
    }
    return { packages: data as PackageRow[], isLive: true };
  } catch (err) {
    console.error("Packages query threw, serving fallback packages:", err);
    return { packages: FALLBACK_PACKAGES, isLive: false };
  }
}

/**
 * A single package by its URL slug, or null if nothing matches.
 *
 * Resolves against the same list the index pages render (live or fallback), so
 * a package card and its detail page can never disagree about what exists.
 */
export async function getPackageBySlug(slug: string): Promise<PackageRow | null> {
  const { packages } = await getPackages();
  return packages.find((pkg) => packageSlug(pkg) === slug) ?? null;
}

/** The currently active rate season, if one has been configured. */
export async function getActiveRateSeason(): Promise<RateSeasonRow | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("rate_seasons")
      .select("*")
      .eq("active", true)
      .order("start_date", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Rate season query failed, pricing will show as on-enquiry:", error.message);
      return null;
    }
    if (!data) return null;
    return data as RateSeasonRow;
  } catch (err) {
    console.error("Rate season query threw, pricing will show as on-enquiry:", err);
    return null;
  }
}
