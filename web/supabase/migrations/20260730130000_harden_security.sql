-- ============================================================================
-- Security hardening
--
-- Clears the findings raised by Supabase's database linter after the baseline
-- schema was applied. Three separate issues:
--
--   1. function_search_path_mutable — the helper functions ran with a caller
--      controlled search_path, so a caller could shadow a referenced object
--      with one of their own. Pinned to an empty search_path with every
--      reference schema-qualified.
--
--   2. rls_policy_always_true — the baseline granted the `authenticated` role
--      unrestricted write on every table. This project has no sign-in flow at
--      all: content is edited through the Supabase dashboard and the site
--      writes via route handlers using the service role key, both of which
--      bypass RLS. Those policies therefore granted nothing anyone needed,
--      while guaranteeing that the day auth *is* switched on, every signed-up
--      guest could rewrite bookings and content. Dropped.
--
--      To add a real admin surface later, gate on a claim or an admins table
--      rather than reinstating `using (true)`, e.g.:
--
--        create policy "Admin write packages" on packages for all
--          to authenticated
--          using (exists (select 1 from admins a where a.user_id = auth.uid()))
--          with check (exists (select 1 from admins a where a.user_id = auth.uid()));
--
--   3. anon_security_definer_function_executable — `rls_auto_enable` is
--      Supabase's own platform event trigger (`ensure_rls`), not part of this
--      project. Event triggers are invoked by the engine, not through EXECUTE
--      grants, so revoking the public grants is safe and is what Supabase's
--      remediation guidance recommends. The function itself is left alone.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Pin search_path on the capacity helpers
-- ---------------------------------------------------------------------------

create or replace function total_chalets() returns int
  language sql immutable
  set search_path = ''
  as $$ select 8 $$;

create or replace function max_adults_per_chalet() returns int
  language sql immutable
  set search_path = ''
  as $$ select 2 $$;

create or replace function rooms_needed(guests int) returns int
  language sql immutable
  set search_path = ''
  as $$ select greatest(1, ceil(guests::numeric / public.max_adults_per_chalet())::int) $$;

create or replace function enforce_chalet_capacity() returns trigger
  language plpgsql
  set search_path = ''
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

  wanted := public.rooms_needed(new.guests);

  for night in
    select generate_series(new.check_in, new.check_out - interval '1 day', interval '1 day')::date
  loop
    select coalesce(
      (select a.rooms_available from public.availability a where a.date = night),
      public.total_chalets()
    ) into capacity;

    select coalesce(sum(public.rooms_needed(b.guests)), 0)
      into committed
      from public.bookings b
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

-- ---------------------------------------------------------------------------
-- 2. Drop the blanket `authenticated` write policies
--    Public SELECT policies are kept — the site reads content anonymously.
-- ---------------------------------------------------------------------------

drop policy if exists "Admin write packages"       on packages;
drop policy if exists "Admin write rate_seasons"   on rate_seasons;
drop policy if exists "Admin write availability"   on availability;
drop policy if exists "Admin write testimonials"   on testimonials;
drop policy if exists "Admin write gallery_images" on gallery_images;
drop policy if exists "Admin write staff"          on staff;
drop policy if exists "Admin manage bookings"      on bookings;
drop policy if exists "Admin manage enquiries"     on enquiries;

-- ---------------------------------------------------------------------------
-- 3. Remove public EXECUTE on Supabase's RLS event-trigger function
--
-- The grant is held by PUBLIC (`=X/postgres` in the function's ACL), not by
-- anon/authenticated individually, so it has to be revoked from PUBLIC to
-- actually take effect. `postgres` and `service_role` keep their own explicit
-- grants, and the `ensure_rls` event trigger keeps firing either way.
-- ---------------------------------------------------------------------------

revoke execute on function public.rls_auto_enable() from public;
