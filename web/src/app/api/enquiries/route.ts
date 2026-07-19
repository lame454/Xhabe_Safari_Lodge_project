import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";

const enquirySchema = z.object({
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  packageInterest: z.string().trim().optional(),
  guests: z.coerce.number().int().min(1).max(50).optional().or(z.literal("")).optional(),
  arrival: z.string().trim().optional(),
  departure: z.string().trim().optional(),
  message: z.string().trim().optional(),
  // Honeypot field — real users never fill this in.
  botField: z.string().trim().max(0, "Spam detected.").optional(),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid enquiry details." },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const parts = [
    data.packageInterest ? `Package: ${data.packageInterest}` : null,
    data.guests ? `Guests: ${data.guests}` : null,
    data.arrival ? `Preferred arrival: ${data.arrival}` : null,
    data.departure ? `Preferred departure: ${data.departure}` : null,
    data.message ? `\n${data.message}` : null,
  ].filter(Boolean);

  const supabase = await createAdminClient();
  const { data: inserted, error } = await supabase
    .from("enquiries")
    .insert({
      name: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      message: parts.join("\n") || "(no additional details provided)",
    })
    .select()
    .single();

  if (error || !inserted) {
    console.error("Failed to insert enquiry:", error);
    return NextResponse.json({ error: "Could not send your enquiry. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ enquiry: inserted }, { status: 201 });
}
