"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Home, IndianRupee, Database, BarChart3, Repeat } from "lucide-react";
import { VARIANTS } from "@/utils/animationUtils";

const STEPS = [
  { icon: Home, label: "Choose a property" },
  { icon: IndianRupee, label: "Invest as little as ₹10,000" },
  { icon: Database, label: "Tokenization & escrow settlement" },
  { icon: BarChart3, label: "Monthly rental distribution" },
  { icon: Repeat, label: "Resell tokens on marketplace" },
];

export default function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Start your real estate investment journey in 5 simple steps.</p>
        </div>

        <div className="relative">
          {/* Connecting Line - Desktop */}
          <div className="absolute top-8 left-0 w-full h-0.5 bg-gray-100 hidden md:block">
            {!shouldReduceMotion && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 h-1 w-32 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full"
                initial={{ left: "-10%" }}
                animate={{ left: "110%" }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  boxShadow: "0 0 15px 2px rgba(52, 211, 153, 0.6)",
                  filter: "blur(0.5px)",
                }}
              />
            )}
          </div>

          {/* Connecting Line - Mobile */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-100 -translate-x-1/2 md:hidden -z-10">
            {!shouldReduceMotion && (
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 w-1 h-32 bg-gradient-to-b from-transparent via-emerald-400 to-transparent rounded-full"
                initial={{ top: "-10%" }}
                animate={{ top: "110%" }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  boxShadow: "0 0 15px 2px rgba(52, 211, 153, 0.6)",
                  filter: "blur(0.5px)",
                }}
              />
            )}
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-5 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={VARIANTS.staggerContainer}
          >
            {STEPS.map((step, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center relative z-10"
                variants={VARIANTS.slideUp}
              >
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center relative z-10 shadow-sm hover:border-black transition-colors duration-300">
                    <step.icon className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 leading-tight max-w-[140px] bg-white px-2 py-1 rounded">
                  {step.label}
                </h3>
                
                {/* Mobile Connector */}
                {index < STEPS.length - 1 && (
                  <div className="h-8 w-0.5 bg-transparent my-2 md:hidden" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}