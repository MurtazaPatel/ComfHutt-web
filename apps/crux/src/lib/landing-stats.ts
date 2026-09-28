/**
 * Numbers for the marketing page.
 *
 * There are two kinds here and the distinction is the whole point of this file.
 *
 * **Live** — counted out of the production database on request. `gradedProjects`,
 * `districtCount` and `lastGradedAt` come from `GET /crux/stats/landing`. If that
 * call fails they are `null`, never `0`: a zero is a claim ("we have graded
 * nothing"), whereas null lets the page render an em dash and say nothing.
 *
 * **Cited** — the crawled corpus. These cannot be queried. The corpus lives in the
 * miner's Firestore, which is behind a Google Cloud suspension, so no code path
 * reaches it. They are therefore published the only honest way left: as a
 * measurement taken on a stated date, from a stated source, rendered with that
 * date visible beside them. That is the second branch of the rule — a number comes
 * from the database *or* it carries a visible source and date.
 *
 * The two must never be swapped. "Projects in the corpus" and "projects graded"
 * are different claims by two orders of magnitude, and a page that quietly
 * substitutes one for the other is doing the thing this whole pass exists to stop.
 *
 * When the suspension lifts, move the CITED block behind the same endpoint and
 * delete it from here — do not leave both.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

/**
 * Corpus measurements from the CRUX crawl audit.
 *
 * Source: `audit/EXPANSION_PROGRESS.md` in the miner repository, the run recorded
 * on the date below. Every figure was checked against that file; none is rounded
 * up, and none is a projection. `asOf` renders on the page next to them.
 */
export const CITED_CORPUS = {
  asOf: "2026-09-18",
  asOfLabel: "18 September 2026",
  source: "CRUX crawl audit",

  /** GujRERA projects scraped across the five districts (of 8,405 enumerated). */
  projectsInCorpus: 5_996,
  projectsEnumerated: 8_405,

  /** Ahmedabad promoters carried through the legal grading pass. */
  buildersProfiled: 2_810,

  /** Certified GujRERA filings successfully read and stored. */
  documentsRead: 37_870,

  /** Court records pulled across the five legal forums. */
  casesPulled: 16_982,

  /** Of those, the ones tied to a specific promoter with enough confidence to count. */
  casesAttributed: 8_288,

  /** Distinct promoters those attributed cases belong to. */
  buildersWithCase: 1_079,
} as const;

/**
 * Share of profiled Ahmedabad builders carrying at least one attributed case.
 * Derived rather than stored, so it cannot drift from its own inputs.
 */
export const BUILDERS_WITH_CASE_PCT = Math.round(
  (CITED_CORPUS.buildersWithCase / CITED_CORPUS.buildersProfiled) * 100,
);

/**
 * Share of court records carrying a builder's name that could NOT be tied to that
 * builder with enough confidence to count.
 *
 * Stated carefully. It does **not** mean those records belong to someone else —
 * that is an overstatement the pitch-deck review already caught. It means the
 * match confidence was below the counting threshold, so CRUX lists them as
 * possible and excludes them from the grade.
 */
export const UNATTRIBUTED_CASE_PCT = Math.round(
  ((CITED_CORPUS.casesPulled - CITED_CORPUS.casesAttributed) / CITED_CORPUS.casesPulled) * 100,
);

export interface LiveStats {
  /** Gujarat properties carrying a grade. Null when the query failed. */
  gradedProjects: number | null;
  /** Distinct Gujarat cities represented. Null when the query failed. */
  districtCount: number | null;
  /** ISO timestamp of the most recent grade. Null when unavailable. */
  lastGradedAt: string | null;
  methodologyVersion: string | null;
  methodologyHash: string | null;
}

const UNAVAILABLE: LiveStats = {
  gradedProjects: null,
  districtCount: null,
  lastGradedAt: null,
  methodologyVersion: null,
  methodologyHash: null,
};

/**
 * Fetch the live counters. Server-side, revalidated hourly.
 *
 * Never throws: the marketing page must render even when the API is down, and a
 * failed counter degrades to an em dash rather than taking the page with it.
 */
export async function getLandingStats(): Promise<LiveStats> {
  try {
    const res = await fetch(`${API_URL}/crux/stats/landing`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return UNAVAILABLE;

    const body = (await res.json()) as { success?: boolean; data?: Partial<LiveStats> };
    if (!body?.success || !body.data) return UNAVAILABLE;

    // Read each field defensively: a partial payload should surface the fields it
    // does carry rather than discarding all of them.
    return {
      gradedProjects: numberOrNull(body.data.gradedProjects),
      districtCount: numberOrNull(body.data.districtCount),
      lastGradedAt: typeof body.data.lastGradedAt === "string" ? body.data.lastGradedAt : null,
      methodologyVersion:
        typeof body.data.methodologyVersion === "string" ? body.data.methodologyVersion : null,
      methodologyHash:
        typeof body.data.methodologyHash === "string" ? body.data.methodologyHash : null,
    };
  } catch {
    return UNAVAILABLE;
  }
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/** Indian digit grouping: 37,870 not 37870. Em dash when there is no number. */
export function formatCount(value: number | null): string {
  return value === null ? "—" : value.toLocaleString("en-IN");
}
