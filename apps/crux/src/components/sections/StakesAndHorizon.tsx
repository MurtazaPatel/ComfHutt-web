"use client";

import { useState, useEffect, useRef } from "react";
import { motion, MotionConfig } from "framer-motion";
import { FileText } from "lucide-react";

/**
 * Why a grade is worth anything: the record exists, and nobody can read it.
 *
 * What was here before opened with two invented statistics — how long a family
 * saves for a home, and how often that ends badly — the second of them using a
 * banned word for developer misconduct. It then closed with a beat selling an
 * unshipped fractional-ownership product: a numbered "verified" asset, a legal
 * line claiming everything was cleared, a net yield, a rupee entry ticket, and a
 * headcount of people supposedly already signed up — above an email form whose
 * submit handler set a local flag and threw the address away. None of it shipped,
 * none of the figures came from anywhere, and the form told people they had joined
 * a list that does not exist. The whole beat is gone rather than restated, because
 * there was nothing true to restate it as.
 *
 * What remains is the one claim that needs no source: these records are public,
 * they are scattered, and reading them is work.
 */

/**
 * Scroll entrance. `animate` is resolved at intersection rather than during
 * render, because matchMedia does not exist on the server — and it has to be
 * resolved in JS at all because the entrance is written as an inline style, which
 * no `motion-reduce:` class can override.
 */
function useScrollEntrance(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ inView: false, animate: true });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState({
          inView: true,
          animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        });
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView: state.inView, animate: state.animate };
}

/**
 * A stack of filings. Deliberately abstract: no figures, no verdict, no coloured
 * risk marker that a reader could mistake for a real finding.
 */
function FilingStack({ inView }: { inView: boolean }) {
  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-[400px] items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-crux-green opacity-[0.04] blur-3xl" />
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute flex h-80 w-64 flex-col justify-between rounded-2xl border border-crux-border bg-white p-6 shadow-[var(--shadow-premium-lg)]"
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={
            inView
              ? {
                  opacity: 1 - i * 0.22,
                  y: i * -20,
                  rotate: i === 0 ? -4 : i === 1 ? 4 : -2,
                  scale: 1 - i * 0.05,
                  zIndex: 10 - i,
                }
              : undefined
          }
          transition={{ duration: 0.9, delay: 0.1 + i * 0.15, type: "spring", stiffness: 90 }}
        >
          <div className="space-y-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-crux-bg-secondary">
              <FileText
                size={16}
                strokeWidth={1.75}
                aria-hidden
                className="text-crux-text-muted"
              />
            </span>
            <div className="space-y-2">
              <div className="h-2 w-full rounded-full bg-crux-bg-secondary" />
              <div className="h-2 w-4/5 rounded-full bg-crux-bg-secondary" />
              <div className="h-2 w-2/3 rounded-full bg-crux-bg-secondary" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-1/2 rounded-full bg-crux-bg-secondary" />
            <div className="h-2 w-3/4 rounded-full bg-crux-bg-secondary" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function entranceStyle(
  inView: boolean,
  delay: number,
  animate: boolean
): React.CSSProperties {
  if (!animate) return { opacity: inView ? 1 : 0 };
  return {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
  };
}

export default function StakesAndHorizon() {
  // Destructured so `ref` is never handed to a helper that runs during render.
  const { ref: beatRef, inView, animate } = useScrollEntrance(0.2);

  // reducedMotion="user" is set per section: page.tsx is owned elsewhere, and a
  // section that animates has to honour the preference itself.
  return (
    <MotionConfig reducedMotion="user">
      <section className="overflow-hidden bg-crux-bg-primary">
        <div className="py-20 md:py-32">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="flex flex-col items-center gap-14 md:flex-row md:gap-24">
              <div ref={beatRef} className="order-2 w-full md:order-1 md:w-1/2">
                <p
                  className="mb-6 text-[11px] font-bold uppercase tracking-[0.25em] text-crux-green"
                  style={entranceStyle(inView, 0, animate)}
                >
                  The problem
                </p>
                <h2
                  className="mb-8 text-balance text-[32px] font-extrabold leading-[1.05] tracking-tight text-crux-text-primary md:text-[52px]"
                  style={entranceStyle(inView, 100, animate)}
                >
                  The record is public. It is just unreadable.
                </h2>
                <p
                  className="mb-6 text-pretty text-[17px] font-medium leading-relaxed text-crux-text-secondary md:text-[19px]"
                  style={entranceStyle(inView, 200, animate)}
                >
                  A single project can carry quarterly GujRERA filings, authority
                  and appellate tribunal orders, and case listings from the
                  district courts up to the Supreme Court — on separate portals,
                  each with its own search, and each spelling the promoter&rsquo;s
                  name its own way.
                </p>
                <p
                  className="text-pretty text-[15px] leading-relaxed text-crux-text-secondary"
                  style={entranceStyle(inView, 300, animate)}
                >
                  CRUX reads them and states an opinion, with the document behind
                  every finding attached. You are free to read the document and
                  disagree — that is the whole reason it is attached.
                </p>
              </div>
              <div className="order-1 w-full md:order-2 md:w-1/2">
                <FilingStack inView={inView} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
