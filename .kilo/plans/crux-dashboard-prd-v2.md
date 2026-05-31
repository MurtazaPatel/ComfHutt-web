# CRUX Dashboard — PRD v2
## OpenAI-Inspired Design · Pixel-Perfect ChatGPT Replication

> **Foundation document.** Every pixel, every token, every state. Built from the OpenAI design system at `apps/crux/Open_AI_design/` — Signifier/Söhne typography, hairline borders, teal→green accent swap, 16px card radius, 9999px pills, 4px base grid.

---

## 0. DESIGN SYSTEM MAPPING — OpenAI → CRUX

The CRUX dashboard replicates the OpenAI design system exactly, swapping only the brand color and specific fonts. Every spacing value, radius, shadow, and animation curve is identical to OpenAI's spec.

### 0.1 Token Mapping

| OpenAI Token | OpenAI Value | CRUX Token | CRUX Value | Notes |
|---|---|---|---|---|
| `--bg` | `#ffffff` | `bg-white` / `--crux-bg-primary` | `#FFFFFF` | Identical |
| `--surface` | `#f5f5f5` | `--crux-bg-secondary` | `#F9FAFB` | Slightly lighter |
| `--surface-warm` | `#fafafa` | `bg-gray-50` | `#F9FAFB` | Same |
| `--fg` (ink black) | `#0d0d0d` | `--crux-text-primary` | `#111827` | Same role |
| `--fg-2` | `#1a1a1a` | `text-gray-800` | `#1F2937` | Secondary headings |
| `--muted` (slate) | `#6e6e6e` | `--crux-text-secondary` | `#6B7280` | Secondary text |
| `--meta` (ash) | `#9b9b9b` | `--crux-text-muted` | `#9CA3AF` | Tertiary, placeholders |
| `--accent` (teal) | `#10a37f` | `--crux-green` | `#22C55E` | **Brand swap** |
| `--accent-hover` | `#0a7a5e` | `--crux-green-mid` | `#16A34A` | Hover state |
| `--accent-soft` | `#e8f5f0` | `--crux-green-tint` | `#F0FDF4` | Success/pill bg |
| `--border` (hairline) | `#e5e5e5` | `--crux-border` | `#E5E7EB` | Hairline separator |
| `--border-soft` | `#ededed` | `border-gray-100` | `#F3F4F6` | Card outline |
| `--danger` | `#ef4146` | `red-500` | `#EF4444` | Error |
| `--warn` | `#f5a623` | `amber-500` | `#F59E0B` | Advisory |

### 0.2 Typography Mapping

| Role | OpenAI Font | CRUX Font | CRUX Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|---|
| Display Hero | Signifier (serif) | **Instrument Serif** | 56px (3.5rem) | 400 | 1.08 | -0.02em |
| H1 Page Heading | Söhne 600 | Inter 600 | 40px | 600 | 1.15 | -0.01em |
| H2 Section | Söhne 600 | Inter 600 | 28px | 600 | 1.2 | -0.005em |
| H3 Sub-section | Söhne 600 | Inter 600 | 20px | 600 | 1.3 | normal |
| Body Large | Söhne 400 | Inter 400 | 18px | 400 | 1.6 | normal |
| Body | Söhne 400 | Inter 400 | 16px | 400 | 1.65 | normal |
| Body Small | Söhne 400 | Inter 400 | 14px | 400 | 1.55 | normal |
| Caption/Meta | Söhne 500 | Inter 500 | 13px | 500 | 1.4 | 0.01em |
| Label/Eyebrow | Söhne 500 | Inter 500 | 12px | 500 | 1.3 | 0.04em |
| Code/Mono | Söhne Mono | **JetBrains Mono** | 13px | 400 | 1.55 | normal |

> **Rule:** Weights cap at 600. Never 700+. Hierarchy from size + color, not weight.

### 0.3 Component Specs (OpenAI exact)

| Component | Radius | Border | Shadow | Padding |
|---|---|---|---|---|
| Card | 16px | 1px solid `--border-soft` | None default, `0 4px 16px rgba(0,0,0,0.06)` on hover | 24px |
| Button (primary) | 12px | None | None | 10px 18px |
| Button (secondary) | 12px | 1px solid `--border` | None | 10px 18px |
| Input | 12px | 1px solid `--border` | Focus: `0 0 0 3px rgba(34,197,94,0.12)` | 12px 14px |
| Pill/Chip | 9999px | None | None | 4px 10px |
| Prompt Box | 16px | 1px solid `--border` | Hover raise | 16px 20px |

### 0.4 Motion Specs (OpenAI exact)

| Property | Value |
|---|---|
| Duration (hover) | 150ms |
| Duration (transition) | 220ms |
| Duration (layout) | 280-360ms |
| Easing (entrance) | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Easing (exit) | `cubic-bezier(0.16, 1, 0.3, 1)` |

---

## 1. DASHBOARD HOME — Exact Layout

