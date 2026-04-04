"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileCheck, ShieldCheck, Link, Eye, UserCheck, Zap } from "lucide-react";
import { VARIANTS } from "@/utils/animationUtils";

const TRUST_ITEMS = [
  { icon: FileCheck, label: "Verified Documents" },
  { icon: ShieldCheck, label: "Escrow Secured" },
  { icon: Link, label: "Audited Smart Contracts" },
  { icon: Eye, label: "On-chain Ownership Proof" },
  { icon: UserCheck, label: "Regulated KYC" },
  { icon: Zap, label: "Powered by the Credibility Engine" },
];

export default function TrustStrip() {
  return (
    <section className="w-full bg-gray-50 border-y border-gray-100 py-10 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          className="flex flex-wrap justify-center gap-x-6 gap-y-4 lg:gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={VARIANTS.staggerContainer}
        >
          {TRUST_ITEMS.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-2 group cursor-default"
              variants={VARIANTS.slideUp}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <item.icon className="w-5 h-5 text-emerald-600 group-hover:text-emerald-500 transition-colors" />
              <h3 className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition-colors whitespace-nowrap">
                {item.label}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}