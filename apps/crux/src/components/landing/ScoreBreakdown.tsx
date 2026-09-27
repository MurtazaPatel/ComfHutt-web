"use client";

import { motion, MotionConfig } from "framer-motion";
import {
  Gavel,
  HardHat,
  Building2,
  Wallet,
  FileCheck2,
  MapPin,
  IndianRupee,
  type LucideIcon,
} from "lucide-react";
import { useSectionInView } from "@/hooks/useSectionInView";
import { MODULE_ORDER, MODULE_LABEL, MODULE_BLURB, gradeBand } from "@/lib/grade";

/**
 * The CRUX Grading Mechanism, as the engine actually defines it.
 *
 * This section used to headline "One score. Six dimensions. 20+ signals." over a
 * 94/100 ring and six retired categories — Location Intelligence weighted 30%,
 * Market Valuation citing NHB RESIDEX, a "Risk Composite" — none of which the
 * engine has emitted since it moved to seven modules. Labels and blurbs are read
 * from lib/grade.ts so this section cannot drift from the grade it describes, and
 * no module carries a weight here because the engine's weights are not published.
 */
const MODULE_ICON: Record<string, LucideIcon> = {
  L: Gavel,
  D: HardHat,
  T: Building2,
  F: Wallet,
  C: FileCheck2,
  X: MapPin,
  P: IndianRupee,
};

/** The letters, in the order a reader scans them. */
const LETTERS = ["A", "B", "C", "D"] as const;

const VP = { once: true, margin: "-100px" } as const;

function ModuleCard({
  code,
  delay,
  inView,
}: {
  code: string;
  delay: number;
  inView: boolean;
}) {
  const Icon = MODULE_ICON[code];

  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="flex flex-col gap-3 rounded-xl border border-crux-border bg-white p-5 shadow-[var(--shadow-premium-sm)] transition-[box-shadow,border-color] duration-300 hover:border-crux-green hover:shadow-[var(--shadow-premium-md)]"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-crux-green-tint">
          <Icon size={15} strokeWidth={1.75} aria-hidden className="text-crux-green-dark" />
        </span>
        <span className="text-[14px] font-semibold text-crux-text-primary">
          {MODULE_LABEL[code]}
        </span>
        {/* The engine's own module code — an identifier, not decoration. */}
        <span
          aria-hidden
          className="ml-auto text-[11px] font-bold text-crux-text-muted"
        >
          {code}
        </span>
      </div>
      <p className="text-pretty text-[13px] leading-relaxed text-crux-text-secondary">
        {MODULE_BLURB[code]}
      </p>
    </motion.li>
  );
}

export default function ScoreBreakdown() {
  const { ref, isInView } = useSectionInView(0.1);
  const nr = gradeBand("NR");

  // reducedMotion="user" is set here, per section, rather than once around the
  // page: page.tsx is a server component owned elsewhere, and a landing section
  // that animates has to honour the preference on its own.
  return (
    <MotionConfig reducedMotion="user">
    <section
      id="how-it-works"
      ref={ref}
      className="bg-crux-bg-primary px-4 py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1100px]">
        {/* Section header */}
        <div className="mb-12 text-center">
          <motion.div
            className="mb-4 inline-flex items-center gap-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="h-px w-6 bg-crux-green" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-crux-green">
              The CRUX Grading Mechanism
            </p>
            <span className="h-px w-6 bg-crux-green" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-balance text-[30px] font-bold leading-tight tracking-tight text-crux-text-primary md:text-[44px]"
          >
            One grade. Seven modules.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-pretty text-[16px] leading-relaxed text-crux-text-secondary"
          >
            Each module reads a different part of the public record on its own.
            The grade is the letter they add up to — and it is withheld rather
            than guessed at when the record is too thin.
          </motion.p>
        </div>

        {/* The letter scale. The letter is the verdict; the composite is a detail. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-2xl border border-crux-border bg-white p-6 shadow-[var(--shadow-premium-md)] md:p-8"
        >
          <dl className="grid gap-4 sm:grid-cols-2">
            {LETTERS.map((letter) => {
              const band = gradeBand(letter);
              return (
                <div key={letter} className="flex items-start gap-3">
                  <dt
                    className={`inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded-lg border px-2 text-[14px] font-bold ${band.chipClass}`}
                  >
                    {band.label}
                  </dt>
                  <dd className="min-w-0 text-[13px] leading-relaxed text-crux-text-secondary">
                    {band.meaning}
                  </dd>
                </div>
              );
            })}
          </dl>

          <div className="mt-5 flex items-start gap-3 border-t border-crux-border pt-5">
            <span
              className={`inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded-lg border px-2 text-[13px] font-bold ${nr.chipClass}`}
            >
              {nr.label}
            </span>
            <p className="min-w-0 text-[13px] leading-relaxed text-crux-text-secondary">
              Not Rated. {nr.meaning} CRUX withholds the grade instead of
              inventing one, and says which modules it could not assess.
            </p>
          </div>

          <p className="mt-5 text-[13px] leading-relaxed text-crux-text-muted">
            There is a composite number behind the letter, and you can see it. It
            stays secondary on purpose: a letter with its evidence attached is
            something you can argue with, and a number out of a hundred invites
            you to stop reading.
          </p>
        </motion.div>

        {/* The seven modules */}
        <ul className="mt-6 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {MODULE_ORDER.map((code, i) => (
            <ModuleCard
              key={code}
              code={code}
              inView={isInView}
              delay={0.2 + i * 0.06}
            />
          ))}
        </ul>

        <p className="mt-6 text-center text-[13px] leading-relaxed text-crux-text-muted">
          A module with too little verified data is marked not assessed, and one
          fatal finding can cap the whole grade regardless of the rest.
        </p>
      </div>
    </section>
    </MotionConfig>
  );
}
