/**
 * The CRUX Grading Mechanism, transcribed from the engine's own constant tables.
 *
 * WHY THIS FILE EXISTS
 * The page that renders this is the thing that makes "our method is published"
 * true. So every row below is a transcription of a named constant in the grading
 * engine, and each block says which one. Where a value could be imported from the
 * frontend instead of copied, it is: the seven modules, their labels, their
 * one-line blurbs and the whole grade presentation come from `lib/grade.ts` at
 * render time, not from here, so the page cannot drift out of step with the grade
 * surface. What is copied here is only what lives in the backend engine, which the
 * frontend does not link against.
 *
 * ENGINE SOURCE (read-only reference, do not edit from this app):
 *   comfhutt-backend/src/modules/crux/cgm/
 *     curves.ts          GRADE_BANDS, GATE_CAPS, CONFIDENCE, MATCH_CONFIDENCE,
 *                        FRESHNESS_HALF_LIFE_DAYS, AUTHORITY_FACTORS, CGM_CONSTANTS
 *     gates.ts           applyGates — gates are ceilings, not deductions
 *     confidence.ts      moduleConfidence, compositeConfidence
 *     matchConfidence.ts matchBucket, matchConfidenceWeight
 *     index.ts           computeCgmGrade — the order the steps run in, and the NR rule
 *     methodologyHash.ts computeMethodologyHash, CGM_METHODOLOGY_VERSION
 *     adapter/toCgmInput.ts  which record feeds which module, at which authority tier
 *
 * WHAT MAY NOT APPEAR HERE
 * No module weights, in any form. The engine's aggregation matrices are not
 * published, and a weight table is the one thing this page must never grow.
 * No source outside the four families below — naming a record CRUX does not read
 * is the failure this whole surface exists to prevent.
 */

/* ────────────────────────────────────────────────────────────────────────────
 * Grade bands — engine GRADE_BANDS (curves.ts), checked high to low.
 * The letter is the verdict. The composite is the cut-off that produced it and
 * stays secondary wherever it is rendered.
 * ──────────────────────────────────────────────────────────────────────────── */

export interface GradeBandRow {
  /** The letter exactly as the engine emits it. */
  grade: string;
  /** Lowest composite that reaches this band. */
  min: number;
}

export const GRADE_BAND_ROWS: readonly GradeBandRow[] = [
  { grade: "A+", min: 90 },
  { grade: "A", min: 80 },
  { grade: "B+", min: 70 },
  { grade: "B", min: 60 },
  { grade: "C+", min: 50 },
  { grade: "C", min: 40 },
  { grade: "D", min: 0 },
];

/** The composite range for a band, written the way the engine tests it. */
export function bandRange(index: number): string {
  const row = GRADE_BAND_ROWS[index];
  const above = GRADE_BAND_ROWS[index - 1];
  if (!above) return `${row.min} and above`;
  if (row.min === 0) return `below ${above.min}`;
  return `${row.min} to below ${above.min}`;
}

/** Best letter a capped composite can still reach. Mirrors gradeFromComposite(). */
export function gradeForComposite(composite: number): string {
  for (const row of GRADE_BAND_ROWS) {
    if (composite >= row.min) return row.grade;
  }
  return "D";
}

/* ────────────────────────────────────────────────────────────────────────────
 * Gates — engine GATE_CAPS (curves.ts) and applyGates (gates.ts).
 * A gate is a CEILING on the composite, applied after it is computed and before
 * the letter is assigned. The lowest triggered cap wins. Four of the five require
 * a confident legal match before they may fire (GATE_MATCH_CONFIDENCE = 0.85).
 * ──────────────────────────────────────────────────────────────────────────── */

export interface GateRow {
  /** The engine's own gate id, printed on the report beside the record that fired it. */
  id: string;
  title: string;
  body: string;
  /** Composite ceiling imposed (GATE_CAPS). */
  cap: number;
  /** Whether this gate requires match confidence at or above 0.85 to fire. */
  needsConfidentMatch: boolean;
}

