"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 w-full p-4 z-50 transition-all duration-300 ease-in-out",
          isScrolled
            ? "bg-[#050505]/85 backdrop-blur-md border-b border-white/10"
            : "bg-transparent"
        )}
      >
        <nav className="container mx-auto max-w-7xl flex justify-between items-center px-2 md:px-4">
          <Link
            href="/"
            className="text-xl md:text-2xl font-bold tracking-tighter uppercase relative z-50 text-white"
            onClick={closeMobileMenu}
          >
            ComfHutt
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {["Problem", "Solution", "Validator", "Roadmap"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                {item}
              </Link>
            ))}
            <Link href="/dashboard" className="btn btn-secondary text-sm font-medium">
              Dashboard
            </Link>
          </div>

          <div className="hidden md:block">
            <Link href="/auth/signin" className="btn btn-primary text-sm font-medium">
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden z-50">
            <button
              onClick={toggleMobileMenu}
              className="text-white p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-8 h-8" />
              ) : (
                <Menu className="w-8 h-8" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
            className="fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 pt-20"
          >
            {["Problem", "Solution", "Validator", "Roadmap"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={closeMobileMenu}
                className="text-3xl font-semibold text-gray-200 hover:text-white transition-colors"
              >
                {item}
              </Link>
            ))}
            <Link
              href="/dashboard"
              onClick={closeMobileMenu}
              className="btn btn-secondary text-lg w-3/4 text-center"
            >
              Dashboard
            </Link>
            <Link href="/auth/signin" className="btn btn-primary text-lg w-3/4 text-center" onClick={closeMobileMenu}>
              Sign In
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}