import { createPublicClient } from "@/lib/supabase/server";
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
    activity_tags: null,
    created_at: "",
  },
  {
    id: "fallback-2",
    storage_path: "/images/gallery-chalet-exterior.jpg",
    alt_text: "Exterior of a luxury tented chalet surrounded by mopane trees",
    category: "rooms",
    sort_order: 2,
    activity_tags: null,
    created_at: "",
  },
  {
    id: "fallback-3",
    storage_path: "/images/gallery-sunset-floodplain.jpg",
    alt_text: "Sunset over the Chobe floodplains viewed from Xhabe Lodge plateau",
    category: "views",
    sort_order: 3,
    activity_tags: null,
    created_at: "",
  },
  {
    id: "fallback-4",
    storage_path: "/images/gallery-game-drive.jpg",
    alt_text: "Guests on a morning game drive in an open 4x4 vehicle near Chobe National Park",
    category: "activities",
    sort_order: 4,
    activity_tags: null,
    created_at: "",
  },
  {
    id: "fallback-5",
    storage_path: "/images/gallery-hippo.jpg",
    alt_text: "Hippo pod resting in the Chobe River lagoon",
    category: "views",
    sort_order: 5,
    activity_tags: null,
    created_at: "",
  },
  {
    id: "fallback-6",
    storage_path: "/images/gallery-boma-dinner.jpg",
    alt_text: "Traditional boma dinner around a fire at Xhabe Safari Lodge",
    category: "dining",
    sort_order: 6,
    activity_tags: null,
    created_at: "",
  },
  {
    id: "fallback-7",
    storage_path: "/images/gallery-chalet-interior.jpg",
    alt_text: "Luxury interior of a Xhabe tented chalet with king bed and wooden floors",
    category: "rooms",
    sort_order: 7,
    activity_tags: null,
    created_at: "",
  },
  {
    id: "fallback-8",
    storage_path: "/images/gallery-boat-cruise.jpg",
    alt_text: "Guests on a river cruise watching elephants drink from the Chobe bank",
    category: "activities",
    sort_order: 8,
    activity_tags: null,
    created_at: "",
  },
  {
    id: "fallback-9",
    storage_path: "/images/gallery-leopard.jpg",
    alt_text: "Leopard resting in an acacia tree near Chobe National Park",
    category: "views",
    sort_order: 9,
    activity_tags: null,
    created_at: "",
  },
  {
    id: "fallback-10",
    storage_path: "/images/gallery-vic-falls.jpg",
    alt_text: "Victoria Falls viewed from the Zimbabwe side, spray rising into the sky",
    category: "activities",
    sort_order: 10,
    activity_tags: null,
    created_at: "",
  },
  {
    id: "fallback-11",
    storage_path: "/images/gallery-deck.jpg",
    alt_text: "Private viewing deck of a tented chalet looking over the Chobe floodplains",
    category: "rooms",
    sort_order: 11,
    activity_tags: null,
    created_at: "",
  },
  {
    id: "fallback-12",
    storage_path: "/images/gallery-birds.jpg",
    alt_text: "African fish eagle perched on a dead tree above the Chobe River",
    category: "views",
    sort_order: 12,
    activity_tags: null,
    created_at: "",
  },
];

export async function getGalleryImages(): Promise<{
  images: GalleryImageRow[];
  isLive: boolean;
}> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Gallery query failed, serving fallback images:", error.message);
      return { images: FALLBACK_GALLERY_IMAGES, isLive: false };
    }
    if (!data || data.length === 0) {
      return { images: FALLBACK_GALLERY_IMAGES, isLive: false };
    }
    return { images: data as GalleryImageRow[], isLive: true };
  } catch (err) {
    console.error("Gallery query threw, serving fallback images:", err);
    return { images: FALLBACK_GALLERY_IMAGES, isLive: false };
  }
}

/** Photos tagged for a given activity slug. */
export function filterByActivity(
  images: GalleryImageRow[],
  activitySlug: string
): GalleryImageRow[] {
  return images.filter((img) => img.activity_tags?.includes(activitySlug));
}

/**
 * One representative photo per activity slug, for the preview thumbnails on
 * the Activities page.
 *
 * Returns a partial map: activities with no tagged photos are simply absent,
 * and the caller falls back to the activity's own image. This lets the lodge
 * tag photos incrementally without any page breaking in the meantime.
 */
export function previewImageByActivity(
  images: GalleryImageRow[]
): Record<string, GalleryImageRow> {
  const previews: Record<string, GalleryImageRow> = {};
  for (const image of images) {
    for (const tag of image.activity_tags ?? []) {
      if (!previews[tag]) previews[tag] = image;
    }
  }
  return previews;
}
