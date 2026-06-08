"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";

export interface CruxScore {
  id: string;
  property_id: string;
  intent_profile: string;
  lifecycle_stage: string;
  macro_cycle: string;
  score_composite: number;
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
}



export function usePropertyScore(propertyId: string, intent?: string) {
  const [score, setScore] = useState<CruxScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const [progressMessages, setProgressMessages] = useState<string[]>([]);
  const { isLoaded, getToken } = useAuth();

  const fetchScoreStream = useCallback(async (fetchIntent?: string, forceRecompute = false) => {
    if (!propertyId) return;
    setIsLoading(true);
    setError(null);
    if (forceRecompute) {
      setProgressMessages([]);
      setScore(null);
    }
    
    try {
      const token = await getToken();
      const params = new URLSearchParams();
      params.set("intent", fetchIntent || intent || "balanced");
      params.set("lifecycle", "delivered");
      params.set("macro_cycle", "growth");
      const qs = params.toString();
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
      const path = forceRecompute 
        ? `/crux/score/${propertyId}/stream?force=true&${qs}`
        : `/crux/score/${propertyId}/stream?${qs}`;
      const endpoint = `${apiUrl}${path}`;

      // Use standard fetch to read stream
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "text/event-stream"
        }
      });

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
      setError(err instanceof Error ? err.message : "Failed to load property score");
      setScore(null);
      setIsLoading(false);
      setIsComputing(false);
    }
  }, [propertyId, intent, getToken]);

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

  return { score, isLoading, error, isComputing, progressMessages, recompute, setIntent: setIntentFn };
}
