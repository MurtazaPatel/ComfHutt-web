# Developer Onboarding Page Overhaul Plan

This document outlines the plan to overhaul the developer onboarding page for ComfHutt, focusing on UI/UX enhancements, performant animations, and content refactoring.

## Global Directives & Design Systems

-   **[ ] Core Philosophy: Performance & Motion:**
    -   [ ] Implement all animations using Framer Motion.
    -   [ ] Prioritize performant animations using CSS transforms and opacity.
    -   [ ] Optimize animation triggers and ensure proper component cleanup.

-   **[ ] Global Styling Mandates:**
    -   [ ] Purge all em dashes (—) from all content on the page.
    -   [ ] Maintain a single, consistent highlight color for text across all sections.
    -   [ ] Ensure the header is non-sticky and matches the main homepage header.

-   **[ ] The "ComfHutt Shine" Animation System:**
    -   [ ] Create a custom, signature shine animation effect.
    -   [ ] The effect should be a minimal yet premium, 45-degree light glint that sweeps across a word over approximately 750ms.
    -   [ ] Apply this effect to headline words as specified in the blueprint.

## Section-by-Section Implementation Blueprint

### 1. Hero Section

-   **[ ] Action:**
    -   [ ] In the main headline, apply the consistent highlight color to the word "Demand."
-   **[ ] Animation:**
    -   [ ] Apply the "ComfHutt Shine" animation to both highlighted words within the headline.

### 2. Reality Section

-   **[ ] Action:**
    -   [ ] In the anchor line, apply a barely-perceptible highlight to the phrase "building at scale."
-   **[ ] Animation:**
    -   [ ] In the headline, apply the "ComfHutt Shine" animation to the words "Capital timing."

### 3. Market Data Section

-   **[ ] Left-Side Content Refactor:**
    -   [ ] Deconstruct the paragraph to improve scannability and comprehension.
    -   [ ] Employ techniques like strategic whitespace, line breaks, or a multi-line typographic treatment.
    -   [ ] Preserve all highlighted words exactly.
-   **[ ] Right-Side Headline Animation:**
    -   [ ] Highlight both instances of "Again."
    -   [ ] Implement a sequential "ComfHutt Shine" animation that initiates on the first "Again," flows visually across the headline to the second "Again," and completes its sweep at the end of the second word.

### 4. Strategic Shift Section

-   **[ ] Action:**
    -   [ ] In the headline, highlight both "dependence" and "traditional."
-   **[ ] Animation:**
    -   [ ] Apply the "ComfHutt Shine" animation exclusively to the word "Dependence."
-   **[ ] Body Content Refactor:**
    -   [ ] Restructure the sentence for clarity and impact.
    -   [ ] Highlight the word "smarter" within this refactored text.

### 5. How It Works Section

-   **[ ] Layout Rearchitecture:**
    -   [ ] Redesign this section into a compact, vertical-only presentation of the five steps.
    -   [ ] Eliminate any grid or horizontal layouts.
-   **[ ] Iconography:**
    -   [ ] For each of the five steps, design or select a custom, high-quality icon that visually represents the concept of that step.
-   **[ ] Animation:**
    -   [ ] In the headline, locate the word "ComfHutt" and apply the "ComfHutt Shine" animation to it. Do not apply any highlight color to this word.

### 6. Developer Benefits Section

-   **[ ] Action:**
    -   [ ] In the headline, highlight the word "Partners."
-   **[ ] Animation:**
    -   [ ] Apply the "ComfHutt Shine" animation to "Partners."
-   **[ ] Layout Adjustment:**
    -   [ ] Center the second row containing the two remaining benefits to achieve visual symmetry and balance.
-   **[ ] Micro-interactions:**
    -   [ ] Add subtle, lightweight micro-animations to each benefit's custom icon on scroll-into-view or on hover.

### 7. Why Now Section

-   **[ ] Action (Headline):**
    -   [ ] Highlight the word "shift" and apply the "ComfHutt Shine" animation to it.
-   **[ ] Action (Market Data):**
    -   [ ] In the market data content, highlight the phrase "fractional ownership."
-   **[ ] Action (Anchor Line):**
    -   [ ] Remove any existing highlight from the word "execution."
    -   [ ] Instead, apply the highlight to both "Early" and "standards."

### 8. Trust Section

-   **[ ] Visual Enhancement:**
    -   [ ] Integrate a tasteful background element to reinforce trust and stability.
-   **[ ] Content Refactor:**
    -   [ ] Break the content into a more digestible format.
-   **[ ] Action (Headline):**
    -   [ ] Highlight the word "safer" and apply the "ComfHutt Shine" animation to it.
-   **[ ] Action (Anchor Line):**
    -   [ ] Highlight the word "confidence."

### 9. CTA Section

-   **[ ] Copy Revision:**
    -   [ ] Replace "No obligations. No pressure. Just clarity." with a short, motivational, and forward-thinking statement.

### 10. Footer

-   **[ ] Action:**
    -   [ ] Implement a footer that is a pixel-perfect replication of the design, structure, and content found on the homepage footer.

## Creative Mandate & Anti-Goals

-   **[ ] Creative Authority:**
    -   [ ] Utilize full creative authority over typography, color palettes, spacing, iconography, and all other visual design decisions not explicitly defined.
-   **[ ] Anti-Goals:**
    -   [ ] Avoid generic visuals.
    -   [ ] Avoid jarring motion.
    -   [ ] Avoid performance bottlenecks.
    -   [ ] Avoid visual clutter.
