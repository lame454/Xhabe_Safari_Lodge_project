# Xhabe Safari Lodge — Website Build Plan for Antigravity (Zero-Cost Edition)
**Stack:** Next.js (Cloudflare Pages, free tier) + Supabase (free tier) · **Source docs:** Website Audit (18 Jul 2026) + Redesign Master Plan
**Original build plan prepared:** 19 Jul 2026 · **Revised — zero-cost, staged (no calendar time-boxing):** 19 Jul 2026

---

## 0. How to Use This Document With Antigravity

Antigravity works best from a clear goal + a plan it can turn into a task list, not a wall of undifferentiated instructions. Use this doc as follows:

1. Open a new Antigravity workspace pointed at an empty repo (or `npx create-next-app@latest` first — see §1).
2. Paste **Section 7 (Build Instructions)** into the Agent Manager as a single goal — the full numbered list at once. Antigravity will draft an implementation plan/task list (an Artifact) covering all the steps; review that plan before letting it execute, and you can still ask it to pause between individual numbered items if you want a checkpoint at any point.
3. Use **"Agent-Assisted" autonomy** (agent runs commands and writes code, pauses for your approval on anything structural) for Stages 0–2, and you can loosen to more autonomous execution once the design system and data model are locked in Stage 2.
4. After each task, use Antigravity's built-in browser subagent to verify the page renders and is responsive — ask it explicitly to "open the browser, check this page at mobile (390px), tablet (768px), and desktop (1440px) widths, and screenshot each."
5. Keep this file (or a trimmed version of it) in the repo as `/docs/build-plan.md` so any agent session — including a fresh one — has the same source of truth.
6. **This is a cost-adjusted revision of the original plan.** Every service with a real or risky billing surface has been swapped for a genuinely free tier or free alternative, and the calendar-based sprints have been replaced with sequential **stages** — move to the next stage as soon as the current stage's Definition of Done is met. There's no deadline pressure here, just no reason to stall either.

---

## 0a. What Changed From the Original Plan (Zero-Cost Adjustments)

| Area | Original plan | Zero-cost adjustment | Why |
|---|---|---|---|
| Hosting | Vercel (implicitly assumes Pro-capable usage) | **Cloudflare Pages** (free tier, via the OpenNext adapter) | Vercel's Hobby tier is free but its Terms of Service restrict it to **non-commercial, personal use** — a live lodge taking bookings is commercial use, which technically requires Vercel Pro ($20/mo). Cloudflare Pages' free tier explicitly permits commercial use, has unlimited bandwidth, and needs no card on file. |
| Payments | Stripe (optional, for online deposits) | **Removed from the initial build.** Stick with "enquire → pay on arrival/EFT." | Stripe itself has no monthly fee, but it does take a per-transaction cut, and wiring it up is extra scope. Keeping it out entirely for now keeps the build genuinely $0, not just fee-free until the first booking. Revisit later if the lodge decides the convenience is worth the transaction fee. |
| Maps | Google Maps JS API / Mapbox GL (API key, billing account) | **Google Maps "Share → Embed a Map" iframe** (no API key, no billing account) | Fixes the same audit finding (§15) — a real map instead of a paragraph of driving distances — with zero setup cost or billing risk. |
| Analytics | Vercel Analytics | **Google Analytics 4 + Google Search Console** | Both fully free with no cap this site's traffic will ever hit. Avoids any metered add-on risk on Vercel Analytics. |
| Email | Resend | Resend (unchanged) | Already free at this scale — roughly 3,000 emails/month on one verified sending domain is far more than a small lodge's booking + enquiry volume. No change needed, just keep an eye on volume as traffic grows. |
| Preview/staging | Vercel Pro (for password-protected previews/team seats) | Cloudflare Pages per-branch preview deployments (free) | Same "show the lodge owner a draft before go-live" workflow, zero cost. |
| Timeline | 7 sprints on fixed weekly dates | 7 sequential **stages**, no calendar dates | Matches the requirement to move as fast as possible with no artificial pacing — advance the moment a stage's Definition of Done is actually met. |

