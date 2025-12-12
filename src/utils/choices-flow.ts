import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { OnboardingPrefillData } from "./onboarding";
import { FEATURES } from "@/config/feature-flags";

const SEEN_CHOICES_KEY = "comfhutt:seen_choices";
const ONBOARDING_NEXT_KEY = "comfhutt:onboarding_next";

export interface ChoicesNextPayload {
  next: string;
  prefill?: OnboardingPrefillData;
}

/**
 * Checks if the user has already completed the choices flow.
 */
export const hasSeenChoices = (): boolean => {
  if (typeof window === "undefined") return false;
  
  // Check localStorage first
  const localSeen = localStorage.getItem(SEEN_CHOICES_KEY);
  if (localSeen === "1") return true;

  // Fallback to cookie check if localStorage failed or empty (simple check)
  return document.cookie.includes("comfhutt_seen_choices=1");
};

/**
 * Marks the choices flow as seen.
 */
export const setSeenChoices = () => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(SEEN_CHOICES_KEY, "1");
  } catch (e) {
    console.error("Failed to set localStorage", e);
  }
  
  // Also set a session cookie as fallback
  document.cookie = "comfhutt_seen_choices=1; path=/; max-age=31536000"; // 1 year
};

/**
 * Stores the intended next destination and prefill data before redirecting to choices.
 */
export const setChoicesNext = (payload: ChoicesNextPayload) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ONBOARDING_NEXT_KEY, JSON.stringify(payload));
};

/**
 * Retrieves and clears the intended next destination.
 */
export const getChoicesNext = (): ChoicesNextPayload | null => {
  if (typeof window === "undefined") return null;
  
  const stored = sessionStorage.getItem(ONBOARDING_NEXT_KEY);
  if (!stored) return null;

  try {
    const payload = JSON.parse(stored);
    sessionStorage.removeItem(ONBOARDING_NEXT_KEY);
    return payload;
  } catch (e) {
    console.error("Failed to parse choices next payload", e);
    sessionStorage.removeItem(ONBOARDING_NEXT_KEY);
    return null;
  }
};

/**
 * Main utility to gate onboarding behind choices.
 * If user hasn't seen choices, redirects there and saves intent.
 * If user has seen choices, redirects to onboarding directly.
 */
export const requireChoicesBeforeOnboarding = (
  router: AppRouterInstance,
  prefillData?: OnboardingPrefillData
) => {
  // If feature is disabled, just go to onboarding
  if (!FEATURES.REQUIRE_CHOICES_FOR_FIRST_TIME) {
     router.push("/owner-onboarding");
     return;
  }

  if (hasSeenChoices()) {
    router.push("/owner-onboarding");
  } else {
    // Store intent
    setChoicesNext({
      next: "/owner-onboarding",
      prefill: prefillData
    });
    // Redirect to choices
    router.push("/choices");
  }
};