/**
 * The lodge's published rate card.
 *
 * Transcribed from the 2028 rates deck. Rates are per room per night in USD.
 *
 * Two audiences and two rate types:
 *   SADC          — residents of Southern African Development Community states
 *   International  — everyone else
 *   RACK           — the published walk-up rate
 *   STO            — the Standard Tour Operator rate, for the trade
 *
 * Note on dates: the source table lists two season rows carrying identical
 * prices — "01 Jan to 31 March 2027" and "01 Nov 2026 to 10 Jan '28". Since
 * they overlap and do not differ in price, they are presented here as one
 * published rate rather than invented into separate seasons.
 */

export interface RoomRate {
  single: number;
  double: number;
}

export interface RateRow {
  audience: "SADC" | "International";
  rack: RoomRate;
  sto: RoomRate;
}

export const CURRENCY = "USD";

export const VALID_PERIOD = "1 November 2026 – 10 January 2028";

export const CHALET_RATES: RateRow[] = [
  {
    audience: "SADC",
    rack: { single: 250, double: 400 },
    sto: { single: 200, double: 320 },
  },
  {
    audience: "International",
    rack: { single: 360, double: 500 },
    sto: { single: 300, double: 400 },
  },
];

/** Per person per night, all year round. */
export const CAMPING_RATES = [
  { audience: "SADC" as const, rack: 25, sto: 20 },
  { audience: "International" as const, rack: 30, sto: 25 },
];

/** Per person. The STO rate requires a minimum of four people. */
export const TRANSFER_RATES = [
  {
    name: "Savuti transfer",
    sadc: { rack: 170, sto: 130 },
    international: { rack: 220, sto: 180 },
    note: "STO rate applies to a minimum of four people",
  },
];

/** What the nightly rate covers, verbatim from the deck. */
export const RATE_INCLUDES = [
  "Accommodation",
  "Bed levy",
  "All meals",
  "Soft drinks and bottled water",
  "Local beer and spirits",
  "Sundowner",
  "Game drive",
  "Basketry weaving",
  "Village tour",
];

export const RATE_EXCLUDES = [
  "Boat cruise (optional, at extra cost)",
  "Day trip to Victoria Falls (optional, at extra cost)",
  "Park fees",
  "Imported alcohol",
  "VAT",
];

/*
 * Payment and cancellation terms come from /booking-terms, NOT from the rates
 * deck, and that split is deliberate.
 *
 * The deck and the booking-terms page disagreed: the deck set out a staged
 * 20/50/balance schedule at 45, 30 and 15 days, while the page said a deposit
 * secures the booking with the balance due at 30 days. The page was confirmed
 * as the policy actually in force, so the deck's schedule is superseded here.
 *
 * The deck remains the source for rates. Terms live on the page. Anyone
 * tempted to "restore" these from the deck later would be reintroducing a
 * contradiction that reached guests on three surfaces at once, since these
 * strings render on /rates, /faq and /llms.txt.
 */
export const PAYMENT_POLICY = [
  "A deposit is required to secure a confirmed reservation",
  "The balance is due 30 days before arrival, unless your written confirmation states otherwise",
];

/** See the note on PAYMENT_POLICY above: these mirror /booking-terms. */
export const CANCELLATION_POLICY = [
  "30 or more days before arrival: full refund of the deposit",
  "15 to 29 days before arrival: 50% of the deposit refunded",
  "Within 14 days of arrival: the deposit is forfeited",
];

/** Lowest published nightly rate, for "from" pricing. */
export function lowestNightlyRate(): number {
  return Math.min(...CHALET_RATES.flatMap((r) => [r.sto.single, r.rack.single]));
}
