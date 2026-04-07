"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useSectionInView } from "@/hooks/useSectionInView";
import { useCountUp } from "@/hooks/useCountUp";

const FREE_FEATURES = [
  "Full CRUX Score (0\u2013100)",
  "All 20+ parameters",
  "CRUX Lens AI assistant",
  "CRUX Cast predictions",
  "CRUX Yield forecasts",
  "3 Watch credits/month",
];

const PRO_FEATURES = [
  "Unlimited Watch credits",
  "Priority re-scoring on data updates",
  "Personalized investor fit profile",
  "Full PDF dossier export",
  "Early access to new features",
];

export default function PricingSection() {
  const { ref, isInView } = useSectionInView(0.15);
  const freePrice = useCountUp(0, 500, isInView);
  const proPrice = useCountUp(199, 1200, isInView);

  return (
    <section
      id="pricing"
      ref={ref}
      className="py-20 md:py-32 bg-white px-4"
    >
      <div className="mx-auto max-w-[1100px]">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
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
                &#8377;{freePrice}
              </span>
              <span className="text-crux-text-muted text-sm">/forever</span>
            </div>
            <ul className="mt-8 space-y-3">
              {FREE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check
                    size={16}
                    className="text-crux-green mt-0.5 shrink-0"
                  />
                  <span className="text-sm text-crux-text-secondary">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            <button className="mt-8 w-full py-3 rounded-xl border-2 border-crux-green text-crux-green font-semibold text-sm hover:bg-crux-green/5 hover:brightness-105 transition-all duration-200 cursor-pointer">
              Start Free
            </button>
            <p className="mt-3 text-xs text-crux-text-muted text-center">
              No card. No signup wall.
            </p>
          </motion.div>

          {/* Pro tier */}
          <motion.div
            className="bg-crux-bg-accent rounded-2xl border border-crux-green/30 p-8 relative overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            {/* Green gradient top border */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-green" />

            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-crux-green/10 text-crux-green mb-6">
              Popular
            </span>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-5xl font-extrabold text-crux-text-primary">
                &#8377;{proPrice}
              </span>
              <span className="text-crux-text-muted text-sm">/month</span>
            </div>
            <p className="text-xs text-crux-text-muted mt-2">
              Everything in Free, plus:
            </p>
            <ul className="mt-6 space-y-3">
              {PRO_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check
                    size={16}
                    className="text-crux-green mt-0.5 shrink-0"
                  />
                  <span className="text-sm text-crux-text-primary">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            <button className="mt-8 w-full py-3 rounded-xl bg-gradient-green text-white font-semibold text-sm hover:brightness-105 transition-all duration-200 cursor-pointer">
              Upgrade to Pro
            </button>
            <p className="mt-3 text-xs text-crux-text-muted text-center">
              That&rsquo;s less than one chai a day &#9749;
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
