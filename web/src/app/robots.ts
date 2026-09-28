import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/config/site";

/*
 * Crawlers are named explicitly rather than relying on the `*` rule alone.
 *
 * A wildcard allow is already permissive, so none of this unblocks anything
 * that was blocked before — it is documentation that happens to be
 * machine-readable. Several of these agents look for their own name first and
 * only fall back to `*`, and an operator reading this file should be able to
 * see which crawlers the lodge has thought about instead of inferring it from
 * an absence.
 *
 * The two groups below do different jobs, and the difference matters if this
 * is ever revisited:
 *
 *   RETRIEVAL — fetch a page at question time to answer and cite it. These are
 *   what put the lodge in front of somebody asking an assistant for a Chobe
 *   lodge, and blocking one removes the lodge from that answer entirely.
 *
 *   TRAINING — collect text for model training. No click and no citation comes
 *   back from these, so the trade is weaker: the upside is that a model may
 *   later know the lodge exists unprompted.
 *
 * They are separated so training access can be withdrawn without also
 * withdrawing from AI search results, which is the mistake a single blanket
 * `Disallow` would make. For a lodge the published content is marketing rather
 * than the product being sold, so both are allowed for now.
 */

/** Fetch pages to answer a live question, and cite the source. */
const RETRIEVAL_CRAWLERS = [
  "Googlebot",
  "Bingbot",           // also feeds Copilot and, in part, ChatGPT search
  "OAI-SearchBot",     // ChatGPT search index
  "ChatGPT-User",      // ChatGPT following a link on a user's behalf
  "PerplexityBot",     // Perplexity index
  "Perplexity-User",   // Perplexity following a link on a user's behalf
  "Claude-SearchBot",  // Claude search index
  "Claude-User",       // Claude following a link on a user's behalf
  "Applebot",          // Siri and Spotlight
  "DuckDuckBot",
  "Amazonbot",         // Alexa
  "YandexBot",
  "Slurp",             // Yahoo
];

/** Collect text for model training. No citation or click comes back. */
const TRAINING_CRAWLERS = [
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",             // Common Crawl, which many other datasets derive from
  "Meta-ExternalAgent",
];

/*
 * Kept out of search results.
 *
 * /admin is password-gated, but an indexed login page is an invitation to
 * guess at it. /api returns JSON that is useless as a search result and, in
 * the case of the admin routes, should never be fetched by a stranger at all.
 *
 * This is not a security control: robots.txt is a request, and a hostile
 * crawler ignores it. The gate in lib/admin/auth.ts is the actual control.
 */
const DISALLOW = ["/admin", "/admin/", "/api/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      ...[...RETRIEVAL_CRAWLERS, ...TRAINING_CRAWLERS].map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl(),
  };
}
