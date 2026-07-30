"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface LightboxPhoto {
  src: string;
  alt: string;
}

interface Props {
  photos: LightboxPhoto[];
  /** Index to open on. Changing it re-targets an already-open lightbox. */
  startIndex: number;
  onClose: () => void;
}

/**
 * Full-screen photo viewer shared by the Gallery and the accommodation photo
 * grid, so the keyboard handling, scroll lock, and dismiss behaviour only exist
 * in one place.
 *
 * Render conditionally — mounting it opens the viewer, unmounting closes it.
 */
export default function Lightbox({ photos, startIndex, onClose }: Props) {
  const [index, setIndex] = useState(startIndex);

  // Follow the caller if it points at a different photo while open.
  useEffect(() => setIndex(startIndex), [startIndex]);

  const step = useCallback(
    (delta: number) => {
      // Wrap around, so arrowing past either end keeps browsing.
      setIndex((current) => (current + delta + photos.length) % photos.length);
    },
    [photos.length]
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, step]);

  const photo = photos[index];
  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      className="fixed inset-0 z-[60] bg-base-dark/95 flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close larger view"
        autoFocus
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 text-white/80 hover:text-white active:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber"
      >
        <X className="w-6 h-6" />
      </button>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              step(-1);
            }}
            aria-label="Previous photo"
            className="absolute left-2 sm:left-6 p-3 text-white/70 hover:text-white active:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              step(1);
            }}
            aria-label="Next photo"
            className="absolute right-2 sm:right-6 p-3 text-white/70 hover:text-white active:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </>
      )}

      {/* Stop propagation so tapping the photo itself doesn't dismiss */}
      <figure
        className="relative w-full max-w-5xl flex flex-col items-center gap-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative w-full h-[65vh] sm:h-[70vh]">
          <Image src={photo.src} alt={photo.alt} fill sizes="100vw" className="object-contain" priority />
        </div>
        <figcaption className="text-center px-4">
          <p className="font-body text-sm text-white/85 leading-snug">{photo.alt}</p>
          {photos.length > 1 && (
            <p className="font-body text-[11px] uppercase tracking-widest text-white/40 mt-2">
              {index + 1} / {photos.length}
            </p>
          )}
        </figcaption>
      </figure>
    </div>
  );
}
