import { createAdminClient } from "@/lib/supabase/server";
import { roomsNeeded } from "./capacity";
import type { BookingRow, EnquiryRow } from "./types";

export interface AdminBooking extends BookingRow {
  /** Package name resolved from the join, or null when none was chosen. */
  package_name: string | null;
  /** Chalets this booking occupies — ceil(guests / 2). */
  chalets: number;
  nights: number;
}

function nightsBetween(checkIn: string, checkOut: string): number {
  return Math.round(
    (new Date(checkOut + "T00:00:00Z").getTime() - new Date(checkIn + "T00:00:00Z").getTime()) /
      86_400_000
  );
}

/**
 * Every booking, newest first, with its package name and chalet count.
 *
 * Service-role read: `bookings` has no public policy because it holds guest
 * contact details, so this must only ever be called from a route that has
 * already checked the admin session.
 */
export async function getAdminBookings(): Promise<{
  bookings: AdminBooking[];
  error: string | null;
}> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("bookings")
      .select("*, packages(name)")
      .order("check_in", { ascending: true });

    if (error) {
      console.error("Admin bookings query failed:", error.message);
      return { bookings: [], error: "Could not load bookings." };
    }

    const bookings = (data ?? []).map((row) => {
      const { packages, ...booking } = row as BookingRow & {
        packages: { name: string } | null;
      };
      return {
        ...booking,
        package_name: packages?.name ?? null,
        chalets: roomsNeeded(booking.guests),
        nights: nightsBetween(booking.check_in, booking.check_out),
      };
    });

    return { bookings, error: null };
  } catch (err) {
    console.error("Admin bookings query threw:", err);
    return { bookings: [], error: "Could not reach the database." };
  }
}

/** Recent website enquiries, newest first. */
export async function getAdminEnquiries(): Promise<{
  enquiries: EnquiryRow[];
  error: string | null;
}> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Admin enquiries query failed:", error.message);
      return { enquiries: [], error: "Could not load enquiries." };
    }
    return { enquiries: (data ?? []) as EnquiryRow[], error: null };
  } catch (err) {
    console.error("Admin enquiries query threw:", err);
    return { enquiries: [], error: "Could not reach the database." };
  }
}
