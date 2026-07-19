# Xhabe Safari Lodge — Website Build Plan for Antigravity
**Stack:** Next.js (Vercel) + Supabase · **Source docs:** Website Audit (18 Jul 2026) + Redesign Master Plan
**Prepared:** 19 Jul 2026

---

## 0. How to Use This Document With Antigravity

Antigravity works best from a clear goal + a plan it can turn into a task list, not a wall of undifferentiated instructions. Use this doc as follows:

1. Open a new Antigravity workspace pointed at an empty repo (or `npx create-next-app@latest` first — see §1).
2. Paste **Section 7 (Build Instructions), one numbered task at a time**, into the Agent Manager as separate goals — don't paste the whole document at once. Antigravity will draft an implementation plan/task list (an Artifact) for each; review that plan before letting it execute.
3. Use **"Agent-Assisted" autonomy** (agent runs commands and writes code, pauses for your approval on anything structural) for Sprints 0–2, and you can loosen to more autonomous execution once the design system and data model are locked in Sprint 2.
4. After each task, use Antigravity's built-in browser subagent to verify the page renders and is responsive — ask it explicitly to "open the browser, check this page at mobile (390px), tablet (768px), and desktop (1440px) widths, and screenshot each."
5. Keep this file (or a trimmed version of it) in the repo as `/docs/build-plan.md` so any agent session — including a fresh one — has the same source of truth.

---

## 1. Tech Stack & Architecture Decisions

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router), TypeScript** | Server components for fast, SEO-friendly pages; file-based routing maps cleanly to the sitemap in §3; native `next/image` solves the audit's unoptimized-image problem (§10 of audit) directly. |
| Hosting | **Vercel** | Given. Native Next.js support, image optimization, edge caching, preview deployments per branch/PR — useful for showing the lodge owner drafts before go-live. |
| Database / Backend | **Supabase (Postgres + Auth + Storage + Edge Functions)** | Given. Postgres tables for rates, availability, bookings, testimonials, gallery; Supabase Auth to gate a lightweight admin area for the lodge owner to update rates/photos without touching code; Storage for photo assets if not using Vercel/Next image CDN directly; Edge Functions for booking-confirmation email logic. |
| Styling | **Tailwind CSS + CSS variables for the brand palette** | Fast to build a consistent design system in, and keeps the "vary layouts, don't template everything" principle enforceable via custom components rather than repeating the same card grid. |
| Forms & validation | **React Hook Form + Zod** | Type-safe validation for the enquiry and booking forms — directly fixes the audit's "no clear required-field indication," "form labeling" (§12) issues. |
| Email | **Resend** (or Supabase SMTP integration) | Sends the "automatic confirmation email" the audit flags as missing (§19, rec. 5) and the enquiry-form autoresponder. |
| Payments (if deposits are collected online) | **Stripe** | Only needed if the redesign takes online deposits rather than "enquire, then pay via EFT/on arrival." This is a decision to make — see §13. |
| Maps | **Google Maps embed or Mapbox GL** | Replaces the "paragraph of driving distances" the audit flags (§15, item 14) with an actual map. |
| Analytics / SEO tooling | **Vercel Analytics + `next-sitemap` + Google Search Console** | Fixes the audit's missing sitemap/robots.txt and gives real Core Web Vitals data instead of the structural guesswork in §14 of the audit. |
| Fonts | **`next/font` self-hosting a chosen Google Fonts pairing, `display: swap`** | Fixes the `font_display: auto` issue (audit §7.1/§10/§14) and removes the render-blocking Google Fonts request entirely. |

**Not using:** WordPress, Elementor, or any page-builder — the audit's root problems (arbitrary heading levels, duplicated sidebar blocks, plugin bloat) are largely artifacts of that stack. A hand-built component system avoids reintroducing them.

---

## 2. Design System Foundation

Per the master plan, **keep the brand's existing color story** — dark earthy base, cream/off-white body, warm sunset-amber accent — but the audit is explicit that **exact hex values were never extracted** (§7.2). Do this before anything else:

