-- ============================================================================
-- Xhabe Safari Lodge — baseline schema
--
-- See web/supabase/SCHEMA.md for a table-by-table description.
--
-- Access model: the public site reads content tables anonymously and writes
-- bookings/enquiries only through Next.js route handlers using the service
-- role key. Anonymous clients therefore get SELECT on content and nothing at
-- all on bookings/enquiries.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Lodge capacity
--
-- Single source of truth for chalet count, referenced by the availability
-- trigger below. Mirrors TOTAL_CHALETS / MAX_ADULTS_PER_CHALET in
-- web/src/lib/data/availability.ts — change both together.
-- ---------------------------------------------------------------------------
create or replace function total_chalets() returns int
  language sql immutable
  as $$ select 8 $$;

create or replace function max_adults_per_chalet() returns int
  language sql immutable
  as $$ select 2 $$;

/** Chalets required to sleep `guests` people. */
create or replace function rooms_needed(guests int) returns int
  language sql immutable
  as $$ select greatest(1, ceil(guests::numeric / max_adults_per_chalet())::int) $$;

-- ---------------------------------------------------------------------------
-- Content tables
-- ---------------------------------------------------------------------------

create table packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  -- URL segment for /packages/<slug>. Unique so detail routes are unambiguous.
  slug text not null unique,
  nights int not null check (nights > 0),
  min_pax int check (min_pax is null or min_pax > 0),
  description text,
  inclusions text[],
  -- Activity slugs from web/src/lib/data/activities.ts bundled into this package.
  activity_slugs text[],
  sort_order int,
  created_at timestamptz not null default now()
);

create table rate_seasons (
  id uuid primary key default gen_random_uuid(),
  season_name text not null,
  start_date date not null,
  end_date date not null,
  rate_single numeric(10, 2),
  rate_double numeric(10, 2),
  currency text not null default 'USD',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint rate_seasons_date_order check (end_date >= start_date)
);

-- Per-date capacity overrides. A date with no row here has total_chalets()
-- available; a row lets the lodge close dates or release fewer chalets.
create table availability (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  rooms_available int not null check (rooms_available >= 0),
  note text,
  created_at timestamptz not null default now()
);

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  source text not null,
  quote text not null,
  rating int check (rating between 1 and 5),
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table gallery_images (
  id uuid primary key default gen_random_uuid(),
  -- Either a path under /public/images/ or a Supabase Storage public URL.
  storage_path text not null,
  alt_text text not null,
  category text check (category in ('rooms', 'activities', 'views', 'dining')),
  -- Activity slugs this photo illustrates. Drives /gallery?activity=<slug> and
  -- the preview thumbnails on the Activities page. Null/empty = untagged.
  activity_tags text[],
  sort_order int,
  created_at timestamptz not null default now()
);

create table staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  bio text,
  photo_path text,
  sort_order int,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Guest submissions
-- ---------------------------------------------------------------------------

create table bookings (
  id uuid primary key default gen_random_uuid(),
  check_in date not null,
  check_out date not null,
  guests int not null check (guests > 0),
  -- Kept if a package is later deleted, so the booking record survives.
  package_id uuid references packages(id) on delete set null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  details text,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  constraint bookings_date_order check (check_out > check_in)
);

create table enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

-- Overlap lookups in the availability check filter on dates and status.
create index bookings_date_range_idx on bookings (check_in, check_out);
create index bookings_status_idx on bookings (status) where status <> 'cancelled';
-- Covering index for the package_id foreign key.
create index bookings_package_id_idx on bookings (package_id);
create index packages_sort_idx on packages (sort_order);
create index gallery_images_sort_idx on gallery_images (sort_order);
create index gallery_images_activity_tags_idx on gallery_images using gin (activity_tags);
create index rate_seasons_active_idx on rate_seasons (active, start_date);

-- ---------------------------------------------------------------------------
-- Double-booking guard
--
-- The API checks availability and then inserts, which leaves a window where two
-- concurrent requests can both pass the check and oversell the lodge. A simple
-- exclusion constraint won't do here: overlapping bookings are legitimate up to
-- the chalet count, so capacity has to be evaluated per night.
--
-- This trigger recomputes committed chalets for every night of the stay and
-- rejects the write if it would exceed that night's capacity. Cancelled
-- bookings are ignored, and an UPDATE excludes its own prior state.
-- ---------------------------------------------------------------------------
create or replace function enforce_chalet_capacity() returns trigger
  language plpgsql
  as $$
declare
  night date;
  capacity int;
  committed int;
  wanted int;
begin
  -- A cancellation frees capacity, so it never needs checking.
  if new.status = 'cancelled' then
    return new;
  end if;

  wanted := rooms_needed(new.guests);

  for night in
    select generate_series(new.check_in, new.check_out - interval '1 day', interval '1 day')::date
  loop
    select coalesce(
      (select a.rooms_available from availability a where a.date = night),
      total_chalets()
    ) into capacity;

    select coalesce(sum(rooms_needed(b.guests)), 0)
      into committed
      from bookings b
     where b.status <> 'cancelled'
       and b.id is distinct from new.id
       and b.check_in <= night
       and night < b.check_out;

    if committed + wanted > capacity then
      raise exception
        'Only % of % chalets remain on % — cannot commit % more.',
        capacity - committed, capacity, night, wanted
        using errcode = 'check_violation';
    end if;
  end loop;

  return new;
end;
$$;

create trigger bookings_capacity_guard
  before insert or update of check_in, check_out, guests, status on bookings
  for each row execute function enforce_chalet_capacity();

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- Policies target roles explicitly (`to anon, authenticated`) rather than
-- calling auth.role() per row — same effect, evaluated once per query.
-- ---------------------------------------------------------------------------

alter table packages        enable row level security;
alter table rate_seasons    enable row level security;
alter table availability    enable row level security;
alter table bookings        enable row level security;
alter table enquiries       enable row level security;
alter table testimonials    enable row level security;
alter table gallery_images  enable row level security;
alter table staff           enable row level security;

-- Public content: readable by anyone, writable only by signed-in admins.
create policy "Public read packages"       on packages       for select to anon, authenticated using (true);
create policy "Public read rate_seasons"   on rate_seasons   for select to anon, authenticated using (true);
create policy "Public read availability"   on availability   for select to anon, authenticated using (true);
create policy "Public read testimonials"   on testimonials   for select to anon, authenticated using (true);
create policy "Public read gallery_images" on gallery_images for select to anon, authenticated using (true);
create policy "Public read staff"          on staff          for select to anon, authenticated using (true);

create policy "Admin write packages"       on packages       for all to authenticated using (true) with check (true);
create policy "Admin write rate_seasons"   on rate_seasons   for all to authenticated using (true) with check (true);
create policy "Admin write availability"   on availability   for all to authenticated using (true) with check (true);
create policy "Admin write testimonials"   on testimonials   for all to authenticated using (true) with check (true);
create policy "Admin write gallery_images" on gallery_images for all to authenticated using (true) with check (true);
create policy "Admin write staff"          on staff          for all to authenticated using (true) with check (true);

-- Guest submissions hold personal data. No anonymous access whatsoever: the
-- site writes these through route handlers with the service role key, which
-- bypasses RLS. Signed-in admins can read and manage them.
create policy "Admin manage bookings"  on bookings  for all to authenticated using (true) with check (true);
create policy "Admin manage enquiries" on enquiries for all to authenticated using (true) with check (true);
