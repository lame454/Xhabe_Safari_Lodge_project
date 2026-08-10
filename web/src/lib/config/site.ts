/**
 * The site's canonical origin.
 *
 * Used for canonical URLs, Open Graph image URLs, the sitemap and robots.txt.
 * Getting it wrong is quiet but damaging: search engines are told the content
 * lives somewhere it doesn't, and social previews fetch images from a host
 * that may not serve them.
 *
 * The lodge moved to xhabesafari.com; the previous xhabesafarilodge.com was
 * hardcoded in three separate files and is no longer where this site lives.
 *
 * Override with NEXT_PUBLIC_SITE_URL for preview deployments, so a Vercel
 * preview does not advertise itself as the production site.
 */
const FALLBACK_ORIGIN = "https://xhabesafari.com";

function normalise(value: string): string {
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withScheme.replace(/\/+$/, "");
}

export const SITE_URL = normalise(
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || FALLBACK_ORIGIN
);

/** Absolute URL for a path, for metadata that cannot use a relative one. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
