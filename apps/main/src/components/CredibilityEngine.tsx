"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, ShieldCheck, FileText, Activity } from "lucide-react";
import { VARIANTS } from "@/utils/animationUtils";

const CARDS = [
  { icon: MapPin, label: "Locality Indicators", color: "bg-blue-100 text-blue-600" },
  { icon: ShieldCheck, label: "Owner Reliability", color: "bg-emerald-100 text-emerald-600" },
  { icon: FileText, label: "Document Health", color: "bg-purple-100 text-purple-600" },
  { icon: Activity, label: "Market & Risk Signals", color: "bg-amber-100 text-amber-600" },
];

export default function CredibilityEngine() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          
          {/* Text Content */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={VARIANTS.staggerContainer}
          >
            <motion.h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6" variants={VARIANTS.slideUp}>
              <span className="text-emerald-600">AI-Powered Credibility Score:</span> Intelligence behind every property.
            </motion.h2>
            <motion.p className="text-lg text-gray-600 mb-8 leading-relaxed" variants={VARIANTS.slideUp}>
              Continuously rescored by AI models and autonomous agents using verified signals, locality intelligence, owner reliability, and legal checks.
            </motion.p>
            <motion.div variants={VARIANTS.slideUp} className="flex flex-col items-center lg:items-start gap-3">
              <div className="inline-block bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm text-gray-500">
                Credibility Score (0–100) — category breakdown available on property pages.
              </div>
              <div className="inline-block bg-[#F5F7F8] px-3 py-1 rounded-full text-[10px] font-medium text-[#555] tracking-wide">
                AI-Assessed • Agent-Monitored • Auto-Updated
              </div>
            </motion.div>
          </motion.div>

          {/* Visual / Cards */}
          <div className="flex-1 relative flex justify-center items-center min-h-[400px]">
            {/* Radial Glow */}
            <motion.div
              className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full blur-3xl pointer-events-none -z-10"
              style={{
                background: "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)",
              }}
              animate={shouldReduceMotion ? {} : { opacity: [0.12, 0.18, 0.12] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Micro-Tokens */}
            {[
              { top: "10%", left: "20%", delay: 0, duration: 10, x: [0, 20, 0], y: [0, -15, 0] },
              { top: "85%", left: "70%", delay: 2, duration: 11, x: [0, -15, 0], y: [0, 20, 0] },
              { top: "40%", left: "85%", delay: 4, duration: 12, x: [0, 15, 0], y: [0, 10, 0] },
            ].map((token, i) => (
              <motion.div
                key={i}
                className="absolute w-2.5 h-2.5 rounded-full border-2 border-[#10B981] bg-[#F8FAF9] opacity-20 pointer-events-none z-0"
                style={{ top: token.top, left: token.left }}
                animate={shouldReduceMotion ? {} : {
                  x: token.x,
                  y: token.y,
                }}
                transition={{
                  duration: token.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: token.delay,
                }}
              />
            ))}

            {/* Background Pulse for Card Cluster */}
            <motion.div
              className="absolute w-80 h-80 bg-gray-200 rounded-full blur-3xl -z-5"
              style={{ top: "50%", left: "50%", x: "-50%", y: "-50%" }}
              animate={shouldReduceMotion ? {} : {
                scale: [0.95, 1.05, 0.95],
                opacity: 0.08,
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={VARIANTS.staggerContainer}
            >
              {CARDS.map((card, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 w-full sm:w-40 h-40 flex flex-col items-center justify-center text-center hover:shadow-xl transition-shadow duration-300"
                  variants={VARIANTS.slideUp}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${card.color}`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 leading-snug">
                    {card.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}