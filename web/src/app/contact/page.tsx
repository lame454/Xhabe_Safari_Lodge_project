import type { Metadata } from "next";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import MapEmbed from "@/components/MapEmbed";
import ContactForm from "@/components/ContactForm";
import { Mail, Phone, MessageCircle, Clock, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Xhabe Safari Lodge — Enquiries & Directions",
  description:
    "Contact Xhabe Safari Lodge for bookings, enquiries, and directions. Located near Ngoma Border Gate in the Chobe District, Botswana. WhatsApp, email, and phone available.",
};

const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: "reservations@xhabesafarilodge.com",
    href: "mailto:reservations@xhabesafarilodge.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+267 XXX XXXX",
    href: "tel:+267XXXXXXXX",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Message us on WhatsApp",
    href: "https://wa.me/267XXXXXXXX",
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "We reply within 24 hours",
    href: null,
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Ngoma Road, Mabele Village, Chobe District, Botswana",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      <NavBar />

      {/* PAGE HERO */}
      <section className="relative h-[45vh] min-h-[320px] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/about-lodge.jpg"
            alt="Aerial view of Xhabe Safari Lodge above Chobe floodplains"
            fill
            sizes="100vw"
            priority
            className="object-cover object-top"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 md:pb-20">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent-amber font-semibold font-body mb-3 block">
            Reach Us
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4 leading-none tracking-wide">
            Let's Plan Your<br />Safari.
          </h1>
        </div>
      </section>

      {/* CONTACT LAYOUT */}
      <section className="py-24 bg-base-cream-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* LEFT: Contact details + map */}
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent-amber font-semibold font-body mb-3 block">
                Get in Touch
              </span>
              <h2 className="font-display text-3xl text-base-dark mb-6">
                Find Us or Message Us
              </h2>
              <p className="font-body text-sm text-base-dark/70 leading-loose mb-10">
                For bookings, availability enquiries, special requests, or any questions about the Chobe region — get in touch via any of the channels below. Our team personally responds to every message.
              </p>

              <ul className="space-y-6 mb-12">
                {contactDetails.map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent-amber/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-accent-amber" />
                    </div>
                    <div>
                      <span className="font-body text-[10px] uppercase tracking-wider text-base-dark/40 block mb-1 font-semibold">
                        {label}
                      </span>
                      {href ? (
                        <a
                          href={href}
                          className="font-body text-sm text-base-dark hover:text-accent-amber transition-colors duration-200"
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                        >
                          {value}
                        </a>
                      ) : (
                        <span className="font-body text-sm text-base-dark">{value}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Map */}
              <div className="border border-base-dark/10 overflow-hidden">
                <MapEmbed />
              </div>
            </div>

            {/* RIGHT: Enquiry form */}
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent-amber font-semibold font-body mb-3 block">
                Enquiry Form
              </span>
              <h2 className="font-display text-3xl text-base-dark mb-6">
                Send a Message
              </h2>
              <p className="font-body text-sm text-base-dark/70 leading-loose mb-8">
                Fill in the form below and we'll respond within 24 hours with availability, rates, and a personalised itinerary.
              </p>

              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* DIRECTIONS */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl text-base-dark mb-10 text-center">
            Getting to Xhabe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "From Kasane Airport",
                steps: [
                  "International and domestic flights to Kasane Airport (BBK)",
                  "Charter flights also land at Ngoma Airstrip (5 km from lodge)",
                  "Lodge can arrange airport transfers — please request when booking",
                  "Drive time: approximately 1 hour from Kasane",
                ],
              },
              {
                title: "From Victoria Falls",
                steps: [
                  "Cross into Botswana via Kazungula Border Post (ferry)",
                  "Follow the Ngoma Road west from Kazungula (~120 km)",
                  "Turn at Mabele village and follow signs for Xhabe Safari Lodge",
                  "Drive time: approximately 2–2.5 hours",
                ],
              },
            ].map((dir) => (
              <div key={dir.title} className="border-l-2 border-accent-amber pl-6">
                <h3 className="font-display text-lg text-base-dark mb-3">{dir.title}</h3>
                <ol className="space-y-2">
                  {dir.steps.map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="font-body text-[10px] text-accent-amber font-bold mt-1 flex-shrink-0">
                        {i + 1}.
                      </span>
                      <span className="font-body text-sm text-base-dark/75">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
