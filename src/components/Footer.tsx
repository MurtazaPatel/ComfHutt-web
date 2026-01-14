"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="/brand/comfhutt-logo.svg"
                alt="ComfHutt"
                width={140}
                height={28}
                className="h-6 w-auto"
              />
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
              <li><Link href="#faq" className="hover:text-black transition-colors py-1 block">FAQs</Link></li>
              <li><Link href="/choices" className="hover:text-black transition-colors py-1 block">Get Started</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/docs/comfhutt-whitepaper" className="hover:text-black transition-colors py-1 block">Whitepaper</Link></li>
              <li><Link href="/docs" className="hover:text-black transition-colors py-1 block">Docs</Link></li>
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
          <div className="text-xs text-gray-400">
            <p>&copy; {new Date().getFullYear()} ComfHutt Technologies Private Limited. All rights reserved.</p>
            <p className="mt-1">Designed & Developed in India 🇮🇳</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="https://www.instagram.com/comfhutt/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </Link>
            <Link href="https://www.linkedin.com/company/comfhutt/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </Link>
          </div>

          <div className="flex items-center space-x-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <Lock className="w-3 h-3" />
            <span className="font-mono">0x71C...9A23 (Verified)</span>
          </div>
        </div>
        
        <div className="mt-8 text-[10px] text-gray-400 text-center max-w-3xl mx-auto leading-relaxed border-t border-gray-50 pt-6">
           <p className="mb-2 font-semibold">Legal Disclaimer</p>
           ComfHutt Technologies Pvt Ltd operates as a technology platform connecting investors with fractional real estate opportunities. We are not a registered stock exchange or asset management company. 
           All investments involve risk, including the potential loss of principal. Past performance of any asset or projection is not a guarantee of future results. 
           Liquidity is offered via our secondary marketplace but is not guaranteed at any specific time. 
           Please read our <Link href="/docs/comfhutt-whitepaper" className="underline hover:text-gray-600">Whitepaper</Link> and <Link href="/legal" className="underline hover:text-gray-600">Terms of Use</Link> carefully before investing.
        </div>
      </div>
    </footer>
  );
}