"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useApiFetch } from "@/lib/api";

export interface DashboardStats {
  propertiesAnalyzed: number;
  avgScore: number;
  riskAlerts: number;
  reportsGenerated: number;
}

interface SearchesResponse {
  success: boolean;
  data?: {
    searches: Array<{
      id: string;
      propertyId: string;
      addressRaw: string;
      cruxScore: number;
      scoreGrade?: string;
      shareToken?: string;
      searchedAt: string;
    }>;
  };
}

export function useDashboardStats() {
  const { isSignedIn, isLoaded } = useAuth();
  const apiFetch = useApiFetch();
  const [stats, setStats] = useState<DashboardStats>({
    propertiesAnalyzed: 0,
    avgScore: 0,
    riskAlerts: 0,
    reportsGenerated: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  const fetchStats = useCallback(async () => {
    if (!isSignedIn) {
      setStats({
        propertiesAnalyzed: 0,
        avgScore: 0,
        riskAlerts: 0,
        reportsGenerated: 0,
      });
      setIsLoading(false);
      return;
    }

    try {
      const resp = await apiFetch<SearchesResponse>("/crux/searches/recent");
      if (resp.data?.searches) {
        const searches = resp.data.searches;
        const scores = searches
          .map((s) => s.cruxScore)
          .filter((s): s is number => typeof s === "number");
        setStats({
          propertiesAnalyzed: searches.length,
          avgScore: scores.length > 0
            ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
            : 0,
          riskAlerts: searches.filter(s => typeof s.cruxScore === "number" && s.cruxScore < 55).length,
          reportsGenerated: searches.length,
        });
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard stats");
      setStats({
        propertiesAnalyzed: 0,
        avgScore: 0,
        riskAlerts: 0,
        reportsGenerated: 0,
      });
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
