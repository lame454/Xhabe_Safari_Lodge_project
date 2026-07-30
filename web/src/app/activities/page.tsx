import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Images } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import StickyBookCta from "@/components/StickyBookCta";
import { ACTIVITIES } from "@/lib/data/activities";
import { getGalleryImages, filterByActivity, previewImageByActivity } from "@/lib/data/gallery";

export const metadata: Metadata = {
  title: "Activities & Experiences | Xhabe Safari Lodge — Chobe, Botswana",
  description:
    "Game drives, river cruises, Victoria Falls day trips, cultural village visits, canoe safaris, boma dinners and stargazing at Xhabe Safari Lodge in the Chobe District, Botswana.",
};

export default async function ActivitiesPage() {
  const { images } = await getGalleryImages();

  // Preview thumbnails come straight from the Gallery, so each activity shows a
  // real example of itself rather than needing its own new photography. Until a
  // photo is tagged for an activity, we fall back to the activity's own image.
  const previews = previewImageByActivity(images);

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
            {ACTIVITIES.map((act) => {
              const Icon = act.icon;
              const galleryHref = `/gallery?activity=${act.slug}`;
              const preview = previews[act.slug];
              const tagged = filterByActivity(images, act.slug);
              // Prefer a real Gallery photo of this activity; otherwise use the
              // activity's own image so the card is never empty.
              const cardImage = preview?.storage_path ?? act.image;
              const cardImageAlt = preview?.alt_text ?? `${act.name} at Xhabe Safari Lodge`;

              return (
                <article
                  key={act.slug}
                  id={act.slug}
                  className="group bg-white border border-base-dark/5 overflow-hidden flex flex-col transition duration-300 hover:shadow-lg hover:border-accent-amber/30 scroll-mt-28"
                >
                  {/* Image links through to this activity's photos in the Gallery */}
                  <Link
                    href={galleryHref}
                    aria-label={`View ${act.name} photos in the gallery`}
                    className="relative h-56 overflow-hidden block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber focus-visible:ring-inset"
                  >
                    <Image
                      src={cardImage}
                      alt={cardImageAlt}
                      fill
                      sizes="(max-width:768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105 group-active:scale-105"
                    />

                    {/* Icon badge — part of the same link, so tapping the icon works too */}
                    <span className="absolute bottom-4 left-4 w-10 h-10 bg-base-dark/80 flex items-center justify-center transition-colors duration-300 group-hover:bg-accent-amber group-active:bg-accent-amber">
                      <Icon className="w-5 h-5 text-accent-amber transition-colors duration-300 group-hover:text-white group-active:text-white" />
                    </span>

                    {/* Gallery affordance: always visible on touch, hover-revealed
                        where the pointer can hover — see `.affordance` in globals.css */}
                    <span className="affordance absolute bottom-4 right-4 inline-flex items-center gap-2 bg-base-dark/80 text-white font-body text-[10px] uppercase tracking-widest px-3 py-2">
                      <Images className="w-3.5 h-3.5" />
                      {tagged.length > 0 ? `${tagged.length} photos` : "Gallery"}
                    </span>
                  </Link>

                  {/* Activity content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-display text-xl text-base-dark mb-3">
                      <Link
                        href={galleryHref}
                        className="hover:text-accent-amber active:text-accent-amber transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber"
                      >
                        {act.name}
                      </Link>
                    </h3>
                    <p className="font-body text-sm text-base-dark/70 leading-loose mb-4 flex-grow">
                      {act.description}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="inline-block font-body text-[10px] uppercase tracking-wider font-semibold text-accent-amber border border-accent-amber/30 px-3 py-1 bg-accent-amber/5 w-fit">
                        {act.included}
                      </span>
                      <Link
                        href={galleryHref}
                        // -my-2/py-2 grows the touch target to ~40px without
                        // changing the layout.
                        className="group/link inline-flex items-center gap-1.5 -my-2 py-2 font-body text-[10px] uppercase tracking-widest font-semibold text-base-dark/60 hover:text-accent-amber active:text-accent-amber transition-colors duration-200"
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
            <Button href="/packages" variant="primary" showArrow>
              View Packages & Rates
            </Button>
            <Button href="/accommodation" variant="secondary" className="!border-white/30 !text-white/80 hover:!bg-white hover:!text-base-dark">
              See the Chalets
            </Button>
          </div>
        </div>
      </section>

      <StickyBookCta />
      <Footer />
    </>
  );
}
