"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useApiFetch } from "@/lib/api";

export interface PropertySummary {
  id: string;
  propertyId: string;
  address: string;
  city: string;
  /**
   * Composite score, or null when this property has no score yet.
   *
   * Deliberately nullable. This used to coalesce to 0, which every consumer then
   * rendered literally — the Lens list read "Score: 0" for every row, and a card's
   * gauge sat at zero as though the engine had graded the property terribly. A
   * property created but not yet scored has no score; that is a different fact
   * from a score of zero, and the UI has to be able to tell them apart.
   */
  score: number | null;
  /** Letter grade from the engine (A+ .. D / NR), absent until scored. */
  grade?: string;
  scoredAt: string;
}

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

function parseCity(addressRaw: string): string {
  const parts = addressRaw.split(",");
  if (parts.length >= 2) {
    const city = parts[parts.length - 2].trim();
    return city;
  }
  return "";
}

/** A score is only real if the API sent a number. 0 from a missing field is not one. */
function normalizeScore(raw: unknown): number | null {
  return typeof raw === "number" && Number.isFinite(raw) ? raw : null;
}

export function useRecentProperties(limit: number = 10) {
  const { isSignedIn, isLoaded } = useAuth();
  const apiFetch = useApiFetch();
  const [properties, setProperties] = useState<PropertySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecent = useCallback(async () => {
    if (!isSignedIn) {
      setProperties([]);
      setIsLoading(false);
      return;
    }

    try {
      const resp = await apiFetch<SearchesResponse>("/crux/searches/recent");
      if (resp.data?.searches) {
        const mapped: PropertySummary[] = resp.data.searches.map((s) => ({
          id: s.propertyId,
          propertyId: s.propertyId,
          address: s.addressRaw,
          city: parseCity(s.addressRaw),
          score: normalizeScore(s.cruxScore),
          grade: s.scoreGrade,
          scoredAt: s.searchedAt,
        }));
        setProperties(mapped.slice(0, limit));
      } else {
        const stored = typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("crux_searches") || "[]")
          : [];
        setProperties(stored.slice(0, limit));
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load recent properties");
      try {
        const stored = JSON.parse(localStorage.getItem("crux_searches") || "[]");
        setProperties(stored.slice(0, limit));
      } catch {
        setProperties([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, limit]);

  useEffect(() => {
    if (!isLoaded) return;
    fetchRecent();

    const handleSync = (e: Event) => {
      const ce = e as CustomEvent;
      if (ce.detail?.action === 'refresh') {
        fetchRecent();
      } else if (ce.detail?.action === 'add') {
        const property = ce.detail.property as PropertySummary;
        setProperties((prev) => {
          const exists = prev.find((p) => p.id === property.id);
          const updated = exists
            ? prev.map((p) => (p.id === property.id ? property : p))
            : [property, ...prev];
          return updated.slice(0, limit);
        });
      }
    };

    window.addEventListener('crux-search-sync', handleSync);
    return () => window.removeEventListener('crux-search-sync', handleSync);
  }, [fetchRecent, isLoaded, limit]);

  const addProperty = useCallback((property: PropertySummary) => {
    // Dispatch globally so all hooks sync this optimistic addition
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("crux-search-sync", {
          detail: { action: "add", property },
        })
      );
    }
  }, []);

  return { properties, isLoading, error, addProperty, refetch: fetchRecent };
}
