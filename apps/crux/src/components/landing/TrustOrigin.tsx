"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const VP = { once: true, margin: "-100px" } as const;

export default function TrustOrigin() {
  return (
    <section className="bg-white py-32 px-4">
      <div className="mx-auto max-w-3xl text-center">
        {/* Quotation mark */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center mb-8"
        >
          <Quote size={48} color="#E5E7EB" strokeWidth={2} />
        </motion.div>

        {/* Quote text */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="text-2xl font-medium text-[#111827] italic leading-[1.6] tracking-[-0.2px]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          "We built CRUX because every Indian deserves the same property
          intelligence that institutional investors pay lakhs for. Data should
          be a right, not a privilege."
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={VP}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
          className="mx-auto mt-10 mb-8 h-px bg-[#E5E7EB]"
          style={{ width: 64 }}
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.35 }}
          className="text-base text-[#6B7280]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Built in India. For Indian real estate.
        </motion.p>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.45 }}
          className="flex justify-center mt-6"
        >
          <img
            src="/comfhutt-logo.svg"
            alt="ComfHutt"
            className="h-6 w-auto opacity-60"
          />
        </motion.div>
      </div>
    </section>
  );
}
