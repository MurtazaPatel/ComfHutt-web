"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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

function PlanCard({ plan, index }: { plan: PlanDefinition; index: number }) {
  const actionable = isActionable(plan);

  return (
    <motion.div
      className={[
        "flex flex-col rounded-2xl p-7",
        actionable
          ? "border-2 border-crux-green bg-crux-bg-accent"
          : "border border-crux-border bg-white",
      ].join(" ")}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: Math.min(index, 3) * 0.08 }}
    >
      <div className="mb-5">
        <h3 className="text-[17px] font-bold tracking-tight text-crux-text-primary">{plan.name}</h3>
        <p className="mt-1 text-[13px] leading-snug text-crux-text-secondary">{plan.audience}</p>
      </div>

      <div className="mb-6">
        {plan.priceRupees === null ? (
          // Institutional is priced with each pilot. Printing a number here would
          // invent one.
          <p className="text-[22px] font-bold text-crux-text-primary">{plan.priceLabel}</p>
        ) : (
          <>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[40px] font-extrabold leading-none text-crux-text-primary">
                {formatRupees(plan.priceRupees)}
              </span>
              <span className="text-[13px] text-crux-text-muted">{plan.priceLabel}</span>
            </div>
            {plan.annualRupees && (
              <p className="mt-1.5 text-[13px] text-crux-text-secondary">
                or {formatRupees(plan.annualRupees)} per year
              </p>
            )}
          </>
        )}
      </div>

      <ul className="mb-7 flex-1 space-y-2.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <Check size={15} aria-hidden className="mt-0.5 shrink-0 text-crux-green" />
            <span className="text-[13px] leading-snug text-crux-text-secondary">{feature}</span>
          </li>
        ))}
      </ul>

      {actionable ? (
        <Link
          href="/score"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-crux-green px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-crux-green-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
        >
          Grade a project free
        </Link>
      ) : (
        // Not a disabled button: there is nothing to enable yet, and a greyed-out
        // control reads as "broken" rather than "not out". The note says where the
        // tier stands; the mailto gives the visitor somewhere to go today.
        <div className="flex flex-col gap-2">
          <p className="rounded-xl bg-crux-bg-secondary px-4 py-3 text-center text-[13px] font-medium text-crux-text-secondary">
            {plan.availabilityNote}
          </p>
          {plan.contactLabel && (
            <a
              href={`mailto:${LEGAL.supportEmail}?subject=${encodeURIComponent(`CRUX — ${plan.name}`)}`}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-crux-border bg-white px-5 py-3 text-sm font-semibold text-crux-text-primary no-underline transition-colors hover:border-crux-green hover:text-crux-green-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
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
    <section id="pricing" ref={ref} className="bg-white px-4 py-20 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-pretty text-[28px] font-bold tracking-[-0.02em] text-crux-text-primary md:text-[44px]">
            Free for buyers. Paid by people whose money is at risk.
          </h2>
          <p className="mx-auto mt-4 max-w-[54ch] text-pretty text-[17px] leading-[1.7] text-crux-text-secondary">
            CRUX is paid for by the professionals and lenders who rely on it, never by
            the builders it grades. That is the whole basis of the rating.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-[62ch] text-center text-[13px] leading-relaxed text-crux-text-muted">
          Booking Report and Professional seats open shortly. Grades are free now and
          always. We would rather show you the price than pretend the tier does not
          exist.
        </p>
      </div>
    </section>
  );
}
