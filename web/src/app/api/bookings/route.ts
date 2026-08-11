import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { checkAvailability } from "@/lib/data/availability";
import { MAX_GUESTS } from "@/lib/data/capacity";
import { sendBookingConfirmationEmail } from "@/lib/email";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format.");

/**
 * Party size, bounded by what the lodge can actually sleep.
 *
 * Derived from the capacity constants rather than written out, because a
 * hardcoded ceiling here silently turned away the full-lodge bookings the form
 * was happy to offer.
 */
const guestsSchema = z.coerce
  .number()
  .int()
  .min(1)
  .max(MAX_GUESTS, `We can sleep up to ${MAX_GUESTS} guests — please get in touch for a larger party.`);

function isPastDate(date: string) {
  return date < new Date().toISOString().slice(0, 10);
}

const bookingSchema = z
  .object({
    checkIn: dateSchema,
    checkOut: dateSchema,
    guests: guestsSchema,
    packageId: z.string().uuid().optional().or(z.literal("")).optional(),
    firstName: z.string().trim().min(1, "First name is required."),
    lastName: z.string().trim().min(1, "Last name is required."),
    email: z.string().trim().email("Enter a valid email address."),
    phone: z.string().trim().optional(),
    details: z.string().trim().optional(),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out must be after check-in.",
    path: ["checkOut"],
  });

/**
 * GET /api/bookings?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&guests=2
 * Availability check only — does not create a booking.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const guests = Number(searchParams.get("guests") ?? "1");

  const parsed = z
    .object({ checkIn: dateSchema, checkOut: dateSchema, guests: guestsSchema })
    .refine((d) => d.checkOut > d.checkIn, { message: "Check-out must be after check-in." })
    .safeParse({ checkIn, checkOut, guests });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid query parameters." },
      { status: 400 }
    );
  }

  const result = await checkAvailability(checkIn, checkOut, guests);
  return NextResponse.json(result, { status: result.serviceError ? 503 : 200 });
}

/**
 * POST /api/bookings
 * Re-checks availability, inserts the booking (service role, bypassing RLS),
 * and sends a confirmation email via Resend.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid booking details." },
      { status: 400 }
    );
  }
  const data = parsed.data;
  if (isPastDate(data.checkIn)) {
    return NextResponse.json({ error: "Check-in must be today or later." }, { status: 400 });
  }

  const availability = await checkAvailability(data.checkIn, data.checkOut, data.guests);
  if (availability.serviceError) {
    return NextResponse.json({ error: availability.reason }, { status: 503 });
  }
  if (!availability.available) {
    return NextResponse.json(
      { error: availability.reason ?? "No chalets available for those dates." },
      { status: 409 }
    );
  }

  const supabase = createAdminClient();

  const { data: inserted, error } = await supabase
    .from("bookings")
    .insert({
      check_in: data.checkIn,
      check_out: data.checkOut,
      guests: data.guests,
      package_id: data.packageId || null,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone || null,
      details: data.details || null,
      status: "pending",
    })
    .select()
    .single();

  if (error || !inserted) {
    console.error("Failed to insert booking:", error);

    // The `bookings_capacity_guard` trigger raises a check_violation when the
    // stay would oversell the lodge. That happens when another booking landed
    // between the availability check above and this insert, so it's a genuine
    // conflict rather than a server fault — report it as one.
    if (error?.code === "23514") {
      return NextResponse.json(
        {
          error:
            "Those dates were just taken while you were filling in the form. " +
            "Please re-check availability and try again.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: "Could not save your booking. Please try again." }, { status: 500 });
  }

  let packageName: string | undefined;
  if (data.packageId) {
    const { data: pkg } = await supabase
      .from("packages")
      .select("name")
      .eq("id", data.packageId)
      .maybeSingle();
    packageName = pkg?.name;
  }

  // The booking is already saved; email is best-effort. Both outcomes are
  // reported rather than collapsed into one flag, because a guest confirmation
  // that bounced and a lodge notification that never arrived are different
  // problems — the second means nobody knows the booking exists.
  const { guest, lodge } = await sendBookingConfirmationEmail(inserted, packageName);

  // Worth its own line at error level: a request nobody was told about is
  // otherwise indistinguishable in the logs from a successful one, and it sits
  // in the admin queue until somebody happens to look.
  if (!lodge.sent) {
    console.error(
      `Booking ${inserted.id} saved but the lodge was NOT notified: ${lodge.reason}`
    );
  }

  // Only booleans go back to the browser. The reasons name environment
  // variables and account settings, which is staff-facing detail — the admin
  // page shows those to an authenticated user instead.
  return NextResponse.json(
    {
      booking: inserted,
      emailSent: guest.sent,
      lodgeNotified: lodge.sent,
    },
    { status: 201 }
  );
}
