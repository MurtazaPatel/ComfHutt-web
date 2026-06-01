"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface CategoryItem {
  key: string;
  label: string;
  score: number;
  weight: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  location_intelligence: "Location Intelligence",
  developer_reliability: "Developer Reliability",
  legal_compliance: "Legal Compliance",
  market_valuation: "Market Valuation",
  structural_physical: "Structural & Physical",
  risk_composite: "Risk Composite",
};

export function CategoryBreakdown({
  breakdown,
  weights,
}: {
  breakdown: Record<string, number>;
  weights: Record<string, number>;
}) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const entries: CategoryItem[] = Object.entries(breakdown)
    .filter(([_, score]) => typeof score === "number")
    .map(([key, score]) => ({
      key,
      label: CATEGORY_LABELS[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      score: Math.round(score as number),
      weight: Math.round((weights[key] || 0) * 100),
    }))
    .sort((a, b) => b.weight - a.weight);

  const barColor = (score: number) => {
    if (score < 30) return "#EF4444";
    if (score <= 55) return "#F59E0B";
    return "#22C55E";
  };

  return (
    <div className="flex flex-col gap-[10px]">
      {entries.map((entry) => (
        <div key={entry.key}>
          <button
            type="button"
            onClick={() => setExpandedKey(expandedKey === entry.key ? null : entry.key)}
            className="w-full text-left"
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className="text-[13px] font-medium text-crux-text-primary"
                style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
              >
                {entry.label}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: barColor(entry.score) }}
                >
                  {entry.score}
                </span>
                <span
                  className="text-[11px] text-crux-text-muted bg-gray-50 px-[6px] py-[1px] rounded-full"
                >
                  {entry.weight}%
                </span>
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${entry.score}%`,
                  backgroundColor: barColor(entry.score),
                }}
              />
            </div>
          </button>

          {expandedKey === entry.key && (
            <div className="mt-1 ml-1 p-2 bg-gray-50 rounded-lg border border-gray-100 text-[12px] text-crux-text-secondary leading-relaxed">
              Weighted at {entry.weight}% of total score.
              {entry.score >= 70
                ? " ✓ This category performs well."
                : entry.score >= 40
                ? " ⚠ This category needs attention."
                : " ✗ Significant risk in this category."}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