1. **Confirm real values.** Open the live site, DevTools → Inspect → Computed styles on the header band, a body-text panel, and a CTA button. Record exact hex codes.
2. If the live site is already offline/inaccessible by the time this build starts, fall back to the audit's directional read (deep green/charcoal/brown base, cream body, sunset-orange/amber accent) and pick specific, WCAG-AA-checked hex values that live within that story — don't guess a totally different palette.
3. Run every text/background pairing through a contrast checker (WebAIM or axe) before locking the palette — the audit specifically flags likely low-contrast text-over-photo hero sections (§7.3, §12) as a known risk.

**Design system to build (as Tailwind config + component library, not ad hoc per-page CSS):**
- Color tokens: `--color-base-dark`, `--color-cream`, `--color-accent-amber`, plus a neutral gray scale for body text/borders.
- Type scale: one serif or distinctive display face for headlines (H1–H3) + one clean sans for body — pick something with real character, not a default system stack, to avoid the "generic sans-serif without personality" trap the master plan warns about.
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

---

## 5. Sprint Plan

**Assumption stated up front:** since this build has a small "team" (you as product owner/reviewer, Antigravity as the executing agent, and possibly the lodge owner for content sign-off) rather than a multi-engineer team, sprints below are scoped as **1-week cycles** with you as the sole human reviewer. Adjust the length/count freely — the structure and DoD matter more than the exact dates.

### Sprint 0 — Foundations
**Dates:** Week 1 | **Team:** You (PO/reviewer) + Antigravity agent
**Sprint Goal:** Repo, hosting, and database are live and talking to each other; design tokens are locked.

| Priority | Item | Owner | Dependencies |
|---|---|---|---|
| P0 | Scaffold Next.js + TypeScript + Tailwind project | Antigravity | None |
| P0 | Create Supabase project, run schema from §4 | Antigravity | Supabase account exists (§13) |
| P0 | Connect Vercel project, verify preview deploy works | Antigravity | Vercel account exists (§13) |
| P0 | Confirm real brand hex values via DevTools; lock design tokens | You | Old site still reachable |
| P1 | Set up `next/font` self-hosted type pairing | Antigravity | Tokens locked |

**Risks:** Old site may go offline before colors are extracted — mitigate by doing this first, day one.
**Definition of Done:** `npm run dev` renders a blank branded page with correct fonts/colors; Supabase tables exist and are queryable from a test route; Vercel preview URL is live.

### Sprint 1 — Design System & Navigation
**Dates:** Week 2
**Sprint Goal:** The shared shell (nav, footer, buttons, cards) is built once and reused everywhere — no duplicated sidebar block.

| Priority | Item | Dependencies |
|---|---|---|
| P0 | Build nav bar with consolidated sitemap (§3), no dropdown-to-nowhere | Sprint 0 |
| P0 | Build single footer component (contact, real social links, current-year copyright) | Sprint 0 |
| P0 | Build button, card, icon-list, and section-layout components (§2) | Design tokens locked |
| P1 | Build map/logistics component | Maps API key (§13) |
| P2 | Build lightbox/gallery component shell (data comes later) | None |

**Definition of Done:** Every component renders correctly at 390/768/1440px; nav has zero broken/duplicate links; footer appears once per page, not per-section.

### Sprint 2 — Core Content Pages
**Dates:** Week 3
**Sprint Goal:** Home, About, Accommodation, Facilities, Activities, Itinerary are live with real (or placeholder-marked) content.

| Priority | Item | Dependencies |
|---|---|---|
| P0 | Home page — hero, location section w/ map, feature callouts, varied section layouts | Sprint 1 shell |
| P0 | Accommodation page pulling room data | Content from lodge owner (§13) |
| P0 | Facilities page — rebuilt from scratch (fixes 7 broken images) | Real photography (§13) |
| P0 | Activities page — heading+description+image as one repeating unit (fixes §9/§12 pairing bug) | Content |
| P1 | Itinerary page | Content |
| P1 | About page + new "Meet the Team" module (`staff` table) | Staff bios/photos (§13) |

