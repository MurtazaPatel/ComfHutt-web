"use client";

import { motion, MotionConfig, Variants } from "framer-motion";
import Link from "next/link";
import ChatInput from "@/components/ChatInput";
import ProofStrip from "@/components/landing/ProofStrip";
import { MODULE_ORDER, MODULE_LABEL } from "@/lib/grade";

/**
 * The source list that used to sit here has moved to SevenChecks — it belongs
 * with "what we check", not with the headline, and moving it made room for the
 * proof strip the ticker used to occupy.
 */

interface HeroSectionProps {
  /**
   * Distinct Gujarat districts represented in the database, counted server-side.
   * Null when the query failed — the eyebrow then names the state without a count
   * rather than printing a zero, which would read as "we cover nowhere".
   */
  districtCount: number | null;
}

/**
 * An illustration of the grade surface, labelled as one.
 *
 * Every figure below is invented, which is why the frame says so twice: a badge
 * in the chrome and a line under the card. The old mockup showed a 0–100 number
 * as the headline, plus a fair value, a gross yield and an environmental-risk row,
 * as though they were output from a real report — three of those four are not
 * products CRUX has, and none of the numbers came from anywhere.
 */
const EXAMPLE_VERDICTS: Record<string, string> = {
  L: "2 cases found",
  D: "On its filed pace",
  T: "6 projects registered",
  F: "Filings current",
  C: "Registration valid",
  X: "Mapped",
  P: "Not assessed",
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
};

const mockupVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20, delay: 0.4 },
  },
};

const NAV_LINK =
  "text-[13px] text-crux-text-secondary hover:text-crux-text-primary transition-colors duration-200 motion-reduce:transition-none font-medium no-underline rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2";

