import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { GlassPanel } from "@/components/Glass";
import { FAQS } from "@/lib/data/faqs";
import { QUICK_FACTS, LAST_REVIEWED } from "@/lib/data/quickFacts";
import { breadcrumbSchema, faqPageSchema } from "@/lib/seo/structuredData";

export const metadata: Metadata = {
  title: "FAQ | Xhabe Safari Lodge, Chobe, Botswana",
  description:
    "Answers about Xhabe Safari Lodge in Chobe, Botswana: where it is, what the nine chalets cost, what the rate includes, activities, transfers, and how to book.",
};

/*
 * Answers are rendered expanded, not inside an accordion.
 *
 * An accordion would look tidier and is legitimate for FAQ markup, since the
 * text still ships in the HTML. It is avoided anyway because the job of this
 * page is to be quoted: the fastest way to have an answer lifted verbatim into
 * a search result or an assistant's reply is to put it in the page as plain,
 * unhidden prose. Tidiness is not worth trading for that.
 *
 * Every answer here also appears in this page's FAQPage structured data, and
 * both come from lib/data/faqs.ts so the two cannot disagree.
 */
export default function FaqPage() {
  return (
    <>
      <JsonLd
        schema={[
          faqPageSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Frequently asked questions", path: "/faq" },
          ]),
        ]}
      />

      <NavBar />

      <main className="bg-base-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <header>
            <h1 className="font-display text-4xl sm:text-5xl text-base-dark leading-tight">
              Questions guests ask us
            </h1>
            <p className="font-body text-base text-base-dark/70 leading-relaxed mt-5">
              Everything below is what the lodge itself publishes. If your question is not
              answered here, write to us and we will answer it properly rather than guess.
            </p>
            <p className="font-body text-xs text-base-dark/45 mt-4">
              Last reviewed {LAST_REVIEWED}
            </p>
          </header>

          {/*
            * The quotable summary.
            *
            * Placed first and kept to short, self-contained rows on purpose.
            * A table of plain facts is the single most liftable unit on a
            * page: it survives being read out of context, which is exactly
            * what happens when an assistant answers "how many rooms does
            * Xhabe have" without a human ever seeing this page.
            */}
          <GlassPanel as="section" className="p-6 sm:p-8 mt-12">
            <h2 className="font-display text-2xl text-base-dark">
              Xhabe Safari Lodge at a glance
            </h2>
            <dl className="mt-6 divide-y divide-base-dark/10">
              {QUICK_FACTS.map((fact) => (
                <div
                  key={fact.label}
                  className="py-3 grid grid-cols-1 sm:grid-cols-[11rem_1fr] gap-x-6 gap-y-1"
                >
                  <dt className="font-body text-xs uppercase tracking-[0.12em] text-base-dark/50 pt-0.5">
                    {fact.label}
                  </dt>
                  <dd className="font-body text-sm text-base-dark/85 leading-relaxed">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </GlassPanel>

          <section className="mt-16">
            {FAQS.map((faq) => (
              <article key={faq.question} className="mt-10 first:mt-0">
                {/* Question-shaped headings, because that is the shape of the query. */}
                <h2 className="font-display text-xl sm:text-2xl text-base-dark leading-snug">
                  {faq.question}
                </h2>
                <p className="font-body text-base text-base-dark/75 leading-loose mt-3">
                  {faq.answer}
                </p>
              </article>
            ))}
          </section>

          <GlassPanel className="p-8 mt-16 text-center">
            <h2 className="font-display text-2xl text-base-dark">
              Still deciding?
            </h2>
            <p className="font-body text-sm text-base-dark/70 leading-relaxed mt-3 max-w-md mx-auto">
              Check which dates are open and send us a request. Nothing is charged until
              the lodge confirms your booking.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-7">
              <Link
                href="/book"
                className="group inline-flex items-center gap-2 rounded-full bg-accent-amber text-white font-body text-xs font-semibold uppercase tracking-[0.14em] px-7 py-3.5 hover:brightness-95 active:scale-[0.98] transition-all duration-300 ease-spring"
              >
                Check availability
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-base-dark/15 text-base-dark font-body text-xs font-semibold uppercase tracking-[0.14em] px-7 py-3.5 hover:bg-base-dark hover:text-white active:scale-[0.98] transition-all duration-300 ease-spring"
              >
                Ask us a question
              </Link>
            </div>
          </GlassPanel>
        </div>
      </main>

      <Footer />
    </>
  );
}
