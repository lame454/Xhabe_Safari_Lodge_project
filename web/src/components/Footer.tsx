import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, ShieldAlert } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-dark text-white pt-16 pb-8 mt-auto border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-display text-3xl tracking-widest text-white hover:text-base-cream transition duration-300">
                XHABE
              </span>
              <span className="font-body text-[10px] uppercase tracking-[0.35em] text-white/50 block">
                Safari Lodge
              </span>
            </Link>
            <p className="font-body text-sm text-white/70 max-w-sm leading-relaxed">
              Experience the untamed beauty of Chobe National Park. Overlooking the river floodplains, our intimate luxury tented lodge offers an authentic African wilderness connection.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4 pt-2">
              <a
                href="https://facebook.com/xhabesafarilodge"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 hover:bg-accent-amber transition duration-300 rounded-full"
                aria-label="Facebook Page"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 hover:bg-accent-amber transition duration-300 rounded-full"
                aria-label="Instagram Page"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-display text-lg tracking-wider text-base-cream">Explore</h4>
            <div className="grid grid-cols-2 gap-2 text-sm font-body text-white/80">
              <Link href="/about" className="hover:text-accent-amber transition">About Us</Link>
              <Link href="/accommodation" className="hover:text-accent-amber transition">Accommodation</Link>
              <Link href="/facilities" className="hover:text-accent-amber transition">Facilities</Link>
              <Link href="/activities" className="hover:text-accent-amber transition">Activities</Link>
              <Link href="/itinerary" className="hover:text-accent-amber transition">Itinerary</Link>
              <Link href="/gallery" className="hover:text-accent-amber transition">Gallery</Link>
              <Link href="/reviews" className="hover:text-accent-amber transition">Guest Reviews</Link>
              <Link href="/faq" className="hover:text-accent-amber transition">FAQs</Link>
            </div>
          </div>

          {/* Column 3: Contact Details */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-display text-lg tracking-wider text-base-cream">Contact Us</h4>
            <ul className="space-y-3 text-sm font-body text-white/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent-amber shrink-0 mt-0.5" />
                <span>
                  Plot 1504, Muchenje, Chobe Region, Ngoma, Botswana
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent-amber shrink-0" />
                <a href="mailto:reservations@xhabesafarilodge.com" className="hover:text-accent-amber transition">
                  reservations@xhabesafarilodge.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent-amber shrink-0" />
                <a href="tel:+26775497183" className="hover:text-accent-amber transition">
                  +267 75 497 183
                </a>
              </li>
              <li className="text-[11px] text-white/50 pt-1">
                Post: P.O. Box 90, Kasane, Botswana
              </li>
            </ul>
          </div>
        </div>

        {/* Lower copyright bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs font-body text-white/50 gap-4">
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
