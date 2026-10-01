"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, MotionConfig, useScroll, useTransform } from "framer-motion";
import { Lock, Link2, MapPin, type LucideIcon } from "lucide-react";
import ChatInput from "@/components/ChatInput";
import { LEGAL } from "@/config/legal";
import { useSpotlight } from "@/hooks/useSpotlight";

interface FooterCTAProps {
  /** From the CGM constants, via the stats endpoint. Null when unavailable. */
  methodologyVersion: string | null;
  methodologyHash: string | null;
}

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
 * Footer links. Every one resolves.
 *
 * The old footer shipped six links to "#": three legal pages and three social
 * profiles, none of which existed. A reader clicking "Privacy Policy" learned only
 * that the footer was decorative. The three legal routes now exist, so they are
 * linked properly; the social profiles are still absent, and are still not linked,
 * because a link to a profile nobody runs is the same lie in a smaller font.
 */
const LINK_COLS: Array<{ heading: string; links: Array<{ label: string; href: string }> }> = [
  {
    heading: "Product",
    links: [
      { label: "Grade a project", href: "/score" },
      { label: "How it works", href: "#how-it-works" },
      { label: "What we check", href: "#features" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Methodology", href: "/methodology" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Dispute a grade", href: "/dispute" },
    ],
  },
  {
    heading: "Contact",
    links: [
      { label: LEGAL.supportEmail, href: `mailto:${LEGAL.supportEmail}` },
      { label: LEGAL.grievanceEmail, href: `mailto:${LEGAL.grievanceEmail}` },
    ],
  },
];

const FOOTER_LINK =
  "inline-flex min-h-11 items-center break-words py-1.5 text-[14px] text-crux-text-secondary no-underline decoration-1 underline-offset-4 transition-colors duration-200 motion-reduce:transition-none hover:text-crux-text-primary hover:underline rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 [@media(hover:hover)_and_(pointer:fine)]:min-h-8";

