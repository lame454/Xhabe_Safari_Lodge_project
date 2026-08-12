import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import StickyBookCta from "@/components/StickyBookCta";
import { GlassPanel } from "@/components/Glass";
import { CONTACT, mailtoHref } from "@/lib/config/contact";
import { getFeaturedTestimonials } from "@/lib/data/testimonials";
import { LISTINGS } from "@/lib/data/listings";

const tripAdvisor = LISTINGS.find((listing) => listing.name === "TripAdvisor");

export const metadata: Metadata = {
  title: "Guest Reviews | Xhabe Safari Lodge",
  description:
    "Guest reviews of Xhabe Safari Lodge in the Chobe District, Botswana.",
};

export default async function ReviewsPage() {
  const { testimonials } = await getFeaturedTestimonials(12);

  return (
    <>
      <NavBar overHero />

      <section className="relative h-[52svh] min-h-[340px] flex items-end overflow-hidden">
        <Image
          src="/images/lounge-open-side.jpg"
          alt="The lounge at Xhabe Safari Lodge, open on two sides to the bush, with wishbone chairs on a wooden deck"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <span aria-hidden="true" className="absolute inset-0 scrim-bottom" />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-14">
          <span className="font-body text-[10px] uppercase tracking-[0.3em] text-accent-soft font-semibold">
            Guest Reviews
          </span>
          <h1 className="font-display text-5xl sm:text-6xl text-white mt-4 leading-none">
            In our guests&apos; words.
          </h1>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-base-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {testimonials.length === 0 ? (
            /*
             * No invented quotes. The demo carried two fabricated reviews with
             * names and star ratings; they have been removed rather than
             * reworded. This state disappears the moment real ones are added.
             */
            <GlassPanel className="p-8 sm:p-12 text-center max-w-2xl mx-auto">
              <h2 className="font-display text-2xl sm:text-3xl text-base-dark mb-4">
                Reviews are on their way.
              </h2>
              <p className="font-body text-sm text-base-dark/70 leading-relaxed mb-8">
                We would rather show you nothing than show you words no guest actually said. If
                you have stayed with us, we would genuinely like to hear how it went — and with
                your permission we will put it here.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <a
                  href={mailtoHref("My stay at Xhabe Safari Lodge")}
                  className="group inline-flex items-center gap-2 rounded-full bg-accent-amber text-white font-body text-xs font-semibold uppercase tracking-[0.14em] px-7 py-3.5 hover:brightness-95 active:scale-[0.98] transition-all duration-300 ease-spring"
                >
                  Share your stay
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
                <Link
                  href="/gallery"
                  className="inline-flex items-center rounded-full border border-base-dark/15 text-base-dark font-body text-xs font-semibold uppercase tracking-[0.14em] px-7 py-3.5 hover:bg-base-dark hover:text-white active:scale-[0.98] transition-all duration-300 ease-spring"
                >
                  See the lodge instead
                </Link>
              </div>
              <p className="font-body text-[11px] text-base-dark/40 mt-6">
                Or write to us at {CONTACT.email}
                {tripAdvisor && (
                  <>
                    {" "}
                    — or{" "}
                    <a
                      href={tripAdvisor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-accent-amber transition"
                    >
                      leave a review on TripAdvisor
                    </a>
                  </>
                )}
              </p>
            </GlassPanel>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {testimonials.map((review) => (
                <GlassPanel key={review.id} as="article" className="p-7 sm:p-9 flex flex-col">
                  <div
                    className="flex gap-1 text-accent-amber mb-5"
                    aria-label={`${review.rating ?? 5} out of 5 stars`}
                  >
                    {Array.from({ length: review.rating ?? 5 }, (_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="font-display text-xl text-base-dark leading-relaxed flex-grow">
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>
                  <footer className="font-body text-[11px] uppercase tracking-[0.16em] text-base-dark/50 mt-7">
                    {review.guest_name} · {review.source}
                  </footer>
                </GlassPanel>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative py-24 overflow-hidden">
        <Image
          src="/images/sunset-pool-chalets.jpg"
          alt="Sunset over the pool at Xhabe Safari Lodge with the chalets in silhouette"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-8">
            Ready for your own story?
          </h2>
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
