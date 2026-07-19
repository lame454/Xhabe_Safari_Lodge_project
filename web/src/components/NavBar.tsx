"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLodgeDropdownOpen, setIsLodgeDropdownOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path: string) => pathname === path;

  const lodgeLinks = [
    { name: "Accommodation", href: "/accommodation" },
    { name: "Activities", href: "/activities" },
  ];

  const mainLinks = [
    { name: "About", href: "/about" },
    { name: "Gallery", href: "/gallery" },
    { name: "Reviews", href: "/reviews" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-base-dark/5 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo / Brand Name */}
          <div className="flex-shrink-0">
            <Link href="/" className="group flex flex-col">
              <span className="font-display text-2xl tracking-widest text-base-dark group-hover:text-accent-amber transition duration-300">
                XHABE
              </span>
              <span className="font-body text-[9px] uppercase tracking-[0.35em] text-base-dark/60 -mt-1">
                Safari Lodge
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className={`font-body text-sm font-medium tracking-wide transition duration-300 hover:text-accent-amber ${
                isActive("/") ? "text-accent-amber font-semibold" : "text-base-dark/85"
              }`}
            >
              Home
            </Link>

            {/* Lodge Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsLodgeDropdownOpen(true)}
              onMouseLeave={() => setIsLodgeDropdownOpen(false)}
            >
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={isLodgeDropdownOpen}
                onClick={() => setIsLodgeDropdownOpen((open) => !open)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setIsLodgeDropdownOpen(false);
                }}
                className={`flex items-center font-body text-sm font-medium tracking-wide transition duration-300 hover:text-accent-amber ${
                  lodgeLinks.some((l) => isActive(l.href))
                    ? "text-accent-amber font-semibold"
                    : "text-base-dark/85"
                }`}
              >
                The Lodge
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>

              {isLodgeDropdownOpen && (
                <div role="menu" className="absolute left-0 mt-0 w-48 bg-white border border-base-dark/5 rounded shadow-lg py-2 transition duration-200">
                  {lodgeLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      onClick={() => setIsLodgeDropdownOpen(false)}
                      className={`block px-4 py-2 text-sm font-body hover:bg-base-light/30 hover:text-accent-amber transition ${
                        isActive(link.href) ? "text-accent-amber font-semibold bg-base-light/10" : "text-base-dark/80"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-body text-sm font-medium tracking-wide transition duration-300 hover:text-accent-amber ${
                  isActive(link.href) ? "text-accent-amber font-semibold" : "text-base-dark/85"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* CTA Button */}
            <Link
              href="/book"
              className="font-body text-xs font-semibold uppercase tracking-wider bg-accent-amber text-white px-5 py-3 hover:bg-base-dark transition duration-300"
            >
              Book Now
            </Link>
          </nav>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="text-base-dark hover:text-accent-amber transition duration-300"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-base-dark/5" id="mobile-menu">
          <div className="px-4 pt-2 pb-6 space-y-3">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`block py-2 border-b border-gray-100 font-body text-base ${
                isActive("/") ? "text-accent-amber font-semibold" : "text-base-dark/80"
              }`}
            >
              Home
            </Link>

            {/* Expended dropdown links inline for mobile */}
            <div className="py-2 border-b border-gray-100">
              <span className="font-body text-xs uppercase tracking-wider text-base-dark/40 font-semibold block mb-2">
                The Lodge
              </span>
              <div className="pl-4 space-y-2">
                {lodgeLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block py-1 font-body text-sm ${
                      isActive(link.href) ? "text-accent-amber font-semibold" : "text-base-dark/70"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block py-2 border-b border-gray-100 font-body text-base ${
                  isActive(link.href) ? "text-accent-amber font-semibold" : "text-base-dark/80"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4">
              <Link
                href="/book"
                onClick={() => setIsOpen(false)}
                className="block text-center font-body text-sm font-semibold uppercase tracking-wider bg-accent-amber text-white py-3 hover:bg-base-dark transition"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
