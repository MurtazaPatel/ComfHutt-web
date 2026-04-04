# Mobile Audit Fixes

## Overview
This update addresses critical mobile usability issues, layout bugs, and accessibility gaps to ensure a mobile-first experience across the application.

## Key Changes

### Navigation & Layout
- **Navbar (Marketplace):** Added a fully functional mobile hamburger menu with animated transitions (Framer Motion).
- **LandingNavbar:** Improved touch targets for mobile menu links.
- **Global:** Fixed potential horizontal scrolling issues by applying `overflow-x-hidden` to key containers.

### Components
- **Marketplace Filters:** Enabled horizontal scrolling for the filter row on mobile devices to prevent wrapping issues.
- **PropertyCard:** optimized `ScoreWheel` tooltip to be toggleable on click for touch devices, removing dependency on hover.
- **PropertyDetailModal:** 
  - Adjusted layout to stack vertically on mobile.
  - Improved Close button position and size for better touch accessibility.
  - Fixed overflow handling to ensure content is scrollable on small screens.
- **PropertySummary:**
  - Added swipe support for the image gallery using `framer-motion` gestures.
  - Implemented a sticky "Invest Now" bottom bar on mobile for better conversion and accessibility.
  - Hid navigation arrows on mobile to reduce clutter and encourage swipe interaction.

### Automation
- Added `scripts/mobile-smoke.js` to run Puppeteer-based smoke tests for critical mobile flows.
- Added `npm run mobile-smoke` command to `package.json`.

## Files Changed
- `src/components/Navbar.tsx`
- `src/components/LandingNavbar.tsx`
- `src/app/marketplace/page.tsx`
- `src/components/PropertyCard.tsx`
- `src/components/PropertyDetailModal.tsx`
- `src/components/PropertySummary.tsx`
- `package.json`
- `scripts/mobile-smoke.js` (new)