The dashboard home page (`/dashboard`) is the first page after sign-in/onboarding. It follows the OpenAI pattern: a centered prompt area as the focal hero, surrounded by supporting data panels.

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  Welcome, Murtaza                                                    │
│                                                                      │
│  Find intelligence on any property in India.                         │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │  [🗺️]  Enter any address in India...                         │   │
│  │       Paste a 99acres link or type an address                │   │
│  │                                                              │   │
│  │                          [→ Search]                          │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                               │
│  │Properties│ │Avg   │ │Risk  │ │Reports│                              │
│  │Analyzed │ │Score │ │Alerts│ │Gen'd  │                              │
│  │   12    │ │  78  │ │  23  │ │   5   │                              │
│  └──────┘ └──────┘ └──────┘ └──────┘                               │
│                                                                      │
│  Recent Research                                                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                 │
│  │ Property 1   │ │ Property 2   │ │ Property 3   │                 │
│  │ Score: 82    │ │ Score: 64    │ │ Score: 91    │                 │
│  │ Ahmedabad    │ │ Mumbai       │ │ Bangalore    │                 │
│  └──────────────┘ └──────────────┘ └──────────────┘                 │
│                                                                      │
│  ┌──────────────────────────┐  ┌────────────────────────────────┐   │
│  │ How CRUX Works           │  │ Market Pulse                   │   │
│  │                          │  │                                │   │
│  │ 1. Search any address    │  │ Ahmedabad    ↑ 3.2%            │   │
│  │ 2. AI analyzes 20+ DBs   │  │ Bangalore    ↑ 2.8%            │   │
│  │ 3. Get instant score     │  │ Gurgaon      → 0.1%            │   │
│  │ 4. Make informed decision│  │ Mumbai       ↓ 1.4%            │   │
│  └──────────────────────────┘  └────────────────────────────────┘   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. COMPONENT BREAKDOWN — Dashboard Home

### 2.1 `DashboardHome.tsx` — Page Component

```
apps/crux/src/app/dashboard/page.tsx
```

**Renders:**
```tsx
<DashboardShell>          // App sidebar + main wrapper
  <WelcomeHeader />        // "Welcome, [Name]" + subtitle
  <PromptBox />            // ChatGPT-style prompt input
  <ExampleSearches />      // Quick-start chips
  <QuickStats />           // 4 stat cards
  <RecentProperties />     // Horizontal scrollable cards
  <HowItWorks />           // 4-step guide
  <MarketPulse />          // City trend indicators
</DashboardShell>
```

**States:**
| State | Render |
|---|---|
| Loading (auth) | Skeleton sidebar + centered spinner |
| Loading (user data) | Skeleton stat cards (gray bars) |
| Loaded (empty — no properties yet) | Prompt box full height, stats at 0, Recent Research → "Score your first property" CTA |
| Loaded (has data) | Full layout as above |
| Error | Red banner at top with retry |

---

### 2.2 `DashboardShell.tsx` — App Layout

```
apps/crux/src/app/dashboard/layout.tsx
```

**Layout (desktop):**
```
┌──────┐ ┌─────────────────────────────────────────────────┐
│      │ │                                                  │
│ SIDE │ │              MAIN CONTENT                        │
│  BAR │ │              {children}                          │
│ 72px │ │                                                  │
│      │ │                                                  │
└──────┘ └─────────────────────────────────────────────────┘
```

**Sidebar (72px fixed width):**
- CRUX logo icon (collapsed)
- Nav items as icons only: Home (House), Properties (Building2), Lens (MessageSquare), Reports (FileText)
- Active item: green left border (3px) + green-tint bg
- Hover: gray-100 bg
- Bottom: UserButton (avatar only, 32px circle)

**States:**
| State | Sidebar | Main |
|---|---|---|
| Loading | Gray skeleton bars | Skeleton layout |
| Authenticated | Full sidebar | Full content |
| Not auth | redirect to /signin | — |
| Mobile (<768px) | Hamburger → slide-over drawer | Full width |

---

### 2.3 `WelcomeHeader.tsx`

```
apps/crux/src/components/dashboard/WelcomeHeader.tsx
```

**Design (OpenAI spec):**
```html
<h2 style="font-family:Inter; font-size:28px; font-weight:600; line-height:1.2; letter-spacing:-0.005em; color:#111827">
  Welcome, {firstName}
</h2>
<p style="font-size:18px; font-weight:400; line-height:1.6; color:#6B7280">
  Find intelligence on any property in India.
</p>
```

**Props:** `{ userName: string }`

**States:**
| State | Render |
|---|---|
| Name available | "Welcome, Murtaza" |
| Name unavailable | "Welcome" |
| Loading | Skeleton: 28px bar (200px wide) + 18px bar (320px wide) |

---

### 2.4 `PromptBox.tsx` — ChatGPT-Style Input

```
apps/crux/src/components/dashboard/PromptBox.tsx
```

This is the **hero element of the dashboard**. It replicates ChatGPT's main prompt input box exactly.

