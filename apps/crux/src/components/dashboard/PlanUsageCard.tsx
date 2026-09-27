"use client";

import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { useCruxUser } from "@/hooks/useCruxUser";
import { FREE_PLAN, PLANS, formatRupees } from "@/lib/pricing";

/**
 * Plan and usage.
 *
 * This is the dashboard's one saturated surface: everything else is a white card
 * on light grey, so spending the colour budget once gives the eye somewhere to
 * land. White on #064E3B measures about 9:1.
 *
 * What this card does NOT do is as deliberate as what it does:
 *
 * - **No upgrade button.** Consumer Pro at ₹199/month is retired, and the tiers
 *   that replaced it — the ₹999 Booking Report and the Professional seats — cannot
 *   be invoiced until one-time payments and PDF export ship. A checkout that
 *   cannot complete is worse than no checkout, so the card states what is coming
 *   and stops there.
 * - **No Watch credits.** Watch is a stub: the balance is real but score-change
 *   alerts are not live, so presenting it here would advertise a benefit that does
 *   not yet do anything. It stays on Settings as a factual account balance.
 *
 * Every entitlement listed is one the Free tier genuinely has today.
 */
export function PlanUsageCard() {
  const { user, isLoading } = useCruxUser();

  const searches = user?.totalSearches;
  // The next paid tier, for the "what's coming" line. Read from the plan table so
  // a price change lands here without an edit.
  const bookingReport = PLANS.find((p) => p.id === "booking_report");

  return (
    <section
      aria-labelledby="plan-card-title"
      className="relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-crux-green-deep to-crux-green-darkest p-6 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
    >
      {/* One soft highlight so the panel reads as a lit surface, not a flat swatch. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-2xl"
      />

      <div className="relative">
        <h3 id="plan-card-title" className="text-[15px] font-semibold tracking-tight">
          Your plan
        </h3>
        <p className="mt-1 text-[28px] font-bold leading-none">
          {isLoading ? <span className="opacity-60">—</span> : FREE_PLAN.name}
        </p>
        <p className="mt-2 text-[13px] text-white/70">
          Grading is free, and stays free. CRUX is paid for by professionals and
          lenders, never by the builders it grades.
        </p>
      </div>

      <ul className="relative mt-5 space-y-2 border-t border-white/15 pt-4">
        {/* The first four entitlements; the plan page carries the full list. */}
        {FREE_PLAN.features.slice(0, 4).map((feature) => (
          <li key={feature} className="flex gap-2 text-[13px] leading-snug text-white/85">
            <Check size={15} aria-hidden className="mt-px shrink-0 text-white/70" />
            {feature}
          </li>
        ))}
      </ul>

      {typeof searches === "number" && (
        <div className="relative mt-5 flex items-baseline gap-2 border-t border-white/15 pt-4">
          <span className="text-[20px] font-bold leading-none">{searches}</span>
          <span className="text-[13px] text-white/70">
            {searches === 1 ? "property graded so far" : "properties graded so far"}
          </span>
        </div>
      )}

      {bookingReport && (
        <p className="relative mt-5 text-[12px] leading-relaxed text-white/60">
          A {formatRupees(bookingReport.priceRupees ?? 0)} Booking Report — the full dossier
          for one property — and seats for brokers and advocates are coming shortly
          after launch.
        </p>
      )}

      <div className="relative mt-4">
        <Link
          href="/#pricing"
          className="inline-flex items-center gap-1.5 rounded text-sm font-semibold text-white underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-crux-green-deep"
        >
          See every plan
          <ArrowUpRight size={15} aria-hidden />
        </Link>
      </div>
    </section>
  );
}
