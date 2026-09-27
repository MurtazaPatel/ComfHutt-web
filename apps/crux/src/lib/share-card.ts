/**
 * Server-side reader for a shared CRUX card.
 *
 * Kept separate from `@/lib/api`, which is a `"use client"` module built around
 * Clerk tokens. A shared card is deliberately the one thing in CRUX that needs no
 * account at all — `GET /crux/card/share/:token` is public on the backend — so it
 * is fetched on the server, where it can be rendered into the HTML a recipient
 * (and a link unfurler) receives on first byte.
 *
 * Shapes mirror `CruxCardSnapshot` / `CruxCardRow` in the backend's
 * `src/modules/crux/card/card.service.ts`. Everything the engine may legitimately
 * omit is typed as nullable, because a card is generated even when the report
 * agent fails — `generateCard` catches that and ships the card without a summary.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export interface ShareCardSnapshot {
  address: string;
  city: string | null;
  state: string | null;
  property_type: string | null;
  score_composite: number | null;
  score_breakdown: Record<string, unknown> | null;
  confidence_score: number | null;
  intent_profile: string | null;
  data_sources_used: string[] | null;
  crux_version: string | null;
  scored_at: string | null;
  /** Null whenever the report agent failed when the card was minted. */
  summary: string | null;
  risk_flags: string[] | null;
  positive_signals: string[] | null;
  /** Required on screen — the backend attaches it to every card. */
  sebi_disclaimer: string | null;
  generated_at: string | null;
  deep_link: string | null;
}

export interface ShareCard {
  card_id: string;
  share_token: string;
  card_data: ShareCardSnapshot;
  view_count: number | null;
  created_at: string | null;
  expires_at: string | null;
}

export type ShareCardResult =
  | { status: "ok"; card: ShareCard }
  | { status: "expired"; card: ShareCard }
  | { status: "not_found" }
  /** The backend was unreachable — distinct from a token that does not exist. */
  | { status: "unavailable" };

/**
 * Fetch a shared card by its token.
 *
 * Expiry is checked here on purpose. The backend's `getCardByToken` looks the token
 * up and bumps a view count but never compares `expires_at`, so an expired card
 * still returns 200 with stale numbers. A ninety-day-old grade presented as current
 * is exactly the kind of claim this product cannot afford, so a card past its
 * expiry is reported as expired and the page says so instead of rendering it as
 * live.
 */
export async function fetchShareCard(shareToken: string): Promise<ShareCardResult> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/crux/card/share/${encodeURIComponent(shareToken)}`, {
      // A card is an immutable snapshot, so it is cacheable — but not forever, or an
      // expired card would keep being served from the edge as though it were live.
      next: { revalidate: 300 },
      headers: { Accept: "application/json" },
    });
  } catch {
    return { status: "unavailable" };
  }

  if (res.status === 404) return { status: "not_found" };
  if (!res.ok) return { status: "unavailable" };

  let body: { success?: boolean; data?: ShareCard } | null = null;
  try {
    body = (await res.json()) as { success?: boolean; data?: ShareCard };
  } catch {
    return { status: "unavailable" };
  }

  const card = body?.data;
  if (!body?.success || !card?.card_data) return { status: "not_found" };

  const expiresAt = card.expires_at ? Date.parse(card.expires_at) : NaN;
  if (Number.isFinite(expiresAt) && expiresAt < Date.now()) {
    return { status: "expired", card };
  }

  return { status: "ok", card };
}

/** "residential_apartment" → "Residential apartment". */
export function humanisePropertyType(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const words = raw.replace(/[_-]+/g, " ").trim().toLowerCase();
  if (!words) return null;
  return words.charAt(0).toUpperCase() + words.slice(1);
}
