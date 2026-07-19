import { createAdminClient } from "@/lib/supabase/server";

/** Xhabe has 8 luxury tented chalets, max 2 adults per chalet. */
export const TOTAL_CHALETS = 8;
export const MAX_ADULTS_PER_CHALET = 2;

export function roomsNeeded(guests: number): number {
  return Math.max(1, Math.ceil(guests / MAX_ADULTS_PER_CHALET));
}

/** All calendar dates from checkIn (inclusive) to checkOut (exclusive) — i.e. the nights stayed. */
function nightsInRange(checkIn: string, checkOut: string): string[] {
  const dates: string[] = [];
  const start = new Date(checkIn + "T00:00:00Z");
  const end = new Date(checkOut + "T00:00:00Z");
  for (let d = new Date(start); d < end; d.setUTCDate(d.getUTCDate() + 1)) {
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export interface AvailabilityResult {
  available: boolean;
  roomsRemaining: number;
  reason?: string;
}

/**
 * Checks whether `guests` can be accommodated for every night between
 * checkIn (inclusive) and checkOut (exclusive).
 *
 * Capacity per date = the `availability` table override if one exists for
 * that date, otherwise TOTAL_CHALETS. That capacity is reduced by chalets
 * already committed to overlapping, non-cancelled bookings.
 */
export async function checkAvailability(
  checkIn: string,
  checkOut: string,
  guests: number
): Promise<AvailabilityResult> {
  const nights = nightsInRange(checkIn, checkOut);
  if (nights.length === 0) {
    return { available: false, roomsRemaining: 0, reason: "Check-out must be after check-in." };
  }

  const needed = roomsNeeded(guests);
  const supabase = await createAdminClient();

  // Per-date capacity overrides.
  const { data: availabilityRows } = await supabase
    .from("availability")
    .select("date, rooms_available")
    .in("date", nights);

  const overrideByDate = new Map<string, number>(
    (availabilityRows ?? []).map((row) => [row.date as string, row.rooms_available as number])
  );

  // All non-cancelled bookings that could overlap this range.
  const { data: overlapping, error } = await supabase
    .from("bookings")
    .select("check_in, check_out, guests")
    .neq("status", "cancelled")
    .lt("check_in", checkOut)
    .gt("check_out", checkIn);

  if (error) {
    return { available: false, roomsRemaining: 0, reason: "Could not verify availability. Please try again." };
  }

  let minRemaining = Infinity;
  for (const night of nights) {
    const capacity = overrideByDate.get(night) ?? TOTAL_CHALETS;
    const bookedRooms = (overlapping ?? [])
      .filter((b) => b.check_in <= night && night < b.check_out)
      .reduce((sum, b) => sum + roomsNeeded(b.guests as number), 0);
    const remaining = capacity - bookedRooms;
    minRemaining = Math.min(minRemaining, remaining);
  }

  return {
    available: minRemaining >= needed,
    roomsRemaining: Math.max(0, minRemaining),
    reason: minRemaining < needed ? "No chalets available for the full duration of that stay." : undefined,
  };
}
