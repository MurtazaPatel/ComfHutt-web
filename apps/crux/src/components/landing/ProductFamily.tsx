"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Search, TrendingUp, IndianRupee, Eye,
  ArrowRight, ChevronDown,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const SPRING = [0.16, 1, 0.3, 1] as [number, number, number, number];
const COLLAPSED_H = 280;
const EXPANDED_H  = 480;

// ─── Shared card variants (Score uses these via container stagger) ─────────────

const cardVariants = {
  hidden: {
    opacity: 0, scale: 0.92, y: 48,
    boxShadow: "0 48px 320px rgba(0,0,0,0.22)",
  },
  visible: {
    opacity: 1, scale: 1, y: 0,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    transition: { duration: 0.72, ease: SPRING, boxShadow: { duration: 0.72 } },
  },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// Score-only hover lift (expandable widgets replace this with expansion mechanic)
const scoreHover = {
  y: -6,
  boxShadow: "0 24px 64px rgba(34,197,94,0.12), 0 4px 16px rgba(0,0,0,0.08)",
  borderColor: "rgba(34,197,94,0.35)",
  transition: { type: "spring" as const, stiffness: 300, damping: 28 },
};

// ─── Base styles ──────────────────────────────────────────────────────────────

const widgetBase: React.CSSProperties = {
  borderRadius: 28,
  background: "#FFFFFF",
  border: "1px solid #E5E7EB",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  willChange: "transform, opacity",
};

// ─── Shared anatomy ───────────────────────────────────────────────────────────

function WidgetHeader({
  name,
  icon: Icon,
  trailing,
}: {
  name: string;
  icon: React.ElementType;
  trailing?: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: "20px 24px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}
    >
      <span style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>
        CRUX {name}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {trailing}
        <Icon size={16} color="#22C55E" />
      </div>
    </div>
  );
}

function WidgetFooter({
  text,
  children,
}: {
  text?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#F0FDF4",
        padding: "14px 24px",
        borderTop: "1px solid #DCFCE7",
        fontSize: 12,
        color: "#6B7280",
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexShrink: 0,
      }}
    >
      {children ?? text}
    </div>
  );
}

// ─── Expansion shared blocks ──────────────────────────────────────────────────

function GreenAccent({ isExpanded }: { isExpanded: boolean }) {
  return (
    <motion.div
      animate={{ opacity: isExpanded ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      style={{
        height: 3,
        background: "linear-gradient(90deg, #22C55E, #16A34A)",
        borderRadius: "28px 28px 0 0",
        flexShrink: 0,
      }}
    />
  );
}

function AboveBlock({
  label,
  context,
  isExpanded,
}: {
  label: string;
  context: string;
  isExpanded: boolean;
}) {
  return (
    <motion.div
      initial={{ maxHeight: 0 }}
      animate={{ maxHeight: isExpanded ? 130 : 0 }}
      transition={{ duration: 0.38, ease: SPRING }}
      style={{ overflow: "hidden", flexShrink: 0 }}
    >
      <motion.div
        animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 8 }}
        transition={{
          duration: 0.22,
          ease: "easeOut",
          delay: isExpanded ? 0.28 : 0,
        }}
        style={{ padding: "14px 24px 12px", borderBottom: "1px solid #F0FDF4" }}
      >
        <p
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#22C55E",
            fontWeight: 600,
            marginBottom: 5,
            margin: "0 0 5px",
          }}
        >
          {label}
        </p>
        <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5, margin: 0 }}>
          {context}
        </p>
      </motion.div>
    </motion.div>
  );
}

function BelowBlock({
  cta,
  trust,
  isExpanded,
}: {
  cta: string;
  trust: string;
  isExpanded: boolean;
}) {
  return (
    <motion.div
      initial={{ maxHeight: 0 }}
      animate={{ maxHeight: isExpanded ? 80 : 0 }}
      transition={{ duration: 0.38, ease: SPRING }}
      style={{ overflow: "hidden", flexShrink: 0 }}
    >
      <motion.div
        animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 8 }}
        transition={{
          duration: 0.22,
          ease: "easeOut",
          delay: isExpanded ? 0.28 : 0,
        }}
        style={{ padding: "10px 24px 14px", borderTop: "1px solid #F0FDF4" }}
      >
        <a
          href="#score-input"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12,
            color: "#22C55E",
            fontWeight: 600,
            textDecoration: "none",
            marginBottom: 5,
          }}
        >
          {cta} <ArrowRight size={12} />
        </a>
        <p style={{ fontSize: 11, color: "#9CA3AF", fontStyle: "italic", margin: 0 }}>
          {trust}
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Hook: mobile detection ───────────────────────────────────────────────────

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// ─── Expandable card motion props factory ─────────────────────────────────────

