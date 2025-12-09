"use client";

import React from "react";
import { Download, FileText, CheckCircle, AlertTriangle, Shield, TrendingUp, Lock } from "lucide-react";
import Link from "next/link";

export default function WhitepaperPage() {
  return (
    <div className="prose prose-slate max-w-none">
      {/* Title Section */}
      <div className="mb-12 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">ComfHutt Whitepaper</h1>
        <p className="text-xl text-gray-500 font-medium">“Your piece. Your power.”</p>
        <div className="mt-6 flex flex-wrap gap-4">
           <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
             v1.0 Public Edition
           </span>
           <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
             Updated Dec 2025
           </span>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="bg-gray-50 rounded-xl p-6 mb-12 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Table of Contents</h3>
        <nav className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <a href="#overview" className="text-emerald-600 hover:text-emerald-800 hover:underline">1. Overview</a>
          <a href="#problem-space" className="text-emerald-600 hover:text-emerald-800 hover:underline">2. Problem Space</a>
          <a href="#solution" className="text-emerald-600 hover:text-emerald-800 hover:underline">3. ComfHutt Solution</a>
          <a href="#ai-score" className="text-emerald-600 hover:text-emerald-800 hover:underline">4. AI Credibility Score</a>
          <a href="#ownership" className="text-emerald-600 hover:text-emerald-800 hover:underline">5. Ownership & Legal</a>
          <a href="#trust" className="text-emerald-600 hover:text-emerald-800 hover:underline">6. Trust & Audit Controls</a>
          <a href="#business-model" className="text-emerald-600 hover:text-emerald-800 hover:underline">7. Business Model</a>
          <a href="#roadmap" className="text-emerald-600 hover:text-emerald-800 hover:underline">8. Roadmap</a>
          <a href="#governance" className="text-emerald-600 hover:text-emerald-800 hover:underline">9. Governance & Safety</a>
          <a href="#pitch-deck" className="text-emerald-600 hover:text-emerald-800 hover:underline font-bold">10. Pitch Deck</a>
        </nav>
      </div>

      {/* 1. Overview */}
      <section id="overview" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Overview</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          ComfHutt is a fractional real-estate investment ecosystem designed for retail investors seeking transparent, low-ticket access to high-quality properties.
          We combine SPV-backed legal ownership, fractional tokens, continuous AI-driven credibility scoring, and an integrated rental + resale marketplace into a unified, trust-centered investment infrastructure.
        </p>
        
        <div className="bg-white border border-emerald-100 rounded-lg p-6 shadow-sm">
          <h4 className="font-semibold text-emerald-900 mb-4">Key Pillars</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Legally enforceable ownership via SPVs",
              "Low minimum investment (starts at ₹5,000)",
              "Real-time AI property scoring",
              "Audited smart contracts",
              "On-chain proof of documents",
              "Integrated liquidity & rental income"
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Problem Space */}
      <section id="problem-space" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Problem Space</h2>
        <p className="text-gray-700 mb-6">
          For millions of middle-class and Gen-Z investors, real estate investment is blocked by three systemic issues:
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4 text-red-600">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">High Ticket Sizes</h3>
            <p className="text-sm text-gray-600">Buying even the smallest property requires large capital and long lock-ins, making it inaccessible for most.</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4 text-orange-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Opaque Processes</h3>
            <p className="text-sm text-gray-600">Title uncertainty, developer credibility issues, and hidden paperwork risks erode investor confidence.</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">No Real-Time Data</h3>
            <p className="text-sm text-gray-600">Investors remain blind to evolving locality dynamics, market shifts, or risk levels after purchase.</p>
          </div>
        </div>
      </section>

      {/* 3. Solution */}
      <section id="solution" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">3. The ComfHutt Solution</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs">1</span>
              Legal Ownership via SPV
            </h3>
            <p className="text-gray-700 pl-8">
              Each property is held under a dedicated Special Purpose Vehicle (SPV). Investors buy SPV shares, representing direct legal ownership. These shares are wrapped into digital tokens for fluid management, ensuring legal rights are always protected.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs">2</span>
              Fractional Access
            </h3>
            <p className="text-gray-700 pl-8">
              Investors can purchase micro-shares of premium real estate starting from ₹5,000, enabling diversification across multiple properties instead of concentration in one asset.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs">3</span>
              Integrated Marketplace
            </h3>
            <p className="text-gray-700 pl-8">
              A unified platform for primary purchases, secondary trading, and rental income distribution. This drives liquidity—a feature historically absent in traditional real estate.
            </p>
          </div>
        </div>
      </section>

      {/* 4. AI Score */}
      <section id="ai-score" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">4. AI Credibility Score Engine</h2>
        <p className="text-gray-700 mb-6">
            Our proprietary scoring engine (0–100) analyzes properties across multiple dimensions to provide a dynamic health check.
        </p>

        <div className="overflow-hidden border border-gray-200 rounded-xl mb-6">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Dimension</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">What it Analyzes</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Locality Signals</td>
                        <td className="px-6 py-4 text-sm text-gray-500">Demand trends, infrastructure growth, mobility access</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Developer Reputation</td>
                        <td className="px-6 py-4 text-sm text-gray-500">Historical delivery, litigation patterns, completion reliability</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Legal Health</td>
                        <td className="px-6 py-4 text-sm text-gray-500">Title clarity, documentation completeness, regulatory compliance</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Valuation Metrics</td>
                        <td className="px-6 py-4 text-sm text-gray-500">Price-to-market benchmarks, comparable sales, rental-yield strength</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Risk Inputs</td>
                        <td className="px-6 py-4 text-sm text-gray-500">Macroeconomic changes, sentiment shifts, regulatory alerts</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p className="text-sm text-gray-500 italic border-l-4 border-gray-200 pl-4">
            * Properties undergo scheduled rescoring. Significant events (e.g., new infrastructure) trigger instant alerts for investors.
        </p>
      </section>

      {/* 5. Ownership & Legal */}
      <section id="ownership" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Ownership & Legal Framework</h2>
        <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 space-y-4">
                <h3 className="font-bold text-gray-900">The SPV Model</h3>
                <ul className="space-y-2 text-gray-700 list-disc pl-5">
                    <li><strong>Entity:</strong> Each property is owned by a unique Special Purpose Vehicle (Private Limited Company or LLP).</li>
                    <li><strong>Shareholding:</strong> Investors hold shares in this SPV, ensuring direct legal recourse.</li>
                    <li><strong>Token Mirroring:</strong> Tokens on the blockchain mirror these shares 1:1 for digital management.</li>
                </ul>
            </div>
            <div className="flex-1 bg-gray-50 p-6 rounded-xl border border-gray-200">
                 <h3 className="font-bold text-gray-900 mb-2">Smart Contract Role</h3>
                 <p className="text-sm text-gray-600 mb-4">
                     Audited smart contracts handle escrow, token minting, and the automatic distribution of rental yields and sales proceeds.
                 </p>
                 <div className="text-xs font-mono bg-gray-200 p-2 rounded text-gray-600">
                    // Example Logic<br/>
                    if (rental_income_received) &#123;<br/>
                    &nbsp;&nbsp;distribute_to(token_holders);<br/>
                    &#125;
                 </div>
            </div>
        </div>
      </section>

      {/* 6. Trust & Audit */}
      <section id="trust" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Trust & Audit Controls</h2>
        <p className="text-gray-700 mb-6">We eliminate information asymmetry through four layers of verification:</p>
        
        <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-gray-200 p-4 rounded-lg">
                <Shield className="w-6 h-6 text-emerald-600 mb-2" />
                <h4 className="font-bold text-gray-900">On-Chain Document Hashing</h4>
                <p className="text-sm text-gray-600 mt-1">Legal summaries and audits are hashed on-chain to prove immutability and timestamp authenticity.</p>
            </div>
             <div className="border border-gray-200 p-4 rounded-lg">
                <FileText className="w-6 h-6 text-emerald-600 mb-2" />
                <h4 className="font-bold text-gray-900">Independent Legal Opinions</h4>
                <p className="text-sm text-gray-600 mt-1">External law firms provide validity checks on the SPV structure for every asset.</p>
            </div>
             <div className="border border-gray-200 p-4 rounded-lg">
                <CheckCircle className="w-6 h-6 text-emerald-600 mb-2" />
                <h4 className="font-bold text-gray-900">Smart Contract Audits</h4>
                <p className="text-sm text-gray-600 mt-1">Public summary reports covering security vulnerabilities, logic flaws, and attack surface analysis.</p>
            </div>
             <div className="border border-gray-200 p-4 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600 mb-2" />
                <h4 className="font-bold text-gray-900">Score Transparency</h4>
                <p className="text-sm text-gray-600 mt-1">We publish breakdown charts and explainers for credibility scores to prevent "black box" distrust.</p>
            </div>
        </div>
      </section>

      {/* 7. Business Model */}
      <section id="business-model" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Business Model</h2>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <ul className="space-y-4">
                <li className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <span className="font-medium text-gray-900">Sourcing Fee</span>
                    <span className="text-gray-500 text-sm">Added to property acquisition cost</span>
                </li>
                 <li className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <span className="font-medium text-gray-900">Platform Fee</span>
                    <span className="text-gray-500 text-sm">On primary transactions and resales</span>
                </li>
                 <li className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <span className="font-medium text-gray-900">Management Fee</span>
                    <span className="text-gray-500 text-sm">Recurring fee for SPV operations</span>
                </li>
                 <li className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <span className="font-medium text-gray-900">Rental Spread</span>
                    <span className="text-gray-500 text-sm">Operational margin on rental management</span>
                </li>
            </ul>
        </div>
      </section>

      {/* 8. Roadmap */}
      <section id="roadmap" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Roadmap</h2>
        <div className="relative border-l-2 border-emerald-100 ml-3 space-y-10">
            <div className="pl-6 relative">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></span>
                <h4 className="font-bold text-gray-900 text-lg">Phase 1: Foundation</h4>
                <p className="text-gray-600 mt-1">SPV legal framework finalized. Smart contract architecture drafted. AI Credibility Score v1 deployed. Hero properties shortlisted.</p>
            </div>
             <div className="pl-6 relative">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-200 border-2 border-white"></span>
                <h4 className="font-bold text-gray-900 text-lg">Phase 2: Pilot</h4>
                <p className="text-gray-600 mt-1">Launch 1–3 properties. Onboard rental partners. Publish third-party audits. Close first investor cohorts.</p>
            </div>
             <div className="pl-6 relative">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-gray-200 border-2 border-white"></span>
                <h4 className="font-bold text-gray-900 text-lg">Phase 3: Scale</h4>
                <p className="text-gray-600 mt-1">Expand to Tier 1 & 2 cities. Release mobile app. Introduce automated resale matching. Explore DeFi integrations.</p>
            </div>
        </div>
      </section>

      {/* 9. Governance */}
      <section id="governance" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Governance & Safety Nets</h2>
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-6">
            <h4 className="font-bold text-orange-900 flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5" /> What happens if ComfHutt shuts down?
            </h4>
            <p className="text-orange-900/80 mb-4">
                Investors maintain legal ownership regardless of platform status.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-orange-900/80 text-sm">
                <li>The SPV remains active and legally valid.</li>
                <li>Investors retain their equity shares.</li>
                <li>Assets remain legally protected and independent of ComfHutt's corporate entity.</li>
            </ul>
        </div>
      </section>

      {/* 10. Pitch Deck */}
      <section id="pitch-deck" className="mb-24 scroll-mt-24 pt-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-black text-white p-8 rounded-2xl shadow-xl">
            <div>
                <h2 className="text-2xl font-bold mb-2 text-white">Download Pitch Deck</h2>
                <p className="text-gray-400 max-w-lg">
                    Get the full investment breakdown, including detailed market analysis, competitive landscape, and financial projections.
                </p>
            </div>
            <div>
                <a 
                    href="/docs/PitchDeck.pptx" 
                    download
                    className="flex items-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-emerald-900/20"
                >
                    <Download className="w-5 h-5" />
                    Download Deck (PPTX)
                </a>
            </div>
        </div>
      </section>
      
      {/* Footer Note */}
      <div className="text-center text-xs text-gray-400 py-8 border-t border-gray-100">
        <p>This document is for informational purposes only and does not constitute financial advice.</p>
      </div>
    </div>
  );
}