"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const LINKS = [
  { name: "The Lodge", href: "/accommodation" },
  { name: "Activities", href: "/activities" },
  { name: "Rates", href: "/rates" },
  { name: "Gallery", href: "/gallery" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

/**
 * Floating navigation.
 *
 * Over a hero photograph the bar is invisible and the links sit directly on the
 * image; once the page scrolls it condenses onto a glass plate. That keeps the
 * photography unobstructed at the top of the page, which is the whole point of
 * a photo-led design, without ever leaving the links unreadable.
 */
export default function NavBar({ overHero = false }: { overHero?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A route change should never leave the mobile sheet hanging open.
  useEffect(() => setOpen(false), [pathname]);

  // The sheet covers the page, so the page behind it must not scroll.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Transparent only while over a hero and still at the top of the page.
  const bare = overHero && !scrolled;
  const tone = bare ? "light" : "dark";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-soft ${
        bare ? "bg-transparent" : "glass-bar"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-500 ease-soft ${
            bare ? "h-24" : "h-20"
          }`}
        >
          <Logo variant={tone === "light" ? "light" : "dark"} />

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative px-4 py-2 rounded-full font-body text-sm transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber ${
                    bare
                      ? "text-white/85 hover:text-white hover:bg-white/10"
                      : "text-base-dark/75 hover:text-base-dark hover:bg-base-dark/[0.06]"
                  } ${active ? (bare ? "text-white bg-white/15" : "text-accent-ink bg-accent-amber/10") : ""}`}
                >
                  {link.name}
                </Link>
              );
            })}

            <Link
              href="/book"
              className="ml-3 inline-flex items-center rounded-full bg-accent-amber text-white font-body text-xs font-semibold uppercase tracking-[0.12em] px-6 py-3 shadow-lg shadow-accent-amber/25 hover:brightness-95 active:scale-[0.98] transition-all duration-300 ease-spring focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber focus-visible:ring-offset-2"
            >
              Book
            </Link>
          </div>

          {/* Mobile toggle — 44px target */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className={`lg:hidden -mr-2 p-3 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber ${
              bare ? "text-white hover:bg-white/10" : "text-base-dark hover:bg-base-dark/[0.06]"
            }`}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      {open && (
        <div id="mobile-nav" className="lg:hidden glass-bar border-t border-base-dark/5">
          <div className="px-4 sm:px-6 py-4 flex flex-col">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-3.5 font-body text-base border-b border-base-dark/[0.07] transition-colors ${
                  pathname === link.href ? "text-accent-ink font-semibold" : "text-base-dark/80"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/book"
              className="mt-5 mb-1 text-center rounded-full bg-accent-amber text-white font-body text-sm font-semibold uppercase tracking-[0.12em] py-4 shadow-lg shadow-accent-amber/25"
            >
              Check availability
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