**Visual Spec (pixel-exact):**
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  [🗺️ MapPin icon 16px]                                      │
│  Enter any address in India...                               │
│                                                              │
│  Paste a 99acres link or type an address for instant scoring │
│                                                              │
│  ─────────────────────────────────────────────────────────── │
│                                                              │
│  Example: "2BHK Satellite, Ahmedabad"    "Whitefield, BLR"   │
│                                                              │
│                                          ┌──────────┐       │
│                                          │  Analyze →│       │
│                                          └──────────┘       │
└──────────────────────────────────────────────────────────────┘
```

**OpenAI-exact CSS:**
```css
.prompt-box {
  background: var(--bg);                    /* #ffffff */
  border: 1px solid var(--border);          /* #e5e5e5 */
  border-radius: var(--radius-md);          /* 16px */
  padding: 16px 20px;                       /* OpenAI card padding */
  transition: box-shadow 220ms cubic-bezier(0.16, 1, 0.3, 1),
              border-color 150ms cubic-bezier(0.16, 1, 0.3, 1);
}
.prompt-box:focus-within {
  border-color: var(--accent);              /* #22C55E */
  box-shadow: 0 0 0 3px rgba(34,197,94,0.12);   /* focus ring */
}
.prompt-box:hover {
  box-shadow: 0 4px 16px rgba(13,13,13,0.06);   /* raise on hover */
}
```

**Internal layout:**
1. Textarea (not input) — multiline, auto-grow, min-height 48px
2. Placeholder: "Enter any address in India..."
3. Sub-label below: "Paste a 99acres link or type an address for instant scoring" — 13px, color `--muted`
4. Divider line (1px, `--border`)
5. Example chips row: "2BHK Satellite, Ahmedabad", "Whitefield, Bangalore" — clickable pills
6. Submit button: right-aligned, green, 12px radius, 10px 18px padding, "Analyze →"

**Props:** None (self-contained with `useRouter`)

**Behavior:**
- On submit (Enter or button click):
  1. Validate: address ≥ 10 characters
  2. Show loading state: textarea dims, button shows spinner + "Analyzing..."
  3. Call `POST /crux/property { address }`
  4. Call `GET /crux/score/:propertyId`
  5. Navigate to `/dashboard/properties/:propertyId`
- Example chip clicks: fill textarea with the example text, auto-submit
- Auto-focus on page load (after user data loads)

**States:**
| State | Visual |
|---|---|
| Idle | Clean prompt box, examples visible, button with "Analyze →" |
| Hover | Card elevates (`box-shadow: 0 4px 16px rgba(0,0,0,0.06)`) |
| Focus | Green border + 3px green ring |
| Typing | Text appears, button stays enabled |
| Submitting | Textarea disabled, button: spinner + "Analyzing..." |
| Error (geocode fail) | Red error text below input: "Could not find this address. Try a more specific one." |
| Error (too short) | Red error: "Address too short. Include area, city for best results." |
| Error (rate limited) | Amber warning: "Too many requests. Try again in X minutes." |

---

### 2.5 `ExampleSearches.tsx`

```
apps/crux/src/components/dashboard/ExampleSearches.tsx
```

**Design:**
A horizontal row of clickable pills (OpenAI chip style):

```html
<div style="display:flex; gap:8px; flex-wrap:wrap">
  <button class="chip">Ahmedabad SG Highway</button>
  <button class="chip">Bandra West, Mumbai</button>
  <button class="chip">Whitefield, Bangalore</button>
