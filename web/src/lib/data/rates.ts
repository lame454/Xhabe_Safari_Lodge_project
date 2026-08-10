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

export const PAYMENT_POLICY = [
  "20% deposit to confirm, 45 days before arrival",
  "50% payment 30 days before arrival",
  "Balance settled 15 days before arrival",
];

export const CANCELLATION_POLICY = [
  "Cancel within 24 hours of the first payment — full refund, less bank fees",
  "Cancel after 24 hours — 50% refunded, for the following 15 days",
  "After that 15-day window — no refund",
];

/** Lowest published nightly rate, for "from" pricing. */
export function lowestNightlyRate(): number {
  return Math.min(...CHALET_RATES.flatMap((r) => [r.sto.single, r.rack.single]));
}
