import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Universally redirects the user to the Choices page.
 * Use this for all main CTA buttons (Get Started, Start Investing, Learn More).
 */
export function redirectToChoices(router: AppRouterInstance) {
  router.push('/choices');
}