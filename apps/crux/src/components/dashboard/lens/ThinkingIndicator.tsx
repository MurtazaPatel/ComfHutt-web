"use client";

import { InlineThinkingOrb, ORB_STATE } from "@/components/orb";

interface ThinkingIndicatorProps {
  /** What Lens is doing right now, e.g. "Connecting to CRUX…". */
  label?: string;
}

/**
 * The "Lens is working" placeholder that occupies the assistant slot until the
 * first token arrives.
 *
 * It replaces a pulsing, gradient-clipped, shimmer-overlaid label — three
 * animations competing on text the reader is actively trying to read. The label
 * sits still; only the orb moves, and it holds a single frame under
 * prefers-reduced-motion.
 *
 * The orb stands in for the avatar here rather than sitting beside it. Two marks on
 * one line would read as two speakers, and the orb IS the avatar for the duration of
 * the wait — it is replaced by the real house mark the moment AIMessage renders the
 * first token. The 20px tuning is the one the upstream engine ships for inline-text
 * scale; the 64px preset is a separate design, not a scale factor, so it is not used
 * at this size.
 */
export function ThinkingIndicator({ label = "Thinking…" }: ThinkingIndicatorProps) {
  return (
    <div className="flex items-start gap-4 px-4 sm:px-6">
      {/* Boxed to the avatar's 30px footprint so the line does not shift when the
          real mark takes this slot. */}
      {/* aria-hidden on the wrapper, not an empty aria-label on the canvas: a
          role="img" with an empty name is not reliably ignored by assistive tech,
          and the visible label below already announces the status. */}
      <div
        aria-hidden
        className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center"
      >
        <InlineThinkingOrb state={ORB_STATE.answering} size={20} />
      </div>
      {/* Announced once, politely: a screen reader should hear the status, not the orb. */}
      <div className="mt-[5px] flex items-center gap-2" role="status" aria-live="polite">
        <span className="text-[15px] font-medium text-crux-text-secondary">{label}</span>
      </div>
    </div>
  );
}
