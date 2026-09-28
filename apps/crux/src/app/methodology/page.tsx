import type { Metadata } from "next";
import Link from "next/link";
import {
  MODULE_ORDER,
  MODULE_LABEL,
  MODULE_BLURB,
  gradeBand,
  scoreColor,
} from "@/lib/grade";
import { CITED_CORPUS, formatCount, getLandingStats } from "@/lib/landing-stats";
import {
  AUTHORITY_TIERS,
  CHANGELOG,
  DISTRICTS,
  GATES,
  GRADE_BAND_ROWS,
  LOW_COVERAGE_FLOOR,
  LOW_COVERAGE_MODULES,
  MATCH_FULL_WEIGHT_AT,
  MATCH_INCLUDE_AT,
  MODULE_SOURCE,
  NOT_RATED_INPUT_NAMES,
  NR_BELOW,
  PROVISIONAL_BELOW,
  SOURCE_FAMILIES,
  bandRange,
  gradeForComposite,
} from "./content";

/**
 * The published method.
 *
 * This page is the thing that makes "our method is published" true, so it is
 * generated from the engine's constants rather than written as prose about them.
 * The seven modules, their labels, their one-liners and every grade chip on the
 * page are read from `lib/grade.ts` at render time — the same table the grade
 * surface and the landing page render from — so this page cannot describe a
 * grade the product does not emit. The backend-only tables (bands, gates,
 * confidence thresholds, source families) are transcribed in `./content.ts`,
 * which names the engine file and symbol behind each one.
 *
 * Two rules govern what may appear here and both are absolute:
 *
 *   1. No module weights, in any form. The engine's aggregation matrices are not
 *      published; a weight table on this page would be the whole point of the
 *      page undone.
 *   2. No source that is not one of the four families below. Naming a record
 *      CRUX does not read would make this page a liability rather than a proof.
 *
 * Server component on purpose: nothing here needs state, so the page ships no
 * JavaScript of its own and reads correctly before hydration.
 *
 * Revalidated hourly, matching the landing page and the stats endpoint's own
 * s-maxage. The version and hash come from the live API; when it is unreachable
 * they render as an em dash, never as a stale or zeroed value.
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How a CRUX Grade is produced: the A+ to D bands, the seven modules, the records behind each one, how confidence and Not Rated work, the five gates that cap a grade, and the version and hash of the rulebook in force.",
  alternates: { canonical: "/methodology" },
  openGraph: {
    type: "article",
    url: "/methodology",
    title: "CRUX methodology — how a grade is produced",
    description:
      "The grade bands, the seven modules, the records CRUX reads, how confidence and Not Rated work, and the gates that cap a grade.",
  },
};

const SECTION = "px-4 py-16 md:py-24";
const CONTAINER = "mx-auto max-w-[1100px]";
const H2 =
  "text-pretty text-[26px] font-bold leading-tight tracking-[-0.02em] text-crux-text-primary md:text-[36px]";
const H3 = "text-pretty text-[17px] font-bold tracking-tight text-crux-text-primary";
const LEAD = "text-pretty text-[16px] leading-[1.7] text-crux-text-secondary md:text-[17px]";
const BODY = "text-pretty text-[15px] leading-[1.7] text-crux-text-secondary";
const MUTED = "text-pretty text-[13px] leading-relaxed text-crux-text-muted";
const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2";
const CARD = "rounded-2xl border border-crux-border bg-white p-5 sm:p-6";

/** Sections a reader can jump to. Ids match the <section> elements below. */
const CONTENTS = [
  { id: "bands", label: "The grade bands" },
  { id: "modules", label: "The seven modules" },
  { id: "sources", label: "The records CRUX reads" },
  { id: "confidence", label: "Confidence and Not Rated" },
  { id: "gates", label: "The gates" },
  { id: "limits", label: "What a grade is not" },
  { id: "version", label: "Version, hash and changes" },
];

/** The module-score colour scale, exactly as `scoreColor()` splits it. */
const SCORE_STEPS = [
  { at: 15, label: "Below 30" },
  { at: 45, label: "30 to 55" },
  { at: 80, label: "Above 55" },
];

