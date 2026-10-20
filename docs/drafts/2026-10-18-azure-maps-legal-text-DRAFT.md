# DRAFT — legal and site text for the Azure Maps switch (NOT PUBLISHED)

**Status:** draft for founder sign-off (D36d). Nothing in the live site has changed. Once
approved, these edits go into the files named below in one PR.

**Why:** since 2026-10-18 the backend geocodes new addresses with **Azure Maps** (Microsoft;
account `crux-maps`, data region **North Europe**), and crux-agents uses it for the location
module (transit, amenities, commute). Google Maps is no longer called on any live path. The
site still names Google Maps in four places, and the privacy policy does not say that an
address you type is sent to a mapping provider, or that this processing happens in the EU.

---

## 1. Privacy policy — `apps/crux/src/content/legal/privacy.ts`

**§1 table — add a row** (after "A quoted price you enter for a project"):

| What | Why | Basis |
|---|---|---|
| The address or project name you type to add a property | To find its location on a map (geocoding) so the grade can assess the area around it | Your consent / performance of the service you asked for |

**§4 "Who we share data with" — add a bullet:**

> a mapping provider (Microsoft Azure Maps), which receives the address or project name you
> enter, and the map coordinates of graded projects, to place them on a map and measure
> distances to transit and amenities. It does not receive your name, email or account details.

**§5 "Where data is stored" — add after the first paragraph:**

> Address lookups and location measurements are processed by Microsoft Azure Maps in the
> European Union (North Europe region), because the service is not offered from India.
> They contain the address you typed, not your identity. Results are cached by us in India
> wherever the service supports it.

## 2. Disclaimer — `apps/crux/src/content/legal/disclaimer.ts` (line ~79)

- **Now:** "Location and connectivity data from Google Maps Platform."
- **Proposed:** "Location and connectivity data from Microsoft Azure Maps."

## 3. Methodology page — `apps/crux/src/app/methodology/content.ts`

- Source list (line ~172): `name: "Google Maps"` → `name: "Azure Maps"`; keep the records text,
  and add: "Counts of places within each radius are capped at 100 per search."
- Module X source (line ~188): `X: "Google Maps"` → `X: "Azure Maps"`.

## 4. Landing — `apps/crux/src/components/landing/SevenChecks.tsx` (line 41)

- `"Google Maps"` → `"Azure Maps"`.

## 5. Code comment — `apps/crux/src/lib/grade.ts` (line ~162)

- The allowed source families list names Google Maps; update to Azure Maps so the grade-path
  claim filter and the methodology page agree.

---

### Open questions for the founder
1. Is "North Europe" acceptable under your DPDP reading for typed addresses (no identity
   attached)? If not, the alternative is an India-hosted geocoder (Mappls/Ola, deferred to
   after launch per D27).
2. Do you want the Azure Maps attribution ("© Microsoft") shown anywhere a map or distance
   appears? Azure Maps terms require attribution when map tiles are displayed; CRUX shows no
   tiles today, only derived numbers.
