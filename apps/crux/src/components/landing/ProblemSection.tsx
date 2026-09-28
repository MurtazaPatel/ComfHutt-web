"use client";

import { motion } from "framer-motion";
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
    <section id="the-problem" className="bg-crux-bg-secondary px-4 py-20 md:py-28">
      <div className="mx-auto max-w-[1100px]">
        <motion.h2
          className="mx-auto max-w-[24ch] text-balance text-center text-[28px] font-bold leading-tight tracking-[-0.02em] text-crux-text-primary md:text-[40px]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Before you pay ₹50 lakh, there is no way to check the builder.
        </motion.h2>

        <div className="mx-auto mt-12 grid max-w-3xl gap-4 md:grid-cols-2">
          {CARDS.map(({ value, body, emphasis }, i) => (
            <motion.div
              key={value}
              className={[
                "flex flex-col rounded-2xl p-6",
                emphasis
                  ? "border-2 border-crux-green bg-crux-bg-accent"
                  : "border border-crux-border bg-white",
              ].join(" ")}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.08 }}
            >
              <p
                className={[
                  "text-[44px] font-extrabold leading-none tracking-tight md:text-[56px]",
                  emphasis ? "text-crux-green-dark" : "text-crux-text-primary",
                ].join(" ")}
              >
                {value}
              </p>
              <p className="mt-3 text-pretty text-[14px] leading-relaxed text-crux-text-secondary">
                {body}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="mx-auto mt-10 max-w-[58ch] text-pretty text-center text-[16px] leading-[1.7] text-crux-text-secondary md:text-[17px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
        >
          RERA tells you a project is registered. It does not tell you it is safe. The
          filings that hold the answer are a dozen PDFs nobody reads.
        </motion.p>

        <p className="mt-5 text-center text-[11px] leading-relaxed text-crux-text-muted">
          {CITED_CORPUS.source}: {formatCount(CITED_CORPUS.buildersProfiled)} Ahmedabad
          builders and {formatCount(CITED_CORPUS.casesPulled)} court records, measured{" "}
          {CITED_CORPUS.asOfLabel}.
        </p>
      </div>
    </section>
  );
}
