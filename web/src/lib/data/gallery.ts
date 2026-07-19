import { createClient } from "@/lib/supabase/server";
import type { GalleryImageRow } from "./types";

// storage_path here doubles as the /public/images path until real assets
// are uploaded to Supabase Storage — swap for a signed/public storage URL
// once gallery_images.storage_path points at the bucket instead.
export const FALLBACK_GALLERY_IMAGES: GalleryImageRow[] = [
  {
    id: "fallback-1",
    storage_path: "/images/gallery-elephant-herd.jpg",
    alt_text: "Elephant herd crossing the Chobe River at dusk",
    category: "views",
    sort_order: 1,
    created_at: "",
  },
  {
    id: "fallback-2",
    storage_path: "/images/gallery-chalet-exterior.jpg",
    alt_text: "Exterior of a luxury tented chalet surrounded by mopane trees",
    category: "rooms",
    sort_order: 2,
    created_at: "",
  },
  {
    id: "fallback-3",
    storage_path: "/images/gallery-sunset-floodplain.jpg",
    alt_text: "Sunset over the Chobe floodplains viewed from Xhabe Lodge plateau",
    category: "views",
    sort_order: 3,
    created_at: "",
  },
  {
    id: "fallback-4",
    storage_path: "/images/gallery-game-drive.jpg",
    alt_text: "Guests on a morning game drive in an open 4x4 vehicle near Chobe National Park",
    category: "activities",
    sort_order: 4,
    created_at: "",
  },
  {
    id: "fallback-5",
    storage_path: "/images/gallery-hippo.jpg",
    alt_text: "Hippo pod resting in the Chobe River lagoon",
    category: "views",
    sort_order: 5,
    created_at: "",
  },
  {
    id: "fallback-6",
    storage_path: "/images/gallery-boma-dinner.jpg",
    alt_text: "Traditional boma dinner around a fire at Xhabe Safari Lodge",
    category: "dining",
    sort_order: 6,
    created_at: "",
  },
  {
    id: "fallback-7",
    storage_path: "/images/gallery-chalet-interior.jpg",
    alt_text: "Luxury interior of a Xhabe tented chalet with king bed and wooden floors",
    category: "rooms",
    sort_order: 7,
    created_at: "",
  },
  {
    id: "fallback-8",
    storage_path: "/images/gallery-boat-cruise.jpg",
    alt_text: "Guests on a river cruise watching elephants drink from the Chobe bank",
    category: "activities",
    sort_order: 8,
    created_at: "",
  },
  {
    id: "fallback-9",
    storage_path: "/images/gallery-leopard.jpg",
    alt_text: "Leopard resting in an acacia tree near Chobe National Park",
    category: "views",
    sort_order: 9,
    created_at: "",
  },
  {
    id: "fallback-10",
    storage_path: "/images/gallery-vic-falls.jpg",
    alt_text: "Victoria Falls viewed from the Zimbabwe side, spray rising into the sky",
    category: "activities",
    sort_order: 10,
    created_at: "",
  },
  {
    id: "fallback-11",
    storage_path: "/images/gallery-deck.jpg",
    alt_text: "Private viewing deck of a tented chalet looking over the Chobe floodplains",
    category: "rooms",
    sort_order: 11,
    created_at: "",
  },
  {
    id: "fallback-12",
    storage_path: "/images/gallery-birds.jpg",
    alt_text: "African fish eagle perched on a dead tree above the Chobe River",
    category: "views",
    sort_order: 12,
    created_at: "",
  },
];

export async function getGalleryImages(): Promise<{
  images: GalleryImageRow[];
  isLive: boolean;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return { images: FALLBACK_GALLERY_IMAGES, isLive: false };
    }
    return { images: data as GalleryImageRow[], isLive: true };
  } catch {
    return { images: FALLBACK_GALLERY_IMAGES, isLive: false };
  }
}
