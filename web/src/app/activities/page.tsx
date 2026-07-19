import type { Metadata } from "next";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import {
  Sunrise,
  Ship,
  Landmark,
  Utensils,
  Flame,
  Telescope,
  Fish,
  Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Activities & Experiences | Xhabe Safari Lodge — Chobe, Botswana",
  description:
    "Game drives, river cruises, Victoria Falls day trips, cultural village visits, canoe safaris, boma dinners and stargazing at Xhabe Safari Lodge in the Chobe District, Botswana.",
};

const activities = [
  {
    icon: Sunrise,
    name: "Morning Game Drive",
    description:
      "Dawn game drives through open Chobe bush in our 4x4 open-sided vehicles. Spot elephant, buffalo, lion, leopard, and wild dog as the savanna awakens. Our expert guides read the land and tracks to find magic most visitors never encounter.",
    included: "Included in all packages",
    image: "/images/activities-game-drive.jpg",
  },
  {
    icon: Ship,
    name: "River Boat Cruise",
    description:
      "Float through the Chobe River channels at close range with hippos, crocodiles, elephants bathing at the bank, and hundreds of waterbirds. The golden hour on the water is unforgettable — sundowners served aboard.",
    included: "Included in Packages 2 & 3",
    image: "/images/activities-boat.jpg",
  },
  {
    icon: Landmark,
    name: "Victoria Falls Day Trip",
    description:
      "A full-day excursion to one of the Seven Natural Wonders of the World. Cross into Zimbabwe and stand at the edge of the largest waterfall curtain on Earth — 1,708 metres wide and 108 metres tall. Approximately 2 hours each way.",
    included: "Included in Packages 2 & 3",
    image: "/images/activities-vic-falls.jpg",
  },
  {
    icon: Flame,
    name: "Boma Dinner & Cultural Night",
    description:
      "Gather under the stars around a traditional fire in the boma. Enjoy a feast of local meats, vegetables, and staples while the lodge team shares stories of the bush, local culture, and traditional dance.",
    included: "Included in Package 3",
    image: "/images/activities-boma.jpg",
  },
  {
    icon: Telescope,
    name: "Stargazing",
    description:
      "With no light pollution for kilometres around, the Chobe night sky is extraordinary. Our guides turn off the lodge lights for a scheduled stargazing session — the Milky Way stretches from horizon to horizon.",
    included: "Included in Package 3",
    image: "/images/activities-stars.jpg",
  },
  {
    icon: Fish,
    name: "Floodplain Fishing",
    description:
      "Cast a line in the Chobe River and its lagoons for tigerfish, bream, and catfish. A peaceful, meditative counterpoint to the adrenalin of the game drive — available as an add-on activity for all guests.",
    included: "Available on request",
    image: "/images/activities-fishing.jpg",
  },
  {
    icon: Globe,
    name: "Cultural Village Visit",
    description:
      "Walk with your guide through a neighbouring village to meet local Basubiya families, understand daily bush life, and support the community economy that underpins Xhabe's conservation ethic.",
    included: "Available on request",
    image: "/images/activities-village.jpg",
  },
  {
    icon: Utensils,
    name: "Sundowner Cocktails",
    description:
      "Every evening, as the sun sinks towards Namibia, the team sets up a mobile sundowner station on the plateau with panoramic floodplain views. Local gins, craft beers, soft drinks, and light snacks served.",
    included: "Included in all packages",
    image: "/images/activities-sundowner.jpg",
  },
];

export default function ActivitiesPage() {
  return (
    <>
      <NavBar />

      {/* PAGE HERO */}
      <section className="relative h-[55vh] min-h-[400px] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/activities-game-drive.jpg"
            alt="Safari vehicle on a morning game drive through Chobe bush, Botswana"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 md:pb-20">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent-amber font-semibold font-body mb-3 block">
            Adventures & Experiences
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4 leading-none tracking-wide">
            Every Day,<br />Something Wild.
          </h1>
          <p className="font-body text-sm md:text-base text-white/75 max-w-xl leading-relaxed">
            From pre-dawn game drives to star-drenched boma dinners — each activity at Xhabe is designed to bring you closer to the real Chobe.
          </p>
        </div>
      </section>

      {/* ACTIVITIES GRID */}
      <section className="py-24 bg-base-cream-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase tracking-[0.25em] text-accent-amber font-semibold font-body mb-3 block">
              What to Expect
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-base-dark mb-5">
              The Full Xhabe Programme
            </h2>
            <p className="font-body text-sm text-base-dark/65 leading-loose">
              Activities are woven into your stay package — some are included, some are available to add on. Every itinerary is personalised by your guide each morning based on the wildlife and conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activities.map((act) => {
              const Icon = act.icon;
              return (
                <div
                  key={act.name}
                  className="group bg-white border border-base-dark/5 overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Activity image */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={act.image}
                      alt={`${act.name} at Xhabe Safari Lodge`}
                      fill
                      sizes="(max-width:768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Icon badge */}
                    <div className="absolute bottom-4 left-4 w-10 h-10 bg-base-dark/80 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent-amber" />
                    </div>
                  </div>
                  {/* Activity content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-display text-xl text-base-dark mb-3">{act.name}</h3>
                    <p className="font-body text-sm text-base-dark/70 leading-loose mb-4 flex-grow">
                      {act.description}
                    </p>
                    <span className="inline-block font-body text-[10px] uppercase tracking-wider font-semibold text-accent-amber border border-accent-amber/30 px-3 py-1 bg-accent-amber/5 w-fit">
                      {act.included}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PACKAGE MATCH CTA */}
      <section className="py-20 bg-base-dark text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl text-base-cream mb-5">
            Match Your Activities to a Package
          </h2>
          <p className="font-body text-sm text-white/65 mb-10">
            Each of our three stay packages bundles specific activities. Choose the one that fits your time and budget, and your guide will take care of the rest.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/book" variant="primary" showArrow>
              View Packages & Rates
            </Button>
            <Button href="/accommodation" variant="secondary" className="!border-white/30 !text-white/80 hover:!bg-white hover:!text-base-dark">
              See the Chalets
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
