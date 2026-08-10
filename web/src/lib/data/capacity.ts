/**
 * Lodge capacity constants and pure helpers.
 *
 * Kept in its own module with no imports so client components (the booking
 * form, the calendar) can use them without dragging the server-only Supabase
 * client — and therefore `next/headers` — into the browser bundle.
 *
 * Mirrored in the database by `total_chalets()`, `max_adults_per_chalet()`, and
 * `rooms_needed()` — see web/supabase/SCHEMA.md. Change both together.
 */

/**
 * Xhabe has 9 luxury tented chalets sleeping 18 guests.
 *
 * The lodge's 2028 rates deck states "chalets x 9" and "a total of 18 guests",
 * which agree at two adults per chalet. A stray "8 rooms" line in the same
 * section contradicts both and is treated as stale text.
 */
export const TOTAL_CHALETS = 9;

/** Maximum 2 adults per chalet. */
export const MAX_ADULTS_PER_CHALET = 2;

/** Chalets required to sleep `guests` people. */
export function roomsNeeded(guests: number): number {
  return Math.max(1, Math.ceil(guests / MAX_ADULTS_PER_CHALET));
}
