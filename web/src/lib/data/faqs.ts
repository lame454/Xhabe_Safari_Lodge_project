import { CONTACT } from "@/lib/config/contact";
import { LODGE } from "@/lib/data/lodge";
import { MAX_ADULTS_PER_CHALET } from "@/lib/data/capacity";
import {
  CANCELLATION_POLICY,
  CHALET_RATES,
  PAYMENT_POLICY,
  RATE_EXCLUDES,
  RATE_INCLUDES,
  VALID_PERIOD,
} from "@/lib/data/rates";

/*
 * The lodge's frequently asked questions.
 *
 * This is the single source for both the visible /faq page and the FAQPage
 * structured data attached to it, and that is a requirement rather than a
 * tidiness preference: Google treats FAQ markup whose answers do not appear
 * on the page as a structured-data violation, and the cost of being caught is
 * the rich result disappearing. Deriving both from one array makes the two
 * impossible to drift apart.
 *
 * Numbers are interpolated from the data modules rather than typed out, so a
 * rate change or a new chalet updates these answers, the rates page and the
 * booking form together instead of leaving this file quietly stale.
 *
 * Every answer below is traceable to the lodge's 2028 rates deck or to the
 * contact configuration. Questions the source material does not answer are
 * listed in UNANSWERED at the bottom rather than guessed at.
 */

export interface Faq {
  /** Phrased the way a guest would ask it, not the way a brochure would. */
  question: string;
  /**
   * Plain text, no markup. Answers open with the fact rather than a preamble,
   * so the first sentence survives being quoted on its own. That is how search
   * engines and assistants tend to use them.
   */
  answer: string;
}

const sadc = CHALET_RATES.find((r) => r.audience === "SADC")!;
const intl = CHALET_RATES.find((r) => r.audience === "International")!;

