# CRUX Dashboard — PRD, Plan & Prompt

> Foundation document for building the full CRUX application dashboard.
> Inspired by ChatGPT & Claude interfaces. Typography-first. Minimal. Production-ready.

---

## 1. BACKEND AUDIT — What Works, What Doesn't

### ✅ Live features (callable from frontend)

| Feature | Endpoint | Auth | Rate Limit | Response Type |
|---|---|---|---|---|
| **Health** | `GET /crux/health` | None | None | `{ version, timestamp }` |
| **Property Ingestion** | `POST /crux/property` | None | 50/IP/24h | `{ data: PropertyProfile }` |
| **Score Fetch** | `GET /crux/score/:id` | Bearer | 100/IP/1h | `{ data: CruxScore }` (24h cached) |
| **Score Recompute** | `POST /crux/score/:id/compute` | Bearer | 10/IP/1h | `{ data: CruxScore }` (fresh) |
| **Lens Session** | `POST /crux/lens/session` | Bearer | 20/IP/1h | `{ session_id, property_id, expires_at }` |
| **Lens Chat (SSE)** | `POST /crux/lens/:id/message` | Bearer | 100/IP/24h | SSE chunks: `{ delta, done, module_result }` |
| **Lens History** | `GET /crux/lens/:id/history` | Bearer | None | `{ messages, count }` |
| **Research Run** | `POST /crux/research/:id` | Bearer | None | `{ data: ResearchRunResult }` |
| **Research Fetch** | `GET /crux/research/:id` | Bearer | None | `{ data: ResearchRunResult }` |
| **Verification Run** | `POST /crux/verification/:id` | Bearer | None | `{ data: VerificationRunResult }` |
| **Verification Fetch** | `GET /crux/verification/:id` | Bearer | None | `{ data: VerificationRunResult }` |
| **Report** | `GET /crux/report/:id` | Bearer | 30/IP/1h | `{ data: CruxReportRow }` (24h cached) |
| **Card Generate** | `POST /crux/card/:id` | Bearer | 20/IP/24h | `{ card_id, share_token, share_url }` |
| **Card View (public)** | `GET /crux/card/share/:token` | None | 200/IP/1h | `{ card_data, view_count }` |
| **Watch Credits** | `GET /crux/watch/credits` | Bearer | None | `{ credits_remaining, total, used }` |
| **Watch Register** | `POST /crux/watch/:id` | Bearer | Credit-gated | `{ watch_id, already_watching }` |
| **User Profile** | `GET /auth/me` | Bearer | None | `{ userId, email, planTier, watchCredits, isNewUser }` |
| **Onboarding Done** | `PATCH /auth/onboarding-complete` | Bearer | None | `{ success: true }` |

### ❌ 501 Not Implemented

| Feature | Endpoint | Plan |
|---|---|---|
| **Cast** | `GET /crux/cast/:id` | Show "Coming Soon" card |
| **Yield** | `GET /crux/yield/:id` | Show "Coming Soon" card |
| **Dashboard API** | `GET /crux/dashboard` | Not needed — frontend composes from other endpoints |

---

## 2. USER JOURNEY — Complete Flow

```
SIGN IN ──→ ONBOARDING (first time) ──→ DASHBOARD
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    ▼                     ▼                     ▼
              SEARCH BAR           RECENT PROPERTIES       QUICK ACTIONS
              "Paste address"      (scored properties)     Watch Credits
                    │                     │                Settings
                    ▼                     ▼
              PROPERTY CARD         PROPERTY DETAIL
              (score card)          (full report)
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
     SCORE       LENS         REPORT
     DETAIL     (chat)       (narrative)
        │           │
        ▼           ▼
     WATCH       SHARE
     (register)  (card)
```

---

## 3. DESIGN SYSTEM — ChatGPT / Claude-Inspired Principles

