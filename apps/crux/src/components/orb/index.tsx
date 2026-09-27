"use client";

// Public entry for the thinking orb. Always import from here, never from
// ./ThinkingOrb directly — this file is what keeps the canvas engine (~26 KB of
// pure math) out of the first-load bundle. It arrives when something actually
// starts thinking, which is never on the critical path to first paint.

import dynamic from "next/dynamic";
import type { OrbSize, OrbState } from "./orb-types";

export type { OrbSize, OrbState } from "./orb-types";

/**
 * Placeholder shown for the one frame before the engine chunk lands, and while
 * the canvas has nothing to paint. A dot of the same footprint, so the orb's
 * arrival never shifts the layout around it.
 */
function OrbPlaceholder({ size }: { size: OrbSize }) {
  return (
    <span
      aria-hidden
      className="block rounded-full bg-crux-green/15"
      style={{ width: size, height: size }}
    />
  );
}

export const ThinkingOrb = dynamic(() => import("./ThinkingOrb"), {
  ssr: false,
  loading: () => <OrbPlaceholder size={64} />,
});

/**
 * Inline variant for the 20px tuning — the size that sits next to a line of text
 * (a streaming chat reply, a step in a progress list). Separate so the placeholder
 * reserves the right box; the 64px default would jolt the line on load.
 */
export const InlineThinkingOrb = dynamic(() => import("./ThinkingOrb"), {
  ssr: false,
  loading: () => <OrbPlaceholder size={20} />,
});

/** Which animation fits which CRUX operation. One place, so the surfaces agree. */
export const ORB_STATE: Record<"grading" | "reading" | "answering" | "waiting", OrbState> = {
  /** The grading engine is running its modules. */
  grading: "solving",
  /** Pulling records from a source (RERA, eCourts, registry). */
  reading: "searching",
  /** Lens is composing an answer. */
  answering: "composing",
  /** Queued, nothing to report yet. */
  waiting: "working",
};
