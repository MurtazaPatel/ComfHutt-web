"use client";

import { useEffect, useState, useCallback } from "react";
import { useApiFetch, ApiError } from "@/lib/api";
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

interface ScoreResponse {
  success: boolean;
  data?: CruxScore;
}

export function usePropertyScore(propertyId: string, intent?: string) {
  const apiFetch = useApiFetch();
  const [score, setScore] = useState<CruxScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded } = useAuth();

  const fetchScore = useCallback(async (fetchIntent?: string) => {
    if (!propertyId) return;
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("intent", fetchIntent || intent || "balanced");
      params.set("lifecycle", "delivered");
      params.set("macro_cycle", "growth");
      const qs = params.toString();
      const data = await apiFetch<ScoreResponse>(
        `/crux/score/${propertyId}?${qs}`
      );
      if (data.success && data.data) {
        setScore(data.data);
      } else {
        setScore(null);
        setError("Score not available");
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError("Score not yet computed for this property.");
      } else {
        setError(err instanceof Error ? err.message : "Failed to load property score");
        setScore(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, intent]);

  useEffect(() => {
    if (isLoaded) {
      fetchScore(intent);
    }
  }, [fetchScore, intent, isLoaded]);

  const recompute = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("intent", intent || "balanced");
      params.set("lifecycle", "delivered");
      params.set("macro_cycle", "growth");
      const qs = params.toString();

      const data = await apiFetch<ScoreResponse>(
        `/crux/score/${propertyId}/compute?${qs}`,
        { method: "POST" }
      );
      if (data.success && data.data) {
        setScore(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to recompute score");
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, intent]);

  const setIntentFn = useCallback((newIntent: string) => {
    fetchScore(newIntent);
  }, [fetchScore]);

  return { score, isLoading, error, recompute, setIntent: setIntentFn };
}
