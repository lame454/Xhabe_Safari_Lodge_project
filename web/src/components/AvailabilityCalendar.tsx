"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { TOTAL_CHALETS } from "@/lib/data/capacity";

interface DayAvailability {
  date: string;
  capacity: number;
  roomsRemaining: number;
}

interface Props {
  /** Chalets the current party needs — a night with fewer free reads as full. */
  roomsNeeded: number;
  checkIn: string | null;
  checkOut: string | null;
  onChange: (range: { checkIn: string | null; checkOut: string | null }) => void;
}

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

/** `YYYY-MM-DD` for a Date, read in UTC to avoid timezone drift. */
function toKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function todayKey(): string {
  return toKey(new Date());
}

/** First of the month, as a UTC date. */
function monthStart(year: number, month: number): Date {
  return new Date(Date.UTC(year, month, 1));
}

function addDaysKey(key: string, days: number): string {
  const d = new Date(key + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return toKey(d);
}

function nightsBetween(from: string, to: string): number {
  return Math.round(
    (new Date(to + "T00:00:00Z").getTime() - new Date(from + "T00:00:00Z").getTime()) / 86_400_000
  );
}

function formatLong(key: string): string {
  return new Date(key + "T00:00:00Z").toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Two-month availability calendar with check-in/check-out range selection.
 *
 * Availability is fetched per visible window from `/api/availability`. A night
 * is treated as unavailable when fewer chalets remain than the party needs, so
 * the same calendar shows different availability for 2 guests and for 10.
 */
export default function AvailabilityCalendar({ roomsNeeded, checkIn, checkOut, onChange }: Props) {
  const today = todayKey();

  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return { year: now.getUTCFullYear(), month: now.getUTCMonth() };
  });
  const [availability, setAvailability] = useState<Map<string, DayAvailability>>(new Map());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // The two months on screen, plus the month either side so the range preview
  // and a quick month flick don't flash unknown days.
  const windowStart = useMemo(() => toKey(monthStart(cursor.year, cursor.month - 1)), [cursor]);
  const windowEnd = useMemo(
    () => addDaysKey(toKey(monthStart(cursor.year, cursor.month + 3)), -1),
    [cursor]
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    fetch(`/api/availability?from=${windowStart}&to=${windowEnd}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "Could not load availability.");
        return body as { days: DayAvailability[] };
      })
      .then((body) => {
        if (cancelled) return;
        setAvailability(new Map(body.days.map((d) => [d.date, d])));
      })
      .catch((err: Error) => {
        if (cancelled) return;
        // The form still lets guests submit a request; the calendar just can't
        // colour nights until this recovers.
        setLoadError(err.message || "Could not load availability.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [windowStart, windowEnd]);

  /** Whether this night can host the party. Unknown nights are treated as open. */
  const nightIsOpen = useCallback(
    (key: string) => {
      const day = availability.get(key);
      if (!day) return true;
      return day.roomsRemaining >= roomsNeeded;
    },
    [availability, roomsNeeded]
  );

  /** True when every night from `from` up to (not including) `to` is open. */
  const rangeIsOpen = useCallback(
    (from: string, to: string) => {
      for (let night = from; night < to; night = addDaysKey(night, 1)) {
        if (!nightIsOpen(night)) return false;
      }
      return true;
    },
    [nightIsOpen]
  );

  function handleSelect(key: string) {
    // Starting fresh, or restarting because a complete range already exists.
    if (!checkIn || (checkIn && checkOut)) {
      onChange({ checkIn: key, checkOut: null });
      return;
    }

    // Clicking the check-in again, or an earlier date, restarts the range.
    if (key <= checkIn) {
      onChange({ checkIn: key, checkOut: null });
      return;
    }

    // A stay can't straddle a night that's already full.
    if (!rangeIsOpen(checkIn, key)) {
      onChange({ checkIn: key, checkOut: null });
      return;
    }

    onChange({ checkIn, checkOut: key });
  }

  /** Arrow-key navigation, so the grid is one tab stop rather than 60+. */
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const offsets: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    const offset = offsets[event.key];
    if (offset === undefined) return;

    const focused = document.activeElement as HTMLElement | null;
    const key = focused?.dataset.date;
    if (!key) return;

    event.preventDefault();
    const target = addDaysKey(key, offset);
    const next = gridRef.current?.querySelector<HTMLElement>(`[data-date="${target}"]`);

    if (next) {
      next.focus();
    } else {
      // Walked off the rendered months — page the calendar and let the effect
      // re-render before focusing.
      setCursor((c) =>
        offset < 0
          ? { year: c.month === 0 ? c.year - 1 : c.year, month: c.month === 0 ? 11 : c.month - 1 }
          : { year: c.month === 11 ? c.year + 1 : c.year, month: c.month === 11 ? 0 : c.month + 1 }
      );
    }
  }

  const months = [
    monthStart(cursor.year, cursor.month),
    monthStart(cursor.year, cursor.month + 1),
  ];

  // Don't let visitors page back before the current month.
  const atEarliestMonth =
    cursor.year === new Date().getUTCFullYear() && cursor.month <= new Date().getUTCMonth();

  // Preview the range being dragged out before the second click lands.
  const previewEnd = checkIn && !checkOut && hovered && hovered > checkIn ? hovered : null;
  const rangeEnd = checkOut ?? previewEnd;

  return (
    <div className="border border-base-dark/15 bg-white">
      {/* Month navigation */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-base-dark/10">
        <button
          type="button"
          onClick={() =>
            setCursor((c) => ({
              year: c.month === 0 ? c.year - 1 : c.year,
              month: c.month === 0 ? 11 : c.month - 1,
            }))
          }
          disabled={atEarliestMonth}
          aria-label="Previous month"
          className="p-2 text-base-dark/60 hover:text-accent-amber active:text-accent-amber disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span aria-live="polite" className="font-body text-xs uppercase tracking-widest text-base-dark/60 flex items-center gap-2">
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {loading ? "Loading availability" : "Select your dates"}
        </span>

        <button
          type="button"
          onClick={() =>
            setCursor((c) => ({
              year: c.month === 11 ? c.year + 1 : c.year,
              month: c.month === 11 ? 0 : c.month + 1,
            }))
          }
          aria-label="Next month"
          className="p-2 text-base-dark/60 hover:text-accent-amber active:text-accent-amber transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {loadError && (
        <p role="status" className="px-4 py-3 font-body text-xs text-red-700 bg-red-50 border-b border-red-100">
          {loadError} You can still send a request below and we&apos;ll confirm availability by hand.
        </p>
      )}

      {/* Month grids */}
      <div
        ref={gridRef}
        onKeyDown={handleKeyDown}
        onMouseLeave={() => setHovered(null)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4"
      >
        {months.map((month) => {
          const year = month.getUTCFullYear();
          const monthIndex = month.getUTCMonth();
          const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
          // JS weeks start Sunday; the grid starts Monday.
          const leadingBlanks = (month.getUTCDay() + 6) % 7;

          return (
            <div key={`${year}-${monthIndex}`}>
              <h3 className="font-display text-base text-base-dark text-center mb-3">
                {month.toLocaleDateString("en-GB", {
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </h3>

              <div className="grid grid-cols-7 gap-1 mb-1" aria-hidden="true">
                {WEEKDAYS.map((day) => (
                  <span
                    key={day}
                    className="text-center font-body text-[10px] uppercase tracking-wider text-base-dark/35 py-1"
                  >
                    {day}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: leadingBlanks }, (_, i) => (
                  <span key={`blank-${i}`} />
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => {
                  const key = toKey(new Date(Date.UTC(year, monthIndex, i + 1)));
                  const day = availability.get(key);
                  const isPast = key < today;
                  const open = nightIsOpen(key);

                  const isCheckIn = key === checkIn;
                  const isCheckOut = key === checkOut;
                  // Check-out day is an arrival slot for someone else, so it's
                  // shown as an endpoint but isn't itself a night stayed.
                  const inRange = Boolean(
                    checkIn && rangeEnd && key > checkIn && key < rangeEnd
                  );

                  // While picking a check-out, block dates that would span a
                  // full night.
                  const blockedAsCheckOut = Boolean(
                    checkIn && !checkOut && key > checkIn && !rangeIsOpen(checkIn, key)
                  );

                  const selectable =
                    !isPast && !blockedAsCheckOut && (open || Boolean(checkIn && !checkOut && key > checkIn));

                  // Scarcity is measured against the whole lodge, not against
                  // that night's released capacity — a night where the lodge
                  // only opened 3 of its 8 chalets is genuinely limited, even
                  // though all 3 are still free.
                  const isPartial =
                    day !== undefined && day.roomsRemaining > 0 && day.roomsRemaining < TOTAL_CHALETS;

                  let stateLabel: string;
                  if (isPast) stateLabel = "past date";
                  else if (!open) stateLabel = "fully booked";
                  else if (isPartial)
                    stateLabel = `${day.roomsRemaining} of ${TOTAL_CHALETS} chalets left`;
                  else stateLabel = "available";

                  let tone: string;
                  if (isCheckIn || isCheckOut) {
                    tone = "bg-accent-amber text-white font-semibold";
                  } else if (inRange) {
                    tone = "bg-accent-amber/20 text-base-dark";
                  } else if (isPast) {
                    tone = "text-base-dark/25 line-through";
                  } else if (!open) {
                    tone = "text-base-dark/30 line-through bg-base-dark/[0.04]";
                  } else if (isPartial) {
                    tone = "text-base-dark bg-amber-50 hover:bg-accent-amber/30 active:bg-accent-amber/30";
                  } else {
                    tone = "text-base-dark hover:bg-accent-amber/25 active:bg-accent-amber/25";
                  }

                  return (
                    <button
                      key={key}
                      type="button"
                      data-date={key}
                      disabled={!selectable}
                      // Roving tab stop: one entry point, arrow keys move within.
                      tabIndex={key === (checkIn ?? today) ? 0 : -1}
                      onClick={() => handleSelect(key)}
                      onMouseEnter={() => setHovered(key)}
                      onFocus={() => setHovered(key)}
                      aria-label={`${formatLong(key)} — ${stateLabel}`}
                      aria-pressed={isCheckIn || isCheckOut}
                      className={`relative aspect-square flex flex-col items-center justify-center font-body text-xs transition-colors duration-150 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber focus-visible:ring-inset ${tone}`}
                    >
                      {i + 1}
                      {isPartial && !isCheckIn && !isCheckOut && !inRange && (
                        <span className="absolute bottom-1 text-[8px] leading-none text-accent-amber font-semibold">
                          {day.roomsRemaining}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend + selection summary */}
      <div className="border-t border-base-dark/10 px-4 py-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 font-body text-[10px] uppercase tracking-wider text-base-dark/50">
          <li className="flex items-center gap-1.5">
            <span className="w-3 h-3 border border-base-dark/20 bg-white" /> Available
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-3 h-3 border border-amber-200 bg-amber-50" /> Limited
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-3 h-3 border border-base-dark/10 bg-base-dark/[0.06]" /> Fully booked
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-accent-amber" /> Your stay
          </li>
        </ul>

        <div className="font-body text-xs text-base-dark/80">
          {checkIn && checkOut ? (
            <span>
              <span className="font-semibold">{nightsBetween(checkIn, checkOut)}</span>{" "}
              {nightsBetween(checkIn, checkOut) === 1 ? "night" : "nights"} ·{" "}
              {formatLong(checkIn)} → {formatLong(checkOut)}
              <button
                type="button"
                onClick={() => onChange({ checkIn: null, checkOut: null })}
                className="ml-3 text-accent-amber hover:underline active:underline uppercase tracking-wider text-[10px] font-semibold"
              >
                Clear
              </button>
            </span>
          ) : checkIn ? (
            <span className="text-base-dark/60">
              Check-in {formatLong(checkIn)} — now pick your check-out date.
            </span>
          ) : (
            <span className="text-base-dark/50">Pick a check-in date to start.</span>
          )}
        </div>
      </div>
    </div>
  );
}
