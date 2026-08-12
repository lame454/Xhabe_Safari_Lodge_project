/**
 * Third-party booking and review platforms where the lodge is listed.
 *
 * These are outbound links only. The review text and photos on each of
 * these platforms belong to that platform and to the guests who wrote them —
 * scraping or republishing that content here would violate each site's
 * terms of service and, for the reviews themselves, copyright. Linking out
 * is the only route that's actually legitimate; a widget embedded via the
 * platform's own official program (e.g. TripAdvisor's Review Widget, which
 * requires the owner to claim the listing) is the next step up if real
 * embedded content is wanted later.
 *
 * To collect and display genuine guest reviews directly on this site, see
 * lib/data/testimonials.ts instead.
 */
export type Listing = {
  name: string;
  url: string;
};

export const LISTINGS: Listing[] = [
  {
    name: "TripAdvisor",
    url: "https://www.tripadvisor.com/Hotel_Review-g19433529-d24971649-Reviews-Xhabe_Safari_Lodge-Muchenje_North_West_District.html",
  },
  {
    name: "African Reservations",
    url: "https://www.africanreservations.com/Xhabe-Safari-Lodge",
  },
  {
    name: "Hotels.com",
    url: "https://ms.hotels.com/en/ho2987088608/xhabe-safari-lodge-chobe-ngoma-botswana/",
  },
  {
    name: "Traveloka",
    url: "https://www.traveloka.com/en-en/hotel/botswana/xhabe-safari-lodge---chobe-9000001696017",
  },
  {
    name: "Sun Safaris",
    url: "https://www.sunsafaris.com/safari/botswana/chobe-national-park/xhabe-safari-lodge.html",
  },
];
