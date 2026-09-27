"use client";

import { LensAvatar } from "./LensAvatar";

interface ThinkingIndicatorProps {
  /** What Lens is doing right now, e.g. "Connecting to CRUX…". */
  label?: string;
}

/**
 * The "Lens is working" placeholder that occupies the assistant slot until the
 * first token arrives.
 *
 * Self-contained on purpose: an animated orb is meant to replace the dots here,
 * so the swap should be a change inside this file and nothing else.
 *
 * It replaces a pulsing, gradient-clipped, shimmer-overlaid label — three
 * animations competing on text the reader is actively trying to read. The label
 * now sits still and only the dots move, and reduced-motion stops those too.
 */
export function ThinkingIndicator({ label = "Thinking…" }: ThinkingIndicatorProps) {
  return (
    <div className="flex items-start gap-4 px-4 sm:px-6">
      <LensAvatar />
      {/* Announced once, politely: a screen reader should hear the status, not each dot. */}
      <div className="mt-[5px] flex items-center gap-2" role="status" aria-live="polite">
        <span className="text-[15px] font-medium text-crux-text-secondary">{label}</span>
        <span className="flex items-center gap-1" aria-hidden="true">
          {[0, 160, 320].map((delay) => (
            <span
              key={delay}
              className="h-[5px] w-[5px] rounded-full bg-crux-green animate-pulse motion-reduce:animate-none"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
