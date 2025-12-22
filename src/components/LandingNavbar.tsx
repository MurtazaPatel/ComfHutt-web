"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { redirectToChoices } from "@/utils/navigation";

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const router = useRouter();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100"
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="flex items-center">
        <Link href="/" className="block" aria-label="ComfHutt Home">
          <Image
            src="/brand/comfhutt-logo.svg"
            alt="ComfHutt"
            width={160}
            height={32}
            className="h-6 w-auto md:h-8"
            priority
          />
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
        <Link href="#how-it-works" className="hover:text-black transition-colors">
          How It Works
        </Link>
        <Link href="#owners" className="hover:text-black transition-colors">
          Owners
        </Link>
        <Link href="/docs" className="hover:text-black transition-colors">
          Docs
        </Link>
        <Link href="/marketplace" className="hover:text-black transition-colors">
          Marketplace
        </Link>
      </div>

      <div className="hidden md:block">
        <button
          onClick={() => redirectToChoices(router)}
          className="bg-black text-white px-5 py-2.5 text-sm font-medium rounded-full hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          GET STARTED
        </button>
      </div>

      <div className="md:hidden flex items-center">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-900 focus:outline-none p-2"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg overflow-hidden md:hidden flex flex-col"
          >
            <div className="flex flex-col p-6 space-y-4">
              <Link
                href="#how-it-works"
                className="text-lg font-medium text-gray-700 hover:text-black transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#owners"
                className="text-lg font-medium text-gray-700 hover:text-black transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Owners
              </Link>
              <Link
                href="/docs"
                className="text-lg font-medium text-gray-700 hover:text-black transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Docs
              </Link>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    redirectToChoices(router);
                  }}
                  className="block w-full bg-black text-white text-center px-5 py-3 text-lg font-medium rounded-full hover:bg-gray-800 transition-colors"
                >
                  GET STARTED
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}