**A note on honesty here:** free-tier terms and limits shift over time and between providers. The specifics below (Cloudflare's commercial-use allowance, Supabase's free-tier pause behaviour, Resend's volume cap) were accurate as of this revision, but it's worth a five-minute re-check of each provider's current pricing/terms page right before kickoff, since these do change.

---

## 1. Tech Stack & Architecture Decisions (Zero-Cost)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router), TypeScript** | Free, open-source. Server components for fast, SEO-friendly pages; file-based routing maps cleanly to the sitemap in §3; native `next/image` solves the audit's unoptimized-image problem (§10 of audit) directly. |
| Hosting | **Cloudflare Pages** (free tier, via `@opennextjs/cloudflare` adapter) | Genuinely free: unlimited bandwidth, unlimited static requests, 500 builds/month, no card required, and — unlike Vercel Hobby — its terms explicitly allow commercial use. Standard Next.js App Router features work; a handful of advanced middleware patterns need adapter-specific config, which Antigravity can handle as it comes up. If you'd rather use Vercel for its slightly smoother Next.js developer experience, that's fine too — just know Vercel's free Hobby tier is ToS-restricted to non-commercial use, so a live commercial booking site technically calls for Pro ($20/mo) there. |
| Database / Backend | **Supabase (Postgres + Auth + Storage + Edge Functions)**, free tier | Postgres tables for rates, availability, bookings, testimonials, gallery; Supabase Auth to gate a lightweight admin area for the lodge owner to update rates/photos without touching code; Storage for photo assets; Edge Functions for booking-confirmation email logic. Free tier covers this site's scale comfortably (2 free projects, ~500MB DB, 1GB storage). **Caveat:** free-tier projects pause after ~7 days of inactivity — mitigate with a scheduled "keep-alive" ping (see §9), itself free via GitHub Actions. |
| Styling | **Tailwind CSS + CSS variables for the brand palette** | Free, open-source. Fast to build a consistent design system in, and keeps the "vary layouts, don't template everything" principle enforceable via custom components rather than repeating the same card grid. |
| Forms & validation | **React Hook Form + Zod** | Free, open-source packages. Type-safe validation for the enquiry and booking forms — directly fixes the audit's "no clear required-field indication," "form labeling" (§12) issues. |
| Email | **Resend**, free tier | Sends the "automatic confirmation email" the audit flags as missing (§19, rec. 5) and the enquiry-form autoresponder. Free tier (~3,000 emails/month, 1 verified sending domain) is well above what this site needs. |
| Payments | **None for the initial build.** Keep "enquire, then pay via EFT/on arrival." | Avoids both setup scope and per-transaction fees. Online deposits (Stripe) are deferred to the "Later" roadmap — see §6 and §10. |
| Maps | **Google Maps "Share → Embed a Map" iframe** (generated from maps.google.com, no API key) | Free, unlimited, no billing account required — this is the plain iframe embed, not the Maps JavaScript/Embed API, so there's no Google Cloud billing surface at all. Fixes the audit's "paragraph of driving distances" issue (§15, item 14) exactly as before, at zero cost. If a fully self-hosted, no-Google option is preferred instead, Leaflet + OpenStreetMap tiles is a solid free alternative. |
| Analytics / SEO tooling | **Google Analytics 4 (free) + `next-sitemap` (free, open-source) + Google Search Console (free)** | Fixes the audit's missing sitemap/robots.txt and gives real traffic and Core Web Vitals data instead of the structural guesswork in §14 of the audit — with no metered add-on risk. |
| Fonts | **`next/font` self-hosting a chosen Google Fonts pairing, `display: swap`** | Free. Fixes the `font_display: auto` issue (audit §7.1/§10/§14) and removes the render-blocking Google Fonts request entirely. |

**Not using:** WordPress, Elementor, or any page-builder — the audit's root problems (arbitrary heading levels, duplicated sidebar blocks, plugin bloat) are largely artifacts of that stack, and most page-builder plugins with real functionality gate features behind a paid tier anyway. A hand-built component system avoids both problems at once.

---

## 2. Design System Foundation

Per the master plan, **keep the brand's existing color story** — dark earthy base, cream/off-white body, warm sunset-amber accent — but the audit is explicit that **exact hex values were never extracted** (§7.2). Do this before anything else:

1. **Confirm real values.** Open the live site, DevTools → Inspect → Computed styles on the header band, a body-text panel, and a CTA button. Record exact hex codes. (Free — just the browser's built-in DevTools.)
2. If the live site is already offline/inaccessible by the time this build starts, fall back to the audit's directional read (deep green/charcoal/brown base, cream body, sunset-orange/amber accent) and pick specific, WCAG-AA-checked hex values that live within that story — don't guess a totally different palette.
3. Run every text/background pairing through a contrast checker (**WebAIM Contrast Checker** or the **axe DevTools** browser extension — both free) before locking the palette — the audit specifically flags likely low-contrast text-over-photo hero sections (§7.3, §12) as a known risk.

**Design system to build (as Tailwind config + component library, not ad hoc per-page CSS):**
- Color tokens: `--color-base-dark`, `--color-cream`, `--color-accent-amber`, plus a neutral gray scale for body text/borders.
- Type scale: one serif or distinctive display face for headlines (H1–H3) + one clean sans for body — pick something with real character from Google Fonts (free, self-hosted via `next/font`), not a default system stack, to avoid the "generic sans-serif without personality" trap the master plan warns about.
- Real heading hierarchy: every page gets exactly one `<h1>`, then `<h2>`/`<h3>` used semantically — this alone fixes three separate audit findings (SEO §11, accessibility §12, visual hierarchy §7.3).
- Component set: nav bar (with working dropdown), footer (single, non-duplicated), button variants (primary/secondary/tertiary — see CTA variety note below), card variants (room card, activity card, testimonial card), icon-list component (to replace plain bullet lists per audit §8/§15), map embed component, image gallery/lightbox component.
- **Section-layout variety is a requirement, not a nice-to-have:** the audit's single biggest visual criticism is "repetitive big-photo-plus-paragraph sections" (§7.3, §15). Explicitly design at least 4 distinct section layouts (e.g., alternating image/text, icon-row amenity grid, full-bleed quote/testimonial band, map + logistics panel) and assign them deliberately per page so no two consecutive sections look the same.

---

## 3. Sitemap (Consolidated)

Per audit recommendation §19.1, replace the current broken/duplicated nav with:

```
Home
About            (/about)
Accommodation    (/accommodation)
Activities       (/activities)
Facilities       (/facilities)
Itinerary        (/itinerary)
Gallery          (/gallery)              — NEW
Reviews          (/reviews)              — NEW
Contact          (/contact)              — NEW, simple enquiry form
Book Now         (/book)                 — separate from Contact
FAQ              (/faq)                  — NEW
Privacy Policy   (/privacy)              — NEW, footer only
Booking Terms    (/booking-terms)        — NEW, footer only
```

No "empty parent" dropdown page, no `-2` slugs, no query-string links, no duplicate "Book With Us" entries. Every URL above is a clean, real route with real content — nothing exists purely to hold a dropdown.

---

## 4. Supabase Data Model

```sql
-- Rooms / packages
create table packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,               -- "Package One / Two / Three"
  nights int not null,
  min_pax int,
  description text,
  inclusions text[],
  sort_order int
);

-- Seasonal rates (fixes the stale/expired rate table)
create table rate_seasons (
  id uuid primary key default gen_random_uuid(),
  season_name text not null,        -- Low / Mid / High / Camping
  start_date date not null,
  end_date date not null,
  rate_single numeric,
  rate_double numeric,
  currency text default 'USD',
  active boolean default true
);

-- Availability (real check-in/check-out model, replacing the hourly-slot plugin)
create table availability (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  rooms_available int not null,
  unique(date)
);

-- Bookings (real multi-night model)
create table bookings (
  id uuid primary key default gen_random_uuid(),
  check_in date not null,
  check_out date not null,
  guests int not null,
  package_id uuid references packages(id),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  details text,
  status text default 'pending',    -- pending / confirmed / cancelled
  created_at timestamptz default now()
);

-- Simple enquiries (the "just want to ask a question" path the audit says is missing)
create table enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

-- Testimonials (curated, on-site — currently 100% off-site per audit §17)
create table testimonials (
  id uuid primary key default gen_random_uuid(),
  guest_name text,
  source text,                      -- TripAdvisor / Expedia / Direct
  quote text not null,
  rating int,
  featured boolean default false
);

-- Gallery
create table gallery_images (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  alt_text text not null,           -- required, non-null, fixes audit §10/§12 alt-text gap
  category text,                    -- rooms / activities / views / dining
  sort_order int
);

-- Staff / "Meet the Team" (net-new, per audit §6 storytelling gap)
create table staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  bio text,
  photo_path text
);
```

Enable Row Level Security on all tables; public read access on `packages`, `rate_seasons`, `testimonials`, `gallery_images`, `staff`; write access restricted to an authenticated admin role for content management, and to a server-side service role (never exposed client-side) for `bookings`/`enquiries` inserts.

**Free-tier keep-alive:** Supabase pauses free-tier projects after roughly a week of no activity. Set up a scheduled GitHub Actions workflow (free on public or low-usage private repos) that runs every 3–4 days and fires a trivial read query (e.g., `select 1 from packages limit 1`) against the project to keep it active. This is a five-line YAML file and costs nothing.

---

## 5. Stage Plan

**Assumption stated up front:** since this build has a small "team" (you as product owner/reviewer, Antigravity as the executing agent, and possibly the lodge owner for content sign-off) rather than a multi-engineer team, the work below is organized as **sequential stages with no calendar time-boxing** — there are no week numbers or dates. Start the next stage the moment the current one's Definition of Done is genuinely met, and don't start it before. Move as fast as the work allows; nothing here is meant to slow you down artificially.

### Stage 0 — Foundations
**Team:** You (PO/reviewer) + Antigravity agent
**Goal:** Repo, hosting, and database are live and talking to each other; design tokens are locked.

| Priority | Item | Owner | Dependencies |
|---|---|---|---|
| P0 | Scaffold Next.js + TypeScript + Tailwind project | Antigravity | None |
| P0 | Create Supabase project (free tier, no card), run schema from §4 | Antigravity | Free Supabase account |
| P0 | Create Cloudflare account and Pages project (free tier, no card); set up the OpenNext adapter | Antigravity | Free Cloudflare account |
| P0 | Confirm real brand hex values via DevTools; lock design tokens | You | Old site still reachable |
| P1 | Set up `next/font` self-hosted type pairing | Antigravity | Tokens locked |
| P1 | Set up the Supabase keep-alive GitHub Actions workflow (§4) | Antigravity | Supabase project exists |

**Risks:** Old site may go offline before colors are extracted — mitigate by doing this first, day one.
**Definition of Done:** `npm run dev` renders a blank branded page with correct fonts/colors; Supabase tables exist and are queryable from a test route; Cloudflare Pages preview URL is live and publicly reachable.

### Stage 1 — Design System & Navigation
**Goal:** The shared shell (nav, footer, buttons, cards) is built once and reused everywhere — no duplicated sidebar block.

| Priority | Item | Dependencies |
|---|---|---|
| P0 | Build nav bar with consolidated sitemap (§3), no dropdown-to-nowhere | Stage 0 |
| P0 | Build single footer component (contact, real social links, current-year copyright) | Stage 0 |
| P0 | Build button, card, icon-list, and section-layout components (§2) | Design tokens locked |
| P1 | Build map/logistics component using the no-key Google Maps iframe embed | None |
| P2 | Build lightbox/gallery component shell (data comes later) | None |

**Definition of Done:** Every component renders correctly at 390/768/1440px; nav has zero broken/duplicate links; footer appears once per page, not per-section.

### Stage 2 — Core Content Pages
**Goal:** Home, About, Accommodation, Facilities, Activities, Itinerary are live with real (or placeholder-marked) content.

| Priority | Item | Dependencies |
|---|---|---|
| P0 | Home page — hero, location section w/ map, feature callouts, varied section layouts | Stage 1 shell |
| P0 | Accommodation page pulling room data | Content from lodge owner (§11) |
| P0 | Facilities page — rebuilt from scratch (fixes 7 broken images) | Real photography (§11) |
| P0 | Activities page — heading+description+image as one repeating unit (fixes §9/§12 pairing bug) | Content |
| P1 | Itinerary page | Content |
| P1 | About page + new "Meet the Team" module (`staff` table) | Staff bios/photos (§11) |

**Definition of Done:** Every image has real, descriptive alt text; every page has exactly one real `<h1>`; no page reuses the old duplicated sidebar block.

### Stage 3 — Booking Engine
**Goal:** A real check-in/check-out booking flow replaces the hourly-slot plugin — no online payment processing in this initial build.

| Priority | Item | Dependencies |
|---|---|---|
| P0 | Booking form: date-range picker, guest count, package selector (React Hook Form + Zod) | Schema from Stage 0 |
| P0 | Server route to check `availability` and insert into `bookings` | Supabase live |
| P0 | Automatic confirmation email on booking submit (via Resend free tier) | Resend account |
| P0 | Current rate table pulled live from `rate_seasons` with correct currency labeling | Current rates from lodge owner (§11) — **blocking** |
| P0 | Clear "pay via EFT/on arrival" messaging in place of any deposit-checkout flow | Deposit/cancellation policy from lodge owner |
| P1 | Deposit/cancellation policy + children's policy copy block | Decision from lodge owner (§11) |
| P2 | OTA channel-sync research spike (no build work — see §6 note) | — |

**Definition of Done:** A test booking end-to-end produces a confirmation email and a row in `bookings`; no hourly time-slot UI remains anywhere; rates shown are current, not expired; no payment processor is wired in.

### Stage 4 — Trust & Conversion Pages
**Goal:** Gallery, Reviews, Contact, FAQ ship — the pages the audit says are entirely missing.

| Priority | Item | Dependencies |
|---|---|---|
| P0 | Contact/Enquire page (lightweight form → `enquiries` table + autoresponder) | Stage 3 email setup |
| P0 | Reviews/Testimonials page pulling curated quotes | Guest quotes gathered w/ permission (§11) |
| P0 | Gallery page with real photography, categorized | Real photography (§11) |
| P1 | FAQ page (transport, inclusions, children's policy, border logistics) | Content from lodge owner |
| P1 | Tiered CTA rollout: "Check Availability," "View Gallery," "WhatsApp Us," "Download Brochure" across pages (fixes audit §15 item 13) | Free WhatsApp Business number, brochure PDF |
| P2 | Trust badges / OTA logos (TripAdvisor, Expedia) if usage terms allow | Verify each platform's logo-usage policy |

**Definition of Done:** No CTA on the site points only at the full rates page — at least 3 distinct CTA types are live; reviews page cites sources correctly and doesn't overstate certifications the lodge doesn't hold (audit §17 flags this explicitly).

### Stage 5 — SEO, Accessibility, Performance, Legal
**Goal:** The technical debt items from the audit are closed out before launch, using only free tooling.

| Priority | Item | Dependencies |
|---|---|---|
| P0 | Unique meta description + title per page | All pages built |
| P0 | `sitemap.xml` + `robots.txt` (via `next-sitemap`, free) generated and submitted to Search Console (free) | Domain live |
| P0 | Full keyboard-nav + screen-reader pass on nav, forms, popup (if any popup is kept at all — audit questions whether it should) | All pages built |
| P0 | Automated contrast check (axe/WebAIM, both free) on every hero/text-over-photo section | Palette locked |
| P0 | Lighthouse pass (free, built into Chrome DevTools) — target LCP/CLS/INP in the "good" band | Images optimized via `next/image` |
| P1 | Set up Google Analytics 4 (free) | Domain live |
| P1 | Privacy Policy + Booking Terms pages | Legal text drafted (§11) |
| P1 | `srcset`/responsive images confirmed for all galleries | Stage 4 |

**Definition of Done:** Lighthouse scores ≥90 across Performance/Accessibility/Best Practices/SEO on key pages; zero critical axe violations; sitemap accepted in Search Console.

### Stage 6 — QA, Content Freeze, Launch
**Goal:** Ship it.

| Priority | Item | Dependencies |
|---|---|---|
| P0 | Full cross-browser/cross-device QA pass | All prior stages |
| P0 | DNS cutover plan reviewed with lodge owner (see §9) | Domain access confirmed |
| P0 | Final content proofread (fix recurring typos flagged in audit: "border" not "Boarder," "Sundowner" not "Sunset Downer," "species" not "spices") | — |
| P0 | Go-live: point domain at Cloudflare Pages, verify SSL (automatic and free), verify email deliverability | DNS access |
| P1 | Post-launch monitoring: Google Analytics 4 + Search Console verified working | — |

**Definition of Done:** Live site at the production domain; old WordPress site's redirects (if any old URLs are indexed) mapped to new routes to preserve any existing SEO equity.

---

## 6. Roadmap (Now / Next / Later)

| Timeframe | Item | Status | Notes |
|---|---|---|---|
| **Now** (Stages 0–6) | Full rebuild per §5 above, entirely on free tiers | Not started | Everything needed for a correct, launch-ready site, at $0. |
| **Next** (post-launch, whenever it makes sense) | Real-time OTA channel sync (Expedia/Booking.com/TripAdvisor) | Not started | Audit flags this as the single highest-leverage post-launch upgrade — directly addresses the "no record of booking" reliability incident. **Note: most channel-manager tools are paid subscriptions**, so this item is genuinely out of zero-cost scope and needs a real budget decision when it's time to pursue it. |
| **Next** | Online deposits via Stripe | Not started | Deliberately deferred from the initial build (§0a). Stripe has no monthly fee, only a per-transaction cut — worth revisiting once the lodge decides that convenience is worth the fee. |
| **Next** | Formal eco-certification pursuit (Botswana Tourism Organisation eco-rating / Fair Trade Tourism) or explicit decision to drop the idea | Not started | Audit found no existing certification (§17) — don't imply one that doesn't exist. Certification programs typically carry their own fees, separate from this website build. |
| **Next** | Blog/News section (or formally remove all leftover Categories/blog scaffolding if not pursued) | Not started | Currently a leftover WordPress artifact with no real content behind it. Free to build on the same stack if pursued. |
| **Later** | Multi-language support (audit notes an international guest mix — SA/EU/NA visitors) | Directional | Scope after launch traffic data confirms which languages matter most; can be done with free i18n libraries. |
| **Later** | Loyalty/repeat-guest perks, dynamic seasonal pricing automation | Directional | Only worth it once direct-booking volume justifies the engineering investment. |
| **Later** | Native WhatsApp Business API booking assist | Directional | The basic WhatsApp Business app (free) covers the Stage 4 "WhatsApp Us" CTA; the full Business API is a paid/metered product and is a separate later decision. |

**Dependencies to flag:** the "Next" OTA-sync item depends on choosing a channel-manager or building custom two-way sync — this is a real scoping *and budget* decision, not a small task, and shouldn't be pulled into "Now" without re-scoping the whole plan and accepting it won't be zero-cost.

---

## 7. Step-by-Step Build Instructions (paste the full list into Antigravity as one goal)

1. "Scaffold a new Next.js 15 App Router project with TypeScript and Tailwind CSS. Set up a Supabase client using environment variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Verify a test query against Supabase renders on the homepage."
2. "Create the SQL schema in §4 of build-plan.md as a Supabase migration. Enable RLS with public read on `packages`, `rate_seasons`, `testimonials`, `gallery_images`, `staff`, and restricted write access elsewhere."
3. "Build a design-tokens file (Tailwind config) using these hex values: [insert confirmed values from §2]. Set up `next/font` with [chosen display face] for headings and [chosen body face] for body text, `display: swap`."
4. "Build a `<NavBar>` component implementing the sitemap in §3 of build-plan.md — no dropdown items with empty content, no duplicate links, no query-string URLs. Build a single `<Footer>` component with real contact info and correctly linked social icons. Verify in the browser at 390px, 768px, and 1440px."
5. "Build reusable `<Button>`, `<Card>`, `<IconList>`, a `<MapEmbed>` component using a plain Google Maps iframe (no API key), and at least four distinct section-layout components (alternating image/text, icon-row grid, full-bleed quote band, map+logistics panel) per §2. Do not let any two consecutive homepage sections use the same layout."
6. "Build the Home page using the varied section layouts above, pulling location/logistics copy into the map+logistics component instead of a paragraph of driving distances."
7. "Build the Accommodation, Facilities, Activities, and Itinerary pages, each with one real `<h1>`, semantic `<h2>`/`<h3>` structure, and descriptive (non-filename) alt text on every image. On the Activities page, pair each heading + description + image as a single repeating component — do not separate all headings from all descriptions."
8. "Build the About page and a new 'Meet the Team' section pulling from the `staff` table."
9. "Build the booking flow: a date-range check-in/check-out picker, guest-count field, and package selector using React Hook Form + Zod, submitting to a server route that checks `availability` and inserts into `bookings`. Trigger a confirmation email via Resend on success. Display clear 'pay via EFT/on arrival' messaging — do not build any payment-collection UI."
10. "Build a live rates display pulling from `rate_seasons`, showing clearly labeled currency and current season windows — never hardcode rates in the page."
11. "Build the Contact/Enquire page as a separate, lightweight path from Book Now, submitting to the `enquiries` table with an autoresponder email."
12. "Build the Gallery page (categorized, lightbox-enabled) and Reviews page (pulling from `testimonials`, citing each source) and FAQ page."
13. "Audit every CTA across the site and ensure at least three distinct CTA types exist (e.g., Check Availability, View Gallery, WhatsApp Us) instead of every button routing to the same rates page."
14. "Add unique meta titles/descriptions per route, generate `sitemap.xml` and `robots.txt` using next-sitemap, and verify heading hierarchy with exactly one `<h1>` per page."
15. "Run an accessibility pass: keyboard-navigate every page and form, verify screen-reader label associations on all form fields, and run an automated contrast check on every hero/text-over-photo section."
16. "Run a Lighthouse pass on Home, Accommodation, and Book Now pages. Fix anything scoring below 90 on Performance, Accessibility, or SEO."
17. "Build Privacy Policy and Booking Terms pages from provided legal copy."
18. "Prepare the production Cloudflare Pages deployment using the OpenNext adapter, connect the custom domain, and verify SSL and email deliverability from the live domain (not just preview URLs)."

---

## 8. SEO, Accessibility & Performance Checklist (pre-launch gate)

- [ ] Every page has exactly one semantic `<h1>`
- [ ] Every image has descriptive, human-written alt text (no filenames)
- [ ] Unique `<title>` and meta description per page
- [ ] `sitemap.xml` submitted to Google Search Console (free)
- [ ] `robots.txt` present and correct
- [ ] Contrast-checked palette (WebAIM/axe, both free) on all text-over-photo sections
- [ ] Full keyboard navigation through nav, forms, and any modal
- [ ] Forms have proper `<label for=...>` associations and clear required-field indication
- [ ] Fonts self-hosted via `next/font`, `display: swap`
- [ ] Images served via `next/image` with responsive `srcset`, WebP/AVIF
- [ ] Lighthouse ≥90 on Performance, Accessibility, Best Practices, SEO
- [ ] No leftover query-string nav links, duplicate slugs, or orphaned pages
- [ ] Consistent, current-year footer copyright and real company name
- [ ] Real social links (Facebook in particular) verified working, not placeholder domains

---

## 9. Deployment & Environments

1. **Supabase:** create a free-tier project (no card required); store `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and a `SUPABASE_SERVICE_ROLE_KEY` (server-only, never in client bundle) in Cloudflare Pages' environment variables. Set up the GitHub Actions keep-alive workflow from §4 so the free-tier project doesn't pause from inactivity.
2. **Cloudflare Pages:** connect the GitHub repo; set up `main` → production, feature branches → preview deployments (free, unlimited) so the lodge owner can review drafts via shareable preview URLs before anything goes live.
3. **Domain/DNS:** confirm who controls the current registrar/DNS for `xhabesafarilodge.com` — this is likely already owned, so there's no new domain cost, just a repointing exercise. Point the domain's DNS at Cloudflare Pages only after Stage 6 QA passes — plan the cutover window with the lodge owner in advance since email (`reservations@xhabesafarilodge.com`) must keep working through the switch (don't touch MX records when repointing the site's records). Optionally, moving DNS management itself to Cloudflare (free) is convenient alongside Cloudflare Pages, but isn't required — the existing registrar's DNS works fine too.
4. **Email sending domain:** verify the sending domain in Resend (SPF/DKIM records, free) so confirmation emails don't land in spam.
5. **Staging:** use Cloudflare Pages preview deployments as staging — no need for a separate staging environment given the project size, and no extra cost either way.

---

## 10. What This Doc Deliberately Does Not Decide

These are flagged in the audit as "open items to verify" and are genuinely outside what this plan can resolve without more input from the lodge owner — see §11 for the full resource list:
- Exact current 2026/2027 seasonal rates and deposit/cancellation policy
- Whether to pursue a real eco-certification or drop certification language entirely
- Whether online deposits (Stripe) are ever added — deliberately deferred from this zero-cost build (§0a, §6); if pursued later, note it carries a real per-transaction fee even though it has no monthly cost
- Which channel manager (if any) to use for OTA sync in the "Next" roadmap phase — these are typically paid subscriptions and are out of zero-cost scope by nature

---

## 11. Resources & Decisions Needed Before/During Kickoff

**Accounts & access — all free, no card required for any of these**
- [ ] Cloudflare account (Pages project; DNS management there is optional)
- [ ] Supabase account/project (free tier)
- [ ] Domain registrar login or delegated DNS access for `xhabesafarilodge.com` (domain itself is presumably already owned — no new cost)
- [ ] Resend account + verified sending domain (free tier)
- [ ] Google Search Console access (or ability to verify a new property) — free
- [ ] Google Analytics 4 property — free
- [ ] Free WhatsApp Business number — if the "WhatsApp Us" CTA is pursued (§5 Stage 4)

*(No Maps API key needed — the plain iframe embed requires none. No Stripe account needed for this build — see §0a/§6/§10.)*

**Content from the lodge owner**
- [ ] Current, correct 2026/2027 seasonal rates, currency confirmation, deposit/cancellation policy, children's/minimum-age policy
- [ ] Professional (or at least consistent, high-resolution) photography of rooms, facilities, activities, views — replacing the mixed stock/WhatsApp-photo set
- [ ] Staff names, roles, short bios, and photos for the "Meet the Team" module (TripAdvisor reviews already name Maatla, Beauty, Lindi, Antony, "Mr. S," and Gaba — worth reaching out to feature them)
- [ ] Permission to quote specific guest reviews on-site, with correct source attribution (TripAdvisor/Expedia) — check each platform's terms on reproducing review content before publishing
- [ ] Real Facebook page URL to link (facebook.com/xhabesafarilodge) and any other real social accounts
- [ ] FAQ content: transfers/transport, what's included, children's policy, payment/deposit terms, visa/border logistics (Botswana/Namibia border proximity)
- [ ] Privacy Policy and Booking Terms copy (or sign-off on a lawyer-drafted template)
- [ ] The name origin/story of "Xhabe" and any founding story — currently unexplained anywhere, flagged as a storytelling gap
- [ ] A decision on the sitewide popup: audit questions whether it should return at all given its vague copy ("Don't Miss Out On This Opportunity") with no real offer — if kept, it needs a real offer and full keyboard/focus-trap accessibility

**Decisions**
- [ ] Confirm sticking with "enquiry, then manual payment" for launch (recommended for zero-cost) vs. adding Stripe later
- [ ] Whether/when to pursue OTA channel-manager integration (Next roadmap phase, real budget item) and which provider
- [ ] Whether to pursue a formal eco-certification or drop certification-adjacent language
- [ ] Final confirmed brand hex values (pending DevTools extraction — do this immediately, before the old site risks going offline)
- [ ] Chosen typography pairing for the new design system (any Google Fonts pairing — free either way)

**Zero-cost caveats worth a quick re-check before/at kickoff** (free-tier terms shift over time — verify current specifics on each provider's site):
- Supabase: free-tier projects pause after ~7 days of inactivity — the §4 keep-alive workflow should prevent this, but confirm the current policy hasn't changed.
- Cloudflare Pages: unlimited bandwidth on the free tier as of this writing, but Workers/function invocations are capped (currently around 100k/day) — comfortably enough for a lodge site's traffic, worth a glance after launch.
- Resend: roughly 3,000 emails/month on one verified domain on the free tier — fine for booking confirmations and enquiries at this scale; revisit if volume grows substantially.
