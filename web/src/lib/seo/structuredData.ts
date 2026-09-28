import { CONTACT } from "@/lib/config/contact";
import { SITE_URL, absoluteUrl } from "@/lib/config/site";
import { LODGE } from "@/lib/data/lodge";
import { LISTINGS } from "@/lib/data/listings";
import { FAQS, type Faq } from "@/lib/data/faqs";
import { CHALET_RATES, CURRENCY } from "@/lib/data/rates";

/*
 * Schema.org structured data, as JSON-LD.
 *
 * This is how a search engine or an assistant learns that this site is about a
 * specific lodge, in a specific place, with a specific phone number, rather
 * than a page that happens to contain those words. It is the difference
 * between being matched on keywords and being understood as an entity.
 *
 * Two rules govern everything in this file:
 *
 *   1. Only assert what has been verified. Structured data is read by machines
 *      that cannot sanity-check it, so an invented fact propagates further and
 *      is harder to retract than the same mistake in page copy. Fields the
 *      lodge has not confirmed are left out and listed under MISSING below.
 *
 *   2. Never assert a rating. `aggregateRating` with no real reviews behind it
 *      is both fabrication and a documented cause of manual action against a
 *      site. There is a deliberately empty /reviews page; this stays empty
 *      until it does not.
 */

/*
 * Facts a lodge site would normally publish that nobody has confirmed here.
 *
 * Each of these is genuinely useful and safe to add the moment it is known.
 * They are absent rather than approximated:
 *
 *   geo (latitude/longitude) — the biggest omission. Coordinates drive the map
 *     pin and "near me" style matching. The site's map embed resolves a text
 *     query instead, which is why nothing in the repo contains a real pair.
 *     Guessing from the village name would place the pin in the wrong spot,
 *     which is worse for a guest driving to it than no pin at all.
 *   checkinTime / checkoutTime
 *   starRating
 *   petsAllowed
 *   openingHours (reception hours)
 */

/**
 * Stable @id for the lodge as an entity.
 *
 * A fragment URI rather than a bare page URL, so other nodes in the graph can
 * point at "the business" without it being confused with "the homepage".
 */
const LODGE_ID = `${SITE_URL}/#lodge`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Where else this business is described.
 *
 * `sameAs` is how a search engine merges the lodge's profiles into one entity
 * instead of treating each listing as a separate business. The third-party
 * booking sites carry as much weight here as the social accounts.
 */
const sameAs = [
  CONTACT.social.facebook,
  CONTACT.social.instagram,
  ...LISTINGS.map((listing) => listing.url),
];

/** Lowest and highest published nightly rates, for `priceRange`. */
function priceRange(): string {
  const all = CHALET_RATES.flatMap((r) => [
    r.rack.single,
    r.rack.double,
    r.sto.single,
    r.sto.double,
  ]);
  return `$${Math.min(...all)}-$${Math.max(...all)}`;
}

/**
 * Amenities, as schema.org expects them.
 *
 * Only the ones a guest would filter on. The lodge's full service list is
 * longer, but padding this with entries like "public liability insurance"
 * dilutes the useful signal without helping anybody searching.
 */
const AMENITIES = [
  "Free Wi-Fi",
  "Swimming pool",
  "Air conditioning",
  "Free parking",
  "Free laundry service",
  "Restaurant",
  "Bar",
  "En-suite bathroom",
  "Airport transfer",
  "24-hour security",
  "Back-up generator",
  "Game drives",
] as const;

