"use client";

import { useRef, useEffect, useState } from "react";
import Grainient from "@/components/Grainient";

const PAIRS = [
  ["Broker's word of mouth", "20+ verified government data signals"],
  ["Newspaper classifieds & site visits", "AI-powered instant property analysis"],
  ["Gut feeling & family advice", "Live credibility score, updated daily"],
  ["Zero exit strategy, hope for the best", "Structured exit via Liquidity Mesh"],
  ["One bad agent ruins everything", "CRUX Score: one number, full picture"],
];

export default function BeforeAfter() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-16 px-4 sm:py-20 sm:px-5">
      {/* Background */}
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
          grainAmount={0.043}
          grainScale={2.5}
          grainAnimated={false}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <p style={{ fontFamily: "monospace", fontSize: 10, color: "#22C55E", letterSpacing: "3px" }} className="uppercase mb-4">
            THE SHIFT
          </p>
          <h2
            style={{
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 700,
              letterSpacing: "-1.5px",
              color: "#fff",
              lineHeight: 1.1,
            }}
          >
            From gut feeling to ground truth.
          </h2>
        </div>

        {/* Table */}
        {/* Desktop */}
        <div className="hidden sm:grid" style={{ gridTemplateColumns: "1fr 1px 1fr", gap: "0 32px" }}>
          {/* Column headers */}
          <p style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "2px" }} className="uppercase mb-6">TODAY</p>
          <div style={{ background: "rgba(34,197,94,0.3)" }} />
          <p style={{ fontFamily: "monospace", fontSize: 11, color: "#22C55E", letterSpacing: "2px" }} className="uppercase mb-6">WITH CRUX</p>

          {/* Rows */}
          {PAIRS.map(([left, right], i) => (
            <>
              <div
                key={`l${i}`}
                style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.3)",
                  paddingBottom: 20,
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(8px)",
                  transition: `opacity 400ms ease-out ${i * 80}ms, transform 400ms ease-out ${i * 80}ms`,
                }}
              >
                {left}
              </div>
              <div key={`d${i}`} style={{ background: "rgba(34,197,94,0.3)" }} />
              <div
                key={`r${i}`}
                style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.9)",
                  paddingBottom: 20,
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(8px)",
                  transition: `opacity 400ms ease-out ${i * 80}ms, transform 400ms ease-out ${i * 80}ms`,
                }}
              >
                <span style={{ color: "#22C55E", marginRight: 8 }}>✦</span>{right}
              </div>
            </>
          ))}
        </div>

        {/* Mobile */}
        <div className="sm:hidden">
          <p style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "2px" }} className="uppercase mb-4">TODAY</p>
          {PAIRS.map(([left], i) => (
            <div
              key={i}
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.3)",
                paddingBottom: 14,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
                transition: `opacity 400ms ease-out ${i * 80}ms, transform 400ms ease-out ${i * 80}ms`,
              }}
            >
              {left}
            </div>
          ))}

          <div style={{ color: "#22C55E", fontSize: 22, margin: "20px 0", textAlign: "center" }}>↓</div>

          <p style={{ fontFamily: "monospace", fontSize: 11, color: "#22C55E", letterSpacing: "2px" }} className="uppercase mb-4">WITH CRUX</p>
          {PAIRS.map(([, right], i) => (
            <div
              key={i}
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.9)",
                paddingBottom: 14,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
                transition: `opacity 400ms ease-out ${(i + 5) * 80}ms, transform 400ms ease-out ${(i + 5) * 80}ms`,
              }}
            >
              <span style={{ color: "#22C55E", marginRight: 8 }}>✦</span>{right}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
