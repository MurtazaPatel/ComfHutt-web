"use client";

import { useState, useEffect, useRef } from "react";

// ─── CSS keyframes for custom icons ──────────────────────────────────────────
const ICON_STYLES = `
@keyframes hg-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes bar-grow {
  0%   { transform: scaleY(0); }
  20%  { transform: scaleY(1); }
  70%  { transform: scaleY(1); }
  80%  { transform: scaleY(0); }
  100% { transform: scaleY(0); }
}
`;

// ─── Beat 3: CSS keyframes ────────────────────────────────────────────────────
const BEAT3_STYLES = `
@keyframes sh3-key-float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
}
@keyframes sh3-glow-pulse {
  0%, 100% { opacity: 0.2; }
  50%       { opacity: 0.6; }
}
@keyframes sh3-key-show {
  0%, 28%  { opacity: 1; }
  38%      { opacity: 0; }
  90%      { opacity: 0; }
  100%     { opacity: 1; }
}
@keyframes sh3-building-show {
  0%, 28%  { opacity: 0; }
  38%      { opacity: 1; }
  90%      { opacity: 1; }
  100%     { opacity: 0; }
}
@keyframes sh3-building-float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
}
@keyframes sh3-win {
  0%, 100% { opacity: 0.1; }
  40%, 60% { opacity: 0.9; }
}
`;

// ─── Hourglass icon (Stakes section) ─────────────────────────────────────────
function HourglassIcon() {
  useEffect(() => {
    const styleId = "icon-keyframes";
    if (document.getElementById(styleId)) return;
    const el = document.createElement("style");
    el.id = styleId;
    el.textContent = ICON_STYLES;
    document.head.appendChild(el);
    return () => { document.getElementById(styleId)?.remove(); };
  }, []);

  return (
    <div
      className="w-[120px] max-[639px]:w-[80px]"
      style={{ opacity: 0.7, flexShrink: 0 }}
    >
      <svg
        viewBox="0 0 60 80"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g
          style={{
            animation: "hg-spin 3s linear infinite",
            transformBox: "fill-box",
            transformOrigin: "center",
          }}
        >
          {/* Top cap */}
          <line x1="4" y1="8" x2="56" y2="8" stroke="#CCCCCC" strokeWidth="2.5" strokeLinecap="round" />
          {/* Top-left slant */}
          <line x1="4" y1="8" x2="30" y2="40" stroke="#CCCCCC" strokeWidth="2.5" strokeLinecap="round" />
          {/* Top-right slant */}
          <line x1="56" y1="8" x2="30" y2="40" stroke="#CCCCCC" strokeWidth="2.5" strokeLinecap="round" />
          {/* Bottom-left slant */}
          <line x1="30" y1="40" x2="4" y2="72" stroke="#CCCCCC" strokeWidth="2.5" strokeLinecap="round" />
          {/* Bottom-right slant */}
          <line x1="30" y1="40" x2="56" y2="72" stroke="#CCCCCC" strokeWidth="2.5" strokeLinecap="round" />
          {/* Bottom cap */}
          <line x1="4" y1="72" x2="56" y2="72" stroke="#CCCCCC" strokeWidth="2.5" strokeLinecap="round" />
          {/* Sand grain at neck */}
          <circle cx="30" cy="42" r="1.8" fill="#AAAAAA" />
        </g>
      </svg>
    </div>
  );
}

// ─── Rising bars icon (Horizon section) ──────────────────────────────────────
function RisingBarsIcon() {
  return (
    <svg
      viewBox="0 0 80 64"
      width="80"
      height="64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Bar 1 — shortest */}
      <rect
        x="8" y="28" width="16" height="32" rx="2"
        fill="#22C55E"
        style={{
          transformBox: "fill-box",
          transformOrigin: "bottom",
          animation: "bar-grow 2.5s ease-in-out infinite",
          animationDelay: "0s",
        }}
      />
      {/* Bar 2 — medium */}
      <rect
        x="32" y="16" width="16" height="44" rx="2"
        fill="#22C55E"
        style={{
          transformBox: "fill-box",
          transformOrigin: "bottom",
          animation: "bar-grow 2.5s ease-in-out infinite",
          animationDelay: "0.2s",
        }}
      />
      {/* Bar 3 — tallest */}
      <rect
        x="56" y="4" width="16" height="56" rx="2"
        fill="#22C55E"
        style={{
          transformBox: "fill-box",
          transformOrigin: "bottom",
          animation: "bar-grow 2.5s ease-in-out infinite",
          animationDelay: "0.4s",
        }}
      />
    </svg>
  );
}