export default function HeroSection({ districtCount }: HeroSectionProps) {
  // reducedMotion="user" is set here, per section, rather than once around the
  // page: page.tsx is a server component owned elsewhere, and a landing section
  // that animates has to honour the preference on its own.
  return (
    <MotionConfig reducedMotion="user">
      <section
        id="hero"
        className="relative w-full bg-background flex flex-col overflow-hidden"
        style={{ minHeight: "100svh" }}
      >
        {/* Background gradient mesh */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-crux-green-tint blur-[120px]" />
          <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-crux-bg-secondary blur-[100px]" />
        </div>

        {/* Navbar */}
        <nav className="sticky top-0 z-50 w-full border-b border-crux-border bg-white/60 backdrop-blur-xl">
          <div className="mx-auto max-w-6xl flex items-center justify-between px-4 sm:px-6 py-3.5">
            <Link
              href="/"
              className="flex items-center gap-2.5 no-underline group rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2"
            >
              <span
                className="font-bold text-crux-text-primary tracking-tight transition-colors motion-reduce:transition-none group-hover:text-crux-green-mid"
                style={{ fontSize: 20 }}
              >
                CRUX
              </span>
              <span className="flex items-center gap-1.5 self-end mb-0.5">
                <span className="text-[10px] text-crux-text-muted">by</span>
                {/* A 13px inline SVG wordmark: next/image would add a request and a
                    layout wrapper for no gain at this size. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/comfhutt-logo.svg"
                  alt="ComfHutt"
                  className="opacity-50 transition-opacity motion-reduce:transition-none group-hover:opacity-80"
                  style={{ height: 13, width: "auto" }}
                />
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className={NAV_LINK}>
                How it works
              </a>
              <a href="#features" className={NAV_LINK}>
                What we check
              </a>
              <a href="#pricing" className={NAV_LINK}>
                Pricing
              </a>
            </div>

            {/* Anonymous grading entry point — no signup for the first three. */}
            <Link
              href="/score"
              className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-crux-green text-white text-[12px] font-semibold shadow-[var(--shadow-premium-md)] hover:shadow-[var(--shadow-premium-glow)] transition-[box-shadow,background-color] duration-300 motion-reduce:transition-none no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2"
            >
              Grade a project
            </Link>
          </div>
        </nav>

        {/* Hero content */}
        <motion.div
          className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-14 pb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Coverage badge — states the area plainly instead of claiming a first. */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-crux-border bg-white shadow-[var(--shadow-premium-sm)]">
              <span className="w-1.5 h-1.5 rounded-full bg-crux-green motion-safe:animate-pulse" />
              <span className="text-[12px] sm:text-[13px] text-crux-text-secondary font-medium uppercase tracking-[0.12em]">
                {/* Counted server-side. On a failed query the count is dropped
                    entirely rather than rendered as 0 — "Gujarat · 0 districts"
                    would be a worse claim than naming no number at all. */}
                {districtCount === null
                  ? "Gujarat"
                  : `Gujarat · ${districtCount} ${districtCount === 1 ? "district" : "districts"}`}
              </span>
            </div>
          </motion.div>

          {/* Headline — the letter grade leads, never a 0–100 number. */}
          <motion.h1
            variants={itemVariants}
            className="mt-8 text-center font-extrabold text-crux-text-primary text-balance"
            style={{
              fontSize: "clamp(36px, 8vw, 84px)",
              lineHeight: 0.98,
              letterSpacing: "-0.03em",
            }}
          >
            They check you.
            <br />
            <span className="text-crux-green">Nobody checks them.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-5 text-center text-crux-text-secondary max-w-[560px] mx-auto leading-relaxed text-pretty"
            style={{ fontSize: "clamp(14px, 1.6vw, 17px)" }}
          >
            CRUX grades every RERA-registered project in Gujarat from A+ to D — using
            the builder&rsquo;s own certified filings and the court record. Free for
            every buyer.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-8 w-full max-w-[580px] mx-auto">
            <ChatInput size="large" />
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="mt-3 text-[12px] sm:text-[13px] text-crux-text-muted text-center"
          >
            {/* The district names that used to end this line were a five-district
                claim nothing in the database supported. The count in the eyebrow is
                queried; a hardcoded list of names was not. */}
            No signup for your first 3 grades
            <span className="mx-1.5 text-crux-green">·</span> Method published
            <span className="mx-1.5 text-crux-green">·</span> Gujarat-first
          </motion.p>

          {/* Proof strip — four corpus counters, replacing the source marquee. */}
          <motion.div variants={itemVariants} className="mt-12 w-full">
            <ProofStrip />
          </motion.div>
        </motion.div>

        {/* Illustration of the grade surface */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            className="relative rounded-t-2xl border border-b-0 border-crux-border shadow-[var(--shadow-premium-lg)] overflow-hidden bg-white"
            variants={mockupVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Frame chrome. The EXAMPLE badge sits in the chrome so it travels with
                any screenshot of this section. */}
            <div className="w-full h-10 bg-crux-bg-secondary border-b border-crux-border flex items-center justify-between px-4 gap-3">
              <div className="px-3 py-1 bg-white border border-crux-border rounded-md text-[10px] text-crux-text-muted font-mono truncate">
                crux.comfhutt.com
              </div>
              <span className="shrink-0 rounded-full bg-crux-text-primary px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white">
                Example
              </span>
            </div>

            <div className="bg-crux-bg-primary p-4 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
                {/* Letter first, composite second and smaller. */}
                <div className="flex items-center gap-4 sm:flex-col sm:items-start">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-crux-green/30 bg-crux-green-tint">
                    <span className="text-[34px] font-extrabold leading-none text-crux-green-dark">
                      B+
                    </span>
                  </div>
                  <div>
                    <p className="text-[12px] text-crux-text-secondary">
                      Composite 72
                      <span className="text-crux-text-muted">/100</span>
                    </p>
                    <p className="text-[12px] text-crux-text-muted">Confidence: medium</p>
                  </div>
                </div>

                {/* The seven modules, named from the engine's own table. */}
                <ul className="grid gap-1.5 sm:grid-cols-2">
                  {MODULE_ORDER.map((code) => (
                    <li
                      key={code}
                      className="flex items-center justify-between gap-3 rounded-lg border border-crux-border bg-white px-3 py-2"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          aria-hidden
                          className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-crux-green-tint text-[9px] font-bold text-crux-green-dark"
                        >
                          {code}
                        </span>
                        <span className="truncate text-[11px] text-crux-text-secondary">
                          {MODULE_LABEL[code]}
                        </span>
                      </span>
                      <span className="shrink-0 text-[11px] font-medium text-crux-text-primary">
                        {EXAMPLE_VERDICTS[code]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-4 text-[11px] leading-relaxed text-crux-text-muted">
                Illustration only. Not a real project, and not a real grade — every
                figure here is invented to show the layout.
              </p>
            </div>

            {/* Bottom fade into the next section */}
            <div
              className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, var(--color-crux-bg-primary) 100%)",
              }}
            />
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
