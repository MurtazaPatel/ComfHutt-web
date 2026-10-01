"use client";

import { useRef } from "react";
import {
  motion,
  MotionConfig,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

/**
 * Three steps, down from four.
 *
 * Step 2 is the one that matters and the only one that describes something no
 * competitor does: throwing out the court records that belong to a different
 * builder with a similar name. It is stated as a step rather than a boast.
 */

const VP = { once: true, margin: "-100px" } as const;

const STEPS: Array<{ title: string; body: string }> = [
  {
    title: "Pick a project.",
    body: "Search any RERA-registered project in the districts we cover.",
  },
  {
    title: "Our agents do the research.",
    body: "They plan and run the search across GujRERA filings, escrow and progress reports, and five court forums — then throw out the case records that belong to a different builder with a similar name.",
  },
  {
    title: "You get a grade you can check.",
    body: "A+ to D, how it ranks against comparable projects, seven module verdicts, and a link to the evidence behind every one.",
  },
];

/**
 * The step number. It inks in — tint to solid emerald — as the progress line
 * reaches it, so the three steps light in order while the reader scrolls.
 */
function StepMark({ index, progress }: { index: number; progress: MotionValue<number> }) {
  // The line reaches step n at n / (steps - 1) of its travel.
  const at = index / (STEPS.length - 1);
  const lit = useTransform(progress, [Math.max(0, at - 0.14), Math.max(0.02, at)], [0, 1]);

  return (
    // Decorative: the <ol> already conveys the order to a screen reader, so
    // repeating it aloud would just be noise.
    <span
      aria-hidden
      className="relative z-[2] flex h-10 w-10 items-center justify-center rounded-full bg-crux-green-tint font-mono text-[14px] font-semibold text-crux-green-dark ring-1 ring-crux-green/25"
    >
      {index + 1}
      <motion.span
        className="absolute inset-0 flex items-center justify-center rounded-full bg-crux-green text-crux-ink"
        style={{ opacity: lit }}
      >
        {index + 1}
      </motion.span>
    </span>
  );
}

export default function HowItWorks() {
  const listRef = useRef<HTMLOListElement>(null);
  // Scroll-linked, not time-based: the line is drawn by the reader's own
  // scrolling, from when the block enters to when it sits mid-screen.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.85", "end 0.6"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <MotionConfig reducedMotion="user">
    <section id="how-it-works" className="crux-frame bg-white py-24 md:py-36">
      <div className="crux-container">
        <motion.h2
          className="t-h2 text-center text-crux-text-primary"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          How it works
        </motion.h2>

        {/* One bordered block split by hairlines, not three floating cards: the
            steps are a single process and should read as one object. */}
        <motion.ol
          ref={listRef}
          className="relative mx-auto mt-14 grid max-w-5xl gap-px overflow-hidden rounded-[var(--radius-panel)] border border-crux-border bg-crux-border shadow-[var(--shadow-premium-md)] md:mt-16 md:grid-cols-3"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        >
          {STEPS.map(({ title, body }, i) => (
            <li key={title} className="flex flex-col bg-white p-7 md:p-9">
              <StepMark index={i} progress={progress} />
              <h3 className="t-h3 mt-6 text-pretty text-crux-text-primary">
                {title}
              </h3>
              <p className="mt-3 text-pretty text-[15px] leading-relaxed text-crux-text-secondary">
                {body}
              </p>
            </li>
          ))}

          {/* The line through the step marks: a hairline track with an emerald
              fill scaled by scroll. On desktop it runs through the marks' centres,
              above the cell backgrounds and below the marks. On a phone the steps
              stack with their text directly under each mark, so a line through
              the marks would cross the copy — there it is a rail on the card's
              left edge instead. */}
          <li aria-hidden className="pointer-events-none absolute inset-0 z-[1] list-none">
            <span className="absolute left-[56px] right-[calc(33.333%-56px)] top-[56px] hidden h-px bg-crux-border md:block" />
            <motion.span
              className="absolute left-[56px] right-[calc(33.333%-56px)] top-[56px] hidden h-px origin-left bg-crux-green md:block"
              style={{ scaleX: progress }}
            />
                        <motion.span
              className="absolute inset-y-0 left-0 w-[3px] origin-top bg-crux-green md:hidden"
              style={{ scaleY: progress }}
            />
          </li>
        </motion.ol>
      </div>
    </section>
    </MotionConfig>
  );
}