### Core philosophy
Every CRUX interaction is a **conversation about a property**. The UI must feel like you're talking to a brilliant real estate analyst who has perfect recall of 20+ government databases.

### Key patterns borrowed from ChatGPT/Claude

| Pattern | Implementation |
|---|---|
| **Command bar as hero** | Large, centered search input at the top of the dashboard |
| **Split panel** | Left sidebar (navigation) + main content (context-aware) |
| **Progressive disclosure** | Show high-level score first, drill into details on click |
| **Streaming responses** | Lens chat uses SSE — same pattern as ChatGPT's streaming |
| **Minimal chrome** | No heavy headers. Navigation collapses to icons on mobile |
| **Typewriter feel** | Animated text reveals for score explanations |
| **Glass-morphism cards** | Subtle backdrop-blur on property cards |
| **Green as the single accent** | `#22C55E` only on interactive elements and positive signals |

### Typography
- **Headings**: Inter (sans, variable weight 600-800)
- **Body**: Inter (sans, 400-500)
- **Accent quotes**: Instrument Serif italic
- **Code/data**: JetBrains Mono (monospace)
- **Spacing**: Generous. 24px base grid. Comfortable line-height (1.5).

### Color tokens (existing from `globals.css`)
```
crux-green:        #22C55E (primary accent, buttons, highlights)
crux-green-mid:    #16A34A (hover)
crux-green-dark:   #15803D
crux-green-tint:   #F0FDF4 (success bg, light accents)
crux-bg-primary:   #FFFFFF
crux-bg-secondary: #F9FAFB
crux-text-primary: #111827
crux-text-secondary: #6B7280
crux-text-muted:   #9CA3AF
crux-border:       #E5E7EB
```

---

## 4. PAGES & COMPONENTS — Complete Spec

### 4.1 App Shell (`/dashboard/layout.tsx`)

**The persistent wrapper for all authenticated pages.**

