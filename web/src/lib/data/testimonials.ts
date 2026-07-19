import { createClient } from "@/lib/supabase/server";
import type { TestimonialRow } from "./types";

export const FALLBACK_TESTIMONIALS: TestimonialRow[] = [
  {
    id: "fallback-1",
    guest_name: "TripAdvisor Guest",
    source: "TripAdvisor",
    quote:
      "The staff went above and beyond. Maatla and Beauty made every meal, every drive, every sunrise feel personal. Nowhere else in Botswana have I felt this cared for.",
    rating: 5,
    featured: true,
    created_at: "",
  },
  {
    id: "fallback-2",
    guest_name: "Verified Guest",
    source: "TripAdvisor",
    quote:
      "The best sunsets in all of Africa are right here. We watched elephants cross the floodplain from our deck while the sun turned the river to fire. We'll be back.",
    rating: 5,
    featured: true,
    created_at: "",
  },
];

/** Featured testimonials for the homepage quote band(s), newest first. */
export async function getFeaturedTestimonials(
  limit = 3
): Promise<{ testimonials: TestimonialRow[]; isLive: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return { testimonials: FALLBACK_TESTIMONIALS.slice(0, limit), isLive: false };
    }
    return { testimonials: data as TestimonialRow[], isLive: true };
  } catch {
    return { testimonials: FALLBACK_TESTIMONIALS.slice(0, limit), isLive: false };
  }
}
