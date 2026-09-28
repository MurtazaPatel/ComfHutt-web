"use client";

// CGM-1.0 consumer surface (spec §0). Grade + cohort headline, seven module verdict
// chips with their source attributions, a confidence meter, the legal counting split,
// the cross-check contradictions, honest NR / provisional / Not-Assessed states, and
// (the Vastu card is computed but deliberately not rendered — see below). Rendered
// only when the score row carries module_scores
// (i.e. produced by CGM_V1_ENABLED) — legacy rows keep the old view.

import Link from "next/link";
import { ExternalLink, Scale } from "lucide-react";
import type {
  CgmEvidenceFlag,
  CgmEvidenceRef,
  CgmLegalSummary,
  CgmModuleScore,
  CruxScore,
} from "@/hooks/usePropertyScore";
import { gradeBand, scoreColor } from "@/lib/grade";
import { formatDate } from "@/lib/format";
import { Surface, SurfaceTitle } from "@/components/dashboard/ui/Surface";

// Every module score is "higher = better" (100 = excellent). Labels must read
// positively so a high score isn't misread as a negative — e.g. D:100 is EXCELLENT
// delivery execution, not "100% risk". Keep all labels framed as strengths.
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

function cohortLine(score: CruxScore): string {
  const pct = score.cohort_percentile;
  const n = score.cohort?.n ?? 0;
  const region = (score.cohort?.id ?? "").split("|")[0] || "comparable";
  const type = (score.cohort?.id ?? "").split("|")[1] || "projects";
  // A rank off a handful of rows is noise dressed as a statistic; 30 is the floor
  // below which CRUX says nothing about the cohort at all.
  if (pct != null && n >= 30) {
    const top = Math.max(1, Math.round(100 - pct));
    return `Top ${top}% of comparable ${region} ${type} projects`;
  }
  return "Graded on absolute standards — cohort ranking unlocks as the corpus grows";
}

// ── Defensive readers ─────────────────────────────────────────────────────────
// Rows written before these columns landed carry none of this, and the engine may
// add codes and sources faster than this file learns them. Everything below drops
// what it cannot display and renders nothing — never an empty box, never a guess.

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function finite(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/** Only http(s) — a `javascript:` or relative href in an API payload is not a citation. */
function externalUrl(value: unknown): string | null {
  const raw = text(value);
  if (!raw) return null;
  try {
    const parsed = new URL(raw);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}

// `source` arrives as `namespace:document`. Both halves are mapped from the values
// the adapter actually emits; anything unmapped falls through as the raw token
// rather than being guessed at.
const SOURCE_NAMESPACE: Record<string, string> = {
  gujrera: "GujRERA",
  rera: "RERA",
  ecourts: "eCourts",
  maps: "Maps",
};
const SOURCE_DOCUMENT: Record<string, string> = {
  json: "project record",
  form3: "Form 3",
  documents: "filed documents",
  unit_summary: "unit summary",
  complaint: "complaint",
  "distance+places": "distance and places",
  cnr: "CNR record",
};

function sourceLabel(source: string): string {
  const [namespace, ...rest] = source.split(":");
  const head = SOURCE_NAMESPACE[namespace] ?? namespace;
  const doc = rest.join(":");
  if (!doc) return head;
  return `${head} · ${SOURCE_DOCUMENT[doc] ?? doc}`;
}

type ReadableSource = { label: string; observedAt: string | null };

/**
 * One entry per distinct source, carrying the most recent read date across the refs
 * that share it. A legal module can hold dozens of refs from the same register; the
 * reader needs to know which registers were read and how recently, not a list length.
 */
function readSources(raw: CgmEvidenceRef[] | null | undefined): ReadableSource[] {
  if (!Array.isArray(raw)) return [];
  const newest = new Map<string, string | null>();
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const source = text(item.source);
    if (!source) continue; // no attribution → nothing honest to show
    const observedAt = text(item.observed_at);
    const current = newest.get(source);
    if (!newest.has(source) || (observedAt && (!current || observedAt > current))) {
      newest.set(source, observedAt ?? current ?? null);
    }
  }
  return [...newest.entries()].map(([source, observedAt]) => ({
    label: sourceLabel(source),
    observedAt,
  }));
}

// Headings for the four codes the engine emits. Each states the disagreement and
// nothing more: the page names a real builder, so the wording stays descriptive.
const FLAG_HEADING: Record<string, string> = {
  project_count_overstated: "Project count disagrees with the register",
  history_predates_registration: "Claimed history predates the registered entity",
  web_possession_claim_vs_record: "Possession claim disagrees with the filed record",
  web_allegation_absent_from_record: "Allegation published online, nothing in the record",
};

type ReadableFlag = {
  key: string;
  heading: string;
  claim: string | null;
  record: string | null;
  quote: string | null;
  url: string | null;
  observedAt: string | null;
};

function readFlags(raw: CgmEvidenceFlag[] | null | undefined): ReadableFlag[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item, i) => {
    if (!item || typeof item !== "object") return [];
    const claim = text(item.claim);
    const record = text(item.record);
    if (!claim && !record) return []; // neither side of the contradiction → nothing to show
    const code = text(item.code);
    return [
      {
        key: code ? `${code}-${i}` : `flag-${i}`,
        // An unmapped code still renders; it just doesn't get a headline we invented.
        heading: (code && FLAG_HEADING[code]) || "Published claim differs from the record",
        claim,
        record,
        quote: text(item.quote),
        url: externalUrl(item.url),
        observedAt: text(item.observed_at),
      },
    ];
  });
}