function expandCardAnimate(isInView: boolean, isExpanded: boolean) {
  return {
    opacity: isInView ? 1 : 0,
    scale: isInView ? 1 : 0.92,
    y: isInView ? 0 : 48,
    height: isExpanded ? EXPANDED_H : COLLAPSED_H,
    boxShadow: isExpanded
      ? "0 32px 80px rgba(34,197,94,0.15), 0 8px 24px rgba(0,0,0,0.10)"
      : "0 2px 8px rgba(0,0,0,0.06)",
    borderColor: isExpanded ? "rgba(34,197,94,0.40)" : "#E5E7EB",
  };
}

function expandCardTransition(entryDelay: number) {
  return {
    opacity:     { duration: 0.72, ease: SPRING, delay: entryDelay },
    scale:       { duration: 0.72, ease: SPRING, delay: entryDelay },
    y:           { duration: 0.72, ease: SPRING, delay: entryDelay },
    height:      { duration: 0.38, ease: SPRING },
    boxShadow:   { duration: 0.38 },
    borderColor: { duration: 0.2 },
  };
}

// ─── 1. CRUX Score (UNCHANGED) ────────────────────────────────────────────────

const DIMENSIONS = [
  { label: "Location", pct: 88 },
  { label: "Developer", pct: 94 },
  { label: "Legal", pct: 92 },
  { label: "Market", pct: 85 },
  { label: "Structural", pct: 90 },
  { label: "Risk", pct: 95 },
] as const;

function ScoreWidget({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / 1500, 1);
        setCount(Math.round(p * 94));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, 900);
    return () => clearTimeout(timer);
  }, [isInView]);

  return (
    <motion.div
      ref={ref}
      className={`shrink-0 w-[85vw] snap-center min-h-[280px] md:w-auto md:shrink md:snap-align-none md:min-h-0${className ? " " + className : ""}`}
      variants={cardVariants}
      whileHover={scoreHover}
      style={{ ...widgetBase, height: "100%" }}
    >
      <WidgetHeader name="Score" icon={ShieldCheck} />

      <div
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 24px 12px",
        }}
      >
        <motion.div
          animate={
            isInView
              ? { filter: "drop-shadow(0 0 7px rgba(34,197,94,0.45))" }
              : { filter: "drop-shadow(0 0 0px rgba(34,197,94,0))" }
          }
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 2.5 }}
          style={{ willChange: "filter" }}
        >
          <svg width={128} height={128} viewBox="0 0 128 128">
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#16A34A" />
              </linearGradient>
            </defs>
            <circle cx={64} cy={64} r={52} stroke="#F3F4F6" strokeWidth={8} fill="none" />
            <motion.circle
              cx={64} cy={64} r={52}
              stroke="url(#scoreGrad)" strokeWidth={8} strokeLinecap="round" fill="none"
              transform="rotate(-90 64 64)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isInView ? 0.94 : 0 }}
              transition={{ duration: 1.5, ease: SPRING, delay: 0.85 }}
              style={{ willChange: "stroke-dashoffset" }}
            />
            <text x={64} y={60} textAnchor="middle" dominantBaseline="middle" fontSize={38} fontWeight={800} fill="#111827" fontFamily="Inter, system-ui, sans-serif">
              {count}
            </text>
            <text x={64} y={80} textAnchor="middle" fontSize={11} fill="#9CA3AF" fontFamily="Inter, system-ui, sans-serif">
              out of 100
            </text>
          </svg>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 1.0, ease: SPRING }}
          style={{ fontSize: 13, color: "#6B7280", marginTop: 12, textAlign: "center" }}
        >
          Composite Credibility Index
        </motion.p>
      </div>

      {/* Dimension bars — desktop only */}
      <div
        className="hidden lg:block"
        style={{ borderTop: "1px solid #F3F4F6", padding: "16px 24px 12px", flexShrink: 0 }}
      >
        {DIMENSIONS.map((dim, i) => (
          <motion.div
            key={dim.label}
            initial={{ opacity: 0, x: -8 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.35, delay: 1.0 + i * 0.08, ease: SPRING }}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              marginBottom: i < DIMENSIONS.length - 1 ? 10 : 0,
              willChange: "transform, opacity",
            }}
          >
            <span style={{ fontSize: 12, color: "#6B7280", width: "5.5rem", flexShrink: 0 }}>
              {dim.label}
            </span>
            <div style={{ flex: 1, height: 5, background: "#F3F4F6", borderRadius: 9999, overflow: "hidden" }}>
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: isInView ? `${dim.pct}%` : "0%" }}
                transition={{ duration: 0.8, delay: 1.0 + i * 0.1, ease: SPRING }}
                style={{ height: "100%", borderRadius: 9999, background: "#22C55E", willChange: "width" }}
              />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#111827", width: "2.2rem", textAlign: "right", flexShrink: 0 }}>
              {dim.pct}%
            </span>
          </motion.div>
        ))}
      </div>

      <WidgetFooter>
        <span
          className="animate-pulse"
          style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", display: "inline-block", flexShrink: 0 }}
        />
        <span>Always shown before price</span>
      </WidgetFooter>
    </motion.div>
  );
}

