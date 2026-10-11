import { CITED_CORPUS, formatCount } from "@/lib/landing-stats";

/**
 * Four counters, directly under the hero.
 *
 * This replaces the scrolling source marquee. The marquee named eight national
 * registries CRUX has never read, and it moved, which meant the one claim a
 * reader most needs to check was the hardest thing on the page to read.
 *
 * **The caption does not say "live from our database", and that is deliberate.**
 * The brief asked for one, but these four numbers are not live and saying they
 * were would be the exact substitution this whole pass exists to stop. They are
 * corpus measurements from the crawl audit; the corpus lives in the miner's
 * Firestore, which is behind a Google Cloud suspension, so no code path reaches
 * it. They are published the honest way instead — as a measurement, with its
 * source and its date rendered right beside it, in text a reader can actually
 * read rather than in a tooltip.
 *
 * The live counters (projects graded, districts covered) are different claims by
 * two orders of magnitude and appear elsewhere, labelled as what they are.
 */

const COUNTERS: Array<{ value: number; label: string }> = [
  { value: CITED_CORPUS.projectsInCorpus, label: "Gujarat projects in our corpus" },
  { value: CITED_CORPUS.buildersProfiled, label: "Builders profiled" },
  { value: CITED_CORPUS.documentsRead, label: "Certified filings read" },
  { value: CITED_CORPUS.casesAttributed, label: "Court cases matched to a builder" },
];

export default function ProofStrip() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-crux-border bg-crux-border shadow-[var(--shadow-premium-md)] sm:grid-cols-4">
        {COUNTERS.map(({ value, label }) => (
          <div key={label} className="flex flex-col gap-1.5 bg-white px-4 py-6 text-center">
            {/* Proportional figures, not tabular: these are four standalone display
                numbers, not a column of values a reader compares digit by digit. */}
            <dt className="text-[26px] font-extrabold leading-none tracking-[-0.03em] text-crux-text-primary sm:text-[32px]">
              {formatCount(value)}
            </dt>
            <dd className="text-pretty text-[11px] leading-snug text-crux-text-secondary sm:text-[12px]">
              {label}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mx-auto mt-3 max-w-[78ch] text-pretty text-center text-[11px] leading-relaxed text-crux-text-muted">
        Source: {CITED_CORPUS.source}, measured {CITED_CORPUS.asOfLabel}. These count
        what CRUX has crawled and read, not the projects graded so far — a much
        smaller number.
      </p>
    </div>
  );
}
