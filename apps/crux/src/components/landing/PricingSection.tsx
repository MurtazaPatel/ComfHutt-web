"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useSectionInView } from "@/hooks/useSectionInView";
import { useCountUp } from "@/hooks/useCountUp";
import { useApiFetch } from "@/lib/api";
import AuthErrorBanner from "@/components/auth/AuthErrorBanner";
import type { PlanDefinition } from "@/lib/pricing";

interface PricingSectionProps {
  plans: PlanDefinition[];
  paymentsConfigured: boolean;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}

function loadRazorpayCheckout(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Renders the animated price but never as the resting/default value — the
// static number is always what's on screen until the count-up is triggered
// and completes at that same number. Fixes a bug where the price showed ₹0
// whenever the section hadn't yet scrolled into view.
function PriceDisplay({ rupees, isInView }: { rupees: number; isInView: boolean }) {
  const animated = useCountUp(rupees, 1200, isInView);
  return <>{isInView ? animated : rupees}</>;
}

export default function PricingSection({ plans, paymentsConfigured }: PricingSectionProps) {
  const { ref, isInView } = useSectionInView(0.15);
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const api = useApiFetch();

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ message: string; variant: "error" | "success" } | null>(null);

  const freePlan = plans.find((p) => p.id === "free");
  const monthlyPlan = plans.find((p) => p.id === "pro_monthly");
  const annualPlan = plans.find((p) => p.id === "pro_annual");

  async function handleUpgrade(plan: PlanDefinition) {
    if (!plan.billingCycle) return;
    setBanner(null);

    if (!isSignedIn) {
      router.push(`/signup?redirect=${encodeURIComponent("/dashboard?upgrade=" + plan.billingCycle)}`);
      return;
    }

    if (!paymentsConfigured) {
      setBanner({ message: "Pro billing launches shortly — check back soon.", variant: "error" });
      return;
    }

    setLoadingPlan(plan.id);
    try {
      const session = await api<{
        success: boolean;
        data: { subscriptionId: string; razorpayKeyId: string; planName: string; amountPaise: number };
      }>("/crux/billing/checkout", {
        method: "POST",
        body: JSON.stringify({ billingCycle: plan.billingCycle }),
      });

      const scriptLoaded = await loadRazorpayCheckout();
      if (!scriptLoaded || !window.Razorpay) {
        setBanner({ message: "Could not load the payment window. Please try again.", variant: "error" });
        return;
      }

      const rzp = new window.Razorpay({
        key: session.data.razorpayKeyId,
        subscription_id: session.data.subscriptionId,
        name: "CRUX by ComfHutt",
        description: session.data.planName,
        theme: { color: "#16A34A" },
        handler: () => {
          setBanner({
            message: "Payment received — your Pro plan activates within a minute.",
            variant: "success",
          });
        },
      });
      rzp.on("payment.failed", () => {
        setBanner({ message: "Payment failed. No charge was made — please try again.", variant: "error" });
      });
      rzp.open();
    } catch {
      setBanner({ message: "Could not start checkout. Please try again.", variant: "error" });
    } finally {
      setLoadingPlan(null);
    }
  }

  if (!freePlan || !monthlyPlan || !annualPlan) return null;

  return (
    <section id="pricing" ref={ref} className="py-20 md:py-32 bg-white px-4">
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-crux-green" />
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-crux-green">
              PRICING
            </p>
          </div>
          <h2 className="text-[28px] md:text-[44px] font-bold text-crux-text-primary tracking-[-0.02em]">
            Generous free. Affordable Pro.
          </h2>
          <p className="mt-4 text-[17px] text-crux-text-secondary leading-[1.7]">
            Start with everything you need. Upgrade when you&rsquo;re serious.
          </p>
        </motion.div>

        {banner && (
          <div className="max-w-md mx-auto mb-8">
            <AuthErrorBanner message={banner.message} variant={banner.variant} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {/* Free tier */}
          <motion.div
            className="bg-white rounded-2xl border border-crux-border p-8 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-crux-text-secondary mb-6">
              Free
            </span>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-5xl font-extrabold text-crux-text-primary">
                &#8377;{freePlan.priceRupees}
              </span>
              <span className="text-crux-text-muted text-sm">{freePlan.priceLabel}</span>
            </div>
            <ul className="mt-8 space-y-3">
              {freePlan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check size={16} className="text-crux-green mt-0.5 shrink-0" />
                  <span className="text-sm text-crux-text-secondary">{feature}</span>
                </li>
              ))}
            </ul>
            <button className="mt-8 w-full py-3 min-h-11 rounded-xl border-2 border-crux-green text-crux-green font-semibold text-sm hover:bg-crux-green/5 hover:brightness-105 transition-all duration-200 cursor-pointer">
              Start Free
            </button>
            <p className="mt-3 text-xs text-crux-text-muted text-center">
              No card. No signup wall.
            </p>
          </motion.div>

          {/* Pro Monthly */}
          <motion.div
            className="bg-crux-bg-accent rounded-2xl border border-crux-green/30 p-8 relative overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-green" />
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-crux-green/10 text-crux-green mb-6">
              Popular
            </span>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-5xl font-extrabold text-crux-text-primary">
                &#8377;<PriceDisplay rupees={monthlyPlan.priceRupees} isInView={isInView} />
              </span>
              <span className="text-crux-text-muted text-sm">{monthlyPlan.priceLabel}</span>
            </div>
            <p className="text-xs text-crux-text-muted mt-2">Everything in Free, plus:</p>
            <ul className="mt-6 space-y-3">
              {monthlyPlan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check size={16} className="text-crux-green mt-0.5 shrink-0" />
                  <span className="text-sm text-crux-text-primary">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade(monthlyPlan)}
              disabled={loadingPlan === monthlyPlan.id}
              className="mt-8 w-full py-3 min-h-11 rounded-xl bg-gradient-green text-white font-semibold text-sm hover:brightness-105 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loadingPlan === monthlyPlan.id && <Loader2 className="w-4 h-4 animate-spin" />}
              Upgrade to Pro
            </button>
            <p className="mt-3 text-xs text-crux-text-muted text-center">
              That&rsquo;s less than one chai a day &#9749;
            </p>
          </motion.div>

          {/* Pro Annual — highlighted as best value */}
          <motion.div
            className="bg-crux-bg-accent rounded-2xl border-2 border-crux-green p-8 relative overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-green" />
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-crux-green text-white mb-6">
              Best Value — 5 months free
            </span>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-5xl font-extrabold text-crux-text-primary">
                &#8377;<PriceDisplay rupees={annualPlan.priceRupees} isInView={isInView} />
              </span>
              <span className="text-crux-text-muted text-sm">{annualPlan.priceLabel}</span>
            </div>
            <p className="text-xs text-crux-text-muted mt-2">Everything in Free, plus:</p>
            <ul className="mt-6 space-y-3">
              {annualPlan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check size={16} className="text-crux-green mt-0.5 shrink-0" />
                  <span className="text-sm text-crux-text-primary">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade(annualPlan)}
              disabled={loadingPlan === annualPlan.id}
              className="mt-8 w-full py-3 min-h-11 rounded-xl bg-gradient-green text-white font-semibold text-sm hover:brightness-105 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loadingPlan === annualPlan.id && <Loader2 className="w-4 h-4 animate-spin" />}
              Upgrade to Pro Annual
            </button>
            <p className="mt-3 text-xs text-crux-text-muted text-center">
              Billed once a year
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