// ─── 2. CRUX Lens (expandable, expand DOWN — top row) ─────────────────────────

function LensWidget() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  const [showUser, setShowUser] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const runSequence = useCallback((baseDelay = 0) => {
    setShowUser(false);
    setShowTyping(false);
    setShowAI(false);
    const t1 = setTimeout(() => setShowUser(true), baseDelay + 80);
    const t2 = setTimeout(() => setShowTyping(true), baseDelay + 500);
    const t3 = setTimeout(() => setShowTyping(false), baseDelay + 1520);
    const t4 = setTimeout(() => setShowAI(true), baseDelay + 1660);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!isInView) return;
    const cleanup = runSequence(850);
    const id = setInterval(() => runSequence(0), 6250);
    return () => { cleanup(); clearInterval(id); };
  }, [isInView, runSequence]);

  // Mobile: close on outside click
  useEffect(() => {
    if (!isMobile || !isExpanded) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsExpanded(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMobile, isExpanded]);

  const expandHandlers = isMobile
    ? { onClick: (e: React.MouseEvent) => { e.stopPropagation(); setIsExpanded(p => !p); } }
    : { onHoverStart: () => setIsExpanded(true), onHoverEnd: () => setIsExpanded(false) };

  return (
    // Wrapper: holds grid space, raises z-index on expand
    <div
      ref={ref}
      className="relative shrink-0 w-[85vw] snap-center min-h-[280px] md:w-auto md:snap-align-none md:h-[280px] md:min-h-0"
      style={{ zIndex: isExpanded ? 50 : "auto" }}
    >
      {/* Expanding card — top: 0 means grows downward on md+ */}
      <motion.div
        className="md:absolute md:inset-x-0 md:top-0"
        initial={{ opacity: 0, scale: 0.92, y: 48 }}
        animate={expandCardAnimate(isInView, isExpanded)}
        transition={expandCardTransition(0.12)}
        style={{ ...widgetBase, cursor: isMobile ? "pointer" : "default" }}
        {...expandHandlers}
      >
        <GreenAccent isExpanded={isExpanded} />
        <AboveBlock
          label="AI RESEARCH ASSISTANT"
          context="Ask about litigation, title history, RERA filings, or encumbrances — CRUX Lens queries 6 live legal databases and responds in plain English."
          isExpanded={isExpanded}
        />

        <WidgetHeader
          name="Lens"
          icon={Search}
          trailing={
            <motion.span
              className="inline-flex md:hidden"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={14} color="#9CA3AF" />
            </motion.span>
          }
        />

        {/* Live body — mini chat */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            padding: "0 20px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            justifyContent: "center",
          }}
        >
          <AnimatePresence>
            {showUser && (
              <motion.div
                key="user"
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                style={{
                  background: "#F0FDF4",
                  borderRadius: "14px 14px 14px 4px",
                  padding: "10px 14px",
                  fontSize: 13,
                  color: "#111827",
                  alignSelf: "flex-end",
                  maxWidth: "80%",
                  willChange: "transform, opacity",
                }}
              >
                Any litigation on this property?
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  alignSelf: "flex-start",
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "14px 14px 4px 14px",
                  padding: "10px 14px",
                  display: "flex",
                  gap: 4,
                  alignItems: "center",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: "#22C55E", display: "inline-block",
                      animation: "lensTyping 1s ease-in-out infinite",
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showAI && (
              <motion.div
                key="ai"
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "14px 14px 4px 14px",
                  padding: "10px 14px",
                  fontSize: 13,
                  color: "#6B7280",
                  alignSelf: "flex-start",
                  maxWidth: "85%",
                  willChange: "transform, opacity",
                }}
              >
                ✓ Zero litigation across 3 court databases. Title is clean.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <BelowBlock
          cta="Ask your first question"
          trust="Powered by eCourts API · MCA21 · State IGR · RERA portal"
          isExpanded={isExpanded}
        />
        <WidgetFooter text="Ask anything about any property" />
      </motion.div>
    </div>
  );
}

