import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { requireChoicesBeforeOnboarding } from "./choices-flow";

export interface OnboardingPrefillData {
  propertyId?: string;
  title?: string;
  valuation?: string;
  city?: string;
  source?: string;
}

const STORAGE_KEY = "comfhutt:onboarding_prefill";
const RETURN_URL_KEY = "comfhutt:onboarding_prefill_return";

/**
 * Initiates the listing process.
 * Stores prefill data in sessionStorage and navigates to the onboarding page.
 */
export const startListingRouter = (
  router: AppRouterInstance,
  prefillData?: OnboardingPrefillData,
  isAuthenticated: boolean = false
) => {
  if (typeof window === "undefined") return;

  // Track analytics
  if ((window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: prefillData ? "click_start_listing_public" : "click_list_property_home_public",
      propertyId: prefillData?.propertyId,
      timestamp: new Date().toISOString(),
    });
  }

  // Store prefill data if provided
  if (prefillData) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(prefillData));
  } else {
    // Clear potentially stale data if starting fresh from home
    sessionStorage.removeItem(STORAGE_KEY);
  }

  // Check choices requirement before proceeding
  requireChoicesBeforeOnboarding(router, prefillData);
};

/**
 * Reads and consumes prefill data from sessionStorage.
 * Clears the storage after reading to prevent stale data reuse.
 */
export const readOnboardingPrefill = (): OnboardingPrefillData | null => {
  if (typeof window === "undefined") return null;

  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const data = JSON.parse(stored);
    // Clear immediately after reading
    sessionStorage.removeItem(STORAGE_KEY);
    
    // Track application of prefill
    if ((window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: "onboarding_prefill_applied",
        propertyId: data.propertyId,
        timestamp: new Date().toISOString(),
      });
    }
    
    return data;
  } catch (e) {
    console.error("Failed to parse onboarding prefill", e);
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
};