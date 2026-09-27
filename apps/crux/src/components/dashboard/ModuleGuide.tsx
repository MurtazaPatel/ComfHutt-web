"use client";

import { MODULE_ORDER, MODULE_LABEL, MODULE_BLURB } from "@/lib/grade";
import { Surface, SurfaceTitle } from "@/components/dashboard/ui/Surface";

/**
 * What a CRUX Grade is actually made of.
 *
 * The dashboard explains how to get a grade (HowItWorks) and what the letter
 * means (GradeGuide), but nothing said what the engine examines to arrive at one —
 * which is the part that distinguishes this from reading a RERA certificate. The
 * seven modules are the product's substance, so they get a panel.
 *
 * Every label and line comes from lib/grade.ts, which holds the engine's own
 * module vocabulary. Nothing here is written for the dashboard.
 */
export function ModuleGuide() {
  return (
    <Surface as="section">
      <SurfaceTitle as="h2">What every grade checks</SurfaceTitle>

      <ol className="space-y-3">
        {MODULE_ORDER.map((code) => (
          <li key={code} className="flex gap-3">
            {/* The engine's single-letter module code — a real identifier, not
                decorative numbering, so it earns its place as the marker. */}
            <span
              aria-hidden
              className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-crux-green-tint text-[11px] font-bold text-crux-green-dark"
            >
              {code}
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-crux-text-primary">
                {MODULE_LABEL[code]}
              </p>
              <p className="text-pretty text-[12px] leading-relaxed text-crux-text-secondary">
                {MODULE_BLURB[code]}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-4 border-t border-crux-border pt-3 text-[12px] leading-relaxed text-crux-text-muted">
        A module with too little verified data is marked not assessed rather than
        guessed at, and a fatal finding in one can cap the whole grade.
      </p>
    </Surface>
  );
}
