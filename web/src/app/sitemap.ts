import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config/site";
import { GUIDES } from "@/lib/data/guides";

/*
 * Routes worth indexing, with the priority the lodge actually assigns them.
 *
 * `priority` is a hint about relative importance within this site only; it
 * says nothing to a search engine about how this site compares to any other.
 * The useful job it does is telling a crawler which pages to revisit first,
 * so the booking and rates pages outrank the legal boilerplate.
 */
const ROUTES = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/book", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/rates", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/faq", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/guides", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/accommodation", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/activities", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/gallery", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/reviews", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/booking-terms", priority: 0.3, changeFrequency: "yearly" as const },
];

/*
 * When the site's content was last genuinely revised.
 *
 * Deliberately a constant rather than `new Date()`. Stamping every route with
 * the build time tells crawlers that all twelve pages changed on every deploy,
 * including deploys that only touched a dependency. Once a site has cried wolf
 * a few times the signal is discounted and a real content change stops earning
 * a re-crawl, which is the opposite of what a sitemap is for.
 *
 * Move this when the content actually changes.
 */
const CONTENT_UPDATED = new Date("2026-09-28T00:00:00Z");

/*
 * Guides are appended rather than listed by hand, so adding one to
 * lib/data/guides.ts publishes it. A guide that exists but is missing from the
 * sitemap is the quiet failure this avoids: it renders perfectly for anybody
 * given the link and is invisible to everybody else.
 */
const GUIDE_ROUTES = GUIDES.map((guide) => ({
  path: `/guides/${guide.slug}`,
  priority: 0.6,
  changeFrequency: "monthly" as const,
}));

export default function sitemap(): MetadataRoute.Sitemap {
  return [...ROUTES, ...GUIDE_ROUTES].map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: CONTENT_UPDATED,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
