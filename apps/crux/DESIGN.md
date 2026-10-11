# CRUX brand and design guidelines

This is the fixed design system for every CRUX screen: the marketing pages, auth,
the grading flow, the dashboard, the legal pages, and anything built later.

- **Tokens and classes** live in `src/app/globals.css`. That file is the source of truth for values.
- **This document** says how to use them and why.
- **`pnpm design:check`** enforces the parts a machine can check. It runs in CI and fails the build on a violation.

If this document and `globals.css` disagree, `globals.css` is right and this document has a bug.

---

## 1. The idea

CRUX reads the public record about land and tells a buyer what it says. The
interface borrows from the survey sheet and the register: plot rails, parcel
corners, ruled ledgers, a grade that lands like a stamp.

Three principles follow from that.

1. **A record, not a brochure.** Layouts are ruled and aligned. Content sits in registers and ledgers, not in a scatter of floating cards.
2. **One loud thing per screen.** Forest ink, the emerald fill and the serif voice are strong. Each screen spends them once.
3. **Nothing claims more than the data does.** Illustrations are labelled as illustrations. A missing number is a dash, never a zero. Colour that means risk is never used as decoration.

---

## 2. Colour

### Core palette

| Role | Token | Value | Use |
|---|---|---|---|
| Paper | `--color-crux-bg-primary` | `#FAFAFA` | Page background |
| Surface | — | `#FFFFFF` | Cards, panels, inputs |
| Sunken | `--color-crux-bg-secondary` | `#F3F4F6` | Disabled fills, inset notes |
| Ink | `--color-crux-text-primary` | `#09090B` | Headings, primary text |
| Secondary text | `--color-crux-text-secondary` | `#52525B` | Body copy |
| Muted text | `--color-crux-text-muted` | `#6B7280` | Captions, helper lines |
| Border | `--color-crux-border` | `#E4E4E7` | Card and input borders |
| Hairline | `--color-crux-line` | ink at 8% | Rules, rails, dividers |

### Green

There is one green. Everything else in the family is a shade of it with a job.

| Token | Value | Job |
|---|---|---|
| `--color-crux-green` | `#10B981` | **The brand green.** Fills, marks, icons, progress. Never text on a light surface. |
| `--color-crux-green-bright` | `#34D399` | Hover state of an emerald fill |
| `--color-crux-green-mid` | `#059669` | Fine marks: crosshairs, focus outlines, dots |
| `--color-crux-green-dark` | `#047857` | **Green text on light surfaces**, at every size |
| `--color-crux-green-deep` | `#064E3B` | Body text on the emerald tint |
| `--color-crux-green-tint` | `#ECFDF5` | Tinted fills: tiles, notes, the emphasis card |
| `--color-crux-mint` | `#6EE7B7` | Green text and icons **on forest ink** |

### Forest ink (the dark surface)

| Token | Value | Use |
|---|---|---|
| `--color-crux-ink` | `#022C22` | Dark sections and panels; text on emerald fills |
| `--color-crux-ink-raised` | `#06392D` | A card sitting on ink |
| `--color-crux-ink-text` | `#ECFDF5` | Primary text on ink |
| `--color-crux-ink-muted` | ink-text at 64% | Secondary text on ink |
| `--color-crux-ink-line` | ink-text at 12% | Borders and rules on ink |

Apply `.surface-ink` to a container. It re-points the semantic colours, so the
rails, borders and chips inside it invert without per-element overrides.

### Data and state colour

These carry meaning. They are never used for decoration, emphasis or branding.

| Meaning | Token / source | Value |
|---|---|---|
| Error, adverse | `--color-crux-danger` | `#DC2626` |
| Error on a tint | `--color-crux-danger-dark` on `--color-crux-danger-tint` | `#B91C1C` on `#FEF2F2` |
| Error border | `--color-crux-danger-line` | `#FECACA` |
| Caution | `--color-crux-warning` | `#B45309` |
| Grade bands A / B / C / D / NR | `src/lib/grade.ts` | green / blue / amber / red / grey |

Grade colours come from `gradeBand()` in `lib/grade.ts` and nowhere else. Do not
re-create a letter-to-colour table in a component.

### Contrast (measured, WCAG 2.1)

Body text needs 4.5:1. Large text (24px+, or 19px+ bold) needs 3:1.

| Pair | Ratio | Verdict |
|---|---|---|
| Ink on paper | 19.1 | Pass |
| Secondary text on paper / white | 7.4 / 7.7 | Pass |
| Muted text on white / paper | 4.8 / 4.6 | Pass |
| Muted text on sunken (`bg-secondary`) | 4.4 | **Fail.** Use secondary text there |
| Green-dark on white / tint | 5.5 / 5.2 | Pass |
| **Emerald `#10B981` on white** | **2.5** | **Fail at every size.** Never text |
| **White on emerald** | **2.5** | **Fail.** Text on emerald is forest ink |
| Forest ink on emerald / bright | 6.0 / 7.9 | Pass |
| Ink-text on ink | 14.4 | Pass |
| Ink-muted on ink / raised | 6.7 / 5.9 | Pass |
| Mint on ink / raised | 9.9 / 8.5 | Pass |
| Danger on white | 4.8 | Pass |

