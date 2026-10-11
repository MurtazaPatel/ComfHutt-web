"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Reading progress, drawn as a survey line along the top edge.
 *
 * scaleX on a fixed bar — compositor-only. The spring takes the steps out of
 * wheel scrolling so the line reads as drawn rather than jumped.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-crux-green motion-reduce:hidden"
      style={{ scaleX }}
    />
  );
}
