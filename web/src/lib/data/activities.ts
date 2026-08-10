import { Sunrise, Ship, Landmark, Fish, Sunset, Users, Hand } from "lucide-react";

/**
 * The lodge's activity programme, taken from the 2028 rates deck.
 *
 * `slug` is the stable identifier shared across the site: the anchor on the
 * Activities page, the `?activity=` value the Gallery filters on, and the tag
 * stored in `gallery_images.activity_tags`. Tagging a photo with a slug is all
 * it takes to make it appear here — no code change.
 *
 * `image` is a real photograph from the lodge whose alt text describes what is
 * actually in the frame. Several activities have no photograph of their own
 * yet, so they borrow a truthful nearby image rather than claim a picture that
 * doesn't exist; `needsPhoto` marks those for the next shoot.
 */
export interface Activity {
  slug: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  /** Whether the nightly rate covers it. */
  included: string;
  image: string;
  imageAlt: string;
  /** True where no photograph of this activity exists yet. */
  needsPhoto?: boolean;
}

export const ACTIVITIES: Activity[] = [
  {
    slug: "game-drives",
    icon: Sunrise,
    name: "Game Drives",
    description:
      "Morning, afternoon and night drives with a professional guide in an open 4x4. The lodge sits on a corridor between the Chobe Forest and the river, five kilometres from the national park, so the game comes to the doorstep. Every itinerary is shaped around what you want to see.",
    included: "Included in the rate",
    image: "/images/giraffe-tower.jpg",
    imageAlt: "Four giraffes standing together in open Chobe bush under a clear sky",
  },
  {
    slug: "sundowner",
    icon: Sunset,
    name: "Sundowners",
    description:
      "The plateau position earns its keep at the end of the day. Drinks are set up as the sun drops over the floodplain towards Namibia, with the whole valley turning colour in front of you.",
    included: "Included in the rate",
    image: "/images/sunset-pool-chalets.jpg",
    imageAlt:
      "Sunset over the pool at Xhabe Safari Lodge, tented chalets silhouetted against a pink sky and reflected in the water",
  },
  {
    slug: "boat-cruise",
    icon: Ship,
    name: "Boat Cruise",
    description:
      "A cruise on the Chobe from Kasane, where the river's edge delivers game viewing you cannot get from a vehicle — elephant coming down to drink, hippo pods, and a great deal of the park's 450-plus bird species.",
    included: "Optional, at extra cost",
    image: "/images/floodplain-from-pool.jpg",
    imageAlt: "The Chobe River floodplain stretching to the horizon, seen from the lodge plateau",
    needsPhoto: true,
  },
  {
    slug: "fishing-canoe",
    icon: Fish,
    name: "Fishing & Canoe",
    description:
      "Out onto the Chobe in a mokoro, poled by a guide who knows the channels. A quiet counterpoint to the drives — and the fishing is good.",
    included: "Available on request",
    image: "/images/mokoro-chobe-river.jpg",
    imageAlt:
      "Two guides poling guests in a mokoro canoe through the shallows of the Chobe River at golden hour",
  },
  {
    slug: "victoria-falls",
    icon: Landmark,
    name: "Victoria Falls Day Trip",
    description:
      "A full day across the border into Zimbabwe to stand at one of the Seven Natural Wonders of the World, then back to the lodge for dinner.",
    included: "Optional, at extra cost",
    image: "/images/chalets-plateau-floodplain.jpg",
    imageAlt:
      "Tented chalets on the Xhabe plateau with the Chobe floodplain and river beyond",
    needsPhoto: true,
  },
  {
    slug: "village-tour",
    icon: Users,
    name: "Village Tour",
    description:
      "A walk through a neighbouring village to meet the community the lodge is part of — every one of its ten staff comes from the Chobe Enclave.",
    included: "Included in the rate",
    image: "/images/lodge-pathway-dusk.jpg",
    imageAlt: "A lamp-lit gravel pathway through the lodge grounds at dusk",
    needsPhoto: true,
  },
  {
    slug: "basketry",
    icon: Hand,
    name: "Basketry Weaving",
    description:
      "Sit down with the local women who weave the baskets used throughout the lodge, and learn the craft yourself. Their work is for sale on site.",
    included: "Included in the rate",
    image: "/images/curios-detail.jpg",
    imageAlt:
      "Woven baskets, carved wooden pieces and pottery arranged on a cowhide rug in the lodge lounge",
  },
];

/** Lookup by slug — used to label a filtered Gallery view. */
export function getActivityBySlug(slug: string): Activity | undefined {
  return ACTIVITIES.find((a) => a.slug === slug);
}

/** Valid activity slugs, for validating an incoming `?activity=` param. */
export const ACTIVITY_SLUGS = ACTIVITIES.map((a) => a.slug);
