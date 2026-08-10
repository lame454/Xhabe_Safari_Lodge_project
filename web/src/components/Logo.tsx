import Image from "next/image";
import Link from "next/link";

/**
 * The lodge's logo — a giraffe and baobab against a burnt-orange sun.
 *
 * The file is a JPEG on a white field, so it cannot sit directly on a
 * photograph without showing its corners. On dark surfaces it is placed on a
 * small light plate, which reads as an intentional badge rather than a
 * mistake, and keeps the mark's own contrast intact.
 */
export default function Logo({
  variant = "light",
  className = "",
  showTagline = true,
}: {
  /** `light` for dark backgrounds, `dark` for light ones. */
  variant?: "light" | "dark";
  className?: string;
  showTagline?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Xhabe Safari Lodge — home"
      className={`group inline-flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber focus-visible:ring-offset-2 rounded-2xl ${className}`}
    >
      <span className="relative block w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-black/5 shrink-0 transition-transform duration-500 ease-soft group-hover:scale-105">
        <Image
          src="/images/logo-xhabe.jpg"
          alt=""
          fill
          sizes="48px"
          priority
          className="object-cover scale-[1.28] object-[50%_38%]"
        />
      </span>

      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-lg sm:text-xl tracking-[0.18em] transition-colors duration-300 ${
            variant === "light"
              ? "text-white group-hover:text-accent-soft"
              : "text-base-dark group-hover:text-accent-ink"
          }`}
        >
          XHABE
        </span>
        {showTagline && (
          <span
            className={`font-body text-[9px] uppercase tracking-[0.3em] mt-1 ${
              variant === "light" ? "text-white/60" : "text-base-dark/50"
            }`}
          >
            Safari Lodge
          </span>
        )}
      </span>
    </Link>
  );
}
