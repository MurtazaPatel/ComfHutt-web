"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import {cn} from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function Navbar({ user }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

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

  const isHomePage = pathname === "/";

  const getLinkHref = (anchor: string) => {
    if (isHomePage) {
      return `#${anchor}`;
    }
    return `/#${anchor}`;
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 w-full p-4 z-50 transition-all duration-300 ease-in-out",
          isScrolled || !isHomePage
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
                href={getLinkHref(item.toLowerCase())}
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="hidden md:block relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-white hover:text-white/80 transition-colors focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border border-white/20 overflow-hidden">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User"}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold">{user.name?.[0] || user.email?.[0] || "U"}</span>
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsProfileOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-white/10">
                          <p className="text-sm font-medium text-white truncate">{user.name}</p>
                          <p className="text-xs text-white/50 truncate">{user.email}</p>
                        </div>
                        <div className="p-1">
                          <Link 
                            href="/dashboard" 
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Link>
                          <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/auth/signin" className="btn btn-primary text-sm font-medium">
                Sign In
              </Link>
            )}
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
                href={getLinkHref(item.toLowerCase())}
                onClick={closeMobileMenu}
                className="text-3xl font-semibold text-gray-200 hover:text-white transition-colors"
              >
                {item}
              </Link>
            ))}
            
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className="text-3xl font-semibold text-blue-300 hover:text-blue-200 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    signOut({ callbackUrl: "/" });
                  }}
                  className="text-2xl font-medium text-red-400 hover:text-red-300 transition-colors mt-4"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                href="/auth/signin" 
                className="btn btn-primary text-lg w-3/4 text-center" 
                onClick={closeMobileMenu}
              >
                Sign In
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}