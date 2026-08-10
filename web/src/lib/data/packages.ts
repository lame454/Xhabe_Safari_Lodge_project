import { createPublicClient } from "@/lib/supabase/server";
import type { PackageRow, RateSeasonRow } from "./types";

// Fallback content — used if Supabase is unreachable or the tables are
// still empty (e.g. before the lodge has entered its real package data).
// Keeping the copy here (rather than only in the page) means the site
// always renders something reasonable even pre-launch.
/*
 * What a guest can book.
 *
 * This replaces the demo's invented "Package One/Two/Three" night-bundles,
 * which did not match how the lodge actually sells: a nightly rate per room,
 * varying by season, nationality and rack-vs-trade. The real numbers live in
 * lib/data/rates.ts; these rows exist so the booking form can ask which of the
 * two accommodation types a guest wants.
 *
 * `nights` is 1 because both are priced per night, not as fixed-length stays.
 */
export const FALLBACK_PACKAGES: PackageRow[] = [
  {
    id: "offer-chalet",
    name: "Luxury Tented Chalet",
    slug: "chalet",
    nights: 1,
    min_pax: null,
    description:
      "One of nine tented chalets on the plateau, with a super king bed, two private balconies over the floodplain, air conditioning and an en-suite bathroom.",
    inclusions: [
      "Accommodation and bed levy",
      "All meals",
      "Soft drinks, bottled water, local beer and spirits",
      "Game drive and sundowner",
      "Village tour and basketry weaving",
    ],
    activity_slugs: ["game-drives", "sundowner", "village-tour", "basketry"],
    sort_order: 1,
    created_at: "",
  },
  {
    id: "offer-camping",
    name: "Camping",
    slug: "camping",
    nights: 1,
    min_pax: null,
    description:
      "Bring your own tent and pitch on the lodge grounds, with access to the pool, the bar and the lodge's facilities. Priced per person, all year round.",
    inclusions: [
      "Camping pitch on the lodge grounds",
      "Access to lodge facilities",
      "Priced per person per night",
    ],
    activity_slugs: [],
    sort_order: 2,
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