```
┌─────────────────────────────────────────────────────────┐
│ ┌──────────┐ ┌────────────────────────────────────────┐ │
│ │          │ │                                        │ │
│ │ SIDEBAR  │ │          MAIN CONTENT                  │ │
│ │          │ │          {children}                     │ │
│ │ Dashboard│ │                                        │ │
│ │ Lens     │ │                                        │ │
│ │ Reports  │ │                                        │ │
│ │ Settings │ │                                        │ │
│ │          │ │                                        │ │
│ │ ──────── │ │                                        │ │
│ │ UserBtn  │ │                                        │ │
│ └──────────┘ └────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Sidebar component** (`components/dashboard/Sidebar.tsx`):
- CRUX logo (collapsed to icon on mobile)
- Nav items: Dashboard (home icon), Properties (building), Reports (file-text)
- Bottom: Watch credits badge, UserButton
- Mobile: hamburger → slide-over drawer
- States: active nav item highlighted with green left-border + tint bg

**States:**
1. **Loading** — Skeleton sidebar (nav items as gray bars), main content skeleton
2. **Authenticated** — Full shell
3. **Not authenticated** — Redirect to /signin

---

### 4.2 Dashboard Home (`/dashboard/page.tsx`)

**The landing page after sign-in.**

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    Welcome, [Name]                       │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  🔍  Enter any address in India...         [→]    │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─ Recent Properties ─────────────────────────────┐   │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐         │   │
│  │ │ Property │ │ Property │ │ Property │         │   │
│  │ │ Card     │ │ Card     │ │ Card     │         │   │
│  │ │ Score:82 │ │ Score:64 │ │ Score:91 │         │   │
│  │ └──────────┘ └──────────┘ └──────────┘         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─ Quick Stats ───────────────────────────────────┐   │
│  │  [3] watch     [12] properties     [5] reports   │   │
│  │  credits        scored              generated     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Sub-components to build:**

#### `SearchHero.tsx`
- Large search input (48px height, rounded-2xl, shadow-lg)
- Animated placeholder: "Enter any address in India..." → "Paste a 99acres link..." → "Try: 2BHK Satellite, Ahmedabad"
- On submit: 
  1. Call `POST /crux/property` to ingest
  2. Call `GET /crux/score/:id` to get score
  3. Navigate to `/dashboard/properties/[id]`
- **States**: idle, typing (green border glow), submitting (loader + "Analyzing..."), error (inline error message)
- Uses existing `ChatInput.tsx` component

#### `RecentProperties.tsx`
- Horizontal scrollable card grid (desktop) / vertical stack (mobile)
- Each card shows: mini score gauge, address, city, date scored
- Click → navigate to `/dashboard/properties/[id]`
- **States**: loading (skeleton cards), empty ("Score your first property" CTA), populated
- Data from search history (currently no dedicated endpoint — use score fetch + local state initially, or build `GET /crux/searches`)

#### `QuickStats.tsx`
- 3 mini stat cards: Watch Credits, Properties Scored, Reports Generated
- Green icon + large number + small label
- **States**: loading (skeleton), loaded

#### `ComingSoonStrip.tsx`
- Horizontal strip: "CRUX Cast" (projected value) + "CRUX Yield" (rental yield) + "CRUX Watch" (alerts)
- Each card: dark gradient bg, icon, title, "Coming Soon" badge
- No interaction — purely informational

---

### 4.3 Property Detail (`/dashboard/properties/[id]/page.tsx`)

**The full scoring page for a single property.**

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Dashboard                                    │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  123, Satellite Road, Ahmedabad                   │  │
│  │  Ahmedabad, Gujarat · Residential                 │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─ CRUX Score ────────────────────────────────────┐   │
│  │                                                  │   │
│  │        ┌──────────┐                              │   │
│  │        │    82    │  Top 18% in area              │   │
│  │        │  /100    │  Balanced intent              │   │
│  │        └──────────┘                              │   │
│  │                                                  │   │
│  │  Location     ████████████░░  30%  ·  82         │   │
│  │  Developer    ██████████░░░░  20%  ·  78         │   │
│  │  Legal        ████████████░░  15%  ·  85         │   │
│  │  Market       ███████████░░░  10%  ·  72         │   │
│  │  Structural   ██████████░░░░  stub · 50         │   │
│  │  Risk         ████████░░░░░░   5%  ·  60         │   │
│  │                                                  │   │
│  │  Confidence: ████████████░░ 74%                   │   │
│  │  Data sources: MCA21, RERA, NHB RESIDEX, NASA VI│   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─ Actions ───────────────────────────────────────┐   │
│  │  [🔍 Lens Chat]  [📄 Full Report]  [🔗 Share]   │   │
│  │  [👁️ Watch]      [🔄 Recompute]                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Sub-components:**

#### `ScoreGauge.tsx`
- Large circular score gauge with green gradient arc
- Score number centered, label below
- Badge: "Top X% in area"
- Intent selector: yield / appreciation / balanced (pill buttons)
- **Props**: `score: CruxScore`
- **States**: loaded, recomputing (spinner on gauge)

#### `CategoryBreakdown.tsx`
- Vertical list of score categories
- Each row: label, weight %, animated bar, numeric score
- Bars colored by category health (green >70, yellow 50-70, red <50)
- Expand to show evidence/explanation on click
- **Props**: `breakdown: CruxScore.score_breakdown`, `weights: WeightAdjustments`
- **States**: loaded

#### `PropertyActions.tsx`
- Row of action buttons: Lens Chat, Report, Share Card, Watch, Recompute
- Each triggers the corresponding API call
- Watch button shows credits remaining
- Share opens modal with share link
- **Props**: `propertyId: string`
- **States**: idle, loading (per-action spinners), success (checkmark), error

#### `EvidencePanel.tsx`
- Expandable panel showing research & verification results
- Evidence cards with status: verified (green), contradicted (red), inconclusive (gray)
- "View Research Details" links
- **Props**: `research?: ResearchRunResult`, `verification?: VerificationRunResult`
- **States**: loading, empty ("No research data yet"), populated

---

### 4.4 Lens Chat (`/dashboard/lens/[propertyId]/page.tsx`)

**The conversational AI interface for property deep-dives.**

This is the most ChatGPT-like page. Layout:

```
┌─────────────────────────────────────────────────────────┐
│  ← Back    Property: 123 Satellite Road, Ahmedabad      │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │                                                  │  │
│  │  ┌──────────────────────────────────────────┐    │  │
│  │  │  AI: I've analyzed 123 Satellite Road.   │    │  │
│  │  │  The CRUX score is 82/100. What would you│    │  │
│  │  │  like to know about this property?       │    │  │
│  │  └──────────────────────────────────────────┘    │  │
│  │                                                  │  │
│  │  ┌──────────────────────────────────────────┐    │  │
│  │  │                    You: Any court cases?  │    │  │
│  │  └──────────────────────────────────────────┘    │  │
│  │                                                  │  │
│  │  ┌──────────────────────────────────────────┐    │  │
│  │  │  AI: Running legal verification...       │    │  │
│  │  │  (streaming)                              │    │  │
│  │  └──────────────────────────────────────────┘    │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Type your question...                     [📤]    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Lens chat behavior (SSE streaming):**
1. Page loads → call `POST /crux/lens/session` for the property
2. Chat input at bottom, messages scroll up
3. User sends message → `POST /crux/lens/:sessionId/message`
4. SSE chunks arrive:
   - `{ delta: "text", done: false }` → append text with typewriter effect
   - `{ done: true, module_result: { type: "score", data: {...} } }` → render module result inline