</div>
```

```css
.chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 9999px;          /* OpenAI pill radius */
  font-size: 12px;                /* label size */
  font-weight: 500;
  background: var(--surface);     /* #f5f5f5 */
  color: var(--muted);            /* #6e6e6e */
  border: none;
  cursor: pointer;
  transition: background 150ms cubic-bezier(0.16,1,0.3,1);
}
.chip:hover {
  background: var(--surface-warm); /* #fafafa */
  color: var(--fg);                /* #0d0d0d */
}
```

**Behavior:** Click fills PromptBox with text and submits.

---

### 2.6 `QuickStats.tsx`

```
apps/crux/src/components/dashboard/QuickStats.tsx
```

**Design:**
4 cards in a horizontal row on desktop. Stack 2x2 on tablet. Single column on mobile.

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│              │ │              │ │              │ │              │
│  Properties  │ │  Avg Score   │ │  Risk Alerts │ │  Reports     │
│  Analyzed    │ │              │ │              │ │  Generated   │
│     12       │ │     78       │ │     23       │ │      5       │
│              │ │              │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

**Card spec (OpenAI exact):**
```css
.stat-card {
  background: var(--bg);               /* #ffffff */
  border: 1px solid var(--border-soft); /* #ededed */
  border-radius: var(--radius-md);      /* 16px */
  padding: var(--space-6);              /* 24px */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: box-shadow 220ms cubic-bezier(0.16,1,0.3,1);
}
.stat-card:hover {
  box-shadow: var(--elev-raised);       /* 0 4px 16px rgba(0,0,0,0.06) */
}
.stat-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);            /* 12px */
  font-weight: 500;
  color: var(--muted);                  /* #6e6e6e */
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.stat-value {
  font-family: var(--font-body);
  font-size: var(--text-3xl);           /* 40px */
  font-weight: 600;
  color: var(--fg);                     /* #0d0d0d */
  line-height: 1;
}
```

**Data sources:**
| Stat | Source |
|---|---|
| Properties Analyzed | Count of unique properties in `crux_searches` |
| Avg Score | Average of `score_composite` across all user's searches (computed client-side) |
| Risk Alerts | Count of `risk_flags` across all reports (or placeholder: "23" initially) |
| Reports Generated | Count of `crux_reports` for user |

**States:**
| State | Render |
|---|---|
| Loading | Skeleton: gray pill (12px label) + gray bar (40px value) |
| Empty (0 properties) | All show "0" |
| Loaded | Live values from API |

---

### 2.7 `RecentProperties.tsx`

```
apps/crux/src/components/dashboard/RecentProperties.tsx
```

**Design:**
Section heading "Recent Research" (H2, 28px, Inter 600) followed by a horizontal scrollable row of property cards (desktop), or vertical stack (mobile).

**Property Card spec (OpenAI exact):**
```
┌──────────────────────────────────────┐
│                                      │
│  123, Satellite Road                 │
│  Ahmedabad, Gujarat                  │
│                                      │
│  ┌──────────┐                        │
│  │    82    │  Top 18% in area       │
│  │  /100    │                        │
│  └──────────┘                        │
│                                      │
│  Scored: May 30, 2026                │
└──────────────────────────────────────┘
```

```css
.property-card {
  background: var(--bg);
  border: 1px solid var(--border-soft);     /* #ededed */
  border-radius: var(--radius-md);           /* 16px */
  padding: var(--space-6);                   /* 24px */
  min-width: 280px;
  max-width: 320px;
  flex-shrink: 0;
  cursor: pointer;
  transition: box-shadow 220ms cubic-bezier(0.16,1,0.3,1),
              border-color 150ms;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.property-card:hover {
  box-shadow: 0 4px 16px rgba(13,13,13,0.06);
  border-color: var(--border);               /* #e5e5e5 */
}
```

**Inside card:**
- Address: 14px, Inter 500, `--fg`
- City: 12px, Inter 400, `--muted`
- Mini score ring (48px SVG circle with green arc, score centered)
- Score badge: 12px pill, green bg `#F0FDF4`, green text `#16A34A`, "Top X% in area"
- Timestamp: 11px, `--meta`, "Scored May 30, 2026"
- Click → navigate to `/dashboard/properties/[id]`

**Scroll container:**
```css
.scroll-row {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
  scroll-snap-type: x mandatory;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scroll-row::-webkit-scrollbar { display: none; }
```

**States:**
| State | Render |
|---|---|
| Loading | 3 skeleton cards (gray rectangles at 280x180px) |
| Empty (no searches) | Centered card: "Score your first property" with icon + CTA button → focuses PromptBox |
| 1-2 properties | Cards at natural width, no scroll |
| 3+ properties | Horizontal scroll with snap |

---

### 2.8 `HowItWorks.tsx`

```
apps/crux/src/components/dashboard/HowItWorks.tsx
```

**Design:**
Left panel card (takes ~45% width on desktop). 4 numbered steps with icons.

```
┌──────────────────────────────────┐
│  How CRUX Works                  │
│                                  │
│  1  🔍  Search any address       │
│  2  🤖  AI analyzes 20+ databases│
│  3  📊  Get your CRUX score      │
│  4  ✅  Make informed decisions  │
└──────────────────────────────────┘
```

```css
.step-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}
.step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--surface);             /* #f5f5f5 */
  color: var(--muted);                    /* #6e6e6e */
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
```

**Props:** None (static content).

---

### 2.9 `MarketPulse.tsx`

```
apps/crux/src/components/dashboard/MarketPulse.tsx
```

**Design:**
Right panel card (~45% width). Simple city trend list. No real API — placeholder data.

```
┌──────────────────────────────────┐
│  Market Pulse                    │
│                                  │
│  Ahmedabad      ↑ 3.2%    ●      │
│  Bangalore      ↑ 2.8%    ●      │
│  Gurgaon        → 0.1%    ●      │
│  Mumbai         ↓ 1.4%    ●      │
│  Pune           ↑ 1.9%    ●      │
│  Hyderabad      → 0.3%    ●      │
└──────────────────────────────────┘
```

**Data:** Static placeholder array. Green arrow = up, red arrow = down, gray = flat. Dots are NHB RESIDEX indicators.

**Props:** None (static placeholder until `GET /crux/market-pulse` is built).

---

## 3. LENS CHAT — ChatGPT Pixel-Perfect Replication

The Lens chat page (`/dashboard/lens/[propertyId]`) replicates the **ChatGPT interface exactly** — every pixel, every spacing, every animation. The only differences are:
- Green accent instead of teal
- CRUX logo instead of OpenAI logo
- "Lens" name instead of "ChatGPT"

### 3.1 Layout Reference — ChatGPT Interface

```
┌──────────────────────────────────────────────────────────────────────┐
│ ┌──────────────────────────┐                                         │
│ │ ←  Back to Property      │              [Property Name]            │
│ └──────────────────────────┘                                         │
│                                                                      │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │                                                                  │ │
│ │  ┌──────────────────────────────────────────────────────────────┐│ │
│ │  │  CRUX Lens                                                    ││ │
│ │  │                                                              ││ │
│ │  │  I've analyzed {property}. The CRUX score is 82/100,         ││ │
│ │  │  placing it in the top 18% of comparable properties.         ││ │
│ │  │  What would you like to know?                                ││ │
│ │  └──────────────────────────────────────────────────────────────┘│ │
│ │                                                                  │ │
│ │  ┌──────────────────────────────────────────────────────────────┐│ │
│ │  │                                              Any court cases? ││ │
│ │  └──────────────────────────────────────────────────────────────┘│ │
│ │                                                                  │ │
│ │  ┌──────────────────────────────────────────────────────────────┐│ │
│ │  │  CRUX Lens                                                    ││ │
│ │  │                                                              ││ │
│ │  │  Let me check the legal records... Running verification      ││ │
│ │  │  through eCourts and RERA databases.                         ││ │
│ │  │                                                              ││ │
│ │  │  Found 2 active cases:                                       ││ │
│ │  │  1. Civil Suit #AHM-2026-3421 (Pending)                      ││ │
│ │  │  2. RERA Complaint #GJ-RERA-2025-891 (Resolved)              ││ │
│ │  └──────────────────────────────────────────────────────────────┘│ │
│ │                                                                  │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │                                                                  │ │
│ │  Ask anything about this property...                     [📤]    │ │
│ │                                                                  │ │
│ └──────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

### 3.2 Lens Chat Components

#### `LensChatPage.tsx` — Page Component
```
apps/crux/src/app/dashboard/lens/[propertyId]/page.tsx
```

```tsx
export default function LensChatPage({ params }: { params: { propertyId: string } }) {
  return (
    <DashboardShell>
      <LensChatContainer propertyId={params.propertyId} />
    </DashboardShell>
  );
}
```

#### `LensChatContainer.tsx`
```
apps/crux/src/components/dashboard/lens/LensChatContainer.tsx
```

**Layout:**
```
┌──────────────────────────────────────────────────┐
│  Top bar: ← Back · Property Name · [New Session] │
├──────────────────────────────────────────────────┤
│                                                  │
│  Message list (flex-1, overflow-y-auto)          │
│                                                  │
│  - AI messages (left-aligned)                    │
│  - User messages (right-aligned)                 │
│  - Tool result cards (inline)                    │
│                                                  │
├──────────────────────────────────────────────────┤
│  Prompt input bar (sticky bottom)                │
└──────────────────────────────────────────────────┘
```

**Top bar (ChatGPT-style):**
```css
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid var(--border);      /* #e5e5e5 */
  background: var(--bg);                        /* #ffffff */
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(8px);
}
```

- Left: Back button (← arrow, 16px, `--muted`)
- Center: Property name (14px, Inter 500, `--fg`)
- Right: "New Session" button (secondary style, 12px radius)

#### `MessageList.tsx`
```
apps/crux/src/components/dashboard/lens/MessageList.tsx
```

**ChatGPT-exact message container:**
```css
.message-list {
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  gap: 24px;
  max-width: 768px;
  margin: 0 auto;
  width: 100%;
}
```

Each message pair (question + response) gets 48px gap. Individual messages within a group get 16px.

#### `AIMessage.tsx`
```
apps/crux/src/components/dashboard/lens/AIMessage.tsx
```

**ChatGPT-exact AI message:**
```html
<div class="ai-message-row" style="display:flex; gap:16px; padding:0 24px">
  <!-- Avatar -->
  <div style="width:30px; height:30px; border-radius:2px; background:#22C55E; flex-shrink:0;
              display:flex; align-items:center; justify-content:center">
    <svg><!-- CRUX icon 16px white --></svg>
  </div>
  
  <!-- Content -->
  <div style="flex:1; min-width:0">
    <div style="font-weight:600; font-size:14px; color:#111827; margin-bottom:4px">
      CRUX Lens
    </div>
    <div style="font-size:16px; line-height:1.65; color:#111827">
      <!-- Markdown-rendered content -->
      I've analyzed this property. The CRUX score is 82/100...
    </div>
  </div>
