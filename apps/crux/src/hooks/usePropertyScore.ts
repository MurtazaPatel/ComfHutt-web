"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@clerk/nextjs";

/**
 * One citation behind a module verdict — the engine's `EvidenceRef`.
 *
 * Note what is NOT here: a URL. The ref is a pointer into the evidence ledger and
 * `source` is a `namespace:document` pair (`gujrera:form3`, `ecourts`,
 * `maps:distance+places`). These are source attributions, not links, and a URL
 * must never be synthesised from them — that would fabricate the one thing a
 * reader would click to check us.
 *
 * Every field is optional so a row written by an older engine, or a payload whose
 * keys get renamed, renders as less rather than as broken.
 */
export interface CgmEvidenceRef {
  /** Stable pointer into the evidence ledger. Internal; not shown. */
  ref?: string | null;
  /** `namespace:document`, e.g. "gujrera:form3". Shown, mapped to plain English. */
  source?: string | null;
  /** Layer 0 authority tier. Carried, not rendered: T1–T3 have no public meaning we can state. */
  tier?: "T1" | "T2" | "T3" | "T4" | string | null;
  /** ISO timestamp the source was read; null = unknown. */
  observed_at?: string | null;
}

/** The four contradictions the engine can record. Unknown values must still render. */
export type CgmEvidenceFlagCode =
  | "project_count_overstated"
  | "history_predates_registration"
  | "web_possession_claim_vs_record"
  | "web_allegation_absent_from_record";

/**
 * A contradiction between something published about a project and the regulator's
 * record of it. Self-published (T4) evidence never moves a score; it can only
 * disagree with the record, and the disagreement is shown, both sides, as the
 * engine wrote it. There is no severity and no summary message — `claim` and
 * `record` are already complete sentences, and the page must not paraphrase an
 * adverse statement about a named builder.
 */
export interface CgmEvidenceFlag {
  code?: CgmEvidenceFlagCode | string | null;
  /** What was published. */
  claim?: string | null;
  /** What the regulator's record holds. */
  record?: string | null;
  /** The sentence the claim was read from. */
  quote?: string | null;
  /** The page the claim was read from. A real link when non-null. */
  url?: string | null;
  observed_at?: string | null;
}

/**
 * The legal module's counting, which is the most defensible thing CRUX does.
 *
 * `cases_counted` are the cases tied to this promoter with enough confidence to
 * enter the maths. `cases_possible` carry a matching name but could not be tied to
 * him, so they were deliberately EXCLUDED. Showing only a total would be the
 * dishonest version of this number.
 */
export interface CgmLegalSummary {
  /** 0..1 searchable-history factor — why a verdict is capped rather than clean. */
  subject_exposure?: number | null;
  cases_counted?: number | null;
  cases_possible?: number | null;
  coverage?: number | null;
  verdict?: string | null;
}

// CGM-1.0 module verdict (spec §2). Present only when CGM_V1_ENABLED produced this row.
export interface CgmModuleScore {
  code: "L" | "D" | "T" | "F" | "C" | "X" | "P";
  score: number;
  confidence: number;
  coverage: number;
  verdict: string;
  not_assessed: boolean;
  /** Per-module source attributions. Optional — older rows carry none. */
  evidence_refs?: CgmEvidenceRef[] | null;
}

export interface CruxScore {
  id: string;
  property_id: string;
  intent_profile: string;
  lifecycle_stage: string;
  macro_cycle: string;
  score_composite: number | null; // null for a CGM NR outcome
  score_breakdown: Record<string, number>;
  data_sources_used: string[];
  confidence_score: number;
  crux_version: string;
  methodology_hash: string;
  degraded: boolean;
  clarifications_requested: string[];
  weight_adjustments: Array<{
    category: string;
    base_weight: number;
    adjusted_weight: number;
    delta: number;
    reason: string;
  }>;
  created_at: string;
  ttl_expires_at: string;

  // ─── CGM-1.0 fields (present only on CGM rows; gates the new grade surface) ───
  grade?: string | null;
  cohort?: { level: string; id: string; n: number } | null;
  cohort_percentile?: number | null;
  module_scores?: CgmModuleScore[] | null;
  gates_applied?: Array<{ gate_id: string; trigger_ref: string; cap: number }>;
  legal_summary?: CgmLegalSummary | null;
  vastu_overlay?: { verdict: string; factorsAnswered: number; factorsTotal: number; notes: string[] } | null;
  price_assessed?: boolean;
  not_rated_reason?: string | null;
  provisional?: boolean;
  /** Published-claim vs record contradictions. Top-level, not per-module. */
  evidence_flags?: CgmEvidenceFlag[] | null;

