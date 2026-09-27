"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useApiFetch } from "@/lib/api";

/**
 * Loads the narrative report row for one property.
 *
 * Co-located with `ReportViewer`, its only consumer, rather than sitting in
 * `src/hooks/` — that directory is owned elsewhere in this pass. Worth moving there
 * once the dust settles; nothing about this hook is view-specific.
 *
 * Mirrors `GET /crux/report/:property_id` (`CruxReportRow` in the backend's
 * `report.service.ts`). Every field is optional on this side of the wire so a
 * renamed or partial payload degrades to rendering less, never to rendering a
 * placeholder — the report makes adverse claims about named builders, so an absent
 * field has to read as absent.
 */

export interface CruxReportCitation {
  claim?: string | null;
  source_title?: string | null;
  source_url_or_path?: string | null;
  observed_at?: string | null;
}

export interface CruxReportRow {
  property_id?: string;
  score_id?: string;
  intent_profile?: string;
  /** 2–3 plain-language sentences written by the report agent. */
  summary?: string | null;
  /** Per-category prose. Keys are the backend's; values may be missing. */
  category_narratives?: Partial<Record<
    "legal_title" | "location_quality" | "developer_reliability" | "market_valuation" | "demand_signals",
    string | null
  >> | null;
  /** Plain strings, max 5. No severity field exists — do not invent one. */
  risk_flags?: string[] | null;
  positive_signals?: string[] | null;
  research_highlights?: string[] | null;
  citations?: CruxReportCitation[] | null;
  /** Compliance text the backend appends; shown verbatim when present. */
  sebi_disclaimer?: string | null;
  crux_version?: string | null;
  generated_at?: string | null;
}

interface ReportResponse {
  success: boolean;
  data?: CruxReportRow;
}

/** The only values `/crux/report` accepts; anything else is a 400. */
export type ReportIntent = "yield" | "appreciation" | "balanced";

/** One settled result, tagged with the request it answers. */
interface Settled {
  key: string;
  report: CruxReportRow | null;
  error: string | null;
}

export function useCruxReport(propertyId: string, intent: ReportIntent = "balanced") {
  const { isLoaded, isSignedIn } = useAuth();
  const apiFetch = useApiFetch();
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<Settled | null>(null);

  // The endpoint requires auth, so calling it signed out only earns a 401.
  const canFetch = isLoaded && Boolean(isSignedIn) && Boolean(propertyId);
  const key = `${propertyId}|${intent}|${attempt}`;

  useEffect(() => {
    if (!canFetch) return;
    let cancelled = false;

    // Resolved inside the async body rather than reset synchronously here: a
    // setState in an effect body cascades a render, and the derived `isLoading`
    // below covers the pending window without one.
    (async () => {
      try {
        const resp = await apiFetch<ReportResponse>(`/crux/report/${propertyId}?intent=${intent}`);
        if (!cancelled) setSettled({ key, report: resp.data ?? null, error: null });
      } catch (err) {
        if (!cancelled) {
          setSettled({
            key,
            report: null,
            error: err instanceof Error ? err.message : "Failed to load the report",
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [canFetch, apiFetch, propertyId, intent, key]);

  const current = settled?.key === key ? settled : null;
  const refetch = useCallback(() => setAttempt((n) => n + 1), []);

  return {
    report: current?.report ?? null,
    error: current?.error ?? null,
    isLoading: canFetch && current === null,
    isSignedIn: isLoaded && Boolean(isSignedIn),
    refetch,
  };
}
