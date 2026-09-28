import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { GlassPanel } from "@/components/Glass";
import { GUIDES, GUIDES_LAST_REVIEWED, guideBySlug } from "@/lib/data/guides";
import { breadcrumbSchema, guideArticleSchema } from "@/lib/seo/structuredData";

/*
 * Prerendered at build time, one file per guide.
 *
 * `dynamicParams = false` makes an unknown slug a 404 rather than an attempt
 * to render a guide that does not exist, which keeps the route from serving
 * soft-404 pages that a crawler would otherwise index as real content.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) return {};

  return {
    title: `${guide.title} | Xhabe Safari Lodge`,
    description: guide.description,
    openGraph: {
      title: guide.title,
      description: guide.description,
      images: [{ url: guide.image, alt: guide.imageAlt }],
      type: "article",
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) notFound();

  const others = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 2);

  return (
    <>
      <JsonLd
        schema={[
          guideArticleSchema(guide, GUIDES_LAST_REVIEWED),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: guide.title, path: `/guides/${guide.slug}` },
          ]),
        ]}
      />

      <NavBar />

      <main className="bg-base-light">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <Link
            href="/guides"
            className="group inline-flex items-center gap-2 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-base-dark/50 hover:text-accent-amber transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            All guides
          </Link>

          <h1 className="font-display text-4xl sm:text-5xl text-base-dark leading-tight mt-6">
            {guide.title}
          </h1>

          {/*
            * The summary sits directly under the h1, styled as a lede.
            *
            * It is written to answer the title without the rest of the page,
            * and this is the position a search engine is most likely to lift
            * a passage from, so the two reinforce each other.
            */}
          <p className="font-body text-lg text-base-dark/80 leading-relaxed mt-5">
            {guide.summary}
          </p>

          <p className="font-body text-xs text-base-dark/45 mt-4">
            Last reviewed {GUIDES_LAST_REVIEWED}
          </p>

          <div className="relative aspect-[16/9] rounded-glass overflow-hidden mt-10">
            <Image
              src={guide.image}
              alt={guide.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              className="object-cover"
            />
          </div>

          {guide.sections.map((section) => (
            <section key={section.heading} className="mt-12">
              <h2 className="font-display text-2xl text-base-dark leading-snug">
                {section.heading}
              </h2>
              {section.body?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="font-body text-base text-base-dark/75 leading-loose mt-4"
                >
                  {paragraph}
                </p>
              ))}
              {section.list && (
                <ul className="mt-5 space-y-2.5">
                  {section.list.map((item) => (
                    <li
                      key={item}
                      className="font-body text-base text-base-dark/75 leading-relaxed pl-5 relative"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-[0.7em] w-1.5 h-1.5 rounded-full bg-accent-amber"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <GlassPanel className="p-8 mt-16 text-center">
            <h2 className="font-display text-2xl text-base-dark">
              Ready to pick your dates?
            </h2>
            <p className="font-body text-sm text-base-dark/70 leading-relaxed mt-3 max-w-md mx-auto">
              Check what is open and send a request. The lodge confirms in writing before
              anything is charged.
            </p>
            <Link
              href="/book"
              className="group inline-flex items-center gap-2 rounded-full bg-accent-amber text-white font-body text-xs font-semibold uppercase tracking-[0.14em] px-7 py-3.5 mt-7 hover:brightness-95 active:scale-[0.98] transition-all duration-300 ease-spring"
            >
              Check availability
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </GlassPanel>

          <nav aria-label="More guides" className="mt-16">
            <h2 className="font-display text-xl text-base-dark">Keep reading</h2>
            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              {others.map((other) => (
                <Link
                  key={other.slug}
                  href={`/guides/${other.slug}`}
                  className="group block rounded-glass border border-base-dark/10 p-5 hover:border-base-dark/25 transition-all duration-300"
                >
                  <span className="font-display text-base text-base-dark leading-snug block">
                    {other.title}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-amber mt-3">
                    Read
                    <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </nav>
        </article>
      </main>

      <Footer />
    </>
  );
}
