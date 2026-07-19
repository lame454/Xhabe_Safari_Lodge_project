"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { GalleryCategory, GalleryImageRow } from "@/lib/data/types";

const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  rooms: "Rooms & Chalets",
  activities: "Activities",
  views: "Views & Wildlife",
  dining: "Dining",
};

// Deterministic aspect ratio so the masonry layout stays varied without
// depending on data that isn't in the gallery_images schema.
function aspectFor(index: number): "landscape" | "portrait" | "square" {
  const pattern: Array<"landscape" | "portrait" | "square"> = ["landscape", "portrait", "landscape", "square"];
  return pattern[index % pattern.length];
}

export default function GalleryGrid({ images }: { images: GalleryImageRow[] }) {
  const [activeCategory, setActiveCategory] = useState<"all" | GalleryCategory>("all");

  const categories = useMemo(() => {
    const present = new Set(images.map((img) => img.category).filter(Boolean) as GalleryCategory[]);
    return (Object.keys(CATEGORY_LABELS) as GalleryCategory[]).filter((c) => present.has(c));
  }, [images]);

  const filtered = activeCategory === "all" ? images : images.filter((img) => img.category === activeCategory);

  return (
    <>
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-12 justify-center">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`font-body text-xs uppercase tracking-wider px-4 py-2 border cursor-pointer transition-colors duration-200 ${
            activeCategory === "all"
              ? "bg-base-dark text-white border-base-dark"
              : "bg-transparent text-base-dark/60 border-base-dark/20 hover:border-base-dark/60"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`font-body text-xs uppercase tracking-wider px-4 py-2 border cursor-pointer transition-colors duration-200 ${
              activeCategory === cat
                ? "bg-base-dark text-white border-base-dark"
                : "bg-transparent text-base-dark/60 border-base-dark/20 hover:border-base-dark/60"
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Masonry-like grid using CSS columns */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {filtered.map((photo, i) => {
          const aspect = aspectFor(i);
          return (
            <div key={photo.id} className="break-inside-avoid relative overflow-hidden group">
              <div
                className={`relative w-full ${
                  aspect === "landscape" ? "aspect-[4/3]" : aspect === "portrait" ? "aspect-[3/4]" : "aspect-square"
                }`}
              >
                <Image
                  src={photo.storage_path}
                  alt={photo.alt_text}
                  fill
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-base-dark/0 group-hover:bg-base-dark/40 transition-all duration-300 flex items-end p-4">
                  <p className="text-white font-body text-xs leading-snug opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {photo.alt_text}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
