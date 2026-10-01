"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

/**
 * Counts up to a figure the first time it scrolls into view.
 *
 * The server renders the final text, so the number is right without JavaScript
 * and for a crawler. The count writes straight to the text node — no React
 * re-render per frame. Use it below the fold only: above it, the reader would
 * see the final figure, then a reset to zero.
 */
interface CountUpProps {
  value: number;
  suffix?: string;
  duration?: number;
}

export default function CountUp({ value, suffix = "", duration = 1.4 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, duration]);

  return (
    // tabular-nums so the width does not jitter while the digits change.
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}
