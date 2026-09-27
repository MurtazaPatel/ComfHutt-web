"use client";

import Link from "next/link";
import { gradeBand, isUngraded, scoreColor } from "@/lib/grade";
import { formatDate } from "@/lib/format";
import type { PropertySummary } from "@/hooks/useRecentProperties";
import { Surface } from "./ui/Surface";

interface PropertyCardProps {
  property: PropertySummary;
}

const CARD_WIDTH = "min-w-[260px] max-w-[320px] flex-shrink-0 snap-start";

/** A circular mini score gauge rendered as an SVG ring. Only drawn for a real score. */
function MiniScoreGauge({ score }: { score: number }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div
      className="relative h-[56px] w-[56px] flex-shrink-0"
      role="img"
      aria-label={`Composite ${score} out of 100`}
    >
      <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90" aria-hidden="true">
        <circle cx="28" cy="28" r={radius} fill="none" stroke="var(--color-crux-border)" strokeWidth="3" />
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke={scoreColor(score)}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
        />
      </svg>
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center text-[15px] font-semibold text-crux-text-primary"
      >
        {score}
      </span>
    </div>
  );
}

export function PropertyCard({ property }: PropertyCardProps) {
  // `score` is nullable: a property can exist without having been graded. The old
  // card rendered a 0 gauge and a fabricated "Top {100 - score}% in area" chip.
  const score = property.score;
  // Only show a grade chip when the engine actually sent a grade — including NR,
  // which is a decision it made, not a missing value.
  const band = property.grade ? gradeBand(property.grade) : null;
  const gradeLabel = isUngraded(property.grade) ? "Not Rated" : `Grade ${band?.label}`;

  return (
    <Link
      href={`/dashboard/properties/${property.id}`}
      className={`group block rounded-2xl ${CARD_WIDTH} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2`}
    >
      <Surface interactive className="flex h-full flex-col gap-3">
        <div>
          <p className="text-[14px] font-medium leading-snug text-crux-text-primary">{property.address}</p>
          {property.city && (
            <p className="mt-0.5 text-[12px] font-normal text-crux-text-secondary">{property.city}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {score !== null ? (
            <>
              <MiniScoreGauge score={score} />
              {band && (
                <span
                  className={`inline-flex items-center rounded-full border px-[10px] py-[3px] text-[12px] font-medium ${band.chipClass}`}
                >
                  {gradeLabel}
                </span>
              )}
            </>
          ) : (
            <span className="inline-flex items-center rounded-full bg-crux-bg-secondary px-[10px] py-[4px] text-[12px] font-medium text-crux-text-secondary">
              Not scored yet
            </span>
          )}
        </div>

        <p className="mt-auto text-[11px] text-crux-text-muted">
          {score !== null ? "Scored" : "Added"} {formatDate(property.scoredAt)}
        </p>
      </Surface>
    </Link>
  );
}

export function PropertyCardSkeleton() {
  return (
    <Surface className={`${CARD_WIDTH} animate-pulse motion-reduce:animate-none`}>
      <div className="flex flex-col gap-3">
        <div className="h-[18px] w-3/4 rounded bg-crux-bg-secondary" />
        <div className="h-[15px] w-1/2 rounded bg-crux-bg-secondary" />
        <div className="flex items-center gap-3">
          <div className="h-[56px] w-[56px] rounded-full bg-crux-bg-secondary" />
          <div className="h-[22px] w-24 rounded-full bg-crux-bg-secondary" />
        </div>
        <div className="h-[14px] w-28 rounded bg-crux-bg-secondary" />
      </div>
    </Surface>
  );
}