### Colour rules

- One green: `#10B981`. Never `#22C55E`, `#16A34A`, or Tailwind's `green-*` / `emerald-*` scales.
- Emerald is a fill or a mark. Green **text** is `green-dark` on light, `mint` on ink.
- Text on an emerald fill is forest ink, never white.
- A dark surface is forest ink, never neutral black.
- No raw hex in a component. If a colour is missing, add a token here and in `globals.css` first.

---

## 3. Typography

Three faces, loaded in `src/app/layout.tsx`. No others.

| Face | Variable | Role |
|---|---|---|
| Inter | `font-sans` | Everything by default |
| Instrument Serif (italic) | `.t-voice` | The brand's spoken voice |
| JetBrains Mono | `font-mono` | Records, codes, labels, tabular figures |

### Type roles

| Role | Class | Size | Weight / tracking |
|---|---|---|---|
| Hero headline | (inline, hero only) | 36 → 88px | 800, −0.045em, line-height 0.96 |
| Display | `.t-display` | 44 → 88px | 700, −0.045em |
| Section headline | `.t-h2` | 32 → 56px | 700, −0.035em, line-height 1.02 |
| Sub headline | `.t-h3` | 20 → 26px | 600, −0.02em |
| Lead paragraph | `.t-lead` | 16 → 19px | 400, line-height 1.55 |
| Body | — | 15–17px | 400, line-height 1.6–1.7 |
| Small body | — | 13–14px | 400, line-height 1.5 |
| Caption | — | 11–12px | 400 |
| Label | `.t-eyebrow` | 11px | Mono 500, caps, 0.16em |
| Voice | `.t-voice` | 22 → 48px | Serif italic 400 |
| Tabular figure | `.t-num` | inherits | Mono, tabular-nums |

### Type rules

- **Every section headline is `.t-h2`.** One scale across the product is what makes two pages feel like one site.
- **`.t-voice` is for a line the brand is saying in its own voice**: a tagline, a promise, a quote. One per section at most. Never for a heading or for data.
- **Mono is for things that are records**: registry names, module codes, method hashes, labels. Not for decoration.
- **Figures.** A column of values a reader compares uses `.t-num`. A standalone display number (a proof-strip counter, a percentage) stays in Inter with proportional figures.
- **Line length.** Body copy runs 45–78 characters. Cap paragraphs with `max-w-[..ch]`; do not let a 13px paragraph span a 900px column.
- **Minimums.** Body 13px. Captions 11px. Nothing a reader must read below 10px. Inputs are 16px so iOS does not zoom.
- Use `text-balance` on headings and `text-pretty` on paragraphs.
- Never a literal `fontFamily`. Use `font-sans`, `font-mono` or `.t-voice`.

---

## 4. Layout and spacing

### Grid

- **`.crux-container`** — 1200px max width with a fluid gutter (20px on phones, 40px on desktop). Every section's content sits in one.
- **`.crux-frame`** on a `<section>` draws the two plot rails, the boundary line across the top and a crosshair at each corner. `.crux-frame--bare` drops the top line (use it on the first section of a page).
- **`.crux-plot`** — the faint parcel lattice. Use it behind a hero or inside an ink panel, never behind body text on a light surface.

### Spacing scale

Tailwind's 4px scale. In practice:

| Use | Value |
|---|---|
| Section padding (vertical) | `py-24 md:py-36`; compact sections `py-20 md:py-28` |
| Eyebrow → heading | 16–20px |
| Heading → lead | 20–24px |
| Header block → content | 56–64px (`mt-14 md:mt-16`) |
| Card padding | 28px, 32–36px at `md` (`p-7 md:p-9`) |
| Dense row padding | 20–24px |
| Gap between cards | 16–20px |

### Structure

- **Registers over card grids.** A set of like items (modules, steps, stats) is one bordered block divided by hairlines (`gap-px` on a `bg-crux-border` grid), not a row of separate shadowed cards.
- **Alignment.** Marketing headers are centred. App screens and long-form text are left-aligned. Do not mix within a section.
- **Orphans.** When a grid's last row is short, widen its items to fill the row (see `spanClass` in `PricingSection`).

---

## 5. Shape, borders and depth

| Element | Radius | Class |
|---|---|---|
| Inputs, small tiles, block buttons | `--radius-control` (10px) | |
| Cards | `--radius-card` (14px) | `.surface-card` |
| Panels, mockups, ink blocks | `--radius-panel` (20px) | `.surface-panel` |
| Chips, primary action | pill | `.crux-chip`, `.btn-crux` |

