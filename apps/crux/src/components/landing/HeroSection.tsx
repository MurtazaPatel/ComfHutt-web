"use client";

import React from "react";
import Grainient from "@/components/Grainient";

const sources = [
  {
    name: "MCA21",
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2"/><path d="M4 7h6M4 4.5h6M4 9.5h4" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  },
  {
    name: "eCourts",
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.5 3.5H12l-2.8 2 1 3.5L7 8l-3.2 2 1-3.5L2 4.5h3.5L7 1z" stroke="rgba(255,255,255,0.55)" strokeWidth="1.1" strokeLinejoin="round"/></svg>,
  },
  {
    name: "CPCB AQI",
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2"/><path d="M4.5 7.5c.5-1.5 4.5-1.5 5 0" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" strokeLinecap="round"/><circle cx="5" cy="5.5" r="0.8" fill="rgba(255,255,255,0.55)"/><circle cx="9" cy="5.5" r="0.8" fill="rgba(255,255,255,0.55)"/></svg>,
  },
  {
    name: "NHB RESIDEX",
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 13V6.5L7 2l5 4.5V13" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" strokeLinejoin="round"/><rect x="5" y="9" width="4" height="4" rx="0.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1.1"/></svg>,
  },
  {
    name: "TRAI",
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 10.5c1.4-4 8.6-4 10 0" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" strokeLinecap="round"/><path d="M4 8c.8-2.5 6.2-2.5 7 0" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" strokeLinecap="round"/><path d="M5.5 5.5c.5-1.5 3.5-1.5 4 0" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" strokeLinecap="round"/><circle cx="7" cy="3.5" r="0.8" fill="rgba(255,255,255,0.55)"/></svg>,
  },
  {
    name: "NASA VIIRS",
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="2" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2"/><circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" strokeDasharray="2 1.5"/></svg>,
  },
  {
    name: "CPWD",
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 13h12M3 13V7M7 13V4M11 13V7M1 7l6-5.5L13 7" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    name: "State IGR",
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 13V8h6v5M2 8h10M7 2l5 6H2l5-6z" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  },
  {
    name: "RBI",
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2"/><path d="M5 5h2.5a1.5 1.5 0 010 3H5V5zM7.5 8L9.5 11" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  },
  {
    name: "RERA",
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="3.5" width="11" height="8" rx="1.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2"/><path d="M5 3.5V2.5a2 2 0 014 0v1M4.5 8l1.5 1.5L9.5 6" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
];

function SourceItem({ source }: { source: typeof sources[number] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
      {source.icon}
      <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap", letterSpacing: "0.2px" }}>
        {source.name}
      </span>
    </div>
  );
}

const Sep = () => (
  <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />
);

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-[#0A0A1A]"
    >
      {/* Layer 1: Grainient background */}
      <div className="absolute inset-0">
        <Grainient
          color1="#0A0A1A"
          color2="#22C55E"
          color3="#052e16"
          timeSpeed={0.18}
          warpStrength={1.2}
          warpFrequency={4.0}
          warpSpeed={1.5}
          warpAmplitude={60.0}
          blendAngle={25.0}
          blendSoftness={0.12}
          rotationAmount={280.0}
          noiseScale={1.8}
          grainAmount={0.055}
          grainScale={2.5}
          grainAnimated={false}
          contrast={1.6}
          gamma={1.1}
          saturation={0.85}
          zoom={0.85}
          colorBalance={0.1}
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Layer 2: Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse 90% 80% at 50% 50%,
            transparent 30%,
            rgba(10,10,26,0.5) 70%,
            rgba(10,10,26,0.85) 100%
          )`,
        }}
      />

      {/* Layer 3: Navbar — fixed floating pill */}
      <nav
        className="glass-input flex items-center justify-between"
        style={{
          position: "fixed",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
          width: "fit-content",
          minWidth: "min(720px, 90vw)",
          borderRadius: 9999,
          padding: "10px 20px",
          gap: 32,
          boxShadow: "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#22C55E",
              letterSpacing: "-0.5px",
            }}
          >
            CRUX
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              alignSelf: "flex-end",
              marginBottom: 2,
            }}
          >
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>by</span>
            <img
              src="/comfhutt-logo.svg"
              alt="ComfHutt"
              style={{ height: 14, width: "auto", opacity: 0.45 }}
            />
          </span>
        </a>

        {/* Center links — hidden on mobile */}
        <div className="hidden sm:flex items-center gap-8">
          {["How It Works", "Features", "Pricing"].map((label) => (
            <a
              key={label}
              href="#"
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.45)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "rgba(255,255,255,0.9)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "rgba(255,255,255,0.45)";
              }}
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA pill */}
        <button
          style={{
            background: "transparent",
            border: "0.5px solid rgba(34,197,94,0.5)",
            color: "#22C55E",
            fontSize: 13,
            fontWeight: 500,
            padding: "8px 18px",
            borderRadius: 100,
            cursor: "pointer",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.background = "rgba(34,197,94,0.12)";
            el.style.borderColor = "rgba(34,197,94,0.8)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.background = "transparent";
            el.style.borderColor = "rgba(34,197,94,0.5)";
          }}
        >
          Try CRUX Free →
        </button>
      </nav>

      {/* Layer 4: Hero content */}
      <section className="relative z-10 flex flex-col items-center min-h-screen pt-20 px-6 text-center">
        {/* Upper block — grows to fill top half, content anchored to bottom */}
        <div className="flex-1 flex flex-col items-center justify-end w-full pb-8" style={{ maxWidth: 720 }}>
          {/* Eyebrow */}
          <div
            className="anim"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              justifyContent: "center",
              marginBottom: 28,
              animationDelay: "0.15s",
            }}
          >
            <div
              style={{
                width: 2,
                height: 18,
                background: "#22C55E",
                borderRadius: 2,
              }}
            />
            <span
              style={{
                fontSize: 10,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
                fontWeight: 500,
              }}
            >
              India&apos;s First Property Intelligence Engine
            </span>
          </div>

          {/* Headline */}
          <h1
            className="anim"
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              lineHeight: 1.0,
              letterSpacing: "-2px",
              color: "#FFFFFF",
              marginBottom: 20,
              animationDelay: "0.3s",
            }}
          >
            <span
              className="block text-4xl md:text-5xl lg:text-6xl leading-tight"
              style={{ fontWeight: 900 }}
            >
              Every property has a score.
            </span>
            <em
              className="block text-5xl md:text-6xl lg:text-7xl leading-tight"
              style={{ color: "#22C55E", fontStyle: "italic", fontWeight: 900 }}
            >
              Most buyers never check it.
            </em>
          </h1>

          {/* Subheadline */}
          <p
            className="anim"
            style={{
              fontSize: "clamp(14px, 1.8vw, 16px)",
              color: "rgba(255,255,255,0.52)",
              lineHeight: 1.65,
              maxWidth: 640,
              margin: "0 auto 0",
              animationDelay: "0.48s",
            }}
          >
            Type any address. We check for court cases, builder fraud,
            encumbrances, flood risk, and 17 more things your{" "}
            <span style={{ color: "rgba(255,255,255,0.75)" }}>
              broker never told you about
            </span>
            . Takes 11 seconds. Free.
          </p>
        </div>

        {/* Chat input — sits at the natural midpoint of the hero */}
        <div className="w-full px-0" style={{ maxWidth: 580 }}>
          <div
            className="glass-input anim w-full mx-auto rounded-[18px] flex items-center gap-3 px-5 py-4"
            style={{
              animationDelay: "0.62s",
            }}
          >
            <input
              type="text"
              placeholder="Enter any address in India..."
              className="flex-1 bg-transparent border-none outline-none text-white text-[15px] placeholder:text-white/30"
              style={{ caretColor: "#22C55E" }}
            />
            <button
              style={{
                width: 36,
                height: 36,
                background: "#22C55E",
                borderRadius: 10,
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                transition: "background 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "#16a34a";
                el.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "#22C55E";
                el.style.transform = "scale(1)";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 13V3M3 8l5-5 5 5"
                  stroke="#0a0a0a"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Lower block — grows to fill bottom half, trust nudge anchored to top */}
        <div className="flex-1 flex flex-col items-center justify-start w-full pt-4">
          {/* Trust nudge */}
          <p
            className="anim"
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.28)",
              letterSpacing: "0.3px",
              animationDelay: "0.75s",
            }}
          >
            Free
            <span style={{ color: "#22C55E", margin: "0 6px" }}>·</span>
            No signup required
            <span style={{ color: "#22C55E", margin: "0 6px" }}>·</span>
            Score any property in India
          </p>
        </div>
      </section>

      {/* Layer 5: Data source ticker */}
      <div
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10,
          borderTop: "0.5px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.045)",
          backdropFilter: "blur(16px) saturate(160%)",
          WebkitBackdropFilter: "blur(16px) saturate(160%)",
          padding: "13px 0",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Sticky label */}
        <div
          style={{
            flexShrink: 0,
            paddingLeft: 32, paddingRight: 24,
            borderRight: "0.5px solid rgba(255,255,255,0.08)",
            marginRight: 36,
            fontSize: 11, letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.28)",
            whiteSpace: "nowrap",
          }}
        >
          Verified from
        </div>

        {/* Scrolling track — sources rendered twice for seamless loop */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 36,
            animation: "ticker 32s linear infinite",
            willChange: "transform",
            whiteSpace: "nowrap",
          }}
        >
          {[...sources, ...sources].map((s, i) => {
            const isLast = i === sources.length - 1 || i === sources.length * 2 - 1;
            return (
              <React.Fragment key={i}>
                <SourceItem source={s} />
                {!isLast && <Sep />}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
