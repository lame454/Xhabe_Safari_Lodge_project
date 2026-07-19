import Image from "next/image";
import { Compass, Calendar, MapPin, Eye, Star } from "lucide-react";
import MapEmbed from "./MapEmbed";
import Button from "./Button";
import IconList from "./IconList";

// ==================== 1. ALTERNATING IMAGE/TEXT SECTION ====================
interface AlternatingSectionProps {
  title: string;
  subtitle?: string;
  description: string;
  imagePath: string;
  imageAlt: string;
  imageLeft?: boolean;
  ctaText?: string;
  ctaHref?: string;
}

export function AlternatingSection({
  title,
  subtitle,
  description,
  imagePath,
  imageAlt,
  imageLeft = false,
  ctaText,
  ctaHref,
}: AlternatingSectionProps) {
  return (
    <section className="py-20 bg-base-light/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${imageLeft ? "" : "lg:flex-row-reverse"}`}>
          {/* Image Column */}
          <div className="w-full lg:w-1/2 relative h-[380px] md:h-[480px] overflow-hidden border border-base-dark/5 shadow-sm group">
            <Image
              src={imagePath}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-103"
            />
          </div>

          {/* Text Column */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            {subtitle && (
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent-amber font-semibold font-body mb-3 block">
                {subtitle}
              </span>
            )}
            <h2 className="font-display text-3xl md:text-4xl text-base-dark mb-6 leading-tight">
              {title}
            </h2>
            <p className="font-body text-sm md:text-base text-base-dark/75 mb-8 leading-relaxed">
              {description}
            </p>
            {ctaText && ctaHref && (
              <div>
                <Button href={ctaHref} variant="primary">
                  {ctaText}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== 2. ICON-ROW AMENITY GRID ====================
interface AmenityItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AmenityGridSectionProps {
  title: string;
  subtitle?: string;
  amenities: AmenityItem[];
}

export function AmenityGridSection({
  title,
  subtitle,
  amenities,
}: AmenityGridSectionProps) {
  return (
    <section className="py-24 bg-white border-y border-base-dark/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {subtitle && (
          <span className="text-[10px] uppercase tracking-[0.25em] text-accent-amber font-semibold font-body mb-3 block">
            {subtitle}
          </span>
        )}
        <h2 className="font-display text-3xl md:text-4xl text-base-dark mb-16 max-w-2xl mx-auto leading-tight">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {amenities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center p-8 bg-base-light/10 border border-base-dark/5 hover:border-accent-amber/30 transition duration-300 group"
              >
                <div className="p-4 bg-white rounded-full border border-base-dark/5 text-accent-amber mb-6 group-hover:bg-accent-amber group-hover:text-white transition duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl text-base-dark mb-3 font-medium">
                  {item.title}
                </h3>
                <p className="font-body text-xs md:text-sm text-base-dark/70 leading-relaxed max-w-xs">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ==================== 3. FULL-BLEED QUOTE BAND ====================
interface QuoteBandSectionProps {
  quote: string;
  author: string;
  source: string;
  bgImagePath?: string;
}

export function QuoteBandSection({
  quote,
  author,
  source,
  bgImagePath,
}: QuoteBandSectionProps) {
  return (
    <section className="relative py-24 text-white overflow-hidden bg-base-dark">
      {bgImagePath && (
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src={bgImagePath}
            alt="Safari Background"
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-6 text-accent-amber">
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
        </div>
        <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl italic mb-8 leading-snug text-base-cream">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <cite className="font-body text-xs md:text-sm uppercase tracking-wider font-semibold not-italic block">
          — {author}
          <span className="text-white/60 font-normal ml-2">via {source}</span>
        </cite>
      </div>
    </section>
  );
}

// ==================== 4. MAP + LOGISTICS PANEL ====================
interface LogisticsItem {
  title: string;
  details: string[];
}

interface LogisticsPanelSectionProps {
  title: string;
  subtitle?: string;
  logistics: LogisticsItem[];
}

export function LogisticsPanelSection({
  title,
  subtitle,
  logistics,
}: LogisticsPanelSectionProps) {
  return (
    <section className="py-20 bg-base-light/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-stretch gap-12 border border-base-dark/5 bg-white shadow-sm overflow-hidden">
          {/* Map Column */}
          <div className="w-full lg:w-1/2 min-h-[350px] lg:min-h-full relative">
            <MapEmbed height="100%" />
          </div>

          {/* Logistics Content Column */}
          <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            {subtitle && (
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent-amber font-semibold font-body mb-3 block">
                {subtitle}
              </span>
            )}
            <h2 className="font-display text-3xl text-base-dark mb-8 leading-tight">
              {title}
            </h2>

            <div className="space-y-6">
              {logistics.map((item, idx) => (
                <div key={idx} className="border-l-2 border-accent-amber pl-4 py-1">
                  <h3 className="font-display text-lg text-base-dark font-medium mb-2">
                    {item.title}
                  </h3>
                  <IconList items={item.details} icon={MapPin} className="!space-y-1.5" />
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/contact" variant="primary">
                Get Driving Directions
              </Button>
              <a
                href="https://wa.me/26775497183"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center font-body text-xs font-semibold uppercase tracking-wider bg-[#25D366] text-white px-6 py-3.5 hover:bg-base-dark transition duration-300"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