// ─── 3. CRUX Cast (expandable, expand DOWN — top row) ─────────────────────────

function CastWidget() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isInView) return;
    const t = setTimeout(() => setShowTooltip(true), 850 + 1700);
    return () => clearTimeout(t);
  }, [isInView]);

  useEffect(() => {
    if (!isMobile || !isExpanded) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsExpanded(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMobile, isExpanded]);

  const expandHandlers = isMobile
    ? { onClick: (e: React.MouseEvent) => { e.stopPropagation(); setIsExpanded(p => !p); } }
    : { onHoverStart: () => setIsExpanded(true), onHoverEnd: () => setIsExpanded(false) };

  const W = 340; const H = 100;
  const pcts = [0.55, 0.62, 0.68, 0.76, 0.88];
  const pts = pcts.map((p, i) => ({ x: (i / (pcts.length - 1)) * W, y: H * (1 - p) }));
  const last = pts[pts.length - 1];
  const secondLast = pts[pts.length - 2];
  const allPoints = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaD = `M ${pts[0].x},${H} ${pts.map((p) => `L ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")} L ${last.x},${H} Z`;

  return (
    <div
      ref={ref}
      className="relative shrink-0 w-[85vw] snap-center min-h-[280px] md:w-auto md:snap-align-none md:h-[280px] md:min-h-0"
      style={{ zIndex: isExpanded ? 50 : "auto" }}
    >
      <motion.div
        className="md:absolute md:inset-x-0 md:top-0"
        initial={{ opacity: 0, scale: 0.92, y: 48 }}
        animate={expandCardAnimate(isInView, isExpanded)}
        transition={expandCardTransition(0.24)}
        style={{ ...widgetBase, cursor: isMobile ? "pointer" : "default" }}
        {...expandHandlers}
      >
        <GreenAccent isExpanded={isExpanded} />
        <AboveBlock
          label="FAIR VALUE ENGINE"
          context="Triangulates property value using three institutional methods — Income Capitalization, Sales Comparable, and Replacement Cost — then surfaces the consensus fair value."
          isExpanded={isExpanded}
        />

        <WidgetHeader
          name="Cast"
          icon={TrendingUp}
          trailing={
            <motion.span
              className="inline-flex md:hidden"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={14} color="#9CA3AF" />
            </motion.span>
          }
        />

        {/* Live body — chart */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            padding: "12px 24px 0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative" }}>
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: SPRING }}
                  style={{
                    position: "absolute", right: 0, top: -6,
                    background: "#111827", borderRadius: 6, padding: "3px 8px",
                    fontSize: 11, color: "#FFFFFF", fontWeight: 600,
                    pointerEvents: "none", zIndex: 2, whiteSpace: "nowrap",
                  }}
                >
                  ₹82.3L
                </motion.div>
              )}
            </AnimatePresence>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ overflow: "visible", display: "block" }}>
              <defs>
                <linearGradient id="castAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(34,197,94,0.15)" />
                  <stop offset="100%" stopColor="rgba(34,197,94,0)" />
                </linearGradient>
              </defs>
              <motion.path d={areaD} fill="url(#castAreaGrad)" initial={{ opacity: 0 }} animate={{ opacity: isInView ? 1 : 0 }} transition={{ duration: 1.5, ease: SPRING, delay: 0.85 }} />
              <motion.polyline points={allPoints} stroke="#22C55E" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: isInView ? 1 : 0 }} transition={{ duration: 1.5, ease: SPRING, delay: 0.85 }} style={{ willChange: "stroke-dashoffset" }} />
              <line x1={secondLast.x} y1={secondLast.y} x2={last.x} y2={last.y} stroke="#FFFFFF" strokeWidth={3} strokeDasharray="4 3" />
              <line x1={secondLast.x} y1={secondLast.y} x2={last.x} y2={last.y} stroke="#22C55E" strokeWidth={2.5} strokeDasharray="4 3" strokeLinecap="round" />
              <motion.circle cx={last.x} cy={last.y} r={6} fill="none" stroke="#22C55E" strokeWidth={1.5} animate={isInView ? { r: [6, 13, 6], opacity: [0.35, 0, 0.35] } : {}} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 2.4 }} />
              <circle cx={last.x} cy={last.y} r={4} fill="#22C55E" />
            </svg>
          </div>
          <p style={{ fontSize: 11, color: "#9CA3AF", letterSpacing: "0.05em", textAlign: "center", margin: "10px 0 12px" }}>
            Income Cap · Comparable · Replacement
          </p>
        </div>

        <BelowBlock
          cta="See valuation breakdown"
          trust="Benchmarked against NHB RESIDEX · CPWD rates · 90-day sales data"
          isExpanded={isExpanded}
        />
        <WidgetFooter text="Three institutional-grade valuation methods" />
      </motion.div>
    </div>
  );
}