/** The lodge itself: the primary entity this whole site describes. */
export function lodgingBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": LODGE_ID,
    name: LODGE.name,
    slogan: LODGE.tagline,
    description:
      `${LODGE.name} is a ${LODGE.chalets}-chalet luxury tented lodge on a plateau above the Chobe River ` +
      `floodplain in northern Botswana, ${LODGE.location.distances.join(" and ")}. It sleeps ${LODGE.guests} guests.`,
    url: SITE_URL,
    telephone: CONTACT.phoneE164,
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.addressLines[0],
      addressLocality: "Mabele Village, Chobe Enclave",
      addressRegion: "Chobe District",
      addressCountry: "BW",
    },
    /*
     * A text query, not coordinates, matching the site's own map embed. It
     * resolves to the right place today without pretending to a precision
     * nobody has measured.
     */
    hasMap:
      "https://maps.google.com/maps?q=Xhabe%20Safari%20Lodge,%20Muchenje,%20Botswana",
    image: [
      absoluteUrl("/images/pool-chalets-floodplain.jpg"),
      absoluteUrl("/images/reception-lounge-golden.jpg"),
      absoluteUrl("/images/boma-lantern-dinner.jpg"),
      absoluteUrl("/images/sunset-pool-chalets.jpg"),
    ],
    logo: absoluteUrl("/images/logo-xhabe.jpg"),
    priceRange: priceRange(),
    currenciesAccepted: CURRENCY,
    paymentAccepted: "Cash, Credit Card",
    numberOfRooms: {
      "@type": "QuantitativeValue",
      value: LODGE.chalets,
      unitText: "chalets",
    },
    maximumAttendeeCapacity: LODGE.guests,
    amenityFeature: AMENITIES.map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
    /*
     * Proximity to the park is the single strongest reason somebody picks this
     * lodge, and it is also how the query is usually phrased. Naming the park
     * as a linked entity states the relationship outright instead of hoping a
     * crawler infers it from body copy.
     */
    nearbyAttraction: [
      {
        "@type": "TouristAttraction",
        name: "Chobe National Park",
        description: "5 km from the lodge.",
      },
      {
        "@type": "TouristAttraction",
        name: "Chobe River",
        description: "Boat cruises available from the lodge at extra cost.",
      },
      {
        "@type": "TouristAttraction",
        name: "Victoria Falls",
        description: "Day trips available from the lodge at extra cost.",
      },
    ],
    sameAs,
  };
}

/** The site, so a search box and the canonical name are unambiguous. */
export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: LODGE.name,
    publisher: { "@id": LODGE_ID },
    inLanguage: "en",
  };
}

/**
 * FAQ markup.
 *
 * Defaults to the full published list. The answers must appear verbatim on the
 * rendered page, which is why both this and the page read from lib/data/faqs.
 */
export function faqPageSchema(faqs: readonly Faq[] = FAQS) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absoluteUrl("/faq")}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
    about: { "@id": LODGE_ID },
  };
}

/** Trail of ancestors for a page, so results show a path instead of a bare URL. */
export function breadcrumbSchema(trail: ReadonlyArray<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/**
 * A guide page, as an Article.
 *
 * `publisher` and `about` both point at the lodge's @id rather than repeating
 * its details, which is the whole reason the entity carries a stable id: a
 * crawler resolves one business from the graph instead of guessing whether
 * three descriptions refer to the same place.
 *
 * No `author` is claimed. These guides are the lodge's own material and there
 * is no named writer to credit, and inventing a byline to satisfy a schema
 * validator is exactly the kind of fabrication this file exists to avoid.
 */
export function guideArticleSchema(guide: {
  slug: string;
  title: string;
  summary: string;
  image: string;
}, lastReviewed: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${absoluteUrl(`/guides/${guide.slug}`)}#article`,
    headline: guide.title,
    description: guide.summary,
    image: absoluteUrl(guide.image),
    url: absoluteUrl(`/guides/${guide.slug}`),
    dateModified: new Date(lastReviewed).toISOString().slice(0, 10),
    publisher: { "@id": LODGE_ID },
    about: { "@id": LODGE_ID },
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "en",
  };
}

/** The guides index, as a list a crawler can walk without parsing the layout. */
export function guidesListSchema(
  guides: ReadonlyArray<{ slug: string; title: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${absoluteUrl("/guides")}#list`,
    name: "Guides to staying at Xhabe Safari Lodge",
    itemListElement: guides.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: guide.title,
      url: absoluteUrl(`/guides/${guide.slug}`),
    })),
  };
}
