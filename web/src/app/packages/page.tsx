import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { getPackages, getActiveRateSeason, packageSlug } from "@/lib/data/packages";
import { ACTIVITIES } from "@/lib/data/activities";

export const metadata: Metadata = {
  title: "Stay Packages & Rates | Xhabe Safari Lodge — Chobe, Botswana",
  description:
    "Compare Xhabe Safari Lodge's all-inclusive stay packages — 1, 2, and 3-night options with game drives, Chobe River cruises, Victoria Falls day trips, and boma dinners.",
};

export default async function PackagesIndexPage() {
  const [{ packages }, activeRate] = await Promise.all([getPackages(), getActiveRateSeason()]);

  return (
    <>
      <NavBar />

      {/* PAGE HERO */}
      <section className="relative h-[50vh] min-h-[360px] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-chobe.jpg"
            alt="Xhabe Safari Lodge, Chobe District, Botswana"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 md:pb-20">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent-amber font-semibold font-body mb-3 block">
            Stay Packages
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4 leading-none tracking-wide">
            Choose Your<br />Chobe Adventure.
          </h1>
        </div>
      </section>

      {/* PACKAGE CARDS */}
      <section className="py-24 bg-base-cream-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-base-dark mb-5">
              Three Ways to Experience Xhabe
            </h2>
            <p className="font-body text-sm text-base-dark/65 leading-loose">
              Every package is all-inclusive of accommodation, meals, listed activities, and local
              beverages.
              {activeRate
                ? ` Current ${activeRate.season_name} rates from ${activeRate.currency ?? "USD"} ${activeRate.rate_single ?? activeRate.rate_double} per person per night.`
                : " Rates are quoted on enquiry — open a package for details and to request your dates."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, i) => {
              const highlight = i === 1;
              const activityCount = pkg.activity_slugs?.filter((slug) =>
                ACTIVITIES.some((a) => a.slug === slug)
              ).length;

              return (
                // Whole card is one link — the hover lift and arrow are the
                // affordance, so there is no small inner target to miss on a phone.
                <Link
                  key={pkg.id}
                  href={`/packages/${packageSlug(pkg)}`}
                  className={`group relative flex flex-col bg-white border transition duration-300 hover:-translate-y-1.5 hover:shadow-xl active:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber focus-visible:ring-offset-2 ${
                    highlight
                      ? "border-accent-amber shadow-lg shadow-accent-amber/10"
                      : "border-base-dark/10 hover:border-accent-amber/50"
                  }`}
                >
                  {highlight && (
                    <div className="bg-accent-amber text-base-dark text-center py-2">
                      <span className="font-body text-[10px] uppercase tracking-widest font-bold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="font-display text-2xl text-base-dark mb-1 group-hover:text-accent-amber transition-colors duration-300">
                      {pkg.name}
                    </h3>
                    <span className="font-body text-xs uppercase tracking-wider text-base-dark/50 block mb-1">
                      {pkg.nights} {pkg.nights === 1 ? "Night" : "Nights"}
                      {activityCount ? ` · ${activityCount} activities` : ""}
                    </span>
                    {pkg.min_pax ? (
                      <span className="font-body text-[10px] text-accent-amber font-semibold uppercase tracking-wider block mb-4">
                        Minimum {pkg.min_pax} guests
                      </span>
                    ) : (
                      <div className="mb-4" />
                    )}
                    {pkg.description && (
                      <p className="font-body text-sm text-base-dark/65 leading-loose mb-6 pb-6 border-b border-base-dark/10">
                        {pkg.description}
                      </p>
                    )}

                    <h4 className="font-body text-[10px] uppercase tracking-wider text-base-dark/50 mb-3 font-semibold">
                      Included
                    </h4>
                    <ul className="space-y-2 mb-8 flex-grow">
                      {(pkg.inclusions ?? []).slice(0, 5).map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-accent-amber flex-shrink-0 mt-0.5" />
                          <span className="font-body text-xs text-base-dark/75 leading-snug">
                            {item}
                          </span>
                        </li>
                      ))}
                      {(pkg.inclusions?.length ?? 0) > 5 && (
                        <li className="font-body text-xs text-base-dark/45 pl-7">
                          + {(pkg.inclusions?.length ?? 0) - 5} more
                        </li>
                      )}
                    </ul>

                    <span className="flex items-center gap-1.5 font-body text-[11px] uppercase tracking-widest font-semibold text-accent-amber">
                      See full package
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-base-dark text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl text-base-cream mb-5">
            Know Your Dates?
          </h2>
          <p className="font-body text-sm text-white/65 mb-10">
            Availability is limited to 8 chalets. Check the calendar and we&apos;ll confirm your
            stay with a personalised quote within 24 hours.
          </p>
          <Button href="/book" variant="primary" showArrow>
            Check Availability
          </Button>
        </div>
      </section>

      <Footer />
    </>
  );
}
