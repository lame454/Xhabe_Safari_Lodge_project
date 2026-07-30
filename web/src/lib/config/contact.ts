/*
 * ============================================================================
 * TODO: SWAP TO PRODUCTION CONTACT DETAILS BEFORE LAUNCH
 * ============================================================================
 * The email address and phone number below are TEMPORARY TEST CREDENTIALS.
 * They exist so booking/enquiry automation and QA can be run end-to-end
 * against a real inbox and a real WhatsApp number without reaching the
 * lodge's actual guests or staff.
 *
 * Production values to restore at go-live:
 *   email        reservations@xhabesafarilodge.com
 *   phone        +267 75 497 183   (wa.me/26775497183)
 *
 * Every contact touchpoint on the site reads from this file, so switching
 * back to production is a single edit here — do not hardcode contact
 * details in components or pages.
 * ============================================================================
 */

/** Flips to false once the production details above are restored. */
export const IS_TEST_CONTACT_CONFIG = true;

/**
 * The lodge's single source of truth for contact details.
 *
 * `phoneE164` / `whatsappNumber` are the machine-readable forms — WhatsApp's
 * wa.me links require the full international number with no `+`, spaces, or
 * dashes, so they are stored separately from the display string rather than
 * being stripped at each call site.
 */
export const CONTACT = {
  /** TEST inbox — see TODO above. */
  email: "vambulame5@gmail.com",

  /** Human-readable phone number, for on-screen text. */
  phoneDisplay: "+267 72 109 942",
  /** E.164 form, for tel: links. */
  phoneE164: "+26772109942",
  /** Digits only, no leading +, for wa.me deep links. */
  whatsappNumber: "26772109942",

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
    instagram: "https://instagram.com/xhabesafarilodge",
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
