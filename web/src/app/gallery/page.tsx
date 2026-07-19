import type { Metadata } from "next";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import GalleryGrid from "@/components/GalleryGrid";
import { getGalleryImages } from "@/lib/data/gallery";

export const metadata: Metadata = {
  title: "Gallery | Xhabe Safari Lodge — Photos of Chobe, Botswana",
  description:
    "Browse photos of Xhabe Safari Lodge — luxury tented chalets, Chobe River sunsets, game drives, elephant herds, bird life, and the KAZA wilderness in northern Botswana.",
};

export default async function GalleryPage() {
  const { images } = await getGalleryImages();
  const heroImage = images[0]?.storage_path ?? "/images/gallery-sunset-floodplain.jpg";

  return (
    <>
      <NavBar />

      {/* PAGE HERO */}
      <section className="relative h-[50vh] min-h-[360px] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt="Golden sunset over the Chobe River floodplains from Xhabe Safari Lodge"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 md:pb-20">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent-amber font-semibold font-body mb-3 block">
            Visual Journal
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4 leading-none tracking-wide">
            The Chobe in Frame.
          </h1>
        </div>
      </section>

      {/* GALLERY GRID */}
      <section className="py-20 bg-base-cream-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GalleryGrid images={images} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-base-dark text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl text-base-cream mb-5">
            See It for Yourself
          </h2>
          <p className="font-body text-sm text-white/65 mb-10">
            No photograph captures the smell of rain on hot earth or the distant roar of a lion at 2 a.m. Some things you have to come and feel.
          </p>
          <Button href="/book" variant="primary" showArrow>
            Book Your Stay
          </Button>
        </div>
      </section>

      <Footer />
    </>
  );
}