5. Tool results (score, report, research, verification) rendered as inline cards within the chat

**Sub-components:**

#### `LensChat.tsx`
- Full chat interface with message list + input
- **Props**: `propertyId: string`
- **States**: 
  1. **Creating session** — "Initializing analysis..."
  2. **Session active** — chat ready
  3. **Session expired** — "Session expired. Start a new one."
  4. **Streaming** — typewriter text, loading indicator
  5. **Error** — inline error in chat

#### `ChatMessage.tsx`
- Message bubble: AI (left-aligned, gray bg) or User (right-aligned, green bg)
- Timestamp below
- Markdown rendering for AI messages (bold, lists, links)
- **Props**: `role: "user" | "assistant"`, `content: string`, `timestamp: string`
- **States**: streaming (cursor blinking), complete

#### `ModuleResultCard.tsx`
- Inline card within chat for tool results
- Shows score gauge, report summary, or evidence findings
- **Props**: `type: "score" | "report" | "research" | "verification"`, `data: any`
- **States**: collapsible (expanded by default)

---

### 4.5 Report Page (`/dashboard/reports/[propertyId]/page.tsx`)

**Full narrative report display.**

```
┌─────────────────────────────────────────────────────────┐
│  ← Back                           Download  ·  Share     │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │                                                  │  │
│  │  CRUX Report: 123 Satellite Road, Ahmedabad       │  │
│  │  Generated: May 31, 2026 · Intent: Balanced       │  │
│  │                                                  │  │
│  │  ─────────────────────────────────────────────── │  │
│  │                                                  │  │
│  │  SUMMARY                                         │  │
│  │  This property scores 82/100, placing it in the   │  │
│  │  top 18% of comparable properties in Ahmedabad...│  │
│  │                                                  │  │
│  │  CATEGORY NARRATIVES                             │  │
│  │  ▸ Legal Compliance: [expanded]                   │  │
│  │  ▸ Location Quality: [collapsed]                  │  │
│  │  ▸ Developer Reliability: [collapsed]             │  │
│  │  ▸ Market Valuation: [collapsed]                  │  │
│  │  ▸ Demand Signals: [collapsed]                    │  │
│  │                                                  │  │
│  │  RISK FLAGS                                      │  │
│  │  ⚠ RERA registration expires in 45 days           │  │
│  │  ⚠ Adjacent property has pending litigation       │  │
│  │  ⚠ Area has 12% vacancy rate                     │  │
│  │                                                  │  │
│  │  POSITIVE SIGNALS                                │  │
│  │  ✅ Developer has 14 completed projects            │  │
│  │  ✅ Metro station under construction (500m)        │  │
│  │  ✅ 23% YoY appreciation in this micro-market      │  │
│  │                                                  │  │
│  │  RESEARCH HIGHLIGHTS                             │  │
│  │  ▸ Source: RERA Gujarat (May 2026)                │  │
│  │  ▸ Source: eCourts Case #AHM-2026-3421            │  │
│  │                                                  │  │
│  │  ─────────────────────────────────────────────── │  │
│  │  Disclaimer: This is not financial advice...      │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Sub-components:**

#### `ReportViewer.tsx`
- Full-page report layout with expandable sections
- **Props**: `report: CruxReportRow`
- **States**: loading, loaded, error, generating (if report doesn't exist yet)

#### `ReportSection.tsx`
- Collapsible section with title + expand/collapse
- Renders narrative text with bolded key phrases
- **Props**: `title: string`, `content: string`, `defaultExpanded?: boolean`

#### `RiskFlags.tsx`
- Vertical list of red flag items
- Each: warning icon + message
- **Props**: `flags: string[]`

#### `PositiveSignals.tsx`
- Vertical list of green check items
- Each: check icon + message
- **Props**: `signals: string[]`

---

### 4.6 Settings Page (`/dashboard/settings/page.tsx`)

**User profile and preferences.**

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Profile                                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Avatar    [UserButton]                          │  │
│  │  Name      Murtaza                               │  │
│  │  Email     user@example.com                       │  │
│  │  Plan      Free (3 watch credits)                 │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Account                                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Sign Out                      [Sign Out Button]  │  │
│  │  Delete Account                [Delete (disabled)] │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 5. DATA FLOW & API INTEGRATION

### Search → Score Flow
```
User types address
  → ChatInput.onSubmit()
    → POST /crux/property { address }
      ← { data: { id: UUID, address_raw, city, ... } }
    → GET /crux/score/:id?intent=balanced
      ← { data: { score_composite: 82, score_breakdown: {...}, ... } }
    → router.push(`/dashboard/properties/${id}`)
