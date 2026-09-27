"use client";

import { useRef, useState } from "react";
import {
  motion,
  MotionConfig,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { FileText, MessageSquare, Share2, Link2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MODULE_ORDER, MODULE_LABEL } from "@/lib/grade";

/**
 * What a reader gets today — three surfaces, not five products.
 *
 * This section used to scroll through CRUX Score, Lens, Cast, Yield and Watch.
 * Cast and Yield return HTTP 501 and Watch (alerts, re-scoring) is unbuilt, so
 * three of the five panels advertised software that does not exist, complete with
 * a fair value of ₹65–68L for a Mumbai locality CRUX does not cover, a ₹8,400
 * rent forecast and a live alert feed. What is left is what ships: the grade, the
 * assistant that answers from the record, and the card you can send someone.
 *
 * Every figure in the three widgets is invented, so each widget carries an
 * EXAMPLE badge in its own frame rather than relying on a caption elsewhere.
 */

interface Surface {
  eyebrow: string;
  name: string;
  tagline: string;
  description: string;
  pills: string[];
  Icon: LucideIcon;
}

const SURFACES: Surface[] = [
  {
    eyebrow: "01 / 03",
    name: "The CRUX Grade",
    tagline: "A letter you can argue with.",
    description:
      "A+ to D for a RERA-registered project, with all seven module verdicts, the confidence CRUX has in each, and a link to the filing or case behind every finding. Free, including the grade itself.",
    pills: ["Seven modules", "Confidence stated", "Evidence linked"],
    Icon: FileText,
  },
  {
    eyebrow: "02 / 03",
    name: "CRUX Lens",
    tagline: "Ask the record a question.",
    description:
      "An assistant that answers from the documents CRUX has already read for that project, and cites them. It declines rather than guesses when the record does not say. Rate-limited on the free tier.",
    pills: ["Answers with citations", "Declines when unsure", "Free, rate-limited"],
    Icon: MessageSquare,
  },
  {
    eyebrow: "03 / 03",
    name: "The verdict card",
    tagline: "Send it to whoever is deciding with you.",
    description:
      "A shareable card carrying the grade, the headline findings and the disclaimer. It opens for anyone with the link — no account, no app — which is usually how a family decision actually gets made.",
    pills: ["One link", "No account to open", "Expires"],
    Icon: Share2,
  },
];

/** Shown on every widget frame: none of this came from a real project. */
function ExampleBadge() {
  return (
    <span className="rounded-full bg-crux-text-primary px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white">
      Example
    </span>
  );
}

function WidgetCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full max-w-[460px] flex-col gap-4 rounded-3xl border border-crux-border bg-white p-5 shadow-[var(--shadow-premium-lg)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[12px] font-semibold text-crux-text-secondary">{title}</p>
        <ExampleBadge />
      </div>
      {children}
      <p className="text-[10px] leading-relaxed text-crux-text-muted">
        Illustration only — not a real project, grade or finding.
      </p>
    </div>
  );
}

/** 1. The grade: letter first, composite second, evidence attached. */
const EXAMPLE_MODULE_ROWS: Record<string, string> = {
  L: "2 cases found",
  D: "On its filed pace",
  T: "6 projects registered",
  F: "Filings current",
  C: "Registration valid",
  X: "Mapped",
  P: "Not assessed",
};

function GradeWidget() {
  return (
    <WidgetCard title="Project grade">
      <div className="flex items-center gap-4">
        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl border border-crux-green/30 bg-crux-green-tint">
          <span className="text-[30px] font-extrabold leading-none text-crux-green-dark">
            B+
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-crux-text-primary">
            Sound overall, with points worth reading.
          </p>
          <p className="mt-1 text-[12px] text-crux-text-secondary">
            Composite 72<span className="text-crux-text-muted">/100</span> ·
            confidence medium
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-1.5">
        {MODULE_ORDER.map((code) => (
          <li
            key={code}
            className="flex items-center justify-between gap-3 rounded-lg border border-crux-border bg-crux-bg-primary px-3 py-2"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                aria-hidden
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-crux-green-tint text-[9px] font-bold text-crux-green-dark"
              >
                {code}
              </span>
              <span className="truncate text-[11px] text-crux-text-secondary">
                {MODULE_LABEL[code]}
              </span>
            </span>
            <span className="shrink-0 text-[11px] font-medium text-crux-text-primary">
              {EXAMPLE_MODULE_ROWS[code]}
            </span>
          </li>
        ))}
      </ul>

      <p className="flex items-center gap-1.5 text-[11px] text-crux-green-dark">
        <Link2 size={12} aria-hidden strokeWidth={2} />
        Every finding opens the filing or case it came from.
      </p>
    </WidgetCard>
  );
}

/** 2. Lens: a static example exchange. */
const EXAMPLE_EXCHANGE: Array<{ from: "you" | "lens"; text: string }> = [
  { from: "you", text: "Is there litigation involving this promoter?" },
  {
    from: "lens",
    text: "Two matters in the court record name the promoter, both linked in the evidence panel. A third result matched on name alone, so it is listed separately rather than counted against the project.",
  },
  { from: "you", text: "Is the RERA registration current?" },
  {
    from: "lens",
    text: "The GujRERA registration is live and the quarterly filings are up to date as of the latest filing CRUX has read for this project.",
  },
];

function LensWidget() {
  return (
    <WidgetCard title="CRUX Lens">
      <div className="flex flex-col gap-2.5">
        {EXAMPLE_EXCHANGE.map((turn, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 + i * 0.35 }}
            className={cn("flex", turn.from === "you" ? "justify-end" : "justify-start")}
          >
            <p
              className={cn(
                "max-w-[86%] px-3.5 py-2.5 text-[12px] leading-relaxed",
                turn.from === "you"
                  ? "rounded-[16px_16px_4px_16px] bg-crux-bg-secondary text-crux-text-primary"
                  : "rounded-[16px_16px_16px_4px] border border-crux-green/20 bg-crux-green-tint text-crux-text-primary"
              )}
            >
              {turn.text}
            </p>
          </motion.div>
        ))}
      </div>
    </WidgetCard>
  );
}

