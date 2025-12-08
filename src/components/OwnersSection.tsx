"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, BarChart } from "lucide-react";
import { VARIANTS } from "@/utils/animationUtils";

export default function OwnersSection() {
  return (
    <section id="owners" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={VARIANTS.slideUp}
          >
            For Property Owners
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Panel A: Liquidity + Market Access */}
          <motion.div
            className="flex flex-col space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={VARIANTS.staggerContainer}
          >
            <motion.div variants={VARIANTS.slideUp}>
              <div className="w-12 h-12 rounded-lg bg-black text-white flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Unlock liquidity for your property</h3>
              <p className="text-gray-500 mb-6">Accelerate sales cycles and reach verified micro-investors.</p>
              
              <ul className="space-y-4">
                {[
                  "Instant onboarding for property listing",
                  "Fractional tokens expand buyer pool",
                  "Faster sales cycles for unsold inventory",
                  "Reach verified micro-investors",
                  "Transparent escrow & compliant workflows",
                  "Continuous credibility boosts buyer trust"
                ].map((item, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-medium text-sm md:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Panel B: Data-Driven Market Trust */}
          <motion.div
            className="flex flex-col space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={VARIANTS.staggerContainer}
          >
            <motion.div variants={VARIANTS.slideUp}>
              <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                <BarChart className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Boost market confidence with transparent intelligence</h3>
              <p className="text-gray-500 mb-6">Leverage data to showcase value and reliability.</p>

              <ul className="space-y-4">
                {[
                  "Credibility Score increases buyer trust",
                  "Shows verified data, not broker claims",
                  "Helps buyers understand locality & risk at a glance",
                  "Reduces negotiation friction",
                  "Enhances perceived reliability of your project"
                ].map((item, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-medium text-sm md:text-base">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <Link
                  href="/choices?role=owner"
                  className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Learn More &rarr;
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}