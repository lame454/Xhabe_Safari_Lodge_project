import { Resend } from "resend";
import type { BookingRow } from "@/lib/data/types";
import { CONTACT } from "@/lib/config/contact";

/*
 * TODO: swap to production sender before launch — see src/lib/config/contact.ts.
 *
 * Resend will only send from a domain you have verified, so the test inbox in
 * CONTACT.email cannot be used as the `from` address. Until the lodge's own
 * domain is verified, RESEND_FROM_EMAIL should be left unset so this falls
 * back to Resend's shared onboarding sender (which delivers to the Resend
 * account owner's address only — enough to test the flow).
 *
 * Replies and the lodge's own booking notifications both go to CONTACT.email,
 * so the test inbox still receives every booking.
 */
const FROM_ADDRESS =
  process.env.RESEND_FROM_EMAIL ?? "Xhabe Safari Lodge <onboarding@resend.dev>";

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
        Xhabe Safari Lodge · ${CONTACT.addressOneLine}<br />
        ${CONTACT.email} · ${CONTACT.phoneDisplay}
      </p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: booking.email,
      replyTo: CONTACT.email,
      subject,
      html,
    });
    if (error) {
      console.error("Resend error sending booking confirmation:", error);
      return { sent: false };
    }
  } catch (err) {
    console.error("Failed to send booking confirmation email:", err);
    return { sent: false };
  }

  // Notify the lodge separately, so a failure to reach the team never affects
  // the guest-facing confirmation that has already gone out.
  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: CONTACT.email,
      replyTo: booking.email,
      subject: `New booking request — ${booking.first_name} ${booking.last_name}, ${formatDate(booking.check_in)}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; color: #2b2620;">
          <h1 style="font-size: 20px;">New booking request</h1>
          <table style="font-size: 14px; line-height: 1.8;">
            <tr><td style="padding-right: 16px; color: #8a7e6d;">Guest</td><td>${booking.first_name} ${booking.last_name}</td></tr>
            <tr><td style="padding-right: 16px; color: #8a7e6d;">Email</td><td>${booking.email}</td></tr>
            <tr><td style="padding-right: 16px; color: #8a7e6d;">Package</td><td>${packageName ?? "Not specified"}</td></tr>
            <tr><td style="padding-right: 16px; color: #8a7e6d;">Check-in</td><td>${formatDate(booking.check_in)}</td></tr>
            <tr><td style="padding-right: 16px; color: #8a7e6d;">Check-out</td><td>${formatDate(booking.check_out)}</td></tr>
            <tr><td style="padding-right: 16px; color: #8a7e6d;">Guests</td><td>${booking.guests}</td></tr>
            <tr><td style="padding-right: 16px; color: #8a7e6d;">Reference</td><td>${booking.id}</td></tr>
          </table>
          ${booking.details ? `<p style="font-size: 14px; line-height: 1.7;"><strong>Requests:</strong> ${booking.details}</p>` : ""}
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send lodge booking notification:", err);
  }

  return { sent: true };
}

/**
 * Notifies the lodge that a website enquiry came in.
 *
 * Best-effort: the enquiry is already persisted by the time this runs, so a
 * mail failure is logged but never surfaced as a request failure.
 */
export async function sendEnquiryNotificationEmail(enquiry: {
  id: string;
  name: string;
  email: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping enquiry notification email.");
    return { sent: false };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: CONTACT.email,
      replyTo: enquiry.email,
      subject: `New website enquiry — ${enquiry.name}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; color: #2b2620;">
          <h1 style="font-size: 20px;">New website enquiry</h1>
          <table style="font-size: 14px; line-height: 1.8;">
            <tr><td style="padding-right: 16px; color: #8a7e6d;">From</td><td>${enquiry.name}</td></tr>
            <tr><td style="padding-right: 16px; color: #8a7e6d;">Email</td><td>${enquiry.email}</td></tr>
            <tr><td style="padding-right: 16px; color: #8a7e6d;">Reference</td><td>${enquiry.id}</td></tr>
          </table>
          <pre style="font-family: inherit; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${enquiry.message}</pre>
        </div>
      `,
    });
    if (error) {
      console.error("Resend error sending enquiry notification:", error);
      return { sent: false };
    }
    return { sent: true };
  } catch (err) {
    console.error("Failed to send enquiry notification email:", err);
    return { sent: false };
  }
}