```

### Lens Chat Flow
```
User opens Lens for a property
  → POST /crux/lens/session { property_id }
    ← { data: { session_id, expires_at } }
  → Store sessionId in state
  → User types message
    → POST /crux/lens/:sessionId/message { message }
      ← SSE stream: data: {"delta":"text","done":false}
      ← data: {"delta":"text","done":true,"module_result":{"type":"score","data":{...}}}
    → Append deltas to message state
    → Render ModuleResultCard for tool results
```

### Report Flow
```
User clicks "Full Report" on property
  → GET /crux/report/:propertyId?intent=balanced
    ← { data: { summary, category_narratives, risk_flags, positive_signals, ... } }
  → Render ReportViewer
```

### Watch Flow
```
User clicks "Watch" on property
  → GET /crux/watch/credits (to show remaining)
  → POST /crux/watch/:propertyId
    ← { data: { watch_id, creditsRemaining, already_watching } }
  → Show success toast: "Watching this property. 2 credits remaining."
```

### Card Share Flow
```
User clicks "Share" on property
  → POST /crux/card/:propertyId?intent=balanced
    ← { data: { share_url: "https://crux.comfhutt.com/card/abc123" } }
  → Open share modal with copy link + social share buttons
```

---

## 6. COMPONENT TREE — Complete File Structure

```
apps/crux/src/
├── app/
│   └── dashboard/
│       ├── layout.tsx                    ← App shell (sidebar + main)
│       ├── page.tsx                      ← Dashboard home
│       ├── properties/
│       │   └── [id]/
│       │       └── page.tsx              ← Property detail
│       ├── lens/
│       │   └── [propertyId]/
│       │       └── page.tsx              ← Lens chat
│       ├── reports/
│       │   └── [propertyId]/
│       │       └── page.tsx              ← Full report
│       └── settings/
│           └── page.tsx                  ← Settings
├── components/
│   └── dashboard/
│       ├── Sidebar.tsx                   ← Navigation sidebar
│       ├── SearchHero.tsx                ← Dashboard search bar
│       ├── RecentProperties.tsx           ← Recent property cards
│       ├── PropertyCard.tsx              ← Single property card
│       ├── QuickStats.tsx                ← Stat cards row
│       ├── ComingSoonStrip.tsx           ← Cast/Yield/Watch preview
│       ├── ScoreGauge.tsx                ← Circular score gauge
│       ├── CategoryBreakdown.tsx         ← Score category bars
│       ├── PropertyActions.tsx           ← Action buttons row
│       ├── EvidencePanel.tsx             ← Research & verification
│       ├── LensChat.tsx                  ← Chat container
│       ├── ChatMessage.tsx               ← Single chat bubble
│       ├── ModuleResultCard.tsx           ← Inline tool result card
│       ├── ReportViewer.tsx              ← Report layout
│       ├── ReportSection.tsx             ← Collapsible section
│       ├── RiskFlags.tsx                 ← Risk flags list
│       ├── PositiveSignals.tsx           ← Positive signals list
│       └── ShareModal.tsx                ← Share link modal
├── hooks/
│   ├── useCruxUser.ts                    ← Existing (user profile)
│   ├── usePropertyScore.ts               ← NEW: fetch + cache score
│   ├── useLensSession.ts                 ← NEW: manage lens session
│   └── useSSEStream.ts                   ← NEW: SSE stream handler
└── lib/
    └── api/
        └── index.ts                      ← Existing (apiFetch, useCruxApi)
