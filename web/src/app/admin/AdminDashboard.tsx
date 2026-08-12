"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check,
  X,
  RotateCcw,
  Loader2,
  Mail,
  Phone,
  LogOut,
  ExternalLink,
  MessageSquare,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import type { AdminBooking } from "@/lib/data/adminBookings";
import type { BookingStatus, EnquiryRow } from "@/lib/data/types";
import type { EmailHealth } from "@/lib/email";
import { TOTAL_CHALETS } from "@/lib/data/capacity";
import {
  decisionPlainText,
  guestWhatsappHref,
  toWhatsappNumber,
  type Decision,
} from "@/lib/admin/guestMessage";

interface OccupancyDay {
  date: string;
  capacity: number;
  roomsRemaining: number;
}

interface Props {
  bookings: AdminBooking[];
  enquiries: EnquiryRow[];
  occupancy: OccupancyDay[];
  loadError: string | null;
  email: EmailHealth;
}

function formatDate(value: string): string {
  return new Date(value + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isPast(checkOut: string): boolean {
  return checkOut < new Date().toISOString().slice(0, 10);
}

export default function AdminDashboard({
  bookings,
  enquiries,
  occupancy,
  loadError,
  email,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [showCancelled, setShowCancelled] = useState(false);
  /** Which booking is mid-decision, and which way it is going. */
  const [composing, setComposing] = useState<{ id: string; decision: Decision } | null>(null);

  async function setStatus(
    id: string,
    status: BookingStatus,
    options: { note?: string; notifyGuest?: boolean } = {}
  ): Promise<boolean> {
    setBusyId(id);
    setError(null);
    setNotice(null);

    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...options }),
      });
      const body = await res.json();

      if (!res.ok) {
        setError(body.error ?? "Could not update the booking.");
        return false;
      }

      // "Accepted by Resend" and "landed with the guest" are not the same
      // claim, and only the second one is worth telling staff. With
      // RESEND_REDIRECT_TO set every message is delivered to one mailbox
      // instead of its addressee, so Resend accepts it and reports success —
      // reporting that as "Guest emailed" would be a lie staff act on by
      // closing the booking and moving to the next one.
      const guestReached = body.guestNotified && email.canReachGuests;

      if (options.notifyGuest) {
        if (!body.guestNotified) {
          setError(
            `Booking updated, but the guest was NOT emailed. ${
              body.guestNotifyError ?? "The email service refused the message."
            } Reach them on WhatsApp or by phone instead.`
          );
        } else if (!guestReached) {
          setError(
            `Booking updated, and the email service accepted the message — but it did not go ` +
              `to the guest. ${email.problem} Reach them on WhatsApp or by phone instead.`
          );
        } else {
          setNotice("Guest emailed.");
        }
      }

      // A decision the guest was not told about leaves the composer open, so
      // its WhatsApp button is still to hand — closing it would hide the only
      // way left to reach them.
      if (!options.notifyGuest || guestReached) setComposing(null);
      // Re-run the server component so the list and occupancy strip both
      // reflect the change without a manual reload.
      startTransition(() => router.refresh());
      return true;
    } catch {
      setError("Could not reach the server.");
      return false;
    } finally {
      setBusyId(null);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    // Hard navigation rather than router.refresh(): a soft refresh leaves the
    // already-rendered guest details sitting on screen, so signing out and
    // handing the laptop over would still show them. Replacing the document
    // discards the client tree outright.
    window.location.replace("/admin");
  }

  const awaiting = bookings.filter((b) => b.status === "pending" && !isPast(b.check_out));
  const confirmed = bookings.filter((b) => b.status === "confirmed" && !isPast(b.check_out));
  const past = bookings.filter((b) => b.status !== "cancelled" && isPast(b.check_out));
  const cancelled = bookings.filter((b) => b.status === "cancelled");

  const chaletsHeldByPending = awaiting.reduce((sum, b) => sum + b.chalets, 0);

  return (
    <main className="min-h-screen bg-base-light">
      {/* Header */}
      <header className="bg-base-dark text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <span className="font-display text-2xl tracking-widest block leading-none">XHABE</span>
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-white/50">
              Lodge Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 font-body text-[11px] uppercase tracking-wider text-white/60 hover:text-accent-amber transition-colors"
            >
              View site <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 font-body text-[11px] uppercase tracking-wider text-white/60 hover:text-accent-amber transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {(loadError || error) && (
          <p role="alert" className="border border-red-200 bg-red-50 text-red-700 font-body text-sm px-4 py-3">
            {loadError ?? error}
          </p>
        )}

        {/*
          Standing warning rather than a per-action one. Undelivered mail is
          invisible from this end — the booking saves, the status changes, and
          the only symptom is a guest who never replies — so the lodge is told
          while the queue is still empty, not one lost guest at a time.
        */}
        {!email.canReachGuests && email.problem && (
          <div className="border border-amber-300 bg-amber-50 px-4 py-3">
            <p className="flex items-start gap-2 font-body text-sm text-amber-900 leading-relaxed">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Guests are not receiving emails.</strong> {email.problem}{" "}
                Confirm bookings by WhatsApp until this is fixed — every booking is still
                saved and listed below.
              </span>
            </p>
            {email.remedy && (
              <p className="font-body text-xs text-amber-800/80 leading-relaxed mt-2 pl-6">
                <strong>To fix:</strong> {email.remedy}
              </p>
            )}
          </div>
        )}

        {notice && (
          <p role="status" className="border border-green-200 bg-green-50 text-green-800 font-body text-sm px-4 py-3">
            {notice}
          </p>
        )}

        {/* At a glance */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Awaiting decision", value: awaiting.length, accent: awaiting.length > 0 },
            { label: "Chalets held by those", value: chaletsHeldByPending, accent: false },
            { label: "Confirmed upcoming", value: confirmed.length, accent: false },
            { label: "Enquiries", value: enquiries.length, accent: false },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`border p-4 bg-white ${
                stat.accent ? "border-accent-amber" : "border-base-dark/10"
              }`}
            >
              <div className="font-display text-3xl text-base-dark leading-none mb-1">
                {stat.value}
              </div>
              <div className="font-body text-[10px] uppercase tracking-wider text-base-dark/50">
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        {/* Next 14 nights */}
        <section>
          <h2 className="font-display text-xl text-base-dark mb-1">Next 14 nights</h2>
          <p className="font-body text-xs text-base-dark/50 mb-4">
            Chalets still free each night, out of {TOTAL_CHALETS}. Pending requests are already
            counted — declining one puts its chalets back.
          </p>
          <div className="flex gap-1 overflow-x-auto pb-2">
            {occupancy.map((day) => {
              const taken = day.capacity - day.roomsRemaining;
              const full = day.roomsRemaining === 0;
              return (
                <div
                  key={day.date}
                  title={`${formatDate(day.date)} — ${day.roomsRemaining} of ${day.capacity} free`}
                  className={`flex-1 min-w-[44px] border p-2 text-center ${
                    full
                      ? "border-red-200 bg-red-50"
                      : taken > 0
                        ? "border-amber-200 bg-amber-50"
                        : "border-base-dark/10 bg-white"
                  }`}
                >
                  <div className="font-body text-[9px] uppercase tracking-wider text-base-dark/40">
                    {new Date(day.date + "T00:00:00Z").toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      timeZone: "UTC",
                    })}
                  </div>
                  <div
                    className={`font-display text-lg leading-tight ${
                      full ? "text-red-600" : "text-base-dark"
                    }`}
                  >
                    {day.roomsRemaining}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Awaiting decision */}
        <BookingSection
          title="Awaiting your decision"
          empty="Nothing waiting. New booking requests appear here."
          bookings={awaiting}
          busyId={busyId}
          pending={pending}
          onSetStatus={setStatus}
          composing={composing}
          onCompose={(id, decision) => setComposing({ id, decision })}
          onCancelCompose={() => setComposing(null)}
          actions={["confirm", "decline"]}
        />

        {/* Confirmed */}
        <BookingSection
          title="Confirmed"
          empty="No confirmed stays coming up."
          bookings={confirmed}
          busyId={busyId}
          pending={pending}
          onSetStatus={setStatus}
          composing={composing}
          onCompose={(id, decision) => setComposing({ id, decision })}
          onCancelCompose={() => setComposing(null)}
          actions={["decline"]}
        />

        {/* Past */}
        {past.length > 0 && (
          <BookingSection
            title="Past stays"
            empty=""
            bookings={past}
            busyId={busyId}
            pending={pending}
            onSetStatus={setStatus}
          composing={composing}
          onCompose={(id, decision) => setComposing({ id, decision })}
          onCancelCompose={() => setComposing(null)}
            actions={[]}
            muted
          />
        )}

        {/* Cancelled */}
        {cancelled.length > 0 && (
          <section>
            <button
              type="button"
              onClick={() => setShowCancelled((v) => !v)}
              className="font-body text-xs uppercase tracking-wider text-base-dark/50 hover:text-accent-amber transition-colors mb-4"
            >
              {showCancelled ? "Hide" : "Show"} declined &amp; cancelled ({cancelled.length})
            </button>
            {showCancelled && (
              <BookingSection
                title=""
                empty=""
                bookings={cancelled}
                busyId={busyId}
                pending={pending}
                onSetStatus={setStatus}
                composing={composing}
                onCompose={(id, decision) => setComposing({ id, decision })}
                onCancelCompose={() => setComposing(null)}
                actions={["reinstate"]}
                muted
              />
            )}
          </section>
        )}

        {/* Enquiries */}
        <section>
          <h2 className="font-display text-xl text-base-dark mb-4">Recent enquiries</h2>
          {enquiries.length === 0 ? (
            <p className="font-body text-sm text-base-dark/50">No enquiries yet.</p>
          ) : (
            <ul className="space-y-3">
              {enquiries.map((enquiry) => (
                <li key={enquiry.id} className="border border-base-dark/10 bg-white p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                    <span className="font-display text-base text-base-dark">{enquiry.name}</span>
                    <span className="font-body text-[11px] text-base-dark/40">
                      {formatDateTime(enquiry.created_at)}
                    </span>
                  </div>
                  <a
                    href={`mailto:${enquiry.email}`}
                    className="inline-flex items-center gap-1.5 font-body text-xs text-accent-amber hover:underline mb-3"
                  >
                    <Mail className="w-3.5 h-3.5" /> {enquiry.email}
                  </a>
                  <p className="font-body text-sm text-base-dark/75 whitespace-pre-wrap leading-relaxed">
                    {enquiry.message}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

// ============================================================================

type Action = "confirm" | "decline" | "reinstate";

type SetStatus = (
  id: string,
  status: BookingStatus,
  options?: { note?: string; notifyGuest?: boolean }
) => Promise<boolean>;

/**
 * The panel that opens under a booking when staff press Confirm or Decline.
 *
 * The decision and the message to the guest are taken together deliberately:
 * silently flipping a status leaves the guest waiting on an answer that was
 * already made. Staff can still choose to update without messaging when
 * they've already spoken to the guest another way.
 */
function DecisionComposer({
  booking,
  decision,
  busy,
  onCancel,
  onSetStatus,
}: {
  booking: AdminBooking;
  decision: Decision;
  busy: boolean;
  onCancel: () => void;
  onSetStatus: SetStatus;
}) {
  const [note, setNote] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const forMessage = {
    first_name: booking.first_name,
    last_name: booking.last_name,
    check_in: booking.check_in,
    check_out: booking.check_out,
    guests: booking.guests,
    phone: booking.phone,
    package_name: booking.package_name,
  };

  const whatsappHref = guestWhatsappHref(decision, forMessage, note);
  const whatsappNumber = toWhatsappNumber(booking.phone);
  const confirming = decision === "confirmed";

  /** Applies the decision, then hands off to WhatsApp with the message ready. */
  async function decideAndOpenWhatsapp() {
    if (!whatsappHref) return;
    // Open synchronously — a popup blocked because it came after an await is a
    // confusing failure, so the tab is claimed before the request goes out.
    const tab = window.open("about:blank", "_blank", "noopener,noreferrer");
    const ok = await onSetStatus(booking.id, decision, { note });
    if (ok && tab) tab.location.href = whatsappHref;
    else tab?.close();
  }

  return (
    <div className="mt-5 pt-5 border-t border-base-dark/10">
      <p className="font-body text-sm text-base-dark/80 mb-3">
        {confirming ? (
          <>
            Confirming <strong>{booking.first_name}</strong>&apos;s stay. Their chalets are
            already held, so the calendar won&apos;t change.
          </>
        ) : (
          <>
            Declining <strong>{booking.first_name}</strong>&apos;s request. This releases{" "}
            {booking.chalets} {booking.chalets === 1 ? "chalet" : "chalets"} back to the
            calendar.
          </>
        )}
      </p>

      <label
        htmlFor={`note-${booking.id}`}
        className="font-body text-xs uppercase tracking-wider text-base-dark/50 font-semibold block mb-2"
      >
        Add a line to the guest (optional)
      </label>
      <textarea
        id={`note-${booking.id}`}
        rows={3}
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder={
          confirming
            ? "e.g. We've noted your late arrival and kept dinner aside."
            : "e.g. We're fully booked that week, but the following weekend is open."
        }
        className="w-full font-body text-sm border border-base-dark/20 bg-white px-3 py-2 mb-3 focus:outline-none focus:border-accent-amber resize-none"
      />

      <button
        type="button"
        onClick={() => setShowPreview((v) => !v)}
        className="font-body text-[11px] uppercase tracking-wider text-accent-amber hover:text-base-dark transition-colors mb-3"
      >
        {showPreview ? "Hide" : "Preview"} what the guest gets
      </button>

      {showPreview && (
        <pre className="font-body text-xs text-base-dark/70 whitespace-pre-wrap bg-base-light border border-base-dark/10 p-4 mb-4 leading-relaxed">
          {decisionPlainText(decision, forMessage, note)}
        </pre>
      )}

      <div className="flex flex-wrap gap-2">
        <ActionButton
          busy={busy}
          onClick={() => onSetStatus(booking.id, decision, { note, notifyGuest: true })}
          icon={<Mail className="w-4 h-4" />}
          label={confirming ? "Confirm & email" : "Decline & email"}
          tone={confirming ? "primary" : "danger"}
        />

        {whatsappHref ? (
          <ActionButton
            busy={busy}
            onClick={decideAndOpenWhatsapp}
            icon={<MessageCircle className="w-4 h-4" />}
            label="Open WhatsApp"
            tone="whatsapp"
          />
        ) : (
          <span className="font-body text-[11px] text-base-dark/40 self-center max-w-[16rem] leading-snug">
            {booking.phone
              ? `Can't build a WhatsApp link from "${booking.phone}".`
              : "No phone number given, so WhatsApp isn't available."}
          </span>
        )}

        <ActionButton
          busy={busy}
          onClick={() => onSetStatus(booking.id, decision, { note })}
          icon={<Check className="w-4 h-4" />}
          label="Update only"
          tone="ghost"
        />

        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="font-body text-xs uppercase tracking-wider text-base-dark/50 hover:text-base-dark px-3 disabled:opacity-50"
        >
          Back
        </button>
      </div>

      {whatsappNumber && (
        <p className="font-body text-[11px] text-base-dark/40 mt-3">
          WhatsApp will open a chat with +{whatsappNumber} — check that looks right before
          sending. You still press send yourself.
        </p>
      )}
    </div>
  );
}

function BookingSection({
  title,
  empty,
  bookings,
  busyId,
  pending,
  onSetStatus,
  actions,
  muted = false,
  composing,
  onCompose,
  onCancelCompose,
}: {
  title: string;
  empty: string;
  bookings: AdminBooking[];
  busyId: string | null;
  pending: boolean;
  onSetStatus: SetStatus;
  actions: Action[];
  muted?: boolean;
  composing: { id: string; decision: Decision } | null;
  onCompose: (id: string, decision: Decision) => void;
  onCancelCompose: () => void;
}) {
  return (
    <section>
      {title && <h2 className="font-display text-xl text-base-dark mb-4">{title}</h2>}
      {bookings.length === 0 ? (
        empty ? (
          <p className="font-body text-sm text-base-dark/50">{empty}</p>
        ) : null
      ) : (
        <ul className="space-y-3">
          {bookings.map((booking) => {
            const busy = busyId === booking.id || pending;
            const isComposing = composing?.id === booking.id;
            return (
              <li
                key={booking.id}
                className={`border bg-white p-5 ${
                  muted ? "border-base-dark/10 opacity-70" : "border-base-dark/10"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                      <span className="font-display text-lg text-base-dark">
                        {booking.first_name} {booking.last_name}
                      </span>
                      <StatusPill status={booking.status} />
                    </div>

                    <p className="font-body text-sm text-base-dark/80 mb-2">
                      {formatDate(booking.check_in)} → {formatDate(booking.check_out)}
                      <span className="text-base-dark/45">
                        {" · "}
                        {booking.nights} {booking.nights === 1 ? "night" : "nights"}
                        {" · "}
                        {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
                        {" · "}
                        {booking.chalets} {booking.chalets === 1 ? "chalet" : "chalets"}
                      </span>
                    </p>

                    {booking.package_name && (
                      <p className="font-body text-xs text-accent-amber font-semibold uppercase tracking-wider mb-2">
                        {booking.package_name}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
                      <a
                        href={`mailto:${booking.email}`}
                        className="inline-flex items-center gap-1.5 font-body text-xs text-base-dark/70 hover:text-accent-amber transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" /> {booking.email}
                      </a>
                      {booking.phone && (
                        <a
                          href={`tel:${booking.phone.replace(/\s/g, "")}`}
                          className="inline-flex items-center gap-1.5 font-body text-xs text-base-dark/70 hover:text-accent-amber transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" /> {booking.phone}
                        </a>
                      )}
                    </div>

                    {booking.details && (
                      <p className="flex items-start gap-1.5 font-body text-xs text-base-dark/60 leading-relaxed max-w-prose">
                        <MessageSquare className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        <span className="whitespace-pre-wrap">{booking.details}</span>
                      </p>
                    )}

                    <p className="font-body text-[11px] text-base-dark/35 mt-2">
                      Requested {formatDateTime(booking.created_at)}
                    </p>
                  </div>

                  {actions.length > 0 && !isComposing && (
                    <div className="flex flex-wrap gap-2">
                      {actions.includes("confirm") && (
                        <ActionButton
                          busy={busy}
                          onClick={() => onCompose(booking.id, "confirmed")}
                          icon={<Check className="w-4 h-4" />}
                          label="Confirm"
                          tone="primary"
                        />
                      )}
                      {actions.includes("decline") && (
                        <ActionButton
                          busy={busy}
                          onClick={() => onCompose(booking.id, "cancelled")}
                          icon={<X className="w-4 h-4" />}
                          label={booking.status === "confirmed" ? "Cancel" : "Decline"}
                          tone="danger"
                        />
                      )}
                      {actions.includes("reinstate") && (
                        // Internal bookkeeping — the guest is not told about it.
                        <ActionButton
                          busy={busy}
                          onClick={() => onSetStatus(booking.id, "pending")}
                          icon={<RotateCcw className="w-4 h-4" />}
                          label="Reinstate"
                          tone="ghost"
                        />
                      )}
                    </div>
                  )}
                </div>

                {isComposing && composing && (
                  <DecisionComposer
                    booking={booking}
                    decision={composing.decision}
                    busy={busy}
                    onCancel={onCancelCompose}
                    onSetStatus={onSetStatus}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function StatusPill({ status }: { status: BookingStatus }) {
  const styles: Record<BookingStatus, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    confirmed: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-base-dark/5 text-base-dark/50 border-base-dark/10",
  };
  return (
    <span
      className={`font-body text-[10px] uppercase tracking-wider font-semibold border px-2 py-0.5 ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function ActionButton({
  busy,
  onClick,
  icon,
  label,
  tone,
}: {
  busy: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  tone: "primary" | "danger" | "ghost" | "whatsapp";
}) {
  const tones = {
    primary: "bg-accent-amber text-white hover:bg-base-dark active:bg-base-dark",
    danger:
      "border border-red-200 text-red-700 hover:bg-red-600 hover:text-white hover:border-red-600 active:bg-red-600 active:text-white",
    ghost:
      "border border-base-dark/20 text-base-dark/70 hover:bg-base-dark hover:text-white active:bg-base-dark active:text-white",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#128C4A] active:bg-[#128C4A]",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={`inline-flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-wider px-4 py-2.5 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber focus-visible:ring-offset-2 ${tones[tone]}`}
    >
      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {label}
    </button>
  );
}
