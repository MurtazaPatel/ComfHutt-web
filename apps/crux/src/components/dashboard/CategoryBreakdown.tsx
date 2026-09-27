"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { scoreColor } from "@/lib/grade";

interface CategoryItem {
  key: string;
  label: string;
  score: number;
  weight: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  cpsm_legal_authenticity: "Legal Authenticity",
  cpsm_technical_compliance: "Technical Compliance",
  cpsm_infrastructure_resilience: "Infrastructure Resilience",
  cpsm_spatial_ergonomics: "Spatial Ergonomics",
  cpsm_market_dynamics: "Market Dynamics",
};

/**
 * The legacy CPSM five-pillar breakdown.
 *
 * Only reached when a score row has no `module_scores` — i.e. it predates the CGM
 * engine, which renders seven modules through `CgmGradeSurface` instead. Kept
 * working and kept consistent with the rest of the app; not a place to invest.
 */
export function CategoryBreakdown({
  breakdown,
  weights,
}: {
  breakdown: Record<string, number>;
  weights: Record<string, number>;
}) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const entries: CategoryItem[] = Object.entries(breakdown)
    .filter(([, score]) => typeof score === "number")
    .map(([key, score]) => ({
      key,
      label: CATEGORY_LABELS[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      score: Math.round(score as number),
      weight: Math.round((weights[key] || 0) * 100),
    }))
    .sort((a, b) => b.weight - a.weight);

  return (
    <div className="flex flex-col gap-[10px]">
      {entries.map((entry) => {
        const isExpanded = expandedKey === entry.key;
        const panelId = `category-detail-${entry.key}`;
        return (
          <div key={entry.key}>
            <button
              type="button"
              onClick={() => setExpandedKey(isExpanded ? null : entry.key)}
              aria-expanded={isExpanded}
              aria-controls={panelId}
              className="w-full rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="flex min-w-0 items-center gap-1 text-[13px] font-medium text-crux-text-primary tracking-tight">
                  {/* The chevron is the only cue that the row opens at all. */}
                  <ChevronDown
                    size={13}
                    aria-hidden="true"
                    className={cn(
                      "shrink-0 text-crux-text-muted transition-transform duration-200 motion-reduce:transition-none",
                      isExpanded && "rotate-180",
                    )}
                  />
                  <span className="truncate">{entry.label}</span>
                </span>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className="text-[14px] font-semibold tracking-tight"
                    style={{ color: scoreColor(entry.score) }}
                  >
                    {entry.score}
                  </span>
                  <span className="text-[11px] font-medium text-crux-text-secondary bg-crux-bg-secondary px-[6px] py-[1px] rounded-full ring-1 ring-black/5">
                    {entry.weight}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-crux-bg-secondary rounded-full overflow-hidden mt-1">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out motion-reduce:transition-none"
                  style={{ width: `${entry.score}%`, backgroundColor: scoreColor(entry.score) }}
                />
              </div>
            </button>

            {/* Mounted only when open: a fixed max-height clipped the longer
                copy, and there is no height to animate to that fits every string. */}
            {isExpanded && (
              <div
                id={panelId}
                className="ml-1 mt-2 rounded-lg border border-crux-border bg-crux-bg-secondary p-2 text-[12px] leading-relaxed text-crux-text-secondary"
              >
                <span className="font-medium text-crux-text-primary">Weight: {entry.weight}%</span>
                {entry.score >= 70
                  ? " — This category performs well and indicates high confidence."
                  : entry.score >= 40
                    ? " — This category needs attention and poses moderate risk."
                    : " — Significant risk detected in this category."}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
