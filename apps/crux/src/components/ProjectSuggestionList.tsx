"use client";

import { cn } from "@/lib/utils";
import type { ProjectSuggestion } from "@/hooks/useProjectSuggestions";

interface Props {
  id: string;
  items: ProjectSuggestion[];
  activeIndex: number;
  optionId: (i: number) => string;
  onHover: (i: number) => void;
  onPick: (s: ProjectSuggestion) => void;
  className?: string;
}

/** Muted second line: promoter · locality/district · reg no. */
function detailLine(s: ProjectSuggestion): string {
  return [s.promoter_name, s.locality || s.district, s.reg_no].filter(Boolean).join(" · ");
}

export function ProjectSuggestionList({ id, items, activeIndex, optionId, onHover, onPick, className }: Props) {
  return (
    <ul
      id={id}
      role="listbox"
      aria-label="Matching RERA projects"
      className={cn(
        "absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto overscroll-contain",
        "rounded-2xl border border-crux-border bg-white py-1.5 text-left shadow-[var(--shadow-premium-md)]",
        className,
      )}
    >
      {items.map((s, i) => {
        const detail = detailLine(s);
        return (
          <li
            key={s.entity_id}
            id={optionId(i)}
            role="option"
            aria-selected={i === activeIndex}
            // mousedown (not click) so the input keeps focus and blur doesn't close the list first.
            onMouseDown={(e) => {
              e.preventDefault();
              onPick(s);
            }}
            onMouseEnter={() => onHover(i)}
            className={cn(
              "cursor-pointer px-4 py-2.5 min-h-11",
              i === activeIndex ? "bg-crux-bg-secondary" : "bg-transparent",
            )}
          >
            <span className="block truncate text-sm font-semibold text-crux-text-primary">{s.project_name}</span>
            {detail && <span className="block truncate text-xs text-crux-text-secondary">{detail}</span>}
          </li>
        );
      })}
    </ul>
  );
}
