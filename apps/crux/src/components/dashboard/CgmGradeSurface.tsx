"use client";

// CGM-1.0 consumer surface (spec §0). Grade + cohort percentile headline, seven
// module verdict chips, a confidence meter, honest NR / provisional / Not-Assessed
// states, and the zero-impact Vastu card. Rendered only when the score row carries
// module_scores (i.e. produced by CGM_V1_ENABLED) — legacy rows keep the old view.

import type { CruxScore, CgmModuleScore } from "@/hooks/usePropertyScore";

const MODULE_LABEL: Record<string, string> = {
  L: "Legal Standing",
  D: "Delivery Risk",
  T: "Developer Trust",
  F: "Financial Integrity",
  C: "Compliance",
  X: "Location",
  P: "Price Fairness",
};
const MODULE_ORDER = ["L", "D", "T", "F", "C", "X", "P"];

type Band = { label: string; fg: string; bg: string; ring: string };

function gradeBand(grade: string): Band {
  const g = grade.toUpperCase();
  if (g === "A+" || g === "A") return { label: g, fg: "#0F7A3D", bg: "rgba(34,197,94,0.12)", ring: "rgba(34,197,94,0.28)" };
  if (g === "B+" || g === "B") return { label: g, fg: "#1D6FB8", bg: "rgba(59,130,246,0.12)", ring: "rgba(59,130,246,0.28)" };
  if (g === "C+" || g === "C") return { label: g, fg: "#B45309", bg: "rgba(245,158,11,0.14)", ring: "rgba(245,158,11,0.30)" };
  if (g === "D") return { label: g, fg: "#B91C1C", bg: "rgba(239,68,68,0.12)", ring: "rgba(239,68,68,0.30)" };
  return { label: "NR", fg: "#6B7280", bg: "rgba(107,114,128,0.12)", ring: "rgba(107,114,128,0.28)" };
}

function scoreColor(v: number): string {
  if (v < 30) return "#EF4444";
  if (v <= 55) return "#F59E0B";
  return "var(--color-crux-green)";
}

function card(extra = ""): string {
  return `bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 ${extra}`;
}

function cohortLine(score: CruxScore): string {
  const pct = score.cohort_percentile;
  const n = score.cohort?.n ?? 0;
  const region = (score.cohort?.id ?? "").split("|")[0] || "comparable";
  const type = (score.cohort?.id ?? "").split("|")[1] || "projects";
  if (pct != null && n >= 30) {
    const top = Math.max(1, Math.round(100 - pct));
    return `Top ${top}% of comparable ${region} ${type} projects`;
  }
  return "Graded on absolute standards — cohort ranking unlocks as the corpus grows";
}

// ── NR ───────────────────────────────────────────────────────────────────────
function NotRated({ score }: { score: CruxScore }) {
  return (
    <div className={card("")} style={{ borderRadius: 16, padding: 24 }}>
      <div className="flex items-center gap-3 mb-3">
        <span
          className="inline-flex items-center justify-center font-bold"
          style={{ width: 56, height: 56, borderRadius: 14, fontSize: 22, color: "#6B7280", background: "rgba(107,114,128,0.12)", boxShadow: "inset 0 0 0 1px rgba(107,114,128,0.28)" }}
        >
          NR
        </span>
        <div>
          <h2 className="text-[18px] font-semibold text-gray-900 leading-tight">Not Rated</h2>
          <p className="text-[13px] text-crux-text-secondary">Insufficient verified data for a responsible grade.</p>
        </div>
      </div>
      <p className="text-[13px] text-gray-600 leading-relaxed">
        {score.not_rated_reason ??
          "Refusing to grade thin data is itself a trust signal — CRUX grades this the moment the missing filings land."}
      </p>
    </div>
  );
}

