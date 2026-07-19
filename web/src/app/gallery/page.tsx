import type { Metadata } from "next";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Gallery | Xhabe Safari Lodge — Photos of Chobe, Botswana",
  description:
    "Browse photos of Xhabe Safari Lodge — luxury tented chalets, Chobe River sunsets, game drives, elephant herds, bird life, and the KAZA wilderness in northern Botswana.",
};

const galleryCategories = [
  { id: "all", label: "All" },
  { id: "wildlife", label: "Wildlife" },
  { id: "lodge", label: "Lodge & Chalets" },
  { id: "activities", label: "Activities" },
  { id: "landscape", label: "Landscape" },
];

const photos = [
  {
    src: "/images/gallery-elephant-herd.jpg",
    alt: "Elephant herd crossing the Chobe River at dusk",
    category: "wildlife",
    aspect: "landscape",
  },
  {
    src: "/images/gallery-chalet-exterior.jpg",
    alt: "Exterior of a luxury tented chalet surrounded by mopane trees",
    category: "lodge",
    aspect: "portrait",
  },
  {
    src: "/images/gallery-sunset-floodplain.jpg",
    alt: "Sunset over the Chobe floodplains viewed from Xhabe Lodge plateau",
    category: "landscape",
    aspect: "landscape",
  },
  {
    src: "/images/gallery-game-drive.jpg",
    alt: "Guests on a morning game drive in an open 4x4 vehicle near Chobe National Park",
    category: "activities",
    aspect: "landscape",
  },
  {
    src: "/images/gallery-hippo.jpg",
    alt: "Hippo pod resting in the Chobe River lagoon",
    category: "wildlife",
    aspect: "square",
  },
  {
    src: "/images/gallery-boma-dinner.jpg",
    alt: "Traditional boma dinner around a fire at Xhabe Safari Lodge",
    category: "activities",
    aspect: "portrait",
  },
  {
    src: "/images/gallery-chalet-interior.jpg",
    alt: "Luxury interior of a Xhabe tented chalet with king bed and wooden floors",
    category: "lodge",
    aspect: "landscape",
  },
  {
    src: "/images/gallery-boat-cruise.jpg",
    alt: "Guests on a river cruise watching elephants drink from the Chobe bank",
    category: "activities",
    aspect: "landscape",
  },
  {
    src: "/images/gallery-leopard.jpg",
    alt: "Leopard resting in an acacia tree near Chobe National Park",
    category: "wildlife",
    aspect: "portrait",
  },
  {
    src: "/images/gallery-vic-falls.jpg",
    alt: "Victoria Falls viewed from the Zimbabwe side, spray rising into the sky",
    category: "activities",
    aspect: "square",
  },
  {
    src: "/images/gallery-deck.jpg",
    alt: "Private viewing deck of a tented chalet looking over the Chobe floodplains",
    category: "lodge",
    aspect: "landscape",
  },
  {
    src: "/images/gallery-birds.jpg",
    alt: "African fish eagle perched on a dead tree above the Chobe River",
    category: "wildlife",
    aspect: "square",
  },
];

export default function GalleryPage() {
  return (
    <>
      <NavBar />

      {/* PAGE HERO */}
      <section className="relative h-[50vh] min-h-[360px] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/gallery-sunset-floodplain.jpg"
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
          {/* Category tabs — visual only in static mode; JS filtering can be added later */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {galleryCategories.map((cat) => (
              <span
                key={cat.id}
                className={`font-body text-xs uppercase tracking-wider px-4 py-2 border cursor-pointer transition-colors duration-200 ${
                  cat.id === "all"
                    ? "bg-base-dark text-white border-base-dark"
                    : "bg-transparent text-base-dark/60 border-base-dark/20 hover:border-base-dark/60"
                }`}
              >
                {cat.label}
              </span>
            ))}
          </div>

          {/* Masonry-like grid using CSS columns */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {photos.map((photo) => (
              <div
                key={photo.src}
                className="break-inside-avoid relative overflow-hidden group"
              >
                <div
                  className={`relative w-full ${
                    photo.aspect === "landscape"
                      ? "aspect-[4/3]"
                      : photo.aspect === "portrait"
                      ? "aspect-[3/4]"
                      : "aspect-square"
                  }`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Caption overlay */}
                  <div className="absolute inset-0 bg-base-dark/0 group-hover:bg-base-dark/40 transition-all duration-300 flex items-end p-4">
                    <p className="text-white font-body text-xs leading-snug opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {photo.alt}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