</div>
```

**Specs:**
- Avatar: 30×30px, border-radius 2px (ChatGPT uses square-ish), green bg with white CRUX icon
- Name: 14px, Inter 600, `--fg`, margin-bottom 4px
- Content: 16px, Inter 400, `--fg`, line-height 1.65 (ChatGPT body)
- Markdown: bold, italic, code blocks, lists supported
- Code blocks: background `--surface`, border 1px `--border-soft`, 12px radius, 12px padding
- Max width: 768px centered in message list

#### `UserMessage.tsx`
```
apps/crux/src/components/dashboard/lens/UserMessage.tsx
```

**ChatGPT-exact user message:**
```html
<div style="display:flex; justify-content:flex-end; padding:0 24px">
  <div style="max-width:70%; background:var(--surface); border-radius:16px; padding:12px 16px;
              font-size:16px; line-height:1.65; color:var(--fg)">
    Any court cases?
  </div>
</div>
```

**Specs:**
- Right-aligned
- Background: `--surface` (#f5f5f5) — ChatGPT's user message bg
- Border-radius: 16px (OpenAI card radius)
- Padding: 12px 16px
- Max-width: 70% of container
- No avatar
- Font: 16px, Inter 400, line-height 1.65

#### `ToolResultCard.tsx` — Inline Result Cards
```
apps/crux/src/components/dashboard/lens/ToolResultCard.tsx
```

When the Lens agent uses a tool (triggerScore, triggerResearch, etc.), the result appears as an **inline card** within the AI message stream — just like ChatGPT's browsing/code interpreter results.

**Design (ChatGPT-style inline result):**
```html
<div style="border:1px solid var(--border); border-radius:12px; padding:16px; 
            margin-top:12px; background:var(--bg)">
  <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px">
    <span class="label">Score Result</span>
    <span class="chip chip-green">Fresh</span>
  </div>
  
  <!-- Score gauge inline -->
  <div style="display:flex; align-items:center; gap:16px">
    <div class="mini-gauge">82</div>
    <div>
      <div style="font-weight:600">Top 18% in area</div>
      <div style="font-size:13px; color:var(--muted)">Confidence: 74%</div>
    </div>
  </div>
