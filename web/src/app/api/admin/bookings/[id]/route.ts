import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAuthenticated } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/server";

const patchSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled"]),
});

/**
 * PATCH /api/admin/bookings/:id — change a booking's status.
 *
 * Confirming does not alter availability: a pending booking already holds its
 * chalets, which is what stops the last one being sold while the lodge decides.
 * Cancelling is the change that releases them back to the public calendar.
 */
export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  // Every admin route re-checks the session itself. The page being guarded is
  // not enough — these endpoints are reachable directly.
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ error: "Unknown booking." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Status must be pending, confirmed, or cancelled." },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .update({ status: parsed.data.status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Failed to update booking status:", error);

    // Re-confirming a booking re-runs the capacity trigger. If the lodge has
    // since been oversold by other means, that write is refused — report it as
    // a conflict rather than a server fault.
    if (error.code === "23514") {
      return NextResponse.json(
        { error: "Those nights are now full, so this booking cannot be reinstated." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Could not update the booking." }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  return NextResponse.json({ booking: data });
}