Shadows are forest-tinted and layered. Use the tokens; never Tailwind's stock `shadow-md`.

| Token | Use |
|---|---|
| `--shadow-premium-sm` | Cards at rest |
| `--shadow-premium-md` | Panels, the search field |
| `--shadow-premium-lg` | The one raised object in a section |
| `--shadow-premium-glow` | Hover or focus of a primary action only |

A surface is **one border plus one shadow**. No stacked borders, no ring-plus-border, no glow at rest.

---

## 6. Components

### Actions

| Class | Use |
|---|---|
| `.btn-crux` | Primary action. Emerald pill, forest-ink text |
| `.btn-crux--sm` | Compact (nav). 36px for a mouse, 44px for a finger |
| `.btn-crux--block` | Full width, 10px radius (forms, plan cards) |
| `.btn-crux--outline` | Secondary action. White fill, green-dark text |

One primary action per view. Label it with what it does ("Grade a project"), not "Submit". An unavailable action is not a disabled button: say where it stands and give the reader somewhere to go.

### Surfaces

| Class | Use |
|---|---|
| `.surface-card` | Standard card |
| `.surface-panel` | Larger, more raised container |
| `.surface-ink` | Forest-ink section, panel or featured card |
| `.surface-lift` | Hover lift. Only on a surface that is itself clickable |
| `.crux-spotlight` (+ `useSpotlight`) | Pointer-tracked light. Ink panels and featured cards |

### Small parts

| Class | Use |
|---|---|
| `.crux-chip` | Tag or status pill. Inverts on ink automatically |
| `.t-eyebrow` | Label above a heading, column heads, badges |
| `.crux-row` + `.crux-row-tile` | A register row whose code tile inks in on hover |

### Forms

- Field: white fill, 1px `--color-crux-border`, `--radius-control`, min-height 48px, 16px text.
- Focus: emerald border and a 4px `rgba(16,185,129,0.16)` ring. Never remove the focus outline without replacing it.
- Error: `--color-crux-danger` border and message below the field. State what is wrong and how to fix it.
- Label: `.t-eyebrow` in secondary text, above the field. Every input has a label or an `aria-label`.

### The CRUX mark

- The wordmark is **CRUX** in Inter 700–800, tracking −0.02 to −0.03em, in ink (or ink-text on forest).
- The endorsement is "by" plus the ComfHutt logo (`/comfhutt-logo.svg`) at reduced opacity, baseline-aligned, about a third of the wordmark's height.
- On forest ink the ComfHutt logo is rendered light with `brightness-0 invert`. Do not recolour it any other way.
- Do not set the wordmark in the serif, in emerald, or in lowercase.

---

## 7. Motion

One curve: `--ease-crux`, `cubic-bezier(0.16, 1, 0.3, 1)` (in framer-motion, `ease: [0.16, 1, 0.3, 1]`).
Durations: 0.2s for a state change, 0.5–0.7s for a reveal.

### Rules

- Animate `transform` and `opacity`. Name the properties; never `transition-all`.
- A section reveals **once, as a group**, when it enters view. Not every card on its own.
- Motion that carries meaning stays: a line being drawn, a count, a stamp landing.
- **The LCP element never fades in.** The hero headline uses `.anim-rise` (transform only) so it paints with the first frame.
- Anything hidden before it animates must have a visible server-rendered state (see the `static / armed / play` phases in `HeroSection`).
- Pointer effects are for fine pointers only and do nothing on touch.
- Staggering many small elements: CSS transitions with a delay, not one framer-motion node each.
- **Reduced motion.** Wrap an animated section in `<MotionConfig reducedMotion="user">`. CSS animations are switched off in the `prefers-reduced-motion` block in `globals.css`. Under reduced motion every element shows its final state.

### The motion set

| Piece | Where | What it shows |
|---|---|---|
| `SurveyCrosshair` | hero | Hairlines and a lit patch of grid follow the cursor |
| Reading sequence (`.anim-scan`, `.anim-stamp`) | hero example card | A line reads the card, verdicts file in, the grade stamps down |
| `DotMatrix` + `CountUp` | problem cards | A percentage as a hundred marks, filling while the figure counts |
| Step line | how it works | Drawn by scroll; each step inks in as the line reaches it |
| `useSpotlight` + `.crux-spotlight` | ink panels, plan cards | Light follows the pointer across a surface |
| `ScrollProgress` | page | Reading progress along the top edge |
| Frame draw | every `.crux-frame` | Boundary lines draw outward as a section arrives |

`CountUp` is for figures below the fold only. Above it the reader would see the final number, then a reset.

---

## 8. Responsive

Every screen must hold from **320px to 2560px** with no horizontal scroll.

