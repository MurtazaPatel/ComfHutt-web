"use client";

import { useRef, useEffect, useState, Fragment } from "react";
import { ArrowDown, Check } from "lucide-react";

/**
 * What changes when a project has a grade.
 *
 * The right-hand column used to promise "20+ verified government data signals",
 * "AI-powered instant property analysis", a "live credibility score, updated
 * daily", an exit "via Liquidity Mesh" and "CRUX Score: one number, full
 * picture". Re-scoring is not shipped, there is no Liquidity Mesh, and the
 * signal count was never sourced. The left-hand column opened on "Broker's word
 * of mouth", which is both an attack on the people CRUX sells its Professional
 * seats to and beside the point: the problem is not who tells you, it is that
 * the record is unreadable.
 *
 * Each right-hand line maps to something that exists: a module verdict, a linked
 * record, a stated confidence.
 */
const PAIRS: Array<[string, string]> = [
  ["A RERA number you cannot read", "Its filings read, module by module"],
  ["The promoter's own word on delivery", "What their filings say about the pace they promised"],
  ["Court cases you would have to search for yourself", "Matters from eCourts up to the Supreme Court, linked"],
  ["A price quoted with nothing to compare it to", "A verdict on whether that price is defensible"],
  ["A decision made on how it felt", "A letter grade, with the confidence behind it stated"],
];

export default function BeforeAfter() {
  const sectionRef = useRef<HTMLElement>(null);
  // `animate` is decided when the section first comes into view rather than
  // during render, because matchMedia does not exist on the server. Both live in
  // one state object so the rows never render half-revealed.
  const [reveal, setReveal] = useState({ shown: false, animate: true });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setReveal({
          shown: true,
          animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // The reveal is a staggered transition. Inline styles beat a `motion-reduce:`
  // class, so the preference is honoured here rather than in the class list.
  const rowStyle = (i: number): React.CSSProperties => {
    if (!reveal.animate) {
      return { opacity: reveal.shown ? 1 : 0 };
    }
    return {
      opacity: reveal.shown ? 1 : 0,
      transform: reveal.shown ? "translateY(0)" : "translateY(8px)",
      transition: `opacity 400ms ease-out ${i * 80}ms, transform 400ms ease-out ${i * 80}ms`,
    };
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-crux-green-tint px-4 py-16 sm:px-5 sm:py-20"
    >
      <div className="relative z-10 mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-12">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[3px] text-crux-green">
            The shift
          </p>
          <h2
            className="text-balance font-bold leading-[1.1] tracking-[-1.5px] text-crux-text-primary"
            style={{ fontSize: "clamp(32px, 6vw, 60px)" }}
          >
            From hearsay to the public record.
          </h2>
        </div>

        {/* Desktop table */}
        <div
          className="hidden sm:grid"
          style={{ gridTemplateColumns: "1fr 1px 1fr", gap: "0 32px" }}
        >
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[2px] text-crux-text-muted">
            Today
          </p>
          <div className="bg-crux-border" />
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[2px] text-crux-green">
            With CRUX
          </p>

          {PAIRS.map(([left, right], i) => (
            <Fragment key={left}>
              <div
                className="pb-5 text-[16px] text-crux-text-muted"
                style={rowStyle(i)}
              >
                {left}
              </div>
              <div className="bg-crux-border" />
              <div
                className="flex gap-2 pb-5 text-[16px] text-crux-text-primary"
                style={rowStyle(i)}
              >
                <Check
                  size={18}
                  strokeWidth={2.5}
                  aria-hidden
                  className="mt-1 shrink-0 text-crux-green"
                />
                <span>{right}</span>
              </div>
            </Fragment>
          ))}
        </div>

        {/* Mobile: the two columns become two lists */}
        <div className="sm:hidden">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[2px] text-crux-text-muted">
            Today
          </p>
          {PAIRS.map(([left], i) => (
            <div
              key={left}
              className="pb-3.5 text-[14px] text-crux-text-muted"
              style={rowStyle(i)}
            >
              {left}
            </div>
          ))}

          <div className="my-5 flex justify-center text-crux-green">
            <ArrowDown size={22} strokeWidth={2} aria-hidden />
          </div>

          <p className="mb-4 font-mono text-[11px] uppercase tracking-[2px] text-crux-green">
            With CRUX
          </p>
          {PAIRS.map(([, right], i) => (
            <div
              key={right}
              className="flex gap-2 pb-3.5 text-[15px] text-crux-text-primary"
              style={rowStyle(i + PAIRS.length)}
            >
              <Check
                size={17}
                strokeWidth={2.5}
                aria-hidden
                className="mt-1 shrink-0 text-crux-green"
              />
              <span>{right}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
