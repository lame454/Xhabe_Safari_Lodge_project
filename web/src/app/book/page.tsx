import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import Accordion from "@/components/Accordion";
import { GlassPanel } from "@/components/Glass";
import { getPackages, packageSlug } from "@/lib/data/packages";
import { LODGE } from "@/lib/data/lodge";
import {
  CANCELLATION_POLICY,
  CURRENCY,
  PAYMENT_POLICY,
  RATE_INCLUDES,
  lowestNightlyRate,
} from "@/lib/data/rates";

export const metadata: Metadata = {
  title: "Check Availability | Xhabe Safari Lodge — Chobe, Botswana",
  description:
    "Check live availability at Xhabe Safari Lodge and request your stay. Nine luxury tented chalets and camping in the Chobe District, Botswana.",
};

interface PageProps {
  searchParams: Promise<{ package?: string }>;
}

export default async function BookPage({ searchParams }: PageProps) {
  const [{ packages }, { package: packageParam }] = await Promise.all([
    getPackages(),
    searchParams,
  ]);

  // A rates page or sticky CTA can deep-link here with the accommodation type
  // already chosen (`/book?package=chalet`).
  const preselected = packageParam
    ? packages.find((pkg) => packageSlug(pkg) === packageParam)
    : undefined;

  return (
    <>
      <NavBar overHero />

      {/* HERO */}
      <section className="relative h-[52svh] min-h-[340px] flex items-end overflow-hidden">
        <Image
          src="/images/pool-main-building.jpg"
          alt="The pool and main building at Xhabe Safari Lodge under a clear blue sky"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <span aria-hidden="true" className="absolute inset-0 scrim-bottom" />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-14">
          <span className="font-body text-[10px] uppercase tracking-[0.3em] text-accent-soft font-semibold">
            Availability
          </span>
          <h1 className="font-display text-5xl sm:text-6xl text-white mt-4 leading-none">
            Plan your stay.
          </h1>
          <p className="font-body text-sm text-white/70 mt-4">
            From {CURRENCY} {lowestNightlyRate()} per room per night ·{" "}
            <Link href="/rates" className="text-accent-soft hover:underline">
              full rates
            </Link>
          </p>
        </div>
      </section>

      {/* BOOKING FORM */}
      <section id="book-now" className="py-16 sm:py-24 bg-base-light scroll-mt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl text-base-dark mb-4">
              Pick your dates
            </h2>
            <p className="font-body text-sm text-base-dark/65 leading-relaxed max-w-xl mx-auto">
              The calendar shows live availability across all {LODGE.chalets} chalets. Choose your
              nights, and we&apos;ll confirm with a personalised quote within 24 hours.
            </p>
          </div>
          <BookingForm packages={packages} preselectedPackageId={preselected?.id} />
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="py-16 sm:py-20 bg-base-cream/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassPanel className="p-7 sm:p-9">
            <h2 className="font-body text-[11px] uppercase tracking-[0.2em] font-semibold text-accent-ink mb-6">
              Included in the nightly rate
            </h2>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
              {RATE_INCLUDES.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-amber mt-2 shrink-0" />
                  <span className="font-body text-sm text-base-dark/75">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/rates"
              className="group inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-ink hover:text-base-dark transition-colors mt-7"
            >
              See what isn&apos;t included
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </GlassPanel>
        </div>
      </section>

      {/* BOOKING NOTES */}
      <section className="py-16 sm:py-20 bg-base-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl text-base-dark mb-8 text-center">
            Good to know
          </h2>
          <Accordion
            sections={[
              { title: "Payment schedule", items: PAYMENT_POLICY },
              { title: "Cancellation policy", items: CANCELLATION_POLICY },
              {
                title: "Getting here",
                items: [
                  "Kasane International Airport is the nearest airport",
                  "Transfers from the airport or any entry point can be arranged",
                  "Savuti transfers are priced per person — see the rates page",
                  "Free parking at the lodge if you are driving yourself",
                ],
              },
              {
                title: "What to bring",
                items: [
                  "Neutral-coloured clothing for game drives",
                  "Wide-brimmed hat, sunscreen and insect repellent",
                  "Binoculars and a camera with a zoom lens",
                  "A light jacket for early morning and night drives",
                  "Swimwear — the pool is 15 by 7 metres",
                ],
              },
            ]}
          />
        </div>
      </section>

      <Footer />
    </>
  );
}