export default function FooterCTA({ methodologyVersion, methodologyHash }: FooterCTAProps) {
  const spotlight = useSpotlight<HTMLDivElement>();
  // The sign-off rises into place as the reader reaches the end of the page.
  const markRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: markRef, offset: ["start end", "end end"] });
  const markY = useTransform(scrollYProgress, [0, 1], ["45%", "0%"]);

  // reducedMotion="user" is set per section: page.tsx is owned elsewhere, and a
  // section that animates has to honour the preference itself.
  return (
    <MotionConfig reducedMotion="user">
      <footer className="bg-white">
        {/* ── Closing CTA ── */}
        <div className="crux-frame py-24 md:py-36">
          {/* One reveal for the whole panel: it is a single statement, and five
              staggered fade-ups made it arrive in pieces. */}
          <div className="crux-container">
          <motion.div
            {...spotlight}
            className="crux-spotlight surface-ink relative mx-auto max-w-[960px] overflow-hidden rounded-[var(--radius-panel)] px-6 py-14 text-center shadow-[var(--shadow-premium-lg)] sm:px-12 sm:py-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div aria-hidden className="crux-plot" />
            <h2 className="t-h2 relative mx-auto max-w-[18ch] text-crux-ink-text">
              Read the record before you pay the booking amount.
            </h2>

            <p className="t-lead relative mx-auto mt-6 max-w-[52ch] text-crux-ink-muted">
              Name a RERA-registered project in Gujarat and CRUX will grade it from
              the filings and the court record. Free, and the first three need no
              account.
            </p>

            <div className="relative mx-auto mt-10 max-w-[580px]">
              <ChatInput variant="white" size="large" />
            </div>

            <ul className="relative mt-7 flex list-none flex-wrap items-center justify-center gap-x-6 gap-y-2 p-0">
              {TRUST_SIGNALS.map(({ Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-crux-ink-muted">
                  <Icon size={14} strokeWidth={2} aria-hidden className="text-[#6EE7B7]" />
                  <span className="text-[13px]">{label}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="relative overflow-hidden border-t border-crux-line bg-crux-bg-primary pt-16 md:pt-20">
          <div className="crux-container">
            <div className="grid gap-12 md:grid-cols-12 md:gap-8">
              {/* Identity */}
              <div className="flex flex-col gap-4 md:col-span-4">
                <span className="text-[22px] font-bold tracking-[-0.03em] text-crux-text-primary">
                  CRUX
                </span>

                <p className="max-w-[260px] text-[13px] leading-relaxed text-crux-text-secondary">
                  © 2026 ComfHutt Technologies Pvt. Ltd.
                </p>

                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="t-eyebrow text-[10px] text-crux-text-muted">
                    A
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/comfhutt-logo.svg"
                    alt="ComfHutt"
                    className="inline-block h-3.5 w-auto align-middle opacity-45"
                  />
                  <span className="t-eyebrow text-[10px] text-crux-text-muted">
                    product
                  </span>
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:col-span-8">
                {LINK_COLS.map((col) => (
                  // The last column holds two email addresses; on a phone it takes
                  // the full row so neither has to break mid-word.
                  <div key={col.heading} className="min-w-0 last:col-span-2 sm:last:col-span-1">
                    <p className="t-eyebrow mb-3 text-crux-text-muted">
                      {col.heading}
                    </p>
                    <ul className="m-0 flex list-none flex-col p-0">
                      {col.links.map(({ label, href }) => (
                        <li key={label}>
                          {/* Route links go through next/link for client-side
                              navigation; hash and mailto stay plain anchors. */}
                          {href.startsWith("/") ? (
                            <Link href={href} className={FOOTER_LINK}>
                              {label}
                            </Link>
                          ) : (
                            <a href={href} className={FOOTER_LINK}>
                              {label}
                            </a>
                          )}
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
              className="mt-14 border-t border-crux-line pt-10"
              style={{ scrollMarginTop: 80 }}
            >
              <h2 className="text-[14px] font-semibold text-crux-text-primary">
                What a CRUX Grade is, and is not
              </h2>
              <div className="mt-4 max-w-3xl space-y-3 text-[13px] leading-relaxed text-crux-text-secondary">
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

              {/* The short form, with the route that carries the long form. This is
                  the line the brief requires in the footer; the same sentence also
                  appears inline on every grade surface, because a reader looking at
                  a C grade should not have to scroll to the bottom of a different
                  page to learn what it is. */}
              <p className="mt-5 max-w-3xl text-[13px] leading-relaxed text-crux-text-secondary">
                CRUX grades are opinions formed from public records using a published
                method. They are research, not investment advice, and carry no
                warranty. Believe a grade is wrong?{" "}
                <Link
                  href="/dispute"
                  className="font-medium text-crux-green-dark underline underline-offset-2 transition-colors hover:text-crux-green-deeper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
                >
                  Tell us
                </Link>{" "}
                — we review and correct.
              </p>

              {/* Method fingerprint. Rendered only when the endpoint supplied both
                  halves: a version with no hash identifies nothing, and inventing
                  either would undercut the one claim this line exists to support.
                  The version string is printed bare — CGM_METHODOLOGY_VERSION is
                  already "CGM-1.1", so the brief's literal "Method CGM-{version}"
                  would have rendered "Method CGM-CGM-1.1". */}
              {methodologyVersion && methodologyHash && (
                <p className="mt-4 font-mono text-[11px] text-crux-text-muted">
                  Method {methodologyVersion} · {methodologyHash}
                </p>
              )}
            </div>
          </div>

          {/* Oversized wordmark */}
          {/* The sign-off. Sized in container units so it spans the content width
              at every viewport and can never push the page sideways. */}
          <div
            aria-hidden="true"
            className="crux-container pointer-events-none mt-12 select-none"
          >
            <div ref={markRef} className="overflow-hidden [container-type:inline-size]">
              <motion.span
                className="block whitespace-nowrap text-center font-black tracking-[-0.04em]"
                style={{
                  y: markY,
                  fontSize: "36cqw",
                  lineHeight: 0.74,
                  marginBottom: "-0.05em",
                  background:
                    "linear-gradient(to bottom, rgba(9,9,11,0.11) 0%, rgba(9,9,11,0.04) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                CRUX
              </motion.span>
            </div>
          </div>
        </div>
      </footer>
    </MotionConfig>
  );
}
