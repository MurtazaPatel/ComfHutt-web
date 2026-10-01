"use client";

import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import { Check } from "lucide-react";
import { useSectionInView } from "@/hooks/useSectionInView";
import { PLANS, formatRupees, type PlanDefinition } from "@/lib/pricing";
import { LEGAL } from "@/config/legal";

/**
 * Pricing.
 *
 * Rewritten against the locked tiers. Three things changed structurally, not just
 * in copy:
 *
 * 1. **The old Free / Pro ₹199 / Pro Annual ₹999 trio is gone.** Consumer Pro is
 *    retired; the one-time ₹999 Booking Report replaced it.
 *
 * 2. **The Razorpay checkout path is deleted, not hidden.** Only Free is
 *    purchasable today — the Booking Report and the Professional seats cannot be
 *    invoiced until one-time payments and PDF export ship. A button that fails on
 *    click is worse than no button, so an unpurchasable tier gets its availability
 *    note and a mailto that opens a real conversation, which is what the visitor
 *    wanted from a pay button anyway. When invoicing ships, the checkout comes back
 *    behind `plan.purchasable`.
 *
 * 3. **Prices are a local constant, not a fetch.** The backend's plans endpoint is
 *    being corrected separately; until that lands it still serves the retired
 *    tiers, and rendering whatever it returns would put the banned copy straight
 *    back on the page.
 */

/** Free is the one tier a visitor can act on today, so it gets the emphasis. */
function isActionable(plan: PlanDefinition) {
  return plan.purchasable;
}

/**
 * Column spans on the six-track desktop grid. Rows hold three cards; when the
 * last row is short its cards widen to fill it, so five plans read as 3 + 2
 * rather than 3 + 2 and a hole.
 */
function spanClass(index: number, total: number) {
  const remainder = total % 3;
  const inLastRow = remainder !== 0 && index >= total - remainder;
  const lg = !inLastRow ? "lg:col-span-2" : remainder === 2 ? "lg:col-span-3" : "lg:col-span-6";
  // Two-up on tablets: an odd last card spans the row.
  const md = total % 2 === 1 && index === total - 1 ? "md:col-span-2" : "";
  return `${md} ${lg}`;
}

function PlanCard({ plan, index, total }: { plan: PlanDefinition; index: number; total: number }) {
  const actionable = isActionable(plan);

  return (
    <motion.div
      className={[
        "relative flex flex-col overflow-hidden p-7 md:p-8",
        spanClass(index, total),
        // The one tier a visitor can act on is the one forest card, so the grid
        // has a single focal point instead of a tinted box among white ones.
        actionable
          ? "surface-ink rounded-[var(--radius-panel)] shadow-[var(--shadow-premium-lg)]"
          : "surface-card rounded-[var(--radius-panel)]",
      ].join(" ")}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: Math.min(index, 3) * 0.06 }}
    >
      {actionable && <div aria-hidden className="crux-plot opacity-70" />}
      <div className="relative mb-6">
        <h3 className={`t-h3 ${actionable ? "text-crux-ink-text" : "text-crux-text-primary"}`}>{plan.name}</h3>
        <p className={`mt-1.5 text-[14px] leading-snug md:min-h-[2.75em] ${actionable ? "text-crux-ink-muted" : "text-crux-text-secondary"}`}>{plan.audience}</p>
      </div>

      <div
        className={`relative mb-6 border-b pb-6 ${actionable ? "border-crux-ink-line" : "border-crux-line"}`}
      >
        {plan.priceRupees === null ? (
          // Institutional is priced with each pilot. Printing a number here would
          // invent one.
          <p className="text-[26px] font-bold leading-[1.15] tracking-[-0.02em] text-crux-text-primary">{plan.priceLabel}</p>
        ) : (
          <>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-[44px] font-extrabold leading-none tracking-[-0.04em] ${actionable ? "text-crux-ink-text" : "text-crux-text-primary"}`}
              >
                {formatRupees(plan.priceRupees)}
              </span>
              <span className={`text-[14px] ${actionable ? "text-crux-ink-muted" : "text-crux-text-muted"}`}>{plan.priceLabel}</span>
            </div>
            {plan.annualRupees && (
              <p className="mt-1.5 text-[13px] text-crux-text-secondary">
                or {formatRupees(plan.annualRupees)} per year
              </p>
            )}
          </>
        )}
      </div>

      <ul className="relative mb-8 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <Check size={16} aria-hidden className="mt-0.5 shrink-0 text-crux-green" />
            <span className={`text-[14px] leading-snug ${actionable ? "text-crux-ink-text" : "text-crux-text-secondary"}`}>{feature}</span>
          </li>
        ))}
      </ul>

      {actionable ? (
        <Link
          href="/score"
          className="btn-crux btn-crux--block relative min-h-12"
        >
          Grade a project free
        </Link>
      ) : (
        // Not a disabled button: there is nothing to enable yet, and a greyed-out
        // control reads as "broken" rather than "not out". The note says where the
        // tier stands; the mailto gives the visitor somewhere to go today.
        <div className="relative flex flex-col gap-2.5">
          <p className="rounded-[var(--radius-control)] bg-crux-bg-secondary px-4 py-3 text-center text-[13px] font-medium text-crux-text-secondary">
            {plan.availabilityNote}
          </p>
          {plan.contactLabel && (
            <a
              href={`mailto:${LEGAL.supportEmail}?subject=${encodeURIComponent(`CRUX — ${plan.name}`)}`}
              className="btn-crux btn-crux--outline btn-crux--block min-h-12"
            >
              {plan.contactLabel}
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function PricingSection() {
  const { ref } = useSectionInView(0.15);

  return (
    <MotionConfig reducedMotion="user">
    <section id="pricing" ref={ref} className="crux-frame bg-white py-24 md:py-36">
      <div className="crux-container">
        <motion.div
          className="mb-14 text-center md:mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="t-h2 mx-auto max-w-[22ch] text-crux-text-primary">
            Free for buyers. Paid by people whose money is at risk.
          </h2>
          <p className="t-lead mx-auto mt-6 max-w-[54ch] text-crux-text-secondary">
            CRUX is paid for by the professionals and lenders who rely on it, never by
            the builders it grades. That is the whole basis of the rating.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-6">
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} index={i} total={PLANS.length} />
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-[62ch] text-center text-[14px] leading-relaxed text-crux-text-muted">
          Booking Report and Professional seats open shortly. Grades are free now and
          always. We would rather show you the price than pretend the tier does not
          exist.
        </p>
      </div>
    </section>
    </MotionConfig>
  );
}
