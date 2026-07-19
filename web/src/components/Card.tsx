import Image from "next/image";
import Link from "next/link";
import { Star, ArrowUpRight, Compass, Users } from "lucide-react";
import Button from "./Button";

// ==================== ROOM CARD ====================
interface RoomCardProps {
  name: string;
  description: string;
  imagePath: string;
  features: string[];
  maxPax?: number;
  rateSingle?: number;
  rateDouble?: number;
  currency?: string;
}

export function RoomCard({
  name,
  description,
  imagePath,
  features,
  maxPax = 2,
  rateSingle,
  rateDouble,
  currency = "USD",
}: RoomCardProps) {
  return (
    <div className="group bg-white border border-base-dark/5 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-300">
      {/* Image container */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={imagePath}
          alt={`Xhabe Safari Lodge ${name}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-base-dark/85 backdrop-blur-sm text-white px-3 py-1 text-[10px] uppercase tracking-wider font-semibold">
          Luxury Chalet
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display text-2xl text-base-dark">{name}</h3>
          <div className="flex items-center gap-1 text-xs text-base-dark/60 font-body">
            <Users className="w-4 h-4 text-accent-amber" />
            <span>Max {maxPax}</span>
          </div>
        </div>

        <p className="font-body text-sm text-base-dark/70 mb-4 line-clamp-3 leading-relaxed">
          {description}
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
          {features.slice(0, 3).map((feat, i) => (
            <span
              key={i}
              className="text-[10px] font-body uppercase bg-base-light/30 border border-base-dark/5 px-2 py-0.5 text-base-dark/85"
            >
              {feat}
            </span>
          ))}
          {features.length > 3 && (
            <span className="text-[10px] font-body text-base-dark/50 px-1 py-0.5">
              +{features.length - 3} more
            </span>
          )}
        </div>

        {/* Rate Display */}
        <div className="border-t border-base-dark/5 pt-4 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-base-dark/50 block font-body">
              Starting from
            </span>
            <span className="text-xl font-display text-accent-amber font-semibold">
              {currency} {rateDouble || rateSingle || "450"}
            </span>
            <span className="text-[10px] font-body text-base-dark/60"> / night</span>
          </div>

          <Button href="/book" variant="secondary" className="!py-2.5 !px-4 text-[10px]">
            Check Availability
          </Button>
        </div>
      </div>
    </div>
  );
}

// ==================== ACTIVITY CARD ====================
interface ActivityCardProps {
  title: string;
  description: string;
  imagePath: string;
  actionHref?: string;
  actionText?: string;
}

export function ActivityCard({
  title,
  description,
  imagePath,
  actionHref = "/activities",
  actionText = "Explore Activity",
}: ActivityCardProps) {
  return (
    <div className="group bg-white border border-base-dark/5 overflow-hidden flex flex-col md:flex-row h-full md:h-72 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Image Block */}
      <div className="relative h-64 md:h-full md:w-1/2 overflow-hidden">
        <Image
          src={imagePath}
          alt={`Xhabe Safari Lodge ${title}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base-dark/40 to-transparent md:hidden" />
      </div>

      {/* Content Block */}
      <div className="p-8 md:w-1/2 flex flex-col justify-center">
        <span className="text-[9px] uppercase tracking-[0.2em] text-accent-amber font-semibold font-body mb-2 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5" />
          Chobe Adventure
        </span>
        <h3 className="font-display text-2xl text-base-dark mb-3">{title}</h3>
        <p className="font-body text-sm text-base-dark/70 mb-5 leading-relaxed">
          {description}
        </p>
        <div className="mt-auto">
          <Link
            href={actionHref}
            className="inline-flex items-center text-xs font-body uppercase font-bold tracking-widest text-accent-amber hover:text-base-dark transition duration-300 gap-1 group/link"
          >
            {actionText}
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ==================== REVIEW CARD ====================
interface ReviewCardProps {
  quote: string;
  guestName: string;
  source: string;
  rating?: number;
}

export function ReviewCard({
  quote,
  guestName,
  source,
  rating = 5,
}: ReviewCardProps) {
  return (
    <div className="bg-white border border-base-dark/5 p-8 flex flex-col justify-between h-full shadow-sm hover:shadow relative">
      {/* Decorative quote mark */}
      <span className="absolute top-4 right-6 text-base-cream text-6xl font-display select-none pointer-events-none">
        &ldquo;
      </span>

      {/* Star Rating */}
      <div className="flex space-x-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "fill-accent-amber text-accent-amber" : "text-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Quote Text */}
      <p className="font-body text-sm italic text-base-dark/80 mb-6 leading-relaxed flex-grow">
        &ldquo;{quote}&rdquo;
      </p>

      {/* Author & Source */}
      <div className="border-t border-base-dark/5 pt-4 flex justify-between items-center text-xs font-body">
        <div>
          <span className="font-semibold text-base-dark block">{guestName}</span>
          <span className="text-base-dark/50">Verified Guest</span>
        </div>
        <div className="bg-base-light/30 px-2 py-1 rounded text-[10px] font-semibold text-base-dark/70 border border-base-dark/5">
          {source}
        </div>
      </div>
    </div>
  );
}
