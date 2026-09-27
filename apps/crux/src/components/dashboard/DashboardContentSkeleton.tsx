"use client";

// Structured skeleton for the dashboard content area, shown while the user profile
// (/crux/auth/me) loads — instead of a bare full-page spinner. It mirrors the home
// layout block for block (hero, prompt, four stats, recent research, two panels) and
// borrows the real card skeleton for the scroller, so nothing shifts when the data
// arrives.

import { PropertyCardSkeleton } from "./PropertyCard";
import { Surface } from "./ui/Surface";

function Block({ className = "" }: { className?: string }) {
  return <div className={`rounded bg-crux-bg-secondary ${className}`} />;
}

export function DashboardContentSkeleton() {
  return (
    <div
      className="mx-auto max-w-[960px] animate-pulse px-6 py-10 motion-reduce:animate-none"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      {/* Welcome header — heights match WelcomeHeader's 28px/1.25 and 18px/1.5 lines. */}
      <div className="mb-10">
        <Block className="mb-2 h-[35px] w-[200px] max-w-full" />
        <Block className="h-[27px] w-[320px] max-w-full" />
      </div>

      {/* Prompt box */}
      <div className="mb-10">
        <Block className="mx-auto h-[140px] w-full max-w-[720px] rounded-2xl" />
      </div>

      {/* Quick stats */}
      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Surface key={i} padding="tight">
            <div className="flex flex-col items-center gap-2 py-2">
              <Block className="h-3 w-24 rounded-full" />
              <Block className="h-9 w-14" />
              <Block className="h-3 w-20 rounded-full" />
            </div>
          </Surface>
        ))}
      </div>

      {/* Recent research */}
      <div className="mb-10">
        <Block className="mb-4 h-[20px] w-[160px]" />
        <div className="-mx-1 flex gap-4 overflow-hidden px-1 py-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Bottom two-panel: How CRUX works + What a CRUX Grade means */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Surface key={i}>
            <Block className="mb-4 h-[20px] w-[180px]" />
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((__, row) => (
                <div key={row} className="flex items-start gap-3">
                  <Block className="h-6 w-6 flex-shrink-0 rounded-full" />
                  <Block className="h-[34px] flex-1" />
                </div>
              ))}
            </div>
          </Surface>
        ))}
      </div>
    </div>
  );
}
