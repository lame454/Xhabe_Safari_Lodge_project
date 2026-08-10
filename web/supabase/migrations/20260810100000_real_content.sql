-- ============================================================================
-- Replace the demo's placeholder content with the lodge's real material.
--
-- Three changes:
--
--   1. gallery_images — the old 12 rows described wildlife, chalet interiors
--      and Victoria Falls that the photo files never actually showed. They are
--      replaced with the real photo library, each row's alt text describing
--      what is genuinely in the frame, and tagged by activity so the
--      Activities → Gallery links resolve.
--
--   2. packages — the invented "Package One/Two/Three" night-bundles did not
--      match how the lodge sells. Replaced with the two things a guest can
--      actually book: a chalet, or a camping pitch.
--
--   3. rate_seasons — the real published rate, previously left empty because
--      the only figures available were expired.
--
-- Rates are the SADC rack rate; the full four-way rate card (SADC vs
-- International, rack vs STO) lives in web/src/lib/data/rates.ts because a
-- single-rate table cannot express it.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Gallery
-- ---------------------------------------------------------------------------
delete from gallery_images;

insert into gallery_images (storage_path, alt_text, category, activity_tags, sort_order) values
  ('/images/sunset-pool-chalets.jpg',        'Sunset over the pool at Xhabe Safari Lodge, tented chalets silhouetted against a pink sky and mirrored in the water', 'views',      array['sundowner'],      1),
  ('/images/chalets-plateau-floodplain.jpg', 'Tented chalets on the Xhabe plateau with the Chobe floodplain and river stretching out beyond',                        'views',      null,                    2),
  ('/images/giraffe-tower.jpg',              'Four giraffes standing together in open Chobe bush under a clear sky',                                                 'views',      array['game-drives'],    3),
  ('/images/lioness-at-lodge-sign.jpg',      'A lioness standing beside the Xhabe Safari Lodge entrance sign at night, caught in a spotlight',                       'views',      array['game-drives'],    4),
  ('/images/zebra-on-road.jpg',              'A zebra crossing the tar road ahead of a vehicle on the way to the lodge',                                             'views',      array['game-drives'],    5),
  ('/images/floodplain-from-pool.jpg',       'The Chobe River floodplain stretching to the horizon, seen over the lodge pool',                                       'views',      array['boat-cruise'],    6),
  ('/images/mokoro-chobe-river.jpg',         'Two guides poling guests in a mokoro canoe through the shallows of the Chobe River at golden hour',                    'activities', array['fishing-canoe'],  7),
  ('/images/curios-detail.jpg',              'Woven baskets, carved wooden pieces and pottery arranged on a cowhide rug in the lodge lounge',                        'activities', array['basketry'],       8),
  ('/images/lodge-pathway-dusk.jpg',         'A lamp-lit gravel pathway through the lodge grounds at dusk, with the pool beyond',                                    'views',      array['village-tour'],   9),
  ('/images/chalet-king-bed.jpg',            'A super king bed made up in a tented chalet, against a wall of gum poles',                                             'rooms',      null,                   10),
  ('/images/chalet-interior-wooden-floor.jpg','The interior of a tented chalet with polished wooden floors, a cowhide rug and a window onto the bush',               'rooms',      null,                   11),
  ('/images/chalet-private-balcony.jpg',     'Two chairs and a small table on the private balcony of a chalet, looking out into green bush',                        'rooms',      null,                   12),
  ('/images/chalet-exterior-deck.jpg',       'The exterior of a tented chalet raised on stilts, with a wooden deck and gum-pole railing',                            'rooms',      null,                   13),
  ('/images/chalet-twin-beds.jpg',           'A chalet made up with twin beds and folded towels',                                                                    'rooms',      null,                   14),
  ('/images/turndown-swans.jpg',             'Towels folded into two swans forming a heart on a turned-down bed',                                                    'rooms',      null,                   15),
  ('/images/turndown-birthday.jpg',          'A bed decorated with petals and a towel tower spelling out a birthday message',                                        'rooms',      null,                   16),
  ('/images/chalet-king-bed-window.jpg',     'A super king bed beside the curved window of a tented chalet, with bush visible outside',                              'rooms',      null,                   17),
  ('/images/reception-lounge-golden.jpg',    'The open-sided reception lounge in late afternoon light, with burnt-orange velvet armchairs',                          'rooms',      null,                   18),
  ('/images/lounge-open-side.jpg',           'The lounge at Xhabe Safari Lodge, open on two sides to the bush, with wishbone chairs on a wooden deck',                'rooms',      null,                   19),
  ('/images/lounge-dining-wide.jpg',         'The lounge and dining area, with sofas, a live-edge coffee table and long dining tables beyond',                       'rooms',      null,                   20),
  ('/images/lounge-bar.jpg',                 'The lounge seating with the bar counter behind it',                                                                    'rooms',      null,                   21),
  ('/images/pool-chalets-floodplain.jpg',    'The swimming pool with two tented chalets and the Chobe floodplain beyond, under tall cumulus cloud',                  'views',      null,                   22),
  ('/images/pool-floodplain-tall.jpg',       'The lodge pool in the foreground with the floodplain reaching to the horizon',                                         'views',      null,                   23),
  ('/images/pool-main-building.jpg',         'The pool and main building at Xhabe Safari Lodge under a clear blue sky',                                              'views',      null,                   24),
  ('/images/lodge-exterior-day.jpg',         'The main building and pool seen across the lawn on a clear day',                                                       'views',      null,                   25),
  ('/images/lodge-night-pool.jpg',           'Xhabe Safari Lodge at dusk, the main building glowing warm behind the lit pool',                                       'views',      null,                   26),
  ('/images/main-building-blue-hour.jpg',    'The main building glowing warm against a deep blue evening sky, seen across the pool',                                 'views',      null,                   27),
  ('/images/boma-lantern-dinner.jpg',        'A lantern-lit dinner table set for three in the boma after dark',                                                      'dining',     null,                   28),
  ('/images/dessert-xhabe-plate.jpg',        'A layered pastry dessert plated with the word Xhabe written in chocolate',                                             'dining',     null,                   29),
  ('/images/dessert-cheesecake.jpg',         'A round cheesecake finished with dark berry coulis and a sprig of herb',                                               'dining',     null,                   30),
  ('/images/soup-butternut.jpg',             'A bowl of butternut soup topped with chopped chives',                                                                  'dining',     null,                   31),
  ('/images/fruit-platter.jpg',              'A platter of sliced pineapple, melon, grapes and strawberries',                                                        'dining',     null,                   32),
  ('/images/spa-sala-massage.jpg',           'A massage table made up under the open-sided spa sala, with curtains and bush beyond',                                 'rooms',      null,                   33),
  ('/images/spa-sala-seating.jpg',           'An armchair and side tables on the wooden deck of the spa sala',                                                       'rooms',      null,                   34),
  ('/images/spa-sala-detail.jpg',            'A side table and potted palm on the spa sala deck, with the massage table behind',                                     'rooms',      null,                   35);

