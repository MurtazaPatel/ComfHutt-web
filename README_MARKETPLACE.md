# ComfHutt Marketplace MVP

This deliverable contains the fully functional Property Marketplace page for the ComfHutt MVP.

## Overview
The marketplace allows users to:
- Browse tokenized real estate properties across key Indian regions.
- View AI-driven credibility scores and financial projections.
- Filter by region (simulated via mock API parameters).
- Access detailed property information via a modal.
- "Invest" (KYC gated visual flow) or "List" a property.

## Key Files
- `src/app/marketplace/page.tsx`: Main route and layout.
- `src/components/PropertyCard.tsx`: Interactive card with hover auto-slide.
- `src/components/PropertyDetailModal.tsx`: Detailed view skeleton.
- `src/app/api/properties/route.ts`: Mock API serving normalized data.
- `src/lib/mock-data.ts`: Data generator script.

## Setup & Running
1. Ensure dependencies are installed: `npm install`
2. Run the development server: `npm run dev`
3. Navigate to `http://localhost:3000/marketplace`
4. Alternatively, go to `/choices`, submit the form, and observe the auto-redirect.

## Acceptance Test Checklist

### 1. Visual & Layout
- [ ] **Trust Signals:** Top of page shows "SPV-backed • AI Credibility • Legal Documents".
- [ ] **Hook:** Headline "Own a piece. Earn real rents." is visible.
- [ ] **Search:** Search bar appears with placeholder "Find tokenized properties...".
- [ ] **Pinned Hero:** "Curated Pick" card is visible on the left (desktop) or top (mobile).
- [ ] **Grid:** A grid of property cards is displayed (responsive layout).

### 2. Property Cards
- [ ] **Data:** Each card shows Price, Yield, Title, Location.
- [ ] **Auto-slide:** Hovering over a card image auto-slides through 2-3 photos (every 2.5s).
- [ ] **Reset:** Moving mouse away stops the slide and resets to the first image.
- [ ] **Badges:** "Credibility Score" (with tooltip) and "SPV" badges are present.
- [ ] **Liquidity:** Progress bar shows tokens sold vs total. "Hot" badge appears if <25% left.

### 3. Interaction
- [ ] **View Detail:** Clicking "View" or the card itself opens the modal.
- [ ] **Invest:** "Invest" button is clickable (unless Sold Out).
- [ ] **Sold Out:** If `tokens_sold == tokens_total`, button says "Sold Out" and is disabled.
- [ ] **Keyboard:** Tabbing to a card and pressing Enter/Space opens the modal. Focus also triggers image auto-slide.

### 4. Detail Modal
- [ ] **Content:** Modal shows large carousel, financials, credibility score, and document list.
- [ ] **Close:** Clicking 'X' or outside the modal closes it.

### 5. API & Data
- [ ] **Regions:** Initial load includes properties from Gujarat, Maharashtra, Karnataka, Telangana, Tamil Nadu.
- [ ] **Mock Data:** Data is consistent with the schema (Yields 2.5-6.5%, Credibility 60-95).

### 6. Flows
- [ ] **Choices Redirect:** Submitting the form at `/choices` redirects to `/marketplace` after success.
- [ ] **Owner CTA:** "Start Listing" section at the bottom of the marketplace page works (links to `/choices?intent=list-property`).

## Notes
- Images are sourced from Unsplash/Pexels via the mock generator.
- No real backend database is connected; data is generated on-the-fly by the API route.