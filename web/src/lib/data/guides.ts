import { CONTACT } from "@/lib/config/contact";
import { LODGE } from "@/lib/data/lodge";
import { MAX_ADULTS_PER_CHALET } from "@/lib/data/capacity";
import {
  CANCELLATION_POLICY,
  PAYMENT_POLICY,
  RATE_EXCLUDES,
  RATE_INCLUDES,
  TRANSFER_RATES,
} from "@/lib/data/rates";

/*
 * Long-form guides about staying at the lodge.
 *
 * Scope is deliberately narrow: every claim here traces to the lodge's own
 * 2028 rates deck, to /booking-terms, or to the contact configuration. Nothing
 * is sourced from general knowledge about Botswana.
 *
 * That rules out the obvious crowd-pleasers. There is no "best time to visit
 * Chobe", no park fee table, no visa or malaria guidance, because none of it
 * is in the lodge's material and all of it changes. A guide that is confidently
 * wrong about a border requirement costs a guest their trip, and the lodge
 * carries the blame for publishing it. The narrower set below is smaller but
 * every line of it will still be true next year.
 *
 * Headings are phrased as questions on purpose. That is the shape the query
 * arrives in, both from a person typing into a search box and from an
 * assistant matching a passage to an answer.
 */

export interface GuideSection {
  /** Question-shaped, because that is how the query is phrased. */
  heading: string;
  /** Paragraphs of plain prose. */
  body?: string[];
  /** Optional bullets. Scannable, and easy to lift as a unit. */
  list?: string[];
}

export interface Guide {
  slug: string;
  /** The page's h1 and the basis of its <title>. */
  title: string;
  /** Meta description. Kept to roughly 140 to 155 characters. */
  description: string;
  /**
   * One or two sentences that answer the title on their own.
   *
   * Written to stand alone, because this is the passage most likely to be
   * quoted somewhere the rest of the page never reaches.
   */
  summary: string;
  image: string;
  imageAlt: string;
  sections: GuideSection[];
}

const savuti = TRANSFER_RATES[0];

