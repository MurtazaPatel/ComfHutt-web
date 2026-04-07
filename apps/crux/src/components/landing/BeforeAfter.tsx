"use client";

import { useState, useCallback, useRef, useEffect, Fragment } from "react";
import { motion, useInView } from "framer-motion";
import { XCircle, CheckCircle2, ArrowRight, ArrowDown, RotateCcw } from "lucide-react";

type RowState = "idle" | "transforming" | "activated";

const LEFT_ITEMS = [
  "Broker's word of mouth",
  "Newspaper classifieds & site visits",
  "Gut feeling & family advice",
  "Zero exit strategy, hope for the best",
  "One bad agent ruins everything",
] as const;

const RIGHT_ITEMS = [
  "20+ verified government data signals",
  "AI-powered instant property analysis",
  "Live credibility score, updated daily",
  "Structured exit via Liquidity Mesh",
  "CRUX Score: one number, full picture",
] as const;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function BeforeAfter() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.15 });

  // Refs for controlling async flows
  const hasAutoPlayed = useRef(false);
  const autoPlayAbort = useRef(false);
  const triggeredRows = useRef(new Set<number>());
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rightGlowTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [rowStates, setRowStates] = useState<RowState[]>(Array(5).fill("idle"));
  const [sublineVisible, setSublineVisible] = useState(true);
  const [streakActive, setStreakActive] = useState<number | null>(null);
  // Increment to re-trigger badge pulse animation
  const [badgePulseCount, setBadgePulseCount] = useState(0);
  const [rightGlow, setRightGlow] = useState<number | null>(null);

  const activatedCount = rowStates.filter((s) => s === "activated").length;

  // Trigger a single row's transformation sequence
  const triggerRow = useCallback(async (i: number) => {
    if (triggeredRows.current.has(i)) return;
    triggeredRows.current.add(i);

    setRowStates((prev) => {
      const next = [...prev];
      next[i] = "transforming";
      return next;
    });
    setStreakActive(i);
    setBadgePulseCount((c) => c + 1);

    await sleep(350);

    setStreakActive(null);
    setRowStates((prev) => {
      const next = [...prev];
      // Only advance if still in transforming state (not reset mid-animation)
      if (next[i] === "transforming") next[i] = "activated";
      return next;
    });
  }, []);

  // Auto-play all 5 rows sequentially
  const runAutoPlay = useCallback(
    async () => {
      autoPlayAbort.current = false;
      await sleep(500);
      for (let i = 0; i < 5; i++) {
        if (autoPlayAbort.current) return;
        await sleep(i === 0 ? 200 : 400);
        if (autoPlayAbort.current) return;
        await triggerRow(i);
      }
      if (!autoPlayAbort.current) {
        await sleep(600);
        setSublineVisible(false);
      }
    },
    [triggerRow]
  );

  // Fire auto-play on first scroll entry
  useEffect(() => {
    if (isInView && !hasAutoPlayed.current) {
      hasAutoPlayed.current = true;
      runAutoPlay();
    }
  }, [isInView, runAutoPlay]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
      if (rightGlowTimeoutRef.current) clearTimeout(rightGlowTimeoutRef.current);
    };
  }, []);

  const handleReset = useCallback(() => {
    autoPlayAbort.current = true;
    triggeredRows.current = new Set();
    hasAutoPlayed.current = false;
    setRowStates(Array(5).fill("idle"));
    setSublineVisible(true);
    setStreakActive(null);

    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    resetTimeoutRef.current = setTimeout(() => {
      hasAutoPlayed.current = true;
      runAutoPlay();
    }, 800);
  }, [runAutoPlay]);

  const handleLeftHover = useCallback(
    (i: number) => {
      // Only trigger idle rows; transforming/activated rows are left alone
      if (!triggeredRows.current.has(i)) {
        triggerRow(i);
      }
    },
    [triggerRow]
  );

  const handleRightHover = useCallback(
    (i: number) => {
      if (rowStates[i] === "activated") {
        if (rightGlowTimeoutRef.current) clearTimeout(rightGlowTimeoutRef.current);
        setRightGlow(i);
        rightGlowTimeoutRef.current = setTimeout(() => setRightGlow(null), 400);
      }
    },
    [rowStates]
  );

  return (
    <section ref={sectionRef} className="py-32 bg-white px-4">
      <div className="mx-auto max-w-[1100px]">
        {/* ── Section header ── */}
        <div className="text-center mb-16">
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="w-8 h-0.5 bg-[#22C55E]" />
            <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#22C55E]">
              THE SHIFT
            </p>
          </motion.div>
          <motion.h2
            className="text-[28px] md:text-[44px] font-bold text-[#111827] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            From gut feeling to ground truth.
          </motion.h2>
          <motion.p
            className="text-[14px] text-[#9CA3AF] mt-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            animate={{ opacity: sublineVisible ? 1 : 0 }}
          >
            Hover any row to see the transformation.
          </motion.p>
        </div>

        {/* ── DESKTOP CARD ── */}
        <div className="hidden md:block relative max-w-4xl mx-auto rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          {/*
           * Grid: 3 columns (left | 72px center | right)
           * 6 rows: 1 header + 5 data rows
           * The center spanning div (rows 1–6) holds the dashed line and arrow badge.
           * Individual center cells (one per data row, z-index 10) hold streak animations.
           */}
          <div
            className="grid"
            style={{ gridTemplateColumns: "1fr 72px 1fr" }}
          >
            {/* ── Center overlay: full-height dashed line + arrow badge ── */}
            <div
              className="bg-[#FAFAFA] pointer-events-none relative"
              style={{ gridColumn: 2, gridRow: "1 / 7", zIndex: 1 }}
            >
              {/* Dashed vertical line */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 border-l-2 border-dashed border-[#E5E7EB]" />
              {/* Arrow badge — centered on the full column height */}
              <motion.div
                key={badgePulseCount}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border-2 border-[#22C55E] flex items-center justify-center z-20"
                animate={
                  badgePulseCount > 0
                    ? {
                        scale: [1, 1.25, 1],
                        boxShadow: [
                          "0 0 0 6px rgba(34,197,94,0.08)",
                          "0 0 0 14px rgba(34,197,94,0)",
                          "0 0 0 6px rgba(34,197,94,0.08)",
                        ],
                      }
                    : {
                        scale: 1,
                        boxShadow: "0 0 0 6px rgba(34,197,94,0.08)",
                      }
                }
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <ArrowRight size={20} color="#22C55E" />
              </motion.div>
            </div>

            {/* ── Left header (row 1) ── */}
            <div
              className="bg-[#FAFAFA] px-8 pt-10 pb-8"
              style={{ gridColumn: 1, gridRow: 1 }}
            >
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#9CA3AF]">
                TODAY
              </p>
              <p className="text-[18px] font-semibold text-[#9CA3AF] mt-2">
                How India buys property
              </p>
            </div>

            {/* ── Right header (row 1) ── */}
            <div
              className="bg-[#F0FDF4] px-8 pt-10 pb-8"
              style={{ gridColumn: 3, gridRow: 1 }}
            >
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#22C55E]">
                WITH CRUX
              </p>
              <p className="text-[18px] font-semibold text-[#111827] mt-2">
                Data-driven property intelligence
              </p>
            </div>

            {/* ── Data rows (rows 2–6) ── */}
            {LEFT_ITEMS.map((leftItem, i) => {
              const state = rowStates[i];
              const isLastRow = i === 4;
              const rowBorder = !isLastRow ? "border-b border-[#F3F4F6]" : "";

              return (
                <Fragment key={i}>
                  {/* Left item */}
                  <div
                    className={`bg-[#FAFAFA] px-8 ${rowBorder} relative cursor-pointer`}
                    style={{ gridColumn: 1, gridRow: i + 2 }}
                    onMouseEnter={() => handleLeftHover(i)}
                  >
                    <motion.div
                      className="flex items-center gap-3 py-3"
                      animate={
                        state === "activated"
                          ? { opacity: 0.25, x: -8 }
                          : state === "transforming"
                          ? { opacity: 0.4, x: -6 }
                          : { opacity: 1, x: 0 }
                      }
                      transition={{ duration: state === "activated" ? 0.2 : 0.25 }}
                    >
                      <XCircle size={16} color="#FCA5A5" className="shrink-0" />
                      <span className="text-[15px] font-medium text-[#9CA3AF] leading-snug">
                        {leftItem}
                      </span>
                    </motion.div>
                    {/* Animated strikethrough — drawn as a custom div for full control */}
                    <motion.div
                      className="absolute h-[1.5px] bg-[#9CA3AF]/50 pointer-events-none"
                      style={{ top: "50%", left: 60, right: 32, transformOrigin: "left" }}
                      animate={{ scaleX: state === "activated" ? 1 : 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    />
                  </div>

                  {/* Center streak cell — overlaps the spanning center div */}
                  <div
                    className={`relative flex items-center justify-center ${rowBorder}`}
                    style={{ gridColumn: 2, gridRow: i + 2, zIndex: 10 }}
                  >
                    {/* Streak pill */}
                    <motion.div
                      className="absolute h-[2px] rounded-full overflow-visible"
                      style={{
                        top: "50%",
                        marginTop: -1,
                        left: 4,
                        right: 4,
                        background: "linear-gradient(90deg, #22C55E, transparent)",
                        transformOrigin: "left",
                      }}
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={
                        streakActive === i
                          ? {
                              scaleX: [0, 1, 1],
                              opacity: [1, 1, 0],
                            }
                          : { scaleX: 0, opacity: 0 }
                      }
                      transition={{
                        duration: 0.35,
                        times: [0, 0.57, 1],
                        ease: "easeOut",
                      }}
                    >
                      {/* Glow dot at streak tip */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#22C55E] opacity-60" />
                    </motion.div>
                  </div>

                  {/* Right item */}
                  <motion.div
                    className={`bg-[#F0FDF4] px-8 ${rowBorder} cursor-pointer`}
                    style={{ gridColumn: 3, gridRow: i + 2 }}
                    onMouseEnter={() => handleRightHover(i)}
                    animate={{
                      opacity: state === "activated" ? 1 : 0.35,
                      x: state === "activated" ? 0 : 8,
                      boxShadow:
                        rightGlow === i
                          ? "0 0 0 8px rgba(34,197,94,0.12)"
                          : "none",
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div
                      className="flex items-center gap-3 py-3 pl-3"
                      style={{
                        borderLeft: `2px solid ${state === "activated" ? "#22C55E" : "transparent"}`,
                        transition: "border-left-color 0.3s ease",
                      }}
                    >
                      <motion.div
                        animate={
                          state === "activated"
                            ? { scale: [1, 1.15, 1], opacity: 1 }
                            : { scale: 1, opacity: 0.4 }
                        }
                        transition={{ duration: 0.4 }}
                        className="shrink-0"
                      >
                        <CheckCircle2 size={16} color="#22C55E" />
                      </motion.div>
                      <motion.span
                        className="text-[15px] font-medium leading-snug"
                        animate={{
                          color: state === "activated" ? "#111827" : "#6B7280",
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {RIGHT_ITEMS[i]}
                      </motion.span>
                    </div>
                  </motion.div>
                </Fragment>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="h-[3px] bg-[#F3F4F6]">
            <motion.div
              className="h-full"
              style={{
                background: "linear-gradient(90deg, #22C55E, #16A34A)",
                borderRadius: "0 2px 2px 0",
              }}
              animate={{ width: `${(activatedCount / 5) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>

          {/* Reset button */}
          <div className="flex justify-end px-4 py-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-[12px] font-medium text-[#D1D5DB] hover:text-[#6B7280] transition-colors duration-200"
            >
              <RotateCcw size={11} />
              Reset
            </button>
          </div>
        </div>

        {/* ── MOBILE CARD ── */}
        <div className="md:hidden max-w-4xl mx-auto rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          {/* Left (TODAY) section */}
          <div className="bg-[#FAFAFA] px-6 py-8">
            <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#9CA3AF]">
              TODAY
            </p>
            <p className="text-[16px] font-semibold text-[#9CA3AF] mt-2 mb-6">
              How India buys property
            </p>
            {LEFT_ITEMS.map((item, i) => {
              const state = rowStates[i];
              return (
                <div
                  key={i}
                  className={`relative py-3${i < 4 ? " border-b border-[#F3F4F6]" : ""}`}
                >
                  <motion.div
                    className="flex items-center gap-3"
                    animate={
                      state === "activated"
                        ? { opacity: 0.25, x: -8 }
                        : state === "transforming"
                        ? { opacity: 0.4, x: -6 }
                        : { opacity: 1, x: 0 }
                    }
                    transition={{ duration: 0.25 }}
                  >
                    <XCircle size={16} color="#FCA5A5" className="shrink-0" />
                    <span className="text-[14px] font-medium text-[#9CA3AF] leading-snug">
                      {item}
                    </span>
                  </motion.div>
                  <motion.div
                    className="absolute h-[1.5px] bg-[#9CA3AF]/50 pointer-events-none"
                    style={{ top: "50%", left: 28, right: 0, transformOrigin: "left" }}
                    animate={{ scaleX: state === "activated" ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                  />
                </div>
              );
            })}
          </div>

          {/* Horizontal divider with ArrowDown badge */}
          <div className="relative flex items-center justify-center bg-white py-5">
            <div className="absolute inset-x-0 top-1/2 h-px bg-[#E5E7EB]" />
            <motion.div
              key={`mobile-badge-${badgePulseCount}`}
              className="relative z-10 w-10 h-10 rounded-full bg-white border-2 border-[#22C55E] flex items-center justify-center shadow-sm"
              animate={
                badgePulseCount > 0
                  ? {
                      scale: [1, 1.2, 1],
                      boxShadow: [
                        "0 0 0 4px rgba(34,197,94,0.08)",
                        "0 0 0 10px rgba(34,197,94,0)",
                        "0 0 0 4px rgba(34,197,94,0.08)",
                      ],
                    }
                  : { scale: 1 }
              }
              transition={{ duration: 0.4 }}
            >
              <ArrowDown size={16} color="#22C55E" />
            </motion.div>
          </div>

          {/* Right (WITH CRUX) section */}
          <div className="bg-[#F0FDF4] px-6 py-8">
            <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#22C55E]">
              WITH CRUX
            </p>
            <p className="text-[16px] font-semibold text-[#111827] mt-2 mb-6">
              Data-driven property intelligence
            </p>
            {RIGHT_ITEMS.map((item, i) => {
              const state = rowStates[i];
              return (
                <motion.div
                  key={i}
                  className={`relative py-3 pl-3${i < 4 ? " border-b border-[#F3F4F6]" : ""}`}
                  animate={{ opacity: state === "activated" ? 1 : 0.35 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    borderLeft: `2px solid ${state === "activated" ? "#22C55E" : "transparent"}`,
                    transition: "border-left-color 0.3s ease, opacity 0.3s ease",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ opacity: state === "activated" ? 1 : 0.4 }}
                      className="shrink-0"
                    >
                      <CheckCircle2 size={16} color="#22C55E" />
                    </motion.div>
                    <motion.span
                      className="text-[14px] font-medium leading-snug"
                      animate={{ color: state === "activated" ? "#111827" : "#6B7280" }}
                    >
                      {item}
                    </motion.span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="h-[3px] bg-[#F3F4F6]">
            <motion.div
              className="h-full"
              style={{
                background: "linear-gradient(90deg, #22C55E, #16A34A)",
                borderRadius: "0 2px 2px 0",
              }}
              animate={{ width: `${(activatedCount / 5) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