**Definition of Done:** Every image has real, descriptive alt text; every page has exactly one real `<h1>`; no page reuses the old duplicated sidebar block.

### Sprint 3 — Booking Engine
**Dates:** Week 4
**Sprint Goal:** A real check-in/check-out booking flow replaces the hourly-slot plugin.

| Priority | Item | Dependencies |
|---|---|---|
| P0 | Booking form: date-range picker, guest count, package selector (React Hook Form + Zod) | Schema from Sprint 0 |
| P0 | Server route to check `availability` and insert into `bookings` | Supabase live |
| P0 | Automatic confirmation email on booking submit | Resend account (§13) |
| P0 | Current rate table pulled live from `rate_seasons` with correct currency labeling | Current rates from lodge owner (§13) — **blocking** |
| P1 | Deposit/cancellation policy + children's policy copy block | Decision from lodge owner (§13) |
| P1 | Stripe deposit checkout (only if going with online deposits) | Decision made (§13) |
| P2 | OTA channel-sync research spike (see §13 note) | — |

**Definition of Done:** A test booking end-to-end produces a confirmation email and a row in `bookings`; no hourly time-slot UI remains anywhere; rates shown are current, not expired.

### Sprint 4 — Trust & Conversion Pages
**Dates:** Week 5
**Sprint Goal:** Gallery, Reviews, Contact, FAQ ship — the pages the audit says are entirely missing.

