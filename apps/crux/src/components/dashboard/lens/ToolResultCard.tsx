"use client";

import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import type { LensModuleResult } from "@/hooks/useLensSession";
import { gradeBand, isUngraded, scoreColor } from "@/lib/grade";
import { Surface } from "@/components/dashboard/ui/Surface";

interface ToolResultCardProps {
  result: LensModuleResult;
}

/**
 * Module results arrive as an untyped bag from the agent. Every field is read
 * through one of these two readers, so a missing field renders as "not returned"
 * rather than as 0 or as an empty string — the card can only state what the backend
 * actually sent.
 */
function num(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function CardLabel({ children, chip }: { children: React.ReactNode; chip?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-crux-text-secondary">
        {children}
      </span>
      {chip}
    </div>
  );
}

const linkClass =
  "inline-flex items-center gap-1 rounded text-[13px] font-medium text-crux-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2";

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <Surface padding="tight" className="mt-3 w-full max-w-[420px]">
      {children}
    </Surface>
  );
}

function ScoreResult({ data }: { data: Record<string, unknown> }) {
  const score = num(data.score_composite) ?? num(data.score);
  const confidenceRaw = num(data.confidence_score) ?? num(data.confidence);
  const confidence = confidenceRaw === null ? null : Math.round(confidenceRaw * 100);
  const grade = str(data.grade);
  // Only a real boolean says anything about freshness; an absent flag says nothing.
  const degraded = typeof data.degraded === "boolean" ? data.degraded : null;
  const band = grade ? gradeBand(grade) : null;

  return (
    <CardShell>
      <CardLabel
        chip={
          degraded === null ? undefined : (
            <span
              className={`inline-flex items-center rounded-full px-[6px] py-[1px] text-[10px] font-medium ${
                degraded ? "bg-amber-50 text-amber-700" : "bg-crux-bg-accent text-crux-green-mid"
              }`}
            >
              {degraded ? "Degraded" : "Fresh"}
            </span>
          )
        }
      >
        Score
      </CardLabel>

      <div className="flex items-center gap-4">
        {/*
         * The headline used to be "Top {percentile}% in area", where percentile fell
         * back to `100 - score` whenever the API sent none — a rank against a cohort
         * CRUX does not have. It is gone, along with the fallback: the score and its
         * confidence are the two things the engine actually returned.
         */}
        <div
          className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full border-2"
          style={
            score === null
              ? undefined
              : { borderColor: scoreColor(score), color: scoreColor(score) }
          }
        >
          {score === null ? (
            <span className="text-[11px] font-semibold uppercase text-crux-text-muted">N/A</span>
          ) : (
            <span className="text-[18px] font-bold">{score}</span>
          )}
        </div>

        <div className="min-w-0">
          {score === null && !band ? (
            <p className="text-[14px] font-semibold text-crux-text-primary">Not scored yet</p>
          ) : band ? (
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full border px-2 py-[1px] text-[11px] font-semibold ${band.chipClass}`}
              >
                {band.label}
              </span>
              {!isUngraded(grade) && (
                <span className="text-[13px] text-crux-text-secondary">CRUX Grade</span>
              )}
            </div>
          ) : (
            <p className="text-[14px] font-semibold text-crux-text-primary">Composite score</p>
          )}

          {band && <p className="mt-1 text-[12px] text-crux-text-secondary">{band.meaning}</p>}

          {confidence !== null && (
            <p className="mt-1 text-[12px] text-crux-text-secondary">Confidence: {confidence}%</p>
          )}
        </div>
      </div>
    </CardShell>
  );
}

function ReportResult({ data }: { data: Record<string, unknown> }) {
  const propertyId = str(data.propertyId);
  const summary = str(data.summary);

  return (
    <CardShell>
      <CardLabel>Report</CardLabel>
      <p
        className={`mb-3 text-[14px] ${summary ? "text-crux-text-primary" : "text-crux-text-muted"}`}
      >
        {summary ?? "No summary returned."}
      </p>
      {propertyId && (
        <Link href={`/dashboard/reports/${propertyId}`} className={linkClass}>
          View full report
          <ArrowRight size={13} />
        </Link>
      )}
    </CardShell>
  );
}

function ResearchResult({ data }: { data: Record<string, unknown> }) {
  // Counts, not defaults: "0 verified" is a finding, and claiming it when the field
  // was absent would be inventing one.
  const verified = num(data.verified);
  const contradicted = num(data.contradicted);
  const propertyId = str(data.propertyId);

  return (
    <CardShell>
      <CardLabel>Research</CardLabel>
      {verified === null && contradicted === null ? (
        <p className="mb-2 text-[13px] text-crux-text-muted">No counts returned.</p>
      ) : (
        <div className="mb-2 flex flex-wrap gap-4">
          {verified !== null && (
            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-crux-green">
              <Check size={14} aria-hidden="true" />
              {verified} verified
            </span>
          )}
          {contradicted !== null && (
            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-red-600">
              <X size={14} aria-hidden="true" />
              {contradicted} contradicted
            </span>
          )}
        </div>
      )}
      {propertyId && (
        <Link href={`/dashboard/reports/${propertyId}`} className={linkClass}>
          View research
          <ArrowRight size={13} />
        </Link>
      )}
    </CardShell>
  );
}

function VerificationResult({ data }: { data: Record<string, unknown> }) {
  const summary = str(data.summary);
  const verified = num(data.verified);
  const contradicted = num(data.contradicted);

  // Fall back to the counts only when they are really there; the old template
  // printed "Verified 0 claims, contradicted 0" for a payload that said neither.
  const derived =
    verified !== null || contradicted !== null
      ? [
          verified !== null ? `${verified} verified` : null,
          contradicted !== null ? `${contradicted} contradicted` : null,
        ]
          .filter(Boolean)
          .join(" · ")
      : null;

  const body = summary ?? derived;

  return (
    <CardShell>
      <CardLabel>Verification</CardLabel>
      <p className={`text-[14px] ${body ? "text-crux-text-primary" : "text-crux-text-muted"}`}>
        {body ?? "No verification details returned."}
      </p>
    </CardShell>
  );
}

export function ToolResultCard({ result }: ToolResultCardProps) {
  switch (result.type) {
    case "score":
      return <ScoreResult data={result.data} />;
    case "report":
      return <ReportResult data={result.data} />;
    case "research":
      return <ResearchResult data={result.data} />;
    case "verification":
      return <VerificationResult data={result.data} />;
    // "cast" and "yield" are in the union but unshipped, so no backend path emits
    // them. They used to render a dashed "Coming Soon" card — a roadmap promise
    // dropped into a transcript, carrying nothing the user asked for. Rendering
    // nothing is the honest treatment until those modules actually return data.
    default:
      return null;
  }
}
