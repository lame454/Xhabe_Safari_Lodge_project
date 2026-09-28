import { CONTACT } from "@/lib/config/contact";
import { LODGE } from "@/lib/data/lodge";
import { MAX_ADULTS_PER_CHALET } from "@/lib/data/capacity";
import { CHALET_RATES, VALID_PERIOD } from "@/lib/data/rates";

/*
 * The lodge reduced to a table of plain facts.
 *
 * This exists because of how machines read pages. A paragraph of atmospheric
 * copy about light on the floodplain is what sells a stay to a person, but an
 * assistant asked "how many rooms does Xhabe Safari Lodge have" needs a short,
 * self-contained statement it can lift without inheriting the surrounding
 * sentence. Rows here are written to survive being quoted alone, with no
 * pronoun pointing at something above them and no clause that only parses in
 * context.
 *
 * Keep it short. The value of this block comes from being the densest true
 * thing on the page, and every row that is merely nice to know dilutes the
 * rows that actually answer a question.
 *
 * Values are derived from the data modules, never retyped, so this cannot
 * drift away from the rates page or the booking form.
 */

export interface QuickFact {
  label: string;
  value: string;
}

const sadc = CHALET_RATES.find((r) => r.audience === "SADC")!;
const intl = CHALET_RATES.find((r) => r.audience === "International")!;

export const QUICK_FACTS: QuickFact[] = [
  {
    label: "What it is",
    value: `A ${LODGE.chalets}-chalet luxury tented safari lodge and campsite.`,
  },
  {
    label: "Where",
    value:
      "On a plateau above the Chobe River floodplain, Chobe District, northern Botswana. " +
      `${LODGE.location.distances.join(". ")}.`,
  },
  {
    label: "Capacity",
    value: `${LODGE.chalets} chalets, ${LODGE.guests} guests, ${MAX_ADULTS_PER_CHALET} adults per chalet.`,
  },
  {
    label: "Nightly rate",
    value:
      `From $${sadc.sto.single} to $${intl.rack.double} per chalet per night, depending on nationality ` +
      `and rate type. Valid ${VALID_PERIOD}.`,
  },
  {
    label: "Rate includes",
    value:
      "All meals, soft drinks, bottled water, local beer and spirits, a game drive, a sundowner, " +
      "a village tour, basketry weaving, and the bed levy.",
  },
  {
    label: "Costs extra",
    value: "Boat cruise, day trip to Victoria Falls, park fees, imported alcohol, VAT.",
  },
  {
    label: "Pool",
    value: "15 by 7 metres, the largest in the area, overlooking the Chobe River.",
  },
  {
    label: "Getting there",
    value:
      "Transfers arranged from the airport or any entry point. Gateway to " +
      `${LODGE.location.gateway.join(", ")}.`,
  },
  {
    label: "Contact",
    value: `${CONTACT.email}. ${CONTACT.phoneDisplay}, also on WhatsApp.`,
  },
];

/*
 * When a human last checked these facts against the lodge's own material.
 *
 * Shown on the page because a dated fact is worth more than an undated one to
 * anyone deciding whether to trust it, and stale travel information is the
 * norm rather than the exception. Update it when the facts are genuinely
 * re-checked, not on every deploy: a date that moves automatically stops
 * meaning anything.
 */
export const LAST_REVIEWED = "28 September 2026";