export const FAQS: Faq[] = [
  {
    question: "Where is Xhabe Safari Lodge?",
    answer:
      "Xhabe Safari Lodge is in the Chobe District of northern Botswana, on a plateau overlooking the Chobe River floodplain. " +
      `It is ${LODGE.location.distances.join(" and ")}, on a wildlife corridor between the Chobe Forest and the Chobe River. ` +
      `The postal address is ${CONTACT.postalAddress}.`,
  },
  {
    question: "How many rooms does Xhabe Safari Lodge have?",
    answer:
      `The lodge has ${LODGE.chalets} luxury tented chalets and sleeps a maximum of ${LODGE.guests} guests, at ` +
      `${MAX_ADULTS_PER_CHALET} adults per chalet. It is deliberately small, and the whole property can be booked ` +
      "out by a single group.",
  },
  {
    question: "What is in each chalet?",
    answer:
      "Every chalet has a super king bed, two private balconies over the floodplain, a dressing area, air " +
      "conditioning, and an en-suite bathroom with shower, basin and toilet. Each one looks out over the Chobe " +
      "floodplain.",
  },
  {
    question: "How much does it cost to stay at Xhabe Safari Lodge?",
    answer:
      "Rates are per chalet per night in US dollars and depend on nationality. For SADC residents the published " +
      `rate is $${sadc.rack.single} single and $${sadc.rack.double} double. For international guests it is ` +
      `$${intl.rack.single} single and $${intl.rack.double} double. Tour operator rates are lower: ` +
      `$${sadc.sto.single} and $${sadc.sto.double} for SADC, $${intl.sto.single} and $${intl.sto.double} ` +
      `international. These rates are valid ${VALID_PERIOD}.`,
  },
  {
    question: "What is included in the nightly rate?",
    answer:
      `The rate includes ${RATE_INCLUDES.join(", ").toLowerCase()}. Local beer, soft drinks and bottled still ` +
      "water are included. Other alcohol is available on a cash bar, and the lodge accepts card payments.",
  },
  {
    question: "What is not included in the rate?",
    answer:
      `Not included: ${RATE_EXCLUDES.join("; ").toLowerCase()}. The boat cruise and the day trip to Victoria ` +
      "Falls are both optional extras arranged through the lodge.",
  },
  {
    question: "Are meals included at Xhabe Safari Lodge?",
    answer:
      "Yes. All meals are included in the nightly rate. The kitchen cooks low-fat, vegetable-forward dishes from " +
      "fresh ingredients, with herbs and vegetables grown in the lodge's own garden, and caters for special diets " +
      "on request. There are two dining areas, plus the boma for dinner under lamplight and stars.",
  },
  {
    question: "What activities are available at the lodge?",
    answer:
      "A game drive, a sundowner, a village tour and basketry weaving are included in the rate. A boat cruise on " +
      "the Chobe River and a day trip to Victoria Falls are available at extra cost. The lodge sits on an animal " +
      "corridor between the Chobe Forest and the river, so game moves past the property itself.",
  },
  {
    question: "Does Xhabe Safari Lodge have Wi-Fi and a swimming pool?",
    answer:
      "Yes to both. Wi-Fi is available and laundry is free. The swimming pool is 15 by 7 metres, the largest in " +
      "the area, and overlooks the Chobe River. Every chalet has air conditioning, which matters when Chobe " +
      "temperatures reach 38 to 39 degrees Celsius.",
  },
  {
    question: "How do I get to Xhabe Safari Lodge?",
    answer:
      "The lodge arranges transfers from the airport or any entry point. It is a gateway to " +
      `${LODGE.location.gateway.join(", ")}. A Savuti transfer is charged per person on top of the nightly rate. ` +
      "The lodge is 5 km from the Namibian border, near the Ngoma border gate.",
  },
  {
    question: "What is the deposit and payment schedule?",
    answer: `${PAYMENT_POLICY.join(". ")}.`,
  },
  {
    question: "What is the cancellation policy?",
    answer: `${CANCELLATION_POLICY.join(". ")}.`,
  },
  {
    question: "Is the lodge secure, and is parking available?",
    answer:
      "The lodge has 24-hour security with CCTV, an electric fence and a guard on site, plus free parking, fire " +
      "services throughout the property, lightning protection and a back-up generator. Guests are given a safety, " +
      "health and environment briefing on arrival.",
  },
  {
    question: "How do I book a stay at Xhabe Safari Lodge?",
    answer:
      "Check live availability and request dates on the lodge's website, or contact the lodge directly. Email " +
      `${CONTACT.email}, call ${CONTACT.phoneDisplay}, or message the same number on WhatsApp. ` +
      `${CONTACT.responseTime}. A booking request is confirmed by the lodge before any payment is taken.`,
  },
  {
    question: "Does Xhabe Safari Lodge employ local people?",
    answer:
      `All ${LODGE.staff} employees come from the Chobe Enclave. The lodge buys basketry from local women, wall ` +
      "paintings from deaf youth in Kasane, flower pots from a young man in Kasane, leather mats from a Motswana " +
      "citizen in Tsabong, and herbs and vegetables from a local garden. It also sponsors an adopted school, " +
      "supports veldfire suppression, and takes part in National Tree Planting Day each November.",
  },
];

/*
 * Questions worth answering that the source material does not cover.
 *
 * Left unanswered on purpose. Each of these is something people genuinely ask
 * an assistant about a Chobe lodge, so answering them well would be worth real
 * traffic. But every plausible answer would be invention: nobody has confirmed
 * a check-in time, a child policy or a best season for this property. A
 * confidently wrong answer in structured data is worse than a missing one,
 * because a guest can act on it and arrive to find it untrue.
 *
 * Fill these in from the lodge's own knowledge and move them into FAQS above.
 */
export const UNANSWERED = [
  "What time is check-in and check-out?",
  "Is Xhabe Safari Lodge suitable for children, and is there a child rate?",
  "What is the best time of year to visit Chobe?",
  "What should I pack?",
  "Are park fees payable on arrival, and how much are they?",
] as const;
