import { CONTACT } from "@/lib/config/contact";

/**
 * The wording the lodge sends a guest when a booking is approved or declined.
 *
 * Both channels — email and the pre-filled WhatsApp link — are built from the
 * same functions here, so a guest reached by WhatsApp is told exactly what a
 * guest reached by email is told. Keep this module free of server-only imports:
 * the admin UI builds the WhatsApp link in the browser.
 */

export interface GuestMessageBooking {
  first_name: string;
  last_name: string;
  check_in: string;
  check_out: string;
  guests: number;
  phone: string | null;
  package_name?: string | null;
}

export type Decision = "confirmed" | "cancelled";

function formatDate(value: string): string {
  return new Date(value + "T00:00:00Z").toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function nights(checkIn: string, checkOut: string): number {
  return Math.round(
    (new Date(checkOut + "T00:00:00Z").getTime() - new Date(checkIn + "T00:00:00Z").getTime()) /
      86_400_000
  );
}

export function decisionSubject(decision: Decision, booking: GuestMessageBooking): string {
  return decision === "confirmed"
    ? `Your stay is confirmed — Xhabe Safari Lodge, ${formatDate(booking.check_in)}`
    : `About your booking request — Xhabe Safari Lodge`;
}

/**
 * Plain-text version, used for the WhatsApp deep link.
 *
 * `note` is the optional line the lodge types in the admin panel — a reason for
 * declining, or a detail worth flagging on a confirmation.
 */
export function decisionPlainText(
  decision: Decision,
  booking: GuestMessageBooking,
  note?: string
): string {
  const stay = `${formatDate(booking.check_in)} to ${formatDate(booking.check_out)}`;
  const nightCount = nights(booking.check_in, booking.check_out);
  const personalNote = note?.trim() ? `\n${note.trim()}\n` : "";

  if (decision === "confirmed") {
    return [
      `Hello ${booking.first_name},`,
      ``,
      `Good news — your stay at Xhabe Safari Lodge is confirmed.`,
      ``,
      `${stay}`,
      `${nightCount} ${nightCount === 1 ? "night" : "nights"} · ${booking.guests} ${booking.guests === 1 ? "guest" : "guests"}`,
      booking.package_name ? `Package: ${booking.package_name}` : null,
      personalNote,
      `If you have any special requests — dietary needs, arrival time, transfers, anything at all — just reply to this message and we'll take care of it.`,
      ``,
      `We look forward to hosting you.`,
      ``,
      `Xhabe Safari Lodge`,
      `${CONTACT.phoneDisplay} · ${CONTACT.email}`,
    ]
      .filter((line) => line !== null)
      .join("\n");
  }

  return [
    `Hello ${booking.first_name},`,
    ``,
    `Thank you for your booking request at Xhabe Safari Lodge for ${stay}.`,
    ``,
    `Unfortunately we aren't able to confirm those dates.`,
    personalNote,
    `We would still love to host you. Reply with some alternative dates and we'll check availability for you straight away — or with any questions you have about the lodge.`,
    ``,
    `Xhabe Safari Lodge`,
    `${CONTACT.phoneDisplay} · ${CONTACT.email}`,
  ].join("\n");
}

/**
 * Best-effort conversion of a guest-typed phone number into the digits-only
 * international form wa.me requires.
 *
 * Guests type all sorts of things, so this handles the common shapes and gives
 * up rather than guessing wildly. The admin UI shows the resolved number next
 * to the button so staff can sanity-check it before sending.
 */
export function toWhatsappNumber(raw: string | null): string | null {
  if (!raw) return null;

  const trimmed = raw.trim();
  let digits = trimmed.replace(/\D/g, "");
  if (!digits) return null;

  if (trimmed.startsWith("+")) {
    // Already international.
  } else if (digits.startsWith("00")) {
    digits = digits.slice(2);
  } else if (digits.startsWith("0")) {
    // National format — assume Botswana, the lodge's own country.
    digits = `267${digits.slice(1)}`;
  } else if (digits.length <= 8) {
    // A bare local subscriber number, same assumption.
    digits = `267${digits}`;
  }

  // Shortest plausible international number is ~8 digits, longest is 15 (E.164).
  if (digits.length < 8 || digits.length > 15) return null;
  return digits;
}

/** Pre-filled wa.me link that opens WhatsApp with the message ready to send. */
export function guestWhatsappHref(
  decision: Decision,
  booking: GuestMessageBooking,
  note?: string
): string | null {
  const number = toWhatsappNumber(booking.phone);
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(decisionPlainText(decision, booking, note))}`;
}
