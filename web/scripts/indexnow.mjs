#!/usr/bin/env node
/*
 * Submit this site's URLs to IndexNow.
 *
 * IndexNow is a push protocol: instead of waiting for a crawler to come back
 * and notice a change, the site tells the search engines a URL changed and
 * they fetch it. Bing, Yandex, Seznam and Naver share one endpoint, so a
 * single call reaches all of them. Google does not participate.
 *
 * Bing is the reason this is worth doing for a lodge that nobody links to yet.
 * A brand-new domain can wait weeks for a first organic crawl, and Bing's
 * index is what Copilot reads and what part of ChatGPT search reads, so being
 * absent from it means being absent from those answers entirely.
 *
 * ---------------------------------------------------------------------------
 * The original plan called for enabling Crawler Hints in the Cloudflare
 * dashboard, which is Cloudflare's managed wrapper around this same protocol.
 * That option does not exist here: the site is served by Vercel, and there is
 * no Cloudflare in front of it. This script is the same mechanism done
 * directly, which is all Crawler Hints would have been doing on our behalf.
 * ---------------------------------------------------------------------------
 *
 * Usage, from web/:
 *
 *   npm run indexnow             submit every URL in the live sitemap
 *   npm run indexnow -- --dry    show what would be submitted, send nothing
 *   npm run indexnow -- /faq /rates    submit only these paths
 *
 * The key file must already be live at the site root, so deploy before the
 * first run. A submission whose key file 404s is rejected with 403.
 */

const KEY = process.env.INDEXNOW_KEY ?? "4283eaf73ea1b75d0cd033ccafd9a706";
const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://xhabesafari.com")
  .replace(/\/+$/, "");
const ENDPOINT = "https://api.indexnow.org/indexnow";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry");
const explicitPaths = args.filter((a) => a.startsWith("/"));

/** Pull <loc> values out of the live sitemap. */
async function urlsFromSitemap() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) {
    throw new Error(
      `Could not read ${SITE}/sitemap.xml (HTTP ${res.status}). ` +
        `Deploy first, or pass paths explicitly.`
    );
  }
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (urls.length === 0) throw new Error("Sitemap contained no <loc> entries.");
  return urls;
}

/*
 * Confirm the key file is actually reachable before submitting.
 *
 * Worth the extra request: IndexNow answers a bad key with a 403 that says
 * nothing about which of the several possible causes applied, and the failure
 * is otherwise invisible because nothing about the site looks broken.
 */
async function assertKeyIsLive() {
  const keyUrl = `${SITE}/${KEY}.txt`;
  const res = await fetch(keyUrl);
  if (!res.ok) {
    throw new Error(`Key file not reachable at ${keyUrl} (HTTP ${res.status}).`);
  }
  const body = (await res.text()).trim();
  if (body !== KEY) {
    throw new Error(
      `Key file at ${keyUrl} contains ${JSON.stringify(body.slice(0, 40))}, expected the key itself.`
    );
  }
  return keyUrl;
}

async function main() {
  const urlList = explicitPaths.length
    ? explicitPaths.map((p) => `${SITE}${p}`)
    : await urlsFromSitemap();

  console.log(`Site:  ${SITE}`);
  console.log(`URLs:  ${urlList.length}`);
  for (const u of urlList) console.log(`       ${u}`);

  if (dryRun) {
    console.log("\n--dry: nothing submitted.");
    return;
  }

  const keyLocation = await assertKeyIsLive();
  console.log(`\nKey verified at ${keyLocation}`);

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(SITE).host,
      key: KEY,
      keyLocation,
      urlList,
    }),
  });

  /*
   * 200 and 202 both mean accepted; 202 means the key is still being checked.
   * The endpoint returns no useful body on success, so the status is all there
   * is to go on.
   */
  if (res.status === 200 || res.status === 202) {
    console.log(`Submitted. HTTP ${res.status}.`);
    return;
  }

  const detail = {
    400: "Invalid request format.",
    403: "Key rejected. The key file is not valid for this host.",
    422: "A URL did not belong to this host, or the key did not match.",
    429: "Rate limited. Too many submissions.",
  }[res.status];

  throw new Error(
    `IndexNow refused the submission: HTTP ${res.status}. ${detail ?? ""}\n` +
      (await res.text().catch(() => ""))
  );
}

main().catch((err) => {
  console.error(`\nindexnow: ${err.message}`);
  process.exit(1);
});
