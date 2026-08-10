/**
 * Verified facts about the lodge.
 *
 * Everything here comes from the lodge's own 2028 rates deck. Nothing is
 * inferred or embellished — if a claim isn't in that document it isn't here,
 * so pages can quote these freely without anyone re-checking them.
 */

export const LODGE = {
  name: "Xhabe Safari Lodge",
  tagline: "exclusive wilderness",

  /**
   * Nine chalets sleeping eighteen. The source deck says both "chalets x 9"
   * and "18 guests", which agree at two adults per chalet; a stray "8 rooms"
   * line elsewhere in the same section is treated as stale.
   */
  chalets: 9,
  guests: 18,
  staff: 10,

  location: {
    region: "Chobe West, Botswana",
    summary:
      "On a plateau overlooking the Chobe River floodplain and the Namibian border.",
    corridor:
      "The lodge sits on a wildlife corridor between the Chobe Forest and the Chobe River.",
    distances: [
      "5 km from Chobe National Park",
      "5 km from the Namibian border",
    ],
    gateway: ["Maun", "Savuti", "Linyanti", "Namibia", "Zimbabwe", "Zambia"],
  },

  /** Context claims, each attributed in the source deck. */
  context: [
    {
      stat: "No. 1",
      label: "for conservation",
      detail: "Botswana, ranked by Lonely Planet in 2017.",
    },
    {
      stat: "130,000",
      label: "elephants",
      detail: "Almost double the number found anywhere else on earth.",
    },
    {
      stat: "No. 3",
      label: "safari destination in Africa",
      detail: "Chobe National Park, ranked by Fodor's.",
    },
    {
      stat: "450+",
      label: "bird species",
      detail: "Recorded within the park.",
    },
  ],

  chalet: {
    features: [
      "Super king bed with bedside tables",
      "Two private balconies over the floodplain",
      "Dressing area",
      "Air conditioning",
      "En-suite bathroom with shower, basin and toilet",
      "Splendid vistas of the Chobe floodplain",
    ],
  },

  /** The lodge's shared spaces, in the order the deck presents them. */
  amenities: [
    {
      slug: "lounge",
      name: "The Lounge",
      image: "/images/reception-lounge-golden.jpg",
      imageAlt:
        "The open-sided reception lounge at Xhabe Safari Lodge in late afternoon light, with burnt-orange velvet armchairs",
      points: [
        "Comfortable furniture chosen for the safari setting",
        "Wooden floors and fittings for a serene, unhurried feel",
        "River views from the comfort of the lodge",
      ],
    },
    {
      slug: "dining",
      name: "Dining & Meals",
      image: "/images/dessert-xhabe-plate.jpg",
      imageAlt:
        "A layered pastry dessert plated with the word Xhabe written in chocolate",
      points: [
        "Two dining areas, both designed to add warmth",
        "Low-fat, vegetable-forward dishes from fresh ingredients",
        "Herbs and vegetables from the lodge's own garden",
        "Special diets catered for",
      ],
    },
    {
      slug: "boma",
      name: "The Boma",
      image: "/images/boma-lantern-dinner.jpg",
      imageAlt:
        "A lantern-lit dinner table set for three in the boma at Xhabe Safari Lodge after dark",
      points: [
        "Lamplight, fire and stars for the evening's mood",
        "Traditional cuisine, barbecue and assorted drinks",
        "Star viewing, and a chance to learn how to make fire",
        "Seperu traditional dancing performed by a local group",
      ],
    },
    {
      slug: "pool",
      name: "The Swimming Pool",
      image: "/images/pool-chalets-floodplain.jpg",
      imageAlt:
        "The swimming pool at Xhabe Safari Lodge with two tented chalets and the Chobe floodplain beyond",
      points: [
        "15 by 7 metres — the largest pool in the area",
        "Relief from Chobe temperatures that reach 38–39°C",
        "Overlooks the Chobe River",
      ],
    },
    {
      slug: "bar",
      name: "The Bar",
      image: "/images/lounge-bar.jpg",
      imageAlt:
        "The lounge and bar area at Xhabe Safari Lodge, with the bar counter behind the seating",
      points: [
        "Cocktails, beer, spirits and soft drinks",
        "Local beer, soft drinks and bottled still water included in the rate",
        "Other alcohol available on a cash bar",
        "Card payments accepted",
      ],
    },
    {
      slug: "garden",
      name: "Garden & Grounds",
      image: "/images/lodge-pathway-dusk.jpg",
      imageAlt:
        "A lamp-lit gravel pathway through the lodge grounds at dusk, with the pool and loungers beyond",
      points: [
        "A bio-sewage system produces grey water used solely for irrigation",
        "Replanting favours indigenous trees",
        "Walkways of gum poles, rope and gravel",
        "A plateau position, and the sunset that comes with it",
      ],
    },
  ],

  /** Verbatim from the deck's services list. */
  services: [
    "Well-maintained fleet for activities",
    "24-hour security — CCTV, electric fence and guard",
    "Free parking",
    "Safety, health and environment briefing on arrival",
    "Fire services throughout the lodge",
    "Lightning protection",
    "Back-up generator",
    "Wi-Fi",
    "Free laundry service",
    "Card payments accepted",
    "Book corners for readers",
    "Transfers from the airport or any entry point",
    "Public liability insurance",
  ],

  /** Where the lodge's money and materials stay local. */
  localSupport: [
    "All ten employees come from the Chobe Enclave",
    "Basketry woven by local women",
    "Wall paintings by deaf youth from Kasane",
    "Flower pots made by a young man in Kasane",
    "Leather mats by a Motswana citizen from Tsabong",
    "Herbs and vegetables from a local garden",
  ],

  socialResponsibility: [
    "An adopted school, including sponsorship of its prize-giving day",
    "Veldfire suppression support through procuring fire beaters",
    "Participation in National Tree Planting Day each November",
  ],

  whyXhabe: [
    "A gateway to Maun, Savuti and Linyanti, and to Namibia, Zimbabwe and Zambia",
    "A plateau position with an elite view",
    "Beside an animal corridor",
    "Private, clean and elegantly furnished",
    "Experienced, professional staff",
    "A considered menu at both the bar and the dining table",
    "The biggest pool in the area",
    "A flexible team that works to each guest's needs",
  ],
} as const;
