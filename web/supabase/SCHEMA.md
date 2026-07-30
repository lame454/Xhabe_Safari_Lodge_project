# Xhabe Safari Lodge — database schema

Supabase project **Xhabe_Safari_Lodge** (`zcdckolyrioxikdpcjui`, eu-central-1).

Migrations live in `web/supabase/migrations/` and are the source of truth. Apply
them in filename order.

| Migration | What it does |
|---|---|
| `20260719000000_init.sql` | Tables, indexes, capacity trigger, RLS |
| `20260730120000_seed_content.sql` | Packages, testimonials, staff, gallery rows |
| `20260730130000_harden_security.sql` | Pins function `search_path`, drops blanket write policies, revokes a public grant |

---

## Access model

The site never talks to the database from the browser. Two server-side paths:

- **Public content reads** — `createPublicClient()` in
  `src/lib/supabase/server.ts` uses the anon key. Cookie-free, so content pages
  can still render statically. Reaches only tables with a public `SELECT`
  policy.
- **Guest writes and availability** — `createAdminClient()` uses the service
  role key inside route handlers only (`/api/bookings`, `/api/enquiries`). It
  bypasses RLS, which is why `bookings` and `enquiries` need no policies at all.

Content is edited through the Supabase dashboard, which also bypasses RLS. There
is deliberately **no** `authenticated` write policy: the project has no sign-in
flow, so granting the `authenticated` role write access would only create a hole
the day auth is switched on. See the header comment in
`20260730130000_harden_security.sql` for how to add a real admin policy later.

Every data helper falls back to a hardcoded `FALLBACK_*` constant if its query
fails or returns nothing, so the site renders even with the database down or
unconfigured. Failures are logged; they are not silent.

---

## Content tables

All are publicly readable.

### `packages`
The stay packages. One row per package; drives `/packages`, `/packages/[slug]`,
the homepage teaser, and the booking form's dropdown.

| Column | Notes |
|---|---|
| `id` | uuid, PK |
| `name` | Display name |
| `slug` | **unique** — the `/packages/<slug>` URL segment |
| `nights` | > 0 |
| `min_pax` | Minimum guests, nullable |
| `description` | Short narrative |
| `inclusions` | `text[]`, rendered as the "Included" checklist |
| `activity_slugs` | `text[]` of slugs from `src/lib/data/activities.ts` |
| `sort_order` | Display order |

### `rate_seasons`
Seasonal pricing. **Currently empty by design** — the lodge's last published
rates expired in January 2025 and contradicted its agent listings, so no
numbers were seeded rather than seed wrong ones. While empty, the site renders
"Rates are quoted on enquiry". Insert one `active` row with the current season's
real rates to switch pricing on site-wide.

| Column | Notes |
|---|---|
| `season_name`, `start_date`, `end_date` | `end_date >= start_date` |
| `rate_single`, `rate_double` | `numeric(10,2)` |
| `currency` | Defaults to `USD` |
| `active` | The site reads the first active season by `start_date` |

### `gallery_images`
Photos for `/gallery` and the Activities page previews.

| Column | Notes |
|---|---|
| `storage_path` | Path under `/public/images/`, or a Storage public URL |
| `alt_text` | Also used as the lightbox caption |
| `category` | One of `rooms`, `activities`, `views`, `dining` — the filter tabs |
| `activity_tags` | `text[]` of activity slugs. **Currently all null** |
| `sort_order` | Display order |

`activity_tags` is what makes `/gallery?activity=<slug>` and the Activities page
thumbnails work. Tagging is pure data — no code change needed:

```sql
update gallery_images
   set activity_tags = array['river-boat-cruise']
 where storage_path = '/images/gallery-boat-cruise.jpg';
```

Until a slug has tagged photos, the Activities card falls back to its own image
and the gallery shows a "photos haven't been added yet" notice with the full
gallery, rather than an empty grid.

> **Review the seeded `alt_text` and `category` values.** They were carried over
> verbatim from the demo's fallback data and describe subjects the current photo
> files may not actually show. Revisit them alongside the photo refresh.

### `testimonials`
Guest quotes. `featured = true` rows feed the homepage quote band and
`/reviews`. `rating` is 1–5.

### `staff`
Team profiles for `/about`. `photo_path`, `role`, `bio`, `sort_order`.

### `availability`
**Capacity overrides only** — it is not a list of open dates. A date with no row
here has `total_chalets()` (8) available. Add a row to release fewer chalets or
close a date entirely:

```sql
-- Close 25 December
insert into availability (date, rooms_available, note)
values ('2026-12-25', 0, 'Closed — staff holiday');
```

---

## Guest submissions

No public access. Written only via the service role.

### `bookings`
| Column | Notes |
|---|---|
| `check_in`, `check_out` | `check_out > check_in` |
| `guests` | > 0 |
| `package_id` | FK → `packages`, `on delete set null` so bookings outlive packages |
| `first_name`, `last_name`, `email`, `phone` | Guest contact |
| `details` | Special requests |
| `status` | `pending` \| `confirmed` \| `cancelled` |

### `enquiries`
`name`, `email`, `message`, `handled`. The `/contact` form writes here.

---

## Capacity model and the double-booking guard

The lodge has **8 chalets, max 2 adults each**, so a party needs
`ceil(guests / 2)` chalets. Overlapping bookings are legitimate up to the chalet
count — an exclusion constraint would be wrong, because it forbids *any* overlap.

Three helper functions hold the numbers, mirroring `TOTAL_CHALETS` and
`MAX_ADULTS_PER_CHALET` in `src/lib/data/capacity.ts` — **change both
together**:

- `total_chalets()` → 8
- `max_adults_per_chalet()` → 2
- `rooms_needed(guests int)` → `ceil(guests / 2)`, minimum 1

`/api/bookings` checks availability and then inserts, which leaves a window
where two concurrent requests both pass the check and oversell the lodge. The
`bookings_capacity_guard` trigger closes it: on insert, or on update of dates /
guests / status, `enforce_chalet_capacity()` walks every night of the stay and
rejects the write if committed chalets plus the new booking would exceed that
night's capacity. Cancelled bookings are ignored; an update excludes its own
prior state.

The trigger raises `check_violation` (SQLSTATE `23514`), which
`/api/bookings` maps to **HTTP 409** with a "those dates were just taken"
message rather than a generic 500.

Verified against the live database: with 8 chalets committed for a night, a 9th
was rejected while an empty night still accepted a booking.

---

## Keeping the project awake

Free-tier Supabase projects pause after about a week of inactivity — this one
had already paused, which is what took the demo's backend down. The
`.github/workflows/supabase-keep-alive.yml` action pings `packages` twice weekly
to prevent it. It needs two repository secrets, and **fails if they are unset**:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Check the workflow's run history — if it has been failing, the project will pause
again.

---

## Environment variables

See `web/.env.local.example`. `SUPABASE_SERVICE_ROLE_KEY` is the one secret;
without it, availability checks and booking submission fail while the rest of
the site keeps working.
