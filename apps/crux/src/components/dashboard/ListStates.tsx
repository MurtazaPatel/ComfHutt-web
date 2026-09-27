"use client";

import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Surface } from "./ui/Surface";
import { cn } from "@/lib/utils";

/**
 * The empty and loading states shared by the dashboard's list pages.
 *
 * Properties and Reports each carried their own copy of both, near-identical but
 * drifting: different paddings, different skeleton heights, one with a raw
 * `border-[#ededed]` box and one without. Two lists that look the same when full
 * should look the same when empty.
 */

export function ListEmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  /** Optional single way out of the empty state. */
  action?: { href: string; label: string };
}) {
  return (
    <Surface padding="none" className="px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-crux-green-tint">
        <Icon className="h-6 w-6 text-crux-green" aria-hidden="true" />
      </div>
      <h2 className="mb-2 text-lg font-semibold text-crux-text-primary">{title}</h2>
      <p className="mx-auto mb-6 max-w-[360px] text-sm text-crux-text-secondary">{body}</p>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-2 rounded-xl bg-crux-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-crux-green-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
        >
          {action.label}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      )}
    </Surface>
  );
}

export function ListSkeleton({
  rows = 4,
  layout = "rows",
}: {
  rows?: number;
  /** `grid` matches the two-up property cards, `rows` the stacked report rows. */
  layout?: "grid" | "rows";
}) {
  return (
    <div aria-hidden="true">
      {/* Placeholder for the page heading so the list doesn't jump when it lands. */}
      <div className="mb-8 animate-pulse motion-reduce:animate-none">
        <div className="mb-2 h-7 w-44 rounded bg-crux-bg-secondary" />
        <div className="h-4 w-32 rounded bg-crux-bg-secondary" />
      </div>
      <div className={cn(layout === "grid" ? "grid grid-cols-1 gap-4 md:grid-cols-2" : "space-y-3")}>
        {Array.from({ length: rows }, (_, i) => (
          <div
            key={i}
            className={cn(
              "animate-pulse rounded-2xl bg-crux-bg-secondary ring-1 ring-black/5 motion-reduce:animate-none",
              layout === "grid" ? "h-28" : "h-20",
            )}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * How a list row shows a composite score.
 *
 * `score` is nullable and the null case is not cosmetic: a property that has not
 * been scored has no score, which is a different fact from a score of zero. The
 * old lists rendered the coalesced `0` literally ("Score: 0") next to a downward
 * trend arrow — the worst possible reading of "we haven't looked yet" on a product
 * whose entire output is a grade.
 */
export function ScoreValue({ score, className }: { score: number | null; className?: string }) {
  if (score === null) {
    return <span className={cn("text-[13px] text-crux-text-muted", className)}>Not scored yet</span>;
  }
  return (
    <span className={cn("text-2xl font-bold tabular-nums text-crux-text-primary", className)}>
      {score}
      <span className="ml-0.5 text-[13px] font-medium text-crux-text-muted">/100</span>
    </span>
  );
}