export const GUIDES: Guide[] = [
  {
    slug: "getting-to-xhabe-safari-lodge",
    title: "How to get to Xhabe Safari Lodge",
    description:
      "How to reach Xhabe Safari Lodge in Chobe, Botswana: where it sits, which entry points it serves, and how transfers are arranged.",
    summary:
      `Xhabe Safari Lodge is in the Chobe District of northern Botswana, ${LODGE.location.distances.join(" and ")}. ` +
      "The lodge arranges transfers from the airport or any entry point, so you do not need your own vehicle to reach it.",
    image: "/images/lodge-exterior-day.jpg",
    imageAlt: "The main building at Xhabe Safari Lodge seen from the grounds in daylight",
    sections: [
      {
        heading: "Where exactly is the lodge?",
        body: [
          `The lodge sits on a plateau overlooking the Chobe River floodplain, in ${LODGE.location.region}. ` +
            `It is ${LODGE.location.distances.join(" and ")}.`,
          `${LODGE.location.corridor} The postal address is ${CONTACT.postalAddress}, and the lodge stands at ${CONTACT.addressOneLine}.`,
        ],
      },
      {
        heading: "Do I need my own vehicle?",
        body: [
          "No. Transfers from the airport or any entry point are part of what the lodge offers, and arranging one is a matter of telling the lodge your arrival details when you book.",
          "There is free parking on site for guests who do drive themselves, and the lodge runs a maintained fleet for activities, so getting to a game drive is never your own logistical problem.",
        ],
      },
      {
        heading: "What else can I reach from here?",
        body: [
          `The lodge works as a base for a wider trip. It is a gateway to ${LODGE.location.gateway.join(", ")}.`,
          `A Savuti transfer is charged per person on top of the nightly rate: $${savuti.sadc.rack} for SADC residents ` +
            `and $${savuti.international.rack} international at the published rate, or $${savuti.sadc.sto} and ` +
            `$${savuti.international.sto} at tour operator rates. ${savuti.note}.`,
        ],
      },
      {
        heading: "How close is the border?",
        body: [
          "The Namibian border is 5 km away, near the Ngoma border gate. That proximity is part of why the lodge suits a multi-country trip rather than a single-park stay.",
        ],
      },
    ],
  },

  {
    slug: "what-a-night-at-xhabe-includes",
    title: "What a night at Xhabe Safari Lodge includes",
    description:
      "What the nightly rate at Xhabe Safari Lodge covers: all meals, drinks, a game drive, a sundowner, a village tour, and what costs extra.",
    summary:
      "The nightly rate at Xhabe Safari Lodge covers accommodation, all meals, soft drinks and bottled water, local beer and spirits, " +
      "a game drive, a sundowner, a village tour, basketry weaving and the bed levy. A boat cruise and a Victoria Falls day trip cost extra.",
    image: "/images/lounge-dining-wide.jpg",
    imageAlt: "The dining area at Xhabe Safari Lodge, set beneath wooden beams",
    sections: [
      {
        heading: "What is included in the rate?",
        list: [...RATE_INCLUDES],
        body: [
          "Rates are quoted per chalet per night rather than per person, and they differ for SADC residents and international guests. Tour operators are quoted a separate trade rate.",
        ],
      },
      {
        heading: "What costs extra?",
        list: [...RATE_EXCLUDES],
        body: [
          "The boat cruise on the Chobe River and the day trip to Victoria Falls are the two activities that sit outside the rate. Both are arranged through the lodge.",
        ],
      },
      {
        heading: "What about drinks?",
        body: [
          "Local beer, soft drinks and bottled still water are included. Other alcohol, including imported spirits and wine, is available on a cash bar. The lodge accepts card payments, so you do not need to carry cash for the bar.",
        ],
      },
      {
        heading: "How does paying work?",
        list: [...PAYMENT_POLICY],
        body: [
          "A booking request is not a confirmed reservation. The lodge confirms availability, the rate and the deposit in writing first, and nothing is charged before that.",
        ],
      },
      {
        heading: "What if I need to cancel?",
        list: [...CANCELLATION_POLICY],
      },
    ],
  },

  {
    slug: "the-chalets-and-shared-spaces",
    title: "The chalets and shared spaces at Xhabe Safari Lodge",
    description:
      `Inside the ${LODGE.chalets} tented chalets at Xhabe Safari Lodge, and the lounge, boma, bar, pool and gardens that the lodge shares.`,
    summary:
      `Xhabe Safari Lodge has ${LODGE.chalets} luxury tented chalets sleeping ${LODGE.guests} guests in total, ` +
      `at ${MAX_ADULTS_PER_CHALET} adults per chalet. Each has a super king bed, two private balconies over the floodplain, and air conditioning.`,
    image: "/images/chalet-king-bed-window.jpg",
    imageAlt: "A super king bed in a tented chalet at Xhabe Safari Lodge, beside a window looking out over the floodplain",
    sections: [
      {
        heading: "What is in each chalet?",
        list: [...LODGE.chalet.features],
      },
      {
        heading: "How many guests does the lodge take?",
        body: [
          `${LODGE.chalets} chalets, ${LODGE.guests} guests, ${MAX_ADULTS_PER_CHALET} adults per chalet. The lodge is small by design, ` +
            "and a group of eighteen can take the whole property rather than sharing it with strangers.",
        ],
      },
      {
        heading: "What are the shared spaces?",
        body: LODGE.amenities.map(
          (amenity) => `${amenity.name}. ${amenity.points.join(". ")}.`
        ),
      },
      {
        heading: "Is there a pool?",
        body: [
          "The pool is 15 by 7 metres, the largest in the area, and it overlooks the Chobe River. It earns its size: Chobe temperatures reach 38 to 39 degrees Celsius, and every chalet is air conditioned for the same reason.",
        ],
      },
    ],
  },

  {
    slug: "wildlife-around-xhabe-safari-lodge",
    title: "Wildlife around Xhabe Safari Lodge",
    description:
      "The lodge sits on a wildlife corridor between the Chobe Forest and the Chobe River, 5 km from Chobe National Park. What that means for game viewing.",
    summary:
      `${LODGE.location.corridor} It is 5 km from Chobe National Park, a park that holds one of the densest elephant populations on earth.`,
    image: "/images/giraffe-tower.jpg",
    imageAlt: "A group of giraffe in the bush near Xhabe Safari Lodge",
    sections: [
      {
        heading: "Does game come to the lodge itself?",
        body: [
          `${LODGE.location.corridor} A corridor is a route animals actually use, which is why game moves past the property rather than only being sought out in the park.`,
          `${LODGE.location.summary}`,
        ],
      },
      {
        heading: "What is Chobe known for?",
        body: [
          "These are the figures the lodge publishes, each attributed to its source:",
        ],
        list: LODGE.context.map(
          (item) => `${item.stat} ${item.label}. ${item.detail}`
        ),
      },
      {
        heading: "How do I see it?",
        body: [
          "A game drive is included in the nightly rate, run with the lodge's own maintained fleet. A sundowner is included too.",
          "A boat cruise on the Chobe River is available at extra cost, which is a different way of seeing the same floodplain the chalets look over.",
        ],
      },
    ],
  },

  {
    slug: "what-to-expect-on-arrival",
    title: "What to expect when you arrive at Xhabe Safari Lodge",
    description:
      "Arrival at Xhabe Safari Lodge: the safety briefing, security on site, Wi-Fi, laundry, parking, power and payment. What is handled for you.",
    summary:
      "Guests are given a safety, health and environment briefing on arrival. The lodge has 24-hour security, free parking, " +
      "Wi-Fi, free laundry, a back-up generator and card payment, so most practical arrangements are already handled.",
    image: "/images/main-building-blue-hour.jpg",
    imageAlt: "The main building at Xhabe Safari Lodge lit at blue hour",
    sections: [
      {
        heading: "What happens when I get there?",
        body: [
          "You are given a safety, health and environment briefing. It is short, and it matters: this is a property on a wildlife corridor, not a hotel with a garden.",
        ],
      },
      {
        heading: "What does the lodge handle for me?",
        list: [...LODGE.services],
      },
      {
        heading: "Can I work or stay reachable?",
        body: [
          "There is Wi-Fi, and a back-up generator behind it. Laundry is free, which for a multi-stop trip through Botswana is worth more than it sounds.",
        ],
      },
      {
        heading: "Is it safe?",
        body: [
          "The lodge runs 24-hour security with CCTV, an electric fence and a guard on site. There are fire services throughout the property, lightning protection, and public liability insurance.",
        ],
      },
    ],
  },

  {
    slug: "how-xhabe-supports-the-chobe-enclave",
    title: "How Xhabe Safari Lodge supports the Chobe Enclave",
    description:
      `All ${LODGE.staff} staff at Xhabe Safari Lodge come from the Chobe Enclave, and its crafts, produce and materials are sourced locally.`,
    summary:
      `All ${LODGE.staff} employees at Xhabe Safari Lodge come from the Chobe Enclave. The lodge's basketry, wall paintings, ` +
      "flower pots, leather mats, herbs and vegetables are all bought locally rather than shipped in.",
    image: "/images/curios-detail.jpg",
    imageAlt: "Locally made curios and basketry on display at Xhabe Safari Lodge",
    sections: [
      {
        heading: "Who works at the lodge?",
        body: [
          `All ${LODGE.staff} employees come from the Chobe Enclave. That is the whole team, not a proportion of it.`,
        ],
      },
      {
        heading: "Where do the lodge's materials come from?",
        list: [...LODGE.localSupport],
      },
      {
        heading: "What else does the lodge do locally?",
        list: [...LODGE.socialResponsibility],
      },
      {
        heading: "What about the land itself?",
        body: [
          "A bio-sewage system produces grey water used solely for irrigation, and replanting on the grounds favours indigenous trees. Walkways are built from gum poles, rope and gravel.",
        ],
      },
    ],
  },
];

export function guideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}

/** When these guides were last checked against the lodge's own material. */
export const GUIDES_LAST_REVIEWED = "28 September 2026";
