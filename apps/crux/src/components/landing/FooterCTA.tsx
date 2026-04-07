"use client";

import { motion } from "framer-motion";
import { Lock, Zap, Gift } from "lucide-react";
import ChatInput from "@/components/ChatInput";

const VP = { once: true, margin: "-100px" } as const;

const TRUST_SIGNALS = [
  { icon: Lock, label: "No signup required" },
  { icon: Zap, label: "Results in seconds" },
  { icon: Gift, label: "Completely free" },
];

const LINK_COLS = [
  {
    links: [
      { label: "Score a Property", href: "#hero" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Use", href: "#" },
      { label: "Disclaimer", href: "#" },
    ],
  },
  {
    links: [
      { label: "Twitter / X", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
];

export default function FooterCTA() {
  return (
    <footer className="bg-white">
      {/* ── CTA section ── */}
      <div className="py-32 px-4">
        <motion.div
          className="mx-auto max-w-2xl rounded-3xl p-12 text-center border border-[#22C55E33]"
          style={{
            background:
              "linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 50%, #F0FDF4 100%)",
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h2
            className="text-[32px] font-bold text-crux-text-primary leading-tight tracking-[-0.5px]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            Ready to know the truth about your property?
          </motion.h2>

          <motion.p
            className="mt-4 text-base text-crux-text-secondary"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            Score any property in India. Free. Instant. No signup.
          </motion.p>

          <motion.div
            className="mt-16 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            <ChatInput variant="default" size="large" />
          </motion.div>

          <motion.div
            className="mt-6 flex flex-wrap items-center justify-center gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          >
            {TRUST_SIGNALS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-crux-text-muted">
                <Icon size={13} strokeWidth={2} />
                <span className="text-xs">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Light footer ── */}
      <div
        style={{
          background: "#F9FAFB",
          paddingTop: "4rem",
          paddingBottom: 0,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Top content row */}
        <div
          className="mx-auto px-6 sm:px-8"
          style={{
            maxWidth: 1100,
            display: "flex",
            flexDirection: "column",
            gap: "3rem",
          }}
        >
          {/* Main grid: logo-left / links-right */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "2.5rem",
            }}
            className="md:[grid-template-columns:1fr_2fr]"
          >
            {/* ── Left: logo + copyright ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Logo lockup */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                {/* Green square icon */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: "#22C55E",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M7 2L12 5V9L7 12L2 9V5L7 2Z"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    color: "#111827",
                  }}
                >
                  CRUX
                </span>
              </div>

              {/* Copyright */}
              <p style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.6, maxWidth: 220 }}>
                © 2026 ComfHutt Technologies Pvt. Ltd.
              </p>

              {/* A ComfHutt Product */}
              <p style={{ fontSize: 11, color: "#D1D5DB", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                A ComfHutt Product
              </p>
            </div>

            {/* ── Right: three link columns ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1.5rem",
              }}
            >
              {LINK_COLS.map((col, ci) => (
                <ul key={ci} style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {col.links.map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        style={{
                          fontSize: 13,
                          color: "#6B7280",
                          textDecoration: "none",
                          transition: "color 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#22C55E")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>

        {/* ── Oversized watermark ── */}
        <div
          aria-hidden="true"
          style={{
            display: "block",
            textAlign: "center",
            lineHeight: 0.85,
            marginTop: "1rem",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontSize: "clamp(8rem, 20vw, 18rem)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: "#22C55E",
              opacity: 0.07,
              display: "block",
              whiteSpace: "nowrap",
            }}
          >
            CRUX
          </span>
        </div>
      </div>
    </footer>
  );
}
