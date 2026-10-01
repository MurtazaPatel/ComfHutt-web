"use client";

import { motion, MotionConfig } from "framer-motion";
import {
  BUILDERS_WITH_CASE_PCT,
  CITED_CORPUS,
  UNATTRIBUTED_CASE_PCT,
  formatCount,
} from "@/lib/landing-stats";

/**
 * The problem, stated in numbers we can actually stand behind.
 *
 * TWO cards, not the three the brief asked for. The third was to read "8% have a
 * working website". There is no field for that anywhere in the data spec and no
 * source behind it, and the brief's own standing rule is to delete an unevidenced
 * claim rather than reword it. Two numbers that survive checking carry more weight
 * than three where one folds under the first question an investor asks.
 *
 * The second card is the most important sentence on this page, so it gets the
 * visual weight: it is the moat stated as a fact. Anyone scraping the same court
 * portals without identity matching is wrong about which builder a case belongs to
 * more often than they are right.
 *
 * Its wording is careful, and deliberately weaker than the brief's. The brief said
 * those records "turn out to belong to someone else". They do not establish that.
 * What the number measures is match confidence below the counting threshold — CRUX
 * lists those records as possible and excludes them from the grade. Overstating it
 * would be the same class of error as the claims this pass removed.
 */

const VP = { once: true, margin: "-100px" } as const;

const CARDS: Array<{ value: string; body: string; emphasis: boolean }> = [
  {
    value: `${BUILDERS_WITH_CASE_PCT}%`,
    body: "of the Ahmedabad builders in our corpus have at least one court case matched to them.",
    emphasis: false,
  },
  {
    value: `${UNATTRIBUTED_CASE_PCT}%`,
    body: "of court records carrying a builder's name cannot be tied to that builder confidently enough to count. We list them as possible and keep them out of the grade.",
    emphasis: true,
  },
];

export default function ProblemSection() {
  return (
    <MotionConfig reducedMotion="user">
    {/* Forest ink: the one dark section on the page, spent on the one thing a
        reader has to leave with. */}
    <section id="the-problem" className="crux-frame surface-ink relative overflow-x-clip py-24 md:py-36">
      <div aria-hidden className="crux-plot opacity-60" />
      <div className="crux-container relative">
        <motion.h2
          className="t-h2 mx-auto max-w-[20ch] text-center text-crux-ink-text"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Before you pay ₹50 lakh, there is no way to check the builder.
        </motion.h2>

        <div className="mx-auto mt-14 grid max-w-4xl gap-4 md:mt-16 md:grid-cols-2 md:gap-5">
          {CARDS.map(({ value, body, emphasis }, i) => (
            <motion.div
              key={value}
              className={[
                "flex flex-col rounded-[var(--radius-panel)] p-7 md:p-9",
                // The emphasis card is the only light surface in the section, so
                // the eye lands on it first without it needing to be larger.
                emphasis
                  ? "bg-crux-bg-accent shadow-[var(--shadow-premium-lg)] ring-1 ring-crux-green"
                  : "border border-crux-ink-line bg-crux-ink-raised",
              ].join(" ")}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
            >
              <p
                className={[
                  "text-[56px] font-extrabold leading-none tracking-[-0.045em] md:text-[84px]",
                  emphasis ? "text-crux-green-dark" : "text-crux-ink-text",
                ].join(" ")}
              >
                {value}
              </p>
              <p
                className={[
                  "mt-5 text-pretty text-[15px] leading-relaxed md:text-[16px]",
                  emphasis ? "text-crux-green-deep" : "text-crux-ink-muted",
                ].join(" ")}
              >
                {body}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="t-voice mx-auto mt-14 max-w-[40ch] text-balance text-center text-[24px] leading-[1.3] text-crux-ink-text md:mt-16 md:text-[32px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          RERA tells you a project is registered. It does not tell you it is safe. The
          filings that hold the answer are a dozen PDFs nobody reads.
        </motion.p>

        {/* ink-muted on forest ink measures about 6.7:1. */}
        <p className="mx-auto mt-8 max-w-[70ch] text-center font-mono text-[11px] leading-relaxed text-crux-ink-muted">
          {CITED_CORPUS.source}: {formatCount(CITED_CORPUS.buildersProfiled)} Ahmedabad
          builders and {formatCount(CITED_CORPUS.casesPulled)} court records, measured{" "}
          {CITED_CORPUS.asOfLabel}.
        </p>
      </div>
    </section>
    </MotionConfig>
  );
}
