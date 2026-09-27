"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FileText, Gavel, Landmark, MapPin } from "lucide-react";

interface AuthLayoutClientProps {
  children: React.ReactNode;
  variant: "signin" | "signup";
}

/**
 * The seven things the grading engine actually scores — the module labels from
 * CgmGradeSurface, i.e. the engine's own vocabulary.
 *
 * This replaced a row of chips reading MCA21, eCourts, RERA, IGR, NASA VIIRS and
 * CPCB. Three of those names are ones CRUX is barred from citing, and naming a
 * source on the signup page that no report will ever attribute a finding to is the
 * same overclaim in a more prominent place. What CRUX grades is a real, checkable
 * list; where it reads from belongs on a report, next to the finding it supports.
 */
const MODULES = [
  "Legal standing",
  "Delivery execution",
  "Developer trust",
  "Financial integrity",
  "Compliance",
  "Location",
  "Price fairness",
] as const;

/**
 * Facts, not marketing numbers.
 *
 * The four stats here previously read "20+ data signals", "<90s per report",
 * "3.2K scored today" and "12 Indian cities". The city count was simply false —
 * coverage is Gujarat — and "3.2K scored today" was a fabricated live counter,
 * a made-up usage figure presented as the day's traffic on the page where a user
 * decides whether to trust the product. Every value below is backed by something
 * in the codebase: the seven engine modules, the A+..D grade bands in lib/grade.ts,
 * the three-report anonymous quota the backend enforces, and the coverage area.
 */
const FACTS = [
  { icon: Landmark, value: "Gujarat", label: "Coverage today" },
  { icon: FileText, value: "7", label: "Modules graded" },
  { icon: Gavel, value: "A+ – D", label: "Grade scale" },
  { icon: MapPin, value: "3 free", label: "No account needed" },
] as const;

export default function AuthLayoutClient({ children, variant }: AuthLayoutClientProps) {
  const isSignIn = variant === "signin";

  return (
    <motion.div
      className="flex min-h-dvh w-full flex-col bg-white md:flex-row"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* ── LEFT BRAND PANEL ── */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-crux-green-tint px-16 py-14 md:flex">
        {/* Ambient glow. Brand green (#10B981), not the rejected #22C55E. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 30% 30%, rgba(16,185,129,0.07) 0%, transparent 60%), radial-gradient(ellipse 40% 60% at 70% 80%, rgba(16,185,129,0.05) 0%, transparent 50%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 flex flex-col gap-10">
          {/* Brand identity */}
          <div className="anim flex flex-col gap-2">
            <div className="flex items-baseline gap-2.5">
              <span className="text-[36px] font-extrabold tracking-[-0.02em] text-crux-text-primary select-none">
                CRUX
              </span>
              <span className="mb-1 flex items-center gap-1.5 self-end">
                <span className="text-[11px] text-crux-text-muted">by</span>
                <Image
                  src="/comfhutt-logo.svg"
                  alt="ComfHutt"
                  width={70}
                  height={14}
                  className="h-[14px] w-auto opacity-45"
                />
              </span>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-crux-border bg-white/80 px-3 py-1">
              <span
                aria-hidden
                className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-crux-green motion-safe:animate-pulse"
              />
              <span className="font-mono text-[11px] font-medium tracking-[0.08em] text-crux-text-secondary uppercase">
                Property intelligence
              </span>
            </div>
          </div>

          {/* Hero statement */}
          <div className="anim space-y-3" style={{ animationDelay: "0.08s" }}>
            <p
              className="leading-[1.15] text-crux-text-primary"
              style={{
                // The display serif has no Tailwind utility mapped to it; the
                // variable is set on <html> in the root layout.
                fontFamily: "var(--font-instrument-serif), serif",
                fontSize: "clamp(28px, 3.2vw, 42px)",
                fontStyle: "italic",
              }}
            >
              {isSignIn
                ? "Welcome back. Your research is where you left it."
                : "Know what the record says before you pay a rupee."}
            </p>
          </div>

          {/* What CRUX grades */}
          <div className="anim flex flex-wrap gap-1.5" style={{ animationDelay: "0.14s" }}>
            {MODULES.map((label, i) => (
              <span
                key={label}
                className="anim inline-flex items-center gap-1 rounded-full border border-crux-border bg-white/70 px-2.5 py-1 font-mono text-[11px] whitespace-nowrap text-crux-text-secondary"
                style={{ animationDelay: `${0.16 + i * 0.04}s` }}
              >
                <span aria-hidden className="h-1 w-1 flex-shrink-0 rounded-full bg-crux-green" />
                {label}
              </span>
            ))}
          </div>

          {/* Context paragraph. No broker-attack framing — the product brief removes
              it explicitly, and "any address in India" overstates the coverage. */}
          <div className="anim max-w-[380px]" style={{ animationDelay: "0.2s" }}>
            <p className="text-[14px] leading-relaxed text-crux-text-secondary">
              {isSignIn
                ? "CRUX grades Gujarat projects on the public record — GujRERA filings, the appellate tribunal and the court record — and shows you the filing behind every finding."
                : "Name a project in Gujarat. CRUX reads its GujRERA filings, the appellate tribunal and the court record, then gives you one grade, A+ to D, with the evidence for it."}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-6">
          <div className="anim grid grid-cols-4 gap-3" style={{ animationDelay: "0.26s" }}>
            {FACTS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1 rounded-xl border border-crux-border/60 bg-white/60 p-3"
              >
                <Icon className="h-4 w-4 text-crux-green/60" aria-hidden />
                <span className="text-[13px] leading-none font-semibold text-crux-text-primary">
                  {value}
                </span>
                <span className="text-center text-[10px] leading-tight text-crux-text-muted">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="anim" style={{ animationDelay: "0.32s" }}>
            {/* Was "Methodology is public." — the /methodology page the product brief
                calls for does not exist yet, so that was a promise, not a fact. This
                says what is true now: no builder can pay to change a grade. */}
            <p className="font-mono text-[11px] tracking-[0.04em] text-crux-text-muted">
              No builder pays for a grade. Every finding links to its record.
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="relative flex flex-1 items-center justify-center bg-white px-6 py-12 md:py-0">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(16,185,129,0.04) 0%, transparent 70%)",
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
