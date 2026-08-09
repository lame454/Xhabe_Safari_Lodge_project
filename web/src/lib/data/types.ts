// Row types matching supabase/migrations/20260719000000_init.sql

export interface PackageRow {
  id: string;
  name: string;
  /**
   * URL segment for the package's detail page (`/packages/<slug>`).
   * Nullable because rows created before the column existed may not have one —
   * `packageSlug()` falls back to slugifying the name.
   */
  slug: string | null;
  nights: number;
  min_pax: number | null;
  description: string | null;
  inclusions: string[] | null;
  /** Activity slugs (see lib/data/activities.ts) bundled into this package. */
  activity_slugs: string[] | null;
  sort_order: number | null;
  created_at: string;
}

export interface RateSeasonRow {
  id: string;
  season_name: string;
  start_date: string;
  end_date: string;
  rate_single: number | null;
  rate_double: number | null;
  currency: string | null;
  active: boolean | null;
  created_at: string;
}

export interface AvailabilityRow {
  id: string;
  date: string;
  rooms_available: number;
  created_at: string;
}

export interface TestimonialRow {
  id: string;
  guest_name: string;
  source: string;
  quote: string;
  rating: number | null;
  featured: boolean | null;
  created_at: string;
}

export type GalleryCategory = "rooms" | "activities" | "views" | "dining";

export interface GalleryImageRow {
  id: string;
  storage_path: string;
  alt_text: string;
  category: GalleryCategory | null;
  /**
   * Activity slugs this photo illustrates (see lib/data/activities.ts).
   * Drives the Activities → Gallery deep links: a photo tagged
   * `["river-boat-cruise"]` shows up under `/gallery?activity=river-boat-cruise`.
   * A photo can belong to several activities, or none.
   */
  activity_tags: string[] | null;
  sort_order: number | null;
  created_at: string;
}

export interface StaffRow {
  id: string;
  name: string;
  role: string | null;
  bio: string | null;
  photo_path: string | null;
  created_at: string;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface BookingRow {
  id: string;
  check_in: string;
  check_out: string;
  guests: number;
  package_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  details: string | null;
  status: BookingStatus;
  created_at: string;
}

export interface EnquiryRow {
  id: string;
  name: string;
  email: string;
  message: string;
  handled: boolean;
  created_at: string;
}
