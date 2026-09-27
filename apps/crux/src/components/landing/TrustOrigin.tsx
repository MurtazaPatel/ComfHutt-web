"use client";

import { motion, MotionConfig } from "framer-motion";
import { Scale, Link2, ShieldCheck, type LucideIcon } from "lucide-react";

/**
 * Where CRUX stands, stated as its own position rather than as a quote.
 *
 * This section used to carry an unattributed quotation — "We built CRUX because
 * every Indian deserves the same property intelligence that institutional
 * investors pay lakhs for" — in quotation marks, with no speaker. A quote nobody
 * said is a fabricated testimonial, and "pay lakhs for" was a price with no
 * source. Each line below is something the locked tier list or the grading engine
 * already commits to.
 */
const PRINCIPLES: Array<{ Icon: LucideIcon; title: string; body: string }> = [
  {
    Icon: Scale,
    title: "Paid by the reader, never by the project",
    body:
      "Buyers, brokers, CAs, advocates and lenders pay for CRUX. A developer cannot buy a grade, change one, or appear here as an endorsement — and CRUX claims no endorsement from any regulator, industry body or listing portal either.",
  },
  {
    Icon: Link2,
    title: "Every finding carries its document",
    body:
      "A module verdict links back to the GujRERA filing, tribunal order or court listing it came from, so the reasoning can be checked line by line instead of taken on trust.",
  },
  {
    Icon: ShieldCheck,
    title: "No record, no grade",
    body:
      "Where the record is too thin to grade responsibly, CRUX marks the project NR and names the modules it could not assess, rather than filling the gap with an estimate.",
  },
];

const VP = { once: true, margin: "-100px" } as const;

export default function TrustOrigin() {
  // reducedMotion="user" is set per section: page.tsx is owned elsewhere, and a
  // section that animates has to honour the preference itself.
  return (
    <MotionConfig reducedMotion="user">
      <section className="overflow-hidden bg-white px-4 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-crux-green">
              Where we stand
            </p>
            <h2 className="mt-4 text-balance text-[26px] font-bold leading-tight tracking-tight text-crux-text-primary md:text-[36px]">
              A grade is only worth what you can check.
            </h2>
          </motion.div>

          <ul className="mt-10 flex list-none flex-col gap-6 p-0">
            {PRINCIPLES.map(({ Icon, title, body }, i) => (
              <motion.li
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VP}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 + i * 0.1 }}
                className="flex gap-4 rounded-2xl border border-crux-border bg-crux-bg-primary p-5 sm:p-6"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-crux-green-tint">
                  <Icon size={17} strokeWidth={1.75} aria-hidden className="text-crux-green-dark" />
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold text-crux-text-primary">{title}</p>
                  <p className="mt-1.5 text-pretty text-[14px] leading-relaxed text-crux-text-secondary">
                    {body}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            className="mt-10 text-center"
          >
            <p className="text-pretty text-[15px] leading-relaxed text-crux-text-secondary">
              Gujarat today. Ahmedabad, Gandhinagar, Surat, Vadodara and Rajkot
              carry the deepest record so far, and where CRUX grades next depends
              on which filings it can actually read — not on where the demand is.
            </p>
            <div className="mt-6 flex justify-center">
              {/* Small inline SVG wordmark: next/image buys nothing at 24px. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/comfhutt-logo.svg"
                alt="ComfHutt"
                className="h-6 w-auto opacity-60"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
