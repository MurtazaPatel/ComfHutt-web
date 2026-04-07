"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((m) => ({ default: m.Player })),
  { ssr: false }
);

// Minimal subset of AnimationItem we use
type AnimationItem = { play: () => void };
type PlayerEvent = string;

// ─── Lottie sources ───────────────────────────────────────────────────────────
const LOTTIE_BEAT1 = "https://assets9.lottiefiles.com/packages/lf20_uu0x8lqv.json";
const LOTTIE_BEAT2 = "https://assets4.lottiefiles.com/packages/lf20_touohxv0.json";


// ─── Fallback pulsing circle ──────────────────────────────────────────────────
function PulsingFallback({ size }: { size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="animate-pulse"
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "#22C55E",
        }}
      />
    </div>
  );
}

// ─── Lottie player with error fallback ───────────────────────────────────────
function LottiePlayer({
  src,
  size,
  autoplay = true,
  loop = true,
  lottieRef,
  onEvent,
}: {
  src: string;
  size: { width: number; height: number };
  autoplay?: boolean;
  loop?: boolean;
  lottieRef?: (ref: AnimationItem) => void;
  onEvent?: (event: PlayerEvent) => void;
}) {
  const [failed, setFailed] = useState(false);

  const handleEvent = useCallback(
    (event: PlayerEvent) => {
      if (event === "error") setFailed(true);
      onEvent?.(event);
    },
    [onEvent]
  );

  if (failed) return <PulsingFallback size={Math.max(size.width, size.height)} />;

  return (
    <Player
      src={src}
      autoplay={autoplay}
      loop={loop}
      style={{ width: size.width, height: size.height }}
      lottieRef={lottieRef}
      onEvent={handleEvent}
    />
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

// ─── Beat 2 Lottie: start on scroll-into-view ────────────────────────────────
function Beat2Lottie({ parallaxOffset }: { parallaxOffset: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          animRef.current?.play();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ transform: `translateY(calc(${parallaxOffset}px * -0.05))` }}
    >
      <LottiePlayer
        src={LOTTIE_BEAT2}
        size={{ width: 160, height: 160 }}
        autoplay={false}
        loop={true}
        lottieRef={(ref) => {
          animRef.current = ref;
        }}
      />
    </div>
  );
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
    <section ref={sectionRef} style={{ background: "#0F0F0F" }}>
      {/* ── BEAT 1: THE STAKES ─────────────────────────────────────────────── */}
      <div style={{ padding: "120px 0", background: "#0F0F0F" }}>
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

            {/* Right: Lottie */}
            <div
              className="w-full md:w-[40%] flex justify-center order-1 md:order-2"
              style={{
                transform: `translateY(calc(${offset}px * 0.08))`,
              }}
            >
              <LottiePlayer
                src={LOTTIE_BEAT1}
                size={{ width: 280, height: 280 }}
                autoplay
                loop
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── BEAT 2: THE TURN ───────────────────────────────────────────────── */}
      <div style={{ background: "#0F0F0F", paddingBottom: 80 }}>
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
          {/* Beat 2 Lottie with scroll-triggered playback */}
          <Beat2Lottie parallaxOffset={offset} />

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
        style={{
          background: "linear-gradient(to bottom, #0F0F0F 0%, #0A0A1A 100%)",
          padding: "120px 0",
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
                            fontSize: 15,
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
        padding: "8px 20px",
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
