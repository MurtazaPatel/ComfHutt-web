"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { VARIANTS } from "@/utils/animationUtils";
import { redirectToEarlyAccess } from "@/utils/navigation";

export default function EarlyAccess() {
  const router = useRouter();

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={VARIANTS.staggerContainer}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            variants={VARIANTS.slideUp}
          >
            Excited to invest in real estate the smarter way?
          </motion.h2>
          <motion.p
            className="text-lg text-gray-500 max-w-2xl mx-auto mb-8"
            variants={VARIANTS.slideUp}
          >
            We’re launching ComfHutt soon with a limited set of high-quality, AI-evaluated properties.
            Join the waitlist to get early access before the public launch.
          </motion.p>
          <motion.div variants={VARIANTS.slideUp}>
            <button
              onClick={() => redirectToEarlyAccess(router)}
              className="px-8 py-4 bg-black text-white text-lg font-semibold rounded-full hover:bg-gray-800 transition-all transform hover:scale-105 active:scale-95 shadow-lg w-full sm:w-auto"
            >
              Join the Early Access Waitlist
            </button>
          </motion.div>
          <motion.p className="text-sm text-gray-400 mt-4" variants={VARIANTS.slideUp}>
            Feel free to contact us for any queries at <a href="mailto:support@comfhutt.com" className="text-green-500">support@comfhutt.com</a>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
