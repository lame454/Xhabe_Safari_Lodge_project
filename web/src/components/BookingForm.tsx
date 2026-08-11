"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import AvailabilityCalendar from "./AvailabilityCalendar";
import { MAX_ADULTS_PER_CHALET, MAX_GUESTS, roomsNeeded as chaletsFor } from "@/lib/data/capacity";
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

  /**
   * Party size is held twice: `guests` is the committed number everything else
   * reads, `guestsText` is the raw contents of the box.
   *
   * They are separate so the box can be *empty* while it is being edited. A
   * single controlled number that coerces "" straight back to a digit can never
   * be cleared, which is what made this field so awkward on a phone: deleting
   * the "2" to type "8" snapped the box back to "1" before the 8 was typed, and
   * you ended up with "18". Nothing is committed until the field is left, so a
   * half-typed number is allowed to sit there.
   */
  const [guests, setGuests] = useState(2);
  const [guestsText, setGuestsText] = useState("2");

  const roomsNeeded = chaletsFor(guests);
  const datesChosen = Boolean(checkIn && checkOut);

  /** Any change to dates or party size invalidates a previous availability result. */
  function resetCheck() {
    setStatus("idle");
    setMessage(null);
  }

  /** Keystrokes in the box. Accepts an empty field and rejects non-digits. */
  function handleGuestsInput(raw: string) {
    if (!/^\d*$/.test(raw)) return;
    setGuestsText(raw);

    // Commit as you type only while the number is usable, so the chalet count
    // below keeps up. Anything out of range waits for the blur to clamp it.
    const parsed = Number.parseInt(raw, 10);
    if (parsed >= 1 && parsed <= MAX_GUESTS && parsed !== guests) {
      setGuests(parsed);
      resetCheck();
    }
  }

  /** Leaving the field settles it: empty restores the last good number. */
  function commitGuests() {
    const parsed = Number.parseInt(guestsText, 10);
    const next = Number.isNaN(parsed) ? guests : Math.min(MAX_GUESTS, Math.max(1, parsed));

    setGuestsText(String(next));
    if (next !== guests) {
      setGuests(next);
      resetCheck();
    }
  }

  /** The −/+ buttons, which are the easy way to adjust this on a phone. */
  function stepGuests(delta: number) {
    const next = Math.min(MAX_GUESTS, Math.max(1, guests + delta));
    if (next === guests) return;

    setGuests(next);
    setGuestsText(String(next));
    resetCheck();
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
        {/*
          A text box rather than type="number": on an invalid keystroke a number
          input reports its value as "", which is indistinguishable from the
          guest clearing the field, and its spinners are invisible on a phone
          anyway. inputMode="numeric" still brings up the numeric keypad, and
          the buttons below replace the spinners with targets a thumb can hit.
        */}
        <div className="flex items-stretch border border-base-dark/20 bg-white focus-within:border-accent-amber">
          <StepperButton
            label="One guest fewer"
            onClick={() => stepGuests(-1)}
            disabled={guests <= 1}
            icon={<Minus className="w-4 h-4" />}
          />
          <input
            id="guests"
            name="guests"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            value={guestsText}
            aria-describedby="guests-hint"
            onChange={(event) => handleGuestsInput(event.target.value)}
            onBlur={commitGuests}
            onFocus={(event) => event.target.select()}
            className="font-body text-sm text-center w-full min-w-0 bg-transparent px-2 py-3 focus:outline-none"
          />
          <StepperButton
            label="One guest more"
            onClick={() => stepGuests(1)}
            disabled={guests >= MAX_GUESTS}
            icon={<Plus className="w-4 h-4" />}
          />
        </div>
        <p id="guests-hint" className="font-body text-[11px] text-base-dark/45 leading-snug">
          {guests} {guests === 1 ? "guest" : "guests"} needs {roomsNeeded}{" "}
          {roomsNeeded === 1 ? "chalet" : "chalets"} ({MAX_ADULTS_PER_CHALET} adults per chalet).
          We sleep up to {MAX_GUESTS}.
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

/**
 * One of the −/+ controls flanking the guest count.
 *
 * `type="button"` matters: inside a form an unqualified button submits it, and
 * nudging the party size is not a submission. Sized past the 44px touch target
 * so it can be tapped without zooming in.
 */
function StepperButton({
  label,
  onClick,
  disabled,
  icon,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex items-center justify-center min-w-[44px] px-3 text-base-dark/60 hover:text-base-dark hover:bg-base-dark/5 active:bg-base-dark/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-amber"
    >
      {icon}
    </button>
  );
}
