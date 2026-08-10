import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import StickyBookCta from "@/components/StickyBookCta";
import { GlassPanel, StatPlate } from "@/components/Glass";
import { LODGE } from "@/lib/data/lodge";

export const metadata: Metadata = {
  title: "About | Xhabe Safari Lodge — Chobe, Botswana",
  description:
    "Xhabe Safari Lodge sits on a plateau in Chobe West, five kilometres from Chobe National Park. All ten staff come from the Chobe Enclave, and the lodge sources its crafts, produce and materials locally.",
};

export default function AboutPage() {
  return (
    <>
      <NavBar overHero />

      {/* HERO */}
      <section className="relative h-[70svh] min-h-[440px] flex items-end overflow-hidden">
        <Image
          src="/images/reception-lounge-golden.jpg"
          alt="The open-sided reception lounge at Xhabe Safari Lodge in late afternoon light, with burnt-orange velvet armchairs"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <span aria-hidden="true" className="absolute inset-0 scrim-bottom" />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          <span className="font-body text-[10px] uppercase tracking-[0.3em] text-accent-soft font-semibold">
            About
          </span>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white mt-4 leading-none max-w-3xl">
            A lodge that belongs to its place.
          </h1>
        </div>
      </section>

      {/* WHERE WE ARE */}
      <section className="py-16 sm:py-24 bg-base-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <span className="font-body text-[10px] uppercase tracking-[0.28em] text-accent-ink font-semibold">
              Where we are
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-base-dark mt-4 mb-6 leading-tight">
              Chobe West, on the plateau.
            </h2>
            <p className="font-body text-base text-base-dark/75 leading-relaxed mb-5">
              {LODGE.location.summary} {LODGE.location.corridor}
            </p>
            <p className="font-body text-base text-base-dark/75 leading-relaxed mb-7">
              It is also a practical base for the wider region — a gateway to Maun, Savuti and
              Linyanti, and to Namibia, Zimbabwe and Zambia.
            </p>
            <ul className="space-y-2.5">
              {LODGE.location.distances.map((d) => (
                <li key={d} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-amber mt-2 shrink-0" />
                  <span className="font-body text-sm text-base-dark/75">{d}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[4/5] rounded-glass overflow-hidden">
            <Image
              src="/images/floodplain-from-pool.jpg"
              alt="The Chobe River floodplain stretching to the horizon, seen over the lodge pool"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* CONTEXT STATS */}
      <section className="py-16 sm:py-20 bg-base-cream/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {LODGE.context.map((item) => (
              <StatPlate key={item.label} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* LOCAL SUPPORT */}
      <section className="py-16 sm:py-24 bg-base-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="font-body text-[10px] uppercase tracking-[0.28em] text-accent-ink font-semibold">
              Local by design
            </span>
            <h2 className="font-display text-3xl sm:text-5xl text-base-dark mt-4 leading-[1.05]">
              All {LODGE.staff} of us are from the Chobe Enclave.
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <GlassPanel className="p-7 sm:p-9">
              <h3 className="font-body text-[11px] uppercase tracking-[0.2em] font-semibold text-accent-ink mb-6">
                What we source locally
              </h3>
              <ul className="space-y-3.5">
                {LODGE.localSupport.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-amber mt-2 shrink-0" />
                    <span className="font-body text-sm text-base-dark/80 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </GlassPanel>

            <GlassPanel className="p-7 sm:p-9">
              <h3 className="font-body text-[11px] uppercase tracking-[0.2em] font-semibold text-accent-ink mb-6">
                What we put back
              </h3>
              <ul className="space-y-3.5">
                {LODGE.socialResponsibility.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-amber mt-2 shrink-0" />
                    <span className="font-body text-sm text-base-dark/80 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="font-body text-sm text-base-dark/65 leading-relaxed mt-7 pt-6 border-t border-base-dark/[0.08]">
                A bio-sewage system produces grey water used solely for irrigating the garden, and
                replanting favours indigenous trees.
              </p>
            </GlassPanel>
          </div>
        </div>
      </section>

      {/* WHY XHABE */}
      <section className="py-16 sm:py-24 bg-base-cream/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl sm:text-4xl text-base-dark mb-10">
            Why guests choose Xhabe.
          </h2>
          <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
            {LODGE.whyXhabe.map((reason) => (
              <li key={reason} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-amber mt-2.5 shrink-0" />
                <span className="font-body text-base text-base-dark/75 leading-relaxed">
                  {reason}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <Image
          src="/images/lodge-night-pool.jpg"
          alt="Xhabe Safari Lodge at dusk, the main building glowing warm behind the lit pool"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-5">Come and see.</h2>
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
