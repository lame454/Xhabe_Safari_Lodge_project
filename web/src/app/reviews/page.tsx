import type { Metadata } from "next";
import { Star } from "lucide-react";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Button from "@/components/Button";
import { getFeaturedTestimonials } from "@/lib/data/testimonials";

export const metadata: Metadata = {
  title: "Guest Reviews | Xhabe Safari Lodge",
  description: "Read guest stories from stays at Xhabe Safari Lodge in the Chobe District, Botswana.",
};

export default async function ReviewsPage() {
  const { testimonials } = await getFeaturedTestimonials(12);

  return <><NavBar />
    <main>
      <section className="bg-base-dark text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent-amber font-semibold font-body">Guest Stories</span>
          <h1 className="font-display text-5xl md:text-6xl mt-4">The Xhabe Experience.</h1>
          <p className="font-body text-white/70 mt-6 max-w-2xl mx-auto leading-relaxed">Thoughtful hospitality, wild horizons, and the kind of memories that stay with you long after the journey home.</p>
        </div>
      </section>
      <section className="py-20 bg-base-cream-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
          {testimonials.map((review) => <article key={review.id} className="bg-white p-8 border border-base-dark/10 flex flex-col">
            <div className="flex gap-1 text-accent-amber mb-6" aria-label={`${review.rating ?? 5} out of 5 stars`}>
              {Array.from({ length: review.rating ?? 5 }, (_, index) => <Star key={index} className="w-4 h-4 fill-current" />)}
            </div>
            <blockquote className="font-display text-xl text-base-dark leading-relaxed flex-grow">“{review.quote}”</blockquote>
            <footer className="font-body text-xs uppercase tracking-wider text-base-dark/55 mt-8">{review.guest_name} · {review.source}</footer>
          </article>)}
        </div>
      </section>
      <section className="py-20 text-center bg-white"><h2 className="font-display text-3xl text-base-dark">Ready for your own story?</h2><div className="mt-8"><Button href="/book" variant="primary" showArrow>Check Availability</Button></div></section>
    </main><Footer />
  </>;
}
