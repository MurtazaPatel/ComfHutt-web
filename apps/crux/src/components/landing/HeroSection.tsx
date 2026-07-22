"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import ChatInput from "@/components/ChatInput";

const dataSources = [
  "MCA21",
  "eCourts",
  "CPCB AQI",
  "NHB RESIDEX",
  "TRAI",
  "NASA VIIRS",
  "CPWD",
  "State IGR",
  "RBI",
  "RERA",
];

const trustSignals = [
  "23 data signals",
  "< 90s per report",
  "Methodology is public",
  "12 Indian cities",
  "No signup required",
  "Free forever",
];

// Interleave data sources and trust signals
const tickerItems: { label: string; type: "data-source" | "trust-signal" }[] = [];
const maxLen = Math.max(dataSources.length, trustSignals.length);
for (let i = 0; i < maxLen; i++) {
  if (i < dataSources.length)
    tickerItems.push({ label: dataSources[i], type: "data-source" });
  if (i < trustSignals.length)
    tickerItems.push({ label: trustSignals[i], type: "trust-signal" });
}

// Framer Motion Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
};

const mockupContainerVariants: Variants = {
  hidden: { opacity: 0, rotateX: 10, y: 40 },
  visible: {
    opacity: 1,
    rotateX: 4,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20, staggerChildren: 0.1, delayChildren: 0.6 },
  },
};

const mockupItemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 15 } },
};

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full bg-background flex flex-col overflow-hidden"
      style={{ minHeight: "100svh" }}
    >
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-crux-green-tint)] blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-crux-bg-secondary)] blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-white/60 backdrop-blur-xl transition-all">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3.5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 no-underline group">
            <span
              className="font-bold text-foreground tracking-tight transition-colors group-hover:text-[var(--color-crux-green-mid)]"
              style={{ fontSize: 20 }}
            >
              CRUX
            </span>
            <span className="flex items-center gap-1.5 self-end mb-0.5">
              <span className="text-[10px] text-muted-foreground">by</span>
              <img
                src="/comfhutt-logo.svg"
                alt="ComfHutt"
                className="opacity-50 transition-opacity group-hover:opacity-80"
                style={{ height: 13, width: "auto" }}
              />
            </span>
          </Link>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#how-it-works"
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium no-underline"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium no-underline"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium no-underline"
            >
              Pricing
            </a>
          </div>

          {/* CTA — anonymous free-scoring start page, no signup required */}
          <Link
            href="/score"
            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-[var(--color-crux-green)] text-white text-[12px] font-semibold shadow-[var(--shadow-premium-md)] hover:shadow-[var(--shadow-premium-glow)] hover:-translate-y-0.5 transition-all duration-300 no-underline"
          >
            Get Started →
          </Link>
        </div>
      </nav>

      {/* Hero content */}
      <motion.div
        className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-16 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Pill badge */}
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-white shadow-[var(--shadow-premium-sm)] backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-crux-green)] animate-pulse" />
            <span className="text-[13px] text-secondary-foreground font-medium tracking-tight">
              India&apos;s First Property Intelligence Engine
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="mt-8 text-center font-extrabold text-foreground"
          style={{
            fontSize: "clamp(44px, 8vw, 88px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
          }}
        >
          Every property has a{" "}
          <span className="text-[var(--color-crux-green)]">score.</span>
          <br />
          Most buyers never check it.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mt-5 text-center text-muted-foreground max-w-[540px] mx-auto leading-relaxed"
          style={{ fontSize: "clamp(14px, 1.6vw, 17px)" }}
        >
          Type any address. See court cases, builder fraud, flood risk — everything your broker hides.
        </motion.p>

        {/* Chat input — real anonymous scoring entry point */}
        <motion.div variants={itemVariants} className="mt-8 w-full max-w-[580px] mx-auto px-4">
          <ChatInput size="large" />
        </motion.div>

        {/* Trust nudge */}
        <motion.p variants={itemVariants} className="mt-3 text-[13px] text-muted-foreground text-center tracking-wide">
          Free <span className="mx-1.5 text-[var(--color-crux-green)]">·</span> No signup required <span className="mx-1.5 text-[var(--color-crux-green)]">·</span> Score any property in India
        </motion.p>

        {/* Marquee ticker */}
        <motion.div
          variants={itemVariants}
          className="w-full"
          style={{
            marginTop: 32,
            marginBottom: 24,
            overflow: "hidden",
            maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            padding: "16px 0",
          }}
        >
          <div className="ticker-track-wrapper">
            <div className="ticker-track">
              {tickerItems.map((item, i) => (
                <span key={`a-${i}`} className={`ticker-pill shadow-sm border-border ${item.type}`}>
                  {item.label}
                </span>
              ))}
              {tickerItems.map((item, i) => (
                <span key={`b-${i}`} className={`ticker-pill shadow-sm border-border ${item.type}`}>
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Product mockup */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-0">
        {mounted && (
          <motion.div
            className="relative rounded-t-2xl border border-b-0 border-border shadow-[var(--shadow-premium-lg)] overflow-hidden bg-white"
            variants={mockupContainerVariants}
            initial="hidden"
            animate="visible"
            style={{ transformOrigin: "center top" }}
          >
            {/* Dashboard mockup */}
            <div className="w-full bg-[var(--color-crux-bg-primary)]" style={{ aspectRatio: "16/9" }}>
              {/* Browser bar */}
              <div className="w-full h-10 bg-[var(--color-crux-bg-secondary)] border-b border-border flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 bg-white border border-border rounded-md shadow-sm text-[10px] text-muted-foreground font-mono">
                    crux.comfhutt.com
                  </div>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-5 grid grid-cols-4 gap-4">
                {/* Sidebar */}
                <motion.div variants={mockupItemVariants} className="col-span-1 space-y-3 pt-1">
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                  <div className="h-2 w-16 bg-gray-100 rounded" />
                  <div className="h-2 w-24 bg-gray-100 rounded" />
                  <div className="h-2 w-14 bg-gray-100 rounded" />
                  <div className="h-2 w-20 bg-gray-100 rounded" />
                  <div className="h-2 w-18 bg-gray-100 rounded mt-4" />
                  <div className="h-2 w-12 bg-gray-100 rounded" />
                </motion.div>

                {/* Main content */}
                <div className="col-span-3 space-y-4">
                  {/* KPI cards */}
                  <div className="flex gap-3">
                    {[
                      { title: "CRUX Score", value: "87", sub: "High confidence", color: "var(--color-crux-green)" },
                      { title: "Fair Value", value: "₹82L", sub: "+12% vs listed", color: "var(--color-crux-green)" },
                      { title: "Gross Yield", value: "4.2%", sub: "Above market avg", color: "var(--color-crux-text-secondary)" },
                    ].map((kpi, index) => (
                      <motion.div
                        key={index}
                        variants={mockupItemVariants}
                        className="flex-1 p-4 rounded-xl border border-border bg-white shadow-[var(--shadow-premium-sm)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-premium-md)] transition-all"
                      >
                        <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{kpi.title}</div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1 + index * 0.1, type: "spring" }}
                          className="text-2xl font-bold mt-1"
                          style={{ color: kpi.title === "Gross Yield" ? "var(--color-crux-text-primary)" : kpi.color }}
                        >
                          {kpi.value}
                        </motion.div>
                        <div className="text-[10px] mt-1" style={{ color: kpi.title === "Gross Yield" ? kpi.color : kpi.color }}>
                          {kpi.sub}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Chart placeholder */}
                  <motion.div
                    variants={mockupItemVariants}
                    className="h-28 rounded-xl border border-border bg-white shadow-[var(--shadow-premium-sm)] flex items-end px-4 pb-3 gap-1.5"
                  >
                    {[40, 55, 45, 70, 60, 80, 65, 87].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 1.2 + i * 0.05, duration: 0.5, type: "spring" }}
                        className="flex-1 rounded-sm"
                        style={{
                          background: i === 7 ? "var(--color-crux-green)" : "var(--color-crux-border)",
                        }}
                      />
                    ))}
                  </motion.div>

                  {/* Data rows */}
                  <div className="space-y-2">
                    {[
                      { label: "Legal Status", value: "Clear", ok: true },
                      { label: "Flood Risk", value: "Low", ok: true },
                      { label: "Builder RERA", value: "Registered", ok: true },
                    ].map((row, index) => (
                      <motion.div
                        key={row.label}
                        variants={mockupItemVariants}
                        className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-border bg-white shadow-sm hover:shadow-[var(--shadow-premium-sm)] transition-shadow"
                      >
                        <span className="text-[12px] text-muted-foreground">{row.label}</span>
                        <span className="text-[12px] font-medium" style={{ color: row.ok ? "var(--color-crux-green)" : "#EF4444" }}>
                          {row.value}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom fade-out */}
            <div
              className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
              style={{
                background: "linear-gradient(to bottom, transparent 0%, var(--color-crux-bg-primary) 100%)",
              }}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
