"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  user?: any;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 w-full z-50 bg-white border-b border-gray-200 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-between">
        
        {/* LEFT SECTION: BRAND */}
        <Link href="/" className="z-50 relative block">
          <Image
            src="/brand/comfhutt-logo.svg"
            alt="ComfHutt"
            width={160}
            height={32}
            className="h-6 w-auto md:h-8"
            priority
          />
        </Link>

        {/* MIDDLE: LINKS (DESKTOP) */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-black">
          {pathname === "/" && (
            <Link
              href="/marketplace"
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
            >
              Marketplace
            </Link>
          )}

          <Link
            href="/marketplace"
            className={`hover:text-emerald-600 transition-colors ${pathname === "/" ? "hidden" : ""}`}
          >
            Marketplace
          </Link>

          <Link
            href="/dashboard"
            className="hover:text-emerald-600 transition-colors"
          >
            Dashboard
          </Link>
          
          <Link
            href="/docs"
            className="hover:text-emerald-600 transition-colors"
          >
            Docs
          </Link>
        </div>

        {/* RIGHT SECTION: USER OR SIGN-IN (DESKTOP) */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-sm font-semibold text-black">
                {user.name || "User"}
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {/* DROPDOWN */}
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Settings
                </Link>
                <Link
                  href="/auth/signout"
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </Link>
              </div>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-black text-white hover:bg-gray-900 transition"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden z-50">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-0 top-0 bg-white z-40 md:hidden flex flex-col pt-24 px-6"
          >
             <div className="flex flex-col space-y-6 text-lg font-medium text-gray-900">
                <Link
                  href="/marketplace"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 border-b border-gray-100"
                >
                  Marketplace
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 border-b border-gray-100"
                >
                  Dashboard
                </Link>
                <Link
                  href="/docs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 border-b border-gray-100"
                >
                  Docs
                </Link>
                
                <div className="pt-4">
                  {user ? (
                    <div className="flex flex-col space-y-4">
                      <div className="font-semibold text-gray-500 text-sm uppercase tracking-wider">
                        {user.name || "Account"}
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-gray-600"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-gray-600"
                      >
                        Settings
                      </Link>
                      <Link
                        href="/auth/signout"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-red-600"
                      >
                        Sign Out
                      </Link>
                    </div>
                  ) : (
                     <Link
                        href="/auth/signin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full text-center py-3 bg-black text-white rounded-xl font-bold"
                     >
                       Sign In
                     </Link>
                  )}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}