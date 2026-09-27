"use client";

import { CircleAlert, CircleCheck, Search, type LucideIcon } from "lucide-react";

/**
 * A list of plain-language findings the report agent wrote.
 *
 * `risk_flags`, `positive_signals` and `research_highlights` are all `string[]` on
 * the wire — no severity, no ranking, no ids. So this renders one flat list with a
 * single marker per tone and nothing else. Colouring individual items by an invented
 * severity would be exactly the fabrication this screen is being cleared of.
 *
 * An empty list is a real result, not a reason to hide the section: "no risk flags
 * recorded" is a finding a buyer wants to read. Callers pass the wording.
 */

export type FindingTone = "risk" | "positive" | "neutral";

const TONE: Record<FindingTone, { Icon: LucideIcon; iconClass: string; marker: string }> = {
  risk: { Icon: CircleAlert, iconClass: "text-amber-600", marker: "Risk flag" },
  positive: { Icon: CircleCheck, iconClass: "text-crux-green", marker: "Positive signal" },
  neutral: { Icon: Search, iconClass: "text-crux-text-muted", marker: "Highlight" },
};

export function FindingsList({
  items,
  tone = "neutral",
  emptyLabel,
}: {
  items: readonly (string | null | undefined)[] | null | undefined;
  tone?: FindingTone;
  /** Shown when the engine recorded none. Omit to render nothing at all. */
  emptyLabel?: string;
}) {
  const usable = (items ?? []).filter(
    (item): item is string => typeof item === "string" && item.trim().length > 0,
  );

  if (usable.length === 0) {
    if (!emptyLabel) return null;
    return <p className="text-[14px] leading-relaxed text-crux-text-secondary">{emptyLabel}</p>;
  }

  const { Icon, iconClass, marker } = TONE[tone];

  return (
    <ul className="flex flex-col gap-2">
      {usable.map((item, i) => (
        <li key={`${i}-${item.slice(0, 24)}`} className="flex items-start gap-2">
          <Icon size={16} className={`mt-0.5 shrink-0 ${iconClass}`} aria-label={marker} />
          <span className="text-[14px] leading-relaxed text-crux-text-primary">{item}</span>
        </li>
      ))}
    </ul>
  );
}