export const GATES: readonly GateRow[] = [
  {
    id: "G1",
    title: "GujRERA registration revoked",
    body: "The regulator has revoked the project's registration. Read straight off the GujRERA record, so no name matching is involved.",
    cap: 39,
    needsConfidentMatch: false,
  },
  {
    id: "G2",
    title: "Active title or land dispute on the project land",
    body: "A live matter in the engine's title-and-land severity class that touches this project's land specifically — not merely a matter somewhere in the promoter's history.",
    cap: 49,
    needsConfidentMatch: true,
  },
  {
    id: "G3",
    title: "Active criminal proceeding against the promoter or a signatory",
    body: "A live matter in the engine's criminal severity class, tied to the promoter or an authorised signatory.",
    cap: 49,
    needsConfidentMatch: true,
  },
  {
    id: "G4",
    title: "Insolvency admitted at the NCLT",
    body: "An admitted insolvency proceeding, not a filing or a notice.",
    cap: 39,
    needsConfidentMatch: true,
  },
  {
    id: "G5",
    title: "Escrow anomaly",
    body: "Withdrawals running at twice the filed construction progress while build velocity has been at or below zero for two consecutive quarters, read from the project's own quarterly filings.",
    cap: 69,
    needsConfidentMatch: false,
  },
];

/* ────────────────────────────────────────────────────────────────────────────
 * Source families — the complete list, and the only list.
 * Traced from adapter/toCgmInput.ts, where every module's evidence reference
 * carries its source string and authority tier.
 * ──────────────────────────────────────────────────────────────────────────── */

export interface SourceFamily {
  name: string;
  /** What is actually read from it. */
  records: string;
  /** Module codes it feeds, as `lib/grade.ts` names them. */
  modules: readonly string[];
  /** Authority tier the adapter stamps on that evidence. */
  tier: string;
  /** Freshness half-life in days (FRESHNESS_HALF_LIFE_DAYS), with its key. */
  halfLife: string;
}

export const SOURCE_FAMILIES: readonly SourceFamily[] = [
  {
    name: "GujRERA filings",
    records:
      "The project's registration record, its quarterly progress and escrow filings, its Form 3 certificate, its permanent documents and its declared unit rates — read as the authority's JSON record and as the certified PDFs behind it.",
    modules: ["D", "F", "C", "T", "P"],
    tier: "T1 for a certified PDF, T2 for the JSON record alone",
    halfLife: "182.5 days (two quarters)",
  },
  {
    name: "GujRERA authority and appellate tribunal",
    records:
      "Complaints and orders in the RERA chain, counted as their own severity class and scaled against how many projects the promoter has registered.",
    modules: ["L"],
    tier: "T1",
    halfLife: "90 days",
  },
  {
    name: "eCourts, Gujarat High Court, Supreme Court and IBBI",
    records:
      "Case listings and their status, mapped to a severity class by a versioned keyword taxonomy that is itself part of the methodology hash.",
    modules: ["L"],
    tier: "T1",
    halfLife: "90 days",
  },
  {
    name: "Google Maps",
    records:
      "Distances and places around the project, turned into transit, amenity, employment-proximity and negative-externality sub-scores, then cached.",
    modules: ["X"],
    tier: "T2",
    halfLife: "180 days",
  },
];

/** Which family each module leans on. Keyed by the codes in `lib/grade.ts`. */
export const MODULE_SOURCE: Record<string, string> = {
  L: "GujRERA authority and tribunal; eCourts, High Court, Supreme Court, IBBI",
  D: "GujRERA quarterly filings",
  T: "GujRERA promoter profile",
  F: "GujRERA Form 3 and escrow filings",
  C: "GujRERA permanent documents and filing history",
  X: "Google Maps",
  P: "GujRERA declared unit rates, and comparable projects in the corpus",
};

