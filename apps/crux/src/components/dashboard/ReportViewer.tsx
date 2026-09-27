"use client";

import Link from "next/link";
import { CircleAlert, ExternalLink, Loader2 } from "lucide-react";
import {
  usePropertyScore,
  type CgmEvidenceFlag,
  type CgmEvidenceRef,
  type CgmLegalSummary,
  type CgmModuleScore,
} from "@/hooks/usePropertyScore";
import { gradeBand, scoreColor } from "@/lib/grade";
import { formatDate, formatDateLong } from "@/lib/format";
import { Surface, SurfaceTitle } from "./ui/Surface";
import { ReportSection } from "./ReportSection";
import { RiskFlags } from "./RiskFlags";
import { FindingsList } from "./FindingsList";
import { useCruxReport, type CruxReportRow } from "@/hooks/useCruxReport";

/**
 * The printable CRUX report for one property.
 *
 * Everything here comes off the wire: the grade, modules, evidence refs and
 * contradictions from `GET /crux/score/:id/stream`, the prose, flags and signals
 * from `GET /crux/report/:id`. The previous version rendered a fixed script for
 * every property regardless of id — "RERA registration active. 2 pending civil
 * suits in Ahmedabad District Court", "₹4,200/sqft", "Developer has completed 14
 * projects", three invented risks, three invented positives, and a
 * "Generated <today>" line read off the reader's clock rather than the row. Several
 * of those were adverse claims about whoever happened to own the property being
 * viewed. If a row does not carry a fact, the report does not state it.
 */

// Duplicated from CgmGradeSurface, which is owned elsewhere — a module code has to
// read as words in both places. Belongs in @/lib/grade next to the grade bands.
const MODULE_LABEL: Record<string, string> = {
  L: "Legal Standing",
  D: "Delivery Execution",
  T: "Developer Trust",
  F: "Financial Integrity",
  C: "Compliance",
  X: "Location",
  P: "Price Fairness",
};
const MODULE_ORDER = ["L", "D", "T", "F", "C", "X", "P"];

/**
 * Registry names, spelled the way the registry spells them.
 *
 * An evidence ref's `source` is a `namespace:document` pair. Only the namespace is
 * translated, and only to fix its capitalisation — the document part is printed
 * verbatim and an unknown namespace is printed as it arrived. Nothing here invents
 * a meaning for a source, and nothing turns one into a link: the refs carry no URL,
 * and synthesising one would fabricate the very thing a reader would click to
 * check us.
 *
 * Only the four namespaces the engine actually builds refs from are listed:
 * `gujrera:*`, `rera:complaint`, `ecourts:cnr` and `maps:distance*`. An earlier
 * version of this map also pre-spelled mca21, cpcb, residex and cpwd. Those are
 * legacy CPSM *fetcher* sources — they can appear in a score's
 * `data_sources_used`, which is the engine's own claim and is rendered verbatim
 * elsewhere — but they are never evidence-ref namespaces, so those entries could
 * not have fired here. Seeding them still asserted that a module's finding was
 * read from a source it was not, two of them names the product is barred from
 * citing. A namespace that starts appearing gets added once it is real; until
 * then the raw string is the honest fallback.
 */
const SOURCE_NAME: Record<string, string> = {
  gujrera: "GujRERA",
  rera: "RERA",
  ecourts: "eCourts",
  maps: "Maps",
};

function sourceLabel(source: string): string {
  const [ns, ...rest] = source.split(":");
  const name = SOURCE_NAME[ns.toLowerCase()] ?? ns;
  return rest.length > 0 ? `${name} · ${rest.join(":")}` : name;
}

/** The report row's narrative keys, in reading order, with their headings. */
const NARRATIVE_SECTIONS = [
  ["legal_title", "Legal & title"],
  ["location_quality", "Location quality"],
  ["developer_reliability", "Developer reliability"],
  ["market_valuation", "Market valuation"],
  ["demand_signals", "Demand signals"],
] as const;

interface ReportViewerProps {
  propertyId: string;
  address?: string;
}

