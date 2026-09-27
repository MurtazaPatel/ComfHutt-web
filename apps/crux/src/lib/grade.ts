/**
 * One source of truth for how a CRUX Grade is named and coloured.
 *
 * This exists because three screens disagreed. The properties and reports lists
 * both switched on grade strings like "Excellent" and "Good", which the scoring
 * engine has never produced — it returns letter grades (A+ … D, or NR) — so every
 * row silently fell through to the neutral default. Meanwhile the grading page
 * carried its own inline letter→colour table. Same concept, three implementations,
 * two of them dead.
 *
 * Nothing here derives a grade from a score. The engine decides the grade; the
 * frontend only presents what it is given. Inventing a grade client-side is how
 * you end up shipping a number the engine would not stand behind.
 */

/** The letter grades the engine emits, plus NR for a refused grade. */
export type CruxGrade = "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "NR";

export interface GradeBand {
  /** The grade as it should be shown. */
  label: string;
  /** Tailwind classes for a pill/chip: text, background and border together. */
  chipClass: string;
  /** Ink colour for a large numeral or ring, as a CSS colour. */
  fg: string;
  /** Fill behind a large grade mark. */
  bg: string;
  /** Inset ring around a large grade mark. */
  ring: string;
  /** One line a reader can act on. Deliberately plain English. */
  meaning: string;
}

const BANDS: Record<string, GradeBand> = {
  A: {
    label: "A",
    chipClass: "text-emerald-700 bg-emerald-50 border-emerald-200",
    fg: "#047857",
    bg: "rgba(16,185,129,0.12)",
    ring: "rgba(16,185,129,0.28)",
    meaning: "Clean across the checks that matter.",
  },
  B: {
    label: "B",
    chipClass: "text-blue-700 bg-blue-50 border-blue-200",
    fg: "#1D6FB8",
    bg: "rgba(59,130,246,0.12)",
    ring: "rgba(59,130,246,0.28)",
    meaning: "Sound overall, with points worth reading.",
  },
  C: {
    label: "C",
    chipClass: "text-amber-700 bg-amber-50 border-amber-200",
    fg: "#B45309",
    bg: "rgba(245,158,11,0.14)",
    ring: "rgba(245,158,11,0.30)",
    meaning: "Real concerns in the record. Read the modules.",
  },
  D: {
    label: "D",
    chipClass: "text-red-700 bg-red-50 border-red-200",
    fg: "#B91C1C",
    bg: "rgba(239,68,68,0.12)",
    ring: "rgba(239,68,68,0.30)",
    meaning: "Serious adverse findings. Do not proceed on this alone.",
  },
  NR: {
    label: "NR",
    chipClass: "text-gray-600 bg-gray-50 border-gray-200",
    fg: "#6B7280",
    bg: "rgba(107,114,128,0.12)",
    ring: "rgba(107,114,128,0.28)",
    meaning: "Not enough verified data to grade responsibly.",
  },
};

/**
 * Resolve any grade string the API might hand us to its presentation band.
 *
 * Tolerant on input on purpose: rows written by earlier engine versions carry
 * descriptive grades ("Excellent", "Risk") rather than letters, and a row with no
 * grade at all is normal for a property that has not been scored yet. All of them
 * have to render as something honest rather than as a blank chip.
 */
export function gradeBand(grade: string | null | undefined): GradeBand {
  if (!grade) return BANDS.NR;
  const g = grade.trim().toUpperCase();

  // Letter grades: the plus/minus is shown, the colour follows the letter.
  const letter = g[0];
  if ((letter === "A" || letter === "B" || letter === "C" || letter === "D") && g.length <= 2) {
    return { ...BANDS[letter], label: g };
  }

  // Descriptive grades from legacy CPSM rows, mapped to the nearest band so an
  // old report still reads consistently next to a new one.
  switch (g) {
    case "EXCELLENT":
      return { ...BANDS.A, label: "Excellent" };
    case "GOOD":
      return { ...BANDS.B, label: "Good" };
    case "FAIR":
      return { ...BANDS.C, label: "Fair" };
    case "CAUTION":
      return { ...BANDS.C, label: "Caution" };
    case "RISK":
      return { ...BANDS.D, label: "Risk" };
    case "NR":
    case "NOT RATED":
      return BANDS.NR;
    default:
      return { ...BANDS.NR, label: grade };
  }
}

/** True when the API gave us no usable grade — the caller should say so, not guess. */
export function isUngraded(grade: string | null | undefined): boolean {
  if (!grade) return true;
  const g = grade.trim().toUpperCase();
  return g === "NR" || g === "NOT RATED";
}

/**
 * Colour for a 0–100 module or category score.
 *
 * The thresholds match the grading page's existing reading of the scale, kept
 * here so a bar on one screen never contradicts the same bar on another.
 */
export function scoreColor(value: number): string {
  if (value < 30) return "#EF4444";
  if (value <= 55) return "#F59E0B";
  return "var(--color-crux-green)";
}

/**
 * The seven modules the engine grades, in the order it reports them.
 *
 * Lifted here because CgmGradeSurface and ReportViewer each carried their own
 * copy of this table, and the dashboard now needs a third. Labels read as
 * strengths on purpose: every module score is "higher is better", so a module
 * named for its risk would make a high score look like a bad result.
 */
export const MODULE_ORDER = ["L", "D", "T", "F", "C", "X", "P"] as const;

export type ModuleCode = (typeof MODULE_ORDER)[number];

export const MODULE_LABEL: Record<string, string> = {
  L: "Legal Standing",
  D: "Delivery Execution",
  T: "Developer Trust",
  F: "Financial Integrity",
  C: "Compliance",
  X: "Location",
  P: "Price Fairness",
};

/**
 * One plain line on what each module reads.
 *
 * Deliberately conservative: each line names only record types the adapter
 * actually builds evidence from (GujRERA filings, RERA complaints, eCourts
 * cases, mapped distances). Where the engine's inputs are less certain the line
 * describes the question the module answers rather than naming a source, because
 * naming a source CRUX does not read is the failure this product cannot afford.
 */
export const MODULE_BLURB: Record<string, string> = {
  L: "Court and tribunal cases tied to the promoter, and what could not be tied to them.",
  D: "Whether the project is being built at the pace its own filings promised.",
  T: "The developer's track record across everything they have registered.",
  F: "What the project's own financial filings say about how funds are being used.",
  C: "Whether the registration and mandatory filings are current and complete.",
  X: "Where it sits, and what is actually within reach of it.",
  P: "Whether the asking price is defensible for this location and this stage.",
};

/** Label for a module code, falling back to the raw code for anything unmapped. */
export function moduleLabel(code: string): string {
  return MODULE_LABEL[code] ?? code;
}
