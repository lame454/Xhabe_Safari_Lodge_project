import type { Metadata } from "next";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { Bed, Eye, Wind, Wifi, Lock, Droplets, Bath } from "lucide-react";

export const metadata: Metadata = {
  title: "Accommodation | Xhabe Safari Lodge — Luxury Tented Chalets, Chobe",
  description:
    "Eight luxury en-suite tented chalets perched above the Chobe floodplains at Xhabe Safari Lodge. Private decks, river views, super king beds, and eco-friendly amenities in the Chobe District, Botswana.",
};

const roomAmenities = [
  { icon: Bed, label: "Super king bed (2 adults max)" },
  { icon: Eye, label: "Two private viewing decks" },
  { icon: Bath, label: "En-suite bathroom with hot shower" },
  { icon: Droplets, label: "Complimentary eco-friendly toiletries" },
  { icon: Wind, label: "Ceiling fan + natural ventilation" },
  { icon: Wifi, label: "Wi-Fi in room and common areas" },
  { icon: Lock, label: "Personal in-room safe" },
  { icon: Wind, label: "Mosquito nets on all openings" },
];

const galleryImages = [
  {
    src: "/images/room-exterior.jpg",
    alt: "Exterior view of a tented chalet at Xhabe Safari Lodge surrounded by mopane woodland",
  },
  {
    src: "/images/room-interior.jpg",
    alt: "Interior of a luxury tented chalet showing king bed, wooden floors, and canvas walls",
  },
  {
    src: "/images/room-deck-view.jpg",
    alt: "Private viewing deck overlooking the Chobe River floodplains at sunset",
  },
  {
    src: "/images/room-bathroom.jpg",
    alt: "En-suite bathroom with stone details inside a Xhabe tented chalet",
  },
];

export default function AccommodationPage() {
  return (
    <>
      <NavBar />

      {/* PAGE HERO */}
      <section className="relative h-[55vh] min-h-[400px] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/room-deck-view.jpg"
            alt="Luxury tented chalet deck overlooking the Chobe floodplains"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 md:pb-20">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent-amber font-semibold font-body mb-3 block">
            Where You'll Sleep
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4 leading-none tracking-wide">
            Your Chobe Retreat
          </h1>
          <p className="font-body text-sm md:text-base text-white/75 max-w-xl leading-relaxed">
            Eight tented sanctuaries — each a private world of canvas, wood, and panoramic sky.
          </p>
        </div>
      </section>

      {/* INTRO OVERVIEW */}
      <section className="py-20 bg-base-cream-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent-amber font-semibold font-body mb-3 block">
                8 Tented Chalets
              </span>
              <h2 className="font-display text-3xl md:text-4xl text-base-dark mb-6 leading-tight">
                Luxury That Respects the Wild
              </h2>
              <p className="font-body text-sm text-base-dark/75 leading-loose mb-6">
                Xhabe's eight luxury tented chalets are designed to immerse you in the bush while surrounding you with comfort. Built on elevated wooden platforms within the mopane woodland, each chalet opens onto two private decks — one facing the Chobe River floodplains and Namibia beyond, the other looking into the lodge's lush gardens.
              </p>
              <p className="font-body text-sm text-base-dark/75 leading-loose mb-8">
                The chalets are intentionally intimate — a maximum of two adults — ensuring that every guest enjoys a genuinely private safari experience. Canvas walls breathe with the African air, wooden floors anchor you to the earth, and the sounds of the bush are your constant companion.
              </p>
              <Button href="/book" variant="primary" showArrow>
                Check Availability
              </Button>
            </div>

            {/* Room amenity checklist */}
            <div className="bg-white/60 backdrop-blur-sm border border-base-dark/10 p-8">
              <h3 className="font-display text-xl text-base-dark mb-6">
                What's Included in Every Chalet
              </h3>
              <ul className="space-y-4">
                {roomAmenities.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-4">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-accent-amber/10 flex-shrink-0">
                      <Icon className="w-4 h-4 text-accent-amber" />
                    </span>
                    <span className="font-body text-sm text-base-dark/80">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PHOTO GRID */}
      <section className="py-4 bg-base-cream-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {galleryImages.map((img) => (
              <div key={img.src} className="relative aspect-square overflow-hidden group">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width:768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POLICIES */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl text-base-dark mb-10 text-center">
            Chalet Policies & Good-to-Knows
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Occupancy",
                items: [
                  "Maximum 2 adults per chalet",
                  "Children welcome with prior arrangement",
                  "No single supplements apply",
                ],
              },
              {
                title: "Check-In / Check-Out",
                items: [
                  "Check-in from 14:00",
                  "Check-out by 11:00",
                  "Early/late check-out on request, subject to availability",
                ],
              },
              {
                title: "Meals & Beverages",
                items: [
                  "All meals served in the open-air boma or main lounge",
                  "Local beverages included in all packages",
                  "Dietary requirements accommodated with advance notice",
                ],
              },
              {
                title: "Power & Connectivity",
                items: [
                  "Mains electricity in all chalets",
                  "Wi-Fi available (speeds may vary in remote location)",
                  "USB charging ports at bedside",
                ],
              },
            ].map((policy) => (
              <div key={policy.title} className="border-l-2 border-accent-amber pl-6">
                <h3 className="font-display text-lg text-base-dark mb-3">{policy.title}</h3>
                <ul className="space-y-2">
                  {policy.items.map((item) => (
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

      {/* CTA BAND */}
      <section className="py-20 bg-base-dark text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl text-base-cream mb-5">
            Ready to Claim Your View?
          </h2>
          <p className="font-body text-sm text-white/65 mb-10">
            Eight chalets, each private. Each with its own slice of the Chobe. Book early — availability is limited.
          </p>
          <Button href="/book" variant="primary" showArrow>
            Book Your Chalet
          </Button>
        </div>
      </section>

      <Footer />
    </>
  );
}
