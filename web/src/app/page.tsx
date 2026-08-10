import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import StickyBookCta from "@/components/StickyBookCta";
import { GlassPanel, PhotoCard, StatPlate } from "@/components/Glass";
import { LODGE } from "@/lib/data/lodge";
import { ACTIVITIES } from "@/lib/data/activities";
import { CURRENCY, lowestNightlyRate } from "@/lib/data/rates";

export const metadata: Metadata = {
  title: "Xhabe Safari Lodge | Exclusive Wilderness — Chobe, Botswana",
  description:
    "Nine luxury tented chalets on a plateau above the Chobe River floodplain, five kilometres from Chobe National Park. Game drives, river cruises, boma dinners and the largest pool in the area.",
};

export default function HomePage() {
  const featured = ACTIVITIES.slice(0, 3);

  return (
    <>
      <NavBar overHero />

      {/* ============ HERO ============ */}
      <section className="relative min-h-[100svh] flex items-end overflow-hidden">
        <Image
          src="/images/sunset-pool-chalets.jpg"
          alt="Sunset over the pool at Xhabe Safari Lodge, tented chalets silhouetted against a pink sky and mirrored in the water"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <span aria-hidden="true" className="absolute inset-0 scrim-full" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20">
          <div className="max-w-2xl animate-rise">
            <span className="inline-flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.3em] text-white/70 mb-5">
              <MapPin className="w-3.5 h-3.5 text-accent-soft" />
              {LODGE.location.region}
            </span>

            <h1 className="font-display text-[3.25rem] leading-[0.95] sm:text-7xl lg:text-8xl text-white mb-6">
              Exclusive
              <br />
              <span className="text-accent-soft">wilderness.</span>
            </h1>

            <p className="font-body text-base sm:text-lg text-white/85 leading-relaxed max-w-xl mb-9">
              {LODGE.chalets} tented chalets on a plateau above the Chobe River floodplain — an
              intimate camp for {LODGE.guests} guests, five kilometres from the national park.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/book"
                className="group inline-flex items-center gap-2 rounded-full bg-accent-amber text-white font-body text-xs font-semibold uppercase tracking-[0.14em] px-8 py-4 shadow-xl shadow-black/25 hover:brightness-95 active:scale-[0.98] transition-all duration-300 ease-spring"
              >
                Check availability
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center rounded-full glass-dark text-white font-body text-xs font-semibold uppercase tracking-[0.14em] px-8 py-4 hover:bg-white/15 active:scale-[0.98] transition-all duration-300 ease-spring"
              >
                See the lodge
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CONTEXT — why here ============ */}
      <section className="relative py-20 sm:py-28 bg-base-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="font-body text-[10px] uppercase tracking-[0.28em] text-accent-ink font-semibold">
              Why Chobe
            </span>
            <h2 className="font-display text-3xl sm:text-5xl text-base-dark mt-4 leading-[1.05]">
              The best elephant country on earth.
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {LODGE.context.map((item) => (
              <StatPlate key={item.label} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ THE LODGE — big photo + glass ============ */}
      <section className="relative">
        <div className="relative min-h-[85svh] flex items-center overflow-hidden">
          <Image
            src="/images/chalets-plateau-floodplain.jpg"
            alt="Tented chalets on the Xhabe plateau with the Chobe floodplain and river stretching out beyond"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <span aria-hidden="true" className="absolute inset-0 bg-black/25" />

          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <GlassPanel tone="dark" className="max-w-xl p-8 sm:p-10">
              <span className="font-body text-[10px] uppercase tracking-[0.28em] text-accent-soft font-semibold">
                The Lodge
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-white mt-4 mb-5 leading-tight">
                Nine chalets, and not one more.
              </h2>
              <p className="font-body text-sm sm:text-base text-white/80 leading-relaxed mb-6">
                {LODGE.location.corridor} Each chalet is spaced for privacy and opens onto two
                balconies over the floodplain — a super king bed, a dressing area, air
                conditioning, and an en-suite bathroom behind canvas walls.
              </p>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mb-8">
                {LODGE.chalet.features.slice(0, 4).map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-accent-soft mt-2 shrink-0" />
                    <span className="font-body text-xs text-white/75 leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/accommodation"
                className="group inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-soft hover:text-white transition-colors duration-300"
              >
                Explore the chalets
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </GlassPanel>
          </div>
        </div>
      </section>

      {/* ============ EXPERIENCES ============ */}
      <section className="py-20 sm:py-28 bg-base-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <span className="font-body text-[10px] uppercase tracking-[0.28em] text-accent-ink font-semibold">
                Experiences
              </span>
              <h2 className="font-display text-3xl sm:text-5xl text-base-dark mt-4 leading-[1.05]">
                Days shaped around what you want to see.
              </h2>
            </div>
            <Link
              href="/activities"
              className="group inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-ink hover:text-base-dark transition-colors"
            >
              All activities
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((activity) => (
              <Link
                key={activity.slug}
                href={`/activities#${activity.slug}`}
                className="block rounded-glass focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber focus-visible:ring-offset-2"
              >
                <PhotoCard
                  src={activity.image}
                  alt={activity.imageAlt}
                  eyebrow={activity.included}
                  title={activity.name}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ THE PLACE ITSELF — amenity mosaic ============ */}
      <section className="py-20 sm:py-28 bg-base-cream/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="font-body text-[10px] uppercase tracking-[0.28em] text-accent-ink font-semibold">
              The Place
            </span>
            <h2 className="font-display text-3xl sm:text-5xl text-base-dark mt-4 leading-[1.05]">
              A lounge, a boma, and the largest pool in the area.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LODGE.amenities.map((amenity, i) => (
              <PhotoCard
                key={amenity.slug}
                src={amenity.image}
                alt={amenity.imageAlt}
                title={amenity.name}
                body={amenity.points[0]}
                // Break the grid rhythm so it reads as a composition, not a table.
                aspect={i === 0 || i === 5 ? "aspect-[4/3] lg:aspect-[8/5]" : "aspect-[4/5]"}
                className={i === 0 || i === 5 ? "lg:col-span-2" : ""}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ RATES TEASER ============ */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <Image
          src="/images/lodge-night-pool.jpg"
          alt="Xhabe Safari Lodge at dusk, the main building glowing warm behind the lit pool"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-black/45" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="font-body text-[10px] uppercase tracking-[0.28em] text-accent-soft font-semibold">
            Rates
          </span>
          <h2 className="font-display text-3xl sm:text-5xl text-white mt-4 mb-5 leading-tight">
            From {CURRENCY} {lowestNightlyRate()} per night.
          </h2>
          <p className="font-body text-sm sm:text-base text-white/80 leading-relaxed mb-9 max-w-xl mx-auto">
            All meals, local drinks, a game drive, the sundowner, a village tour and basketry
            weaving are included in the nightly rate. Camping is available year-round.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/rates"
              className="group inline-flex items-center gap-2 rounded-full bg-accent-amber text-white font-body text-xs font-semibold uppercase tracking-[0.14em] px-8 py-4 shadow-xl shadow-black/25 hover:brightness-95 active:scale-[0.98] transition-all duration-300 ease-spring"
            >
              See full rates
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/book"
              className="inline-flex items-center rounded-full glass-dark text-white font-body text-xs font-semibold uppercase tracking-[0.14em] px-8 py-4 hover:bg-white/15 active:scale-[0.98] transition-all duration-300 ease-spring"
            >
              Check dates
            </Link>
          </div>
        </div>
      </section>

      {/* ============ LOCAL ============ */}
      <section className="py-20 sm:py-28 bg-base-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative aspect-[5/4] rounded-glass overflow-hidden">
            <Image
              src="/images/curios-detail.jpg"
              alt="Woven baskets, carved wooden pieces and pottery arranged on a cowhide rug in the lodge lounge"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div>
            <span className="font-body text-[10px] uppercase tracking-[0.28em] text-accent-ink font-semibold">
              Local by design
            </span>
            <h2 className="font-display text-3xl sm:text-5xl text-base-dark mt-4 mb-6 leading-[1.05]">
              Every one of our {LODGE.staff} staff is from the Chobe Enclave.
            </h2>
            <ul className="space-y-3 mb-8">
              {LODGE.localSupport.slice(1).map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-amber mt-2 shrink-0" />
                  <span className="font-body text-sm text-base-dark/75 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-ink hover:text-base-dark transition-colors"
            >
              More about the lodge
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <StickyBookCta />
      <Footer />
    </>
  );
}
