"use client";

import { motion } from "framer-motion";
import ChatInput from "@/components/ChatInput";
import { useSectionInView } from "@/hooks/useSectionInView";

export default function FooterCTA() {
  const { ref, isInView } = useSectionInView(0.15);

  return (
    <footer ref={ref} className="bg-white px-4 py-20 md:py-32">
      {/* Green CTA card */}
      <motion.div
        className="mx-auto max-w-[1000px] bg-gradient-green rounded-3xl px-6 sm:px-12 py-16 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-[-0.5px] mb-8 leading-tight">
          Ready to know the truth about your property?
        </h2>
        <div className="max-w-lg mx-auto">
          <ChatInput variant="white" size="large" />
        </div>
      </motion.div>

      {/* Standard footer */}
      <div className="mx-auto max-w-[1100px] pt-12 pb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-crux-text-muted">
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-crux-text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-crux-text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-crux-text-primary transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-crux-text-primary transition-colors">
              comfhutt.com
            </a>
          </div>
          <p>&copy; 2026 ComfHutt Technologies Pvt. Ltd.</p>
        </div>
        <p className="text-xs text-crux-text-muted text-center mt-6 max-w-xl mx-auto">
          CRUX is a research tool, not investment advice. Not SEBI registered.
        </p>
      </div>
    </footer>
  );
}
