"use client";

import { gradeBand } from "@/lib/grade";
import { Surface, SurfaceTitle } from "./ui/Surface";

/**
 * What a CRUX Grade means, taken straight from the grade table.
 *
 * This card stands where MarketPulse used to: six hardcoded city "trends"
 * captioned as government index figures, for cities CRUX does not even cover.
 * Nothing here is authored twice — the letters, the chip colours and the one-line
 * meanings all come from `gradeBand()`, so this card cannot drift from the bands
 * the grading screens render.
 */
const LETTERS = ["A", "B", "C", "D"] as const;

export function GradeGuide() {
  const nr = gradeBand("NR");

  return (
    <Surface as="section" className="h-full">
      <SurfaceTitle as="h2">What a CRUX Grade means</SurfaceTitle>

      <dl className="flex flex-col gap-3">
        {LETTERS.map((letter) => {
          const band = gradeBand(letter);
          return (
            <div key={letter} className="flex items-start gap-3">
              <dt
                className={`inline-flex h-6 min-w-6 flex-shrink-0 items-center justify-center rounded-md border px-1.5 text-[12px] font-semibold ${band.chipClass}`}
              >
                {band.label}
              </dt>
              <dd className="min-w-0 text-[13px] leading-relaxed text-crux-text-secondary">
                {band.meaning}
              </dd>
            </div>
          );
        })}

        <div className="flex items-start gap-3 border-t border-crux-border pt-3">
          <dt
            className={`inline-flex h-6 min-w-6 flex-shrink-0 items-center justify-center rounded-md border px-1.5 text-[12px] font-semibold ${nr.chipClass}`}
          >
            {nr.label}
          </dt>
          <dd className="min-w-0 text-[13px] leading-relaxed text-crux-text-secondary">
            Not Rated — {nr.meaning.charAt(0).toLowerCase() + nr.meaning.slice(1)} CRUX withholds the
            grade rather than guess at one.
          </dd>
        </div>
      </dl>
    </Surface>
  );
}