| Priority | Item | Dependencies |
|---|---|---|
| P0 | Contact/Enquire page (lightweight form → `enquiries` table + autoresponder) | Sprint 3 email setup |
| P0 | Reviews/Testimonials page pulling curated quotes | Guest quotes gathered w/ permission (§13) |
| P0 | Gallery page with real photography, categorized | Real photography (§13) |
| P1 | FAQ page (transport, inclusions, children's policy, border logistics) | Content from lodge owner |
| P1 | Tiered CTA rollout: "Check Availability," "View Gallery," "WhatsApp Us," "Download Brochure" across pages (fixes audit §15 item 13) | WhatsApp number, brochure PDF |
| P2 | Trust badges / OTA logos (TripAdvisor, Expedia) if usage terms allow | Verify each platform's logo-usage policy |

**Definition of Done:** No CTA on the site points only at the full rates page — at least 3 distinct CTA types are live; reviews page cites sources correctly and doesn't overstate certifications the lodge doesn't hold (audit §17 flags this explicitly).

### Sprint 5 — SEO, Accessibility, Performance, Legal
**Dates:** Week 6
**Sprint Goal:** The technical debt items from the audit are closed out before launch.

| Priority | Item | Dependencies |
|---|---|---|
| P0 | Unique meta description + title per page | All pages built |
| P0 | `sitemap.xml` + `robots.txt` generated and submitted to Search Console | Domain live |
| P0 | Full keyboard-nav + screen-reader pass on nav, forms, popup (if any popup is kept at all — audit questions whether it should) | All pages built |
| P0 | Automated contrast check (axe/WebAIM) on every hero/text-over-photo section | Palette locked |
| P0 | Lighthouse/PageSpeed pass — target LCP/CLS/INP in the "good" band | Images optimized via `next/image` |
| P1 | Privacy Policy + Booking Terms pages | Legal text drafted (§13) |
| P1 | `srcset`/responsive images confirmed for all galleries | Sprint 4 |

**Definition of Done:** Lighthouse scores ≥90 across Performance/Accessibility/Best Practices/SEO on key pages; zero critical axe violations; sitemap accepted in Search Console.

### Sprint 6 — QA, Content Freeze, Launch
**Dates:** Week 7
**Sprint Goal:** Ship it.

| Priority | Item | Dependencies |
|---|---|---|
| P0 | Full cross-browser/cross-device QA pass | All prior sprints |
| P0 | DNS cutover plan reviewed with lodge owner (see §11) | Domain access confirmed |
| P0 | Final content proofread (fix recurring typos flagged in audit: "border" not "Boarder," "Sundowner" not "Sunset Downer," "species" not "spices") | — |
| P0 | Go-live: point domain at Vercel, verify SSL, verify email deliverability | DNS access |
| P1 | Post-launch monitoring: Vercel Analytics + Search Console verified working | — |

**Definition of Done:** Live site at the production domain; old WordPress site's redirects (if any old URLs are indexed) mapped to new routes to preserve any existing SEO equity.

---

## 6. Roadmap (Now / Next / Later)

| Timeframe | Item | Status | Notes |
|---|---|---|---|
| **Now** (Sprints 0–6, ~7 weeks) | Full rebuild per §5 above | Not started | Everything needed for a correct, launch-ready site. |
| **Next** (1–3 months post-launch) | Real-time OTA channel sync (Expedia/Booking.com/TripAdvisor) | Not started | Audit flags this as the single highest-leverage post-launch upgrade — directly addresses the "no record of booking" reliability incident. Needs a channel-manager decision (§13). |
| **Next** | Formal eco-certification pursuit (Botswana Tourism Organisation eco-rating / Fair Trade Tourism) or explicit decision to drop the idea | Not started | Audit found no existing certification (§17) — don't imply one that doesn't exist. |
| **Next** | Blog/News section (or formally remove all leftover Categories/blog scaffolding if not pursued) | Not started | Currently a leftover WordPress artifact with no real content behind it. |
| **Later** (3–6+ months) | Multi-language support (audit notes an international guest mix — SA/EU/NA visitors) | Directional | Scope after launch traffic data confirms which languages matter most. |
| **Later** | Loyalty/repeat-guest perks, dynamic seasonal pricing automation | Directional | Only worth it once direct-booking volume justifies the engineering investment. |
| **Later** | Native WhatsApp Business API booking assist | Directional | Complements, doesn't replace, the core booking engine. |

**Dependencies to flag:** the "Next" OTA-sync item depends on choosing a channel-manager or building custom two-way sync — this is a real scoping decision, not a small task, and shouldn't be pulled into "Now" without re-scoping the whole timeline.

---

## 7. Step-by-Step Build Instructions (paste into Antigravity one at a time)

1. "Scaffold a new Next.js 15 App Router project with TypeScript and Tailwind CSS. Set up a Supabase client using environment variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Verify a test query against Supabase renders on the homepage."
2. "Create the SQL schema in §4 of build-plan.md as a Supabase migration. Enable RLS with public read on `packages`, `rate_seasons`, `testimonials`, `gallery_images`, `staff`, and restricted write access elsewhere."
3. "Build a design-tokens file (Tailwind config) using these hex values: [insert confirmed values from §2]. Set up `next/font` with [chosen display face] for headings and [chosen body face] for body text, `display: swap`."
4. "Build a `<NavBar>` component implementing the sitemap in §3 of build-plan.md — no dropdown items with empty content, no duplicate links, no query-string URLs. Build a single `<Footer>` component with real contact info and correctly linked social icons. Verify in the browser at 390px, 768px, and 1440px."
5. "Build reusable `<Button>`, `<Card>`, `<IconList>`, and at least four distinct section-layout components (alternating image/text, icon-row grid, full-bleed quote band, map+logistics panel) per §2. Do not let any two consecutive homepage sections use the same layout."
6. "Build the Home page using the varied section layouts above, pulling location/logistics copy into the map+logistics component instead of a paragraph of driving distances."
7. "Build the Accommodation, Facilities, Activities, and Itinerary pages, each with one real `<h1>`, semantic `<h2>`/`<h3>` structure, and descriptive (non-filename) alt text on every image. On the Activities page, pair each heading + description + image as a single repeating component — do not separate all headings from all descriptions."
8. "Build the About page and a new 'Meet the Team' section pulling from the `staff` table."
9. "Build the booking flow: a date-range check-in/check-out picker, guest-count field, and package selector using React Hook Form + Zod, submitting to a server route that checks `availability` and inserts into `bookings`. Trigger a confirmation email via Resend on success."
10. "Build a live rates display pulling from `rate_seasons`, showing clearly labeled currency and current season windows — never hardcode rates in the page."
11. "Build the Contact/Enquire page as a separate, lightweight path from Book Now, submitting to the `enquiries` table with an autoresponder email."
12. "Build the Gallery page (categorized, lightbox-enabled) and Reviews page (pulling from `testimonials`, citing each source) and FAQ page."
13. "Audit every CTA across the site and ensure at least three distinct CTA types exist (e.g., Check Availability, View Gallery, WhatsApp Us) instead of every button routing to the same rates page."
14. "Add unique meta titles/descriptions per route, generate `sitemap.xml` and `robots.txt`, and verify heading hierarchy with exactly one `<h1>` per page."
15. "Run an accessibility pass: keyboard-navigate every page and form, verify screen-reader label associations on all form fields, and run an automated contrast check on every hero/text-over-photo section."
16. "Run a Lighthouse pass on Home, Accommodation, and Book Now pages. Fix anything scoring below 90 on Performance, Accessibility, or SEO."
17. "Build Privacy Policy and Booking Terms pages from provided legal copy."
18. "Prepare the production Vercel deployment, connect the custom domain, and verify SSL and email deliverability from the live domain (not just preview URLs)."

---

## 8. SEO, Accessibility & Performance Checklist (pre-launch gate)

- [ ] Every page has exactly one semantic `<h1>`
- [ ] Every image has descriptive, human-written alt text (no filenames)
- [ ] Unique `<title>` and meta description per page
- [ ] `sitemap.xml` submitted to Google Search Console
- [ ] `robots.txt` present and correct
- [ ] Contrast-checked palette (WebAIM/axe) on all text-over-photo sections
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

1. **Supabase:** create a project; store `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and a `SUPABASE_SERVICE_ROLE_KEY` (server-only, never in client bundle) in Vercel's environment variables.
2. **Vercel:** connect the GitHub repo; set up `main` → production, feature branches → preview deployments so the lodge owner can review drafts via shareable preview URLs before anything goes live.
3. **Domain/DNS:** confirm who controls the current registrar/DNS for `xhabesafarilodge.com`. Point the domain's A/CNAME records at Vercel only after Sprint 6 QA passes — plan the cutover window with the lodge owner in advance since email (`reservations@xhabesafarilodge.com`) must keep working through the switch (don't touch MX records when repointing the site's A/CNAME).
4. **Email sending domain:** verify the sending domain in Resend (SPF/DKIM records) so confirmation emails don't land in spam.
5. **Staging:** use Vercel preview deployments as staging — no need for a separate staging environment given the project size.

---

## 10. What This Doc Deliberately Does Not Decide

These are flagged in the audit as "open items to verify" and are genuinely outside what this plan can resolve without more input from the lodge owner — see §13 for the full resource list:
- Exact current 2026/2027 seasonal rates and deposit/cancellation policy
- Whether to pursue a real eco-certification or drop certification language entirely
- Whether deposits are collected online (Stripe) or remain "enquire, pay on arrival/EFT"
- Which channel manager (if any) to use for OTA sync in the "Next" roadmap phase

---

## 11. Resources & Decisions Needed Before/During Kickoff

**Accounts & access**
- [ ] Vercel account (Pro plan if the lodge wants password-protected preview URLs or team seats)
- [ ] Supabase account/project
- [ ] Domain registrar login or delegated DNS access for `xhabesafarilodge.com`
- [ ] Resend (or chosen ESP) account + verified sending domain
- [ ] Google Search Console access (or ability to verify a new property)
- [ ] Google Maps or Mapbox API key
- [ ] Stripe account — **only if** online deposits are chosen (§10)
- [ ] WhatsApp Business number — if the "WhatsApp Us" CTA is pursued (§5 Sprint 4)

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
- [ ] Online deposits (Stripe) vs. enquiry-then-manual-payment flow
- [ ] Whether/when to pursue OTA channel-manager integration (Next roadmap phase) and which provider
- [ ] Whether to pursue a formal eco-certification or drop certification-adjacent language
- [ ] Final confirmed brand hex values (pending DevTools extraction — do this immediately, before the old site risks going offline)
- [ ] Chosen typography pairing for the new design system
