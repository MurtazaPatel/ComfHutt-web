"use client";

import { useRef, useSyncExternalStore } from "react";
import { motion, MotionConfig, useInView, type Variants } from "framer-motion";
import Link from "next/link";
import ChatInput from "@/components/ChatInput";
import ProofStrip from "@/components/landing/ProofStrip";
import ScrollProgress from "@/components/motion/ScrollProgress";
import SurveyCrosshair from "@/components/motion/SurveyCrosshair";
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

const mockupVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 },
  },
};

const NAV_LINK =
  "text-[13px] text-crux-text-secondary hover:text-crux-text-primary transition-colors duration-200 motion-reduce:transition-none font-medium no-underline rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2";

const noopSubscribe = () => () => {};

export default function HeroSection({ districtCount }: HeroSectionProps) {
  // The card's "being read" sequence: a reading line, the verdicts filing in,
  // the grade stamping down. It plays when the card scrolls into view rather
  // than on load, because on most screens the card starts below the fold.
  //
  //   static — server render and no-JS: everything visible, nothing animates.
  //   armed  — hydrated but not yet seen: the parts that will animate wait hidden.
  //   play   — in view: the sequence runs once.
  const cardRef = useRef<HTMLDivElement>(null);
  const cardSeen = useInView(cardRef, { once: true, amount: 0.45 });
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const phase = !hydrated ? "static" : cardSeen ? "play" : "armed";
  const armed = phase === "armed" ? "opacity-0" : "";

  // reducedMotion="user" is set here, per section, rather than once around the
  // page: page.tsx is a server component owned elsewhere, and a landing section
  // that animates has to honour the preference on its own.
  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <section
        id="hero"
        className="crux-frame crux-frame--bare relative w-full bg-background flex flex-col overflow-hidden"
        style={{ minHeight: "100svh" }}
      >
        {/* Plot grid — the parcel lattice of a survey sheet, lit from above. */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-x-0 top-0 h-[70%]"
            style={{
              background:
                "radial-gradient(ellipse 60% 55% at 50% 0%, var(--color-crux-green-tint) 0%, transparent 70%)",
            }}
          />
          <div className="crux-plot" />
        </div>
        {/* Listens on the section, so it tracks the cursor from behind the content. */}
        <SurveyCrosshair />

        {/* Navbar */}
        <nav className="sticky top-0 z-50 w-full border-b border-crux-line bg-crux-bg-primary/75 backdrop-blur-xl">
          <div className="crux-container flex items-center justify-between py-3">
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
              className="btn-crux btn-crux--sm"
            >
              Grade a project
            </Link>
          </div>
        </nav>

        {/* Hero content */}
        {/* The entrance runs in CSS so the headline — the LCP element — paints
            with the first frame instead of waiting on hydration. */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-14 pb-12">
          {/* Coverage badge — states the area plainly instead of claiming a first. */}
          <div className="anim">
            <div className="inline-flex items-center gap-2.5 pl-3 pr-4 py-1.5 rounded-full border border-crux-border bg-white shadow-[var(--shadow-premium-sm)]">
              <span aria-hidden className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-crux-green opacity-60 motion-safe:animate-ping" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-crux-green-mid" />
              </span>
              <span className="t-eyebrow text-crux-text-secondary">
                {/* Counted server-side. On a failed query the count is dropped
                    entirely rather than rendered as 0 — "Gujarat · 0 districts"
                    would be a worse claim than naming no number at all. */}
                {districtCount === null
                  ? "Gujarat"
                  : `Gujarat · ${districtCount} ${districtCount === 1 ? "district" : "districts"}`}
              </span>
            </div>
          </div>

          {/* Headline — the letter grade leads, never a 0–100 number. */}
          {/* Each line rises on its own beat. Transform only — no fade — so the
              text is painted from the first frame and stays the LCP element. */}
          <h1
            className="mt-8 text-center font-extrabold text-crux-text-primary text-balance"
            style={{
              fontSize: "clamp(36px, 8vw, 88px)",
              lineHeight: 0.96,
              letterSpacing: "-0.045em",
            }}
          >
            <span className="anim-rise inline-block">They check you.</span>
            <br />
            {/* green-dark, not green: #10B981 on white measures 2.54:1, which fails
                even the 3.0 large-text threshold. #047857 is 5.87:1. */}
            <span
              className="anim-rise inline-block text-crux-green-dark"
              style={{ animationDelay: "0.09s" }}
            >
              Nobody checks them.
            </span>
          </h1>

          <p
            className="anim t-lead mt-6 text-center text-crux-text-secondary max-w-[600px] mx-auto"
            style={{ animationDelay: "0.08s" }}
          >
            CRUX grades every RERA-registered project in Gujarat from A+ to D — using
            the builder&rsquo;s own certified filings and the court record. Free for
            every buyer.
          </p>

          <div
            className="anim mt-9 w-full max-w-[580px] mx-auto"
            style={{ animationDelay: "0.16s" }}
          >
            <ChatInput size="large" />
          </div>

          <p
            className="anim mt-4 text-[12px] sm:text-[13px] text-crux-text-muted text-center"
            style={{ animationDelay: "0.22s" }}
          >
            {/* The district names that used to end this line were a five-district
                claim nothing in the database supported. The count in the eyebrow is
                queried; a hardcoded list of names was not. */}
            No signup for your first 3 grades
            <span aria-hidden className="mx-1.5 text-crux-green-mid">·</span> Method published
            <span aria-hidden className="mx-1.5 text-crux-green-mid">·</span> Gujarat-first
          </p>

          {/* Proof strip — four corpus counters, replacing the source marquee. */}
          <div className="anim mt-14 w-full" style={{ animationDelay: "0.3s" }}>
            <ProofStrip />
          </div>
        </div>

        {/* Illustration of the grade surface */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            className="relative rounded-t-[20px] border border-b-0 border-crux-border shadow-[var(--shadow-premium-lg)] overflow-hidden bg-white"
            variants={mockupVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Frame chrome. The EXAMPLE badge sits in the chrome so it travels with
                any screenshot of this section. */}
            <div className="w-full h-11 bg-crux-bg-secondary border-b border-crux-border flex items-center justify-between px-4 gap-3">
              <div className="px-3 py-1 bg-white border border-crux-border rounded-md text-[10px] text-crux-text-muted font-mono truncate">
                crux.comfhutt.com
              </div>
              <span className="t-eyebrow shrink-0 rounded-full bg-crux-ink px-2.5 py-1.5 text-[9px] text-crux-ink-text">
                Example
              </span>
            </div>

            <div ref={cardRef} className="relative bg-crux-bg-primary p-4 sm:p-7">
              {/* One pass of a reading line: the record being read before the
                  grade lands. Decorative, and gone under reduced motion. */}
              {phase === "play" && (
                <div
                  aria-hidden
                  className="anim-scan pointer-events-none absolute inset-0 z-10 border-b border-crux-green"
                  style={{
                    animationDelay: "0.15s",
                    background:
                      "linear-gradient(to bottom, transparent 70%, rgba(16,185,129,0.14) 100%)",
                  }}
                />
              )}
              <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-7">
                {/* Letter first, composite second and smaller. */}
                <div className="flex items-center gap-4 sm:flex-col sm:items-start">
                  <div
                    className={`${phase === "play" ? "anim-stamp" : armed} flex h-24 w-24 items-center justify-center rounded-[var(--radius-card)] border border-crux-green/30 bg-crux-green-tint shadow-[var(--shadow-premium-sm)] motion-reduce:opacity-100`}
                    style={{ animationDelay: "1.35s" }}
                  >
                    <span className="text-[42px] font-extrabold leading-none tracking-[-0.04em] text-crux-green-dark">
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
                <ul className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-crux-border bg-crux-border sm:grid-cols-2">
                  {MODULE_ORDER.map((code, i) => (
                    <li
                      key={code}
                      className="crux-row flex items-center justify-between gap-3 bg-white px-3.5 py-2.5 sm:last:col-span-2"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          aria-hidden
                          className="crux-row-tile flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded bg-crux-green-tint font-mono text-[9px] font-semibold text-crux-green-dark"
                        >
                          {code}
                        </span>
                        <span className="truncate text-[11px] text-crux-text-secondary">
                          {MODULE_LABEL[code]}
                        </span>
                      </span>
                      {/* The verdicts file in behind the reading line. */}
                      <span
                        className={`${phase === "play" ? "anim" : armed} shrink-0 text-[11px] font-medium text-crux-text-primary motion-reduce:opacity-100`}
                        style={{ animationDelay: `${0.4 + i * 0.12}s` }}
                      >
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
