"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";

// ─── Constants ────────────────────────────────────────────────────────────────

const SPRING = [0.16, 1, 0.3, 1] as [number, number, number, number];

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  eyebrow: string;
  name: string;
  tagline: string;
  description: string;
  pills: string[];
}

// ─── Product data ─────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  {
    id: 0,
    eyebrow: "01 / 05",
    name: "CRUX Score",
    tagline: "Trust, quantified.",
    description:
      "A 0–100 credibility index computed from 20+ verified data signals. Legal clarity, developer reliability, location quality — all in one number. Shown before price, always.",
    pills: ["20+ data signals", "Legal clarity", "Developer track record"],
  },
  {
    id: 1,
    eyebrow: "02 / 05",
    name: "CRUX Lens",
    tagline: "Ask anything. Get truth.",
    description:
      "A RAG-powered property intelligence assistant. Ask about litigation, RERA status, builder history — get sourced, verified answers in plain English.",
    pills: ["RAG-powered", "eCourts API", "RERA portal"],
  },
  {
    id: 2,
    eyebrow: "03 / 05",
    name: "CRUX Cast",
    tagline: "See the future price.",
    description:
      "Fair value estimation and 1–3 year appreciation forecast using institutional-grade valuation methods. Know if you're overpaying before you sign.",
    pills: ["Fair value engine", "Sales comparables", "Income cap"],
  },
  {
    id: 3,
    eyebrow: "04 / 05",
    name: "CRUX Yield",
    tagline: "Know your rent before you invest.",
    description:
      "Rental income forecast powered by micro-locality demand data — job density, transit access, comparable rents. Gross, net, and after-tax yield.",
    pills: ["Rental comps", "Vacancy modeling", "Net yield after tax"],
  },
  {
    id: 4,
    eyebrow: "05 / 05",
    name: "CRUX Watch",
    tagline: "Your property never sleeps.",
    description:
      "Continuous monitoring with real-time alerts. Score changes, legal filings, market shifts — you know first, every time.",
    pills: ["Real-time alerts", "Score change tracking", "Legal monitoring"],
  },
];

// ─── useIsMobile ──────────────────────────────────────────────────────────────

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

// ─── LeftPanel ────────────────────────────────────────────────────────────────

