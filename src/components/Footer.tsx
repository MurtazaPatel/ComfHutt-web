"use client";

import React from "react";
import Link from "next/link";
import { Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-xl font-bold text-black tracking-tight mb-4 inline-block">
              COMFHUTT
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Making real estate investment accessible, transparent, and liquid for everyone.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="#how-it-works" className="hover:text-black transition-colors py-1 block">How It Works</Link></li>
              <li><Link href="#owners" className="hover:text-black transition-colors py-1 block">For Owners</Link></li>
              <li><Link href="/choices" className="hover:text-black transition-colors py-1 block">Get Started</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/docs" className="hover:text-black transition-colors py-1 block">Docs</Link></li>
              <li><Link href="/whitepaper" className="hover:text-black transition-colors py-1 block">Whitepaper</Link></li>
              <li><Link href="/audit-summary" className="hover:text-black transition-colors py-1 block">Audit Summary</Link></li>
              <li><Link href="/legal" className="hover:text-black transition-colors py-1 block">Public Legal Summary</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/contact" className="hover:text-black transition-colors py-1 block">Contact</Link></li>
              <li><Link href="/careers" className="hover:text-black transition-colors py-1 block">Careers</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} ComfHutt. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <Lock className="w-3 h-3" />
            <span className="font-mono">0x71C...9A23 (Verified)</span>
          </div>
        </div>
        
        <div className="mt-8 text-[10px] text-gray-400 text-center max-w-3xl mx-auto leading-relaxed">
           Disclaimer: Fractional property tokens involve risk. Past performance does not guarantee future results. All yield estimates are projections based on current market data and are not guaranteed. Please read our <Link href="/legal" className="underline hover:text-gray-600">Public Legal Summary</Link> before investing.
        </div>
      </div>
    </footer>
  );
}