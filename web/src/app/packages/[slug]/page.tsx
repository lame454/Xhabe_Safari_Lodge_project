import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft, CheckCircle2, Users, Moon } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import StickyBookCta from "@/components/StickyBookCta";
import { getPackages, getPackageBySlug, getActiveRateSeason, packageSlug } from "@/lib/data/packages";
import { ACTIVITIES } from "@/lib/data/activities";
import { CONTACT, whatsappHref } from "@/lib/config/contact";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-render a route for each package that exists at build time. */
export async function generateStaticParams() {
  const { packages } = await getPackages();
  return packages.map((pkg) => ({ slug: packageSlug(pkg) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);

  if (!pkg) {
    return { title: "Package Not Found | Xhabe Safari Lodge" };
  }

  const nights = `${pkg.nights} ${pkg.nights === 1 ? "night" : "nights"}`;
  return {
    title: `${pkg.name} — ${nights} All-Inclusive | Xhabe Safari Lodge`,
    description:
      pkg.description ??
      `A ${nights} all-inclusive stay at Xhabe Safari Lodge in the Chobe District, Botswana.`,
  };
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const [pkg, { packages }, activeRate] = await Promise.all([
    getPackageBySlug(slug),
    getPackages(),
    getActiveRateSeason(),
  ]);

  if (!pkg) notFound();

  // Activities bundled into this package, in the site's canonical order.
  const includedActivities = ACTIVITIES.filter((activity) =>
    pkg.activity_slugs?.includes(activity.slug)
  );

  const otherPackages = packages.filter((p) => packageSlug(p) !== slug);
  const heroImage = includedActivities[0]?.image ?? "/images/hero-chobe.jpg";
  const nightsLabel = `${pkg.nights} ${pkg.nights === 1 ? "Night" : "Nights"}`;

  const rateLine = activeRate
    ? `${activeRate.currency ?? "USD"} ${activeRate.rate_double ?? activeRate.rate_single} per person per night (${activeRate.season_name})`
    : null;

  return (
    <>
      <NavBar />

      {/* PAGE HERO */}
      <section className="relative h-[55vh] min-h-[400px] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt={`${pkg.name} at Xhabe Safari Lodge`}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-14 md:pb-20">
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.25em] text-white/70 hover:text-accent-amber active:text-accent-amber transition-colors duration-200 mb-5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Packages
          </Link>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-5 leading-none tracking-wide">
            {pkg.name}
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-wider text-base-cream">
              <Moon className="w-4 h-4 text-accent-amber" />
              {nightsLabel}
            </span>
            {pkg.min_pax && (
              <span className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-wider text-base-cream">
                <Users className="w-4 h-4 text-accent-amber" />
                Minimum {pkg.min_pax} guests
              </span>
            )}
            <span className="font-body text-xs uppercase tracking-wider text-base-cream">
              All-inclusive
            </span>
          </div>
        </div>
      </section>

      {/* OVERVIEW + INCLUSIONS + RATES */}
      <section className="py-24 bg-base-cream-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Narrative + inclusions */}
            <div className="lg:col-span-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent-amber font-semibold font-body mb-3 block">
                The Stay
              </span>
              <h2 className="font-display text-3xl md:text-4xl text-base-dark mb-6 leading-tight">
                What {pkg.name} Includes
              </h2>
              {pkg.description && (
                <p className="font-body text-base text-base-dark/75 leading-loose mb-10">
                  {pkg.description}
                </p>
              )}

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {(pkg.inclusions ?? []).map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-accent-amber flex-shrink-0 mt-1" />
                    <span className="font-body text-sm text-base-dark/80 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Rates + booking action */}
            <aside className="lg:col-span-1">
              <div className="border border-base-dark/10 bg-white p-8 lg:sticky lg:top-28">
                <span className="font-body text-[10px] uppercase tracking-widest text-base-dark/40 font-semibold block mb-2">
                  Rates
                </span>
                {rateLine ? (
                  <p className="font-display text-2xl text-base-dark leading-snug mb-2">{rateLine}</p>
                ) : (
                  <p className="font-body text-sm text-base-dark/70 leading-loose mb-2">
                    Rates for this package are quoted on enquiry — seasonal pricing and group
                    discounts apply, so we&apos;ll send you an exact figure for your dates.
                  </p>
                )}
                <p className="font-body text-xs text-base-dark/50 leading-relaxed mb-8">
                  Includes accommodation, all meals, listed activities, and local beverages.
                </p>

                <div className="flex flex-col gap-3">
                  <Button
                    href={`/book?package=${packageSlug(pkg)}`}
                    variant="primary"
                    showArrow
                    className="w-full justify-center"
                  >
                    Check Availability
                  </Button>
                  <a
                    href={whatsappHref(
                      `Hello Xhabe Safari Lodge, I'd like to enquire about ${pkg.name} (${nightsLabel}).`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center font-body text-xs font-semibold uppercase tracking-wider bg-[#25D366] text-white px-6 py-3.5 hover:bg-base-dark active:bg-base-dark transition duration-300"
                  >
                    Ask on WhatsApp
                  </a>
                  <Link
                    href="/contact"
                    className="text-center font-body text-[11px] text-base-dark/50 hover:text-accent-amber active:text-accent-amber transition-colors duration-200 pt-1"
                  >
                    or email {CONTACT.email}
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* INCLUDED ACTIVITIES — each links through to the Activities page */}
      {includedActivities.length > 0 && (
        <section className="py-24 bg-white border-y border-base-dark/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent-amber font-semibold font-body mb-3 block">
                Activities
              </span>
              <h2 className="font-display text-3xl md:text-4xl text-base-dark mb-5">
                Included in This Package
              </h2>
              <p className="font-body text-sm text-base-dark/65 leading-loose">
                Tap any activity to read the full description and see photos from the Gallery.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {includedActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <Link
                    key={activity.slug}
                    href={`/activities#${activity.slug}`}
                    className="group relative h-56 overflow-hidden border border-base-dark/5 block transition duration-300 hover:-translate-y-1 hover:shadow-lg active:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber focus-visible:ring-offset-2"
                  >
                    <Image
                      src={activity.image}
                      alt={`${activity.name} at Xhabe Safari Lodge`}
                      fill
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105 group-active:scale-105"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-base-dark/85 via-base-dark/25 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between gap-3">
                      <span>
                        <Icon className="w-5 h-5 text-accent-amber mb-2" />
                        <span className="font-display text-lg text-white block leading-tight">
                          {activity.name}
                        </span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-accent-amber flex-shrink-0 mb-1 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* COMPARE OTHER PACKAGES */}
      {otherPackages.length > 0 && (
        <section className="py-24 bg-base-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl md:text-4xl text-base-cream mb-5">
              Considering Something Else?
            </h2>
            <p className="font-body text-sm text-white/65 max-w-xl mx-auto mb-12">
              Compare {pkg.name} against the other stays — every package is all-inclusive, the
              difference is how much of the Chobe you get to see.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {otherPackages.map((other) => (
                <Link
                  key={other.id}
                  href={`/packages/${packageSlug(other)}`}
                  className="group border border-white/10 bg-white/[0.02] p-7 text-left transition duration-300 hover:-translate-y-1 hover:border-accent-amber/50 hover:bg-white/[0.06] active:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber focus-visible:ring-offset-2 focus-visible:ring-offset-base-dark"
                >
                  <h3 className="font-display text-xl text-white mb-1 group-hover:text-accent-amber transition-colors duration-300">
                    {other.name}
                  </h3>
                  <span className="font-body text-xs uppercase tracking-wider text-white/50 block mb-4">
                    {other.nights} {other.nights === 1 ? "Night" : "Nights"}
                  </span>
                  <span className="flex items-center gap-1.5 font-body text-[10px] uppercase tracking-widest font-semibold text-accent-amber">
                    View package
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <StickyBookCta packageSlug={packageSlug(pkg)} label={`Book ${pkg.name}`} />
      <Footer />
    </>
  );
}