</div>
```

**Types supported:**
| Type | Render |
|---|---|
| `score` | Mini score gauge + top % badge + confidence |
| `report` | Summary excerpt + "View Full Report" link |
| `research` | Evidence count (verified/contradicted) + "View Research" link |
| `verification` | Verdict summary (verified N, contradicted M) |
| `cast` | "Coming Soon" card |
| `yield` | "Coming Soon" card |

#### `PromptInputBar.tsx` — ChatGPT-Style Input
```
apps/crux/src/components/dashboard/lens/PromptInputBar.tsx
```

This is the **bottom input bar** — pixel-exact ChatGPT replication.

**Design:**
```html
<div style="position:sticky; bottom:0; background:linear-gradient(to top, white 80%, transparent);
            padding:16px 24px 24px">
  <div class="prompt-box" style="display:flex; align-items:center; gap:8px;
            border:1px solid var(--border); border-radius:16px; padding:8px 12px;
            max-width:768px; margin:0 auto; background:white">
    <textarea placeholder="Ask anything about this property..."
              style="flex:1; border:none; outline:none; resize:none; font-size:16px;
                     line-height:1.65; font-family:Inter; color:var(--fg);
                     background:transparent; padding:4px 0; min-height:24px;
                     max-height:200px"
              rows="1"
              onInput="this.style.height='auto'; this.style.height=this.scrollHeight+'px'"></textarea>
    <button style="width:32px; height:32px; border-radius:8px; border:none;
                   background:var(--accent); color:white; display:flex;
                   align-items:center; justify-content:center; cursor:pointer;
                   flex-shrink:0; transition:background 150ms">
      <svg><!-- Send icon 16px --></svg>
    </button>
  </div>
  <p style="text-align:center; font-size:11px; color:var(--meta); margin-top:8px">
    CRUX Lens may produce inaccurate information. Verify critical decisions independently.
  </p>
</div>
```

**ChatGPT-exact specs:**
- Container: sticky bottom, gradient fade above (white → transparent)
- Input wrapper: 1px border `--border`, 16px radius, 8px 12px padding, flex row
- Textarea: auto-grow (min 24px, max 200px), no border, no outline, 16px Inter
- Send button: 32×32px, 8px radius, green bg, white send icon, flex-shrink 0
- Disclaimer: 11px, `--meta`, centered, 8px top margin (same as ChatGPT's footer)
- Focus: green border on wrapper, 3px ring

**Props:** `{ onSend: (message: string) => void; isLoading: boolean; sessionExpired: boolean }`

**Behavior:**
- Enter to submit (Shift+Enter for newline)
- Auto-grow textarea
- Disabled during streaming
- If session expired: show "Session expired. Start a new session." button instead
- Keyboard shortcut: `/` focuses the input

**States:**
| State | Visual |
|---|---|
| Idle | Clean input, placeholder visible, send button disabled (gray) |
| Text entered | Send button turns green, enabled |
| Streaming | Textarea disabled, send button shows stop icon ■, "CRUX is responding..." placeholder |
| Session expired | Input replaced with "New Session" button |
| Error | Red text below input: "Message failed to send. Retry?" |

---

## 4. PROPERTY DETAIL PAGE

```
/apps/crux/src/app/dashboard/properties/[id]/page.tsx
```

### Layout
```
┌──────────────────────────────────────────────────────────────┐
│  ← Back                                          [Share] [⚙] │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 123, Satellite Road                                   │   │
│  │ Ahmedabad, Gujarat · Residential · Scored May 30      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─── Score ─────────────────┬─── Actions ──────────────┐   │
│  │                           │                           │   │
│  │    ┌──────────┐           │  [💬 Lens Chat]          │   │
│  │    │    82    │ Top 18%   │  [📄 Full Report]        │   │
│  │    │  /100    │ in area   │  [🔗 Share Card]         │   │
│  │    └──────────┘           │  [👁️ Watch Property]     │   │
│  │                           │  [🔄 Recompute Score]    │   │
│  └───────────────────────────┴──────────────────────────┘   │
│                                                              │
│  ┌─── Category Breakdown ───────────────────────────────┐   │
│  │                                                        │   │
│  │  Location Intelligence  ████████████░░  82  (30%)     │   │
│  │  Developer Reliability  ██████████████  78  (20%)     │   │
│  │  Legal Compliance       ██████████████  85  (15%)     │   │
│  │  Market Valuation       ██████████░░░░  72  (10%)     │   │
│  │  Structural & Physical  ██████████░░░░  50  (stub)    │   │
│  │  Risk Composite         ████████░░░░░░  60  (5%)      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─── Data Sources ────────────────────────────────────┐    │
│  │  [MCA21] [eCourts] [RERA] [NHB RESIDEX] [NASA VIIRS] │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Components

#### `ScoreGauge.tsx`
- Props: `score: number (0-100), grade: string, percentile: number`
- Circular SVG gauge (120px on desktop, 96px on mobile)
- Green arc from 0° to `(score/100)*360°`
- Score number centered, 40px Inter 600
- Grade label below: 14px Inter 500
- Percentile badge: pill, "Top X%"
- Color scale: red (<30), amber (30-55), green (>55)