export default async function MethodologyPage() {
  const stats = await getLandingStats();
  const version = stats.methodologyVersion ?? "—";
  const hash = stats.methodologyHash ?? "—";
  const notRated = gradeBand("NR");

  return (
    <>
      <header className="border-b border-crux-border bg-white">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between gap-3 px-4">
          <Link
            href="/"
            className={`inline-flex min-h-11 items-center rounded-lg px-1 text-[18px] font-bold tracking-[-0.03em] text-crux-text-primary no-underline ${FOCUS}`}
          >
            CRUX
          </Link>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-crux-text-muted">
            Methodology
          </span>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Title, and the fingerprint of the rulebook in force ── */}
        <section className={`bg-crux-bg-primary ${SECTION}`}>
          <div className={CONTAINER}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-crux-green">
              The CRUX Grading Mechanism
            </p>
            <h1 className="mt-4 text-pretty text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-crux-text-primary md:text-[48px]">
              How a CRUX Grade is produced
            </h1>
            <p className={`mt-5 max-w-[68ch] ${LEAD}`}>
              A CRUX Grade is a letter, A+ to D, or Not Rated. It is produced by a
              fixed set of rules from records that are public, and the rules are on
              this page. The same filings always produce the same grade: no model
              decides it, and nobody can buy one.
            </p>
            <p className={`mt-4 max-w-[68ch] ${BODY}`}>
              Our agents plan the searches and read the documents. They never set
              the grade. Every grade carries the version and the hash of the exact
              rulebook that produced it, so a grade from today and a grade from six
              months ago can be told apart.
            </p>

            <dl className="mt-8 grid max-w-[68ch] gap-px overflow-hidden rounded-2xl border border-crux-border bg-crux-border shadow-[var(--shadow-premium-sm)] sm:grid-cols-[auto_1fr]">
              <dt className="bg-white px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-crux-text-muted">
                Version in force
              </dt>
              <dd className="bg-white px-5 py-4 font-mono text-[14px] font-medium text-crux-text-primary">
                {version}
              </dd>
              <dt className="bg-white px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-crux-text-muted">
                Methodology hash
              </dt>
              <dd className="min-w-0 bg-white px-5 py-4 font-mono text-[12px] break-all text-crux-text-primary">
                {hash}
              </dd>
            </dl>
            <p className={`mt-3 max-w-[68ch] ${MUTED}`}>
              The hash is a SHA-256 of the engine&rsquo;s rule tables, serialised in
              a fixed order. Change any published rule and the hash changes with it
              — that is what it is for. Both values are read from the grading
              service; an em dash means the service did not answer, not that there
              is no rulebook.
            </p>

            <nav aria-label="On this page" className="mt-10">
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-crux-text-muted">
                On this page
              </h2>
              <ul className="mt-2 flex list-none flex-wrap gap-x-2 gap-y-1 p-0">
                {CONTENTS.map(({ id, label }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className={`inline-flex min-h-11 items-center rounded-lg px-2.5 text-[14px] font-medium text-crux-green-mid no-underline transition-colors hover:text-crux-green-dark motion-reduce:transition-none ${FOCUS}`}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>

        {/* ── 1. Grade bands ── */}
        <section id="bands" aria-labelledby="bands-heading" className={`scroll-mt-20 bg-white ${SECTION}`}>
          <div className={CONTAINER}>
            <h2 id="bands-heading" className={H2}>
              The grade bands
            </h2>
            <p className={`mt-4 max-w-[68ch] ${BODY}`}>
              Seven letters and a refusal. Each module is scored on its own, the
              scores are combined into a single 0&ndash;100 composite, and the
              composite falls into one of the bands below. The letter is the
              verdict; the composite is the arithmetic behind it and stays
              secondary everywhere CRUX shows it.
            </p>

            <dl className="mt-8 grid gap-3 sm:grid-cols-2">
              {GRADE_BAND_ROWS.map((row, i) => {
                const band = gradeBand(row.grade);
                return (
                  <div
                    key={row.grade}
                    className="flex items-start gap-3.5 rounded-xl border border-crux-border bg-crux-bg-primary p-4"
                  >
                    <dt
                      className={`inline-flex h-9 min-w-9 shrink-0 items-center justify-center rounded-lg border px-2 text-[15px] font-bold ${band.chipClass}`}
                    >
                      {band.label}
                    </dt>
                    <dd className="min-w-0">
                      <p className={BODY}>{band.meaning}</p>
                      <p className="mt-1 font-mono text-[12px] text-crux-text-muted">
                        Composite {bandRange(i)}
                      </p>
                    </dd>
                  </div>
                );
              })}

              <div className="flex items-start gap-3.5 rounded-xl border border-crux-border bg-crux-bg-primary p-4 sm:col-span-2">
                <dt
                  className={`inline-flex h-9 min-w-9 shrink-0 items-center justify-center rounded-lg border px-2 text-[15px] font-bold ${notRated.chipClass}`}
                >
                  {notRated.label}
                </dt>
                <dd className="min-w-0">
                  <p className={BODY}>
                    <strong className="font-semibold text-crux-text-primary">
                      Not Rated.
                    </strong>{" "}
                    {notRated.meaning} No composite is published, and CRUX names the
                    inputs it could not assess.
                  </p>
                </dd>
              </div>
            </dl>

            <p className={`mt-6 max-w-[68ch] ${MUTED}`}>
              Colour follows the letter, and never carries meaning on its own: every
              band above is named by its letter and its plain-English reading, and a
              grade chip in the product always prints the letter.
            </p>
          </div>
        </section>

        {/* ── 2. The seven modules ── */}
        <section id="modules" aria-labelledby="modules-heading" className={`scroll-mt-20 bg-crux-bg-secondary ${SECTION}`}>
          <div className={CONTAINER}>
            <h2 id="modules-heading" className={H2}>
              The seven modules
            </h2>
            <p className={`mt-4 max-w-[68ch] ${BODY}`}>
              Each module reads a different part of the record and scores it
              0&ndash;100, where higher is better. A module with too little to go on
              is marked not assessed rather than scored at zero, and what it would
              have counted for moves to the modules that did run.
            </p>

            <ol className="mt-8 grid list-none gap-3 p-0 md:grid-cols-2">
              {MODULE_ORDER.map((code) => (
                <li
                  key={code}
                  className="flex items-start gap-3.5 rounded-xl border border-crux-border bg-white p-4 sm:p-5"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-crux-green-tint text-[12px] font-bold text-crux-green-dark"
                  >
                    {code}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-bold tracking-tight text-crux-text-primary">
                      {MODULE_LABEL[code]}
                    </h3>
                    <p className="mt-1 text-pretty text-[14px] leading-relaxed text-crux-text-secondary">
                      {MODULE_BLURB[code]}
                    </p>
                    <p className="mt-2 text-[12px] leading-snug text-crux-text-muted">
                      Reads: {MODULE_SOURCE[code]}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className={`mt-6 ${CARD}`}>
              <h3 className={H3}>How much each module counts</h3>
              <p className={`mt-2 max-w-[68ch] ${BODY}`}>
                Not equally, and not the same way for every project: what you intend
                to do with a property and how far along it is both change which
                modules matter. CRUX does not publish that table. Publishing it is
                an invitation to file toward it, and a grade that can be gamed by
                the party being graded is worth nothing to the party reading it.
                What CRUX does publish is every input, every module verdict and the
                document behind each one, so the reasoning can be checked even where
                the arithmetic is not printed.
              </p>
            </div>

            <div className={`mt-3 ${CARD}`}>
              <h3 className={H3}>Reading a module bar</h3>
              <p className={`mt-2 max-w-[68ch] ${BODY}`}>
                Module scores are drawn on one scale across the whole product, so a
                bar on the report and the same bar on your dashboard never
                disagree.
              </p>
              <ul className="mt-4 flex list-none flex-wrap gap-x-6 gap-y-3 p-0">
                {SCORE_STEPS.map(({ at, label }) => (
                  <li key={label} className="flex items-center gap-2.5">
                    <span
                      aria-hidden
                      className="h-3 w-8 shrink-0 rounded-full"
                      style={{ background: scoreColor(at) }}
                    />
                    <span className="text-[13px] font-medium text-crux-text-secondary">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
              <p className={`mt-4 ${MUTED}`}>
                Every bar prints its number beside it, so the colour is a second
                reading of the score rather than the only one.
              </p>
            </div>
          </div>
        </section>

        {/* ── 3. Sources ── */}
        <section id="sources" aria-labelledby="sources-heading" className={`scroll-mt-20 bg-white ${SECTION}`}>
          <div className={CONTAINER}>
            <h2 id="sources-heading" className={H2}>
              The records CRUX reads
            </h2>
            <p className={`mt-4 max-w-[68ch] ${BODY}`}>
              Four families, and no others. A module verdict that cannot point at a
              record in this list does not get published. CRUX grades RERA-registered
              projects in Gujarat; the districts with a corpus deep enough to grade
              from today are {DISTRICTS.slice(0, -1).join(", ")} and{" "}
              {DISTRICTS[DISTRICTS.length - 1]}.
            </p>

            <ul className="mt-8 grid list-none gap-3 p-0 lg:grid-cols-2">
              {SOURCE_FAMILIES.map((family) => (
                <li key={family.name} className="rounded-xl border border-crux-border bg-crux-bg-primary p-5">
                  <h3 className={H3}>{family.name}</h3>
                  <p className="mt-2 text-pretty text-[14px] leading-relaxed text-crux-text-secondary">
                    {family.records}
                  </p>
                  <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-[12px] leading-snug">
                    <dt className="font-semibold text-crux-text-muted">Feeds</dt>
                    <dd className="text-crux-text-secondary">
                      {family.modules.map((m) => MODULE_LABEL[m]).join(", ")}
                    </dd>
                    <dt className="font-semibold text-crux-text-muted">Authority</dt>
                    <dd className="text-crux-text-secondary">{family.tier}</dd>
                    <dt className="font-semibold text-crux-text-muted">Half-life</dt>
                    <dd className="text-crux-text-secondary">{family.halfLife}</dd>
                  </dl>
                </li>
              ))}
            </ul>

            <div className={`mt-6 ${CARD}`}>
              <h3 className={H3}>Authority tiers</h3>
              <p className={`mt-2 max-w-[68ch] ${BODY}`}>
                Every piece of evidence is stamped with how authoritative its source
                is, and that stamp caps how much confidence the module reading it
                can report.
              </p>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {AUTHORITY_TIERS.map(({ tier, body }) => (
                  <div key={tier} className="flex items-start gap-3">
                    <dt className="inline-flex h-7 min-w-9 shrink-0 items-center justify-center rounded-lg border border-crux-border bg-crux-bg-secondary px-2 font-mono text-[12px] font-bold text-crux-text-primary">
                      {tier}
                    </dt>
                    <dd className="min-w-0 text-pretty text-[13px] leading-relaxed text-crux-text-secondary">
                      {body}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className={`mt-3 ${CARD}`}>
              <h3 className={H3}>Half-life, and why a record goes stale</h3>
              <p className={`mt-2 max-w-[68ch] ${BODY}`}>
                An old reading is not a wrong reading, but it is a less certain one.
                Each source family decays on its own clock, and that decay feeds
                confidence rather than the score: a case status read three months
                ago has half the freshness of one read today, a quarterly filing
                halves over two quarters, and a cached map reading halves over six
                months. A promoter profile halves over a year.
              </p>
            </div>

            <div className={`mt-3 ${CARD}`}>
              <h3 className={H3}>What CRUX does not read</h3>
              <p className={`mt-2 max-w-[68ch] ${BODY}`}>
                There is no adapter for company filings, price indices, registry
                records, air quality, satellite imagery or telecom data, so none of
                them can appear behind a grade. A builder&rsquo;s own website is read,
                but only to cross-check: it may contradict the regulator&rsquo;s record,
                and CRUX publishes that contradiction with both sides quoted. It may
                never move a score in either direction.
              </p>
            </div>
          </div>
        </section>

        {/* ── 4. Confidence and Not Rated ── */}
        <section id="confidence" aria-labelledby="confidence-heading" className={`scroll-mt-20 bg-crux-bg-secondary ${SECTION}`}>
          <div className={CONTAINER}>
            <h2 id="confidence-heading" className={H2}>
              Confidence, and when CRUX refuses to grade
            </h2>
            <p className={`mt-4 max-w-[68ch] ${BODY}`}>
              Confidence is computed, not asserted. It is the part of the method
              that decides whether a grade gets published at all.
            </p>

            <div className="mt-8 grid gap-3 lg:grid-cols-2">
              <div className={CARD}>
                <h3 className={H3}>How a module&rsquo;s confidence is computed</h3>
                <p className={`mt-2 ${BODY}`}>
                  Three factors, multiplied: how much of the module&rsquo;s intended
                  evidence was actually found, how fresh that evidence is on its
                  source&rsquo;s own half-life, and how authoritative the weakest
                  load-bearing source was. A module resting on a structured record
                  where a certified document was expected cannot report full
                  confidence, however complete it is.
                </p>
              </div>

              <div className={CARD}>
                <h3 className={H3}>How the grade&rsquo;s confidence is computed</h3>
                <p className={`mt-2 ${BODY}`}>
                  The assessed modules&rsquo; confidences are combined in proportion to
                  how much each counts toward this grade, and then scaled down by
                  the share of the grade those modules actually represent. Without
                  that second step, a grade resting on two modules would report the
                  same confidence as one resting on all seven.
                </p>
              </div>

              <div className={CARD}>
                <h3 className={H3}>Not Rated</h3>
                <p className={`mt-2 ${BODY}`}>
                  Below {NR_BELOW.toFixed(2)} composite confidence, CRUX publishes no
                  letter and no composite. It publishes a reason instead, naming the
                  inputs it could not assess — for example:
                </p>
                <p className="mt-3 rounded-lg border border-crux-border bg-crux-bg-primary px-4 py-3 font-mono text-[12px] leading-relaxed text-crux-text-secondary">
                  Insufficient verified data for a responsible grade. Missing:{" "}
                  {NOT_RATED_INPUT_NAMES.L}, {NOT_RATED_INPUT_NAMES.F}.
                </p>
                <p className={`mt-3 ${MUTED}`}>
                  One exception, and it runs the other way: when a gate has fired,
                  the grade is published even if confidence is low. A confident
                  adverse finding must be shown, not hidden behind a refusal.
                </p>
              </div>

              <div className={CARD}>
                <h3 className={H3}>Provisional and degraded</h3>
                <p className={`mt-2 ${BODY}`}>
                  Between {NR_BELOW.toFixed(2)} and {PROVISIONAL_BELOW.toFixed(2)},
                  the grade is published and marked provisional. A grade is also
                  marked degraded when coverage in any of{" "}
                  {LOW_COVERAGE_MODULES.map((m) => MODULE_LABEL[m]).join(", ")} falls
                  below {LOW_COVERAGE_FLOOR.toFixed(2)}, however high the overall
                  number is. Those three are the modules a grade cannot honestly
                  rest on thin coverage of.
                </p>
              </div>
            </div>

            <div className={`mt-3 ${CARD}`}>
              <h3 className={H3}>Tying a court record to a builder</h3>
              <p className={`mt-2 max-w-[68ch] ${BODY}`}>
                Builder names repeat, and a case filed against a similarly named
                entity in another district is not this promoter&rsquo;s case. Every
                record is given a match confidence from four independent signals: an
                exact name match, a district match, an overlap between the
                case&rsquo;s era and the promoter&rsquo;s, and a co-party match.
              </p>
              <ul className={`mt-4 flex list-none flex-col gap-2 p-0 max-w-[68ch] ${BODY}`}>
                <li>
                  <strong className="font-semibold text-crux-text-primary">
                    {MATCH_FULL_WEIGHT_AT.toFixed(2)} and above
                  </strong>{" "}
                  — counted in full.
                </li>
                <li>
                  <strong className="font-semibold text-crux-text-primary">
                    {MATCH_INCLUDE_AT.toFixed(2)} to below {MATCH_FULL_WEIGHT_AT.toFixed(2)}
                  </strong>{" "}
                  — counted in proportion to the match confidence, and labelled for
                  you to verify.
                </li>
                <li>
                  <strong className="font-semibold text-crux-text-primary">
                    Below {MATCH_INCLUDE_AT.toFixed(2)}
                  </strong>{" "}
                  — listed as a possible case for you to check, and excluded from
                  the grade entirely.
                </li>
              </ul>
              <p className={`mt-4 max-w-[68ch] ${BODY}`}>
                The four gates that turn on a legal finding need a match confidence
                of at least {MATCH_FULL_WEIGHT_AT.toFixed(2)} before they may fire.
              </p>
              <p className={`mt-4 max-w-[68ch] ${MUTED}`}>
                Of {formatCount(CITED_CORPUS.casesPulled)} court records pulled
                across the five forums, {formatCount(CITED_CORPUS.casesAttributed)}{" "}
                cleared the threshold to count. The rest are shown as possible cases
                and excluded from every grade. Source: {CITED_CORPUS.source},
                measured {CITED_CORPUS.asOfLabel}.
              </p>
            </div>

            <div className={`mt-3 ${CARD}`}>
              <h3 className={H3}>No cases found is not a clean record</h3>
              <p className={`mt-2 max-w-[68ch] ${BODY}`}>
                An empty search result is gated on how complete the search was and
                on whether the promoter could plausibly have a record at all. A
                promoter with one registered project and no establishable tenure has
                had no time to accumulate litigation, so a silent search says
                nothing — that case is capped and reported as uncertainty rather
                than as a clean history. Only a search that actually ran to
                completion against a promoter with a history is reported as clean.
              </p>
            </div>
          </div>
        </section>

        {/* ── 5. Gates ── */}
        <section id="gates" aria-labelledby="gates-heading" className={`scroll-mt-20 bg-white ${SECTION}`}>
          <div className={CONTAINER}>
            <h2 id="gates-heading" className={H2}>
              The gates
            </h2>
            <p className={`mt-4 max-w-[68ch] ${BODY}`}>
              Five findings are serious enough that the rest of the record cannot
              average them away. Each one is a ceiling on the composite, applied
              after the composite is computed and before the letter is assigned.
              When more than one fires, the lowest ceiling wins. A gate never
              deducts points; it sets a limit, and the reason is printed on the
              report next to the record that triggered it.
            </p>

            <ol className="mt-8 grid list-none gap-3 p-0 lg:grid-cols-2">
              {GATES.map((gate) => (
                <li key={gate.id} className="rounded-xl border border-crux-border bg-crux-bg-primary p-5">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-7 min-w-9 shrink-0 items-center justify-center rounded-lg border border-crux-border bg-white px-2 font-mono text-[12px] font-bold text-crux-text-primary">
                      {gate.id}
                    </span>
                    <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-crux-text-muted">
                      Best possible grade: {gradeForComposite(gate.cap)}
                    </span>
                  </div>
                  <h3 className={`mt-3 ${H3}`}>{gate.title}</h3>
                  <p className="mt-2 text-pretty text-[14px] leading-relaxed text-crux-text-secondary">
                    {gate.body}
                  </p>
                  <p className="mt-3 font-mono text-[12px] text-crux-text-muted">
                    Composite capped at {gate.cap}
                    {gate.needsConfidentMatch
                      ? ` · needs a match confidence of ${MATCH_FULL_WEIGHT_AT.toFixed(2)}`
                      : ""}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── 6. Limits ── */}
        <section id="limits" aria-labelledby="limits-heading" className={`scroll-mt-20 bg-crux-bg-secondary ${SECTION}`}>
          <div className={CONTAINER}>
            <h2 id="limits-heading" className={H2}>
              What a CRUX Grade is not
            </h2>
            <div className="mt-6 grid max-w-[68ch] gap-4">
              <p className={BODY}>
                A CRUX Grade is CRUX&rsquo;s opinion about a project, formed from the
                records it was able to read at the time of grading. It is a research
                tool for your own diligence — not investment advice, not a legal
                opinion, and not a substitute for a lawyer, a chartered accountant
                or your own reading of the documents.
              </p>
              <p className={BODY}>
                <strong className="font-semibold text-crux-text-primary">
                  The bands have not been calibrated against outcomes.
                </strong>{" "}
                No backtest and no predictive-accuracy study has been run, and the
                curves are not tuned to any record of what did or did not go wrong.
                The thresholds are a published rule, not a measured prediction, and
                CRUX makes no claim about what a grade forecasts.
              </p>
              <p className={BODY}>
                Public records can be incomplete, out of date, or indexed under a
                name that does not match the promoter&rsquo;s. CRUX gives no warranty
                that a grade, a module verdict or a linked record is complete or
                free of error, and a grade says nothing about whether a project is
                sound to buy into.
              </p>
              <p className={BODY}>
                CRUX is not affiliated with, endorsed by, or acting on behalf of
                GujRERA, any court or tribunal, any government department, any
                developer or industry body, or any listing portal.
              </p>
            </div>
          </div>
        </section>

        {/* ── 7. Version, hash and changelog ── */}
        <section id="version" aria-labelledby="version-heading" className={`scroll-mt-20 bg-white ${SECTION}`}>
          <div className={CONTAINER}>
            <h2 id="version-heading" className={H2}>
              Version, hash and changes
            </h2>
            <p className={`mt-4 max-w-[68ch] ${BODY}`}>
              Every grade records the version and the hash of the rules that
              produced it. The hash is computed from the rule tables themselves, so
              two grades carrying the same hash were produced by identical rules,
              and a change to any published rule shows up as a different hash
              whether or not the version number moved.
            </p>
            <p className={`mt-4 max-w-[68ch] ${BODY}`}>
              Currently in force:{" "}
              <span className="font-mono font-medium text-crux-text-primary">{version}</span>,
              hash <span className="font-mono text-[13px] break-all">{hash}</span>.
            </p>

            <h3 className={`mt-10 ${H3}`}>Changelog</h3>
            <ol className="mt-4 flex list-none flex-col gap-3 p-0">
              {CHANGELOG.map((entry) => (
                <li key={entry.version} className="rounded-xl border border-crux-border bg-crux-bg-primary p-5">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h4 className="font-mono text-[15px] font-bold text-crux-text-primary">
                      {entry.version}
                    </h4>
                    <span className="text-[12px] text-crux-text-muted">
                      {entry.date ?? "Date not recorded in the rule tables"}
                    </span>
                  </div>
                  <ul className="mt-3 flex list-none flex-col gap-2 p-0">
                    {entry.changes.map((change) => (
                      <li
                        key={change}
                        className="text-pretty text-[14px] leading-relaxed text-crux-text-secondary"
                      >
                        {change}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
            <p className={`mt-4 max-w-[68ch] ${MUTED}`}>
              Entries record changes to the published rules. A grade produced under
              an earlier version keeps that version&rsquo;s hash and is not silently
              restated under the current rules.
            </p>

          </div>
        </section>
      </main>

      <footer className="border-t border-crux-border bg-crux-bg-primary px-4 py-10">
        <div className={`${CONTAINER} flex flex-wrap items-center justify-between gap-4`}>
          <p className={MUTED}>
            The rules on this page are the rules the grading service runs. Nothing
            here is written by hand from memory of them.
          </p>
          <Link
            href="/"
            className={`inline-flex min-h-11 items-center rounded-lg px-2 text-[14px] font-semibold text-crux-green-mid no-underline transition-colors hover:text-crux-green-dark motion-reduce:transition-none ${FOCUS}`}
          >
            Back to CRUX
          </Link>
        </div>
      </footer>
    </>
  );
}