// ── Cross-checks ──────────────────────────────────────────────────────────────
function CrossChecks({ flags }: { flags: ReadableFlag[] }) {
  if (flags.length === 0) return null; // no flags → no section, not an empty card
  return (
    <Surface as="section">
      <SurfaceTitle as="h3">Cross-checks</SurfaceTitle>
      <p className="-mt-2 mb-3 text-[12px] text-crux-text-secondary">
        Where something published about this project disagrees with the regulator&rsquo;s record. Shown as the engine
        recorded it. Self-published material never moves the grade.
      </p>
      <ul className="space-y-3">
        {flags.map((flag) => (
          <li key={flag.key} className="rounded-xl bg-amber-50 px-3 py-2.5 ring-1 ring-amber-200">
            <p className="text-[12px] font-semibold text-amber-900">{flag.heading}</p>
            <dl className="mt-1.5 space-y-1 text-[12px] leading-relaxed">
              {flag.claim && (
                <div className="flex flex-wrap gap-x-1.5">
                  <dt className="font-medium text-amber-900">Claim</dt>
                  <dd className="min-w-0 flex-1 text-crux-text-secondary">{flag.claim}</dd>
                </div>
              )}
              {flag.record && (
                <div className="flex flex-wrap gap-x-1.5">
                  <dt className="font-medium text-amber-900">Record</dt>
                  <dd className="min-w-0 flex-1 text-crux-text-secondary">{flag.record}</dd>
                </div>
              )}
            </dl>
            {flag.quote && (
              <blockquote className="mt-2 border-l-2 border-amber-300 pl-2 text-[12px] italic text-crux-text-secondary">
                {flag.quote}
              </blockquote>
            )}
            <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-[11px] text-crux-text-muted">
              {flag.url && (
                <a
                  href={flag.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded text-crux-green-dark underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-1"
                >
                  Open the page this was read from
                  <ExternalLink size={10} aria-hidden="true" />
                </a>
              )}
              {flag.observedAt && <span>Read {formatDate(flag.observedAt)}</span>}
            </p>
          </li>
        ))}
      </ul>
    </Surface>
  );
}

// ── Legal counting ────────────────────────────────────────────────────────────
function LegalRecord({ summary }: { summary: CgmLegalSummary }) {
  const counted = finite(summary.cases_counted);
  const possible = finite(summary.cases_possible);
  const coverage = finite(summary.coverage);
  const exposure = finite(summary.subject_exposure);
  const verdict = text(summary.verdict);
  // Nothing numeric and nothing said → the column exists but is empty on this row.
  if (counted == null && possible == null && !verdict) return null;

  return (
    <Surface as="section">
      <SurfaceTitle
        as="h3"
        action={verdict ? <span className="text-[13px] font-semibold text-crux-text-secondary">{verdict}</span> : undefined}
      >
        <span className="inline-flex items-center gap-1.5">
          <Scale size={14} aria-hidden="true" className="text-crux-text-muted" />
          Legal record
        </span>
      </SurfaceTitle>

      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {counted != null && (
          <div className="rounded-xl bg-crux-bg-secondary px-3 py-2.5">
            <dt className="text-[12px] font-medium text-crux-text-primary">Counted</dt>
            <dd className="mt-0.5 text-[20px] font-semibold text-crux-text-primary">{counted}</dd>
            <p className="mt-0.5 text-[11px] leading-relaxed text-crux-text-secondary">
              Tied to this promoter with enough confidence to enter the grade.
            </p>
          </div>
        )}
        {possible != null && (
          <div className="rounded-xl bg-crux-bg-secondary px-3 py-2.5">
            <dt className="text-[12px] font-medium text-crux-text-primary">Named but not counted</dt>
            <dd className="mt-0.5 text-[20px] font-semibold text-crux-text-primary">{possible}</dd>
            <p className="mt-0.5 text-[11px] leading-relaxed text-crux-text-secondary">
              {/* The distinction the whole product rests on: a matching name is not
                  a match, so these were excluded from the grade rather than counted. */}
              Carry a matching name but could not be tied to this promoter, so they were excluded from the grade.
            </p>
          </div>
        )}
      </dl>

      {(coverage != null || exposure != null) && (
        <div className="mt-3 space-y-1 border-t border-crux-border pt-3 text-[11px] leading-relaxed text-crux-text-secondary">
          {coverage != null && <p>Search coverage: {Math.round(coverage * 100)}% of the planned searches ran.</p>}
          {exposure != null && (
            <p>
              Searchable history: {Math.round(exposure * 100)}%. Where there is little history to search, a quiet
              record is not the same as a clean one.
            </p>
          )}
        </div>
      )}
    </Surface>
  );
}

// ── NR ───────────────────────────────────────────────────────────────────────
function NotRated({ score, flags }: { score: CruxScore; flags: ReadableFlag[] }) {
  const band = gradeBand("NR");
  return (
    <div className="space-y-6">
      <Surface as="section">
        <div className="mb-3 flex items-center gap-3">
          <span
            className="inline-flex size-14 shrink-0 items-center justify-center rounded-[14px] text-[22px] font-bold"
            style={{ color: band.fg, background: band.bg, boxShadow: `inset 0 0 0 1px ${band.ring}` }}
          >
            {band.label}
          </span>
          <div className="min-w-0">
            <h2 className="text-[18px] font-semibold leading-tight text-crux-text-primary">Not Rated</h2>
            <p className="text-[13px] text-crux-text-secondary">{band.meaning}</p>
          </div>
        </div>
        <p className="text-[13px] leading-relaxed text-crux-text-secondary">
          {/* The engine's own reason names the missing filing when it has one; the
              fallback keeps the promise without pretending to know which one. */}
          {score.not_rated_reason ??
            "Refusing to grade thin data is itself a trust signal — CRUX grades this the moment the missing filings land."}
        </p>
      </Surface>
      {score.legal_summary && <LegalRecord summary={score.legal_summary} />}
      <CrossChecks flags={flags} />
      <GradeDisclaimer />
    </div>
  );
}

/**
 * What a grade is, inline, on the surface that carries it.
 *
 * This line is not decoration and it is not duplicated from the footer by
 * accident. CRUX publishes adverse opinions about named, living businesses; the
 * one sentence that makes that defensible is that a grade is an opinion formed
 * from public records. A reader looking at a C should not have to scroll to the
 * bottom of a different page to learn that.
 *
 * It renders on the Not Rated branch too. "We could not grade this" is a
 * published statement about a real builder as much as a D is.
 */
function GradeDisclaimer() {
  return (
    <p className="text-[12px] leading-relaxed text-crux-text-muted">
      A CRUX Grade is an opinion based on public records.{" "}
      <Link
        href="/disclaimer"
        className="font-medium text-crux-green-mid underline underline-offset-2 transition-colors hover:text-crux-green-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
      >
        What this means
      </Link>
      .
    </p>
  );
}

// ── Module chip ────────────────────────────────────────────────────────────────
function ModuleChip({ m }: { m: CgmModuleScore }) {
  const label = MODULE_LABEL[m.code] ?? m.code;
  const sources = readSources(m.evidence_refs);

  if (m.not_assessed) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-xl bg-crux-bg-secondary px-3 py-2 ring-1 ring-black/5">
        <span className="text-[13px] font-medium text-crux-text-secondary">{label}</span>
        <span className="text-[11px] font-medium uppercase tracking-wide text-crux-text-muted">Not Assessed</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-black/5">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-crux-text-primary">{label}</span>
        <span className="text-[13px] font-semibold" style={{ color: scoreColor(m.score) }}>
          {Math.round(m.score)}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-crux-bg-secondary">
        <div
          className="h-full rounded-full transition-[width] duration-700 motion-reduce:transition-none"
          style={{ width: `${Math.min(m.score, 100)}%`, backgroundColor: scoreColor(m.score) }}
        />
      </div>
      <p className="mt-1 text-[11px] text-crux-text-secondary">{m.verdict}</p>

      {/* What this verdict was read from. These are attributions, not links: the
          engine's evidence refs point into its own ledger and carry no public URL,
          and inventing one from the source name is exactly the error this surface
          exists to avoid. */}
      {sources.length > 0 && (
        <ul className="mt-1.5 flex flex-wrap gap-1">
          {sources.map((src) => (
            <li
              key={src.label}
              className="rounded-md bg-crux-bg-secondary px-1.5 py-0.5 text-[10px] text-crux-text-secondary"
            >
              {src.label}
              {src.observedAt && <span className="text-crux-text-muted"> · as of {formatDate(src.observedAt)}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Main surface ────────────────────────────────────────────────────────────────
export function CgmGradeSurface({ score }: { score: CruxScore }) {
  const grade = score.grade ?? "NR";
  const composite = score.score_composite;
  const flags = readFlags(score.evidence_flags);
  if (grade === "NR" || composite == null) return <NotRated score={score} flags={flags} />;

  const band = gradeBand(grade);
  const modules = (score.module_scores ?? []).slice().sort(
    (a, b) => MODULE_ORDER.indexOf(a.code) - MODULE_ORDER.indexOf(b.code),
  );
  const confidencePct = Math.round((score.confidence_score ?? 0) * 100);
  const gates = score.gates_applied ?? [];

  return (
    <div className="space-y-6">
      {/* Grade headline */}
      <Surface as="section">
        <div className="flex items-center gap-4 sm:gap-5">
          <span
            className="inline-flex size-[72px] shrink-0 items-center justify-center rounded-[18px] text-[34px] font-bold leading-none sm:size-[84px] sm:rounded-[20px] sm:text-[40px]"
            style={{ color: band.fg, background: band.bg, boxShadow: `inset 0 0 0 1.5px ${band.ring}` }}
          >
            {band.label}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <h2 className="text-[20px] font-semibold tracking-tight text-crux-text-primary sm:text-[22px]">
                CRUX Grade {band.label}
              </h2>
              <span className="text-[13px] text-crux-text-muted">· {Math.round(composite)}/100</span>
            </div>
            <p className="mt-0.5 text-[13px] text-crux-text-secondary">{cohortLine(score)}</p>
            {score.provisional && (
              <span className="mt-2 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-amber-200">
                Provisional — limited data, grade may firm up
              </span>
            )}
          </div>
        </div>

        {/* Confidence meter */}
        <div className="mt-5">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-[12px] font-medium text-crux-text-secondary">Confidence</span>
            <span className="text-[12px] font-semibold text-crux-text-primary">
              {confidencePct}%{score.degraded ? " · degraded" : ""}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-crux-bg-secondary">
            <div
              className={`h-full rounded-full ${score.degraded ? "bg-amber-500" : "bg-crux-green"}`}
              style={{ width: `${confidencePct}%` }}
            />
          </div>
        </div>

        {/* Fatal-flag gate banner */}
        {gates.length > 0 && (
          <div className="mt-4 rounded-xl bg-red-50 px-3 py-2 ring-1 ring-red-200">
            <p className="text-[12px] font-semibold text-red-700">
              Grade capped by a fatal flag ({gates.map((g) => g.gate_id).join(", ")}) — a material risk overrides the
              average.
            </p>
          </div>
        )}
      </Surface>

      {/* Seven module verdict chips */}
      <Surface as="section">
        <SurfaceTitle as="h3">Module Verdicts</SurfaceTitle>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {modules.map((m) => (
            <ModuleChip key={m.code} m={m} />
          ))}
        </div>
      </Surface>

      {score.legal_summary && <LegalRecord summary={score.legal_summary} />}

      <CrossChecks flags={flags} />

      <GradeDisclaimer />

      {/*
        The Vastu overlay is not rendered. The engine still computes it and the row
        still carries `vastu_overlay`, but the feature is listed as not built, so
        showing it would put an unfinished surface on the page that carries the
        product's most sensitive claims. The field stays typed in usePropertyScore
        so nothing breaks when it is switched back on.
      */}
    </div>
  );
}