```

---

## 7. NEW HOOKS — Detailed Spec

### `usePropertyScore(propertyId: string)`
```ts
// Returns
{
  score: CruxScore | null;
  isLoading: boolean;
  error: string | null;
  recompute(): Promise<void>;
  intent: string;
  setIntent(intent: string): void;
}
```
- Fetches `GET /crux/score/:id?intent=X` on mount and on intent change
- Caches in component state (no duplicate fetches)
- `recompute()` calls `POST /crux/score/:id/compute?intent=X`
- Handles 404 (property not found → redirect)

### `useLensSession(propertyId: string)`
```ts
// Returns
{
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
  messages: ChatMessage[];
  sendMessage(text: string): Promise<void>;
  isStreaming: boolean;
  createNewSession(): Promise<void>;
}
```
- Creates session on mount via `POST /crux/lens/session`
- Manages message array in state
- `sendMessage()`: adds user message, calls SSE endpoint, processes stream
- SSE chunk handling:
  - Parse `data:` lines
  - Accumulate deltas into current AI message
  - On `done: true`, finalize message
  - On `module_result`, create ModuleResultCard entry
- Session TTL check (2h) — auto-recreate if expired

### `useSSEStream(url: string, body: any)`
```ts
// Returns
{
  chunks: SSEData[];
  isStreaming: boolean;
  error: string | null;
  abort(): void;
}
```
- Opens fetch with `Accept: text/event-stream`
- Reads ReadableStream, splits on `\n\n`
- Parses `data:` lines as JSON
- Supports abort via AbortController
- Handles connection errors with retry

---

## 8. EDGE CASES & ERROR HANDLING — Per Component

### General patterns
- **Loading state**: Gray skeleton placeholders matching the shape of loaded content
- **Empty state**: Friendly illustration + CTA ("Score your first property →")
- **Error state**: Inline error card with retry button, auto-retry on 5xx
- **401 unauthorized**: Redirect to /signin (handled by middleware + apiFetch)
- **Rate limited (429)**: Show "Too many requests. Try again in X minutes."

### Search bar
- **Empty input**: Button disabled
- **Invalid address (< 10 chars)**: Inline error "Address too short. Try: 2BHK Satellite, Ahmedabad"
- **Geocode failed**: "Could not find this address. Try a more specific one."
- **Property already scored**: Show existing score instead of recomputing

### Score gauge
- **Score < 30**: Red gradient arc, "High Risk" label
- **Score 30-60**: Yellow arc, "Caution" label
- **Score 60-80**: Light green arc, "Moderate" label
- **Score > 80**: Full green arc, "Strong" label
- **Confidence < 40%**: Show "Low confidence" badge with tooltip
- **Degraded score**: Show "Partial data" badge

### Lens chat
- **Session expired (2h)**: Auto-create new session, show "Previous session expired. Starting fresh."
- **30 message limit**: Show "Message limit reached for this session."
- **SSE connection lost**: Show "Connection lost. Retrying..." → auto-retry
- **Empty message**: Button disabled
- **Long message (> 2000 chars)**: Trim on client side before sending

### Report
- **Report not generated yet**: "Generate Report" CTA → triggers GET /crux/report/:id (generates on demand)
- **Report expired (24h TTL)**: Auto-refresh
- **Download**: Print-friendly CSS (no actual PDF generation yet — backend limitation)

### Share card
- **Copy link**: `navigator.clipboard.writeText()` with toast "Link copied!"
- **Card expired (90d)**: "Card has expired. Generate a new one."

### Watch
- **No credits**: Show "Upgrade to Pro for more watch credits"
- **Already watching**: Show "Already watching this property" with checkmark
- **Credit deduction failed**: Show error with retry

---

## 9. PERFORMANCE & SCALABILITY

### Client-side caching
- Scores cached in React state per property ID (no re-fetch on navigation back)
- Lens messages stored in state (no history re-fetch on remount)
- Search history stored in localStorage for offline access

### Optimistic updates
- Watch registration: optimistically show "Watching" before API response
- Score recompute: show spinner immediately, replace with new score on response

### Bundle optimization
- Heavy components (ReportViewer, LensChat) lazy-loaded via `next/dynamic`
- Icon imports: use dynamic imports or tree-shake lucide-react
- Framer Motion: use `LazyMotion` + `domAnimation` for reduced bundle

### Accessibility
- All interactive elements: `focus-visible:ring-2 focus-visible:ring-crux-green/50`
- Score gauge: `role="meter"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Chat messages: `role="log"` with `aria-live="polite"`
- Keyboard navigation: Tab through all actions, Enter to submit

