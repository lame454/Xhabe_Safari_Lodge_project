# Xhabe Safari Lodge — Website Audit Report
**Site audited:** https://xhabesafarilodge.com/
**Purpose:** Full discovery pass ahead of a website redesign
**Date of audit:** 18 July 2026
**Method:** Live crawl of every discoverable page, third‑party listing cross‑checks (TripAdvisor, Expedia, Hotels.com, Facebook, SunSafaris, African Reservations), and competitor spot‑checks. No CMS/hosting admin access — findings on colors/fonts/performance are based on rendered output and standard platform behavior (see caveats in each section).

---

## 1. Executive Summary

Xhabe Safari Lodge is a small, well‑reviewed 8‑room tented lodge on the Chobe riverfront in Botswana (Muchenje/Ngoma area), built on **WordPress + Elementor**. The current site does a reasonable job describing the property in prose but has real structural problems: **a broken main nav link, duplicate/orphaned pages, a booking form built on the wrong kind of calendar plugin (hourly time‑slots instead of check‑in/check‑out dates), a full year of stale seasonal rates, dead social‑media links despite an active real Facebook page, inconsistent footer/company name, and no meta descriptions**. The visual content is a mix of genuine WhatsApp‑quality lodge photos and generic Pexels stock photos, with no consistent photography style. The overall design also reads as dated, with a weak typographic hierarchy, low contrast in places, repetitive "big photo + paragraph" sections, and very little CTA variety beyond a single "book now" path — findings from a second, independent visual review pass that align closely with the structural issues found here (§21). This is a good candidate for a full rebuild rather than a patch job — the underlying content (facilities, packages, itinerary, activities, and a strong base of off‑site guest reviews) is solid and reusable; it's the structure, booking mechanics, visual system, and storytelling around that content that need rebuilding.

---

## 2. Complete Sitemap & Navigation Structure

### 2.1 Top navigation (as rendered in header, left to right)

| Label in menu | Target URL | Resolves to | Status |
|---|---|---|---|
| Xhabe Safari Lodge (logo/site title) | `/` | Home | OK |
| About Us | `/?page_id=1137` | `/about-us/` | OK (query‑string link, not clean URL) |
| Xhabe Safari Lodge *(dropdown parent)* | `/xhabe-safari-lodge/` | itself | **Problem:** page has no unique content — loads only the sidebar widgets (About/Adventures/Categories), no real content of its own |
| ↳ Activities | `/activities-2/` | Activities page | OK, but slug has a stray "-2" suffix (leftover from a duplicated page) |
| ↳ Facilities | `/facilities/` | Facilities page | OK, but **broken images** on the page (see §11) |
| ↳ Accommodation | `/accommodation/` | Accommodation page | OK |
| ↳ Itinerary | `/?page_id=1214` | `/itinerary/` | OK (query‑string link) |
| Book With Us | `/?page_id=108` | — | **BROKEN — returns a 404 error** |
| Book With us | `/?page_id=1287` | `/book-with-us-2/` | OK — this is the real, working booking page |

**Key navigation findings:**
- There are **two "Book With Us" menu items** with near‑identical labels (capitalization differs: "Us" vs "us") — confusing and redundant. One of them (`page_id=108`) is **dead** and 404s.
- The working booking page's real slug is `/book-with-us-2/`, and a separate `/book-with-us/` URL (used elsewhere on the site, e.g. the homepage "Contact Us" button) canonically redirects to it — a sign an original page was duplicated and the old one abandoned rather than cleaned up.
- The dropdown parent "Xhabe Safari Lodge" duplicates the site's own name/logo label, which is disorienting — a visitor doesn't know it's a different link from the logo.
- Several nav links use raw `?page_id=` query strings instead of the clean permalinks (`/about-us/`, `/itinerary/`) that exist and are used as canonical URLs elsewhere. Cosmetic/SEO inconsistency.

### 2.2 Full list of discovered pages

1. **Home** — `/`
2. **About Us** — `/about-us/`
3. **Xhabe Safari Lodge** (empty parent/menu page) — `/xhabe-safari-lodge/`
4. **Activities** — `/activities-2/`
5. **Facilities** — `/facilities/`
6. **Accommodation** — `/accommodation/`
7. **Itinerary** — `/itinerary/`
8. **Book With Us** — `/book-with-us-2/` (canonical; also reachable via `/book-with-us/`)

No blog/news section, no dedicated Contact page, no Gallery page, no Testimonials/Reviews page, no Privacy Policy / Terms & Conditions, no FAQ page were found.

### 2.3 Footer structure (repeated identically on every page)
- "REACH US" block: postal address, email, phone
- "COME JOIN US" — a 6‑photo grid (not linked to actual social accounts, see §7.2)
- "Categories" widget: Boat Cruise, Game Drive, Village Tours/Tour, Victoria Falls Day Trip, Fishing, Canoe — this is a **WordPress blog‑category widget**, but the site has no blog/posts, so these almost certainly lead to empty archive pages. Leftover default theme functionality.
- Social icons: Twitter, Instagram (both are placeholder links, see §7.2)
- Copyright line — **inconsistent across pages** (see §12 Technical Observations)

---

## 3. Detailed Content Inventory

