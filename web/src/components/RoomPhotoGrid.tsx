"use client";

import { useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import Lightbox, { type LightboxPhoto } from "./Lightbox";

/**
 * Chalet photo strip. Each tile opens the shared lightbox rather than being a
 * static image with a hover zoom and nowhere to go.
 */
export default function RoomPhotoGrid({ photos }: { photos: LightboxPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {photos.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`Open larger view: ${photo.alt}`}
            className="relative aspect-square overflow-hidden group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber focus-visible:ring-inset"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width:768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110 group-active:scale-105"
            />
            <span className="absolute inset-0 bg-base-dark/0 group-hover:bg-base-dark/30 group-active:bg-base-dark/30 transition-colors duration-300 flex items-center justify-center">
              <Expand className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </span>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox photos={photos} startIndex={openIndex} onClose={() => setOpenIndex(null)} />
      )}
    </>
  );
}