// ─── Scroll entrance hook ────────────────────────────────────────────────────
function useScrollEntrance(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ─── Parallax hook ────────────────────────────────────────────────────────────
function useParallax() {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const sectionTop = el.getBoundingClientRect().top + window.scrollY;
      setOffset(window.scrollY - sectionTop);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { sectionRef, offset };
}

// ─── Entrance line styles ─────────────────────────────────────────────────────
function entranceStyle(inView: boolean, delay: number): React.CSSProperties {
  return {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
  };
}

// ─── Email validation ─────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Beat 3: Key-to-Building SVG animation ───────────────────────────────────
function KeyToBuildingAnimation({ parallaxOffset }: { parallaxOffset: number }) {
  useEffect(() => {
    const styleId = "sh3-keyframes";
    if (document.getElementById(styleId)) return;
    const el = document.createElement("style");
    el.id = styleId;
    el.textContent = BEAT3_STYLES;
    document.head.appendChild(el);
    return () => {
      document.getElementById(styleId)?.remove();
    };
  }, []);

  return (
    <div
      className="hidden md:flex justify-center md:w-[40%] order-1"
      style={{ transform: `translateY(${parallaxOffset * 0.12}px)` }}
    >
      <svg
        viewBox="0 0 320 380"
        width="300"
        height="360"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
        aria-hidden="true"
      >
        <defs>
          <filter id="sh3-glow-filter" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── KEY GROUP — Act 1 ── */}
        <g style={{ animation: "sh3-key-show 12s ease-in-out infinite" }}>
          {/* Pulsing glow behind bow */}
          <circle
            cx="128"
            cy="182"
            r="58"
            fill="#22C55E"
            filter="url(#sh3-glow-filter)"
            style={{ animation: "sh3-glow-pulse 3s ease-in-out infinite" }}
          />
          {/* Floating key */}
          <g style={{ animation: "sh3-key-float 2s ease-in-out infinite", transformOrigin: "160px 182px" }}>
            {/* Bow outline */}
            <circle cx="128" cy="182" r="38" fill="none" stroke="#22C55E" strokeWidth="2.5" />
            {/* Bow inner hole */}
            <circle cx="128" cy="182" r="13" fill="none" stroke="#22C55E" strokeWidth="2" />
            {/* Shaft */}
            <rect x="128" y="175" width="118" height="14" fill="#22C55E" />
            {/* Tooth 1 */}
            <rect x="187" y="189" width="11" height="22" fill="#22C55E" />
            {/* Tooth 2 */}
            <rect x="213" y="189" width="11" height="15" fill="#22C55E" />
          </g>
        </g>

        {/* ── BUILDING GROUP — Act 3 ── */}
        <g style={{ animation: "sh3-building-show 12s ease-in-out infinite" }}>
          <g style={{ animation: "sh3-building-float 4s ease-in-out infinite", transformOrigin: "160px 225px" }}>
            {/* Rooftop antenna */}
            <line x1="160" y1="152" x2="160" y2="132" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
            <circle cx="160" cy="130" r="3" fill="#22C55E" />
            {/* Building body */}
            <rect x="120" y="152" width="80" height="140" fill="none" stroke="#22C55E" strokeWidth="2.5" />
            {/* Windows — Row 1 */}
            <rect x="133" y="174" width="13" height="14" fill="#22C55E"
              style={{ animation: "sh3-win 1.8s ease-in-out infinite", animationDelay: "0s" }} />
            <rect x="154" y="174" width="13" height="14" fill="#22C55E"
              style={{ animation: "sh3-win 1.8s ease-in-out infinite", animationDelay: "0.3s" }} />
            <rect x="175" y="174" width="13" height="14" fill="#22C55E"
              style={{ animation: "sh3-win 1.8s ease-in-out infinite", animationDelay: "0.6s" }} />
            {/* Windows — Row 2 */}
            <rect x="133" y="204" width="13" height="14" fill="#22C55E"
              style={{ animation: "sh3-win 1.8s ease-in-out infinite", animationDelay: "0.9s" }} />
            <rect x="154" y="204" width="13" height="14" fill="#22C55E"
              style={{ animation: "sh3-win 1.8s ease-in-out infinite", animationDelay: "1.2s" }} />
            <rect x="175" y="204" width="13" height="14" fill="#22C55E"
              style={{ animation: "sh3-win 1.8s ease-in-out infinite", animationDelay: "1.5s" }} />
            {/* Ground line */}
            <line x1="100" y1="292" x2="220" y2="292" stroke="#555555" strokeWidth="1" />
          </g>
        </g>
      </svg>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function StakesAndHorizon() {
  const { sectionRef, offset } = useParallax();

  // Beat 1 entrance
  const beat1 = useScrollEntrance(0.2);

  // Beat 3 entrance
  const beat3 = useScrollEntrance(0.2);

  // Waitlist form
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setEmailError("Enter a valid email");
      return;
    }
    setEmailError("");
    console.log(email);
    setSubmitted(true);
  };

  return (
    <section ref={sectionRef} style={{ background: "#111318" }}>
      {/* ── BEAT 1: THE STAKES ─────────────────────────────────────────────── */}
      <div className="py-16 md:py-30" style={{ background: "#111318" }}>
        <div
          className="mx-auto px-4"
          style={{ maxWidth: 1024 }}
        >
          {/* Two columns: 60/40 */}
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            {/* Left: text */}
            <div ref={beat1.ref} className="w-full md:w-[60%] order-2 md:order-1">
              {/* Eyebrow */}
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  color: "#22C55E",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  marginBottom: 24,
                  ...entranceStyle(beat1.inView, 0),
                }}
              >
                The Reality
              </p>

              {/* Headline */}
              <h2
                style={{
                  fontSize: "clamp(32px, 5vw, 52px)",
                  color: "#FFFFFF",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  marginBottom: 20,
                  ...entranceStyle(beat1.inView, 120),
                }}
              >
                The average Indian family spends 18 years saving for property.
              </h2>

              {/* Body */}
              <p
                style={{
                  fontSize: 18,
                  color: "#888888",
                  lineHeight: 1.6,
                  marginBottom: 16,
                  ...entranceStyle(beat1.inView, 280),
                }}
              >
                1 in 3 end up in a legal dispute, a fraudulent developer, or a
                locality that was never what it seemed.
              </p>

              {/* Closing */}
              <p
                style={{
                  fontSize: 15,
                  color: "#555555",
                  fontStyle: "italic",
                  ...entranceStyle(beat1.inView, 420),
                }}
              >
                Not because they didn&apos;t try. Because they had no way to know.
              </p>
            </div>

            {/* Right: Hourglass icon */}
            <div
              className="w-full md:w-[40%] flex justify-center order-1 md:order-2"
              style={{
                transform: `translateY(calc(${offset}px * 0.08))`,
              }}
            >
              <HourglassIcon />
            </div>
          </div>
        </div>
      </div>

      {/* ── BEAT 2: THE TURN ───────────────────────────────────────────────── */}
      <div className="pb-12 md:pb-20" style={{ background: "#111318" }}>
        {/* Divider */}
        <div
          style={{
            width: 200,
            height: 1,
            background: "#22C55E",
            opacity: 0.3,
            margin: "0 auto 48px",
          }}
        />

        {/* Content centered */}
        <div className="flex flex-col items-center px-4">
          {/* Rising bars icon */}
          <div style={{ marginBottom: 8 }}>
            <RisingBarsIcon />
          </div>

          {/* Statement */}
          <p
            style={{
              fontSize: "clamp(24px, 3.5vw, 36px)",
              color: "#FFFFFF",
              fontWeight: 700,
              textAlign: "center",
              maxWidth: 600,
              margin: "32px auto",
            }}
          >
            CRUX exists so that number never applies to you.
          </p>

          {/* Pills */}
          <div
            className="flex flex-wrap justify-center"
            style={{ gap: 12 }}
          >
            {["23 data signals", "< 90 second analysis", "Methodology is public"].map(
              (label) => <Pill key={label} label={label} />
            )}
          </div>
        </div>
      </div>

      {/* ── BEAT 3: THE HORIZON ────────────────────────────────────────────── */}
      <div
        className="py-16 md:py-30"
        style={{
          background: "linear-gradient(to bottom, #0F0F0F 0%, #0A0A1A 100%)",
        }}
      >
        <div className="mx-auto px-4" style={{ maxWidth: 1024 }}>
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            {/* Left: SVG animation (desktop only) */}
            <KeyToBuildingAnimation parallaxOffset={offset} />

            {/* Right: text + form */}
            <div ref={beat3.ref} className="w-full md:w-[60%] order-2">
              {/* Eyebrow */}
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  color: "#22C55E",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  marginBottom: 24,
                  ...entranceStyle(beat3.inView, 0),
                }}
              >
                You&apos;ve done the hard part
              </p>

              {/* Headline — three separate elements for independent line 3 colour */}
              <div style={{ marginBottom: 20, ...entranceStyle(beat3.inView, 120) }}>
                <h2
                  style={{
                    fontSize: "clamp(28px, 4vw, 44px)",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    lineHeight: 1.1,
                    margin: 0,
                  }}
                >
                  Most people spend years waiting
                </h2>
                <h2
                  style={{
                    fontSize: "clamp(28px, 4vw, 44px)",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    lineHeight: 1.1,
                    margin: 0,
                  }}
                >
                  to feel ready.
                </h2>
                <h2
                  style={{
                    fontSize: "clamp(28px, 4vw, 44px)",
                    color: "#22C55E",
                    fontWeight: 800,
                    lineHeight: 1.1,
                    margin: 0,
                  }}
                >
                  You just skipped the line.
                </h2>
              </div>

              {/* Subheadline */}
              <p
                style={{
                  fontSize: 17,
                  color: "#888888",
                  lineHeight: 1.7,
                  marginBottom: 16,
                  ...entranceStyle(beat3.inView, 280),
                }}
              >
                CRUX told you which properties are worth your attention.
                <br />
                ComfHutt Invest will let you own a piece of them —
                <br />
                legally, directly, from ₹10,000.
              </p>

              {/* Bridge line */}
              <p
                style={{
                  fontSize: 14,
                  color: "#555555",
                  fontStyle: "italic",
                  marginBottom: 40,
                  ...entranceStyle(beat3.inView, 340),
                }}
              >
                No pooling. No fund manager taking a cut.
                <br />
                Your name. Your demat account. Your property.
              </p>

              {/* Form + social nudge */}
              <div style={entranceStyle(beat3.inView, 420)}>
                {submitted ? (
                  <div>
                    <span style={{ fontSize: 32, color: "#22C55E", display: "block", marginBottom: 12 }}>
                      ✓
                    </span>
                    <p style={{ fontSize: 18, fontWeight: 600, color: "#FFFFFF", margin: 0 }}>
                      You&apos;re in.
                    </p>
                    <p style={{ fontSize: 14, color: "#666666", marginTop: 8 }}>
                      Founding Investors get first access, 3% discount, and a
                      front-row seat to Property #001.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Social nudge */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                      <div style={{ display: "flex" }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#22C55E", border: "2px solid #0A0A1A", flexShrink: 0 }} />
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#16a34a", border: "2px solid #0A0A1A", marginLeft: -8, flexShrink: 0 }} />
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#15803d", border: "2px solid #0A0A1A", marginLeft: -8, flexShrink: 0 }} />
                      </div>
                      <span style={{ fontSize: 13, color: "#666666" }}>
                        214 people are already on the list.
                      </span>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError("");
                          }}
                          placeholder="your@email.com"
                          style={{
                            flex: 1,
                            background: "#111111",
                            border: `1px solid ${emailError ? "#EF4444" : "#2a2a2a"}`,
                            borderRadius: 8,
                            padding: "14px 18px",
                            color: "#FFFFFF",
                            fontSize: 16,
                            outline: "none",
                            transition: "border-color 200ms ease",
                          }}
                          onFocus={(e) => {
                            if (!emailError)
                              e.currentTarget.style.borderColor = "#22C55E";
                          }}
                          onBlur={(e) => {
                            if (!emailError)
                              e.currentTarget.style.borderColor = "#2a2a2a";
                          }}
                        />
                        <button
                          type="submit"
                          style={{
                            background: "#22C55E",
                            color: "#0F0F0F",
                            fontWeight: 700,
                            borderRadius: 8,
                            padding: "14px 24px",
                            fontSize: 15,
                            border: "none",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            transition: "opacity 200ms ease, transform 200ms ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = "0.9";
                            e.currentTarget.style.transform = "translateY(-1px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = "1";
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          Claim your spot →
                        </button>
                      </div>
                      {emailError && (
                        <p style={{ color: "#EF4444", fontSize: 13, marginTop: 8 }}>
                          {emailError}
                        </p>
                      )}
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Pill sub-component ───────────────────────────────────────────────────────
function Pill({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? "#22C55E" : "#2a2a2a"}`,
        borderRadius: 999,
        padding: "12px 20px",
        background: "transparent",
        fontSize: 13,
        color: hovered ? "#22C55E" : "#AAAAAA",
        fontWeight: 500,
        transition: "border-color 200ms ease, color 200ms ease",
        cursor: "default",
      }}
    >
      {label}
    </div>
  );
}
