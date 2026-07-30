"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { whatsappHref } from "@/lib/config/contact";

interface Props {
  /** When set, the CTA deep-links to the booking form with this package preselected. */
  packageSlug?: string;
  label?: string;
}

/**
 * Book-now bar that slides up once the visitor has scrolled past the hero.
 *
 * Deliberately not rendered on `/book` itself — see the guard in the pages
 * that mount it. It sits above the footer on mobile where the primary CTA has
 * long since scrolled away.
 */
export default function StickyBookCta({ packageSlug, label = "Book Your Stay" }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Appear after roughly one viewport of scrolling, so it never competes
    // with the hero's own call to action.
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.9);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bookHref = packageSlug ? `/book?package=${packageSlug}` : "/book";

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-500 ease-out ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      // Hidden from assistive tech and keyboard order while off-screen, so it
      // never becomes an invisible focus trap at the end of the page.
      aria-hidden={!visible}
    >
      <div className="glass-effect border-t border-base-dark/10 shadow-[0_-4px_24px_rgba(30,37,28,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <p className="hidden sm:block font-body text-xs text-base-dark/70 leading-snug">
            <span className="font-semibold text-base-dark">Only 8 chalets.</span> Check live
            availability for your dates.
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={whatsappHref("Hello Xhabe Safari Lodge, I'd like to check availability for a stay.")}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={visible ? undefined : -1}
              aria-label="Ask about availability on WhatsApp"
              className="inline-flex items-center justify-center gap-2 font-body text-xs font-semibold uppercase tracking-wider border border-[#25D366] text-[#128C4A] px-4 py-3 hover:bg-[#25D366] hover:text-white active:bg-[#25D366] active:text-white transition duration-300"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
            <Link
              href={bookHref}
              tabIndex={visible ? undefined : -1}
              className="group flex-1 sm:flex-none inline-flex items-center justify-center gap-2 font-body text-xs font-semibold uppercase tracking-wider bg-accent-amber text-white px-6 py-3 hover:bg-base-dark active:bg-base-dark transition duration-300"
            >
              {label}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
