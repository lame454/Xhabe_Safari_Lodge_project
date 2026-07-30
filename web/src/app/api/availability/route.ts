import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAvailabilityCalendar, TOTAL_CHALETS } from "@/lib/data/availability";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format.");

const querySchema = z
  .object({ from: dateSchema, to: dateSchema })
  .refine((q) => q.to >= q.from, { message: "`to` must not be before `from`." })
  .refine(
    // Guard against a hand-crafted URL asking for years of data in one query.
    (q) =>
      (new Date(q.to + "T00:00:00Z").getTime() - new Date(q.from + "T00:00:00Z").getTime()) /
        86_400_000 <=
      400,
    { message: "Range must be 400 days or fewer." }
  );

/**
 * GET /api/availability?from=YYYY-MM-DD&to=YYYY-MM-DD
 *
 * Per-night chalet availability for the booking calendar. Read-only.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const parsed = querySchema.safeParse({
    from: searchParams.get("from") ?? "",
    to: searchParams.get("to") ?? "",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid query parameters." },
      { status: 400 }
    );
  }

  const { days, serviceError } = await getAvailabilityCalendar(parsed.data.from, parsed.data.to);

  if (serviceError) {
    return NextResponse.json(
      { error: "Could not load availability. Please try again." },
      { status: 503 }
    );
  }

  return NextResponse.json({ days, totalChalets: TOTAL_CHALETS });
}
