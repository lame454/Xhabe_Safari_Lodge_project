import { createClient } from "@/lib/supabase/server";
import type { StaffRow } from "./types";

export const FALLBACK_STAFF: StaffRow[] = [
  {
    id: "fallback-1",
    name: "Maatla",
    role: "Senior Safari Guide",
    bio: "Born and raised in Mabele village, Maatla has guided Chobe's wildlife corridors for over 15 years. His knowledge of leopard behaviour and elephant family groups is unmatched in the region.",
    photo_path: "/images/team-maatla.jpg",
    created_at: "",
  },
  {
    id: "fallback-2",
    name: "Beauty",
    role: "Lodge Manager & Head of Hospitality",
    bio: "Beauty brings warmth, precision, and an infectious smile to every guest interaction. She personally oversees all meals, room preparation, and ensures the Xhabe standard is upheld in every detail.",
    photo_path: "/images/team-beauty.jpg",
    created_at: "",
  },
  {
    id: "fallback-3",
    name: "Lindi",
    role: "River Safari Specialist & Birding Guide",
    bio: "With a special passion for Chobe's birdlife (520+ species recorded in the district), Lindi leads boat cruises and birding walks that reveal the river's hidden life to even seasoned naturalists.",
    photo_path: "/images/team-lindi.jpg",
    created_at: "",
  },
];

export async function getStaff(): Promise<{ staff: StaffRow[]; isLive: boolean }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return { staff: FALLBACK_STAFF, isLive: false };
    }
    return { staff: data as StaffRow[], isLive: true };
  } catch {
    return { staff: FALLBACK_STAFF, isLive: false };
  }
}
