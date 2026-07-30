"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Expand } from "lucide-react";
import Lightbox from "./Lightbox";
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

interface Props {
  images: GalleryImageRow[];
  /** Activity slug from `?activity=`, when the visitor arrived from an activity card. */
  activitySlug?: string;
  /** Display name for that activity, for the filter banner. */
  activityLabel?: string;
}

export default function GalleryGrid({ images, activitySlug, activityLabel }: Props) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<"all" | GalleryCategory>("all");
  const [activityFilterOn, setActivityFilterOn] = useState(Boolean(activitySlug));
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = useMemo(() => {
    const present = new Set(images.map((img) => img.category).filter(Boolean) as GalleryCategory[]);
    return (Object.keys(CATEGORY_LABELS) as GalleryCategory[]).filter((c) => present.has(c));
  }, [images]);

  // Photos actually tagged for the incoming activity. May be empty while the
  // lodge is still tagging its gallery.
  const activityMatches = useMemo(
    () => (activitySlug ? images.filter((img) => img.activity_tags?.includes(activitySlug)) : []),
    [images, activitySlug]
  );

  const hasActivityPhotos = activityMatches.length > 0;
  const showingActivity = activityFilterOn && hasActivityPhotos;

  const filtered = useMemo(() => {
    const base = showingActivity ? activityMatches : images;
    return activeCategory === "all" ? base : base.filter((img) => img.category === activeCategory);
  }, [showingActivity, activityMatches, images, activeCategory]);

  /** Drops `?activity=` so a reload doesn't reapply a filter the visitor cleared. */
  const clearActivityFilter = useCallback(() => {
    setActivityFilterOn(false);
    router.replace("/gallery", { scroll: false });
  }, [router]);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  // A category change can shorten the list out from under an open lightbox.
  useEffect(() => {
    if (lightboxIndex !== null && lightboxIndex >= filtered.length) {
      setLightboxIndex(filtered.length > 0 ? filtered.length - 1 : null);
    }
  }, [filtered.length, lightboxIndex]);

  const lightboxPhotos = useMemo(
    () => filtered.map((photo) => ({ src: photo.storage_path, alt: photo.alt_text })),
    [filtered]
  );

  const tabClass = (selected: boolean) =>
    `font-body text-xs uppercase tracking-wider px-4 py-2 border cursor-pointer transition-colors duration-200 ${
      selected
        ? "bg-base-dark text-white border-base-dark"
        : "bg-transparent text-base-dark/60 border-base-dark/20 hover:border-base-dark/60 active:border-base-dark/60"
    }`;

  return (
    <>
      {/* Activity filter banner — explains why the view is narrowed, or why it isn't */}
      {activitySlug && activityLabel && (
        <div className="mb-8 border border-accent-amber/30 bg-accent-amber/5 px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          {showingActivity ? (
            <>
              <p className="font-body text-sm text-base-dark/80">
                Showing{" "}
                <span className="font-semibold">
                  {activityMatches.length} {activityMatches.length === 1 ? "photo" : "photos"}
                </span>{" "}
                of <span className="font-semibold">{activityLabel}</span>.
              </p>
              <button
                type="button"
                onClick={clearActivityFilter}
                className="font-body text-[11px] uppercase tracking-widest font-semibold text-accent-amber hover:text-base-dark active:text-base-dark transition-colors duration-200"
              >
                View all photos
              </button>
            </>
          ) : (
            // Arriving here with nothing tagged yet is not a dead end: say so
            // plainly and show the full gallery instead of an empty grid.
            <p className="font-body text-sm text-base-dark/80">
              Photos of <span className="font-semibold">{activityLabel}</span> haven&apos;t been
              added to the gallery yet — showing the full gallery meanwhile.
            </p>
          )}
        </div>
      )}

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-12 justify-center">
        <button type="button" onClick={() => setActiveCategory("all")} className={tabClass(activeCategory === "all")}>
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={tabClass(activeCategory === cat)}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Masonry-like grid using CSS columns */}
      {filtered.length === 0 ? (
        <p className="font-body text-sm text-base-dark/60 text-center py-16">
          No photos in this category yet.
        </p>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((photo, i) => {
            const aspect = aspectFor(i);
            return (
              <div key={photo.id} className="break-inside-avoid relative overflow-hidden group">
                <button
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`Open larger view: ${photo.alt_text}`}
                  className={`relative w-full block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber focus-visible:ring-inset ${
                    aspect === "landscape" ? "aspect-[4/3]" : aspect === "portrait" ? "aspect-[3/4]" : "aspect-square"
                  }`}
                >
                  <Image
                    src={photo.storage_path}
                    alt={photo.alt_text}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105 group-active:scale-105"
                  />
                  <span className="absolute inset-0 bg-base-dark/0 group-hover:bg-base-dark/40 group-active:bg-base-dark/40 transition-all duration-300 flex flex-col items-start justify-end p-4 gap-2">
                    <Expand className="absolute top-4 right-4 w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="text-white font-body text-xs leading-snug text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {photo.alt_text}
                    </span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox photos={lightboxPhotos} startIndex={lightboxIndex} onClose={closeLightbox} />
      )}
    </>
  );
}