---

## 10. IMPLEMENTATION ORDER — Build Sequence

### Phase 1 — Foundation (files to create first)
1. `usePropertyScore.ts` — Score fetch hook
2. `useSSEStream.ts` — SSE stream handler
3. `useLensSession.ts` — Lens session hook
4. `Sidebar.tsx` — Navigation shell
5. `dashboard/layout.tsx` — App shell with sidebar

### Phase 2 — Dashboard Home
6. `SearchHero.tsx` — Search bar (reuse ChatInput)
7. `PropertyCard.tsx` — Property card
8. `RecentProperties.tsx` — Recent properties grid
9. `QuickStats.tsx` — Stats row
10. `ComingSoonStrip.tsx` — Coming soon cards
11. `dashboard/page.tsx` — Dashboard home page

### Phase 3 — Property Detail
12. `ScoreGauge.tsx` — Score gauge
13. `CategoryBreakdown.tsx` — Category breakdown
14. `PropertyActions.tsx` — Action buttons
15. `EvidencePanel.tsx` — Evidence panel
16. `dashboard/properties/[id]/page.tsx` — Property detail page

### Phase 4 — Lens Chat
17. `ChatMessage.tsx` — Chat message bubble
18. `ModuleResultCard.tsx` — Tool result card
19. `LensChat.tsx` — Chat container
20. `dashboard/lens/[propertyId]/page.tsx` — Lens chat page

