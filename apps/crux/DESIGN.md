# CRUX design system

Source of truth for tokens: `src/app/globals.css`. This file explains how to use them.

## Idea

CRUX reads public records about land. The interface borrows from the survey sheet:
plot rails, parcel corners, registry type. That motif is the one bold element —
everything else stays quiet.

## Colour

| Role | Token | Value |
|---|---|---|
| Paper (page) | `--color-crux-bg-primary` | `#FAFAFA` |
| Surface | white | `#FFFFFF` |
| Ink (text) | `--color-crux-text-primary` | `#09090B` |
| Secondary text | `--color-crux-text-secondary` | `#52525B` |
| Muted text | `--color-crux-text-muted` | `#6B7280` |
| Emerald (the one accent) | `--color-crux-green` | `#10B981` |
| Emerald as text on light | `--color-crux-green-dark` | `#047857` |
| Forest ink (dark surface) | `--color-crux-ink` | `#022C22` |
| Hairline | `--color-crux-line` | 8% ink |

Rules:
- One green. Never `#22C55E`, `#16A34A`, or Tailwind `green-*`.
- Emerald `#10B981` is a fill or a mark, never text on a light surface: it measures
  2.54:1 on white, under even the large-text threshold. Green **text** on light uses
  `--color-crux-green-dark` (5.87:1) at every size; on forest ink it uses `#6EE7B7`.
- Muted text (`#6B7280`) is for white and paper only. On `--color-crux-bg-secondary`
  it drops to 4.39:1 — use secondary text there.
- Text on an emerald fill is forest ink (`--color-crux-ink`), never white.
- Dark sections are forest ink via `.surface-ink`, never neutral black.
- Red `#EF4444` and amber `#F59E0B` are reserved for risk states in data.

## Type

| Role | Class | Face |
|---|---|---|
| Hero headline | `.t-display` | Inter 700–800 |
| Section headline | `.t-h2` | Inter 700 |
| Card / sub headline | `.t-h3` | Inter 600 |
| Lead paragraph | `.t-lead` | Inter 400 |
| Label above a heading | `.t-eyebrow` | JetBrains Mono, tracked caps |
| Taglines, quotes | `.t-voice` | Instrument Serif italic |
| Figures in tables and data rows | `.t-num` | JetBrains Mono, tabular |

Standalone display numbers (the proof strip, the problem cards) stay in Inter with
proportional figures — they are read one at a time, not compared down a column.

Body copy is 15–17px Inter at 1.55–1.65 line height, max ~62 characters wide.
Use the font variables (`font-sans`, `font-mono`, `.t-voice`) — never a literal
`fontFamily: "Inter"` or `"monospace"`.

## Layout

- `.crux-container` — 1200px max, fluid gutter. Every section's content sits in one.
- `.crux-frame` on a `<section>` draws the two plot rails, the boundary line across
  the top, and a crosshair at each corner. `.crux-frame--bare` drops the top line.
- Section padding: `py-24 md:py-36` (small sections `py-20 md:py-28`).
- Section header: eyebrow → 20px → `.t-h2` → 20px → `.t-lead`.

## Shape and depth

| Element | Radius | Class |
|---|---|---|
| Inputs, buttons in cards, small tiles | `--radius-control` 10px | |
| Cards | `--radius-card` 14px | `.surface-card` |
| Large panels, mockups | `--radius-panel` 20px | `.surface-panel` |
| Chips, primary CTA | pill | `.crux-chip`, `.btn-crux` |

A surface is a 1px border plus one `--shadow-premium-*`. No stacked borders, no
glow except on hover of a primary action.

## Actions

- `.btn-crux` primary; `.btn-crux--sm`, `.btn-crux--block` (full width, 10px radius),
  `.btn-crux--outline` secondary.
- `.surface-lift` gives a card its hover response. Only on things that are clickable.

## Motion

- One curve: `--ease-crux` / `[0.16, 1, 0.3, 1]`. Durations 0.2s (state), 0.5–0.7s (reveal).
- Animate `transform` and `opacity` only.
- A section reveals once, as a group, when it enters view. Not every card on its own.
- Motion that carries meaning stays: a gauge drawing to its value, a bar filling to
  its weight, a chat reply arriving.
- Every animation has a `prefers-reduced-motion` path that shows the final state:
  wrap a landing section in `<MotionConfig reducedMotion="user">`, and use
  `@/hooks/useReducedMotion` where the rendered content itself differs.

### Motion graphics

The page behaves like an instrument reading a record. Each piece below says
something about the product; none is decoration for its own sake.

| Piece | Where | What it shows |
|---|---|---|
| `SurveyCrosshair` | hero | Hairlines and a lit patch of grid follow the cursor — picking one parcel out of a sheet |
| Reading sequence (`.anim-scan`, `.anim-stamp`) | hero example card | A line reads the card, verdicts file in, the grade stamps down. Plays when the card scrolls into view |
| `DotMatrix` + `CountUp` | problem cards | The percentage as a hundred marks, filling while the figure counts |
| Step line | how it works | Drawn by scroll; each step inks in as the line reaches it |
| `useSpotlight` + `.crux-spotlight` | ink panels, plan cards | A soft light follows the pointer across a surface |
| `.crux-row` / `.crux-row-tile` | registers | A row's code tile inks in on hover |
| `ScrollProgress` | page | Reading progress along the top edge |
| Frame draw | every `.crux-frame` | Boundary lines draw outward as a section arrives (scroll-driven CSS, progressive) |

Rules for adding more:
- `CountUp` is for below-the-fold figures only. Above the fold the reader would see the
  final number, then a reset.
- Anything that hides content before it animates must have a visible server-rendered
  state (see the `static / armed / play` phases in `HeroSection`).
- Pointer effects are for fine pointers only and must do nothing on touch.
- Staggering many small elements: use CSS transitions with a delay, not one
  framer-motion node each.

