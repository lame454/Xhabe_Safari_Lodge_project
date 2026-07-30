import {
  Sunrise,
  Ship,
  Landmark,
  Utensils,
  Flame,
  Telescope,
  Fish,
  Globe,
} from "lucide-react";

/**
 * A lodge activity.
 *
 * `slug` is the stable identifier shared across the whole site: it is the
 * anchor on the Activities page, the `?activity=` value the Gallery filters
 * on, and the tag stored in `gallery_images.activity_tags`. Adding a photo to
 * an activity is therefore just a matter of tagging the row with the slug —
 * no code change needed.
 */
export interface Activity {
  slug: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  /** Short label describing which packages include this activity. */
  included: string;
  /** Fallback image, used until the Gallery has photos tagged for this slug. */
  image: string;
}

export const ACTIVITIES: Activity[] = [
  {
    slug: "morning-game-drive",
    icon: Sunrise,
    name: "Morning Game Drive",
    description:
      "Dawn game drives through open Chobe bush in our 4x4 open-sided vehicles. Spot elephant, buffalo, lion, leopard, and wild dog as the savanna awakens. Our expert guides read the land and tracks to find magic most visitors never encounter.",
    included: "Included in all packages",
    image: "/images/activities-game-drive.jpg",
  },
  {
    slug: "river-boat-cruise",
    icon: Ship,
    name: "River Boat Cruise",
    description:
      "Float through the Chobe River channels at close range with hippos, crocodiles, elephants bathing at the bank, and hundreds of waterbirds. The golden hour on the water is unforgettable — sundowners served aboard.",
    included: "Included in Packages 2 & 3",
    image: "/images/activities-boat.jpg",
  },
  {
    slug: "victoria-falls-day-trip",
    icon: Landmark,
    name: "Victoria Falls Day Trip",
    description:
      "A full-day excursion to one of the Seven Natural Wonders of the World. Cross into Zimbabwe and stand at the edge of the largest waterfall curtain on Earth — 1,708 metres wide and 108 metres tall. Approximately 2 hours each way.",
    included: "Included in Packages 2 & 3",
    image: "/images/activities-vic-falls.jpg",
  },
  {
    slug: "boma-dinner",
    icon: Flame,
    name: "Boma Dinner & Cultural Night",
    description:
      "Gather under the stars around a traditional fire in the boma. Enjoy a feast of local meats, vegetables, and staples while the lodge team shares stories of the bush, local culture, and traditional dance.",
    included: "Included in Package 3",
    image: "/images/activities-boma.jpg",
  },
  {
    slug: "stargazing",
    icon: Telescope,
    name: "Stargazing",
    description:
      "With no light pollution for kilometres around, the Chobe night sky is extraordinary. Our guides turn off the lodge lights for a scheduled stargazing session — the Milky Way stretches from horizon to horizon.",
    included: "Included in Package 3",
    image: "/images/activities-stars.jpg",
  },
  {
    slug: "floodplain-fishing",
    icon: Fish,
    name: "Floodplain Fishing",
    description:
      "Cast a line in the Chobe River and its lagoons for tigerfish, bream, and catfish. A peaceful, meditative counterpoint to the adrenalin of the game drive — available as an add-on activity for all guests.",
    included: "Available on request",
    image: "/images/activities-fishing.jpg",
  },
  {
    slug: "village-visit",
    icon: Globe,
    name: "Cultural Village Visit",
    description:
      "Walk with your guide through a neighbouring village to meet local Basubiya families, understand daily bush life, and support the community economy that underpins Xhabe's conservation ethic.",
    included: "Available on request",
    image: "/images/activities-village.jpg",
  },
  {
    slug: "sundowners",
    icon: Utensils,
    name: "Sundowner Cocktails",
    description:
      "Every evening, as the sun sinks towards Namibia, the team sets up a mobile sundowner station on the plateau with panoramic floodplain views. Local gins, craft beers, soft drinks, and light snacks served.",
    included: "Included in all packages",
    image: "/images/activities-sundowner.jpg",
  },
];

/** Lookup by slug — used to label a filtered Gallery view. */
export function getActivityBySlug(slug: string): Activity | undefined {
  return ACTIVITIES.find((a) => a.slug === slug);
}

/** Valid activity slugs, for validating an incoming `?activity=` param. */
export const ACTIVITY_SLUGS = ACTIVITIES.map((a) => a.slug);
