import { Resend } from "resend";
import type { BookingRow } from "@/lib/data/types";
import { CONTACT } from "@/lib/config/contact";
import {
  decisionPlainText,
  decisionSubject,
  type Decision,
  type GuestMessageBooking,
} from "@/lib/admin/guestMessage";

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
 * Until then, use RESEND_REDIRECT_TO below to review what would have been sent.
 *
 * `emailHealth()` reports this state so the lodge is told on the admin page,
 * rather than finding out one silently undelivered booking at a time.
 */

/** Resend's shared sandbox sender — deliverable to the account owner only. */
const SANDBOX_SENDER = "onboarding@resend.dev";

const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL ?? `Xhabe Safari Lodge <${SANDBOX_SENDER}>`;

/*
 * Development catch-all.
 *
 * While no sending domain is verified, the only address Resend will accept is
 * the account owner's — which makes the real templates impossible to review,
 * because a guest confirmation is by definition addressed to somebody else.
 * Setting RESEND_REDIRECT_TO to that allowed address delivers every message
 * there instead, tagged with its intended recipient, so all of them can be read
 * end to end.
 *
 * Leave unset in production: it silently reroutes guest mail.
 */
const REDIRECT_TO = process.env.RESEND_REDIRECT_TO?.trim() || null;

export interface EmailHealth {
  /** Whether a guest can be expected to actually receive what we send them. */
  canReachGuests: boolean;
  /** What is stopping delivery, in a sentence staff can act on. Null when fine. */
  problem: string | null;
  /** The fix for `problem`. Null when there is nothing to fix. */
  remedy: string | null;
}

/**
 * Whether outgoing mail is configured well enough to reach a guest.
 *
 * Both failure modes below are silent at the point of sending — the booking
 * still saves, the status still changes, and only a log line records that
 * nobody was told. Checking the configuration up front means the lodge can be
 * warned while the inbox is still empty, instead of inferring it from guests
 * who never reply.
 *
 * Deliberately conservative: a custom sending domain is assumed to work, and
 * if it does not, `send()` logs whatever Resend says about it. What can be
 * known for certain from the environment alone is reported here.
 */
export function emailHealth(): EmailHealth {
  if (!process.env.RESEND_API_KEY) {
    return {
      canReachGuests: false,
      problem: "No email is being sent at all — Resend has no API key in this environment.",
      remedy:
        "Add RESEND_API_KEY to the site's environment variables (Vercel → Settings → " +
        "Environment Variables), then redeploy.",
    };
  }

  if (FROM_ADDRESS.includes(SANDBOX_SENDER)) {
    return {
      canReachGuests: false,
      problem:
        "Emails to guests are being rejected by Resend. The lodge has no verified sending " +
        "domain, so mail is going out from Resend's shared test address, which is only " +
        "allowed to deliver to the Resend account owner's own inbox.",
      remedy:
        "Verify the lodge's domain at resend.com/domains, then set RESEND_FROM_EMAIL to an " +
        "address on it (for example reservations@xhabesafari.com) and redeploy.",
    };
  }

  if (REDIRECT_TO) {
    return {
      canReachGuests: false,
      problem: `Guest mail is being diverted to ${REDIRECT_TO} instead of reaching guests.`,
      remedy: "Remove RESEND_REDIRECT_TO from the environment and redeploy.",
    };
  }

  return { canReachGuests: true, problem: null, remedy: null };
}

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

export interface SendResult {
  sent: boolean;
  /** Why it was refused, phrased for a member of staff. Null when it went out. */
  reason: string | null;
}

/** The outcome when we never even tried, because nothing is configured. */
function notAttempted(): SendResult {
  const { problem } = emailHealth();
  return { sent: false, reason: problem ?? "Email is not configured." };
}