/* ────────────────────────────────────────────────────────────────────────────
 * Authority tiers — engine AUTHORITY_FACTORS (curves.ts) and types.ts §1.
 * The factor values are not published. The ordering and the T4 rule are.
 * ──────────────────────────────────────────────────────────────────────────── */

export const AUTHORITY_TIERS: ReadonlyArray<{ tier: string; body: string }> = [
  { tier: "T1", body: "A certified document or an official case record. Full authority." },
  { tier: "T2", body: "A structured record from the authority's own system, without the certified document behind it." },
  { tier: "T3", body: "Something you told CRUX — a quoted price, for instance." },
  {
    tier: "T4",
    body: "Self-published material, such as a builder's own website. T4 may never move a score. It can only contradict the record, and a contradiction is published as a flag with both sides quoted.",
  },
];

/* ────────────────────────────────────────────────────────────────────────────
 * Confidence — engine CONFIDENCE (curves.ts), confidence.ts, index.ts.
 * ──────────────────────────────────────────────────────────────────────────── */

/** CONFIDENCE.nrBelow — composite confidence under this is Not Rated. */
export const NR_BELOW = 0.4;
/** CONFIDENCE.provisionalBelow — under this, and at or above NR_BELOW, is provisional. */
export const PROVISIONAL_BELOW = 0.55;
/** CONFIDENCE.lowCoverageFloor, applied to CONFIDENCE.lowCoverageModules. */
export const LOW_COVERAGE_FLOOR = 0.3;
/** CONFIDENCE.lowCoverageModules — thin coverage in any of these degrades the grade. */
export const LOW_COVERAGE_MODULES = ["L", "D", "F"] as const;

/** MATCH_CONFIDENCE.fullWeightAt — at or above this, a case counts in full. */
export const MATCH_FULL_WEIGHT_AT = 0.85;
/** MATCH_CONFIDENCE.includeAt — below this, a case is listed but never counted. */
export const MATCH_INCLUDE_AT = 0.6;

/**
 * The names the engine uses for the inputs it lists in a Not Rated message
 * (MODULE_NAME in index.ts), keyed by module code.
 */
export const NOT_RATED_INPUT_NAMES: Record<string, string> = {
  L: "legal search",
  D: "delivery telemetry",
  T: "developer track record",
  F: "certified financials",
  C: "compliance documents",
  X: "location analysis",
  P: "price benchmark",
};

/* ────────────────────────────────────────────────────────────────────────────
 * Changelog. Dates are taken only where the engine records one.
 * ──────────────────────────────────────────────────────────────────────────── */

export interface ChangelogEntry {
  version: string;
  /** Rendered only when the engine records a date for the change. */
  date: string | null;
  changes: readonly string[];
}

export const CHANGELOG: readonly ChangelogEntry[] = [
  {
    version: "CGM-1.1",
    date: "16 September 2026",
    changes: [
      "The fallback severity class — the one a case type lands in when the taxonomy does not recognise it — was lowered, so an unrecognised matter barely moves a grade. The named serious classes were left untouched: a live title suit still scores the same as it did.",
      "Cross-checking of a builder's self-published claims against the regulator's record was added. A contradiction is published as a flag with both sides quoted and a link to the page it came from, and costs a little confidence. It can never move a module score, and it can never push a grade to Not Rated or away from it.",
    ],
  },
  {
    version: "CGM-1.0",
    date: null,
    changes: [
      "The seven-module engine, the letter bands, the five gates, the confidence and Not Rated rules, and the legal match-confidence thresholds.",
      "The methodology hash became a SHA-256 of the rule tables themselves, replacing a constant string that identified nothing.",
    ],
  },
];

/** Districts with a corpus deep enough to grade from today. */
export const DISTRICTS = ["Ahmedabad", "Gandhinagar", "Surat", "Vadodara", "Rajkot"] as const;
