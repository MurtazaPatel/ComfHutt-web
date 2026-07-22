# CRUX Frontend Revamp Brief — Handoff to Claude Code

**Owner:** Murtaza Patel · ComfHutt Technologies
**Date:** July 15, 2026
**Scope:** Landing page (crux.comfhutt.com) restructure, showcase conversion system, and copy realignment.
**Depends on:** `SEMI_LAUNCH_BRIEF.md` — Workstream 2 (anonymous scoring + abuse controls) is a hard dependency for the hero input box. Workstream 3 (pricing UI) and Workstream 4 (SEO) live in that brief; coordinate, don't duplicate.
**Design north star:** As minimal as ChatGPT/Claude. One primary action per screen. Generous whitespace. Fast on mid-range Android over 4G. Brand system: primary #22C55E, light cream #FAFAF8 surfaces, #1A1A1A text, white cards, Cormorant Garamond + DM Sans + DM Mono. Never #2B0AFF.

---

## Operating instructions for Claude Code

1. ANALYZE FIRST. Map the current landing page component tree, section order, copy sources (hardcoded vs config), and shared components. Produce a written plan; no code until approved.
2. One task at a time after approval, each with an explicit do-not-touch list.
3. All copy in this brief is FINAL unless marked OPEN DECISION. Implement it verbatim; do not paraphrase, do not invent alternative copy.
4. Everything must pass Core Web Vitals on mobile. If a section can't be made fast, simplify or cut it.

---

## A1. Hero becomes the product

Replace the current hero (headline + /signin CTA + badges + ticker) with exactly four elements:

1. **Headline:** "Know the truth about any property. In 90 seconds."
2. **Subline:** "Court cases, builder history, fair price — one score, before you pay a rupee."
3. **Large address/project input box** — the primary element on the page. Submitting runs the anonymous scoring flow (SEMI_LAUNCH_BRIEF Workstream 2). Placeholder text: "Type a project name or address in Gujarat…"
4. **Showcase chip row** directly under the input (spec in A2), followed by trust line: "Free · No signup · 3 reports"

Nav CTA changes: "Get Started →" (currently → /signin) becomes **"Score a property"** and scroll-focuses the hero input.

**Gate:** the live input must NOT ship before Workstream 2's rate limiting + quota controls are deployed. If frontend is ready first, ship behind a feature flag with the input in a disabled "coming this week" state and chips fully active (chips are cached; they carry no pipeline risk).

## A2. Flagship Showcase System (the conversion engine)

**Concept:** 2–3 tappable chips of famous, recently talked-about Gujarat properties, each opening a fully pre-built, manually QA'd flagship CRUX report. Zero friction, zero signup, instant proof.

**Chip row label:** "This week's verdicts:"

**Property selection criteria (marketing/founder selects; component must read from a config file or DB table, never hardcoded):**
- High name recognition in Ahmedabad / Surat / Rajkot, ideally with recent launch buzz or news presence.
- **Mandatory score mix — this is strategy, not preference: one HIGH (85+), one MID (60–75), one RED-FLAG (visible adverse signal, e.g. active litigation or fund-utilization concern).** Rationale: three high scores read as advertising; the contrast proves independence. The red-flag report is the shareable asset.
- Chips rotate on the weekly Verdict content cadence via config change, no deploy.

**Flagship report requirements:**
- Deepest available data, all six dimensions populated, every claim evidence-linked to its government source (case number, RERA filing, MCA record) with visible source links.
- The RED-FLAG report gets extra scrutiny: every adverse claim triple-verified, templated language only (no LLM free-text about the named builder), and explicit founder sign-off before go-live. It will be screenshotted and possibly disputed — it must be bulletproof.
- Lens pre-warmed with 3 suggested questions per property (e.g. "Why did this score 64?", "What are the court cases about?", "Is the listed price fair?").
- Showcase views DO NOT consume the visitor's 3-report quota. They are cached; treat as static content with dynamic feel.

**Presentation (the "impressed" moment, performance-safe):**
- Score count-up animation: 0 → final score over ~1.5s with easing, ring/gauge fill in sync. CSS/rAF only — no heavy animation libraries, no WebGL, no Lottie.
- Staggered reveal of report sections on scroll (CSS transitions + IntersectionObserver).
- The score reveal is the screenshot moment: the share-card button ("Share this verdict") animates in immediately after the count-up completes.

**Conversion mechanics (deliberate — implement exactly this, no signup walls on showcase content):**
- Persistent CTA inside every showcase report (sticky bottom bar on mobile, inline card on desktop): **"Now score YOUR property — 3 free reports"** → returns to and focuses the hero input.
- Account-gated actions inside the report, shown but locked with a one-line reason: **"Watch this property"** ("Free account — get alerts when anything changes") and **"Download PDF dossier"** (Pro).
- After a visitor scores their OWN first property, show a single non-blocking prompt: "Save this report — create a free account." Never interrupt the score reveal itself.
- Analytics events: showcase_chip_tap (with property id), showcase_share_tap, showcase_to_hero_cta_tap, own_score_after_showcase, signup_source=showcase.

## A3. Positioning copy realignment

