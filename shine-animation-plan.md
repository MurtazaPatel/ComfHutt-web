# Shine Animation Debugging and Refactoring Plan

This document outlines the plan to debug and refactor the shine animation on the developer onboarding page.

## 1. Root Cause Analysis

-   **Bug 1: Shine Animation Not Visible:** The shine is a background gradient on a `div`, which is hidden behind the solid color of the text. The fix is to use `background-clip: text` to apply the gradient to the text itself.
-   **Bug 2: Text Elevation / Baseline Shift:** The `display: inline-block` on the wrapper `div` is causing vertical alignment issues. The fix is to switch to `display: inline-flex` and ensure proper vertical alignment.
-   **Requirement Gap: Shine Animation Not Recurring:** The Framer Motion animation is set to run only once. The fix is to use the `repeat` and `repeatDelay` properties in the `transition` configuration to create a premium, recurring loop.

## 2. Fix Implementation Plan

-   **[ ] `shine-effect.tsx` Refactoring:**
    -   [ ] Modify the `ShineWrapper` to use `display: inline-flex` and `vertical-align: middle` to fix the baseline shift.
    -   [ ] Change the shine `motion.div` to be a pseudo-element (`::before`) on the text itself, to avoid an extra DOM element.
    -   [ ] Apply the shine effect using `background-clip: text` and a transparent text color.
    -   [ ] Update the Framer Motion `transition` to include `repeat: Infinity` and `repeatDelay` to create a slow, elegant loop.
    -   [ ] I will be using a CSS variable `--shine-color` for the shine effect, so that it can be easily customized.

-   **[ ] Component-level Implementation:**
    -   [ ] No changes are expected to be needed in the components that use `ShineWrapper`, as the changes will be self-contained within the `shine-effect.tsx` file.

## 3. Looping Strategy

The looping strategy will be implemented using Framer Motion's `transition` properties:

-   `repeat: Infinity`: This will make the animation loop indefinitely.
-   `repeatDelay`: This will add a pause between each loop, creating the desired "slow, intentional, and premium" feel. I will experiment with the delay value to find the perfect cadence.

## 4. Validation

After implementing the fixes, I will validate the following:

-   **Shine animation:**
    -   Is visible on the specified words.
    -   Loops smoothly with a premium cadence.
-   **Text:**
    -   Does not elevate and matches the baseline perfectly.
    -   Does not trigger any layout shifts.
-   **Performance:**
    -   No visual jitter during scroll.
    -   No console warnings.
    -   Consistent behavior across all sections and breakpoints.
