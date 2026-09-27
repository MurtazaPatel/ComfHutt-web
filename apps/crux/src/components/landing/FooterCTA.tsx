"use client";

import { motion, MotionConfig } from "framer-motion";
import { Lock, Link2, MapPin, type LucideIcon } from "lucide-react";
import ChatInput from "@/components/ChatInput";

const VP = { once: true, margin: "-100px" } as const;

/**
 * Closing CTA and footer.
 *
 * The CTA offered to grade any property in the country, free and immediate — the
 * wrong coverage, the wrong noun for what CRUX produces, and a speed claim
 * nothing measures. The trust row promised results in seconds for the same
 * reason. Each line below is
 * either free-tier behaviour from the locked tier list or the coverage area.
 */
const TRUST_SIGNALS: Array<{ Icon: LucideIcon; label: string }> = [
  { Icon: Lock, label: "3 grades without an account" },
  { Icon: Link2, label: "Every finding linked to its record" },
  { Icon: MapPin, label: "Gujarat today" },
];

/**
 * Footer links. The old footer shipped six links to "#": three legal pages and
 * three social profiles, none of which exist. A reader clicking "Privacy Policy"
 * learned only that the footer was decorative. What is left is what resolves — the on-page sections,
 * the disclaimer below, and an address that is actually read.
 */
const LINK_COLS: Array<{ heading: string; links: Array<{ label: string; href: string }> }> = [
  {
    heading: "Product",
    links: [
      { label: "Grade a project", href: "#hero" },
      { label: "How it works", href: "#how-it-works" },
      { label: "What you get", href: "#features" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "What a grade is not", href: "#disclaimer" },
      { label: "support@comfhutt.com", href: "mailto:support@comfhutt.com" },
    ],
  },
];

const FOOTER_LINK =
  "inline-block break-words py-1.5 text-[13px] text-crux-text-secondary no-underline transition-colors duration-200 motion-reduce:transition-none hover:text-crux-text-primary hover:underline rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2";

export default function FooterCTA() {
  // reducedMotion="user" is set per section: page.tsx is owned elsewhere, and a
  // section that animates has to honour the preference itself.
  return (
    <MotionConfig reducedMotion="user">
      <footer className="bg-white">
        {/* ── Closing CTA ── */}
        <div className="px-4 py-16 sm:py-28">
          <motion.div
            className="mx-auto max-w-2xl rounded-3xl border border-crux-green/20 p-6 text-center sm:p-12"
            style={{
              background:
                "linear-gradient(135deg, var(--color-crux-green-tint) 0%, var(--color-crux-bg-primary) 50%, var(--color-crux-green-tint) 100%)",
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.h2
              className="text-balance text-[24px] font-bold leading-tight tracking-[-0.5px] text-crux-text-primary sm:text-[32px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
              Read the record before you pay the booking amount.
            </motion.h2>

            <motion.p
              className="mt-4 text-pretty text-[15px] text-crux-text-secondary sm:text-base"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              Name a RERA-registered project in Gujarat and CRUX will grade it from
              the filings and the court record. Free, and the first three need no
              account.
            </motion.p>

            <motion.div
              className="mx-auto mt-8 max-w-lg sm:mt-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            >
              <ChatInput variant="default" size="large" />
            </motion.div>

            <motion.ul
              className="mt-6 flex list-none flex-wrap items-center justify-center gap-x-6 gap-y-2 p-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            >
              {TRUST_SIGNALS.map(({ Icon, label }) => (
                <li key={label} className="flex items-center gap-1.5 text-crux-text-muted">
                  <Icon size={13} strokeWidth={2} aria-hidden />
                  <span className="text-xs">{label}</span>
                </li>
              ))}
            </motion.ul>
          </motion.div>
        </div>

        {/* ── Footer ── */}
        <div className="relative overflow-hidden border-t border-crux-border bg-crux-bg-primary pt-16">
          <div className="mx-auto max-w-[1100px] px-6 sm:px-8">
            <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
              {/* Identity */}
              <div className="flex flex-col gap-4">
                <span className="text-[18px] font-bold tracking-[-0.03em] text-crux-text-primary">
                  CRUX
                </span>

                <p className="max-w-[240px] text-[12px] leading-relaxed text-crux-text-secondary">
                  © 2026 ComfHutt Technologies Pvt. Ltd.
                </p>

                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-crux-text-muted">
                    A
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/comfhutt-logo.svg"
                    alt="ComfHutt"
                    className="inline-block h-3.5 w-auto align-middle opacity-45"
                  />
                  <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-crux-text-muted">
                    product
                  </span>
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-2 gap-6">
                {LINK_COLS.map((col) => (
                  <div key={col.heading}>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-crux-text-muted">
                      {col.heading}
                    </p>
                    <ul className="m-0 flex list-none flex-col p-0">
                      {col.links.map(({ label, href }) => (
                        <li key={label}>
                          <a href={href} className={FOOTER_LINK}>
                            {label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* ── What a grade is, and is not ── */}
            <div
              id="disclaimer"
              className="mt-12 border-t border-crux-border pt-8"
              style={{ scrollMarginTop: 80 }}
            >
              <h2 className="text-[13px] font-semibold text-crux-text-primary">
                What a CRUX Grade is, and is not
              </h2>
              <div className="mt-3 max-w-3xl space-y-2.5 text-[12px] leading-relaxed text-crux-text-secondary">
                <p>
                  A CRUX Grade is CRUX&rsquo;s opinion about a project, formed from
                  the public records it was able to read at the time of grading. It
                  is a research tool for your own diligence — not investment
                  advice, not a legal opinion, and not a substitute for a lawyer, a
                  chartered accountant or your own reading of the documents.
                </p>
                <p>
                  Public records can be incomplete, out of date, or indexed under a
                  name that does not match the promoter&rsquo;s. CRUX gives no
                  warranty that a grade, a module verdict or a linked record is
                  complete or free of error, and a grade says nothing about whether
                  a project is safe to buy into. Where the record will not support
                  a grade, CRUX marks the project NR rather than estimating one.
                </p>
                <p>
                  CRUX is not affiliated with, endorsed by, or acting on behalf of
                  GujRERA, any court or tribunal, any government department, any
                  developer or industry body, or any listing portal.
                </p>
              </div>
            </div>
          </div>

          {/* Oversized wordmark */}
          <div
            aria-hidden="true"
            className="mt-6 block select-none text-center leading-[0.85]"
            style={{ pointerEvents: "none" }}
          >
            <span
              className="block whitespace-nowrap font-black tracking-[-0.04em]"
              style={{
                fontSize: "clamp(6rem, 20vw, 18rem)",
                background:
                  "linear-gradient(to right, rgba(9,9,11,0.12) 0%, rgba(9,9,11,0.06) 40%, rgba(9,9,11,0.02) 70%, transparent 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CRUX
            </span>
          </div>
        </div>
      </footer>
    </MotionConfig>
  );
}