### 3.1 Home (`/`)
- Hero image + "GET IN TOUCH" tagline → **"VISIT THE MAGICAL XHABE SAFARI LODGE FOR A MEMORABLE STAY IN THE WILDERNESS"** with a **CONTACT US** button linking to the booking page.
- "WE ARE LOCATED ON THE EDGES OF Chobe National Park" section with a long descriptive paragraph covering: plateau location overlooking the Chobe floodplain/Namibia border, proximity to Chobe National Park (5 km), KAZA conservation area context, distance to Kasane Airport (70 km), Ngoma/Mabele village road, Ngoma border gate (5 km), distance to Victoria Falls (120 km) and Livingstone (120 km), general property description (chalets, campsite, restaurant, poolside dining), and a note that electricity/water/network coverage are available (an odd but telling detail for the region).
- Three "feature" callouts: **Sunset View**, **Tented Chalet**, **Wildlife** — each with a one‑line description.
- "RECONNECT WITH NATURE" — brand‑voice paragraph about escaping urban life.
- **BOOK NOW** CTA button → booking page.
- Photo strip of 6 images (mix of Facebook/WhatsApp photo and stock Pexels photos).
- Footer with contact info and category list (see §2.3).
- An exit/interstitial popup ("Don't Miss Out On This Opportunity" / "Got it!") appears on every page — see §11.

### 3.2 About Us (`/about-us/`)
- "Know About Us" intro paragraph: positions the lodge as elegant/tranquil, on a plateau over the Chobe floodplain and Namibia border, describes it as one of Botswana's favorite safari destinations, references wildlife conservation commitment and habitat diversity (savannah, woodlands).
- One large photo.
- Repeats the "About Us / Tel / Email" contact block and "Our Adventures" photo grid + Categories widget in the sidebar (same block reused across every page — see §12).

### 3.3 "Xhabe Safari Lodge" parent page (`/xhabe-safari-lodge/`)
- No unique body content at all — only the recurring sidebar widgets. Functionally this page should not be a clickable destination; it exists purely to hold the Activities/Facilities/Accommodation/Itinerary dropdown.

### 3.4 Activities (`/activities-2/`)
- 6‑photo strip, then activity names as headings with matching paragraph descriptions (headings and paragraphs are **not clearly paired visually in the underlying markup** — all 4 headings appear together, then all 4 descriptions together, relying entirely on Elementor's grid positioning to visually associate them; this is fragile for accessibility/screen readers — see §9):
 - **Game Drive** — open 4×4 morning/afternoon drives.
 - **Boat Cruise** — Chobe river channels/lagoons, elephants, mammals, birds.
 - **Victoria Falls** — full‑day trip to see the falls with a picnic lunch.
 - **Sunset Downer** *(sic — likely meant "Sundowner")* — evening drive with cocktails.
 - **Fishing and Canoe** — handcrafted canoe trip with a snack.
 - **Village Tour** — cultural visit to a local village/homestead.
 - **Swimming** — pool overlooking the floodplain.

### 3.5 Facilities (`/facilities/`)
- 7 images, **all broken** (empty `src`, see §11).
- Bulleted facilities list:
 - Rooms: 8 luxury tented rooms, 16 pax capacity, super king (2×3/4 bed), sleeps max 2/room.
 - Lounge area overlooking the river/border.
 - Camp site: 4 sites with an ablution block (3 toilets/1 urinal/3 showers male; 4 toilets/3 showers female, hot water).
 - Swimming pool.
 - Cocktail bar: seats 16, has satellite TV.
 - Dining: indoor + outdoor, Wi‑Fi available.
 - Laundry service.

### 3.6 Accommodation (`/accommodation/`)
- "ACCOMMODATION" H2 heading (the one page with a clear top‑level heading).
- 4 room photos (working image links, unlike Facilities).
- Description: intimate 8‑room lodge, tented rooms, super king 2×3/4 beds, max 2 adults/room, Wi‑Fi, upmarket standard.
- "EACH ROOM HAS THE FOLLOWING" bullet list: two private viewing decks (river/border view + lodge view), en‑suite bathroom, wooden floors/furniture, eco‑friendly amenities (foam, lotion, insect repellent, shampoo), quality linen, standing fan, mosquito nets, emergency horn, hanging space, luggage rack, 3 ventilation flaps, charging point, personal digital safe.
- **Content bug:** a stray literal backtick character appears in the list ("`Mosquito nets") — a copy‑paste/markdown formatting artifact visible in the live content.

### 3.7 Itinerary (`/itinerary/`)
- Intro line + 2 photos (Game Drive, Victoria Falls Day Trip).
- Day‑by‑day sample itinerary:
 - **Day One:** 1500 sunset game drive w/ sundowners, 3‑course dinner.
 - **Day Two:** early game drive or walk + breakfast; day activity = Victoria Falls OR Namibia/Katima Mulilo fishing trip; dinner outdoors.
 - **Day Three:** early game drive/walk + breakfast; village tour + basketry demo + pool/sunset.
 - **Day of Departure:** breakfast + game‑drive departure.

### 3.8 Book With Us (`/book-with-us-2/`) — the real booking page
Covered in full detail in §4 (Booking Workflow).

---

## 4. Booking Workflow Analysis

### 4.1 Page structure
1. Headline: **"BOOK WITH US FOR A ONCE IN A LIFETIME SAFARI EXPERIENCE"** + a **BOOK HERE** anchor‑link button that jumps down to the form (`#make-a-booking`).
2. **Package One** — 1 night, per‑person‑sharing, all meals, soft drinks/local beer, laundry, swimming, 2 activities/day of choice.
3. **Package Two** — 2 nights, min. 4 pax, all‑inclusive as above + Day 2 = Victoria Falls day trip + Kasane boat cruise.
4. **Package Three** — 3 nights, min. 4 pax, all‑inclusive + Day 2 Vic Falls/boat cruise + Day 3 = 2 activities + **Boma dinner with traditional dance** + stargazing.
5. **Rates table** — "RATES FOR 2023/2024, 10 January 2024 to 10 January 2025":

| Season | Dates | Rate |
|---|---|---|
| Low | 10 Jan 2023–31 Mar 2024 / 1 Nov 2024–10 Jan 2025 | $380 single / $600 double |
| Mid | 1 Apr–Jun 2024 | $450 single / $780 double |
| High | 1 Jul–31 Oct 2024 | $525 single / $840 double |
| Camping | 10 Jan 2024 (single date, likely a typo for a range) | $30 single |

6. **Booking widget** — a calendar/availability plugin with a legend (Available / Booked / Pending / Partially booked), then a form: **Time Slots** (hourly slots from 9:00 AM to 7:00 PM), First Name*, Last Name*, Email*, Phone, Details, Package selector (radio: Package 1/2/3), Send button.
7. A screenshot image (`Screenshot-2023-01-31…png`) embedded on the page — looks like a leftover reference image (possibly of a rates sheet or availability calendar) rather than intentional content.

### 4.2 Problems with the booking workflow
- **Wrong booking model:** The plugin's UI (hourly "Time Slots," a single‑day calendar, Available/Booked/Pending states) is built for appointment‑style bookings (e.g., spa treatments, restaurant tables), **not multi‑night lodge stays**. There's no check‑in date, check‑out date, number of nights, or number of guests field. A guest wanting to book "Package 2" (2 nights) has no way to specify which two nights, or how many people are in their party.
- **Stale rates:** The posted rate table's date range ends **10 January 2025** — over 18 months before this audit. Guests booking today would be looking at expired pricing with no visible 2025/2026 update, and the low/mid/high season date ranges as written are internally inconsistent (the "Low Season" row spans a range that overlaps 2023 and 2024 in a confusing way).
- **Price mismatch vs. third‑party listings:** External agent Sun Safaris lists rates from **$450–$750 per person per night sharing** — a different structure and different numbers than the site's own $380–$840 table. A prospective guest comparing the direct site to an agent site would see conflicting prices, which erodes trust and can push bookings toward the (commissioned) third party instead of direct bookings.
- **No deposit/cancellation policy, no currency clarification beyond "$"** (USD implied but not stated), no children's policy, no minimum‑age policy (competitor Muchenje Safari Lodge, a few km away, publishes a clear children's/minimum‑age policy).
- **No confirmation/next‑steps messaging** near the form — a guest doesn't know what happens after clicking Send (email reply? phone call? within how long?).
- **Duplicate entry points:** two nav links point at booking (one broken, §2.1), plus the homepage "CONTACT US" and "BOOK NOW" buttons both go to the *booking* page rather than one going to an actual contact/enquiry page — there is no way to simply ask a question without going through the full package/rates page.
- **Reliability risk evidenced externally:** A guest review on Expedia for this property reports arriving to find **no record of a prepaid booking**, requiring the lodge to arrange emergency alternative accommodation. This doesn't necessarily indict the on‑site form itself, but it strengthens the case for a redesign that includes real‑time availability sync and automatic confirmation emails, rather than a simple "Send" button with unclear back‑end handling.

