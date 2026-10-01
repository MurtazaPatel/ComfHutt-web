"use client";

import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MODULE_ORDER, MODULE_LABEL, MODULE_BLURB } from "@/lib/grade";

/**
 * What goes into a grade.
 *
 * Replaces the old engine section, which printed a six-category weight table
 * (Location 30% / Developer 20% / Legal 20% / Market 15% / Structural 10% /
 * Risk 5%) that did not match the weights the engine uses, and claimed those
 * weights were "weighted by predictive accuracy against 12 months of closed deal
 * data" — a calibration that has never been run.
 *
 * The seven modules and their one-liners are read from `lib/grade.ts`, the same
 * table the grade surface renders from, so this page cannot drift out of step
 * with what the product actually reports. **No weights are printed.**
 *
 * This section also carries what the brief scoped as its own "Agents research,
 * rules rate" section. Folding it in here is deliberate: it is three sentences,
 * it is about how the grade is produced, and the brief's overriding constraint is
 * that the finished page has FEWER sections than it started with. A three-sentence
 * section between two long ones would have made the page feel longer, not calmer.
 *
 * The source list moved here from the hero for the same reason — it belongs with
 * "what we check", not with the headline. It is exhaustive and deliberately short:
 * nothing may be added that the engine cannot show evidence from.
 */

const VP = { once: true, margin: "-100px" } as const;

const SOURCES = [
  "GujRERA filings",
  "GujRERA appellate tribunal",
  "eCourts",
  "Gujarat High Court",
  "Supreme Court",
  "IBBI",
  "Google Maps",
];

export default function SevenChecks() {
  return (
    <MotionConfig reducedMotion="user">
    <section id="features" className="crux-frame bg-crux-bg-primary py-24 md:py-36">
      <div className="crux-container">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="t-h2 text-crux-text-primary">
            Seven checks. One grade.
          </h2>
          <p className="t-voice mx-auto mt-5 max-w-[46ch] text-[22px] leading-[1.3] text-crux-green-dark md:text-[26px]">
            Same filings, same grade, every time.
          </p>
        </motion.div>

        {/* A register, not a card grid: one bordered block, hairline-divided, with
            the honesty panel closing it as the last row. */}
        <motion.div
          className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-[var(--radius-panel)] border border-crux-border bg-white shadow-[var(--shadow-premium-md)] md:mt-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        >
        <ul className="grid gap-px bg-crux-border md:grid-cols-2">
          {MODULE_ORDER.map((code) => (
            <li
              key={code}
              className="crux-row flex items-start gap-4 bg-white p-5 transition-colors duration-300 hover:bg-crux-bg-primary motion-reduce:transition-none md:p-6 md:last:col-span-2"
            >
              <span
                aria-hidden
                className="crux-row-tile mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-crux-green-tint font-mono text-[13px] font-semibold text-crux-green-dark ring-1 ring-crux-green/25"
              >
                {code}
              </span>
              <div className="min-w-0">
                <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-crux-text-primary">
                  {MODULE_LABEL[code]}
                </h3>
                <p className="mt-1.5 text-pretty text-[14px] leading-relaxed text-crux-text-secondary">
                  {MODULE_BLURB[code]}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Honesty panel. This is the section's most load-bearing paragraph: it is
            the difference between a rating and a guess dressed as one. */}
        <div className="border-t border-crux-border bg-crux-bg-accent p-5 md:p-6">
          <p className="text-pretty text-[15px] leading-relaxed text-crux-green-deep">
            When the data is too thin for a responsible grade, CRUX says{" "}
            <strong className="font-semibold text-crux-ink">Not Rated</strong>{" "}
            instead of guessing. When our court search is incomplete, we say so rather
            than calling a project clean.
          </p>
        </div>
        </motion.div>

        {/* Agents research, rules rate. */}
        <motion.div
          className="mx-auto mt-20 max-w-[62ch] text-center md:mt-28"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h3 className="text-balance text-[26px] font-bold leading-[1.1] tracking-[-0.03em] text-crux-text-primary md:text-[40px]">
            Agents do the research. Rules do the rating.
          </h3>
          <p className="mt-5 text-pretty text-[16px] leading-[1.7] text-crux-text-secondary md:text-[17px]">
            Our AI plans the searches, reads the documents and answers your questions.
            It never decides the grade. The grade comes from published rules, so the
            same filings always produce the same result — and every grade carries a
            fingerprint of the exact rulebook that produced it.
          </p>
          <Link
            href="/methodology"
            className="btn-crux btn-crux--outline group mt-7"
          >
            Read the method
            <ArrowRight
              size={15}
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
            />
          </Link>
        </motion.div>

        {/* What CRUX reads. Moved here from the hero. */}
        <div className="mx-auto mt-16 max-w-3xl border-t border-crux-line pt-10 md:mt-20">
          <h3 className="t-eyebrow text-center text-crux-text-secondary">
            What CRUX reads
          </h3>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {SOURCES.map((source) => (
              <li
                key={source}
                className="inline-flex items-center gap-2 rounded-full border border-crux-border bg-white px-3.5 py-1.5 font-mono text-[11px] tracking-[0.02em] text-crux-text-primary sm:text-[12px]"
              >
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-crux-green" />
                {source}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
    </MotionConfig>
  );
}
