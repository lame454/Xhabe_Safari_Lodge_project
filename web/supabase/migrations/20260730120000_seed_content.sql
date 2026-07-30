-- ============================================================================
-- Seed content
--
-- Mirrors the FALLBACK_* constants in web/src/lib/data/ so the live site renders
-- identically whether it reads from Supabase or falls back. Idempotent: safe to
-- re-run.
--
-- NOT seeded, deliberately:
--
--   rate_seasons — the lodge's published rates expired in January 2025 and
--   contradicted its agent listings (see xhabe-safari-lodge-website-audit.md
--   §5). Rather than seed numbers known to be wrong, this is left empty, which
--   makes the site render "Rates are quoted on enquiry". Insert a row with the
--   current season's real rates to switch pricing on site-wide.
--
--   gallery_images.activity_tags — left null pending the lodge's photo
--   reclassification. Tag rows with activity slugs from
--   web/src/lib/data/activities.ts to light up the Activities → Gallery links
--   and the preview thumbnails; no code change needed.
--
-- Note: gallery alt_text and category values below are carried over verbatim
-- from the demo's fallback data and describe subjects the current photo files
-- may not actually show. Review them alongside the photo refresh.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Packages
-- ---------------------------------------------------------------------------
insert into packages (name, slug, nights, min_pax, description, inclusions, activity_slugs, sort_order)
values
  (
    'Package One',
    'package-one',
    1,
    null,
    'An ideal introduction to the Chobe wilderness — one night under the stars, one golden sunset on the plateau, and a morning in the wild.',
    array[
      'Accommodation in luxury tented chalet',
      'All meals (dinner, breakfast)',
      'Local beverages throughout',
      'Sunset game drive + sundowner',
      'Guided morning walk or bush experience'
    ],
    array['morning-game-drive', 'sundowners'],
    1
  ),
  (
    'Package Two',
    'package-two',
    2,
    4,
    'The most popular choice. Two immersive nights with the full river-and-bush experience, plus a full day at Victoria Falls — one of the Seven Wonders.',
    array[
      '2 nights accommodation in luxury tented chalet',
      'All meals (dinner × 2, breakfasts × 2, lunches × 2)',
      'Local beverages throughout',
      'Sunset & morning game drives',
      'Chobe River boat cruise',
      'Victoria Falls day trip (Zimbabwe)',
      'Sundowner cocktails each evening'
    ],
    array['morning-game-drive', 'river-boat-cruise', 'victoria-falls-day-trip', 'sundowners'],
    2
  ),
  (
    'Package Three',
    'package-three',
    3,
    4,
    'The complete Xhabe experience. Three nights, every activity, the full spectrum of Chobe — from pre-dawn game drives to star-drenched boma dinners. Nothing held back.',
    array[
      '3 nights accommodation in luxury tented chalet',
      'All meals throughout',
      'Local beverages throughout',
      'Sunset & morning game drives each day',
      'Chobe River boat cruise',
      'Victoria Falls day trip (Zimbabwe)',
      'Traditional boma dinner with cultural dance',
      'Guided stargazing session',
      'Sundowner cocktails each evening'
    ],
    array[
      'morning-game-drive', 'river-boat-cruise', 'victoria-falls-day-trip',
      'boma-dinner', 'stargazing', 'sundowners'
    ],
    3
  )
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Testimonials
-- ---------------------------------------------------------------------------
insert into testimonials (guest_name, source, quote, rating, featured)
select * from (values
  (
    'TripAdvisor Guest',
    'TripAdvisor',
    'The staff went above and beyond. Maatla and Beauty made every meal, every drive, every sunrise feel personal. Nowhere else in Botswana have I felt this cared for.',
    5,
    true
  ),
  (
    'Verified Guest',
    'TripAdvisor',
    'The best sunsets in all of Africa are right here. We watched elephants cross the floodplain from our deck while the sun turned the river to fire. We''ll be back.',
    5,
    true
  )
) as seed(guest_name, source, quote, rating, featured)
where not exists (select 1 from testimonials);

-- ---------------------------------------------------------------------------
-- Staff
-- ---------------------------------------------------------------------------
insert into staff (name, role, bio, photo_path, sort_order)
select * from (values
  (
    'Maatla',
    'Senior Safari Guide',
    'Born and raised in Mabele village, Maatla has guided Chobe''s wildlife corridors for over 15 years. His knowledge of leopard behaviour and elephant family groups is unmatched in the region.',
    '/images/team-maatla.jpg',
    1
  ),
  (
    'Beauty',
    'Lodge Manager & Head of Hospitality',
    'Beauty brings warmth, precision, and an infectious smile to every guest interaction. She personally oversees all meals, room preparation, and ensures the Xhabe standard is upheld in every detail.',
    '/images/team-beauty.jpg',
    2
  ),
  (
    'Lindi',
    'River Safari Specialist & Birding Guide',
    'With a special passion for Chobe''s birdlife (520+ species recorded in the district), Lindi leads boat cruises and birding walks that reveal the river''s hidden life to even seasoned naturalists.',
    '/images/team-lindi.jpg',
    3
  )
) as seed(name, role, bio, photo_path, sort_order)
where not exists (select 1 from staff);

-- ---------------------------------------------------------------------------
-- Gallery images
-- ---------------------------------------------------------------------------
insert into gallery_images (storage_path, alt_text, category, sort_order)
select * from (values
  ('/images/gallery-elephant-herd.jpg',      'Elephant herd crossing the Chobe River at dusk',                                    'views',      1),
  ('/images/gallery-chalet-exterior.jpg',    'Exterior of a luxury tented chalet surrounded by mopane trees',                     'rooms',      2),
  ('/images/gallery-sunset-floodplain.jpg',  'Sunset over the Chobe floodplains viewed from Xhabe Lodge plateau',                 'views',      3),
  ('/images/gallery-game-drive.jpg',         'Guests on a morning game drive in an open 4x4 vehicle near Chobe National Park',     'activities', 4),
  ('/images/gallery-hippo.jpg',              'Hippo pod resting in the Chobe River lagoon',                                       'views',      5),
  ('/images/gallery-boma-dinner.jpg',        'Traditional boma dinner around a fire at Xhabe Safari Lodge',                       'dining',     6),
  ('/images/gallery-chalet-interior.jpg',    'Luxury interior of a Xhabe tented chalet with king bed and wooden floors',          'rooms',      7),
  ('/images/gallery-boat-cruise.jpg',        'Guests on a river cruise watching elephants drink from the Chobe bank',             'activities', 8),
  ('/images/gallery-leopard.jpg',            'Leopard resting in an acacia tree near Chobe National Park',                        'views',      9),
  ('/images/gallery-vic-falls.jpg',          'Victoria Falls viewed from the Zimbabwe side, spray rising into the sky',            'activities', 10),
  ('/images/gallery-deck.jpg',               'Private viewing deck of a tented chalet looking over the Chobe floodplains',        'rooms',      11),
  ('/images/gallery-birds.jpg',              'African fish eagle perched on a dead tree above the Chobe River',                   'views',      12)
) as seed(storage_path, alt_text, category, sort_order)
where not exists (select 1 from gallery_images);
