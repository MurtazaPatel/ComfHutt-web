"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@clerk/nextjs";

// CGM-1.0 module verdict (spec §2). Present only when CGM_V1_ENABLED produced this row.
export interface CgmModuleScore {
  code: "L" | "D" | "T" | "F" | "C" | "X" | "P";
  score: number;
  confidence: number;
  coverage: number;
  verdict: string;
  not_assessed: boolean;
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
  legal_summary?: { cases_counted: number; cases_possible: number; coverage: number; verdict: string } | null;
  vastu_overlay?: { verdict: string; factorsAnswered: number; factorsTotal: number; notes: string[] } | null;
  price_assessed?: boolean;
  not_rated_reason?: string | null;
  provisional?: boolean;
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