// ─── 4. CRUX Yield (expandable, expand UP — bottom row) ──────────────────────

const BARS = [
  { label: "Gross Yield", value: "7.2%", pct: "72%", color: "#22C55E" },
  { label: "Net Yield",   value: "5.8%", pct: "58%", color: "#16A34A" },
  { label: "After Tax",  value: "4.6%", pct: "46%", color: "#15803D" },
] as const;

function YieldWidget() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile || !isExpanded) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsExpanded(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMobile, isExpanded]);

  const expandHandlers = isMobile
    ? { onClick: (e: React.MouseEvent) => { e.stopPropagation(); setIsExpanded(p => !p); } }
    : { onHoverStart: () => setIsExpanded(true), onHoverEnd: () => setIsExpanded(false) };

  return (
    <div
      ref={ref}
      className="relative shrink-0 w-[85vw] snap-center min-h-[280px] md:w-auto md:snap-align-none md:h-[280px] md:min-h-0"
      style={{ zIndex: isExpanded ? 50 : "auto" }}
    >
      {/* bottom: 0 on md+ → card grows UPWARD */}
      <motion.div
        className="md:absolute md:inset-x-0 md:bottom-0"
        initial={{ opacity: 0, scale: 0.92, y: 48 }}
        animate={expandCardAnimate(isInView, isExpanded)}
        transition={expandCardTransition(0.36)}
        style={{ ...widgetBase, cursor: isMobile ? "pointer" : "default" }}
        {...expandHandlers}
      >
        <GreenAccent isExpanded={isExpanded} />
        <AboveBlock
          label="RENTAL RETURN FORECAST"
          context="Models gross, net, and post-tax rental yield for any property using local rental comps, vacancy rates, maintenance estimates, and applicable TDS deductions."
          isExpanded={isExpanded}
        />

        <WidgetHeader
          name="Yield"
          icon={IndianRupee}
          trailing={
            <motion.span
              className="inline-flex md:hidden"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={14} color="#9CA3AF" />
            </motion.span>
          }
        />

        {/* Live body — yield bars */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {BARS.map((bar, i) => (
            <motion.div
              key={bar.label}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.85 + i * 0.12, ease: SPRING }}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                marginBottom: i < BARS.length - 1 ? 14 : 0,
                willChange: "transform, opacity",
              }}
            >
              <span style={{ fontWeight: 500, fontSize: 13, color: "#6B7280", width: "6.5rem", flexShrink: 0 }}>
                {bar.label}
              </span>
              <div style={{ flex: 1, height: 8, background: "#F3F4F6", borderRadius: 9999, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: isInView ? bar.pct : "0%" }}
                  transition={{ duration: 1, delay: 0.85 + i * 0.15, ease: SPRING }}
                  style={{ height: "100%", borderRadius: 9999, background: bar.color, willChange: "width" }}
                />
              </div>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#111827", width: "2.5rem", textAlign: "right", flexShrink: 0 }}>
                {bar.value}
              </span>
            </motion.div>
          ))}
          <p style={{ fontSize: 11, color: "#9CA3AF", fontStyle: "italic", marginTop: 14 }}>
            Based on Ahmedabad residential avg, FY25
          </p>
        </div>

        <BelowBlock
          cta="Calculate your yield"
          trust="Based on 99acres · MagicBricks · verified lease registry data"
          isExpanded={isExpanded}
        />
        <WidgetFooter text="Know your net returns before you commit" />
      </motion.div>
    </div>
  );
}

