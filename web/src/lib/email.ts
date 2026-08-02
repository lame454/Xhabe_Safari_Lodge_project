import { Resend } from "resend";
import type { BookingRow } from "@/lib/data/types";
import { CONTACT } from "@/lib/config/contact";

/*
 * TODO: VERIFY A SENDING DOMAIN IN RESEND BEFORE LAUNCH.
 *
 * Resend only sends from a domain you have verified. With RESEND_FROM_EMAIL
 * unset this falls back to Resend's shared onboarding sender, which refuses
 * every recipient except the Resend account owner's own address — confirmed
 * against the live API as knightlame454@gmail.com, which is *not* the test
 * inbox in CONTACT.email. Both the guest confirmation and the lodge
 * notification are currently rejected with a 403.
 *
 * Nothing in the code can work around this; it is an account setting. Verify a
 * domain at resend.com/domains, then set RESEND_FROM_EMAIL to an address on it.
 * Until then, assume no booking or enquiry email reaches anyone.
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

interface Message {
  to: string;
  replyTo: string;
  subject: string;
  html: string;
}

/**
 * Sends one message, reporting whether the provider accepted it.
 *
 * Resend reports rejections by *returning* an `error` rather than throwing —
 * a 403 from an unverified sending domain comes back this way — so both the
 * returned error and a thrown one have to be handled or the failure is
 * invisible. Never throws: a booking that is already saved must not fail the
 * request because its email bounced.
 */
async function send(resend: Resend, label: string, message: Message): Promise<boolean> {
  try {
    const { error } = await resend.emails.send({ from: FROM_ADDRESS, ...message });
    if (error) {
      console.error(`Resend rejected the ${label} to ${message.to}:`, error);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Failed to send the ${label} to ${message.to}:`, err);
    return false;
  }
}

/**
 * Emails a booking to the guest (confirmation) and to the lodge (notification).
 *
 * The two are sent independently and neither gates the other: the lodge finding
 * out that a booking exists is the more important of the two, and must not be
 * lost because the guest's confirmation bounced. Reports each outcome
 * separately so the caller can tell which, if either, got through.
 *
 * No-ops with a warning if RESEND_API_KEY isn't configured, so local
 * development and the request itself never break for want of mail credentials.
 */
export async function sendBookingConfirmationEmail(
  booking: Pick<
    BookingRow,
    "id" | "first_name" | "last_name" | "email" | "check_in" | "check_out" | "guests" | "details"
  >,
  packageName?: string
): Promise<{ guestSent: boolean; lodgeSent: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping booking emails.");
    return { guestSent: false, lodgeSent: false };
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

  const lodgeHtml = `
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
  `;

  const [guestSent, lodgeSent] = await Promise.all([
    send(resend, "guest booking confirmation", {
      to: booking.email,
      replyTo: CONTACT.email,
      subject,
      html,
    }),
    send(resend, "lodge booking notification", {
      to: CONTACT.email,
      replyTo: booking.email,
      subject: `New booking request — ${booking.first_name} ${booking.last_name}, ${formatDate(booking.check_in)}`,
      html: lodgeHtml,
    }),
  ]);

  return { guestSent, lodgeSent };
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

  const sent = await send(new Resend(apiKey), "enquiry notification", {
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

  return { sent };
}
