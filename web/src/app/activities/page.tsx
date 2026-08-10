import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Images } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import StickyBookCta from "@/components/StickyBookCta";
import { GlassPanel } from "@/components/Glass";
import { ACTIVITIES } from "@/lib/data/activities";
import { getGalleryImages, filterByActivity, previewImageByActivity } from "@/lib/data/gallery";

export const metadata: Metadata = {
  title: "Activities | Xhabe Safari Lodge — Chobe, Botswana",
  description:
    "Game drives morning, afternoon and night, Chobe River boat cruises, mokoro trips, sundowners, Victoria Falls day trips, village tours and basketry weaving at Xhabe Safari Lodge.",
};

export default async function ActivitiesPage() {
  const { images } = await getGalleryImages();
  // Preview thumbnails come from the Gallery, so each activity shows a real
  // example of itself; until a photo is tagged we fall back to its own image.
  const previews = previewImageByActivity(images);

  return (
    <>
      <NavBar overHero />

      {/* HERO */}
      <section className="relative h-[70svh] min-h-[440px] flex items-end overflow-hidden">
        <Image
          src="/images/giraffe-tower.jpg"
          alt="Four giraffes standing together in open Chobe bush under a clear sky"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <span aria-hidden="true" className="absolute inset-0 scrim-bottom" />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          <span className="font-body text-[10px] uppercase tracking-[0.3em] text-accent-soft font-semibold">
            Activities
          </span>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white mt-4 leading-none max-w-3xl">
            The game comes to the doorstep.
          </h1>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-16 sm:py-20 bg-base-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="font-body text-base sm:text-lg text-base-dark/75 leading-relaxed">
            Every activity is led by a professional guide in a clean 4x4, and every itinerary is
            shaped around what you actually want to see. Most are covered by the nightly rate.
          </p>
        </div>
      </section>

      {/* ACTIVITY GRID */}
      <section className="pb-16 sm:pb-24 bg-base-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-4">
            {ACTIVITIES.map((activity) => {
              const Icon = activity.icon;
              const galleryHref = `/gallery?activity=${activity.slug}`;
              const preview = previews[activity.slug];
              const tagged = filterByActivity(images, activity.slug);
              const cardImage = preview?.storage_path ?? activity.image;
              const cardAlt = preview?.alt_text ?? activity.imageAlt;

              return (
                <article
                  key={activity.slug}
                  id={activity.slug}
                  className="group rounded-glass overflow-hidden bg-white shadow-sm ring-1 ring-base-dark/[0.06] flex flex-col scroll-mt-28 transition-all duration-500 ease-soft hover:shadow-xl hover:-translate-y-1"
                >
                  <Link
                    href={galleryHref}
                    aria-label={`View ${activity.name} photos in the gallery`}
                    className="relative h-60 sm:h-64 block overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber focus-visible:ring-inset"
                  >
                    <Image
                      src={cardImage}
                      alt={cardAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-[900ms] ease-soft group-hover:scale-105"
                    />
                    <span aria-hidden="true" className="absolute inset-0 scrim-bottom opacity-70" />

                    <span className="absolute bottom-4 left-4 w-11 h-11 rounded-2xl glass-dark flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent-soft" />
                    </span>

                    {/* Visible on touch, hover-revealed on pointer devices */}
                    <span className="affordance absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full glass-dark text-white font-body text-[10px] uppercase tracking-[0.16em] px-3.5 py-2">
                      <Images className="w-3.5 h-3.5" />
                      {tagged.length > 0 ? `${tagged.length} photos` : "Gallery"}
                    </span>
                  </Link>

                  <div className="p-6 sm:p-7 flex flex-col flex-grow">
                    <h2 className="font-display text-2xl text-base-dark mb-3">
                      <Link
                        href={galleryHref}
                        className="hover:text-accent-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber rounded"
                      >
                        {activity.name}
                      </Link>
                    </h2>
                    <p className="font-body text-sm text-base-dark/70 leading-relaxed mb-5 flex-grow">
                      {activity.description}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span
                        className={`inline-block font-body text-[10px] uppercase tracking-[0.16em] font-semibold rounded-full px-3.5 py-1.5 ${
                          activity.included.startsWith("Included")
                            ? "text-accent-ink bg-accent-amber/10"
                            : "text-base-dark/55 bg-base-dark/[0.05]"
                        }`}
                      >
                        {activity.included}
                      </span>
                      <Link
                        href={galleryHref}
                        className="group/link inline-flex items-center gap-1.5 -my-2 py-2 font-body text-[10px] uppercase tracking-[0.16em] font-semibold text-base-dark/55 hover:text-accent-ink transition-colors"
                      >
                        See photos
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 sm:py-24 bg-base-cream/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl sm:text-4xl text-base-dark mb-3">
            And everything around it.
          </h2>
          <p className="font-body text-sm text-base-dark/60 mb-10 max-w-xl">
            The practical things that make a remote lodge work, all included.
          </p>
          <GlassPanel className="p-7 sm:p-9">
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
              {[
                "Well-maintained fleet for activities",
                "24-hour security — CCTV, electric fence and guard",
                "Free parking",
                "Safety briefing on arrival",
                "Fire services throughout the lodge",
                "Lightning protection",
                "Back-up generator",
                "Wi-Fi",
                "Free laundry service",
                "Card payments accepted",
                "Book corners for readers",
                "Transfers from the airport or any entry point",
              ].map((service) => (
                <li key={service} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-amber mt-2 shrink-0" />
                  <span className="font-body text-sm text-base-dark/75 leading-relaxed">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </GlassPanel>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <Image
          src="/images/mokoro-chobe-river.jpg"
          alt="Guides poling a mokoro canoe through the Chobe shallows at golden hour"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-5">
            Build your days with us.
          </h2>
          <p className="font-body text-sm text-white/75 mb-9">
            Tell us what you want out of the trip and your guide will plan around it each morning.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/book"
              className="group inline-flex items-center gap-2 rounded-full bg-accent-amber text-white font-body text-xs font-semibold uppercase tracking-[0.14em] px-8 py-4 shadow-xl shadow-black/25 hover:brightness-95 active:scale-[0.98] transition-all duration-300 ease-spring"
            >
              Check availability
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/rates"
              className="inline-flex items-center rounded-full glass-dark text-white font-body text-xs font-semibold uppercase tracking-[0.14em] px-8 py-4 hover:bg-white/15 active:scale-[0.98] transition-all duration-300 ease-spring"
            >
              See rates
            </Link>
          </div>
        </div>
      </section>

      <StickyBookCta />
      <Footer />
    </>
  );
}
