import type { Metadata } from "next";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import BookingForm from "@/components/BookingForm";
import { CheckCircle2 } from "lucide-react";
import { getPackages, getActiveRateSeason } from "@/lib/data/packages";

export const metadata: Metadata = {
  title: "Book Your Stay | Xhabe Safari Lodge — Packages & Rates",
  description:
    "Book a 1, 2, or 3-night all-inclusive stay at Xhabe Safari Lodge in the Chobe District, Botswana. Game drives, river cruises, Victoria Falls, and boma dinners included.",
};

export default async function BookPage() {
  const [{ packages }, activeRate] = await Promise.all([getPackages(), getActiveRateSeason()]);
  return (
    <>
      <NavBar />

      {/* PAGE HERO */}
      <section className="relative h-[50vh] min-h-[360px] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-chobe.jpg"
            alt="Chobe River sunset viewed from Xhabe Safari Lodge, Botswana"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 md:pb-20">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent-amber font-semibold font-body mb-3 block">
            Availability & Rates
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4 leading-none tracking-wide">
            Plan Your Safari.
          </h1>
        </div>
      </section>

      {/* PACKAGE COMPARISON */}
      <section className="py-24 bg-base-cream-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase tracking-[0.25em] text-accent-amber font-semibold font-body mb-3 block">
              Choose Your Package
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-base-dark mb-5">
              Three Ways to Experience Xhabe
            </h2>
            <p className="font-body text-sm text-base-dark/65 leading-loose">
              All packages are all-inclusive of accommodation, meals, and the listed activities.
              {activeRate
                ? ` Current ${activeRate.season_name} rates from ${activeRate.currency ?? "USD"} ${activeRate.rate_single ?? activeRate.rate_double} per person per night.`
                : " Rates are available on enquiry — contact us directly for current pricing and special seasonal rates."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, i) => {
              const highlight = i === 1;
              return (
                <div
                  key={pkg.id}
                  className={`relative flex flex-col border ${
                    highlight ? "border-accent-amber shadow-xl shadow-accent-amber/10" : "border-base-dark/10"
                  } bg-white`}
                >
                  {highlight && (
                    <div className="bg-accent-amber text-base-dark text-center py-2">
                      <span className="font-body text-[10px] uppercase tracking-widest font-bold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="font-display text-2xl text-base-dark mb-1">{pkg.name}</h3>
                    <span className="font-body text-xs uppercase tracking-wider text-base-dark/50 block mb-1">
                      {pkg.nights} {pkg.nights === 1 ? "Night" : "Nights"}
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

                    {/* Included activities */}
                    <h4 className="font-body text-[10px] uppercase tracking-wider text-base-dark/50 mb-3 font-semibold">
                      Included
                    </h4>
                    <ul className="space-y-2 mb-8 flex-grow">
                      {(pkg.inclusions ?? []).map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-accent-amber flex-shrink-0 mt-0.5" />
                          <span className="font-body text-xs text-base-dark/75 leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      href="#book-now"
                      variant={highlight ? "primary" : "secondary"}
                      className="w-full text-center justify-center"
                    >
                      Check Availability
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOOKING FORM */}
      <section id="book-now" className="py-24 bg-white scroll-mt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.25em] text-accent-amber font-semibold font-body mb-3 block">
              Check Availability
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-base-dark mb-5">
              Request Your Stay
            </h2>
            <p className="font-body text-sm text-base-dark/65 leading-loose">
              Enter your dates to check chalet availability. Once confirmed available, fill in your
              details and we'll follow up with a personalised quote within 24 hours.
            </p>
          </div>
          <BookingForm packages={packages} />
        </div>
      </section>


      {/* BOOKING NOTES */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl text-base-dark mb-10 text-center">
            Booking Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "How to Book",
                items: [
                  "Contact us via the enquiry form or WhatsApp/email",
                  "We'll confirm availability and send a personalised quote",
                  "A deposit secures your reservation",
                  "Balance is due 30 days before arrival",
                ],
              },
              {
                title: "What to Bring",
                items: [
                  "Neutral-coloured clothing (khaki, olive, tan)",
                  "Wide-brimmed hat, sunscreen, insect repellent",
                  "Binoculars and camera with zoom lens",
                  "Light jacket for early morning drives (June–August)",
                ],
              },
              {
                title: "Best Time to Visit",
                items: [
                  "Dry season (May–October): best wildlife viewing, low vegetation",
                  "Green season (Nov–April): lush landscapes, fewer guests",
                  "Elephant numbers peak around Chobe River (year-round)",
                  "Birdwatching peaks in the wet season (Nov–Mar)",
                ],
              },
              {
                title: "Cancellation Policy",
                items: [
                  "Cancellation 30+ days before arrival: full refund of deposit",
                  "Cancellation 15–29 days: 50% refund",
                  "Cancellation under 14 days: deposit forfeited",
                  "Travel insurance strongly recommended",
                ],
              },
            ].map((section) => (
              <div key={section.title} className="border-l-2 border-accent-amber pl-6">
                <h3 className="font-display text-lg text-base-dark mb-3">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-accent-amber mt-2 flex-shrink-0" />
                      <span className="font-body text-sm text-base-dark/75">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIRECT CONTACT CTA */}
      <section className="py-20 bg-base-dark text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl text-base-cream mb-5">
            Ready to Reserve?
          </h2>
          <p className="font-body text-sm text-white/65 mb-10">
            Availability is limited to 8 chalets. Get in touch and we'll personalise your itinerary, confirm dates, and send a quote within 24 hours.
          </p>
          <Button href="/contact" variant="primary" showArrow>
            Send an Enquiry
          </Button>
        </div>
      </section>

      <Footer />
    </>
  );
}