### Phase 5 — Report & Sharing
21. `RiskFlags.tsx` — Risk flags
22. `PositiveSignals.tsx` — Positive signals
23. `ReportSection.tsx` — Collapsible section
24. `ReportViewer.tsx` — Report layout
25. `ShareModal.tsx` — Share modal
26. `dashboard/reports/[propertyId]/page.tsx` — Report page

### Phase 6 — Polish
27. `dashboard/settings/page.tsx` — Settings page
28. Loading skeletons for all components
29. Error boundaries for all pages
30. Mobile responsive pass

---

## 11. PROMPT FOR AI COMPONENT GENERATOR

When generating each component, use this prompt template:

```
## COMPONENT PROMPT: [Component Name]

### Purpose
[One sentence: what this component does]

### Visual Design
- Follow CRUX design tokens: bg-white, text-crux-text-primary, accent #22C55E
- Typography: Inter for body/headings, Instrument Serif italic for quotes, JetBrains Mono for data
- Spacing: 24px grid, comfortable padding, generous whitespace
- Inspiration: Claude/ChatGPT minimalism — no unnecessary borders, clean typography, subtle shadows

### Layout
[ASCII layout diagram showing placement within parent]

### Props Interface
```ts
interface [ComponentName]Props {
  // TypeScript interface
}
```

### States
| State | Visual | Behavior |
|---|---|---|
| Loading | [description] | [behavior] |
| Empty | [description] | [behavior] |
| Loaded | [description] | [behavior] |
| Error | [description] | [behavior] |

### Data Dependencies
- API endpoint: `[method] [path]`
- Response shape: [type reference]

### Interactions
- Click: [what happens]
- Hover: [visual change]
- Focus: [accessibility]

### Edge Cases
- [edge case 1]
- [edge case 2]

### Accessibility
- Semantic HTML: [what elements]
- ARIA: [what attributes]
- Keyboard: [navigation]
- Screen reader: [announcements]

### Animations
- Entrance: [framer motion config]
- Hover: [CSS transition]
- State change: [transition]

### File Location
`apps/crux/src/components/dashboard/[ComponentName].tsx`

### Tech Stack
- React 19, TypeScript, Next.js 16 App Router
- Tailwind CSS v4, tw-animate-css
- Framer Motion v12
- Lucide React icons
- @clerk/nextjs v7 (useAuth, useUser)
- Custom hooks: useCruxUser, usePropertyScore, useLensSession, useSSEStream
- API client: apiFetch from @/lib/api
```

---

## 12. BACKEND GAPS — What Needs Building Before Frontend Can Work

| Gap | Priority | What to build |
|---|---|---|
| No search history endpoint | **HIGH** | `GET /crux/searches` — returns recent searches for logged-in user with score snapshots |
| Dashboard placeholder | Low | Not needed. Frontend composes from existing endpoints |
| Cast/Yield | Low | Keep "Coming Soon" |

**Immediate need for Phase 1:** The `GET /crux/searches` endpoint. Without it, `RecentProperties.tsx` has no data source. Workaround: store search history client-side in localStorage until the backend endpoint exists.

---

## 13. FINAL NOTES

- Every page is a Server Component. All interactive pieces are Client Components.
- Use `next/dynamic` with `ssr: false` for the Lens chat (SSE doesn't SSR).
- The sidebar uses `usePathname()` for active state.
- All API calls go through `useCruxApi()` hook for consistent auth token handling.
- Score data is cached in React state per property ID — no duplicate API calls.
- The Lens chat uses `AbortController` for SSE cleanup on unmount.
- All error states show a "Retry" button.
- Mobile: sidebar collapses to hamburger, cards stack vertically, score gauge shrinks.

