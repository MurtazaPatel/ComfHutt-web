"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Book, FileText, Download, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    {
      title: "Overview",
      items: [
        { name: "Whitepaper", href: "/docs/comfhutt-whitepaper", icon: FileText },
      ],
    },
    {
      title: "Resources",
      items: [
        { name: "Pitch Deck", href: "/docs/comfhutt-whitepaper#pitch-deck", icon: Download },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-30">
        <span className="font-bold text-gray-900 flex items-center gap-2">
          <Book className="w-5 h-5 text-emerald-600" /> Documentation
        </span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:h-auto md:min-h-screen
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-full overflow-y-auto p-6">
          <div className="hidden md:flex items-center gap-2 mb-8 text-emerald-600">
            <Book className="w-6 h-6" />
            <span className="font-bold text-lg text-gray-900">Docs</span>
          </div>

          <nav className="space-y-8">
            {navItems.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`
                            flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                            ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }
                          `}
                        >
                          <item.icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-gray-400"}`} />
                          {item.name}
                          {isActive && <ChevronRight className="w-3 h-3 ml-auto text-emerald-500" />}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
          
          <div className="mt-10 pt-6 border-t border-gray-100">
            <Link 
                href="/" 
                className="text-sm text-gray-500 hover:text-emerald-600 flex items-center gap-2 transition-colors"
            >
                ← Back to Home
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-10 md:py-16">
            {children}
        </div>
      </main>
    </div>
  );
}