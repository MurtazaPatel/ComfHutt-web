"use client";

import React from "react";
import { motion } from "framer-motion";

const FEATURES = [
  "Tokenized Ownership",
  "Secure Escrow Flow",
  "Automated Rent Payments",
  "Transferability & Liquidity",
  "On-chain Auditability",
  "Continuous Monitoring",
];

// Duplicate list to create seamless loop
const MARQUEE_CONTENT = [...FEATURES, ...FEATURES, ...FEATURES];

export default function FeatureMarquee() {
  return (
    <div className="w-full bg-black py-12 border-y border-white/5 relative overflow-hidden">
      {/* Gradient Masks for Fade Effect */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-black to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-black to-transparent" />

      <div className="flex">
        <motion.div
          className="flex gap-16 whitespace-nowrap"
          animate={{ x: "-50%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30, // Adjust speed here
          }}
        >
          {MARQUEE_CONTENT.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 group">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span className="text-lg font-medium text-gray-400 group-hover:text-white transition-colors duration-300 tracking-wide">
                {feature}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}