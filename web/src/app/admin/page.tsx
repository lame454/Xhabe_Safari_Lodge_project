import type { Metadata } from "next";
import { isAdminConfigured, isAuthenticated } from "@/lib/admin/auth";
import { getAdminBookings, getAdminEnquiries } from "@/lib/data/adminBookings";
import { getAvailabilityCalendar } from "@/lib/data/availability";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

export const metadata: Metadata = {
  title: "Lodge Admin | Xhabe Safari Lodge",
  // Belt and braces alongside the Disallow rule in robots.ts.
  robots: { index: false, follow: false, nocache: true },
};

// Never prerender or cache: the contents are per-session and change constantly.
export const dynamic = "force-dynamic";

function isoDate(offsetDays: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export default async function AdminPage() {
  if (!isAdminConfigured()) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-base-light px-4">
        <div className="max-w-md text-center">
          <h1 className="font-display text-2xl text-base-dark mb-3">Admin not configured</h1>
          <p className="font-body text-sm text-base-dark/70 leading-relaxed">
            Set <code className="text-accent-amber">ADMIN_PASSWORD</code> in the environment to
            enable this page. It is intentionally unreachable until you do.
          </p>
        </div>
      </main>
    );
  }

  if (!(await isAuthenticated())) {
    return <AdminLogin />;
  }

  const [{ bookings, error }, { enquiries }, { days }] = await Promise.all([
    getAdminBookings(),
    getAdminEnquiries(),
    getAvailabilityCalendar(isoDate(0), isoDate(13)),
  ]);

  return (
    <AdminDashboard
      bookings={bookings}
      enquiries={enquiries}
      occupancy={days}
      loadError={error}
    />
  );
}
