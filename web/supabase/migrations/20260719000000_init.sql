-- Create packages table
create table packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  nights int not null,
  min_pax int,
  description text,
  inclusions text[],
  sort_order int,
  created_at timestamptz default now()
);

-- Create rate_seasons table
create table rate_seasons (
  id uuid primary key default gen_random_uuid(),
  season_name text not null,
  start_date date not null,
  end_date date not null,
  rate_single numeric,
  rate_double numeric,
  currency text default 'USD',
  active boolean default true,
  created_at timestamptz default now()
);

-- Create availability table
create table availability (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  rooms_available int not null check (rooms_available >= 0),
  created_at timestamptz default now()
);

-- Create bookings table
create table bookings (
  id uuid primary key default gen_random_uuid(),
  check_in date not null,
  check_out date not null,
  guests int not null check (guests > 0),
  package_id uuid references packages(id),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  details text,
  status text default 'pending', check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz default now(),
  check (check_out > check_in)
);

-- Create enquiries table
create table enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

-- Create testimonials table
create table testimonials (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  source text not null,
  quote text not null,
  rating int check (rating >= 1 and rating <= 5),
  featured boolean default false,
  created_at timestamptz default now()
);

-- Create gallery_images table
create table gallery_images (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  alt_text text not null,
  category text check (category in ('rooms', 'activities', 'views', 'dining')),
  sort_order int,
  created_at timestamptz default now()
);

-- Create staff table
create table staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  bio text,
  photo_path text,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table packages enable row level security;
alter table rate_seasons enable row level security;
alter table availability enable row level security;
alter table bookings enable row level security;
alter table enquiries enable row level security;
alter table testimonials enable row level security;
alter table gallery_images enable row level security;
alter table staff enable row level security;

-- Policies for public read-only tables
create policy "Allow public read access on packages" on packages for select using (true);
create policy "Allow public read access on rate_seasons" on rate_seasons for select using (true);
create policy "Allow public read access on availability" on availability for select using (true);
create policy "Allow public read access on testimonials" on testimonials for select using (true);
create policy "Allow public read access on gallery_images" on gallery_images for select using (true);
create policy "Allow public read access on staff" on staff for select using (true);

-- Admin policies (Restricted write access to authenticated users / dashboard admins)
-- (Note: Server-side route using service_role key bypasses RLS entirely for inserting bookings/enquiries)
create policy "Allow authenticated insert on packages" on packages for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update on packages" on packages for update using (auth.role() = 'authenticated');
create policy "Allow authenticated delete on packages" on packages for delete using (auth.role() = 'authenticated');

create policy "Allow authenticated insert on rate_seasons" on rate_seasons for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update on rate_seasons" on rate_seasons for update using (auth.role() = 'authenticated');
create policy "Allow authenticated delete on rate_seasons" on rate_seasons for delete using (auth.role() = 'authenticated');

create policy "Allow authenticated insert on availability" on availability for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update on availability" on availability for update using (auth.role() = 'authenticated');
create policy "Allow authenticated delete on availability" on availability for delete using (auth.role() = 'authenticated');

create policy "Allow authenticated insert on testimonials" on testimonials for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update on testimonials" on testimonials for update using (auth.role() = 'authenticated');
create policy "Allow authenticated delete on testimonials" on testimonials for delete using (auth.role() = 'authenticated');

create policy "Allow authenticated insert on gallery_images" on gallery_images for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update on gallery_images" on gallery_images for update using (auth.role() = 'authenticated');
create policy "Allow authenticated delete on gallery_images" on gallery_images for delete using (auth.role() = 'authenticated');

create policy "Allow authenticated insert on staff" on staff for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update on staff" on staff for update using (auth.role() = 'authenticated');
create policy "Allow authenticated delete on staff" on staff for delete using (auth.role() = 'authenticated');

-- Bookings policies: Select, insert, update are restricted to server-side (service_role) or authenticated admin users.
-- For safety, we also add an insert-only policy for anonymous users if we want client-side fallback, 
-- but since we run through Next.js server actions / routes, it's safer to keep them restricted.
create policy "Allow authenticated select on bookings" on bookings for select using (auth.role() = 'authenticated');
create policy "Allow authenticated update on bookings" on bookings for update using (auth.role() = 'authenticated');

-- Enquiries policies
create policy "Allow authenticated select on enquiries" on enquiries for select using (auth.role() = 'authenticated');
create policy "Allow authenticated update on enquiries" on enquiries for update using (auth.role() = 'authenticated');
