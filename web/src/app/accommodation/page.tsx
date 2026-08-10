import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import StickyBookCta from "@/components/StickyBookCta";
import RoomPhotoGrid from "@/components/RoomPhotoGrid";
import { GlassPanel } from "@/components/Glass";
import { LODGE } from "@/lib/data/lodge";

export const metadata: Metadata = {
  title: "The Chalets | Xhabe Safari Lodge — Chobe, Botswana",
  description:
    "Nine luxury tented chalets at Xhabe Safari Lodge, each with a super king bed, two private balconies over the Chobe floodplain, air conditioning and an en-suite bathroom.",
};

const CHALET_PHOTOS = [
  {
    src: "/images/chalet-king-bed.jpg",
    alt: "A super king bed made up in a tented chalet, against a wall of gum poles",
  },
  {
    src: "/images/chalet-interior-wooden-floor.jpg",
    alt: "The interior of a tented chalet with polished wooden floors, a cowhide rug and a window onto the bush",
  },
  {
    src: "/images/chalet-private-balcony.jpg",
    alt: "Two chairs and a small table on the private balcony of a chalet, looking out into green bush",
  },
  {
    src: "/images/chalet-exterior-deck.jpg",
    alt: "The exterior of a tented chalet raised on stilts, with a wooden deck and gum-pole railing",
  },
  {
    src: "/images/chalet-twin-beds.jpg",
    alt: "A chalet made up with twin beds and folded towels",
  },
  {
    src: "/images/turndown-swans.jpg",
    alt: "Towels folded into two swans forming a heart on a turned-down bed",
  },
  {
    src: "/images/turndown-birthday.jpg",
    alt: "A bed decorated with petals and a towel tower spelling out a birthday message",
  },
  {
    src: "/images/chalet-king-bed-window.jpg",
    alt: "A super king bed beside the curved window of a tented chalet, with bush visible outside",
  },
];

export default function AccommodationPage() {
  return (
    <>
      <NavBar overHero />

      {/* HERO */}
      <section className="relative h-[70svh] min-h-[440px] flex items-end overflow-hidden">
        <Image
          src="/images/chalets-plateau-floodplain.jpg"
          alt="Tented chalets on the Xhabe plateau with the Chobe floodplain and river beyond"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <span aria-hidden="true" className="absolute inset-0 scrim-bottom" />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          <span className="font-body text-[10px] uppercase tracking-[0.3em] text-accent-soft font-semibold">
            The Chalets
          </span>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white mt-4 leading-none max-w-2xl">
            Nine, and not one more.
          </h1>
        </div>
      </section>

      {/* INTRO + FEATURES */}
      <section className="py-16 sm:py-24 bg-base-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-base-dark mb-6 leading-tight">
              An intimate haven for {LODGE.guests} guests.
            </h2>
            <p className="font-body text-base text-base-dark/75 leading-relaxed mb-5">
              {LODGE.chalets} tented chalets, deliberately few, so the service stays dedicated and
              personal. The tents are thoughtfully spaced and each one offers its own view of the
              Chobe floodplain.
            </p>
            <p className="font-body text-base text-base-dark/75 leading-relaxed">
              Two private balconies come with every chalet — enough room to take in the panorama
              from a comfortable seat, at whichever end of the day suits you.
            </p>
          </div>

          <GlassPanel className="p-7 sm:p-9 self-start">
            <h3 className="font-body text-[11px] uppercase tracking-[0.2em] font-semibold text-accent-ink mb-6">
              In every chalet
            </h3>
            <ul className="space-y-3.5">
              {LODGE.chalet.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-accent-amber shrink-0 mt-0.5" />
                  <span className="font-body text-sm text-base-dark/80 leading-relaxed">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </GlassPanel>
        </div>
      </section>

      {/* PHOTO GRID */}
      <section className="pb-16 sm:pb-24 bg-base-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RoomPhotoGrid photos={CHALET_PHOTOS} />
          <p className="font-body text-xs text-base-dark/45 text-center mt-5">
            Tap any photo to view it larger, or{" "}
            <Link href="/gallery" className="text-accent-ink hover:underline">
              browse the full gallery
            </Link>
            .
          </p>
        </div>
      </section>

      {/* CAMPING */}
      <section className="py-16 sm:py-24 bg-base-cream/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative aspect-[4/3] rounded-glass overflow-hidden order-last lg:order-first">
            <Image
              src="/images/lodge-exterior-day.jpg"
              alt="The main building and pool at Xhabe Safari Lodge seen across the lawn on a clear day"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <span className="font-body text-[10px] uppercase tracking-[0.28em] text-accent-ink font-semibold">
              Also available
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-base-dark mt-4 mb-5 leading-tight">
              Camping on the grounds.
            </h2>
            <p className="font-body text-base text-base-dark/75 leading-relaxed mb-7">
              Bring your own tent and pitch on the lodge grounds, with the pool, the bar and the
              lodge&apos;s facilities on hand. Priced per person, all year round.
            </p>
            <Link
              href="/rates"
              className="group inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-ink hover:text-base-dark transition-colors"
            >
              See camping rates
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <Image
          src="/images/sunset-pool-chalets.jpg"
          alt="Sunset over the pool at Xhabe Safari Lodge with the chalets in silhouette"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-black/45" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-5">
            Claim your view.
          </h2>
          <p className="font-body text-sm text-white/75 mb-9">
            {LODGE.chalets} chalets, each private. Availability is genuinely limited.
          </p>
          <Link
            href="/book"
            className="group inline-flex items-center gap-2 rounded-full bg-accent-amber text-white font-body text-xs font-semibold uppercase tracking-[0.14em] px-8 py-4 shadow-xl shadow-black/25 hover:brightness-95 active:scale-[0.98] transition-all duration-300 ease-spring"
          >
            Check availability
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <StickyBookCta />
      <Footer />
    </>
  );
}
