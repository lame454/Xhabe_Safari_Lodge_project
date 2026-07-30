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

/** Xhabe has 8 luxury tented chalets. */
export const TOTAL_CHALETS = 8;

/** Maximum 2 adults per chalet. */
export const MAX_ADULTS_PER_CHALET = 2;

/** Chalets required to sleep `guests` people. */
export function roomsNeeded(guests: number): number {
  return Math.max(1, Math.ceil(guests / MAX_ADULTS_PER_CHALET));
}