/**
 * Sends one message, reporting whether the provider accepted it and, when it
 * did not, why.
 *
 * Resend reports rejections by *returning* an `error` rather than throwing —
 * a 403 from an unverified sending domain comes back this way — so both the
 * returned error and a thrown one have to be handled or the failure is
 * invisible. Never throws: a booking that is already saved must not fail the
 * request because its email bounced.
 */
async function send(resend: Resend, label: string, message: Message): Promise<SendResult> {
  // Keep the intended recipient visible in the redirected copy, so a mailbox
  // holding several of these can still tell the guest confirmation apart from
  // the lodge notification.
  const delivery = REDIRECT_TO
    ? {
        to: REDIRECT_TO,
        subject: `[to: ${message.to}] ${message.subject}`,
        html:
          `<p style="font-family: system-ui, sans-serif; font-size: 12px; color: #8a7e6d; ` +
          `border-left: 3px solid #d97706; padding: 8px 12px; margin: 0 0 20px;">` +
          `Redirected by RESEND_REDIRECT_TO. In production this ${label} would go to ` +
          `<strong>${message.to}</strong>.</p>` +
          message.html,
      }
    : {};

  if (REDIRECT_TO) {
    console.warn(`Redirecting ${label} for ${message.to} to ${REDIRECT_TO}.`);
  }

  const recipient = REDIRECT_TO ?? message.to;

  try {
    const { error } = await resend.emails.send({ from: FROM_ADDRESS, ...message, ...delivery });
    if (error) {
      console.error(`Resend rejected the ${label} to ${recipient}:`, error);

      // A rejection while on the sandbox sender is almost always the sandbox
      // itself, whatever Resend's wording. Say so on the same line as the
      // error, so the log points at the fix instead of just the symptom.
      const { problem, remedy } = emailHealth();
      if (problem) console.error(`  ↳ ${problem} ${remedy}`);

      return { sent: false, reason: problem ?? error.message };
    }
    return { sent: true, reason: null };
  } catch (err) {
    console.error(`Failed to send the ${label} to ${recipient}:`, err);
    return {
      sent: false,
      reason: "The email service could not be reached. Please tell the guest another way.",
    };
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
): Promise<{ guest: SendResult; lodge: SendResult }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping booking emails.");
    return { guest: notAttempted(), lodge: notAttempted() };
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

  const [guest, lodge] = await Promise.all([
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

  return { guest, lodge };
}

/**
 * Tells a guest their booking was approved or declined.
 *
 * Sent when the lodge presses Confirm or Decline in the admin area. `note` is
 * the optional line staff typed alongside the decision. Reply-to is the lodge,
 * so a guest answering with special requests or questions reaches a person.
 */
export async function sendBookingDecisionEmail(
  booking: GuestMessageBooking & { email: string },
  decision: Decision,
  note?: string
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping booking decision email.");
    return notAttempted();
  }

  const heading =
    decision === "confirmed" ? "Your stay is confirmed" : "About your booking request";

  // Built from the same text the WhatsApp link uses, so both channels say the
  // same thing; only the presentation differs.
  const paragraphs = decisionPlainText(decision, booking, note)
    .split("\n\n")
    .map(
      (block) =>
        `<p style="font-size: 14px; line-height: 1.7; margin: 0 0 16px;">${block
          .split("\n")
          .join("<br />")}</p>`
    )
    .join("");

  return send(new Resend(apiKey), `guest ${decision} notice`, {
    to: booking.email,
    replyTo: CONTACT.email,
    subject: decisionSubject(decision, booking),
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #2b2620;">
        <h1 style="font-size: 22px; letter-spacing: 0.05em; margin: 0 0 20px;">${heading}</h1>
        ${paragraphs}
        <p style="font-size: 12px; color: #8a7e6d; margin-top: 32px;">
          Xhabe Safari Lodge · ${CONTACT.addressOneLine}
        </p>
      </div>
    `,
  });
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
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping enquiry notification email.");
    return notAttempted();
  }

  return send(new Resend(apiKey), "enquiry notification", {
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
}
