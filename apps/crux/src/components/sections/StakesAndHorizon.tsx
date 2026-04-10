"use client";

import { useState, useEffect, useRef } from "react";
import PeepsShield from "@/components/PeepsShield";
import PeepsGrowth from "@/components/PeepsGrowth";
import PeepsSignup from "@/components/PeepsSignup";

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
              <PeepsShield />
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
            <PeepsGrowth />
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
            <PeepsSignup />

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
