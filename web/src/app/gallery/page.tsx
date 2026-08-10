import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import GalleryGrid from "@/components/GalleryGrid";
import StickyBookCta from "@/components/StickyBookCta";
import { getGalleryImages } from "@/lib/data/gallery";
import { getActivityBySlug } from "@/lib/data/activities";

export const metadata: Metadata = {
  title: "Gallery | Xhabe Safari Lodge — Chobe, Botswana",
  description:
    "Photographs of Xhabe Safari Lodge — the tented chalets, the lounge and boma, the pool above the Chobe floodplain, and the wildlife that comes to the doorstep.",
};

interface PageProps {
  searchParams: Promise<{ activity?: string }>;
}

export default async function GalleryPage({ searchParams }: PageProps) {
  const [{ images }, { activity: activityParam }] = await Promise.all([
    getGalleryImages(),
    searchParams,
  ]);

  // Only honour a slug that actually exists, so a stale or hand-edited URL
  // falls back to the full gallery rather than showing an unknown filter.
  const activity = activityParam ? getActivityBySlug(activityParam) : undefined;

  // When filtered, lead with a photo of that activity if one is tagged.
  const activityHero = activity
    ? images.find((img) => img.activity_tags?.includes(activity.slug))
    : undefined;
  const hero = activityHero ?? images[0];

  return (
    <>
      <NavBar overHero />

      <section className="relative h-[58svh] min-h-[380px] flex items-end overflow-hidden">
        <Image
          src={hero?.storage_path ?? "/images/sunset-pool-chalets.jpg"}
          alt={
            hero?.alt_text ??
            "Sunset over the pool at Xhabe Safari Lodge with the chalets in silhouette"
          }
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <span aria-hidden="true" className="absolute inset-0 scrim-bottom" />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          <span className="font-body text-[10px] uppercase tracking-[0.3em] text-accent-soft font-semibold">
            Gallery
          </span>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white mt-4 leading-none">
            {activity ? activity.name : "The lodge, in frame."}
          </h1>
          {activity && (
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.16em] text-white/70 hover:text-accent-soft transition-colors mt-5"
            >
              View the whole gallery
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-base-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GalleryGrid
            images={images}
            activitySlug={activity?.slug}
            activityLabel={activity?.name}
          />
        </div>
      </section>

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
            Photographs only get you so far.
          </h2>
          <p className="font-body text-sm text-white/75 mb-9">
            None of these carry the smell of rain on hot earth, or a lion calling at two in the
            morning. Those you have to come for.
          </p>
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
