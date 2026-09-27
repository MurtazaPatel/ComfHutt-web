"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { useCruxUser } from "@/hooks/useCruxUser";
import { useWatchCredits, useCruxPlans } from "@/hooks/useWatchCredits";
import { useApiFetch } from "@/lib/api";

/**
 * Plan and usage.
 *
 * This is the dashboard's one saturated surface. Everything else on the page is
 * a white card on light grey; spending the colour budget in a single place gives
 * the eye somewhere to land without turning the page into a set of competing
 * panels. White on #064E3B measures ~9:1, so the text is comfortably readable
 * rather than the low-contrast white-on-mid-green the brand chip used to use.
 *
 * Everything shown is real: the plan tier and search count come from
 * `/crux/auth/me`, the balance from `/crux/watch/credits`, and the upgrade price
 * from `/crux/billing/plans`. It deliberately does NOT list Pro features. The
 * backend's own feature strings still advertise "CRUX Cast predictions" and
 * "CRUX Yield forecasts", whose endpoints return 501, plus a PDF dossier export
 * and an investor-fit profile that have no route at all. Repeating those here
 * would sell four things that do not exist, so the card shows the price and
 * sends people to the pricing page for the rest.
 */
export function PlanUsageCard() {
  const { user, isLoading: userLoading } = useCruxUser();
  const { credits, isLoading: creditsLoading } = useWatchCredits();
  const { proMonthly, paymentsConfigured, isLoading: plansLoading } = useCruxPlans();
  const apiFetch = useApiFetch();

  const [checkoutState, setCheckoutState] = useState<"idle" | "starting" | "failed">("idle");

  const isPro = (user?.planTier ?? "").toLowerCase().startsWith("pro");
  const isLoading = userLoading || creditsLoading || plansLoading;

  const startCheckout = async () => {
    setCheckoutState("starting");
    try {
      // The route answers with the params needed to open Razorpay Checkout.
      // Razorpay's own script is not loaded on this page, so rather than fake a
      // flow that cannot finish here, send the user to the page that owns it.
      await apiFetch("/crux/billing/checkout", {
        method: "POST",
        body: JSON.stringify({ billingCycle: "monthly" }),
      });
      window.location.href = "/#pricing";
    } catch {
      setCheckoutState("failed");
    }
  };

  return (
    <section
      aria-labelledby="plan-card-title"
      className="relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-crux-green-deep to-crux-green-darkest p-6 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
    >
      {/* A single soft highlight so the panel reads as a lit surface rather than a
          flat swatch. Decorative, so it is hidden from assistive tech. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-2xl"
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <h3 id="plan-card-title" className="text-[15px] font-semibold tracking-tight">
            Your plan
          </h3>
          <p className="mt-1 text-[28px] font-bold leading-none">
            {isLoading ? <span className="opacity-60">—</span> : isPro ? "Pro" : "Free"}
          </p>
        </div>
        {!isLoading && !isPro && proMonthly && (
          <span className="rounded-full bg-white/15 px-3 py-1 text-[12px] font-medium whitespace-nowrap">
            Pro ₹{proMonthly.priceRupees}
            <span className="opacity-70">{proMonthly.priceLabel}</span>
          </span>
        )}
      </div>

      {/* Watch credits — a single ratio against a limit, so a meter, not a chart.
          The unfilled track is a lighter step of the same green rather than a
          neutral grey, so the whole bar reads as one scale. */}
      <div className="relative mt-6">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <span className="text-[13px] font-medium text-white/80">Watch credits</span>
          <span className="text-[13px] font-semibold">
            {credits ? (
              <>
                {credits.credits_remaining}
                <span className="font-normal text-white/60"> of {credits.credits_total} left</span>
              </>
            ) : (
              <span className="text-white/60">{isLoading ? "…" : "Unavailable"}</span>
            )}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-crux-green/25">
          {credits && credits.credits_total > 0 && (
            <div
              role="meter"
              aria-valuenow={credits.credits_remaining}
              aria-valuemin={0}
              aria-valuemax={credits.credits_total}
              aria-label="Watch credits remaining"
              className="h-full rounded-full bg-white transition-[width] duration-500 motion-reduce:transition-none"
              style={{
                width: `${Math.max(0, Math.min(100, (credits.credits_remaining / credits.credits_total) * 100))}%`,
              }}
            />
          )}
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-white/60">
          One credit registers a watch on a property. Score-change alerts are not live yet.
        </p>
      </div>

      <div className="relative mt-5 flex items-baseline gap-2 border-t border-white/15 pt-4">
        <span className="text-[20px] font-bold leading-none">
          {user?.totalSearches ?? (isLoading ? "—" : 0)}
        </span>
        <span className="text-[13px] text-white/70">
          {user?.totalSearches === 1 ? "property searched" : "properties searched"}
        </span>
      </div>

      <div className="relative mt-5">
        {isPro ? (
          <p className="flex items-center gap-2 text-[13px] text-white/80">
            <Check size={15} aria-hidden className="shrink-0" />
            Pro is active on this account.
          </p>
        ) : paymentsConfigured ? (
          <>
            <button
              type="button"
              onClick={startCheckout}
              disabled={checkoutState === "starting"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-crux-green-deep transition-colors hover:bg-crux-green-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-crux-green-deep disabled:opacity-70 motion-reduce:transition-none"
            >
              {checkoutState === "starting" ? (
                <>
                  <Loader2 size={15} aria-hidden className="animate-spin motion-reduce:animate-none" />
                  Opening checkout…
                </>
              ) : (
                "Upgrade to Pro"
              )}
            </button>
            {checkoutState === "failed" && (
              <p role="alert" className="mt-2 text-[12px] text-white/80">
                Could not start checkout. Please try again from the pricing page.
              </p>
            )}
          </>
        ) : (
          // Razorpay is not configured, so a checkout button would open a flow that
          // cannot complete. Say where to look instead of failing on click.
          <Link
            href="/#pricing"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-crux-green-deep"
          >
            See what Pro includes
            <ArrowUpRight size={15} aria-hidden />
          </Link>
        )}
      </div>
    </section>
  );
}
