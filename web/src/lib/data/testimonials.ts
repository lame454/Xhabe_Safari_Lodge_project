import { createPublicClient } from "@/lib/supabase/server";
import type { TestimonialRow } from "./types";

/**
 * Deliberately empty.
 *
 * The demo shipped two invented guest quotes, complete with names and star
 * ratings, presented as real reviews. Fabricated testimonials are not
 * something this site should carry, so they have been removed here and from
 * the database rather than reworded.
 *
 * The reviews page renders an honest empty state until real ones exist. To
 * publish genuine reviews, insert them into the `testimonials` table with
 * `featured = true` — quoting a guest's own words, with their permission — and
 * the page fills itself in.
 */
export const FALLBACK_TESTIMONIALS: TestimonialRow[] = [];

/** Featured testimonials for the homepage quote band(s), newest first. */
export async function getFeaturedTestimonials(
  limit = 3
): Promise<{ testimonials: TestimonialRow[]; isLive: boolean }> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Testimonials query failed, serving fallback quotes:", error.message);
      return { testimonials: FALLBACK_TESTIMONIALS.slice(0, limit), isLive: false };
    }
    if (!data || data.length === 0) {
      return { testimonials: FALLBACK_TESTIMONIALS.slice(0, limit), isLive: false };
    }
    return { testimonials: data as TestimonialRow[], isLive: true };
  } catch (err) {
    console.error("Testimonials query threw, serving fallback quotes:", err);
    return { testimonials: FALLBACK_TESTIMONIALS.slice(0, limit), isLive: false };
  }
}
