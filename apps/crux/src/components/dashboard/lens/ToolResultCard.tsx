"use client";

import Link from "next/link";
import type { LensModuleResult } from "@/hooks/useLensSession";

interface ToolResultCardProps {
  result: LensModuleResult;
}

function ScoreResult({ data }: { data: Record<string, unknown> }) {
  const score = (data.score_composite as number) || (data.score as number) || 0;
  const confidence = Math.round(((data.confidence_score as number) ?? (data.confidence as number) ?? 0) * 100);
  const percentile = (data.percentile as number) || Math.max(1, 100 - score);
  const degraded = data.degraded as boolean;

  return (
    <div
      className="border border-[#e5e5e5] bg-white mt-3"
      style={{ borderRadius: "12px", padding: "16px" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#6e6e6e]"
          style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
        >
          Score Result
        </span>
        <span
          className={`inline-flex items-center px-[6px] py-[1px] text-[10px] font-medium rounded-full ${degraded ? 'bg-amber-50 text-amber-600' : ''}`}
          style={degraded ? {} : { backgroundColor: "#F0FDF4", color: "#16A34A" }}
        >
          {degraded ? "Degraded" : "Fresh"}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-[56px] h-[56px] rounded-full border-2 border-crux-green flex items-center justify-center">
          <span className="text-[18px] font-bold text-crux-green">{score}</span>
        </div>
        <div>
          <p className="text-[14px] font-semibold text-crux-text-primary">Top {percentile}% in area</p>
          <p className="text-[12px] text-crux-text-secondary">Confidence: {confidence}%</p>
        </div>
      </div>
    </div>
  );
}

function ReportResult({ data }: { data: Record<string, unknown> }) {
  const propertyId = data.propertyId as string;
  return (
    <div
      className="border border-[#e5e5e5] bg-white mt-3"
      style={{ borderRadius: "12px", padding: "16px" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#6e6e6e]"
          style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
        >
          Report
        </span>
      </div>
      <p className="text-[14px] text-crux-text-primary mb-3">{data.summary as string || "Report generated."}</p>
      {propertyId && (
        <Link
          href={`/dashboard/reports/${propertyId}`}
          className="text-[13px] font-medium text-crux-green hover:underline"
        >
          View Full Report →
        </Link>
      )}
    </div>
  );
}

function ResearchResult({ data }: { data: Record<string, unknown> }) {
  const verified = (data.verified as number) || 0;
  const contradicted = (data.contradicted as number) || 0;
  const propertyId = data.propertyId as string;

  return (
    <div
      className="border border-[#e5e5e5] bg-white mt-3"
      style={{ borderRadius: "12px", padding: "16px" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#6e6e6e]"
          style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
        >
          Research
        </span>
      </div>
      <div className="flex gap-4 mb-2">
        <span className="text-[13px] text-crux-green font-medium">✓ {verified} verified</span>
        <span className="text-[13px] text-red-500 font-medium">✗ {contradicted} contradicted</span>
      </div>
      {propertyId && (
        <Link
          href={`/dashboard/reports/${propertyId}`}
          className="text-[13px] font-medium text-crux-green hover:underline"
        >
          View Research →
        </Link>
      )}
    </div>
  );
}

function VerificationResult({ data }: { data: Record<string, unknown> }) {
  return (
    <div
      className="border border-[#e5e5e5] bg-white mt-3"
      style={{ borderRadius: "12px", padding: "16px" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#6e6e6e]"
          style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
        >
          Verification
        </span>
      </div>
      <p className="text-[14px] text-crux-text-primary">
        {data.summary as string || `Verified ${data.verified || 0} claims, contradicted ${data.contradicted || 0}.`}
      </p>
    </div>
  );
}

function ComingSoonResult({ type }: { type: string }) {
  return (
    <div
      className="border border-dashed border-[#e5e5e5] bg-gray-50 mt-3"
      style={{ borderRadius: "12px", padding: "16px" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#9CA3AF]"
          style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
        >
          {type}
        </span>
        <span
          className="inline-flex items-center px-[6px] py-[1px] text-[10px] font-medium rounded-full bg-gray-200 text-gray-500"
        >
          Coming Soon
        </span>
      </div>
      <p className="text-[13px] text-crux-text-muted">This feature will be available soon.</p>
    </div>
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
    case "cast":
    case "yield":
      return <ComingSoonResult type={result.type === "cast" ? "CAST" : "Yield"} />;
    default:
      return null;
  }
}
