"use client";

import { motion, MotionConfig } from "framer-motion";

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

export default function HowItWorks() {
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
          className="mx-auto mt-14 grid max-w-5xl gap-px overflow-hidden rounded-[var(--radius-panel)] border border-crux-border bg-crux-border shadow-[var(--shadow-premium-md)] md:mt-16 md:grid-cols-3"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        >
          {STEPS.map(({ title, body }, i) => (
            <li key={title} className="flex flex-col bg-white p-7 md:p-9">
              {/* The number is decorative: the <ol> already conveys the order to a
                  screen reader, so repeating it aloud would just be noise. */}
              <span
                aria-hidden
                className="flex h-10 w-10 items-center justify-center rounded-full bg-crux-green-tint font-mono text-[14px] font-semibold text-crux-green-dark ring-1 ring-crux-green/25"
              >
                {i + 1}
              </span>
              <h3 className="t-h3 mt-6 text-pretty text-crux-text-primary">
                {title}
              </h3>
              <p className="mt-3 text-pretty text-[15px] leading-relaxed text-crux-text-secondary">
                {body}
              </p>
            </li>
          ))}
        </motion.ol>
      </div>
    </section>
    </MotionConfig>
  );
}
