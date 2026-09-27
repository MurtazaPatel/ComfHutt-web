"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useApiFetch } from "@/lib/api";

export interface DashboardStats {
  /** Properties this account has created a record for, scored or not. */
  propertiesCreated: number;
  /** How many of those actually carry a grade. */
  propertiesGraded: number;
  /**
   * Mean composite across GRADED properties only, or null when none are graded yet.
   *
   * Previously this averaged over every row with `cruxScore ?? 0` behind it, so each
   * unscored property pulled the mean toward zero and the dashboard reported an
   * average the engine had never computed.
   */
  avgScore: number | null;
  /** Graded C or below — the ones whose record carries something adverse. */
  flagged: number;
}

const EMPTY: DashboardStats = {
  propertiesCreated: 0,
  propertiesGraded: 0,
  avgScore: null,
  flagged: 0,
};

interface SearchesResponse {
  success: boolean;
  data?: {
    searches: Array<{
      id: string;
      propertyId: string;
      addressRaw: string;
      cruxScore: number | null;
      scoreGrade?: string;
      shareToken?: string;
      searchedAt: string;
    }>;
  };
}

export function useDashboardStats() {
  const { isSignedIn, isLoaded } = useAuth();
  const apiFetch = useApiFetch();
  const [stats, setStats] = useState<DashboardStats>(EMPTY);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  const fetchStats = useCallback(async () => {
    if (!isSignedIn) {
      setStats(EMPTY);
      setIsLoading(false);
      return;
    }

    try {
      const resp = await apiFetch<SearchesResponse>("/crux/searches/recent");
      if (resp.data?.searches) {
        const searches = resp.data.searches;
        const scores = searches
          .map((s) => s.cruxScore)
          .filter((s): s is number => typeof s === "number" && Number.isFinite(s));
        setStats({
          propertiesCreated: searches.length,
          propertiesGraded: scores.length,
          avgScore: scores.length
            ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
            : null,
          // Read the engine's own grade where it gave one; the score threshold is
          // only a fallback for legacy rows that predate letter grades.
          flagged: searches.filter((s) => {
            const g = s.scoreGrade?.trim().toUpperCase();
            if (g) return g.startsWith("C") || g.startsWith("D");
            return typeof s.cruxScore === "number" && s.cruxScore < 55;
          }).length,
        });
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard stats");
      setStats(EMPTY);
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (!isLoaded) return;
    fetchStats();
  }, [fetchStats, isLoaded]);

  return { stats, isLoading, error, refetch: fetchStats };
}