/** 3. The verdict card, as a recipient sees it. */
function ShareCardWidget() {
  return (
    <WidgetCard title="Shared card">
      <div className="rounded-2xl border border-crux-border bg-crux-bg-primary p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-crux-text-primary">
              Example Project
            </p>
            <p className="text-[11px] text-crux-text-muted">Ahmedabad, Gujarat</p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-crux-green/30 bg-crux-green-tint text-[18px] font-extrabold text-crux-green-dark">
            B+
          </span>
        </div>

        <p className="mt-3 text-[12px] leading-relaxed text-crux-text-secondary">
          Registration and filings are current. Two matters in the court record
          name the promoter. Price fairness could not be assessed without an
          asking price.
        </p>

        <p className="mt-3 border-t border-crux-border pt-3 text-[10px] leading-relaxed text-crux-text-muted">
          A CRUX Grade is an opinion formed from public records, not investment
          advice. Link expires.
        </p>
      </div>
    </WidgetCard>
  );
}

const WIDGETS = [GradeWidget, LensWidget, ShareCardWidget];

function ProgressDots({ active }: { active: number }) {
  return (
    <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-row gap-2 md:bottom-auto md:left-auto md:right-8 md:top-1/2 md:-translate-x-0 md:-translate-y-1/2 md:flex-col md:gap-2.5">
      {WIDGETS.map((_, i) => (
        <span
          key={i}
          className={cn(
            "rounded-full transition-[width,height,background-color] duration-300",
            i === active
              ? "h-6 w-2 bg-crux-green md:h-2 md:w-7"
              : "h-2 w-2 bg-crux-border"
          )}
        />
      ))}
    </div>
  );
}

function TextPanel({ surface }: { surface: Surface }) {
  const { Icon } = surface;
  return (
    <div className="flex flex-col gap-4 px-4 md:px-0">
      <div className="flex items-center gap-2.5">
        <span className="h-0.5 w-5 shrink-0 rounded bg-crux-green" />
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-crux-green">
          {surface.eyebrow}
        </span>
      </div>

      <div>
        <h3
          className="flex items-center gap-2.5 font-extrabold leading-tight text-crux-text-primary"
          style={{ fontSize: "clamp(26px, 3.4vw, 44px)" }}
        >
          <Icon
            size={26}
            strokeWidth={1.75}
            aria-hidden
            className="shrink-0 text-crux-green"
          />
          {surface.name}
        </h3>
        <p
          className="mt-2 font-medium italic text-crux-green"
          style={{ fontSize: "clamp(14px, 1.3vw, 18px)" }}
        >
          {surface.tagline}
        </p>
      </div>

      <p className="max-w-[420px] text-pretty text-[14px] leading-relaxed text-crux-text-secondary">
        {surface.description}
      </p>

      <ul className="flex list-none flex-wrap gap-2 p-0">
        {surface.pills.map((pill) => (
          <li
            key={pill}
            className="rounded-full border border-crux-green/20 bg-crux-green-tint px-3.5 py-1.5 text-[12px] font-medium text-crux-green-mid"
          >
            {pill}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProductFamily() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(Math.floor(v * SURFACES.length), SURFACES.length - 1));
  });

  const Widget = WIDGETS[active];

  // The outer element is one viewport of scroll per surface, plus one so the last
  // panel can rest before the section releases.
  // reducedMotion="user" is set here, per section, rather than once around the
  // page: page.tsx is a server component owned elsewhere, and a landing section
  // that animates has to honour the preference on its own.
  return (
    <MotionConfig reducedMotion="user">
    <div
      ref={outerRef}
      id="features"
      className="relative h-[400vh]"
      style={{ scrollMarginTop: 80 }}
    >
      <div
        className="sticky top-0 flex min-h-screen flex-col overflow-hidden"
        style={{
          height: "100svh",
          background:
            "linear-gradient(160deg, var(--color-crux-green-tint) 0%, #FFFFFF 45%, var(--color-crux-bg-primary) 100%)",
        }}
      >
        {/* Section header — pinned, so it does not animate with the panels. */}
        <div className="px-4 pt-16 md:absolute md:left-[8%] md:top-20 md:z-10 md:px-0">
          <div className="mb-2 flex items-center gap-2.5">
            <span className="h-0.5 w-5 rounded bg-crux-green" />
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-crux-green">
              What you get
            </span>
          </div>
          <h2
            className="font-bold leading-snug text-crux-text-primary"
            style={{ fontSize: "clamp(17px, 2vw, 24px)" }}
          >
            One engine.{" "}
            <span className="text-crux-green">Three surfaces</span> that exist today.
          </h2>
        </div>

        {/* Panels. Mobile stacks widget over text; desktop sits them side by side. */}
        <div className="flex flex-1 flex-col gap-5 overflow-hidden pt-6 pb-16 md:flex-row md:items-center md:gap-0 md:pt-28 md:pb-0">
          <div className="order-1 flex min-h-0 flex-1 items-center justify-center px-4 md:order-2 md:px-[8%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`widget-${active}`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="flex w-full justify-center"
              >
                <Widget />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="order-2 flex min-h-0 items-center md:order-1 md:w-[42%] md:shrink-0 md:pl-[8%] md:pr-[4%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${active}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full"
              >
                <TextPanel surface={SURFACES[active]} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <ProgressDots active={active} />
      </div>
    </div>
    </MotionConfig>
  );
}
