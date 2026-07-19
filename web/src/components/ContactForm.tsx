"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      firstName: String(fd.get("first-name") ?? ""),
      lastName: String(fd.get("last-name") ?? ""),
      email: String(fd.get("email") ?? ""),
      packageInterest: String(fd.get("package") ?? ""),
      guests: fd.get("guests") ? Number(fd.get("guests")) : undefined,
      arrival: String(fd.get("arrival") ?? ""),
      departure: String(fd.get("departure") ?? ""),
      message: String(fd.get("message") ?? ""),
      botField: String(fd.get("bot-field") ?? ""),
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErrorMsg(body.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      router.push("/contact/success");
    } catch {
      setErrorMsg("Could not reach the server. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot for spam prevention */}
      <div className="hidden" aria-hidden="true">
        <input name="bot-field" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="first-name" className="font-body text-xs uppercase tracking-wider text-base-dark/50 font-semibold">
            First Name *
          </label>
          <input
            id="first-name"
            name="first-name"
            type="text"
            required
            className="font-body text-sm border border-base-dark/20 bg-white px-4 py-3 focus:outline-none focus:border-accent-amber transition-colors duration-200"
            placeholder="Jane"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="last-name" className="font-body text-xs uppercase tracking-wider text-base-dark/50 font-semibold">
            Last Name *
          </label>
          <input
            id="last-name"
            name="last-name"
            type="text"
            required
            className="font-body text-sm border border-base-dark/20 bg-white px-4 py-3 focus:outline-none focus:border-accent-amber transition-colors duration-200"
            placeholder="Smith"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-body text-xs uppercase tracking-wider text-base-dark/50 font-semibold">
          Email Address *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="font-body text-sm border border-base-dark/20 bg-white px-4 py-3 focus:outline-none focus:border-accent-amber transition-colors duration-200"
          placeholder="jane.smith@example.com"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="package" className="font-body text-xs uppercase tracking-wider text-base-dark/50 font-semibold">
            Package of Interest
          </label>
          <select
            id="package"
            name="package"
            className="font-body text-sm border border-base-dark/20 bg-white px-4 py-3 focus:outline-none focus:border-accent-amber transition-colors duration-200 appearance-none"
          >
            <option value="">Select a package…</option>
            <option value="package-1">Package 1 — 1 Night</option>
            <option value="package-2">Package 2 — 2 Nights</option>
            <option value="package-3">Package 3 — 3 Nights</option>
            <option value="custom">Not sure yet</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="guests" className="font-body text-xs uppercase tracking-wider text-base-dark/50 font-semibold">
            Number of Guests
          </label>
          <input
            id="guests"
            name="guests"
            type="number"
            min={1}
            max={16}
            className="font-body text-sm border border-base-dark/20 bg-white px-4 py-3 focus:outline-none focus:border-accent-amber transition-colors duration-200"
            placeholder="2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="arrival" className="font-body text-xs uppercase tracking-wider text-base-dark/50 font-semibold">
            Preferred Arrival Date
          </label>
          <input
            id="arrival"
            name="arrival"
            type="date"
            className="font-body text-sm border border-base-dark/20 bg-white px-4 py-3 focus:outline-none focus:border-accent-amber transition-colors duration-200"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="departure" className="font-body text-xs uppercase tracking-wider text-base-dark/50 font-semibold">
            Preferred Departure Date
          </label>
          <input
            id="departure"
            name="departure"
            type="date"
            className="font-body text-sm border border-base-dark/20 bg-white px-4 py-3 focus:outline-none focus:border-accent-amber transition-colors duration-200"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="font-body text-xs uppercase tracking-wider text-base-dark/50 font-semibold">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="font-body text-sm border border-base-dark/20 bg-white px-4 py-3 focus:outline-none focus:border-accent-amber transition-colors duration-200 resize-none"
          placeholder="Tell us about your group, any special requirements, dietary needs, or questions you have…"
        />
      </div>

      {errorMsg && (
        <p role="alert" className="font-body text-sm text-red-600">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        id="contact-submit"
        disabled={submitting}
        className="w-full bg-accent-amber text-base-dark font-body text-xs font-bold uppercase tracking-[0.15em] px-8 py-4 hover:bg-accent-amber/90 transition-all duration-300 hover:shadow-lg hover:shadow-accent-amber/20 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  );
}