// ─── 5. CRUX Watch (expandable, expand UP — bottom row) ──────────────────────

type WatchEvent = { id: number; time: string; text: string; hl?: string; hlColor?: string };

const SEED_EVENTS: WatchEvent[] = [
  { id: 1, time: "2 min ago",  text: "CRUX Score updated: 91 → 94 ", hl: "↑", hlColor: "#22C55E" },
  { id: 2, time: "41 min ago", text: "New comparable sale detected nearby" },
  { id: 3, time: "3 hr ago",   text: "Developer RERA renewal confirmed ", hl: "✓", hlColor: "#22C55E" },
];

const ROTATION_EVENTS: Omit<WatchEvent, "id">[] = [
  { time: "Just now",  text: "Price drop alert: −2.3% in area ", hl: "↓", hlColor: "#EF4444" },
  { time: "1 min ago", text: "Legal clearance document verified ", hl: "✓", hlColor: "#22C55E" },
  { time: "5 min ago", text: "Builder rating updated: 4.2 → 4.5 ", hl: "↑", hlColor: "#22C55E" },
];

function WatchWidget() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();
  const [events, setEvents] = useState<WatchEvent[]>(SEED_EVENTS);
  const [initialised, setInitialised] = useState(false);
  const rotationIdx = useRef(0);

  useEffect(() => {
    if (!isInView) return;
    const initTimer = setTimeout(() => setInitialised(true), 850 + 3 * 180 + 400);
    const rotationStart = setTimeout(() => {
      const id = setInterval(() => {
        setEvents((prev) => {
          const next = ROTATION_EVENTS[rotationIdx.current % ROTATION_EVENTS.length];
          rotationIdx.current++;
          return [{ ...next, id: Date.now() }, ...prev.slice(0, 2)];
        });
      }, 5000);
      return () => clearInterval(id);
    }, 850 + 3 * 180 + 1200);
    return () => { clearTimeout(initTimer); clearTimeout(rotationStart); };
  }, [isInView]);

  useEffect(() => {
    if (!isMobile || !isExpanded) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsExpanded(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMobile, isExpanded]);

  const expandHandlers = isMobile
    ? { onClick: (e: React.MouseEvent) => { e.stopPropagation(); setIsExpanded(p => !p); } }
    : { onHoverStart: () => setIsExpanded(true), onHoverEnd: () => setIsExpanded(false) };

  return (
    <div
      ref={ref}
      className="relative shrink-0 w-[85vw] snap-center min-h-[280px] md:w-auto md:snap-align-none md:h-[280px] md:min-h-0"
      style={{ zIndex: isExpanded ? 50 : "auto" }}
    >
      {/* bottom: 0 on md+ → card grows UPWARD */}
      <motion.div
        className="md:absolute md:inset-x-0 md:bottom-0"
        initial={{ opacity: 0, scale: 0.92, y: 48 }}
        animate={expandCardAnimate(isInView, isExpanded)}
        transition={expandCardTransition(0.48)}
        style={{ ...widgetBase, cursor: isMobile ? "pointer" : "default" }}
        {...expandHandlers}
      >
        <GreenAccent isExpanded={isExpanded} />
        <AboveBlock
          label="LIVE PROPERTY MONITOR"
          context="Set a watch on any property and CRUX alerts you the moment its score changes — new court filings, developer RERA lapses, comparable sales, or AQI shifts."
          isExpanded={isExpanded}
        />

        <WidgetHeader
          name="Watch"
          icon={Eye}
          trailing={
            <motion.span
              className="inline-flex md:hidden"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={14} color="#9CA3AF" />
            </motion.span>
          }
        />

        {/* Live body — event feed */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            padding: "8px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <AnimatePresence mode="popLayout">
            {events.map((ev, i) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }}
                transition={{
                  duration: 0.35,
                  delay: isInView && !initialised ? 0.85 + i * 0.18 : 0,
                  ease: SPRING,
                }}
                style={{
                  display: "flex", gap: 10, alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: i < events.length - 1 ? "1px solid #F3F4F6" : "none",
                  willChange: "transform, opacity",
                }}
              >
                <span
                  style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: "#22C55E", flexShrink: 0, marginTop: 5,
                    display: "inline-block",
                    animation: "watchPulse 2s ease-in-out infinite",
                    animationDelay: `${(i * 0.66).toFixed(2)}s`,
                  }}
                />
                <div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>{ev.time}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>
                    {ev.text}
                    {ev.hl && <span style={{ color: ev.hlColor }}>{ev.hl}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <BelowBlock
          cta="Start watching a property"
          trust="Alerts delivered via email · Score recalculated on every data change"
          isExpanded={isExpanded}
        />
        <WidgetFooter text="Score changes trigger instant alerts" />
      </motion.div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function ProductFamily() {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerInView = useInView(containerRef, { once: true, amount: 0.05 });

  return (
    <section
      id="features"
      className="py-32 px-4"
      style={{ background: "#F9FAFB", overflowX: "hidden" }}
    >
      <style>{`
        @keyframes watchPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.25; }
        }
        @keyframes lensTyping {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }
      `}</style>

      <div className="mx-auto max-w-[1100px]">
        {/* Section header */}
        <div className="text-center" style={{ marginBottom: 80 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}
          >
            <div style={{ width: 32, height: 2, background: "#22C55E" }} />
            <p style={{ fontSize: 12, letterSpacing: "0.2em", fontWeight: 600, color: "#22C55E", textTransform: "uppercase" }}>
              CRUX Products
            </p>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#111827", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 16 }}
          >
            One engine. Five dimensions of intelligence.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            style={{ fontSize: 17, color: "#6B7280", maxWidth: "36rem", margin: "0 auto" }}
          >
            Each product is a different lens on the same underlying intelligence.
          </motion.p>
        </div>

        {/* Bento grid
            Mobile (< md):  1-col stack, each widget min-h-[280px], normal flow
            Tablet (md):    2-col, Score col-span-2 top, then 2x2 below
            Desktop (lg):   3-col, Score row-span-2 left, Lens/Cast top-right, Yield/Watch bottom-right
        */}
        <motion.div
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate={containerInView ? "visible" : "hidden"}
          className="
            flex flex-row overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 gap-5
            md:grid md:grid-cols-2 md:overflow-visible md:pb-0 md:mx-0 md:px-0
            lg:grid-cols-3
            md:[grid-auto-rows:280px]
            lg:[grid-auto-rows:280px]
          "
        >
          {/* Score: direct motion.div child — receives container stagger, stays in normal grid flow */}
          <ScoreWidget className="md:col-span-2 lg:col-span-1 lg:row-span-2" />

          {/* Expandable widgets: wrapper divs hold grid space, inner cards expand absolutely on md+ */}
          <LensWidget />
          <CastWidget />
          <YieldWidget />
          <WatchWidget />
        </motion.div>
      </div>
    </section>
  );
}
