import { createAdminClient, createPublicClient } from "@/lib/supabase/server";
import { MAX_ADULTS_PER_CHALET, TOTAL_CHALETS, roomsNeeded } from "./capacity";

// Re-exported for existing server-side callers. Client components must import
// these from "./capacity" directly — this module reaches for the service-role
// Supabase client and cannot be bundled for the browser.
export { MAX_ADULTS_PER_CHALET, TOTAL_CHALETS, roomsNeeded };

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

/** Inclusive list of dates from `from` to `to`. */
function datesInclusive(from: string, to: string): string[] {
  const dates: string[] = [];
  const end = new Date(to + "T00:00:00Z");
  for (let d = new Date(from + "T00:00:00Z"); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export interface DayAvailability {
  date: string;
  /** Chalets released for this night — the override, or TOTAL_CHALETS. */
  capacity: number;
  /** Chalets still free after committed bookings. */
  roomsRemaining: number;
}

/**
 * Per-night capacity across a date window, for the booking calendar.
 *
 * Returns one entry per calendar day so the UI can distinguish fully booked
 * (`roomsRemaining === 0`) from partially booked (some chalets gone, others
 * free) — the two look different on the calendar.
 *
 * Delegates to the `availability_calendar` RPC, which aggregates `bookings`
 * inside the database and returns counts only. That keeps guest data out of the
 * response and means the public calendar works with the publishable key alone —
 * the service role key is only needed to write bookings. See
 * supabase/migrations/20260730140000_availability_calendar_rpc.sql.
 */
export async function getAvailabilityCalendar(
  from: string,
  to: string
): Promise<{ days: DayAvailability[]; serviceError: boolean }> {
  if (datesInclusive(from, to).length === 0) return { days: [], serviceError: false };

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.rpc("availability_calendar", {
      from_date: from,
      to_date: to,
    });

    if (error) {
      console.error("Availability calendar RPC failed:", error.message);
      return { days: [], serviceError: true };
    }

    const days = (data ?? []).map(
      (row: { date: string; capacity: number; rooms_remaining: number }) => ({
        date: row.date,
        capacity: row.capacity,
        roomsRemaining: row.rooms_remaining,
      })
    );

    return { days, serviceError: false };
  } catch (err) {
    console.error("Availability calendar RPC threw:", err);
    return { days: [], serviceError: true };
  }
}

export interface AvailabilityResult {
  available: boolean;
  roomsRemaining: number;
  reason?: string;
  serviceError?: boolean;
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

  try {
    const supabase = createAdminClient();

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
      return { available: false, roomsRemaining: 0, reason: "Could not verify availability. Please try again.", serviceError: true };
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
  } catch {
    return { available: false, roomsRemaining: 0, reason: "Availability is temporarily unavailable. Please contact us directly.", serviceError: true };
  }
}