---

## 5. Business Information Extracted

- **Name:** Xhabe Safari Lodge
- **Address:** P O Box 90, Kasane, Botswana (postal); physical location cited elsewhere as Plot 1504, Muchenje, Chobe Region, Ngoma
- **Email:** reservations@xhabesafarilodge.com
- **Phone:** +267 75 497 183
- **Location description:** Plateau overlooking the Chobe River floodplain and the Namibia border, ~5 km from the eastern boundary of Chobe National Park, within the KAZA Transfrontier Conservation Area, ~70 km from Kasane International Airport, ~5 km from Ngoma border gate, ~2 km from a forest reserve, ~120 km from Victoria Falls (Zimbabwe) and Livingstone (Zambia)
- **Property size:** 8 luxury tented rooms (16‑pax capacity) + 4 campsites with separate male/female ablution blocks
- **Facilities:** pool, cocktail bar (16‑seat, satellite TV), indoor/outdoor dining, Wi‑Fi, laundry
- **Activities offered:** game drives, boat cruises, Victoria Falls day trips, sundowners, canoeing, fishing, village tours, swimming
- **Sample packages:** 1‑night, 2‑night, and 3‑night all‑inclusive packages (details in §4.1)
- **Real, active Facebook Page** (not linked from the site): facebook.com/xhabesafarilodge — 1,716 likes at time of audit
- **Listed on:** TripAdvisor (rated 5/5 across two separate/duplicate listings — see §13), Expedia, Hotels.com, Sun Safaris, African Reservations, Speedbird Travels
- **Guest sentiment (from TripAdvisor/Expedia):** overwhelmingly positive — praise for the food, staff (named individuals recur: "Maatla," "Beauty," "Mr. S," "Gaba"), views, and the canoe/game‑drive experience; minor gripes about no bathroom door/curtain in one review and pool cleanliness in another.

---

## 6. Brand Identity Analysis

