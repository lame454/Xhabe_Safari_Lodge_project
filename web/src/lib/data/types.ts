// Row types matching supabase/migrations/20260719000000_init.sql

export interface PackageRow {
  id: string;
  name: string;
  nights: number;
  min_pax: number | null;
  description: string | null;
  inclusions: string[] | null;
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
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
}