// ── Module chip ────────────────────────────────────────────────────────────────
function ModuleChip({ m }: { m: CgmModuleScore }) {
  const label = MODULE_LABEL[m.code] ?? m.code;
  if (m.not_assessed) {
    return (
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50/80 ring-1 ring-black/5">
        <span className="text-[13px] font-medium text-gray-500">{label}</span>
        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Not Assessed</span>
      </div>
    );
  }
  return (
    <div className="px-3 py-2 rounded-xl bg-white ring-1 ring-black/5 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[13px] font-medium text-gray-900">{label}</span>
        <span className="text-[13px] font-semibold" style={{ color: scoreColor(m.score) }}>
          {Math.round(m.score)}
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(m.score, 100)}%`, backgroundColor: scoreColor(m.score) }} />
      </div>
      <p className="text-[11px] text-gray-500 mt-1">{m.verdict}</p>
    </div>
  );
}

// ── Main surface ────────────────────────────────────────────────────────────────
export function CgmGradeSurface({ score }: { score: CruxScore }) {
  const grade = score.grade ?? "NR";
  const composite = score.score_composite;
  if (grade === "NR" || composite == null) return <NotRated score={score} />;

  const band = gradeBand(grade);
  const modules = (score.module_scores ?? []).slice().sort(
    (a, b) => MODULE_ORDER.indexOf(a.code) - MODULE_ORDER.indexOf(b.code),
  );
  const confidencePct = Math.round((score.confidence_score ?? 0) * 100);
  const gates = score.gates_applied ?? [];
  const vastu = score.vastu_overlay;

  return (
    <div className="space-y-6">
      {/* Grade headline */}
      <div className={card("")} style={{ borderRadius: 16, padding: 24, opacity: score.provisional ? 0.96 : 1 }}>
        <div className="flex items-center gap-5">
          <span
            className="inline-flex items-center justify-center font-bold leading-none"
            style={{ width: 84, height: 84, borderRadius: 20, fontSize: 40, color: band.fg, background: band.bg, boxShadow: `inset 0 0 0 1.5px ${band.ring}` }}
          >
            {band.label}
          </span>
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <h2 className="text-[22px] font-semibold text-gray-900 tracking-tight">CRUX Grade {grade}</h2>
              <span className="text-[13px] text-gray-400">· {Math.round(composite)}/100</span>
            </div>
            <p className="text-[13px] text-crux-text-secondary mt-0.5">{cohortLine(score)}</p>
            {score.provisional && (
              <span className="inline-block mt-2 text-[11px] font-medium text-amber-700 bg-amber-50 ring-1 ring-amber-200 px-2 py-0.5 rounded-full">
                Provisional — limited data, grade may firm up
              </span>
            )}
          </div>
        </div>

        {/* Confidence meter */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12px] font-medium text-gray-600">Confidence</span>
            <span className="text-[12px] font-semibold text-gray-700">{confidencePct}%{score.degraded ? " · degraded" : ""}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${confidencePct}%`, backgroundColor: score.degraded ? "#F59E0B" : "var(--color-crux-green)" }} />
          </div>
        </div>

        {/* Fatal-flag gate banner */}
        {gates.length > 0 && (
          <div className="mt-4 px-3 py-2 rounded-xl bg-red-50 ring-1 ring-red-200">
            <p className="text-[12px] font-semibold text-red-700">
              Grade capped by a fatal flag ({gates.map((g) => g.gate_id).join(", ")}) — a material risk overrides the average.
            </p>
          </div>
        )}
      </div>

      {/* Seven module verdict chips */}
      <div className={card("")} style={{ borderRadius: 16, padding: 24 }}>
        <h3 className="text-[16px] font-semibold text-crux-text-primary mb-4">Module Verdicts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {modules.map((m) => (
            <ModuleChip key={m.code} m={m} />
          ))}
        </div>
      </div>

      {/* Vastu overlay — visually distinct, zero grade impact */}
      {vastu && vastu.verdict !== "not_evaluated" && (
        <div className="rounded-2xl p-6 ring-1 ring-violet-200" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.06), rgba(236,72,153,0.05))" }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[15px] font-semibold text-violet-900">Vastu Compatibility</h3>
            <span className="text-[13px] font-semibold text-violet-700">{vastu.verdict}</span>
          </div>
          <p className="text-[12px] text-violet-700/80 mb-2">
            Based on {vastu.factorsAnswered} of {vastu.factorsTotal} factors · does not affect the CRUX Grade
          </p>
          {vastu.notes.length > 0 && (
            <ul className="text-[12px] text-violet-800/90 space-y-0.5 list-disc list-inside">
              {vastu.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