- REMOVE all broker-attack framing ("everything your broker hides", "your broker prays you never find", etc.).
- ADD the certificate-vs-truth section (see A5 structure, section 6) with this exact headline: **"RERA tells you it's registered. CRUX tells you if it's trustworthy."** Supporting line: "Registration is a certificate. It is not a verdict. CRUX reads the court cases, the builder's filings, the money flow, and the market — and gives you the verdict."
- Coverage claims: replace "Score any property in India" and "12 Indian cities" with: **"India's deepest property intelligence. Starting with Gujarat."** Where coverage is referenced elsewhere, use the depth-tier language: "Deep Verified — Gujarat" vs "Standard — other states". **OPEN DECISION: founder confirms Gujarat-first positioning before this task runs.**
- Normalize the signal count to ONE number site-wide (founder to confirm 20+ vs 23). Fix the ticker rendering bug producing "MCA2123 data signals" (MCA21 colliding with "23") — likely the ticker will be removed entirely per A5, but verify no other surface has the collision.
- Attribute the closing quote: Murtaza Patel, Founder & CEO, ComfHutt — with photo.

## A4. Plain-language rewrite

- Target 8th-grade English on the entire landing page. Replace analyst jargon: "composite credibility index" → "one score that tells you if a property is safe to buy"; "calibrated composite weighted by predictive accuracy" → moves to /methodology, not the landing page.
- Create **/methodology** as a top-level nav page carrying full technical depth: six categories and weights, all data sources with links, scoring philosophy, versioned changelog, and the builder dispute/correction process. The landing page persuades; the methodology page proves.
- **Language toggle:** Gujarati + Hindi for hero, how-it-works, showcase chrome, and FAQ at minimum. Static translated copy (i18n routing or locale switch — architect's call). No runtime machine translation. Founder reviews translations before ship.

## A5. Structure: current ~10 sections → 8

1. **Nav:** logo · Methodology · Pricing · [Score a property]
2. **Hero** (per A1, chips per A2)
3. **How it works — 3 steps.** Copy: "1. Type any project or address. 2. CRUX checks 20+ government and market sources. 3. Get your score, the evidence, and a fair-price check — in 90 seconds."
4. **The engine** — six dimensions condensed into ONE visual block (currently sprawls across multiple).
5. **Certificate vs. truth** (copy in A3).
6. **Pricing** — 3 cards, Free / Pro Monthly / Pro Annual per SEMI_LAUNCH_BRIEF Workstream 3 (the ₹0 display bug fix lives there; coordinate).
7. **ComfHutt Invest teaser** — one block. REMOVE the live "214 people" count. Replace with: "Coming next: invest in the highest-scoring properties, fractionally. Join the founding list."
8. **FAQ** (copy in A6) → **Footer** (per A7).

CUT entirely: both duplicated "THE SHIFT" comparison blocks (message merges into section 5), the scrolling ticker (both passes), the "You've done the hard part / skipped the line" section (merges into Invest teaser), and redundant stat-badge repetitions.

## A6. FAQ — final copy, implement verbatim

Add FAQPage JSON-LD (coordinate with SEO workstream).

**Is this legal?**
Yes. Every data point in a CRUX report comes from public government records — RERA filings, court records, company filings, and registered sale prices. We organize what is already public and show you our sources.

**Where does your data come from?**
Government sources first: GujRERA filings, eCourts case records, MCA company filings, and registered transaction prices — plus satellite imagery, location data, and market signals. Every claim in a report links to its source so you can verify it yourself.

**Can the builder see that I checked their property?**
No. Your searches are private. We never share your activity with builders, brokers, or anyone else.

**Is it really free? What's the catch?**
Your first 3 reports need no account at all, and the free plan stays free after that. We make money from our Pro plan and our upcoming investment platform — not by selling your data, and never by taking money from builders.

**What happens after my 3 free reports?**
Create a free account and keep scoring. The free plan includes the full score, all parameters, and our AI assistant — free forever.

**How is this different from checking RERA myself?**
RERA shows you a registration and raw filings. CRUX reads all of it — plus court cases, the builder's financial filings, and local prices — and turns hours of digging into one score with the evidence attached.

**Do you take money from builders or brokers?**
Never. Our independence is the product. Builders can dispute a data point through our public correction process, but no one can pay to change a score.

**Do you sell my data?**
No. We don't sell or share your personal data. See our Privacy Policy.

## A7. Legal + trust hygiene

- Footer links currently point to `#`: build real **Privacy Policy, Terms of Use, and Disclaimer** pages. The Disclaimer is part of the defamation/advisory posture (see SEMI_LAUNCH_BRIEF) — founder supplies/approves final legal text; Claude Code builds pages, routing, and footer wiring now with clearly marked placeholder copy that cannot ship to production unmarked.
- Remove or correctly wire the dead social links.

## A8. Performance

- Audit LCP on the hero; the input box and headline are the LCP candidates — keep them server-rendered and font-preloaded (subset Cormorant Garamond + DM Sans + DM Mono).
- Lazy-load all below-fold sections and illustrations. Marketing pages statically rendered/ISR.
- Showcase reports: pre-render from cache; animations CSS/rAF-only per A2.
- Test target: fast on mid-range Android over 4G. Verify with Lighthouse mobile before sign-off.

---

## Priority order

1. A3 copy fixes not blocked by decisions (quote attribution, broker-framing removal, ticker bug/removal)
2. A7 legal page scaffolding (launch blocker)
3. A5 restructure + A4 plain-language rewrite + A6 FAQ (one coordinated pass)
4. A2 showcase system (chips + flagship report presentation + conversion CTAs) — chips can go live before the hero input since they're cache-only
5. A1 hero input (behind feature flag until Workstream 2 ships)
6. A4 language toggle
7. A8 performance pass (continuous; verified at the end)

## Open decisions blocking specific tasks

- Gujarat-first positioning confirmation → blocks A3 coverage-claim rewrite
- Signal count (20+ vs 23) → blocks A3 normalization
- The 3 showcase properties + founder sign-off on the red-flag report → blocks A2 go-live
- Legal page final text → blocks A7 content (scaffolding proceeds)