function LeftPanel({
  product,
  isMobile,
}: {
  product: Product;
  isMobile: boolean;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={product.id}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          padding: isMobile ? "0 16px" : "0",
        }}
      >
        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 20,
              height: 2,
              background: "#22C55E",
              borderRadius: 2,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              color: "#22C55E",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {product.eyebrow}
          </span>
        </div>

        {/* Name + tagline */}
        <div>
          <h3
            style={{
              fontSize: "clamp(28px, 3.5vw, 48px)",
              fontWeight: 800,
              color: "#111827",
              lineHeight: 1.1,
              margin: "0 0 10px",
            }}
          >
            {product.name}
          </h3>
          <p
            style={{
              fontSize: "clamp(15px, 1.3vw, 18px)",
              color: "#22C55E",
              fontStyle: "italic",
              fontWeight: 500,
              margin: 0,
            }}
          >
            {product.tagline}
          </p>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: 15,
            color: "#6B7280",
            lineHeight: 1.75,
            margin: 0,
            maxWidth: 380,
          }}
        >
          {product.description}
        </p>

        {/* Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {product.pills.map((pill) => (
            <span
              key={pill}
              style={{
                background: "#F0FDF4",
                color: "#16A34A",
                border: "1px solid #D1FAE5",
                borderRadius: 999,
                padding: "5px 14px",
                fontSize: 12,
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              {pill}
            </span>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── ProgressDots ─────────────────────────────────────────────────────────────

function ProgressDots({
  active,
  isMobile,
}: {
  active: number;
  isMobile: boolean;
}) {
  if (isMobile) {
    return (
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "row",
          gap: 8,
          zIndex: 10,
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{
              width: 8,
              height: i === active ? 24 : 8,
              background: i === active ? "#22C55E" : "#D1D5DB",
            }}
            style={{ borderRadius: 4, flexShrink: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        right: 32,
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        zIndex: 10,
      }}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          animate={{
            width: i === active ? 28 : 8,
            height: 8,
            background: i === active ? "#22C55E" : "#D1D5DB",
          }}
          style={{ borderRadius: 4, flexShrink: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

// ─── WidgetCard ───────────────────────────────────────────────────────────────

function WidgetCard({
  children,
  isMobile,
  minHeight = 380,
}: {
  children: React.ReactNode;
  isMobile: boolean;
  minHeight?: number;
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: 24,
        boxShadow: "0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
        width: "100%",
        maxWidth: isMobile ? "100%" : 460,
        padding: isMobile ? "24px 20px" : "28px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        minHeight: isMobile ? "auto" : minHeight,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

// ─── 1. CRUX Score Widget ─────────────────────────────────────────────────────

const SCORE_CATEGORIES = [
  { label: "Location", pct: 30, score: 88 },
  { label: "Developer", pct: 20, score: 94 },
  { label: "Legal", pct: 20, score: 92 },
  { label: "Market", pct: 15, score: 85 },
  { label: "Structural", pct: 10, score: 90 },
  { label: "Risk", pct: 5, score: 95 },
];

function ScoreWidget({ isMobile }: { isMobile: boolean }) {
  const r = 88;
  const circumference = 2 * Math.PI * r; // ≈ 552.9
  const targetScore = 82;
  const targetOffset = circumference - (circumference * targetScore) / 100;

  const [started, setStarted] = useState(false);
  const count = useCountUp(targetScore, 1400, started);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <WidgetCard isMobile={isMobile} minHeight={400}>
      <style>{`
        @keyframes pfScoreGlow {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(34,197,94,0.35)); }
          50%       { filter: drop-shadow(0 0 14px rgba(34,197,94,0.65)); }
        }
      `}</style>

      {/* Gauge + label */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            position: "relative",
            width: isMobile ? 100 : 116,
            height: isMobile ? 100 : 116,
            flexShrink: 0,
          }}
        >
          <svg
            viewBox="0 0 200 200"
            className="-rotate-90"
            style={{ width: "100%", height: "100%" }}
          >
            <defs>
              <linearGradient
                id="pf-scoreGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="60%" stopColor="#16A34A" />
                <stop offset="100%" stopColor="#15803D" />
              </linearGradient>
            </defs>
            {/* Track */}
            <circle
              cx="100"
              cy="100"
              r={r}
              stroke="#F3F4F6"
              strokeWidth="13"
              fill="none"
            />
            {/* Score arc */}
            <motion.circle
              cx="100"
              cy="100"
              r={r}
              stroke="url(#pf-scoreGrad)"
              strokeWidth="13"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{
                strokeDashoffset: started ? targetOffset : circumference,
              }}
              transition={{ duration: 1.4, ease: "easeOut", delay: 0.1 }}
              style={
                started
                  ? { animation: "pfScoreGlow 2.5s ease-in-out 1.6s infinite" }
                  : {}
              }
            />
          </svg>
          {/* Score number */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: isMobile ? 30 : 34,
                fontWeight: 800,
                color: "#111827",
                lineHeight: 1,
              }}
            >
              {count}
            </span>
            <span
              style={{
                fontSize: 9,
                color: "#9CA3AF",
                fontWeight: 500,
                letterSpacing: "0.06em",
              }}
            >
              / 100
            </span>
          </div>
        </div>

        <div>
          <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 3px" }}>
            CRUX Score
          </p>
          <p
            style={{
              fontSize: 14,
              color: "#111827",
              fontWeight: 700,
              margin: "0 0 4px",
            }}
          >
            Strong Credibility
          </p>
          <span
            style={{
              background: "#F0FDF4",
              color: "#16A34A",
              border: "1px solid #DCFCE7",
              borderRadius: 999,
              padding: "3px 10px",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            Top 18% in area
          </span>
        </div>
      </div>

      {/* Category bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        <p
          style={{
            fontSize: 11,
            color: "#9CA3AF",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            margin: 0,
            fontWeight: 600,
          }}
        >
          Score breakdown
        </p>
        {SCORE_CATEGORIES.map((cat, i) => (
          <div
            key={cat.label}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <span
              style={{
                fontSize: 11,
                color: "#6B7280",
                width: 68,
                flexShrink: 0,
              }}
            >
              {cat.label}
            </span>
            <div
              style={{
                flex: 1,
                height: 5,
                background: "#F3F4F6",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: started ? `${cat.score}%` : 0 }}
                transition={{
                  duration: 0.65,
                  ease: SPRING,
                  delay: 0.35 + i * 0.08,
                }}
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #22C55E, #16A34A)",
                  borderRadius: 3,
                }}
              />
            </div>
            <span
              style={{
                fontSize: 10,
                color: "#9CA3AF",
                width: 24,
                textAlign: "right",
              }}
            >
              {cat.pct}%
            </span>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}

// ─── 2. CRUX Lens Widget ──────────────────────────────────────────────────────

const Q1 = "Any litigation on this property?";
const R1 = "✓ No active litigation found. Last check: eCourts API, 2 hours ago.";
const Q2 = "What's the RERA status?";
const R2 = "Registered — RERA/GJ/2024/001892. Valid until Dec 2029.";

function LensWidget({ isMobile }: { isMobile: boolean }) {
  const [phase, setPhase] = useState(0);
  // 0 = empty
  // 1 = typing Q1
  // 2 = Q1 done, typing dots for R1
  // 3 = R1 visible
  // 4 = typing Q2
  // 5 = Q2 done, typing dots for R2
  // 6 = R2 visible
  const [q1Text, setQ1Text] = useState("");
  const [q2Text, setQ2Text] = useState("");
  const [showDots, setShowDots] = useState(false);
  const [dotsFor, setDotsFor] = useState<1 | 2>(1);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let seq = 0; // running cursor in ms

    const schedule = (fn: () => void, delay: number) => {
      const t = setTimeout(fn, delay);
      timers.push(t);
    };

    function runSequence() {
      seq = 0;
      setPhase(0);
      setQ1Text("");
      setQ2Text("");
      setShowDots(false);

      // Start typing Q1
      seq += 400;
      schedule(() => setPhase(1), seq);

      // Type Q1 chars at 42ms each
      for (let i = 1; i <= Q1.length; i++) {
        const charDelay = seq + i * 42;
        const captured = i;
        schedule(() => setQ1Text(Q1.slice(0, captured)), charDelay);
      }
      seq += Q1.length * 42 + 100;

      // Typing dots for R1
      schedule(() => {
        setPhase(2);
        setDotsFor(1);
        setShowDots(true);
      }, seq);
      seq += 1100;

      // Show R1
      schedule(() => {
        setShowDots(false);
        setPhase(3);
      }, seq);
      seq += 600;

      // Start typing Q2
      schedule(() => setPhase(4), seq);
      for (let i = 1; i <= Q2.length; i++) {
        const charDelay = seq + i * 42;
        const captured = i;
        schedule(() => setQ2Text(Q2.slice(0, captured)), charDelay);
      }
      seq += Q2.length * 42 + 100;

      // Typing dots for R2
      schedule(() => {
        setPhase(5);
        setDotsFor(2);
        setShowDots(true);
      }, seq);
      seq += 1100;

      // Show R2
      schedule(() => {
        setShowDots(false);
        setPhase(6);
      }, seq);
      seq += 3500;

      // Restart
      schedule(() => {
        setQ1Text("");
        setQ2Text("");
        runSequence();
      }, seq);
    }

    runSequence();
    return () => timers.forEach(clearTimeout);
  }, []);

  const UserBubble = ({
    text,
    typing,
  }: {
    text: string;
    typing: boolean;
  }) => (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div
        style={{
          background: "#F3F4F6",
          borderRadius: "16px 16px 4px 16px",
          padding: "10px 14px",
          fontSize: 13,
          color: "#111827",
          maxWidth: "82%",
          minHeight: 20,
          lineHeight: 1.5,
        }}
      >
        {text || "\u00A0"}
        {typing && (
          <span
            style={{
              display: "inline-block",
              width: 1,
              height: 13,
              background: "#6B7280",
              marginLeft: 2,
              verticalAlign: "text-bottom",
              animation: "pfCursorBlink 0.8s step-end infinite",
            }}
          />
        )}
      </div>
    </div>
  );

  const AiBubble = ({ text }: { text: string }) => (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <div
        style={{
          background: "#F0FDF4",
          border: "1px solid #DCFCE7",
          borderRadius: "16px 16px 16px 4px",
          padding: "10px 14px",
          fontSize: 13,
          color: "#111827",
          maxWidth: "85%",
          lineHeight: 1.5,
        }}
      >
        {text}
      </div>
    </div>
  );

  const TypingDots = () => (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <div
        style={{
          background: "#F0FDF4",
          border: "1px solid #DCFCE7",
          borderRadius: "16px 16px 16px 4px",
          padding: "12px 16px",
          display: "flex",
          gap: 5,
          alignItems: "center",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#22C55E",
              animation: `pfLensBounce 0.9s ease-in-out ${i * 0.18}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <WidgetCard isMobile={isMobile} minHeight={380}>
      <style>{`
        @keyframes pfLensBounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pfCursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "#F0FDF4",
            border: "1px solid #DCFCE7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <circle cx="8" cy="8" r="6.5" stroke="#22C55E" strokeWidth="1.5" />
            <path
              d="M8 5v3.5M8 10.5v.5"
              stroke="#22C55E"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <p
            style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}
          >
            CRUX Lens
          </p>
          <p style={{ fontSize: 11, color: "#22C55E", margin: 0, fontWeight: 500 }}>
            ● Intelligence active
          </p>
        </div>
      </div>

      {/* Chat area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          justifyContent: "flex-end",
          minHeight: isMobile ? 200 : 260,
        }}
      >
        {/* Q1 */}
        {phase >= 1 && (
          <motion.div
            key="q1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <UserBubble text={q1Text} typing={phase === 1} />
          </motion.div>
        )}

        {/* R1 or typing dots */}
        {phase >= 2 && (
          <motion.div
            key="r1-area"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {showDots && dotsFor === 1 ? <TypingDots /> : <AiBubble text={R1} />}
          </motion.div>
        )}

        {/* Q2 */}
        {phase >= 4 && (
          <motion.div
            key="q2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <UserBubble text={q2Text} typing={phase === 4} />
          </motion.div>
        )}

        {/* R2 or typing dots */}
        {phase >= 5 && (
          <motion.div
            key="r2-area"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {showDots && dotsFor === 2 ? <TypingDots /> : <AiBubble text={R2} />}
          </motion.div>
        )}
      </div>
    </WidgetCard>
  );
}

