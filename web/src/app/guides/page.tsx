import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { GUIDES, GUIDES_LAST_REVIEWED } from "@/lib/data/guides";
import { breadcrumbSchema, guidesListSchema } from "@/lib/seo/structuredData";

export const metadata: Metadata = {
  title: "Guides | Xhabe Safari Lodge, Chobe, Botswana",
  description:
    "Practical guides to staying at Xhabe Safari Lodge in Chobe, Botswana: getting there, what the rate includes, the chalets, wildlife and arrival.",
};

export default function GuidesIndexPage() {
  return (
    <>
      <JsonLd
        schema={[
          guidesListSchema(GUIDES),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
          ]),
        ]}
      />

      <NavBar />

      <main className="bg-base-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <header className="max-w-2xl">
            <h1 className="font-display text-4xl sm:text-5xl text-base-dark leading-tight">
              Guides to staying with us
            </h1>
            <p className="font-body text-base text-base-dark/70 leading-relaxed mt-5">
              Everything here is drawn from what the lodge itself publishes. We have left out
              the things we cannot vouch for, so you will not find guesses about park fees or
              border requirements below. Ask us and we will find out properly.
            </p>
            <p className="font-body text-xs text-base-dark/45 mt-4">
              Last reviewed {GUIDES_LAST_REVIEWED}
            </p>
          </header>

          <div className="grid sm:grid-cols-2 gap-5 mt-14">
            {GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group block rounded-glass overflow-hidden bg-white/60 border border-base-dark/8 hover:border-base-dark/20 transition-all duration-300 ease-spring"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={guide.image}
                    alt={guide.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6">
                  <h2 className="font-display text-xl text-base-dark leading-snug">
                    {guide.title}
                  </h2>
                  <p className="font-body text-sm text-base-dark/70 leading-relaxed mt-3">
                    {guide.summary}
                  </p>
                  <span className="inline-flex items-center gap-2 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-amber mt-5">
                    Read this guide
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
