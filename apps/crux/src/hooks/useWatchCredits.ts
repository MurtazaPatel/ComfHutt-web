"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useApiFetch } from "@/lib/api";
import { FALLBACK_PLANS, type PlanDefinition } from "@/lib/pricing";

/**
 * Watch credit balance, as `GET /crux/watch/credits` returns it.
 *
 * Declared here rather than inside a component because two surfaces need it —
 * the property action row and the dashboard's plan card — and a balance that
 * disagrees between two places on the same screen is worse than no balance.
 */
export interface WatchCredits {
  credits_remaining: number;
  credits_total: number;
  credits_used: number;
}

/**
 * Read the signed-in user's Watch balance.
 *
 * A credit is real money's worth of product: three per account, spent one per
 * watched property by `POST /crux/watch/:id`. Failure returns null rather than a
 * zero balance — showing "0 of 3 left" because a request failed would push
 * someone toward an upgrade they do not need.
 */
export function useWatchCredits() {
  const { isSignedIn, isLoaded } = useAuth();
  const apiFetch = useApiFetch();
  const [credits, setCredits] = useState<WatchCredits | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!isSignedIn) {
      setCredits(null);
      setIsLoading(false);
      return;
    }
    try {
      const res = await apiFetch<{ success: boolean; data?: WatchCredits }>("/crux/watch/credits");
      setCredits(res.success && res.data ? res.data : null);
    } catch {
      setCredits(null);
    } finally {
      setIsLoading(false);
    }
  }, [apiFetch, isSignedIn]);

  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;
    (async () => {
      if (!cancelled) await refetch();
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, refetch]);

  return { credits, isLoading, refetch };
}

interface PlansPayload {
  plans: PlanDefinition[];
  /** False when Razorpay is not configured — checkout must not be offered. */
  paymentsConfigured: boolean;
}

/**
 * The real plan catalogue from `GET /crux/billing/plans`.
 *
 * Prices live in the backend's `config/pricing.ts` precisely so no screen
 * hardcodes a number. `paymentsConfigured` reflects whether Razorpay keys are
 * actually present: when it is false, offering a checkout button would open a
 * flow that cannot complete, so callers link to pricing instead.
 */
export function useCruxPlans() {
  const apiFetch = useApiFetch();
  const [data, setData] = useState<PlansPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch<{ success: boolean; data?: PlansPayload }>(
          "/crux/billing/plans",
          { skipAuth: true },
        );
        if (!cancelled && res.success && res.data) setData(res.data);
      } catch {
        // The prices are also compiled in as a fallback, but a fallback that
        // claims payments are configured would render a dead checkout button.
        if (!cancelled) setData({ plans: FALLBACK_PLANS, paymentsConfigured: false });
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [apiFetch]);

  const proMonthly = data?.plans.find((p) => p.id === "pro_monthly") ?? null;
  const proAnnual = data?.plans.find((p) => p.id === "pro_annual") ?? null;

  return {
    plans: data?.plans ?? null,
    proMonthly,
    proAnnual,
    paymentsConfigured: data?.paymentsConfigured ?? false,
    isLoading,
  };
}
