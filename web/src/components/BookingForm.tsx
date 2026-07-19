"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PackageRow } from "@/lib/data/types";

interface Props {
  packages: PackageRow[];
}

type Status = "idle" | "checking" | "available" | "unavailable" | "submitting" | "error";

export default function BookingForm({ packages }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleCheckAvailability(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const checkIn = String(fd.get("checkIn") ?? "");
    const checkOut = String(fd.get("checkOut") ?? "");
    const guests = String(fd.get("guests") ?? "2");

    setStatus("checking");
    setMessage(null);

    try {
      const params = new URLSearchParams({ checkIn, checkOut, guests });
      const res = await fetch(`/api/bookings?${params.toString()}`);
      const body = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(body.error ?? "Could not check availability. Please try again.");
        return;
      }

      if (body.available) {
        setStatus("available");
        setMessage(`Good news — chalets are available for those dates (${body.roomsRemaining} remaining).`);
      } else {
        setStatus("unavailable");
        setMessage(body.reason ?? "Fully booked for those dates. Try a different range or contact us directly.");
      }
    } catch {
      setStatus("error");
      setMessage("Could not reach the server. Please check your connection and try again.");
    }
  }

  async function handleSubmitBooking(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      checkIn: String(fd.get("checkIn") ?? ""),
      checkOut: String(fd.get("checkOut") ?? ""),
      guests: Number(fd.get("guests") ?? 2),
      packageId: String(fd.get("packageId") ?? "") || undefined,
      firstName: String(fd.get("firstName") ?? ""),
      lastName: String(fd.get("lastName") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      details: String(fd.get("details") ?? ""),
    };

    setStatus("submitting");
    setMessage(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(body.error ?? "Could not submit your booking. Please try again.");
        return;
      }

      router.push("/contact/success");
    } catch {
      setStatus("error");
      setMessage("Could not reach the server. Please check your connection and try again.");
    }
  }

  const canSubmit = status === "available";

  return (
    <form
      onSubmit={canSubmit ? handleSubmitBooking : handleCheckAvailability}
      className="space-y-6 bg-white border border-base-dark/10 p-8"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="checkIn" className="font-body text-xs uppercase tracking-wider text-base-dark/50 font-semibold">
            Check-in *
          </label>
          <input
            id="checkIn"
            name="checkIn"
            type="date"
            required
            onChange={() => setStatus("idle")}
            className="font-body text-sm border border-base-dark/20 bg-white px-4 py-3 focus:outline-none focus:border-accent-amber"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="checkOut" className="font-body text-xs uppercase tracking-wider text-base-dark/50 font-semibold">
            Check-out *
          </label>
          <input
            id="checkOut"
            name="checkOut"
            type="date"
            required
            onChange={() => setStatus("idle")}
            className="font-body text-sm border border-base-dark/20 bg-white px-4 py-3 focus:outline-none focus:border-accent-amber"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="guests" className="font-body text-xs uppercase tracking-wider text-base-dark/50 font-semibold">
            Guests *
          </label>
          <input
            id="guests"
            name="guests"
            type="number"
            min={1}
            max={16}
            defaultValue={2}
            required
            onChange={() => setStatus("idle")}
            className="font-body text-sm border border-base-dark/20 bg-white px-4 py-3 focus:outline-none focus:border-accent-amber"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="packageId" className="font-body text-xs uppercase tracking-wider text-base-dark/50 font-semibold">
          Package
        </label>
        <select
          id="packageId"
          name="packageId"
          className="font-body text-sm border border-base-dark/20 bg-white px-4 py-3 focus:outline-none focus:border-accent-amber appearance-none"
        >
          <option value="">Not sure yet</option>
          {packages
            .filter((pkg) => !pkg.id.startsWith("pkg-")) // only real DB UUIDs are valid FK values
            .map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} — {pkg.nights} {pkg.nights === 1 ? "Night" : "Nights"}
              </option>
            ))}
        </select>
      </div>

      {canSubmit && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="firstName" className="font-body text-xs uppercase tracking-wider text-base-dark/50 font-semibold">
                First Name *
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="font-body text-sm border border-base-dark/20 bg-white px-4 py-3 focus:outline-none focus:border-accent-amber"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="lastName" className="font-body text-xs uppercase tracking-wider text-base-dark/50 font-semibold">
                Last Name *
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="font-body text-sm border border-base-dark/20 bg-white px-4 py-3 focus:outline-none focus:border-accent-amber"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-body text-xs uppercase tracking-wider text-base-dark/50 font-semibold">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="font-body text-sm border border-base-dark/20 bg-white px-4 py-3 focus:outline-none focus:border-accent-amber"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="font-body text-xs uppercase tracking-wider text-base-dark/50 font-semibold">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="font-body text-sm border border-base-dark/20 bg-white px-4 py-3 focus:outline-none focus:border-accent-amber"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="details" className="font-body text-xs uppercase tracking-wider text-base-dark/50 font-semibold">
              Special Requests
            </label>
            <textarea
              id="details"
              name="details"
              rows={4}
              className="font-body text-sm border border-base-dark/20 bg-white px-4 py-3 focus:outline-none focus:border-accent-amber resize-none"
            />
          </div>
        </>
      )}

      {message && (
        <p
          role="status"
          className={`font-body text-sm ${
            status === "available" ? "text-green-700" : status === "unavailable" || status === "error" ? "text-red-600" : "text-base-dark/70"
          }`}
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "checking" || status === "submitting"}
        className="w-full bg-accent-amber text-base-dark font-body text-xs font-bold uppercase tracking-[0.15em] px-8 py-4 hover:bg-accent-amber/90 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "checking"
          ? "Checking…"
          : status === "submitting"
          ? "Submitting…"
          : canSubmit
          ? "Submit Booking Request"
          : "Check Availability"}
      </button>
    </form>
  );
}
