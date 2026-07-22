export interface PlanDefinition {
  id: "free" | "pro_monthly" | "pro_annual";
  name: string;
  billingCycle: "monthly" | "annual" | null;
  priceRupees: number;
  priceLabel: string;
  features: string[];
}

interface PlansResponse {
  success: boolean;
  data: {
    plans: PlanDefinition[];
    paymentsConfigured: boolean;
  };
}

// Fallback used only if the backend is unreachable at render time — must be
// kept in sync with comfhutt-backend/src/config/pricing.ts, which is the
// actual source of truth served at runtime via GET /crux/billing/plans.
export const FALLBACK_PLANS: PlanDefinition[] = [
  {
    id: "free",
    name: "Free",
    billingCycle: null,
    priceRupees: 0,
    priceLabel: "/forever",
    features: [
      "Full CRUX Score (0-100)",
      "All 20+ parameters",
      "CRUX Lens AI assistant",
      "CRUX Cast predictions",
      "CRUX Yield forecasts",
      "3 Watch credits/month",
    ],
  },
  {
    id: "pro_monthly",
    name: "Pro Monthly",
    billingCycle: "monthly",
    priceRupees: 199,
    priceLabel: "/month",
    features: [
      "Unlimited Watch credits",
      "Priority re-scoring on data updates",
      "Personalized investor fit profile",
      "Full PDF dossier export",
      "Early access to new features",
    ],
  },
  {
    id: "pro_annual",
    name: "Pro Annual",
    billingCycle: "annual",
    priceRupees: 999,
    priceLabel: "/year",
    features: [
      "Everything in Pro Monthly",
      "5 months free vs. paying monthly",
      "Locked-in annual rate",
    ],
  },
];

export async function fetchPlans(): Promise<{ plans: PlanDefinition[]; paymentsConfigured: boolean }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  try {
    const res = await fetch(`${apiUrl}/crux/billing/plans`, {
      // Landing page is marketing content — cache briefly, revalidate hourly.
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`plans fetch failed: ${res.status}`);
    const body = (await res.json()) as PlansResponse;
    return { plans: body.data.plans, paymentsConfigured: body.data.paymentsConfigured };
  } catch {
    return { plans: FALLBACK_PLANS, paymentsConfigured: false };
  }
}
