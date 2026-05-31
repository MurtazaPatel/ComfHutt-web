"use client";

import { motion } from "framer-motion";
import { Shield, Zap, TrendingUp, BarChart3 } from "lucide-react";

interface AuthLayoutClientProps {
  children: React.ReactNode;
  variant: "signin" | "signup";
}

const dataSourceChips = ["MCA21", "eCourts", "RERA", "IGR", "NASA VIIRS", "CPCB"];

const statIcons = [
  { icon: Shield, value: "20+", label: "Data signals" },
  { icon: Zap, value: "<90s", label: "Per report" },
  { icon: TrendingUp, value: "3.2K", label: "Scored today" },
  { icon: BarChart3, value: "12", label: "Indian cities" },
];

export default function AuthLayoutClient({
  children,
  variant,
}: AuthLayoutClientProps) {
  const isSignIn = variant === "signin";

  return (
    <motion.div
      className="min-h-screen w-full flex flex-col md:flex-row bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* ── LEFT BRAND PANEL ── */}
      <div className="hidden md:flex w-1/2 flex-col justify-between px-16 py-14 relative overflow-hidden bg-crux-green-tint">
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 30% 30%, rgba(34,197,94,0.06) 0%, transparent 60%), radial-gradient(ellipse 40% 60% at 70% 80%, rgba(34,197,94,0.04) 0%, transparent 50%)",
          }}
        />

        {/* Subtle grid texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,197,94,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* ── Top section ── */}
        <div className="relative z-10 flex flex-col gap-10">
          {/* Brand identity */}
          <div className="anim flex flex-col gap-2">
            <div className="flex items-baseline gap-2.5">
              <span
                className="font-extrabold tracking-tight text-crux-text-primary select-none"
                style={{ fontSize: 36, letterSpacing: "-0.02em" }}
              >
                CRUX
              </span>
              <span className="flex items-center gap-1.5 self-end mb-1">
                <span className="text-[11px] text-crux-text-muted">by</span>
                <img
                  src="/comfhutt-logo.svg"
                  alt="ComfHutt"
                  style={{ height: 14, width: "auto", opacity: 0.45 }}
                />
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-crux-border bg-white/80 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-crux-green animate-pulse flex-shrink-0" />
              <span className="text-[11px] font-mono font-medium text-crux-text-secondary uppercase tracking-[0.08em]">
                Property Intelligence
              </span>
            </div>
          </div>

          {/* Hero statement */}
          <div className="anim space-y-3" style={{ animationDelay: "0.08s" }}>
            <p
              className="text-crux-text-primary leading-[1.15]"
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "clamp(28px, 3.2vw, 42px)",
                fontStyle: "italic",
              }}
            >
              {isSignIn
                ? "Welcome back. Your intelligence dashboard is waiting."
                : "Start scoring properties with 20+ live data signals."}
            </p>
          </div>

          {/* Trust chips — data sources */}
          <div
            className="anim flex flex-wrap gap-1.5"
            style={{ animationDelay: "0.14s" }}
          >
            {dataSourceChips.map((chip, i) => (
              <span
                key={chip}
                className="anim inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-crux-border bg-white/70 text-[11px] font-mono text-crux-text-secondary whitespace-nowrap"
                style={{ animationDelay: `${0.16 + i * 0.04}s` }}
              >
                <span className="w-1 h-1 rounded-full bg-crux-green flex-shrink-0" />
                {chip}
              </span>
            ))}
          </div>

          {/* Context paragraph */}
          <div className="anim max-w-[380px]" style={{ animationDelay: "0.2s" }}>
            <p className="text-[14px] leading-relaxed text-crux-text-secondary">
              {isSignIn
                ? "CRUX scores every property in India against 20+ government data streams. Legal records, flood maps, builder history — all in one report."
                : "Type any address in India. Get court cases, builder fraud, flood risk — everything your broker won't tell you. Free."}
            </p>
          </div>
        </div>

        {/* ── Bottom section ── */}
        <div className="relative z-10 flex flex-col gap-6">
          {/* Mini stat grid */}
          <div className="anim grid grid-cols-4 gap-3" style={{ animationDelay: "0.26s" }}>
            {statIcons.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/60 border border-crux-border/60"
              >
                <Icon className="w-4 h-4 text-crux-green/60" />
                <span className="text-[13px] font-semibold text-crux-text-primary leading-none">
                  {value}
                </span>
                <span className="text-[10px] text-crux-text-muted text-center leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Quote attribution */}
          <div className="anim" style={{ animationDelay: "0.32s" }}>
            <p className="text-[11px] text-crux-text-muted font-mono tracking-[0.04em]">
              Methodology is public. Results are transparent. No signup required.
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 md:py-0 relative bg-white">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(34,197,94,0.04) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 w-full max-w-[400px]">
          {children}
          <div id="clerk-captcha" />
        </div>
      </div>
    </motion.div>
  );
}