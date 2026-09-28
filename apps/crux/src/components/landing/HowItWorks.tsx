"use client";

import { motion } from "framer-motion";

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
    <section id="how-it-works" className="bg-white px-4 py-20 md:py-28">
      <div className="mx-auto max-w-[1100px]">
        <motion.h2
          className="text-balance text-center text-[28px] font-bold leading-tight tracking-[-0.02em] text-crux-text-primary md:text-[40px]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          How it works
        </motion.h2>

        <ol className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
          {STEPS.map(({ title, body }, i) => (
            <motion.li
              key={title}
              className="flex flex-col rounded-2xl border border-crux-border bg-crux-bg-primary p-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.08 }}
            >
              {/* The number is decorative: the <ol> already conveys the order to a
                  screen reader, so repeating it aloud would just be noise. */}
              <span
                aria-hidden
                className="flex h-9 w-9 items-center justify-center rounded-full bg-crux-green-tint text-[14px] font-bold text-crux-green-dark"
              >
                {i + 1}
              </span>
              <h3 className="mt-4 text-pretty text-[17px] font-bold tracking-tight text-crux-text-primary">
                {title}
              </h3>
              <p className="mt-2 text-pretty text-[14px] leading-relaxed text-crux-text-secondary">
                {body}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
