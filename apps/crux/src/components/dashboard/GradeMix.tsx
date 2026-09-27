"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRecentProperties } from "@/hooks/useRecentProperties";
import { gradeBand, isUngraded } from "@/lib/grade";
import { Surface, SurfaceTitle } from "@/components/dashboard/ui/Surface";

/**
 * How the properties you have graded actually came out.
 *
 * The bar is direct-labelled on every segment, and that is not a style choice.
 * Running the grade palette through the colour validator puts C (#B45309) and D
 * (#B91C1C) at ΔE 9.1 for *normal* vision — under the 15 floor, meaning full-colour
 * readers struggle to separate them, before considering colour blindness. So the
 * letter and the count carry the meaning and the colour is only reinforcement.
 * Changing the grade colours themselves would be the other fix, but they are set in
 * lib/grade.ts and already shipped across the grading page.
 *
 * Only graded properties are counted. An unscored property is not a grade and is
 * reported separately rather than being folded in as though it were an outcome.
 */

const ORDER = ["A", "B", "C", "D", "NR"] as const;

export function GradeMix() {
  const { properties, isLoading } = useRecentProperties(20);

  if (isLoading) {
    return (
      <Surface aria-hidden>
        <div className="mb-4 h-5 w-32 animate-pulse rounded bg-crux-bg-secondary motion-reduce:animate-none" />
        <div className="h-3 w-full animate-pulse rounded-full bg-crux-bg-secondary motion-reduce:animate-none" />
        <div className="mt-4 flex gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-4 w-16 animate-pulse rounded bg-crux-bg-secondary motion-reduce:animate-none"
            />
          ))}
        </div>
      </Surface>
    );
  }

  const graded = properties.filter((p) => p.grade && !isUngraded(p.grade));
  const ungradedCount = properties.length - graded.length;

  // Bucket by first letter so A and A+ sit together; NR never reaches here.
  const counts = new Map<string, number>();
  for (const p of graded) {
    const letter = (p.grade ?? "").trim().toUpperCase()[0] ?? "";
    if (letter) counts.set(letter, (counts.get(letter) ?? 0) + 1);
  }

  const segments = ORDER.map((letter) => ({ letter, count: counts.get(letter) ?? 0 })).filter(
    (s) => s.count > 0,
  );

  if (segments.length === 0) {
    return (
      <Surface>
        <SurfaceTitle as="h2">Your grade mix</SurfaceTitle>
        <p className="text-[13px] leading-relaxed text-crux-text-secondary">
          {properties.length === 0
            ? "Grade a property and its result will show up here, alongside everything else you have checked."
            : `Nothing graded yet — ${properties.length} ${properties.length === 1 ? "property is" : "properties are"} waiting on a score.`}
        </p>
      </Surface>
    );
  }

  const total = segments.reduce((sum, s) => sum + s.count, 0);

  return (
    <Surface as="section">
      <SurfaceTitle
        as="h2"
        action={
          <Link
            href="/dashboard/properties"
            className="inline-flex items-center gap-1 rounded text-[13px] font-medium text-crux-green transition-colors hover:text-crux-green-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            All properties
            <ArrowRight size={13} aria-hidden />
          </Link>
        }
      >
        Your grade mix
      </SurfaceTitle>

      {/* gap-[2px] is the surface gap between adjacent fills — without it two
          neighbouring segments read as one longer block. */}
      <div className="flex h-3 w-full gap-[2px] overflow-hidden rounded-full">
        {segments.map(({ letter, count }) => {
          const band = gradeBand(letter);
          return (
            <div
              key={letter}
              className="h-full first:rounded-l-full last:rounded-r-full"
              style={{ width: `${(count / total) * 100}%`, backgroundColor: band.fg }}
              // The list below is the accessible reading of this bar.
              aria-hidden
            />
          );
        })}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {segments.map(({ letter, count }) => {
          const band = gradeBand(letter);
          return (
            <li key={letter} className="flex items-center gap-2">
              <span
                aria-hidden
                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: band.fg }}
              />
              <span className="text-[13px] text-crux-text-secondary">
                <span className="font-semibold text-crux-text-primary">{count}</span> graded{" "}
                {letter}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 border-t border-crux-border pt-3 text-[12px] leading-relaxed text-crux-text-muted">
        Across {total} graded {total === 1 ? "property" : "properties"}
        {ungradedCount > 0 && `, with ${ungradedCount} not scored yet`}. A grade reflects the
        public record at the time it was computed.
      </p>
    </Surface>
  );
}
