-- ============================================================================
-- Correct the lodge's capacity from 8 chalets to 9.
--
-- The 2028 rates deck states "Luxury tented chalets x 9" and "a total of 18
-- guests", which agree at two adults per chalet. The earlier figure of 8 came
-- from a stray line in the same section and was under-selling the lodge by a
-- room every night.
--
-- Must stay in step with TOTAL_CHALETS in web/src/lib/data/capacity.ts. The
-- availability calendar and the double-booking trigger both read this.
-- ============================================================================

create or replace function total_chalets() returns int
  language sql immutable
  set search_path = ''
  as $$ select 9 $$;
