import { createClient } from "@/lib/supabase/server";
import type { PackageRow, RateSeasonRow } from "./types";

// Fallback content — used if Supabase is unreachable or the tables are
// still empty (e.g. before the lodge has entered its real package data).
// Keeping the copy here (rather than only in the page) means the site
// always renders something reasonable even pre-launch.
export const FALLBACK_PACKAGES: PackageRow[] = [
  {
    id: "pkg-1",
    name: "Package One",
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
    sort_order: 1,
    created_at: "",
  },
  {
    id: "pkg-2",
    name: "Package Two",
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
    sort_order: 2,
    created_at: "",
  },
  {
    id: "pkg-3",
    name: "Package Three",
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
    sort_order: 3,
    created_at: "",
  },
];

/** Packages ordered for display, from Supabase with a static fallback. */
export async function getPackages(): Promise<{
  packages: PackageRow[];
  isLive: boolean;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return { packages: FALLBACK_PACKAGES, isLive: false };
    }
    return { packages: data as PackageRow[], isLive: true };
  } catch {
    return { packages: FALLBACK_PACKAGES, isLive: false };
  }
}

/** The currently active rate season, if one has been configured. */
export async function getActiveRateSeason(): Promise<RateSeasonRow | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("rate_seasons")
      .select("*")
      .eq("active", true)
      .order("start_date", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return data as RateSeasonRow;
  } catch {
    return null;
  }
}
