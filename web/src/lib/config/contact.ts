/*
 * ============================================================================
 * The lodge's contact details — single source of truth.
 * ============================================================================
 * Every contact touchpoint on the site reads from here, so these are the only
 * place the lodge's address, phone or email should ever appear. Do not
 * hardcode them in components or pages.
 *
 * Two things are still pending, both external to this code:
 *
 *   1. reservations@xhabesafari.com has no mailbox yet. The domain carries no
 *      MX record, so mail sent there currently bounces. Set up a mailbox
 *      (Google Workspace, Zoho, or forwarding at the registrar) before
 *      pointing guests at it in print or on social.
 *
 *   2. No Resend sending domain is verified, which is why `alertsEmail` below
 *      exists separately from `email`.
 * ============================================================================
 */

/**
 * The lodge's public contact details.
 *
 * `phoneE164` / `whatsappNumber` are the machine-readable forms — WhatsApp's
 * wa.me links require the full international number with no `+`, spaces, or
 * dashes, so they are stored separately from the display string rather than
 * being stripped at each call site.
 */
export const CONTACT = {
  /**
   * Shown to guests everywhere the site lists an email, and used as the
   * reply-to on guest-facing mail.
   *
   * Pending a mailbox — see note 1 in the header above.
   */
  email: "reservations@xhabesafari.com",

  /**
   * Where new-booking and enquiry alerts are actually delivered.
   *
   * TODO: delete this and route alerts to `email` once a Resend sending
   * domain is verified.
   *
   * It is deliberately the Resend account owner's address, and that coupling
   * is load-bearing: with no verified sending domain, Resend's shared
   * onboarding sender is permitted to deliver to the account owner and nobody
   * else. Pointing this at any other inbox silently loses every alert: the
   * lodge address above would be rejected with a 403, which is exactly what
   * happened the last time it was set to a different mailbox.
   *
   * Guest-facing mail is a separate problem and still undeliverable; only a
   * verified domain fixes that. `emailHealth()` in lib/email.ts reports the
   * current state on the admin dashboard.
   */
  alertsEmail: "knightlame454@gmail.com",

  /** Human-readable phone number, for on-screen text. */
  phoneDisplay: "+267 75 497 183",
  /** E.164 form, for tel: links. */
  phoneE164: "+26775497183",
  /** Digits only, no leading +, for wa.me deep links. */
  whatsappNumber: "26775497183",

  addressLines: [
    "Plot 1504, Muchenje",
    "Chobe Region, Ngoma",
    "Botswana",
  ],
  addressOneLine: "Ngoma Road, Mabele Village, Chobe District, Botswana",
  postalAddress: "P.O. Box 90, Kasane, Botswana",

  responseTime: "We reply within 24 hours",

  social: {
    facebook: "https://facebook.com/xhabesafarilodge",
    instagram: "https://instagram.com/xhabe_safari_lodge",
  },
} as const;

/** `mailto:` href, optionally with a prefilled subject. */
export function mailtoHref(subject?: string): string {
  const base = `mailto:${CONTACT.email}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}

/** `tel:` href in E.164 form. */
export function telHref(): string {
  return `tel:${CONTACT.phoneE164}`;
}

/**
 * WhatsApp click-to-chat deep link.
 *
 * Format is `https://wa.me/<international number, digits only>` with an
 * optional URL-encoded `?text=` prefill — this is WhatsApp's documented
 * universal link and works on web, iOS, and Android.
 */
export function whatsappHref(message?: string): string {
  const base = `https://wa.me/${CONTACT.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
