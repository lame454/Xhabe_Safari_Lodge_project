import type { Metadata } from "next";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { Award, Leaf, MapPin, Users } from "lucide-react";
import { getStaff } from "@/lib/data/staff";

export const metadata: Metadata = {
  title: "About Us | Xhabe Safari Lodge — Story, Team & Conservation",
  description:
    "Learn the story of Xhabe Safari Lodge — a Botswana family-owned tented lodge in the Chobe District that blends genuine hospitality, conservation, and community impact.",
};

const values = [
  {
    icon: Leaf,
    title: "Conservation First",
    description:
      "We operate within the KAZA Transfrontier Conservation Area and actively support anti-poaching efforts. Profits from every stay fund local conservation programmes in the Chobe corridor.",
  },
  {
    icon: Users,
    title: "Community at the Core",
    description:
      "Over 90% of our staff are hired from neighbouring villages. We source food locally, support village cultural visits, and pay fair wages that reinvest in the community's future.",
  },
  {
    icon: MapPin,
    title: "Authentically Botswana",
    description:
      "Xhabe is not a franchise or a chain. It is a small, family-owned lodge that reflects the real Botswana — its people, its cuisine, its extraordinary wildlife, its night skies.",
  },
  {
    icon: Award,
    title: "Quality Without Compromise",
    description:
      "Luxury to us means excellent guides, superb meals, personal service, and pristine chalets. We reject the shortcuts that erode trust. Every visit must exceed expectations.",
  },
];

export default async function AboutPage() {
  const { staff } = await getStaff();

  return (
    <>
      <NavBar />

      {/* PAGE HERO */}
      <section className="relative h-[55vh] min-h-[400px] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/about-lodge.jpg"
            alt="Aerial view of Xhabe Safari Lodge nestled in mopane woodland above the Chobe floodplains"
            fill
            sizes="100vw"
            priority
            className="object-cover object-top"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 md:pb-20">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent-amber font-semibold font-body mb-3 block">
            Our Story
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4 leading-none tracking-wide">
            Born from the Bush.
          </h1>
          <p className="font-body text-sm md:text-base text-white/75 max-w-xl leading-relaxed">
            A family-owned Botswana lodge where authentic African hospitality and the raw Chobe wilderness converge.
          </p>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="py-24 bg-base-cream-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent-amber font-semibold font-body mb-3 block">
                The Xhabe Story
              </span>
              <h2 className="font-display text-3xl md:text-4xl text-base-dark mb-6 leading-tight">
                A Lodge Built on Belonging
              </h2>
              <p className="font-body text-sm text-base-dark/75 leading-loose mb-5">
                Xhabe Safari Lodge was born from a simple belief: that the wild places of Botswana deserve stewardship from the people who love them most. Situated on a plateau above the Chobe River floodplains — 5 km from Chobe National Park's eastern boundary — Xhabe occupies a position that few lodges can claim.
              </p>
              <p className="font-body text-sm text-base-dark/75 leading-loose mb-5">
                The name "Xhabe" is drawn from the local Subia language, a word tied to the landscape of this extraordinary corner of northern Botswana. The lodge began as a gathering place, a home-away-from-home on the edge of the KAZA Transfrontier Conservation Area — one of Africa's largest wildlife sanctuaries.
              </p>
              <p className="font-body text-sm text-base-dark/75 leading-loose mb-8">
                Today, Xhabe runs eight luxury tented chalets, employs a passionate local team, and hosts guests from across the globe who arrive seeking something the big resort brands cannot offer: an honest, intimate, and genuinely Botswana experience.
              </p>
              <Button href="/book" variant="primary" showArrow>
                Plan Your Visit
              </Button>
            </div>

            {/* Values grid */}
            <div className="grid grid-cols-1 gap-6">
              {values.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-5 bg-white p-6 border border-base-dark/5">
                  <div className="w-10 h-10 flex items-center justify-center bg-accent-amber/10 flex-shrink-0">
                    <Icon className="w-5 h-5 text-accent-amber" />
                  </div>
                  <div>
                    <h3 className="font-display text-base text-base-dark mb-2">{title}</h3>
                    <p className="font-body text-sm text-base-dark/70 leading-loose">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE BAND */}
      <section className="py-20 bg-base-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="font-display text-2xl md:text-3xl text-white leading-relaxed mb-6">
            "The best sunsets in all of Africa are right here. We watched elephants cross the floodplain from our deck while the sun turned the river to fire. We'll be back."
          </blockquote>
          <cite className="font-body text-xs text-white/50 uppercase tracking-wider not-italic">
            — Verified TripAdvisor Review, 2024
          </cite>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.25em] text-accent-amber font-semibold font-body mb-3 block">
              The People of Xhabe
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-base-dark mb-5">
              Your Hosts in the Wild
            </h2>
            <p className="font-body text-sm text-base-dark/65 max-w-2xl mx-auto leading-loose">
              The lodge experience is inseparable from the team. Maatla, Beauty, Lindi, and every member of the Xhabe family bring a personal investment to your stay that no automated system can replicate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {staff.map((member) => (
              <div key={member.id} className="group">
                <div className="relative h-72 overflow-hidden mb-5">
                  <Image
                    src={member.photo_path || "/images/team-placeholder.jpg"}
                    alt={`${member.name}${member.role ? `, ${member.role}` : ""} at Xhabe Safari Lodge`}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                {member.role && (
                  <span className="font-body text-[10px] uppercase tracking-wider text-accent-amber font-semibold block mb-1">
                    {member.role}
                  </span>
                )}
                <h3 className="font-display text-xl text-base-dark mb-3">{member.name}</h3>
                {member.bio && (
                  <p className="font-body text-sm text-base-dark/70 leading-loose">{member.bio}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION FACTS */}
      <section className="py-20 bg-base-cream-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-base-dark/10">
            {[
              { stat: "8", label: "Luxury Tented Chalets" },
              { stat: "5 km", label: "From Chobe National Park" },
              { stat: "520+", label: "Bird Species in District" },
              { stat: "KAZA", label: "Conservation Area" },
            ].map(({ stat, label }) => (
              <div key={label} className="bg-white px-8 py-10 text-center">
                <div className="font-display text-3xl md:text-4xl text-base-dark mb-2">{stat}</div>
                <div className="font-body text-xs uppercase tracking-wider text-base-dark/50">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