-- ---------------------------------------------------------------------------
-- 2. What a guest can book
-- ---------------------------------------------------------------------------
delete from packages;

insert into packages (name, slug, nights, min_pax, description, inclusions, activity_slugs, sort_order) values
  (
    'Luxury Tented Chalet',
    'chalet',
    1,
    null,
    'One of nine tented chalets on the plateau, with a super king bed, two private balconies over the floodplain, air conditioning and an en-suite bathroom.',
    array[
      'Accommodation and bed levy',
      'All meals',
      'Soft drinks, bottled water, local beer and spirits',
      'Game drive and sundowner',
      'Village tour and basketry weaving'
    ],
    array['game-drives', 'sundowner', 'village-tour', 'basketry'],
    1
  ),
  (
    'Camping',
    'camping',
    1,
    null,
    'Bring your own tent and pitch on the lodge grounds, with access to the pool, the bar and the lodge''s facilities. Priced per person, all year round.',
    array[
      'Camping pitch on the lodge grounds',
      'Access to lodge facilities',
      'Priced per person per night'
    ],
    array[]::text[],
    2
  );

-- ---------------------------------------------------------------------------
-- 3. Published rate
-- ---------------------------------------------------------------------------
delete from rate_seasons;

insert into rate_seasons (season_name, start_date, end_date, rate_single, rate_double, currency, active)
values ('Published rate', '2026-11-01', '2028-01-10', 250, 400, 'USD', true);