/** A ref is only shown when it names a source; `ref` and `tier` are internal. */
function EvidenceRefs({ refs }: { refs: CgmEvidenceRef[] }) {
  const usable = refs.filter((r) => r.source?.trim());
  if (usable.length === 0) return null;

  return (
    <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
      {usable.map((r, i) => (
        <li key={`${r.source}-${i}`} className="text-[12px] text-crux-text-secondary">
          {sourceLabel(r.source as string)}
          {r.observed_at && (
            <span className="ml-1 text-crux-text-muted">read {formatDate(r.observed_at)}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

function ModuleBody({ module: m }: { module: CgmModuleScore }) {
  if (m.not_assessed) {
    return (
      <p className="text-[14px] leading-relaxed text-crux-text-secondary">
        Not assessed — the records this module needs were not available for this property.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-crux-bg-secondary">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.min(Math.max(m.score, 0), 100)}%`,
            backgroundColor: scoreColor(m.score),
          }}
        />
      </div>
      {m.verdict && <p className="text-[14px] leading-relaxed text-crux-text-secondary">{m.verdict}</p>}
      <EvidenceRefs refs={m.evidence_refs ?? []} />
    </div>
  );
}

/**
 * Published-claim vs record contradictions from the score row.
 *
 * Both sides are printed as the engine wrote them, with no paraphrase and no
 * ranking: the type carries no severity, so every item gets the same marker rather
 * than a colour that would grade an adverse statement about a named builder.
 */
function EvidenceFlags({ flags }: { flags: CgmEvidenceFlag[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {flags.map((flag, i) => (
        <li key={`${flag.code}-${i}`} className="flex items-start gap-2">
          <CircleAlert size={16} className="mt-0.5 shrink-0 text-amber-600" aria-hidden="true" />
          <div className="min-w-0 space-y-1">
            {flag.claim && (
              <p className="text-[14px] leading-relaxed text-crux-text-primary">
                <span className="text-crux-text-muted">Published: </span>
                {flag.claim}
              </p>
            )}
            {flag.record && (
              <p className="text-[14px] leading-relaxed text-crux-text-primary">
                <span className="text-crux-text-muted">Record: </span>
                {flag.record}
              </p>
            )}
            {flag.quote && (
              <blockquote className="border-l-2 border-crux-border pl-3 text-[13px] italic text-crux-text-secondary">
                {flag.quote}
              </blockquote>
            )}
            <p className="text-[12px] text-crux-text-muted">
              {flag.url && (
                <a
                  href={flag.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex max-w-full items-center gap-1 rounded text-crux-green-dark underline decoration-crux-green/40 underline-offset-2 hover:decoration-crux-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-1"
                >
                  <span className="truncate">Source page</span>
                  <ExternalLink size={10} className="shrink-0" aria-hidden="true" />
                </a>
              )}
              {flag.url && flag.observed_at && <span> · </span>}
              {flag.observed_at && <span>read {formatDate(flag.observed_at)}</span>}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * The legal module's counting.
 *
 * `cases_possible` are cases that carry a matching name but could not be tied to
 * this promoter, so they were deliberately left out of the maths. Printing only the
 * counted figure would be the flattering version of this number, and printing a
 * combined total would be the alarmist one.
 */
function LegalCounting({ summary }: { summary: CgmLegalSummary }) {
  const counted = summary.cases_counted;
  const possible = summary.cases_possible;
  if (counted == null && possible == null && !summary.verdict?.trim()) return null;

  return (
    <Surface className="mb-6">
      <SurfaceTitle>Court records counted</SurfaceTitle>
      {summary.verdict?.trim() && (
        <p className="mb-3 text-[14px] leading-relaxed text-crux-text-secondary">{summary.verdict}</p>
      )}
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {counted != null && (
          <div>
            <dt className="text-[12px] uppercase tracking-[0.04em] text-crux-text-secondary">
              Tied to this promoter
            </dt>
            <dd className="text-[18px] font-semibold tabular-nums text-crux-text-primary">{counted}</dd>
          </div>
        )}
        {possible != null && (
          <div>
            <dt className="text-[12px] uppercase tracking-[0.04em] text-crux-text-secondary">
              Name matched, not tied — excluded
            </dt>
            <dd className="text-[18px] font-semibold tabular-nums text-crux-text-primary">{possible}</dd>
          </div>
        )}
      </dl>
    </Surface>
  );
}

function Citations({ report }: { report: CruxReportRow }) {
  const cites = (report.citations ?? []).filter((c) => (c.source_title ?? c.claim ?? "").trim());
  if (cites.length === 0) return null;

  return (
    <Surface className="mb-6">
      <SurfaceTitle>Citations</SurfaceTitle>
      <ul className="flex flex-col gap-2">
        {cites.map((c, i) => {
          const title = (c.source_title ?? c.claim) as string;
          // Only an http(s) target becomes a link; a ledger path is named, not linked.
          const href = c.source_url_or_path?.startsWith("http") ? c.source_url_or_path : null;
          return (
            <li key={`${title}-${i}`} className="text-[13px]">
              {c.claim && c.source_title && <p className="text-crux-text-primary">{c.claim}</p>}
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex max-w-full items-center gap-1 rounded text-crux-green-dark underline decoration-crux-green/40 underline-offset-2 hover:decoration-crux-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-1"
                >
                  <span className="truncate">{title}</span>
                  <ExternalLink size={10} className="shrink-0" aria-hidden="true" />
                </a>
              ) : (
                <span className="text-crux-text-secondary">{title}</span>
              )}
            </li>
          );
        })}
      </ul>
    </Surface>
  );
}

export function ReportViewer({ propertyId, address }: ReportViewerProps) {
  const { score, isLoading, isComputing, error, quotaExceeded, progressMessages } =
    usePropertyScore(propertyId);
  // The narrative half of the report. Loads in parallel — a slow or refused report
  // must not hide the grade, and a missing grade must not hide the narrative.
  const { report, isLoading: reportLoading, error: reportError, isSignedIn } =
    useCruxReport(propertyId);

  const heading = (
    <>
      <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-crux-text-primary">
        CRUX Report
      </h1>
      <p className="mt-2 break-words text-[16px] text-crux-text-primary">
        {address ?? <span className="text-crux-text-secondary">Property {propertyId}</span>}
      </p>
    </>
  );

  if (isLoading || isComputing) {
    const latest = progressMessages[progressMessages.length - 1];
    return (
      <Surface className="mx-auto max-w-[800px]">
        {heading}
        <div className="mt-6 flex items-center gap-2 text-[14px] text-crux-text-secondary">
          <Loader2 size={16} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
          {/* The engine's own progress line, when it sent one — not a guess at a stage. */}
          <span>{latest ?? "Reading the record…"}</span>
        </div>
      </Surface>
    );
  }

  if (quotaExceeded) {
    return (
      <Surface className="mx-auto max-w-[800px]">
        {heading}
        <p className="mt-6 text-[14px] leading-relaxed text-crux-text-secondary">
          You have used {quotaExceeded.reportCount} of {quotaExceeded.maxReports} free reports.
          Sign in or upgrade to open this one.
        </p>
      </Surface>
    );
  }

  if (error) {
    return (
      <Surface className="mx-auto max-w-[800px]">
        {heading}
        <p className="mt-6 text-[14px] leading-relaxed text-crux-text-secondary">{error}</p>
      </Surface>
    );
  }

  // No score row is a normal state for a property that has not been run yet, and it
  // is the case the old viewer handled worst: it rendered a full report anyway.
  if (!score) {
    return (
      <Surface className="mx-auto max-w-[800px]">
        {heading}
        <p className="mt-6 text-[14px] leading-relaxed text-crux-text-secondary">
          This property has not been scored yet, so there is no report to show.
        </p>
        <Link
          href={`/dashboard/properties/${propertyId}`}
          className="mt-4 inline-flex items-center rounded-xl bg-crux-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-crux-green-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
        >
          Open the property
        </Link>
      </Surface>
    );
  }

  const band = gradeBand(score.grade);
  const confidencePct = Math.round((score.confidence_score ?? 0) * 100);
  const modules = (score.module_scores ?? [])
    .slice()
    .sort((a, b) => MODULE_ORDER.indexOf(a.code) - MODULE_ORDER.indexOf(b.code));
  const evidenceFlags = (score.evidence_flags ?? []).filter((f) => f.claim?.trim() || f.record?.trim());
  const sources = (score.data_sources_used ?? []).filter((s) => s?.trim());
  const narratives = NARRATIVE_SECTIONS.filter(([key]) => report?.category_narratives?.[key]?.trim());
  // The report row knows when it was written; the score row only when it was scored.
  const generatedAt = report?.generated_at ?? score.created_at;

  return (
    <div className="mx-auto max-w-[800px]">
      <Surface className="mb-6">
        {heading}
        <p className="mt-2 text-[13px] text-crux-text-secondary">
          Generated {formatDateLong(generatedAt)}
          {score.intent_profile ? ` · Intent: ${score.intent_profile}` : ""}
          {score.crux_version ? ` · Engine ${score.crux_version}` : ""}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-crux-border pt-6">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-[22px] font-bold"
            style={{ color: band.fg, backgroundColor: band.bg, boxShadow: `inset 0 0 0 1px ${band.ring}` }}
          >
            {band.label}
          </div>
          <div className="min-w-0">
            <p className="text-[14px] text-crux-text-primary">{band.meaning}</p>
            <p className="mt-1 text-[13px] text-crux-text-secondary">
              {score.score_composite !== null
                ? `Composite ${Math.round(score.score_composite)}/100`
                : // NR carries no composite; printing one would invent it.
                  (score.not_rated_reason ?? "Not enough verified data to publish a composite score.")}
              {` · Confidence ${confidencePct}%`}
              {score.degraded ? " · degraded run" : ""}
              {score.provisional ? " · provisional" : ""}
            </p>
          </div>
        </div>

        {/* The report agent's own summary, verbatim. Nothing stands in for it. */}
        {report?.summary?.trim() && (
          <div className="mt-6 border-t border-crux-border pt-6">
            <h2 className="mb-2 text-[16px] font-semibold text-crux-text-primary">Summary</h2>
            <p className="text-[15px] leading-relaxed text-crux-text-secondary">{report.summary}</p>
          </div>
        )}

        {/* Why the narrative half is missing, rather than a silently shorter report. */}
        {!report && !reportLoading && (
          <div className="mt-6 border-t border-crux-border pt-6">
            <p className="text-[13px] text-crux-text-secondary">
              {!isSignedIn
                ? "Sign in to read the written analysis for this property."
                : (reportError ?? "The written analysis is not available for this property.")}
            </p>
          </div>
        )}
      </Surface>

      {modules.length > 0 && (
        <Surface padding="none" className="mb-6 px-6 py-2">
          {modules.map((m, i) => (
            <ReportSection
              key={m.code}
              title={MODULE_LABEL[m.code] ?? m.code}
              defaultOpen={i === 0}
              meta={m.not_assessed ? "Not assessed" : `${Math.round(m.score)}/100`}
            >
              <ModuleBody module={m} />
            </ReportSection>
          ))}
        </Surface>
      )}

      {narratives.length > 0 && (
        <Surface padding="none" className="mb-6 px-6 py-2">
          {narratives.map(([key, label], i) => (
            <ReportSection key={key} title={label} defaultOpen={i === 0}>
              <p className="text-[14px] leading-relaxed text-crux-text-secondary">
                {report?.category_narratives?.[key]}
              </p>
            </ReportSection>
          ))}
        </Surface>
      )}

      {/*
        Risks and positives are shown side by side, and both are shown even when
        empty. A report that lists only what is wrong is not a neutral instrument,
        and "no flags recorded" is itself a result a buyer came here to read.
      */}
      {report && (
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Surface>
            <SurfaceTitle>Risk flags</SurfaceTitle>
            <RiskFlags flags={report.risk_flags} />
          </Surface>
          <Surface>
            <SurfaceTitle>Positive signals</SurfaceTitle>
            <FindingsList
              items={report.positive_signals}
              tone="positive"
              emptyLabel="No positive signals recorded for this property."
            />
          </Surface>
        </div>
      )}

      {report?.research_highlights && report.research_highlights.length > 0 && (
        <Surface className="mb-6">
          <SurfaceTitle>Research highlights</SurfaceTitle>
          <FindingsList items={report.research_highlights} tone="neutral" />
        </Surface>
      )}

      {score.legal_summary && <LegalCounting summary={score.legal_summary} />}

      {/* Only when the engine recorded a published claim that the record contradicts. */}
      {evidenceFlags.length > 0 && (
        <Surface className="mb-6">
          <SurfaceTitle>Published claims the record contradicts</SurfaceTitle>
          <p className="-mt-2 mb-3 text-[13px] text-crux-text-secondary">
            Self-published material never moves a grade. Where it disagrees with the regulator&rsquo;s
            record, both sides are shown.
          </p>
          <EvidenceFlags flags={evidenceFlags} />
        </Surface>
      )}

      {report && <Citations report={report} />}

      {sources.length > 0 && (
        <Surface className="mb-6">
          <SurfaceTitle>Sources consulted</SurfaceTitle>
          <ul className="flex flex-wrap gap-2">
            {sources.map((s) => (
              <li
                key={s}
                className="rounded-full bg-crux-bg-secondary px-2.5 py-1 text-[12px] text-crux-text-secondary"
              >
                {s}
              </li>
            ))}
          </ul>
        </Surface>
      )}

      <div className="border-t border-crux-border pb-8 pt-6">
        {/* The backend owns the compliance wording and appends it to the row. */}
        {report?.sebi_disclaimer?.trim() && (
          <p className="mb-2 text-center text-[12px] leading-relaxed text-crux-text-muted">
            {report.sebi_disclaimer}
          </p>
        )}
        <p className="text-center text-[12px] leading-relaxed text-crux-text-muted">
          This report is generated from public records and may contain inaccuracies. Always seek
          independent verification before making property decisions.
        </p>
      </div>
    </div>
  );
}
