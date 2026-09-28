"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
    <section id="features" className="bg-crux-bg-secondary px-4 py-20 md:py-28">
      <div className="mx-auto max-w-[1100px]">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-balance text-[28px] font-bold leading-tight tracking-[-0.02em] text-crux-text-primary md:text-[40px]">
            Seven checks. One grade.
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-pretty text-[16px] leading-[1.7] text-crux-text-secondary md:text-[17px]">
            Same filings, same grade, every time.
          </p>
        </motion.div>

        <ul className="mx-auto mt-12 grid max-w-5xl gap-3 md:grid-cols-2">
          {MODULE_ORDER.map((code, i) => (
            <motion.li
              key={code}
              className="flex items-start gap-3.5 rounded-xl border border-crux-border bg-white p-4"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ duration: 0.45, ease: "easeOut", delay: Math.min(i, 5) * 0.05 }}
            >
              <span
                aria-hidden
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-crux-green-tint text-[12px] font-bold text-crux-green-dark"
              >
                {code}
              </span>
              <div className="min-w-0">
                <h3 className="text-[14px] font-bold tracking-tight text-crux-text-primary">
                  {MODULE_LABEL[code]}
                </h3>
                <p className="mt-1 text-pretty text-[13px] leading-snug text-crux-text-secondary">
                  {MODULE_BLURB[code]}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>

        {/* Honesty panel. This is the section's most load-bearing paragraph: it is
            the difference between a rating and a guess dressed as one. */}
        <motion.div
          className="mx-auto mt-6 max-w-5xl rounded-xl border border-crux-border bg-crux-bg-primary p-5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <p className="text-pretty text-[14px] leading-relaxed text-crux-text-secondary">
            When the data is too thin for a responsible grade, CRUX says{" "}
            <strong className="font-semibold text-crux-text-primary">Not Rated</strong>{" "}
            instead of guessing. When our court search is incomplete, we say so rather
            than calling a project clean.
          </p>
        </motion.div>

        {/* Agents research, rules rate. */}
        <motion.div
          className="mx-auto mt-14 max-w-[62ch] text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h3 className="text-balance text-[22px] font-bold tracking-[-0.01em] text-crux-text-primary md:text-[28px]">
            Agents do the research. Rules do the rating.
          </h3>
          <p className="mt-4 text-pretty text-[15px] leading-[1.7] text-crux-text-secondary md:text-[16px]">
            Our AI plans the searches, reads the documents and answers your questions.
            It never decides the grade. The grade comes from published rules, so the
            same filings always produce the same result — and every grade carries a
            fingerprint of the exact rulebook that produced it.
          </p>
          <Link
            href="/methodology"
            className="mt-5 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-[14px] font-semibold text-crux-green-mid no-underline transition-colors hover:text-crux-green-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            Read the method
            <ArrowRight size={15} aria-hidden />
          </Link>
        </motion.div>

        {/* What CRUX reads. Moved here from the hero. */}
        <div className="mx-auto mt-14 max-w-3xl">
          <h3 className="text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-crux-text-muted">
            What CRUX reads
          </h3>
          <ul className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {SOURCES.map((source) => (
              <li
                key={source}
                className="inline-flex items-center gap-1.5 rounded-full border border-crux-border bg-white px-3 py-1.5 text-[11px] font-medium text-crux-text-secondary sm:text-[12px]"
              >
                <span aria-hidden className="h-1 w-1 rounded-full bg-crux-green" />
                {source}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
