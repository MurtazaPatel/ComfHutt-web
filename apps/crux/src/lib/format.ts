/**
 * Formatting helpers shared by every dashboard surface.
 *
 * These exist because the same values were being formatted three different ways
 * on three different screens — most visibly dates, which rendered in US order
 * ("Sep 27, 2026") on a product that ships only in India. One locale, one place.
 */

/** CRUX serves Gujarat; dates read in the order its users write them. */
const LOCALE = "en-IN";

/** "27 Sep 2026" — the default for a card, list row or byline. */
export function formatDate(value: string | number | Date): string {
  const d = toDate(value);
  if (!d) return typeof value === "string" ? value : "";
  return d.toLocaleDateString(LOCALE, { day: "numeric", month: "short", year: "numeric" });
}

/** "27 September 2026" — for a headline where the long month reads better. */
export function formatDateLong(value: string | number | Date): string {
  const d = toDate(value);
  if (!d) return typeof value === "string" ? value : "";
  return d.toLocaleDateString(LOCALE, { day: "numeric", month: "long", year: "numeric" });
}

/**
 * "just now" / "12m ago" / "3h ago" / "5d ago", then an absolute date once
 * "ago" stops being useful. A relative label a month out tells the reader
 * nothing they can act on.
 */
export function formatRelative(value: string | number | Date): string {
  const d = toDate(value);
  if (!d) return typeof value === "string" ? value : "";

  const ms = Date.now() - d.getTime();
  if (ms < 0) return formatDate(d); // clock skew — don't claim the future
  const mins = Math.floor(ms / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(d);
}

function toDate(value: string | number | Date): Date | null {
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}
