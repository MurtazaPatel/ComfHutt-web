"use client";

import Image from "next/image";
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
    // No JS fade on the shell: it held the whole page at opacity 0 until
    // hydration. The panel's own CSS reveal (.anim) covers the entrance.
    <div className="flex min-h-dvh w-full flex-col bg-crux-bg-primary lg:flex-row">
      {/* ── COMPACT BRAND BAND (below lg) ── */}
      <div className="surface-ink relative overflow-hidden px-5 py-5 lg:hidden">
        <div aria-hidden className="crux-plot opacity-70" />
        <div className="relative flex items-baseline gap-2.5">
          <span className="text-[24px] font-extrabold tracking-[-0.02em] text-crux-ink-text select-none">
            CRUX
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-[11px] text-crux-ink-muted">by</span>
            <Image
              src="/comfhutt-logo.svg"
              alt="ComfHutt"
              width={70}
              height={14}
              className="h-[13px] w-auto opacity-70 brightness-0 invert"
            />
          </span>
        </div>
      </div>

      {/* ── LEFT BRAND PANEL ── */}
      <div className="surface-ink relative hidden w-1/2 flex-col justify-between overflow-hidden px-12 py-14 lg:flex xl:px-16">
        {/* Forest ink with the plot lattice — the brand panel is where ink belongs. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 20% 0%, rgba(16,185,129,0.16) 0%, transparent 65%)",
          }}
        />
        <div aria-hidden className="crux-plot" />

        <div className="relative z-10 flex flex-col gap-10">
          {/* Brand identity */}
          <div className="anim flex flex-col gap-2">
            <div className="flex items-baseline gap-2.5">
              <span className="text-[36px] font-extrabold tracking-[-0.02em] text-crux-ink-text select-none">
                CRUX
              </span>
              <span className="mb-1 flex items-center gap-1.5 self-end">
                <span className="text-[11px] text-crux-ink-muted">by</span>
                <Image
                  src="/comfhutt-logo.svg"
                  alt="ComfHutt"
                  width={70}
                  height={14}
                  className="h-[14px] w-auto opacity-70 brightness-0 invert"
                />
              </span>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-crux-ink-line bg-crux-ink-raised px-3 py-1.5">
              <span
                aria-hidden
                className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-crux-green motion-safe:animate-pulse"
              />
              <span className="t-eyebrow text-crux-ink-muted">
                Property intelligence
              </span>
            </div>
          </div>

          {/* Hero statement */}
          <div className="anim space-y-3" style={{ animationDelay: "0.08s" }}>
            <p
              className="t-voice max-w-[18ch] leading-[1.12] text-crux-ink-text"
              style={{ fontSize: "clamp(30px, 3.4vw, 48px)" }}
            >
              {isSignIn
                ? "Welcome back. Your research is where you left it."
                : "Know what the record says before you pay a rupee."}
            </p>
          </div>

          {/* What CRUX grades */}
          <div className="anim flex flex-wrap gap-1.5" style={{ animationDelay: "0.14s" }}>
            {MODULES.map((label) => (
              <span
                key={label}
                className="crux-chip font-mono text-[11px] whitespace-nowrap"
              >
                <span aria-hidden className="h-1 w-1 flex-shrink-0 rounded-full bg-crux-green" />
                {label}
              </span>
            ))}
          </div>

          {/* Context paragraph. No broker-attack framing — the product brief removes
              it explicitly, and "any address in India" overstates the coverage. */}
          <div className="anim max-w-[420px]" style={{ animationDelay: "0.2s" }}>
            <p className="text-[15px] leading-relaxed text-crux-ink-muted">
              {isSignIn
                ? "CRUX grades Gujarat projects on the public record — GujRERA filings, the appellate tribunal and the court record — and shows you the filing behind every finding."
                : "Name a project in Gujarat. CRUX reads its GujRERA filings, the appellate tribunal and the court record, then gives you one grade, A+ to D, with the evidence for it."}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-6">
          {/* One hairline-divided row rather than four floating tiles. */}
          <div
            className="anim grid grid-cols-4 divide-x divide-crux-ink-line border-y border-crux-ink-line"
            style={{ animationDelay: "0.26s" }}
          >
            {FACTS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col gap-2 px-4 py-5 first:pl-0">
                <Icon className="h-4 w-4 text-crux-mint" aria-hidden />
                <span className="text-[18px] leading-none font-semibold tracking-[-0.02em] text-crux-ink-text">
                  {value}
                </span>
                <span className="text-[12px] leading-tight text-crux-ink-muted">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="anim" style={{ animationDelay: "0.32s" }}>
            {/* Was "Methodology is public." — the /methodology page the product brief
                calls for does not exist yet, so that was a promise, not a fact. This
                says what is true now: no builder can pay to change a grade. */}
            <p className="font-mono text-[11px] tracking-[0.04em] text-crux-ink-muted">
              No builder pays for a grade. Every finding links to its record.
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="relative flex flex-1 items-center justify-center bg-crux-bg-primary px-5 py-12 sm:px-6 lg:py-0">
        <div className="relative z-10 w-full max-w-[400px]">
          {children}
          <div id="clerk-captcha" />
        </div>
      </div>
    </div>
  );
}
