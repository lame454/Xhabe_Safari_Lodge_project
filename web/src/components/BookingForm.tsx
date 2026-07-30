"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AvailabilityCalendar from "./AvailabilityCalendar";
import { MAX_ADULTS_PER_CHALET, TOTAL_CHALETS, roomsNeeded as chaletsFor } from "@/lib/data/capacity";
import type { PackageRow } from "@/lib/data/types";

interface Props {
  packages: PackageRow[];
  /** Row id to preselect, set when the visitor arrived from a package page. */
  preselectedPackageId?: string;
}

type Status = "idle" | "checking" | "available" | "unavailable" | "submitting" | "error";

export default function BookingForm({ packages, preselectedPackageId }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  // Dates live in React state rather than in the DOM, because the calendar and
  // the guest count both need to react to them.
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);

  const roomsNeeded = chaletsFor(guests);
  const datesChosen = Boolean(checkIn && checkOut);

  /** Any change to dates or party size invalidates a previous availability result. */
  function resetCheck() {
    setStatus("idle");
    setMessage(null);
  }

  function handleRangeChange(range: { checkIn: string | null; checkOut: string | null }) {
    setCheckIn(range.checkIn);
    setCheckOut(range.checkOut);
    resetCheck();
  }

  async function handleCheckAvailability(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!checkIn || !checkOut) {
      setStatus("error");
      setMessage("Pick your check-in and check-out dates on the calendar first.");
      return;
    }

    setStatus("checking");
    setMessage(null);

    try {
      const params = new URLSearchParams({ checkIn, checkOut, guests: String(guests) });
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
      checkIn: checkIn ?? "",
      checkOut: checkOut ?? "",
      guests,
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
      {/* Party size first — it changes which nights the calendar can offer. */}
      <div className="flex flex-col gap-2 sm:max-w-[220px]">
        <label htmlFor="guests" className="font-body text-xs uppercase tracking-wider text-base-dark/50 font-semibold">
          Guests *
        </label>
        <input
          id="guests"
          name="guests"
          type="number"
          min={1}
          max={TOTAL_CHALETS * MAX_ADULTS_PER_CHALET}
          value={guests}
          required
          onChange={(event) => {
            setGuests(Number(event.target.value) || 1);
            resetCheck();
          }}
          className="font-body text-sm border border-base-dark/20 bg-white px-4 py-3 focus:outline-none focus:border-accent-amber"
        />
        <p className="font-body text-[11px] text-base-dark/45 leading-snug">
          {guests} {guests === 1 ? "guest" : "guests"} needs {roomsNeeded}{" "}
          {roomsNeeded === 1 ? "chalet" : "chalets"} ({MAX_ADULTS_PER_CHALET} adults per chalet).
        </p>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="font-body text-xs uppercase tracking-wider text-base-dark/50 font-semibold mb-2">
          Your dates *
        </legend>
        <AvailabilityCalendar
          roomsNeeded={roomsNeeded}
          checkIn={checkIn}
          checkOut={checkOut}
          onChange={handleRangeChange}
        />
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor="packageId" className="font-body text-xs uppercase tracking-wider text-base-dark/50 font-semibold">
          Package
        </label>
        <select
          id="packageId"
          name="packageId"
          defaultValue={preselectedPackageId ?? ""}
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
                autoComplete="given-name"
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
                autoComplete="family-name"
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
                autoComplete="email"
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
                autoComplete="tel"
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
        disabled={status === "checking" || status === "submitting" || !datesChosen}
        className="w-full bg-accent-amber text-base-dark font-body text-xs font-bold uppercase tracking-[0.15em] px-8 py-4 hover:bg-accent-amber/90 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "checking"
          ? "Checking…"
          : status === "submitting"
          ? "Submitting…"
          : canSubmit
          ? "Submit Booking Request"
          : datesChosen
          ? "Check Availability"
          : "Select your dates above"}
      </button>
    </form>
  );
}