// ─── 3. CRUX Cast Widget ──────────────────────────────────────────────────────

function CastWidget({ isMobile }: { isMobile: boolean }) {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 150);
    return () => clearTimeout(t);
  }, []);

  // Historical line: 5 points from (20,100) to (240,52)
  // Y axis: 130=bottom (low price), 20=top (high price). viewBox 0 0 380 130
  const histPath = "M 20 102 L 76 96 L 132 84 L 188 70 L 244 54";
  // Projection cone
  const upperPath = "M 244 54 L 360 26";
  const lowerPath = "M 244 54 L 360 58";
  const coneFill = "M 244 54 L 360 26 L 360 58 Z";

  return (
    <WidgetCard isMobile={isMobile} minHeight={360}>
      <style>{`
        @keyframes pfPricePulse {
          0%, 100% { opacity: 0.75; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div>
          <p style={{ fontSize: 11, color: "#9CA3AF", margin: "0 0 2px" }}>
            Price trajectory · Govandi, Mumbai
          </p>
          <p
            style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}
          >
            Fair value vs. listed price
          </p>
        </div>
        <motion.span
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: started ? 1 : 0, scale: started ? 1 : 0.85 }}
          transition={{ duration: 0.3, delay: 1.6 }}
          style={{
            background: "#F0FDF4",
            border: "1px solid #DCFCE7",
            borderRadius: 999,
            padding: "4px 12px",
            fontSize: 11,
            color: "#16A34A",
            fontWeight: 600,
          }}
        >
          Fair Value: ₹65–68L
        </motion.span>
      </div>

      {/* SVG chart */}
      <div style={{ position: "relative", margin: "4px 0" }}>
        <svg
          viewBox="0 0 380 130"
          style={{ width: "100%", height: "auto", overflow: "visible" }}
        >
          <defs>
            <linearGradient
              id="pf-histGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#22C55E" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#16A34A" stopOpacity="1" />
            </linearGradient>
            <linearGradient
              id="pf-coneGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#22C55E" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#22C55E" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[30, 65, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="380"
              y2={y}
              stroke="#F3F4F6"
              strokeWidth="1"
            />
          ))}

          {/* Projection divider */}
          <line
            x1="244"
            y1="0"
            x2="244"
            y2="130"
            stroke="#E5E7EB"
            strokeWidth="1"
            strokeDasharray="4 3"
          />

          {/* Cone fill */}
          <motion.path
            d={coneFill}
            fill="url(#pf-coneGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: started ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          />

          {/* Projection lines */}
          <motion.path
            d={upperPath}
            stroke="#22C55E"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="5 3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: started ? 1 : 0,
              opacity: started ? 0.75 : 0,
            }}
            transition={{ duration: 0.55, delay: 1.0 }}
          />
          <motion.path
            d={lowerPath}
            stroke="#22C55E"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="5 3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: started ? 1 : 0,
              opacity: started ? 0.75 : 0,
            }}
            transition={{ duration: 0.55, delay: 1.0 }}
          />

          {/* Historical line */}
          <motion.path
            d={histPath}
            stroke="url(#pf-histGrad)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: started ? 1 : 0 }}
            transition={{ duration: 0.85, ease: "easeOut", delay: 0.2 }}
          />

          {/* Latest price dot (current position, end of historical) */}
          <motion.circle
            cx="244"
            cy="54"
            r="4"
            fill="#22C55E"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: started ? 1 : 0, opacity: started ? 1 : 0 }}
            transition={{ duration: 0.25, delay: 1.1 }}
            style={{ transformOrigin: "244px 54px" }}
          />

          {/* Listed price dot — overpriced, above cone */}
          <motion.circle
            cx="360"
            cy="12"
            r="4"
            fill="#EF4444"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: started ? 1 : 0, opacity: started ? 1 : 0 }}
            transition={{ duration: 0.25, delay: 1.65 }}
            style={{ transformOrigin: "360px 12px" }}
          />

          {/* Listed label */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: started ? 1 : 0 }}
            transition={{ duration: 0.25, delay: 1.75 }}
          >
            <rect x="306" y="0" width="68" height="17" rx="8.5" fill="#FEF2F2" />
            <text
              x="340"
              y="11.5"
              textAnchor="middle"
              fontSize="8.5"
              fill="#EF4444"
              fontWeight="700"
            >
              Listed ₹72L
            </text>
          </motion.g>

          {/* Y labels */}
          <text x="2" y="33" fontSize="8" fill="#D1D5DB">
            ₹80L
          </text>
          <text x="2" y="68" fontSize="8" fill="#D1D5DB">
            ₹65L
          </text>
          <text x="2" y="104" fontSize="8" fill="#D1D5DB">
            ₹52L
          </text>

          {/* X labels */}
          <text x="14" y="125" fontSize="8" fill="#D1D5DB">
            2022
          </text>
          <text x="196" y="125" fontSize="8" fill="#D1D5DB">
            2024
          </text>
          <text x="325" y="125" fontSize="8" fill="#D1D5DB">
            2026E
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        {[
          {
            color: "#22C55E",
            dashed: false,
            label: "Historical",
          },
          { color: "#22C55E", dashed: true, label: "Projected range" },
          { color: "#EF4444", dot: true, label: "Listed price" },
        ].map(({ color, dashed, dot, label }) => (
          <div
            key={label}
            style={{ display: "flex", alignItems: "center", gap: 5 }}
          >
            {dot ? (
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: color,
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: 18,
                  height: 2,
                  background: dashed
                    ? `repeating-linear-gradient(90deg, ${color} 0px, ${color} 4px, transparent 4px, transparent 7px)`
                    : color,
                  opacity: dashed ? 0.7 : 1,
                  flexShrink: 0,
                }}
              />
            )}
            <span style={{ fontSize: 10, color: "#9CA3AF" }}>{label}</span>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}

// ─── 4. CRUX Yield Widget ─────────────────────────────────────────────────────

const MONTHLY_VALUES = [
  7200, 7500, 7800, 8000, 8100, 8200, 8100, 8000, 7900, 8200, 8300, 8400,
];
const MONTH_LABELS = [
  "J",
  "F",
  "M",
  "A",
  "M",
  "J",
  "J",
  "A",
  "S",
  "O",
  "N",
  "D",
];
const YIELD_MAX = 8400;
const BAR_MAX_H = 72;

function YieldWidget({ isMobile }: { isMobile: boolean }) {
  const [barsShown, setBarsShown] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const [showIcons, setShowIcons] = useState(false);

  const displayVal =
    barsShown > 0
      ? MONTHLY_VALUES[Math.min(barsShown - 1, MONTHLY_VALUES.length - 1)]
      : 0;

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < 12; i++) {
      timers.push(setTimeout(() => setBarsShown(i + 1), 200 + i * 90));
    }
    timers.push(setTimeout(() => setShowBadge(true), 200 + 12 * 90 + 300));
    timers.push(setTimeout(() => setShowIcons(true), 200 + 12 * 90 + 600));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <WidgetCard isMobile={isMobile} minHeight={360}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <p style={{ fontSize: 11, color: "#9CA3AF", margin: "0 0 3px" }}>
            Expected monthly rental
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span
              style={{ fontSize: 28, fontWeight: 800, color: "#111827", lineHeight: 1 }}
            >
              ₹{displayVal.toLocaleString("en-IN")}
            </span>
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>/mo</span>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: showBadge ? 1 : 0, scale: showBadge ? 1 : 0.8 }}
          transition={{ duration: 0.3 }}
          style={{
            background: "#F0FDF4",
            border: "1px solid #DCFCE7",
            borderRadius: 12,
            padding: "8px 14px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 10,
              color: "#22C55E",
              margin: 0,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Gross Yield
          </p>
          <p
            style={{
              fontSize: 18,
              color: "#16A34A",
              margin: 0,
              fontWeight: 800,
              lineHeight: 1.1,
            }}
          >
            4.1%
          </p>
        </motion.div>
      </div>

      {/* Bar chart */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 3,
          height: 90,
          paddingTop: 8,
        }}
      >
        {MONTHLY_VALUES.map((val, i) => {
          const barH = (val / YIELD_MAX) * BAR_MAX_H;
          const isLatest = i === barsShown - 1;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                height: "100%",
                justifyContent: "flex-end",
              }}
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: barsShown > i ? barH : 0 }}
                transition={{
                  duration: 0.4,
                  ease: [0.34, 1.4, 0.64, 1],
                }}
                style={{
                  width: "100%",
                  background: isLatest
                    ? "linear-gradient(180deg, #22C55E, #16A34A)"
                    : "linear-gradient(180deg, #86EFAC, #4ADE80)",
                  borderRadius: "3px 3px 0 0",
                  minWidth: 6,
                }}
              />
              <span
                style={{
                  fontSize: 7,
                  color: "#D1D5DB",
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                {MONTH_LABELS[i]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Signal icons */}
      <div style={{ display: "flex", gap: 8 }}>
        {[
          { emoji: "💼", label: "High job density" },
          { emoji: "🚉", label: "Transit · 8 min" },
          { emoji: "🏢", label: "14 comp rentals" },
        ].map((sig, i) => (
          <motion.div
            key={sig.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: showIcons ? 1 : 0, y: showIcons ? 0 : 8 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            style={{
              flex: 1,
              background: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: 10,
              padding: "8px 10px",
            }}
          >
            <div style={{ fontSize: 16, marginBottom: 3 }}>{sig.emoji}</div>
            <div style={{ fontSize: 10, color: "#6B7280", lineHeight: 1.3 }}>
              {sig.label}
            </div>
          </motion.div>
        ))}
      </div>
    </WidgetCard>
  );
}

// ─── 5. CRUX Watch Widget ─────────────────────────────────────────────────────

const WATCH_ALERTS = [
  {
    id: "score",
    dot: "#F59E0B",
    bg: "#FFFBEB",
    border: "#FDE68A",
    title: "Score updated",
    body: "82 → 79 · New construction permit filed nearby",
    time: "2 min ago",
  },
  {
    id: "legal",
    dot: "#22C55E",
    bg: "#F0FDF4",
    border: "#DCFCE7",
    title: "Legal clear",
    body: "Quarterly court scan passed · No new filings",
    time: "1 hr ago",
  },
  {
    id: "market",
    dot: "#3B82F6",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    title: "Market signal",
    body: "2 comparable sales in locality at +8% YoY",
    time: "3 hr ago",
  },
  {
    id: "rera",
    dot: "#22C55E",
    bg: "#F0FDF4",
    border: "#DCFCE7",
    title: "RERA valid",
    body: "Compliance check passed · Expires Dec 2029",
    time: "6 hr ago",
  },
];

function WatchWidget({ isMobile }: { isMobile: boolean }) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < WATCH_ALERTS.length; i++) {
      timers.push(setTimeout(() => setVisibleCount(i + 1), 200 + i * 380));
    }

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <WidgetCard isMobile={isMobile} minHeight={380}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>
          Property Alerts
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22C55E",
              boxShadow: "0 0 0 3px rgba(34,197,94,0.2)",
            }}
          />
          <span style={{ fontSize: 11, color: "#22C55E", fontWeight: 500 }}>
            Monitoring
          </span>
        </div>
      </div>

      {/* Alert list */}
      <div
        style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}
      >
        <AnimatePresence>
          {WATCH_ALERTS.slice(0, visibleCount).map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{
                duration: 0.35,
                ease: [0.34, 1.4, 0.64, 1],
              }}
              style={{
                background: alert.bg,
                border: `1px solid ${alert.border}`,
                borderRadius: 12,
                padding: "11px 14px",
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: alert.dot,
                  marginTop: 4,
                  flexShrink: 0,
                  boxShadow: `0 0 0 3px ${alert.dot}28`,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 3,
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#111827",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {alert.title}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      color: "#9CA3AF",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {alert.time}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 11,
                    color: "#6B7280",
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {alert.body}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </WidgetCard>
  );
}

// ─── RightPanel ───────────────────────────────────────────────────────────────

function RightPanel({
  activeProduct,
  isMobile,
}: {
  activeProduct: number;
  isMobile: boolean;
}) {
  function renderWidget() {
    switch (activeProduct) {
      case 0:
        return <ScoreWidget isMobile={isMobile} />;
      case 1:
        return <LensWidget isMobile={isMobile} />;
      case 2:
        return <CastWidget isMobile={isMobile} />;
      case 3:
        return <YieldWidget isMobile={isMobile} />;
      case 4:
        return <WatchWidget isMobile={isMobile} />;
      default:
        return null;
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeProduct}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {renderWidget()}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── ProductFamily (main export) ──────────────────────────────────────────────

export default function ProductFamily() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [activeProduct, setActiveProduct] = useState(0);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(Math.floor(v * 5), 4);
    setActiveProduct(next);
  });

  return (
    <div
      ref={outerRef}
      id="products"
      style={{ position: "relative", height: "600vh" }}
    >
      <div
        style={{
          position: "sticky" as const,
          top: 0,
          // Use 100svh (small viewport height) to avoid mobile URL-bar jump.
          // The min-height fallback handles browsers without svh support.
          height: "100svh",
          minHeight: "100vh",
          overflow: "hidden",
          background:
            "linear-gradient(160deg, #F0FDF4 0%, #FAFFFE 45%, #FFFFFF 100%)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Section header (pinned, not animated) ── */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: isMobile ? 16 : "10%",
            right: isMobile ? 16 : "auto",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 22,
                height: 2,
                background: "#22C55E",
                borderRadius: 2,
              }}
            />
            <span
              style={{
                fontSize: 10,
                letterSpacing: "0.22em",
                color: "#22C55E",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              CRUX Products
            </span>
          </div>
          <h2
            style={{
              fontSize: isMobile
                ? "clamp(16px, 5vw, 22px)"
                : "clamp(17px, 2vw, 24px)",
              fontWeight: 700,
              color: "#111827",
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            One engine.{" "}
            <span style={{ color: "#22C55E" }}>Five dimensions</span>
            {" "}of intelligence.
          </h2>
        </div>

        {/* ── Content area ── */}
        {isMobile ? (
          // Mobile: stacked layout
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              paddingTop: 110,
              paddingBottom: 48,
              gap: 16,
              overflow: "hidden",
            }}
          >
            {/* Widget (top) */}
            <div
              style={{
                flex: "0 0 auto",
                height: "45svh",
                minHeight: "45vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 16px",
                overflow: "hidden",
              }}
            >
              <RightPanel activeProduct={activeProduct} isMobile={isMobile} />
            </div>

            {/* Text (bottom) */}
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
                minHeight: 0,
              }}
            >
              <LeftPanel product={PRODUCTS[activeProduct]} isMobile={isMobile} />
            </div>
          </div>
        ) : (
          // Desktop: side-by-side layout
          <div
            style={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              paddingTop: 90,
            }}
          >
            {/* Left text panel */}
            <div
              style={{
                width: "42%",
                padding: "0 4% 0 10%",
                flexShrink: 0,
              }}
            >
              <LeftPanel product={PRODUCTS[activeProduct]} isMobile={isMobile} />
            </div>

            {/* Right widget panel */}
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 8% 0 2%",
                height: "100%",
              }}
            >
              <RightPanel activeProduct={activeProduct} isMobile={isMobile} />
            </div>
          </div>
        )}

        {/* Progress dots */}
        <ProgressDots active={activeProduct} isMobile={isMobile} />
      </div>
    </div>
  );
}
