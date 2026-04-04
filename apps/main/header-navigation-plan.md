# Plan to Connect Header Buttons to Sections

This document outlines the plan to wire the "How it works" and "Benefits" buttons in the `OnboardingNavbar` to the corresponding sections on the developer onboarding page.

## 1. Assign Section IDs

I will add unique, semantic IDs to the target sections in their respective component files.

-   **How It Works Section:**
    -   File: `src/components/developer-onboarding/HowItWorksSection.tsx`
    -   ID: `id="how-it-works"`
    -   I will add this ID to the main `<section>` element.

-   **Developer Benefits Section:**
    -   File: `src/components/developer-onboarding/DeveloperBenefitsSection.tsx`
    -   ID: `id="developer-benefits"`
    -   I will add this ID to the main `<section>` element.

## 2. Wire Header Buttons

I will update the `OnboardingNavbar` component to use these IDs in the `href` attributes of the `Link` components.

-   **File:** `src/components/developer-onboarding/OnboardingNavbar.tsx`
-   **"How It Works" Button:**
    -   Update `href="#how-it-works"` (currently it might be generic or missing).
-   **"Benefits" Button:**
    -   Update `href="#developer-benefits"` (currently likely generic).

## 3. Verify Smooth Scrolling

The global CSS (`src/app/globals.css`) already includes `scroll-behavior: smooth` for the `html` and `body` elements. This should ensure native, smooth scrolling without needing extra JavaScript libraries. I will rely on this existing configuration.

## 4. Implementation Steps

1.  **[ ] Add ID to `HowItWorksSection.tsx`:** Edit the section wrapper to include `id="how-it-works"`.
2.  **[ ] Add ID to `DeveloperBenefitsSection.tsx`:** Edit the section wrapper to include `id="developer-benefits"`.
3.  **[ ] Update `OnboardingNavbar.tsx`:** Change the `Link` hrefs to point to these new IDs.

## 5. Validation

-   I will confirm that clicking "How it works" scrolls smoothly to the correct section.
-   I will confirm that clicking "Benefits" scrolls smoothly to the correct section.
-   I will ensure no other buttons or layout elements are disturbed.
