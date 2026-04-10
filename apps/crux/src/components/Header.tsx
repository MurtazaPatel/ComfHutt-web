"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "rgba(10, 10, 10, 0.35)",
        backdropFilter: "blur(28px) saturate(180%)",
        WebkitBackdropFilter: "blur(28px) saturate(180%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tighter text-gradient-green">
            CRUX
          </span>
          <span className="hidden sm:flex items-center gap-1.5 self-end mb-0.5">
            <span className="text-[10px] text-crux-text-muted">by</span>
            <img
              src="/comfhutt-logo.svg"
              alt="ComfHutt"
              className="h-[14px] w-auto opacity-50"
            />
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-crux-text-secondary hover:text-crux-green transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <a
          href="#hero"
          className="hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-green text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Try CRUX Free
          <span aria-hidden="true">&rarr;</span>
        </a>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-crux-text-secondary"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-[#0F0F0F]/90 border-b border-white/10"
          >
            <div className="px-4 py-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium text-crux-text-secondary hover:text-crux-text-primary"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#hero"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-5 py-2.5 rounded-full bg-gradient-green text-white text-sm font-semibold"
              >
                Try CRUX Free &rarr;
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
