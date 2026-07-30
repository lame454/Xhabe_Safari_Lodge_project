-- ============================================================================
-- Public availability calendar RPC
--
-- The booking calendar needs per-night remaining capacity, which means reading
-- `bookings` — a table with no public policy, because it holds guest names,
-- emails, and phone numbers. Computing this in the app therefore forced the
-- service role key into what is otherwise a plain public read, so the calendar
-- went dark whenever that secret was absent.
--
-- This function does the aggregation inside the database and returns *only*
-- counts: one row per date with the chalets released and the chalets left. No
-- guest data crosses the boundary. Callers need nothing but the publishable
-- key, and the service role key is reserved for writes.
--
-- SECURITY DEFINER is required and intentional — it is what lets an anonymous
-- caller have `bookings` aggregated on its behalf without being able to select
-- from it. Supabase's linter flags anon-executable SECURITY DEFINER functions
-- generically; this one is safe because:
--
--   * it is `stable` and takes only two dates — no writes, no dynamic SQL;
--   * `search_path` is pinned empty with every reference schema-qualified, so a
--     caller cannot shadow the objects it reads;
--   * the return type exposes no column from `bookings`, only sums over it;
--   * the numbers returned are exactly what the public calendar already shows.
-- ============================================================================

create or replace function availability_calendar(from_date date, to_date date)
  returns table (date date, capacity int, rooms_remaining int)
  language sql
  stable
  security definer
  set search_path = ''
  as $$
    with bounded as (
      -- Cap the window so a hand-crafted call can't ask for decades at once.
      select from_date as f,
             least(to_date, from_date + interval '400 days')::date as t
    ),
    days as (
      select generate_series(b.f, b.t, interval '1 day')::date as d
      from bounded b
    )
    select
      days.d as date,
      coalesce(a.rooms_available, public.total_chalets()) as capacity,
      greatest(
        0,
        coalesce(a.rooms_available, public.total_chalets()) - coalesce((
          select sum(public.rooms_needed(bk.guests))::int
            from public.bookings bk
           where bk.status <> 'cancelled'
             and bk.check_in <= days.d
             and days.d < bk.check_out
        ), 0)
      )::int as rooms_remaining
    from days
    left join public.availability a on a.date = days.d
    order by days.d
  $$;

-- Only these two roles; `public` deliberately not granted.
grant execute on function availability_calendar(date, date) to anon, authenticated;