### Breakpoints (Tailwind defaults)

| Name | Min width | Typical change |
|---|---|---|
| base | 0 | One column. Stacked. |
| `sm` | 640px | Wider gutters, 2-up for small items |
| `md` | 768px | Two and three column grids, desktop type sizes |
| `lg` | 1024px | Split layouts (auth), 6-track pricing grid |
| `xl` | 1280px | Extra gutter only |

### Rules

- Design the phone layout first. Add columns going up; do not hide content going down.
- Type sizes that span a wide range use `clamp()`, not a breakpoint jump.
- **Tap targets are 44px** on touch. A link or button in a list uses `min-h-11`; the input itself, not only its box, is the target.
- **Text wraps; it does not truncate.** `truncate` on a label hides information on exactly the screens with the least room.
- Text keeps a 16–20px gutter from the screen edge. `.crux-container` provides it.
- A flex row that holds text gives the text child `min-w-0`.
- Decorative oversize type is sized in container units (`cqw`) inside an `overflow-hidden` wrapper, so it cannot push the page sideways.
- Check landscape phones (667×375, 844×390): a two-column layout that works at 768 portrait can be too tight at 667 landscape.

### The test matrix

A change to a public page is checked at these 24 sizes before it ships:

`320×568` · `344×882` · `360×640` · `360×800` · `375×667` · `390×844` · `412×915` · `430×932` · `480×854` · `540×720` · `600×960` · `667×375` · `768×1024` · `820×1180` · `844×390` · `912×1368` · `1024×768` · `1180×820` · `1280×720` · `1366×768` · `1440×900` · `1536×864` · `1920×1080` · `2560×1440`

At each: no page overflow, nothing outside the viewport, no text spilling its box, no truncated label, no text under 10px, 44px tap targets on phone widths, and nothing left hidden under reduced motion.

---

## 9. Accessibility

- Contrast: 4.5:1 for text, 3:1 for large text and for the boundary of a control. Use the table in section 2.
- Focus: every interactive element has a visible `:focus-visible` state. `globals.css` sets a default; do not remove it.
- Decorative graphics (plot grid, crosshair, dot fields, oversize wordmark) are `aria-hidden`.
- A number shown as a graphic also exists as text.
- Order and headings: one `h1` per page, headings in order, lists as lists.
- Reduced motion is honoured everywhere (section 7).
- Colour is never the only signal. A grade has a letter; a risk state has a label.

---

## 10. App screens (dashboard and signed-in pages)

The same tokens, type and components apply. What changes is density.

- **Background** is paper. Content cards are `.surface-card`; the one summary or grade panel on a screen may be `.surface-panel`.
- **Forest ink is rare in the app.** At most one ink element per screen (a plan card, a primary summary). The sidebar is light.
- **Headings.** Page title `.t-h3` scale or a 28–32px heading; card titles 15–17px semibold. `.t-h2` is for marketing sections, not app chrome.
- **Density.** Card padding 20–24px. Row height 44–52px. Body 14px, captions 12px.
- **Data.** Tables and value columns use `.t-num`. Grade chips come from `gradeBand()`.
- **Voice.** `.t-voice` appears at most once per screen, for an empty state or a summary line. Not in tables.
- **Empty, loading and error states** are designed, not left blank: say what is missing and offer the next action. A skeleton matches the shape of what will load.
- **Motion** is state feedback: a value updating, a panel opening. No scroll-driven or decorative motion inside the app.

---

## 11. Do and don't

| Do | Don't |
|---|---|
| Use a token for every colour | Paste a hex into a class |
| Put green text in `green-dark` | Set text in `#10B981` |
| Put forest ink on an emerald button | Put white on an emerald button |
| Group like items in one hairline register | Float six identical shadowed cards |
| Use one ink block per screen | Alternate dark and light sections |
| Let labels wrap | Truncate them |
| Reveal a section once, as a group | Fade up every card |
| Mark an illustration as an illustration | Show invented numbers as output |
| Add the token first, then use it | Invent a one-off value in a component |

---

## 12. Before you ship a screen

1. `pnpm design:check` passes.
2. `npx tsc --noEmit` and the lint gate pass.
3. Every colour, radius and shadow is a token.
4. Headings use the type roles; one `h1`.
5. Checked at the 24 sizes in section 8, or at least 320, 390, 667×375, 768, 1024, 1440 and 2560.
6. Keyboard: every control reachable, focus visible.
7. Reduced motion: nothing hidden, nothing moving.
8. Contrast checked against the table in section 2 for any new colour pair.

## Changing the system

A new colour, radius, shadow or type role is added to `globals.css` and to this
document in the same commit, then used. If `design:check` blocks a change that
is right, change the rule in `scripts/design-system-guard.mjs` deliberately and
say why in the commit. Do not raise a number in `scripts/.design-baseline.json`.
