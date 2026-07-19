import { Resend } from "resend";
import type { BookingRow } from "@/lib/data/types";

const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL ?? "Xhabe Safari Lodge <reservations@xhabesafarilodge.com>";

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Sends a booking-request confirmation email to the guest.
 * Silently no-ops (logging a warning) if RESEND_API_KEY isn't configured,
 * so local/dev environments and the request flow itself never break
 * because of missing email credentials.
 */
export async function sendBookingConfirmationEmail(
  booking: Pick<
    BookingRow,
    "id" | "first_name" | "last_name" | "email" | "check_in" | "check_out" | "guests" | "details"
  >,
  packageName?: string
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping booking confirmation email.");
    return { sent: false };
  }

  const resend = new Resend(apiKey);

  const subject = "We've received your booking request — Xhabe Safari Lodge";
  const html = `
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #2b2620;">
      <h1 style="font-size: 22px; letter-spacing: 0.05em;">Thank you, ${booking.first_name}.</h1>
      <p style="font-size: 14px; line-height: 1.7;">
        We've received your booking request for Xhabe Safari Lodge. Our team will confirm final
        availability and send you a personalised quote within 24 hours.
      </p>
      <table style="font-size: 14px; line-height: 1.8; margin: 24px 0;">
        <tr><td style="padding-right: 16px; color: #8a7e6d;">Package</td><td>${packageName ?? "To be confirmed"}</td></tr>
        <tr><td style="padding-right: 16px; color: #8a7e6d;">Check-in</td><td>${formatDate(booking.check_in)}</td></tr>
        <tr><td style="padding-right: 16px; color: #8a7e6d;">Check-out</td><td>${formatDate(booking.check_out)}</td></tr>
        <tr><td style="padding-right: 16px; color: #8a7e6d;">Guests</td><td>${booking.guests}</td></tr>
        <tr><td style="padding-right: 16px; color: #8a7e6d;">Reference</td><td>${booking.id}</td></tr>
      </table>
      <p style="font-size: 14px; line-height: 1.7;">
        If any of the above needs to change, just reply to this email — a member of the Xhabe
        team will personally get back to you.
      </p>
      <p style="font-size: 12px; color: #8a7e6d; margin-top: 32px;">
        Xhabe Safari Lodge · Ngoma Road, Mabele Village, Chobe District, Botswana
      </p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: booking.email,
      subject,
      html,
    });
    if (error) {
      console.error("Resend error sending booking confirmation:", error);
      return { sent: false };
    }
    return { sent: true };
  } catch (err) {
    console.error("Failed to send booking confirmation email:", err);
    return { sent: false };
  }
}
