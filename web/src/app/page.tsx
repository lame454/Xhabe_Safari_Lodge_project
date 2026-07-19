import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sun, Binoculars, Waves, Eye, Users, Star, ArrowRight } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import {
  AlternatingSection,
  AmenityGridSection,
  QuoteBandSection,
  LogisticsPanelSection,
} from "@/components/HomeSections";

export const metadata: Metadata = {
  title: "Xhabe Safari Lodge | Luxury Tented Lodge — Chobe, Botswana",
  description:
    "Perched on a plateau overlooking the Chobe River floodplains and Namibia, Xhabe Safari Lodge offers an intimate 8-room luxury safari experience in Botswana. Game drives, boat cruises, Victoria Falls day trips.",
};

export default function HomePage() {
  const highlightAmenities = [
    {
      icon: Sun,
      title: "Million-Dollar Sunsets",
      description:
        "Watch the Chobe floodplains transform into liquid gold each evening from your private viewing deck overlooking the Namibia border.",
    },
    {
      icon: Binoculars,
      title: "Big Five Country",
      description:
        "5 km from Chobe National Park's eastern boundary inside the KAZA Conservation Area — one of Africa's largest and wildest transfrontier reserves.",
    },
    {
      icon: Waves,
      title: "River & Wilderness",
      description:
        "The Chobe River's channels and lagoons draw elephant herds, hippo pods, and hundreds of bird species to your doorstep year-round.",
    },
    {
      icon: Eye,
      title: "Intimate & Authentic",
      description:
        "Only 8 luxury tented rooms ensure a genuinely personal experience — not a resort, not a chain — led by a passionate local team.",
    },
    {
      icon: Users,
      title: "Expert Local Guides",
      description:
        "Our guides — Maatla, Beauty, Lindi, and the team — bring decades of knowledge of the Chobe ecosystem and its wildlife behaviours.",
    },
    {
      icon: Star,
      title: "All-Inclusive Packages",
      description:
        "Three carefully curated stay packages from 1 to 3 nights, each fully inclusive of meals, activities, and local beverages.",
    },
  ];

  return (
    <>
      <NavBar />

      {/* ============ SECTION 1: FULL-BLEED HERO ============ */}
      <section
        aria-label="Welcome to Xhabe Safari Lodge"
        className="relative h-screen min-h-[600px] max-h-[900px] flex items-end overflow-hidden"
      >
        {/* Hero Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-chobe.jpg"
            alt="Sunset over the Chobe River floodplains viewed from Xhabe Safari Lodge, Botswana"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>

        {/* Hero Content — bottom-anchored */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
          <span className="text-[10px] uppercase tracking-[0.3em] text-base-cream/80 font-semibold font-body mb-4 block">
            Chobe District · Botswana
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-none tracking-wide max-w-3xl">
            Wilderness,<br />
            <span className="text-base-cream">Unfiltered.</span>
          </h1>
          <p className="font-body text-base md:text-lg text-white/80 max-w-xl mb-10 leading-relaxed">
            A plateau perch overlooking the Chobe floodplains and Namibia — Xhabe Safari Lodge
            is an intimate 8-room tented retreat where the wild comes to you.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <Button href="/book" variant="primary" showArrow>
              Check Availability
            </Button>
            <Button href="/accommodation" variant="secondary" className="!border-white/50 !text-white hover:!bg-white hover:!text-base-dark">
              View Rooms
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-60">
          <div className="w-px h-8 bg-white animate-pulse" />
          <span className="text-[9px] uppercase tracking-[0.2em] text-white font-body">Scroll</span>
        </div>
      </section>

      {/* ============ SECTION 2: AMENITY GRID (Layout 2) ============ */}
      <AmenityGridSection
        subtitle="Why Xhabe"
        title="Where the Chobe Comes Alive"
        amenities={highlightAmenities}
      />

      {/* ============ SECTION 3: ALTERNATING IMAGE/TEXT — Accommodation (Layout 1) ============ */}
      <AlternatingSection
        subtitle="Accommodation"
        title="Luxury Tented Rooms with River Views"
        description="Eight secluded tented chalets, each with two private viewing decks — one facing the Chobe floodplain and Namibia, the other overlooking the lodge gardens. Super king beds, en-suite bathrooms, wooden floors, eco-friendly amenities, mosquito nets, personal safes, and Wi-Fi. Maximum 2 adults per chalet ensures your privacy is absolute."
        imagePath="/images/room-deck-view.jpg"
        imageAlt="Luxury tented chalet interior at Xhabe Safari Lodge overlooking the Chobe River"
        imageLeft={true}
        ctaText="Explore Accommodation"
        ctaHref="/accommodation"
      />

      {/* ============ SECTION 4: QUOTE BAND (Layout 3) ============ */}
      <QuoteBandSection
        quote="The staff went above and beyond. Maatla and Beauty made every meal, every drive, every sunrise feel personal. Nowhere else in Botswana have I felt this cared for."
        author="TripAdvisor Guest"
        source="TripAdvisor"
      />

      {/* ============ SECTION 5: ALTERNATING — Activities (Layout 1, reversed) ============ */}
      <AlternatingSection
        subtitle="Experiences"
        title="Every Day a Different Adventure"
        description="Morning game drives through open Chobe bush, river cruises past bathing elephant herds, a full-day trip to Victoria Falls, handcrafted canoe excursions, sunset sundowners, village cultural visits, and serene floodplain fishing. No two days at Xhabe are alike."
        imagePath="/images/activities-game-drive.jpg"
        imageAlt="Open 4x4 safari vehicle on a morning game drive near Chobe National Park"
        imageLeft={false}
        ctaText="See All Activities"
        ctaHref="/activities"
      />

      {/* ============ SECTION 6: MAP + LOGISTICS PANEL (Layout 4) ============ */}
      <LogisticsPanelSection
        subtitle="Getting Here"
        title="Find Us on the Edge of Chobe"
        logistics={[
          {
            title: "By Air",
            details: [
              "Kasane International Airport — 70 km (approx. 1 hr drive)",
              "Charter flights land at Ngoma Airstrip, 5 km from lodge",
            ],
          },
          {
            title: "By Road",
            details: [
              "5 km from Ngoma Border Gate (Botswana/Namibia crossing)",
              "Turn at Mabele village, follow the Ngoma road to lodge sign",
              "From Kasane: 70 km via tar + gravel road (~1 hr)",
              "From Victoria Falls, Zimbabwe: 120 km (~2 hrs)",
              "From Livingstone, Zambia: 120 km via Kazungula Ferry (~2.5 hrs)",
            ],
          },
          {
            title: "Location Notes",
            details: [
              "Coordinates available on request — GPS signal variable in forest",
              "Electricity, water, and mobile network available at lodge",
              "Within the KAZA Transfrontier Conservation Area",
            ],
          },
        ]}
      />

      {/* ============ SECTION 7: PACKAGES TEASER ============ */}
      <section className="py-24 bg-base-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] uppercase tracking-[0.25em] text-accent-amber font-semibold font-body mb-3 block">
            Stay Packages
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-base-cream mb-5">
            Choose Your Chobe Adventure
          </h2>
          <p className="font-body text-sm text-white/70 max-w-2xl mx-auto mb-12">
            From a single-night immersion to a 3-night deep dive with Victoria Falls and traditional boma dinner — each package is all-inclusive of meals, activities, and local beverages.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { name: "Package One", nights: "1 Night", highlight: "Sunset game drive & sundowner", min: "" },
              { name: "Package Two", nights: "2 Nights", highlight: "+ Victoria Falls day trip & boat cruise", min: "Min. 4 guests" },
              { name: "Package Three", nights: "3 Nights", highlight: "+ Boma dinner, traditional dance & stargazing", min: "Min. 4 guests" },
            ].map((pkg, i) => (
              <div
                key={i}
                className={`border p-8 text-left flex flex-col ${
                  i === 1
                    ? "border-accent-amber bg-white/5"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                {i === 1 && (
                  <span className="text-[9px] uppercase tracking-wider text-accent-amber font-bold font-body mb-3">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display text-2xl text-white mb-1">{pkg.name}</h3>
                <span className="font-body text-xs uppercase tracking-wider text-white/50 mb-4 block">{pkg.nights}</span>
                <p className="font-body text-sm text-white/70 mb-2 flex-grow">{pkg.highlight}</p>
                {pkg.min && (
                  <p className="text-xs text-accent-amber font-body font-semibold">{pkg.min}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/book" variant="primary">
              Check Availability & Rates
            </Button>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-accent-amber transition duration-300"
            >
              View the Gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