- **Name origin:** "Xhabe" appears to be a local/indigenous place or personal name (consistent with regional naming conventions in the Chobe/Caprivi area); the site does not explain the name's meaning or origin anywhere — a missed storytelling opportunity for a redesign.
- **Positioning/voice:** Consistently nature‑and‑tranquility focused — repeated language: "reconnect with nature," "tranquil," "elegant," "wilderness," "million‑dollar sunset," "once in a lifetime." The tone is warm and descriptive but has recurring grammar/spelling issues that undercut the "elegant" positioning it's going for (see §12).
- **Logo:** Text‑based site title ("Xhabe Safari Lodge") used as the logo in the header — no distinct graphic mark/icon identified in the crawl.
- **Tagline/value prop:** Not consistently stated — closest is "BOOK WITH US FOR A ONCE IN A LIFETIME SAFARI EXPERIENCE" on the booking page, and "RECONNECT WITH NATURE" on the homepage. These read as two different headline concepts rather than one unified tagline.
- **Photography identity:** No consistent visual identity — genuine lodge photos (WhatsApp‑exported, moderate quality, inconsistent aspect ratios/crops) are mixed with unrelated Pexels stock photos (credited in filenames: `pexels-piet-bakker`, `pexels-magda-ehlers`, `pexels-leif-blessing`, generic elephant stock photography) that don't depict the actual property. A rebrand should standardize on real, professionally shot property photography.
- **Storytelling gap:** The copy is thorough on *logistics* (distances, GPS coordinates, border proximity, KAZA conservation‑area context) but tells almost no story about the *lodge itself* — there's no founding/ownership story, no explanation of what "Xhabe" means or comes from, no staff introductions, and no elaboration on the conservation commitment beyond a single passing sentence on the About page. This is a missed opportunity: TripAdvisor/Expedia reviews repeatedly name specific staff (Maatla, Beauty, Lindi, Antony, "Mr. S," Gaba) and praise the personal touch, but none of that comes through on the site itself. A "Meet the Team" or "Our Story" module would let the redesign do more of the trust‑building the reviews are already doing for free off‑site.

---

## 7. Typography & Color Palette

