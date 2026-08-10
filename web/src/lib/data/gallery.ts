import { createPublicClient } from "@/lib/supabase/server";
import type { GalleryImageRow } from "./types";

// A slice of the real photo library, used only when Supabase is
// unreachable or the gallery_images table is empty. Alt text describes
// what is actually in each frame.
export const FALLBACK_GALLERY_IMAGES: GalleryImageRow[] = [
  {
    id: "fallback-1",
    storage_path: "/images/sunset-pool-chalets.jpg",
    alt_text: "Sunset over the pool at Xhabe Safari Lodge, tented chalets silhouetted against a pink sky and mirrored in the water",
    category: "views",
    activity_tags: ["sundowner"],
    sort_order: 1,
    created_at: "",
  },
  {
    id: "fallback-2",
    storage_path: "/images/chalets-plateau-floodplain.jpg",
    alt_text: "Tented chalets on the Xhabe plateau with the Chobe floodplain and river stretching out beyond",
    category: "views",
    activity_tags: null,
    sort_order: 2,
    created_at: "",
  },
  {
    id: "fallback-3",
    storage_path: "/images/giraffe-tower.jpg",
    alt_text: "Four giraffes standing together in open Chobe bush under a clear sky",
    category: "views",
    activity_tags: ["game-drives"],
    sort_order: 3,
    created_at: "",
  },
  {
    id: "fallback-4",
    storage_path: "/images/lioness-at-lodge-sign.jpg",
    alt_text: "A lioness standing beside the Xhabe Safari Lodge entrance sign at night, caught in a spotlight",
    category: "views",
    activity_tags: ["game-drives"],
    sort_order: 4,
    created_at: "",
  },
  {
    id: "fallback-5",
    storage_path: "/images/mokoro-chobe-river.jpg",
    alt_text: "Two guides poling guests in a mokoro canoe through the shallows of the Chobe River at golden hour",
    category: "activities",
    activity_tags: ["fishing-canoe"],
    sort_order: 5,
    created_at: "",
  },
  {
    id: "fallback-6",
    storage_path: "/images/curios-detail.jpg",
    alt_text: "Woven baskets, carved wooden pieces and pottery arranged on a cowhide rug in the lodge lounge",
    category: "activities",
    activity_tags: ["basketry"],
    sort_order: 6,
    created_at: "",
  },
  {
    id: "fallback-7",
    storage_path: "/images/chalet-king-bed.jpg",
    alt_text: "A super king bed made up in a tented chalet, against a wall of gum poles",
    category: "rooms",
    activity_tags: null,
    sort_order: 7,
    created_at: "",
  },
  {
    id: "fallback-8",
    storage_path: "/images/chalet-private-balcony.jpg",
    alt_text: "Two chairs and a small table on the private balcony of a chalet, looking out into green bush",
    category: "rooms",
    activity_tags: null,
    sort_order: 8,
    created_at: "",
  },
  {
    id: "fallback-9",
    storage_path: "/images/reception-lounge-golden.jpg",
    alt_text: "The open-sided reception lounge in late afternoon light, with burnt-orange velvet armchairs",
    category: "rooms",
    activity_tags: null,
    sort_order: 9,
    created_at: "",
  },
  {
    id: "fallback-10",
    storage_path: "/images/pool-chalets-floodplain.jpg",
    alt_text: "The swimming pool with two tented chalets and the Chobe floodplain beyond, under tall cumulus cloud",
    category: "views",
    activity_tags: null,
    sort_order: 10,
    created_at: "",
  },
  {
    id: "fallback-11",
    storage_path: "/images/boma-lantern-dinner.jpg",
    alt_text: "A lantern-lit dinner table set for three in the boma after dark",
    category: "dining",
    activity_tags: null,
    sort_order: 11,
    created_at: "",
  },
  {
    id: "fallback-12",
    storage_path: "/images/dessert-xhabe-plate.jpg",
    alt_text: "A layered pastry dessert plated with the word Xhabe written in chocolate",
    category: "dining",
    activity_tags: null,
    sort_order: 12,
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
