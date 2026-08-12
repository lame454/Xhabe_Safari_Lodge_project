import Link from "next/link";
import { Mail, Phone, MessageCircle, MapPin, Facebook, Instagram } from "lucide-react";
import Logo from "./Logo";
import { CONTACT, mailtoHref, telHref, whatsappHref } from "@/lib/config/contact";
import { LISTINGS } from "@/lib/data/listings";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-dark text-white pt-16 pb-8 mt-auto border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col space-y-4">
            <Logo variant="light" />
            <p className="font-body text-sm text-white/70 max-w-sm leading-relaxed">
              Nine luxury tented chalets on a plateau above the Chobe River floodplain, five
              kilometres from Chobe National Park and the Namibian border.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4 pt-2">
              <a
                href={CONTACT.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 hover:bg-accent-amber active:bg-accent-amber transition duration-300 rounded-full"
                aria-label="Xhabe Safari Lodge on Facebook"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href={CONTACT.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 hover:bg-accent-amber active:bg-accent-amber transition duration-300 rounded-full"
                aria-label="Xhabe Safari Lodge on Instagram"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 hover:bg-[#25D366] active:bg-[#25D366] transition duration-300 rounded-full"
                aria-label="Message Xhabe Safari Lodge on WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-display text-lg tracking-wider text-base-cream">Explore</h4>
            {/* py-1.5 keeps these comfortably tappable on a phone. */}
            <div className="grid grid-cols-2 gap-x-2 text-sm font-body text-white/80">
              {[
                { href: "/about", label: "About Us" },
                { href: "/accommodation", label: "The Chalets" },
                { href: "/activities", label: "Activities" },
                { href: "/rates", label: "Rates" },
                { href: "/gallery", label: "Gallery" },
                { href: "/reviews", label: "Guest Reviews" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-1.5 hover:text-accent-amber active:text-accent-amber transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Contact Details */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-display text-lg tracking-wider text-base-cream">Contact Us</h4>
            <ul className="space-y-3 text-sm font-body text-white/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent-amber shrink-0 mt-0.5" />
                <span>{CONTACT.addressLines.join(", ")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent-amber shrink-0" />
                <a href={mailtoHref()} className="hover:text-accent-amber active:text-accent-amber transition">
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent-amber shrink-0" />
                <a href={telHref()} className="hover:text-accent-amber active:text-accent-amber transition">
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-accent-amber shrink-0" />
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-amber active:text-accent-amber transition"
                >
                  WhatsApp us
                </a>
              </li>
              <li className="text-[11px] text-white/50 pt-1">
                Post: {CONTACT.postalAddress}
              </li>
            </ul>
          </div>
        </div>

        {/* Find & book us elsewhere */}
        <div className="border-t border-white/10 pt-8">
          <p className="font-body text-[10px] uppercase tracking-[0.25em] text-white/40 mb-3">
            Find &amp; Book Us On
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-body text-white/70">
            {LISTINGS.map((listing) => (
              <a
                key={listing.url}
                href={listing.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-amber active:text-accent-amber transition"
              >
                {listing.name}
              </a>
            ))}
          </div>
        </div>

        {/* Lower copyright bar */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs font-body text-white/50 gap-4">
          <p>
            &copy; {currentYear} Xhabe Safari Lodge. All Rights Reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-accent-amber transition">Privacy Policy</Link>
            <Link href="/booking-terms" className="hover:text-accent-amber transition">Booking Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