  // ─── Cache metadata (only on the non-streaming GET /crux/score/:id) ───────────
  // This hook reads the SSE stream endpoint, which does not set these. Typed and
  // rendered defensively so a switch to the plain GET starts telling the truth
  // about freshness instead of implying every grade was just computed.
  fromCache?: boolean;
  cachedAt?: string | null;
  shareToken?: string | null;
}



export interface AnonQuotaExceeded {
  reportCount: number;
  maxReports: number;
}

export function usePropertyScore(propertyId: string, intent?: string) {
  const [score, setScore] = useState<CruxScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const [progressMessages, setProgressMessages] = useState<string[]>([]);
  const [quotaExceeded, setQuotaExceeded] = useState<AnonQuotaExceeded | null>(null);
  const { isLoaded, getToken } = useAuth();
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchScoreStream = useCallback(async (fetchIntent?: string, forceRecompute = false) => {
    if (!propertyId) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsLoading(true);
    setError(null);
    setQuotaExceeded(null);
    setProgressMessages([]);
    setScore(null);
    setIsComputing(false);

    try {
      const token = await getToken().catch(() => null);
      const params = new URLSearchParams();
      params.set("intent", fetchIntent || intent || "balanced");
      // Deliberately NOT sent. The backend derives the lifecycle from the RERA
      // record; hardcoding "delivered" here told the engine that delivery risk
      // was moot for every property, which zeroes module D's weight — including
      // for projects still under construction.
      params.set("macro_cycle", "growth");
      const qs = params.toString();

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
      const path = forceRecompute
        ? `/crux/score/${propertyId}/stream?force=true&${qs}`
        : `/crux/score/${propertyId}/stream?${qs}`;
      const endpoint = `${apiUrl}${path}`;

      // Use standard fetch to read stream. No token for anonymous visitors —
      // the anon quota cookie (set via credentials: 'include') carries auth
      // instead of a Bearer header.
      const headers: Record<string, string> = { "Accept": "text/event-stream" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers,
        credentials: "include",
        signal: abortController.signal
      });

      if (response.status === 402) {
        const body = await response.json().catch(() => null);
        setQuotaExceeded({
          reportCount: body?.data?.reportCount ?? 3,
          maxReports: body?.data?.maxReports ?? 3,
        });
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        if (response.status === 404) {
          // No score yet — this is a valid state for a new property, not an error.
          setScore(null);
          setError(null);
          setIsLoading(false);
          return;
        }
        throw new Error("Failed to fetch score");
      }



      setIsComputing(true);
      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      if (!reader) throw new Error("No reader");

      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "");
            try {
              const event = JSON.parse(dataStr);
              if (event.type === "progress") {
                setProgressMessages(prev => {
                  if (prev.includes(event.data.message)) return prev;
                  return [...prev, event.data.message];
                });
              } else if (event.type === "done") {
                setScore(event.data);
                setIsComputing(false);
                if (typeof window !== "undefined") {
                  window.dispatchEvent(
                    new CustomEvent("crux-search-sync", { detail: { action: "refresh" } })
                  );
                }
              } else if (event.type === "error") {
                setError(event.data);
                setIsComputing(false);
              }
            } catch {
              // Ignore parse error
            }
          }
        }
      }
      setIsLoading(false);
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        return; // Ignore aborts
      }
      setError(err instanceof Error ? err.message : "Failed to load property score");
      setScore(null);
      setIsLoading(false);
      setIsComputing(false);
    }
  }, [propertyId, intent, getToken]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      // Kicking off the SSE fetch is the one thing this effect exists to do, and
      // the request has to clear the previous score before the first byte arrives
      // — otherwise the screen shows the last property's grade while loading the
      // next one. The lint rule cannot tell that apart from a cascading render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchScoreStream(intent, false);
    }
  }, [fetchScoreStream, intent, isLoaded]);

  const recompute = useCallback(async () => {
    await fetchScoreStream(intent, true);
  }, [fetchScoreStream, intent]);

  const setIntentFn = useCallback((newIntent: string) => {
    fetchScoreStream(newIntent, false);
  }, [fetchScoreStream]);

  return { score, isLoading, error, isComputing, progressMessages, quotaExceeded, recompute, setIntent: setIntentFn };
}