#### `CategoryBreakdown.tsx`
- Props: `breakdown: Record<string, number>, weights: Record<string, number>`
- Horizontal bar per category
- Bar: 8px height, 12px radius, green gradient fill
- Label: 13px Inter 500 left, score right
- Weight % pill on right
- Expandable tooltip on click with evidence

#### `PropertyActions.tsx`
- Props: `propertyId: string, onAction: (action: string) => void`
- Vertical stack of secondary buttons
- Each: 48px height, full width, left icon + label, right arrow
- Hover: `--surface` bg
- Active: subtle scale
- Per-action loading spinners

---

## 5. REPORT PAGE

```
/apps/crux/src/app/dashboard/reports/[propertyId]/page.tsx
```

### Layout
```
┌──────────────────────────────────────────────────────────────┐
│  ← Back to Property                          Print  ·  Share │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                                                      │   │
│  │  CRUX Report                                         │   │
│  │  123 Satellite Road, Ahmedabad                       │   │
│  │  Generated May 31, 2026 · Intent: Balanced            │   │
│  │                                                      │   │
│  │  ───────────────────────────────────────────────────  │   │
│  │                                                      │   │
│  │  SUMMARY                                             │   │
│  │  This property scores 82/100, placing it in the      │   │
│  │  top 18% of comparable properties in Ahmedabad...    │   │
│  │                                                      │   │
│  │  ▸ Legal & Compliance                                │   │
│  │    RERA registration active. 2 pending civil suits.  │   │
│  │                                                      │   │
│  │  ▸ Location Quality                                  │   │
│  │    AQI 88 (Moderate). Metro station < 500m...        │   │
│  │                                                      │   │
│  │  ... (collapsible sections)                          │   │
│  │                                                      │   │
│  │  RISK FLAGS                                          │   │
│  │  ⚠ RERA registration expires in 45 days              │   │
│  │  ⚠ Adjacent property has pending litigation          │   │
│  │  ⚠ 12% vacancy rate in this micro-market             │   │
│  │                                                      │   │
│  │  POSITIVE SIGNALS                                    │   │
│  │  ✅ Developer has completed 14 projects               │   │
│  │  ✅ Metro station under construction (500m)           │   │
│  │  ✅ 23% YoY appreciation in this micro-market         │   │
│  │                                                      │   │
│  │  ───────────────────────────────────────────────────  │   │
│  │  Disclaimer: This report is generated by AI...        │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## 6. HOOKS — Complete Spec

### 6.1 `usePropertyScore(propertyId: string, intent?: string)`
```ts
{
  score: CruxScore | null;
  isLoading: boolean;
  error: string | null;
  recompute: () => Promise<void>;
  setIntent: (intent: string) => void;
}
```
- Fetches on mount + intent change
- 24h cache check on backend (via `GET /crux/score/:id`)
- Returns cached score if within TTL

### 6.2 `useLensSession(propertyId: string)`
```ts
{
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
  messages: LensMessage[];
  sendMessage: (text: string) => Promise<void>;
  isStreaming: boolean;
  abort: () => void;
  createNewSession: () => Promise<void>;
}
```
- Creates session on mount: `POST /crux/lens/session { property_id }`
- SSE streaming via `fetch` + `ReadableStream`
- Message limit: 30 per session (enforced server-side)
- Auto-expire: session recreated after 2h TTL

### 6.3 `useSSEStream(url: string, body: any)`
```ts
{
  chunks: SSEDelta[];
  isStreaming: boolean;
  error: string | null;
  abort: () => void;
}
```
- Generic SSE handler
- AbortController for cleanup
- Auto-retry on connection loss (3 attempts)

### 6.4 `useCruxUser()` — Existing, no changes needed

### 6.5 `useRecentProperties(limit?: number)`
```ts
{
  properties: PropertySummary[];
  isLoading: boolean;
  error: string | null;
}
```
- Fetches recent searches (placeholder: localStorage until `GET /crux/searches` exists)
- Each PropertySummary: `{ id, address, city, score, scoredAt }`

### 6.6 `useDashboardStats()`
```ts
{
  stats: { propertiesAnalyzed: number; avgScore: number; riskAlerts: number; reportsGenerated: number };
  isLoading: boolean;
}
```
- Aggregates from recent properties + reports data
- Fallback: zeros for new users

---

## 7. FILE STRUCTURE — All Files

```
apps/crux/src/
├── app/dashboard/
│   ├── layout.tsx                           ← DashboardShell (sidebar + wrapper)
│   ├── page.tsx                             ← DashboardHome
│   ├── properties/
│   │   └── [id]/
│   │       └── page.tsx                     ← PropertyDetail
│   ├── lens/
│   │   └── [propertyId]/
│   │       └── page.tsx                     ← LensChatPage
│   ├── reports/
│   │   └── [propertyId]/
│   │       └── page.tsx                     ← ReportPage
│   └── settings/
│       └── page.tsx                         ← SettingsPage
│
├── components/dashboard/
│   ├── DashboardShell.tsx                   ← Sidebar + main layout
│   ├── Sidebar.tsx                          ← Navigation sidebar
│   ├── WelcomeHeader.tsx                    ← "Welcome, [Name]"
│   ├── PromptBox.tsx                        ← ChatGPT-style prompt input
│   ├── ExampleSearches.tsx                  ← Quick-start chips
│   ├── QuickStats.tsx                       ← 4 stat cards
│   ├── RecentProperties.tsx                 ← Scrollable property cards
│   ├── PropertyCard.tsx                     ← Single property card
│   ├── HowItWorks.tsx                       ← 4-step guide card
│   ├── MarketPulse.tsx                      ← City trend card
│   ├── ScoreGauge.tsx                       ← Circular score gauge
│   ├── CategoryBreakdown.tsx                ← Score category bars
│   ├── PropertyActions.tsx                  ← Action buttons
│   ├── ShareModal.tsx                       ← Share card modal
│   ├── ReportViewer.tsx                     ← Report layout wrapper
│   ├── ReportSection.tsx                    ← Collapsible section
│   ├── RiskFlags.tsx                        ← Risk flag list
│   ├── PositiveSignals.tsx                  ← Positive signal list
│   └── lens/
│       ├── LensChatContainer.tsx            ← Lens chat wrapper
│       ├── MessageList.tsx                  ← Scrollable message list
│       ├── AIMessage.tsx                    ← AI message bubble
│       ├── UserMessage.tsx                  ← User message bubble
│       ├── ToolResultCard.tsx               ← Inline tool result
│       └── PromptInputBar.tsx               ← ChatGPT-style input bar
│
├── hooks/
│   ├── useCruxUser.ts                       ← (existing)
│   ├── usePropertyScore.ts                  ← Score fetch + cache
│   ├── useLensSession.ts                    ← Lens session + SSE
│   ├── useSSEStream.ts                      ← Generic SSE handler
│   ├── useRecentProperties.ts               ← Recent searches
│   └── useDashboardStats.ts                 ← Aggregated stats
│
└── lib/
    └── api/
        └── index.ts                         ← (existing — apiFetch, useCruxApi)