**Caveat up front:** this audit was performed by crawling and rendering page content and metadata; it did not include direct browser DevTools/CSS‑file inspection (the live CSS/font files aren't exposed through the crawl tooling used here). The notes below are the most reliable signals available and should be **confirmed with a quick DevTools inspection** (2 minutes) before being locked into a design system.

### 7.1 Typography
- The site is built with **Elementor 3.30.3**, with **Google Fonts enabled** (`google_font-enabled` flag present in the page's rendering settings) and `font_display: auto`. This means the type is served from Google Fonts rather than a custom/self‑hosted webfont — the specific family/weights are set in the Elementor theme style settings and weren't exposed by the crawl.
- Heading‑level usage is **inconsistent site‑wide**: some key headlines are marked up as `<h5>` (e.g., the homepage's main hero line, the About Us intro) while only two pages (Accommodation, Book With Us) use a proper top‑level `<h1>`/`<h2>`. This is a semantic/SEO/accessibility issue independent of which font is chosen (see §9).
- `font_display: auto` is a minor performance issue — `swap` is generally preferred so text isn't invisible while the webfont loads (see §10).

### 7.2 Color palette
- Exact hex values were not extractable via this audit method (no direct stylesheet access). Based on the site's imagery and typical conventions for this style of Elementor safari/lodge template, the functional palette reads as: a **dark, earthy base** (deep green/charcoal/brown) for header and footer bands, an **off‑white/cream** for body backgrounds and text panels, and **warm sunset‑orange/amber accents** for buttons and highlighted headings — consistent with the "sunset," "river," and "wilderness" imagery used throughout.
- **Recommendation:** before final sign‑off on a design system, pull the exact values directly from the live site via browser DevTools (Inspect → Computed styles on the header, buttons, and body text) rather than relying on this estimate. This takes a few minutes and removes all doubt.

### 7.3 Overall visual design impression (cross‑checked against a second, browser‑based review)
This audit was produced from a crawl/render pipeline without full browser DevTools access, so it couldn't independently score "how dated does this look" or measure on‑screen contrast ratios directly. A separate visual pass (performed in‑browser, with full sight of the rendered design) flagged three things worth carrying into the rebuild brief as corroborated, higher‑confidence findings:
- **Dated visual design overall** — consistent with this audit's structural findings: a stock 2020‑era Elementor "full‑width hero + stacked info‑box" template pattern, no distinct graphic logo mark (§6), and a color/type system that was never fully finished (see the placeholder "Your Company LLC" footer text in §16).
- **Weak typographic hierarchy** — this matches and reinforces §7.1/§9's finding that headline‑level headings are rendered as low‑priority tags (`<h5>`) with no `<h1>`/`<h2>` structure on most pages; the visual weight problem and the semantic‑markup problem are almost certainly the same underlying issue.
- **Low visual contrast in places** — plausible and worth prioritizing, especially given the site's heavy use of text‑over‑photo hero sections (a very common contrast‑failure pattern, see §12). Treat this as "likely true, confirm with an automated contrast checker (e.g., WebAIM or axe DevTools) against the final rendered pages" rather than a fully quantified finding.

---

## 8. UI Components Inventory

- Sticky/standard header with logo + horizontal nav + one dropdown submenu
- Full‑width hero image sections with overlay text and a single CTA button (repeated pattern: image left/right + text block, alternating — classic Elementor "info box" / two‑column layout)
- Icon‑free bullet lists (facilities, room features, package inclusions) — plain `<ul>` styling, no custom icons or checkmarks used despite Elementor supporting icon lists
- Image grid/gallery blocks (2×3 or similar grids) reused in every page's sidebar ("Our Adventures")
- A pricing/rate **table** (HTML table, not a styled pricing‑card component)
- A booking/availability **calendar widget** with a color‑coded legend (Available/Booked/Pending/Partially booked)
- A **form** (first name, last name, email, phone, message/details, radio‑button package selector, submit)
- A sitewide **popup/modal** ("Don't Miss Out On This Opportunity") with a single "Got it!" dismiss button — appears to fire on every page load
- Footer with three columns (contact info, photo grid, category list) + social icons + copyright bar

---

## 9. Layout Patterns

- Overall structure follows a conventional Elementor "brochure site" pattern: full‑bleed hero → alternating image/text sections → footer, repeated per page with only the main content block swapped out.
- The **sidebar block (About Us contact card + "Our Adventures" photo grid + Categories list) is duplicated on literally every single page**, including pages where it's redundant (e.g., it appears again on the About Us page itself, right next to the "About Us" heading it duplicates). This bloats every page and adds no page‑specific value.
- Activities page layout separates all 4 image/heading pairs from all 4 description paragraphs into two stacked groups rather than interleaving heading+description+image as a repeating unit — fragile positioning that depends entirely on the grid staying in sync, and hard to follow for screen‑reader users or with keyboard navigation.
- No consistent grid system for images (some are cropped to 768×1024, others 1024×683, others 768×512) — this is more a media‑pipeline issue (§11) than a page‑layout issue but affects perceived visual consistency.

---

## 10. Image & Media Audit

- **Broken images:** the entire **Facilities** page's 7 images have empty `src` attributes — every image is broken for every visitor. This is likely from a plugin/CDN change, a media‑library reorganization, or an Elementor sync issue after a migration.
- **Stock vs. real photography:** a large share of imagery across Home, About, and Activities is generic Pexels stock (elephants, generic pool/riverfront shots) rather than the actual lodge. Meanwhile Accommodation and Book‑With‑Us pages use real, WhatsApp‑exported photos of the actual property (filenames like `IMG-20221030-WA0011`). The mix is inconsistent and some stock photos don't match the described setting.
- **Inconsistent sizing/aspect ratios:** images range from 512px to 1024px wide with mismatched crops (portrait 768×1024 next to landscape 1024×683), suggesting no defined image style guide or content pipeline.
- **Missing/poor alt text:** several images render with their raw camera/stock filenames doing double duty as their accessible name (e.g. "elephant-herd-of-elephants-african-bush-elephant-africa-59989-2," "pexels-piet-bakker-88234-2") rather than a human‑written, descriptive alt attribute — bad for both accessibility and image‑search SEO.
- **Oversized/legacy assets:** a dated screenshot (`Screenshot-2023-01-31-at-21.31.50.png`) is embedded directly in the live Book With Us page — looks like a leftover reference/proof image rather than intentional guest‑facing content.
- **Favicon/social‑preview image** (`msapplication-TileImage`) is a WhatsApp export photo (`IMG-20220601-WA0047.jpg`), not a purpose‑made icon/logo mark.

---

## 11. SEO Audit

- **No meta description tag** was found on any crawled page — every page will get a Google‑generated snippet instead of a controlled one, which hurts click‑through from search results.
- **Title tags exist but are inconsistent and sometimes duplicated:** e.g., the empty parent page's title is literally "Xhabe Safari Lodge – Xhabe Safari Lodge." Titles otherwise follow a simple "Page Name – Xhabe Safari Lodge" pattern, which is fine but could be more descriptive/keyword‑rich (e.g., include "Chobe," "Botswana safari lodge," etc.).
- **Heading hierarchy problems:** most pages skip `<h1>` entirely or use lower‑level headings (`<h5>`) for the primary headline, which weakens on‑page SEO signal to search engines about page topic (see §9 for the accessibility angle on the same issue).
- **Duplicate/near‑duplicate content:** the About Us page and the empty "Xhabe Safari Lodge" parent page both existing (one with content, one without) plus the `/book-with-us/` vs `/book-with-us-2/` situation are the kind of thing that can create duplicate‑content or crawl‑budget confusion for search engines, though canonical tags are correctly in place pointing to the "real" version in each case (a small silver lining — someone did at least set canonicals).
- **Query‑string nav links** (`?page_id=1137`, `?page_id=1214`, `?page_id=108`) instead of the clean permalinks that demonstrably exist for those same pages — no functional SEO harm since canonical tags resolve correctly, but it's untidy and makes shared/copied links look unprofessional.
- **No sitemap.xml or robots.txt was reachable during this audit** (not confirmed absent, but not surfaced through search indexing either) — worth explicitly verifying and submitting a sitemap to Google Search Console as part of the rebuild.
- **Third‑party listing inconsistency hurts local SEO/trust:** the lodge is listed as two separate, seemingly duplicate entries on TripAdvisor, and pricing differs between the official site and agent sites (Sun Safaris) — inconsistent NAP (name/address/phone) and pricing signals across the web can dilute local search authority.
- **Google indexing appears thin:** a `site:xhabesafarilodge.com` search returned very limited results, suggesting either low crawl frequency, low authority/backlinks, or indexing issues — worth a proper Search Console audit at rebuild time.

---

## 12. Accessibility Audit (WCAG)

- **Heading structure (WCAG 1.3.1 – Info and Relationships):** Non‑sequential/skipped heading levels (jumping straight to `<h5>` with no `<h1>`–`<h4>` present) on most pages. Screen reader users navigating by heading will find a confusing or flat document outline.
- **Image alt text (WCAG 1.1.1 – Non‑text Content):** Multiple images rely on raw filenames as their accessible name instead of meaningful alt text; the entirely broken Facilities images will announce as broken/empty to assistive tech with no fallback description.
- **Content‑to‑layout dependence (WCAG 1.3.2 – Meaningful Sequence):** The Activities page groups all headings together then all body paragraphs together, relying purely on visual grid position to associate a heading with its paragraph — a screen reader will read four headings in a row, then four unrelated paragraphs in a row, losing the pairing entirely.
- **Generic link text:** several link labels are non‑descriptive out of context and duplicated (e.g., two links both effectively labeled "Book With Us"), which is confusing for screen‑reader users who navigate by a list of links (WCAG 2.4.4/2.4.9 – Link Purpose).
- **Form labeling:** the booking form's fields (Time Slots, First Name, Last Name, Email, Phone, Details) should be checked for proper `<label>`/`for` association and clear required‑field indication beyond a plain asterisk (WCAG 1.3.1, 3.3.2).
- **Popup/modal:** the sitewide "Don't Miss Out" popup should be checked for keyboard dismissibility, focus trapping, and whether it returns focus to the triggering element on close (WCAG 2.1.2, 2.4.3) — common failure points for this class of popup plugin.
- **Color contrast:** could not be verified without direct style access (see §7), but should be checked as part of the rebuild given the site's use of image‑overlay text, which is a frequent contrast‑failure pattern.

---

## 13. Mobile Responsiveness Review

- The site includes a proper responsive viewport meta tag (`width=device-width, initial-scale=1`) and Elementor's rendering settings reference **"additional custom breakpoints,"** meaning whoever built the site did configure some non‑default responsive breakpoints — a reasonable baseline.
- That said, several structural issues will be more painful on mobile specifically:
 - The duplicated sidebar block (contact card + photo grid + categories) that repeats on every page adds significant extra scrolling on mobile, where it's least useful.
 - The Activities page's "all headings, then all paragraphs" layout (§9) is a pattern that's especially prone to falling out of visual sync when Elementor's columns stack vertically on small screens — worth a manual phone check.
 - Large image assets served at fixed 1024px widths (§11) are heavier than necessary for mobile viewports if no responsive `srcset` sizing is in place — worth confirming in DevTools' Network tab on a throttled mobile profile.
 - The booking form/calendar widget, given it wasn't designed for multi‑night stays to begin with, should be specifically checked for usability on a small touchscreen (date pickers and hourly time‑slot lists are common sources of mobile friction).

---

## 14. Performance Observations

*(No direct Lighthouse/PageSpeed run was available for this domain at time of audit; the following are structural risk factors observed directly.)*

- **WordPress + Elementor** is a heavier stack than a static or headless build — expect a meaningful amount of render‑blocking CSS/JS from Elementor's front‑end framework plus any additional plugins (the booking/calendar plugin, the popup plugin, and whatever handles the "Categories" widget).
- **Unoptimized image delivery risk:** filenames and dimensions observed (e.g., `768x1024`, `1024x683`, `1024x570`) suggest images are served as standard JPEGs/PNGs rather than modern formats (WebP/AVIF) with responsive `srcset` — a common, easy performance win in a rebuild.
- **`font_display: auto`** on the Google Fonts load (§7.1) can cause a flash of invisible text on slower connections; switching to `swap` is a trivial fix.
- **A sitewide popup plugin plus a separate booking/calendar plugin** both add their own JS/CSS payload to every page load, even on pages where booking isn't the goal (e.g., the popup fires even on the About Us page).
- **Recommendation:** run an actual PageSpeed Insights / Lighthouse pass on the live URLs before finalizing the rebuild's technical requirements, to get real Core Web Vitals numbers (LCP/CLS/INP) rather than relying on structural inference alone.

---

## 15. UX Problems (Summary)

1. Broken main‑navigation link ("Book With Us" → 404).
2. Two nav items competing for the same "booking" destination, with different capitalization, and neither pointing to a general "Contact / Enquire" option for guests who aren't ready to see rates yet.
3. A booking form modeled on appointment time‑slots rather than multi‑night check‑in/check‑out — the single biggest workflow mismatch on the site.
4. Rates table over a year out of date, with an internally confusing date‑range layout.
5. Price mismatch between the official site and a major agent (Sun Safaris) listing.
6. Entire Facilities page image gallery broken.
7. A parked, contentless page sitting in the main navigation dropdown.
8. A sitewide popup with vague, unexplained copy ("Don't Miss Out On This Opportunity") and no stated offer.
9. Heavy content duplication (same sidebar block on every single page) that adds scroll length without adding information.
10. No dedicated Contact page, FAQ, Gallery, or Reviews/Testimonials page — despite genuinely strong guest reviews existing on TripAdvisor/Expedia that could be doing real marketing work on‑site.
11. Real, active Facebook presence (1,716 likes) not linked anywhere on the site; footer social icons point to generic, non‑account URLs (`twitter.com`, `instagram.com`).
12. Minor copy/proofreading issues throughout ("Boarder" for "border," "Sunset Downer" for "Sundowner," a stray backtick character in a bullet list, "spices" for "species") that undercut the "elegant" brand positioning the copy is going for.
13. **Limited call‑to‑action variety:** effectively every CTA on the site ("CONTACT US" on the homepage hero, "BOOK NOW" further down, "BOOK HERE" on the booking page) routes to the same single destination. There's no lighter‑weight CTA for someone earlier in the decision (e.g., "Check Availability," "View Gallery," "Chat with us on WhatsApp," "Download a Brochure") — every visitor is funneled straight to the full rates/packages page whether they're ready for it or not.
14. **Heavy reliance on large hero photos as the main design device:** almost every section is "big photo + short paragraph," with no supporting icons, illustrations, maps, video, or data visualizations (e.g., a simple map graphic instead of a paragraph of driving distances, or an icon row instead of a plain bullet list for room amenities). This makes pages feel repetitive to scroll through and puts most of the page‑weight burden on images rather than lighter, more varied UI elements.

---

## 16. Technical Observations

- **Copyright/footer inconsistency:** the homepage footer reads *"© 2022 Xhabe Safari Lodge Created by Buddicom Holdings (Pty) Ltd,"* while every other crawled page reads *"© 2022 Your Company LLC · Website designed by Buddicom"* (linking to `anarieldesign.com`) — a clear sign of an unfinished template swap where the placeholder "Your Company LLC" text was never replaced, and the designer credit/link is inconsistent between pages.
- **Copyright year frozen at 2022** across a site with content (rates, photos) dated as late as 2024 — another sign of a template setting that was set once and never revisited.
- **Duplicated/leftover pages and slugs:** `/activities-2/` and `/book-with-us-2/` slug numbering strongly suggests earlier versions of these pages exist or existed and were never cleaned up (common when content is rebuilt in Elementor by duplicating a page rather than editing in place).
- **Legacy WordPress blog scaffolding** (the "Categories" widget) persists with no actual blog in use.
- **Built on Elementor 3.30.3** (a page‑builder plugin) rather than a custom theme or headless architecture — fine for content editing ease, but it's the direct cause of several issues above (heavier front‑end payload, arbitrary heading‑level choices, widget duplication across pages).
- **No apparent multi‑language support**, relevant given the international guest mix evident in reviews (South African, European, North American visitors referenced).

---

## 17. Missing Pages / Features

- Dedicated **Contact Us** page (separate from the booking/rates page) with a simple enquiry form
- **Gallery** page with a proper, curated set of real property photos
- **Guest Reviews / Testimonials** page — genuinely strong 5★ TripAdvisor content exists off‑site and isn't leveraged on‑site at all
- **FAQ** page (transport/transfers, what's included, children's policy, payment/deposit terms, visa/border logistics given the Botswana/Namibia border proximity)
- **Blog/News** — or removal of the leftover Categories widget if not planned
- **Privacy Policy / Terms & Conditions / Booking Terms** pages (increasingly expected, and relevant given the site collects personal data via the booking form)
- **Real-time availability calendar** appropriate to a lodge booking model (check‑in/check‑out based, not hourly slots)
- **Multi-currency or at least clearly labeled currency** on the rates table
- **Map/directions widget** — given how much of the copy is devoted to describing the (fairly remote) location, an embedded map would do that job better than prose
- **Social proof / logos** for the OTA platforms it's listed on (TripAdvisor, Expedia, etc.)
- Functioning, correctly linked social icons (Facebook in particular, given the active page)
- **Trust badges / certifications / awards:** a targeted search turned up no formal eco‑certification, tourism‑board award, or third‑party accreditation for Xhabe specifically (OTA sites like Hotels.com show a generic algorithmic "eco‑friendliness" *review score*, which is not the same as a real certification, e.g. Botswana Tourism Organisation eco‑rating, Fair Trade Tourism, or similar). Two options for the redesign: pursue an actual certification worth displaying, or drop the idea rather than implying credentials the property doesn't hold.

---

## 18. Competitor Comparison (Light Touch)

| | **Xhabe Safari Lodge (current site)** | **Muchenje Safari Lodge** (nearby, ~similar size) | **Chobe Safari Lodge** (larger, Kasane) |
|---|---|---|---|
| Booking system | Broken multi‑night workflow using an hourly‑slot plugin | Primarily "contact us to book" / OTA‑driven, no direct real‑time booking either | Larger operation, more OTA/agent distribution, professional third‑party booking integrations common at this scale |
| Reviews on‑site | None (all off‑site on TripAdvisor/Expedia) | Similarly light on‑site review content | More marketing content overall, given larger scale |
| Photography | Mixed real + stock, inconsistent | Professional, consistent, on‑brand photography | Professional photography, larger galleries |
| Social presence | Real Facebook page, not linked from site | — | Actively used and linked |
| Rates transparency | Outdated table, mismatched vs. agent pricing | Rates generally quoted on enquiry, less public‑table exposure | Rates quoted via OTAs, dynamic pricing |

**Takeaway:** Xhabe's direct booking attempt is more ambitious than some of its close neighbors (who mostly rely on "enquire" contact forms and OTA distribution), but the current implementation undermines that ambition. A rebuild that gets a *correctly modeled* real‑time booking calendar right would actually be a competitive advantage in this specific micro‑market, not just a fix.

---

## 19. Recommendations for the Redesign

**Content & structure**
1. Consolidate navigation to: Home · About · Accommodation · Activities · Facilities · Itinerary · Gallery · Reviews · Contact/Book — remove the empty parent page and the duplicate "Book With Us" entry.
2. Split "Book With Us" into two clear paths: a simple **Contact/Enquire** page for questions, and a proper **Book Now** flow for guests ready to check availability.
3. Add a Gallery and a Reviews/Testimonials page pulling in the genuinely strong TripAdvisor content.
4. Rewrite copy for consistent tone and fix recurring typos ("border," "Sundowner," "species").

**Booking system**
5. Replace the appointment‑style plugin with a **stay‑based booking engine** (check‑in/check‑out date range, number of guests, room/package selector, live availability, automatic confirmation email) — ideally one that can sync with OTA channels (Expedia/Booking.com/TripAdvisor) to avoid the kind of "no record of booking" incident surfaced in guest reviews.
6. Refresh and simplify the rates table with current‑year pricing, clear currency labeling, and a stated deposit/cancellation policy; reconcile pricing with third‑party agent listings so guests see consistent numbers everywhere.

**Design system**
7. Establish one clear color palette and type system (extract exact values via DevTools, don't guess) and apply it consistently — including fixing the arbitrary heading‑level choices so `<h1>`–`<h3>` are used meaningfully on every page, and running an automated contrast check on the final palette against text‑over‑photo hero sections.
8. Commission or curate a single consistent photography set from the real property; drop the mismatched stock photography, and vary the page design beyond repeating "big photo + paragraph" (icon rows for amenities, an embedded map for location/directions, a short video or guest‑quote callouts).
9. Add a tiered set of calls‑to‑action (e.g., "Check Availability," "View Gallery," "WhatsApp Us," "Download Brochure") instead of funneling every click to the same rates page, and add a short "Our Story" / "Meet the Team" module that puts names and faces to the staff guests already praise on TripAdvisor and Expedia.

**Technical & SEO**
10. Add unique meta descriptions and a submitted XML sitemap; fix the duplicate/orphaned page slugs (`-2` suffixes); ensure canonical tags remain correct after the rebuild.
11. Fix and standardize the footer (correct, single company/copyright line, current year, correct designer credit if desired) and link real social accounts (Facebook in particular).
12. Fix broken image sources on the Facilities page (or rebuild that page from scratch, since it's a good candidate anyway).
13. Set Google Fonts to `font-display: swap`, serve responsive images (WebP/AVIF with `srcset`), and re‑audit performance with a real Lighthouse/PageSpeed pass once the new build is in staging.

**Accessibility**
14. Pair headings and body copy in the markup (not just visually), write descriptive alt text for every image, ensure the booking form and popup are fully keyboard‑ and screen‑reader‑accessible, and check color contrast once the final palette is locked in.

---

## 20. Open Items to Verify Before Design Sign‑off
- Exact brand colors/fonts via DevTools (this audit gives a directional estimate only, see §7)
- Live PageSpeed/Lighthouse scores (§14)
- Whether `robots.txt`/`sitemap.xml` currently exist (§11)
- Current, correct 2026/2027 seasonal rates and deposit/cancellation policy, direct from the lodge owner
- Which booking/calendar plugin is currently installed, and whether it supports being reconfigured for date‑range bookings vs. needing full replacement

---

## 21. Cross‑Check Against a Second Independent Review Pass

A second, browser‑based review of the site was run independently and flagged the following. Reconciling it against this audit:

| Second review's finding | Reconciliation |
|---|---|
| Inconsistent page hierarchy | **Confirmed, already covered** — see §9 (nav structure), §7.1/§9 (heading‑level misuse), §11 (SEO impact). |
| Outdated visual design | **Corroborated, added** — this audit couldn't independently score "dated‑ness" without full DevTools access; now added as §7.3 with the structural evidence that supports it (unfinished placeholder footer text, generic 2020‑era Elementor template pattern, no distinct logo mark). |
| Weak typography hierarchy | **Confirmed, already covered** — see §7.1 and §9; likely the same root cause as the "outdated design" and "low contrast" findings. |
| Low visual contrast in places | **Corroborated, added** — flagged in the original draft as "unverifiable without style access"; now upgraded to a likely‑true finding pending an automated contrast check (§7.3). |
| Repetitive footer content | **Confirmed, already covered** — see §9 (the duplicated sidebar block on every page) and §13 (mobile scroll‑length impact). |
| Outdated rates (2023/2024 still displayed) | **Confirmed, already covered in detail** — see §4.2, including the internal date‑range inconsistency and the mismatch vs. third‑party agent pricing. |
| Weak booking experience | **Confirmed, already covered in detail** — see §4, which goes further to identify the *specific* mechanism (an hourly appointment‑slot plugin used for a multi‑night lodge product). |
| Heavy reliance on large images | **Added** — now called out explicitly as a design‑variety issue in §15 (point 14), in addition to the pre‑existing performance angle in §14. |
| Limited calls‑to‑action | **Added** — now called out explicitly in §15 (point 13). |
| Basic navigation | **Confirmed, already covered in more depth** — see §2.1 (broken link, duplicate menu items, query‑string URLs, orphaned parent page). |
| Minimal storytelling about the lodge | **Added** — new finding in §6 (Brand Identity), tied to the staff/guest‑experience detail already sitting in third‑party reviews but absent from the site. |
| Limited trust‑building elements (reviews, awards, certifications, FAQs) | **Confirmed and extended** — reviews/FAQ gap already covered in §17; this pass added a specific check for formal certifications/awards, which came back empty (§17). |
| Sparse accessibility features | **Confirmed, already covered in much greater depth** — see §12 (full WCAG pass: heading structure, alt text, content‑sequence, link text, forms, popup focus handling, contrast). |
| Opportunity for stronger SEO structure | **Confirmed, already covered in much greater depth** — see §11 (meta descriptions, heading hierarchy, duplicate content, indexing, third‑party NAP consistency). |

**Net result:** the two passes agree on every point raised; nothing in the second review contradicts this report. The main value‑add from the cross‑check was (a) explicit confirmation that the visual design genuinely reads as dated and low‑contrast to a human eye looking at the rendered page — not just inferable from structural clues — and (b) two new, concrete additions: the lack of CTA variety/heavy image‑only design language, and the absence of any real lodge storytelling or verifiable certifications. Both have been folded into the relevant sections above and into the recommendations in §19.
