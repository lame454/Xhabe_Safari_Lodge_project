import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import StickyBookCta from "@/components/StickyBookCta";
import { GlassPanel } from "@/components/Glass";
import { CONTACT, whatsappHref } from "@/lib/config/contact";
import {
  CAMPING_RATES,
  CANCELLATION_POLICY,
  CHALET_RATES,
  CURRENCY,
  PAYMENT_POLICY,
  RATE_EXCLUDES,
  RATE_INCLUDES,
  TRANSFER_RATES,
  VALID_PERIOD,
} from "@/lib/data/rates";

export const metadata: Metadata = {
  title: "Rates | Xhabe Safari Lodge — Chobe, Botswana",
  description:
    "Nightly rates for Xhabe Safari Lodge in the Chobe District, Botswana. SADC and international rates, rack and tour-operator pricing, camping and Savuti transfers.",
};

export default function RatesPage() {
  return (
    <>
      <NavBar overHero />

      {/* HERO */}
      <section className="relative h-[58svh] min-h-[380px] flex items-end overflow-hidden">
        <Image
          src="/images/pool-chalets-floodplain.jpg"
          alt="The swimming pool at Xhabe Safari Lodge with two tented chalets and the Chobe floodplain beyond"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <span aria-hidden="true" className="absolute inset-0 scrim-bottom" />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          <span className="font-body text-[10px] uppercase tracking-[0.3em] text-accent-soft font-semibold">
            Rates
          </span>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white mt-4 leading-none">
            What a night costs.
          </h1>
          <p className="font-body text-sm text-white/70 mt-4">Valid {VALID_PERIOD}</p>
        </div>
      </section>

      {/* CHALET RATES */}
      <section className="py-16 sm:py-24 bg-base-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl text-base-dark mb-2">
            Luxury tented chalet
          </h2>
          <p className="font-body text-sm text-base-dark/60 mb-8">
            Per room, per night, in {CURRENCY}. <strong className="font-semibold">Rack</strong> is
            the direct rate; <strong className="font-semibold">STO</strong> is the tour-operator
            rate.
          </p>

          {/* Cards on small screens — a four-column table does not survive a phone. */}
          <div className="grid sm:grid-cols-2 gap-4">
            {CHALET_RATES.map((row) => (
              <GlassPanel key={row.audience} className="p-6 sm:p-8">
                <h3 className="font-display text-xl text-base-dark mb-1">{row.audience}</h3>
                <p className="font-body text-[11px] uppercase tracking-wider text-base-dark/45 mb-6">
                  {row.audience === "SADC"
                    ? "Southern African Development Community residents"
                    : "All other nationalities"}
                </p>

                <dl className="space-y-4">
                  {[
                    { label: "Rack — single", value: row.rack.single },
                    { label: "Rack — double", value: row.rack.double },
                    { label: "STO — single", value: row.sto.single },
                    { label: "STO — double", value: row.sto.double },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-baseline justify-between gap-4 border-b border-base-dark/[0.08] pb-3 last:border-0"
                    >
                      <dt className="font-body text-sm text-base-dark/70">{item.label}</dt>
                      <dd className="font-display text-2xl text-base-dark">
                        <span className="text-sm text-base-dark/40 mr-1">{CURRENCY}</span>
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* CAMPING + TRANSFERS */}
      <section className="py-16 sm:py-24 bg-base-cream/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-4">
          <GlassPanel className="p-6 sm:p-8">
            <h2 className="font-display text-xl text-base-dark mb-1">Camping</h2>
            <p className="font-body text-[11px] uppercase tracking-wider text-base-dark/45 mb-6">
              Per person, per night · all year round
            </p>
            <dl className="space-y-4">
              {CAMPING_RATES.map((row) => (
                <div key={row.audience}>
                  <dt className="font-body text-sm text-base-dark/70 mb-1">{row.audience}</dt>
                  <dd className="flex items-baseline gap-4">
                    <span className="font-display text-2xl text-base-dark">
                      <span className="text-sm text-base-dark/40 mr-1">{CURRENCY}</span>
                      {row.rack}
                      <span className="font-body text-[11px] uppercase tracking-wider text-base-dark/40 ml-1.5">
                        rack
                      </span>
                    </span>
                    <span className="font-display text-2xl text-base-dark/60">
                      <span className="text-sm text-base-dark/35 mr-1">{CURRENCY}</span>
                      {row.sto}
                      <span className="font-body text-[11px] uppercase tracking-wider text-base-dark/35 ml-1.5">
                        sto
                      </span>
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </GlassPanel>

          <GlassPanel className="p-6 sm:p-8">
            <h2 className="font-display text-xl text-base-dark mb-1">Transfers</h2>
            <p className="font-body text-[11px] uppercase tracking-wider text-base-dark/45 mb-6">
              Per person
            </p>
            {TRANSFER_RATES.map((transfer) => (
              <div key={transfer.name}>
                <h3 className="font-body text-sm font-semibold text-base-dark mb-3">
                  {transfer.name}
                </h3>
                <dl className="space-y-3">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="font-body text-sm text-base-dark/70">SADC</dt>
                    <dd className="font-body text-sm text-base-dark">
                      {CURRENCY} {transfer.sadc.rack} rack · {transfer.sadc.sto} STO
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="font-body text-sm text-base-dark/70">International</dt>
                    <dd className="font-body text-sm text-base-dark">
                      {CURRENCY} {transfer.international.rack} rack · {transfer.international.sto}{" "}
                      STO
                    </dd>
                  </div>
                </dl>
                <p className="font-body text-xs text-base-dark/50 mt-4">{transfer.note}</p>
              </div>
            ))}
            <p className="font-body text-xs text-base-dark/50 mt-6 pt-4 border-t border-base-dark/[0.08]">
              Transfers from the airport or any entry point can also be arranged — ask when you
              book.
            </p>
          </GlassPanel>
        </div>
      </section>

      {/* INCLUDED / EXCLUDED */}
      <section className="py-16 sm:py-24 bg-base-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl text-base-dark mb-8">
            What the rate covers
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <GlassPanel className="p-6 sm:p-8">
              <h3 className="font-body text-[11px] uppercase tracking-[0.2em] font-semibold text-accent-ink mb-5">
                Included
              </h3>
              <ul className="space-y-2.5">
                {RATE_INCLUDES.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-accent-amber shrink-0 mt-0.5" />
                    <span className="font-body text-sm text-base-dark/80">{item}</span>
                  </li>
                ))}
              </ul>
            </GlassPanel>

            <GlassPanel className="p-6 sm:p-8">
              <h3 className="font-body text-[11px] uppercase tracking-[0.2em] font-semibold text-base-dark/45 mb-5">
                Not included
              </h3>
              <ul className="space-y-2.5">
                {RATE_EXCLUDES.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <X className="w-4 h-4 text-base-dark/30 shrink-0 mt-0.5" />
                    <span className="font-body text-sm text-base-dark/70">{item}</span>
                  </li>
                ))}
              </ul>
            </GlassPanel>
          </div>
        </div>
      </section>

      {/* POLICIES */}
      <section className="py-16 sm:py-24 bg-base-cream/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl text-base-dark mb-8">
            Payment &amp; cancellation
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <GlassPanel className="p-6 sm:p-8">
              <h3 className="font-body text-[11px] uppercase tracking-[0.2em] font-semibold text-accent-ink mb-5">
                Payment
              </h3>
              <ol className="space-y-4">
                {PAYMENT_POLICY.map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="font-display text-lg text-accent-amber leading-none shrink-0 w-5">
                      {i + 1}
                    </span>
                    <span className="font-body text-sm text-base-dark/80 leading-relaxed">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </GlassPanel>

            <GlassPanel className="p-6 sm:p-8">
              <h3 className="font-body text-[11px] uppercase tracking-[0.2em] font-semibold text-accent-ink mb-5">
                Cancellation
              </h3>
              <ul className="space-y-4">
                {CANCELLATION_POLICY.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-amber mt-2 shrink-0" />
                    <span className="font-body text-sm text-base-dark/80 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </GlassPanel>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <Image
          src="/images/main-building-blue-hour.jpg"
          alt="The main building at Xhabe Safari Lodge glowing warm against a deep blue evening sky"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-5">
            Ready when you are.
          </h2>
          <p className="font-body text-sm text-white/75 mb-9">
            Pick your dates and we&apos;ll confirm availability, or send us a note and we&apos;ll
            put a quote together.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/book"
              className="group inline-flex items-center gap-2 rounded-full bg-accent-amber text-white font-body text-xs font-semibold uppercase tracking-[0.14em] px-8 py-4 shadow-xl shadow-black/25 hover:brightness-95 active:scale-[0.98] transition-all duration-300 ease-spring"
            >
              Check availability
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href={whatsappHref(
                "Hello Xhabe Safari Lodge, I'd like a quote for a stay."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full glass-dark text-white font-body text-xs font-semibold uppercase tracking-[0.14em] px-8 py-4 hover:bg-white/15 active:scale-[0.98] transition-all duration-300 ease-spring"
            >
              Ask on WhatsApp
            </a>
          </div>
          <p className="font-body text-xs text-white/45 mt-6">
            Or email {CONTACT.email}
          </p>
        </div>
      </section>

      <StickyBookCta />
      <Footer />
    </>
  );
}