```

---

## 8. IMPLEMENTATION ORDER

### Phase 1 — Shell + Home (today)
1. `useCruxUser.ts` — verify existing
2. `useDashboardStats.ts` — new
3. `useRecentProperties.ts` — new (localStorage placeholder)
4. `DashboardShell.tsx` + `Sidebar.tsx`
5. `WelcomeHeader.tsx`
6. `PromptBox.tsx` (ChatGPT pixel-exact)
7. `ExampleSearches.tsx`
8. `QuickStats.tsx` (OpenAI card spec)
9. `PropertyCard.tsx`
10. `RecentProperties.tsx`
11. `HowItWorks.tsx` + `MarketPulse.tsx`
12. `dashboard/layout.tsx`
13. `dashboard/page.tsx`

### Phase 2 — Property Detail
14. `usePropertyScore.ts`
15. `ScoreGauge.tsx` (OpenAI card + SVG gauge)
16. `CategoryBreakdown.tsx`
17. `PropertyActions.tsx`
18. `ShareModal.tsx`
19. `dashboard/properties/[id]/page.tsx`

### Phase 3 — Lens Chat (ChatGPT pixel-perfect)
20. `useSSEStream.ts`
21. `useLensSession.ts`
22. `AIMessage.tsx` (ChatGPT-exact layout)
23. `UserMessage.tsx` (ChatGPT-exact layout)
24. `ToolResultCard.tsx`
25. `MessageList.tsx`
26. `PromptInputBar.tsx` (ChatGPT-exact bottom bar)
27. `LensChatContainer.tsx`
28. `dashboard/lens/[propertyId]/page.tsx`

### Phase 4 — Report + Settings
29. `RiskFlags.tsx`
30. `PositiveSignals.tsx`
31. `ReportSection.tsx`
32. `ReportViewer.tsx`
33. `dashboard/reports/[propertyId]/page.tsx`
34. `dashboard/settings/page.tsx`

### Phase 5 — Polish
35. Loading skeletons (all components)
36. Error boundaries (all pages)
37. Mobile responsive pass
38. Accessibility audit

---

## 9. PROMPT TEMPLATE — Per Component

```
## COMPONENT: [Name]

### OpenAI Design Tokens Used
| Token | Value | Usage |
|---|---|---|
| --bg | #ffffff | Card background |
| --border | #e5e5e5 | Hairline border |
| --border-soft | #ededed | Card outline |
| --radius-md | 16px | Card radius |
| --space-6 | 24px | Card padding |
| --muted | #6e6e6e | Secondary text |

### CRUX Brand Swap
- OpenAI Teal (#10a37f) → CRUX Green (#22C55E)
- Signifier → Instrument Serif (display only)
- Söhne → Inter (all UI text)

### Visual Spec (pixel-exact)
[ASCII layout]

### Props
```ts
interface Props { ... }
```

### States
| State | Render |
|---|---|
| Loading | [...] |
| Loaded | [...] |
| Empty | [...] |
| Error | [...] |

### CSS Spec
```css
.component {
  /* OpenAI exact values */
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  padding: 24px;
  transition: box-shadow 220ms cubic-bezier(0.16,1,0.3,1);
}
```

### Behavior
- On click: [...]
- On submit: [...]
- Edge cases: [...]

### File
`apps/crux/src/components/dashboard/[Name].tsx`
```

