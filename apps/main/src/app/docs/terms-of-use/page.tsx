import React from "react";
import { Metadata } from 'next';
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use & Legal Disclosures | ComfHutt",
  description: "This document governs the use of the ComfHutt platform and participation in fractional real estate ownership.",
  alternates: {
    canonical: 'https://comfhutt.com/docs/terms-of-use',
  },
  openGraph: {
    title: "Terms of Use & Legal Disclosures | ComfHutt",
    description: "Official Terms of Use for the ComfHutt platform.",
    type: "article",
    url: "https://comfhutt.com/docs/terms-of-use",
  }
};

export default function TermsOfUsePage() {
  return (
    <div className="prose prose-slate max-w-none">
      {/* Title Section */}
      <div className="mb-12 border-b border-gray-200 pb-8">
        <div className="mb-4">
             <Link href="/" className="text-emerald-600 hover:text-emerald-800 font-medium text-sm no-underline hover:underline">
               ← Back to Home
             </Link>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Terms of Use & Legal Disclosures</h1>
        <p className="text-lg text-gray-500">
            This document governs the use of the ComfHutt platform and participation in fractional real estate ownership.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
           <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
             Effective Date: Jan 27, 2026
           </span>
        </div>
      </div>
      
      {/* Table of Contents */}
      <div className="bg-gray-50 rounded-xl p-6 mb-12 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Table of Contents</h3>
        <nav className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <a href="#introduction" className="text-emerald-600 hover:text-emerald-800 hover:underline">1. Introduction</a>
            <a href="#definitions" className="text-emerald-600 hover:text-emerald-800 hover:underline">2. Definitions</a>
            <a href="#nature-of-platform" className="text-emerald-600 hover:text-emerald-800 hover:underline">3. Nature of the Platform & Services</a>
            <a href="#legal-framework" className="text-emerald-600 hover:text-emerald-800 hover:underline">4. Legal & Regulatory Framework</a>
            <a href="#investment-structure" className="text-emerald-600 hover:text-emerald-800 hover:underline">5. Investment Structure & Disclaimers</a>
            <a href="#disclosures" className="text-emerald-600 hover:text-emerald-800 hover:underline">6. Disclosures, Transparency & Documentation</a>
            <a href="#investor-eligibility" className="text-emerald-600 hover:text-emerald-800 hover:underline">7. Investor Eligibility & AML/KYC</a>
            <a href="#secondary-market" className="text-emerald-600 hover:text-emerald-800 hover:underline">8. Secondary Market & Liquidity</a>
            <a href="#fees" className="text-emerald-600 hover:text-emerald-800 hover:underline">9. Fees & Charges</a>
            <a href="#intellectual-property" className="text-emerald-600 hover:text-emerald-800 hover:underline">10. Intellectual Property</a>
            <a href="#privacy" className="text-emerald-600 hover:text-emerald-800 hover:underline">11. Privacy & Data Protection</a>
            <a href="#limitation-of-liability" className="text-emerald-600 hover:text-emerald-800 hover:underline">12. Limitation of Liability</a>
            <a href="#indemnification" className="text-emerald-600 hover:text-emerald-800 hover:underline">13. Indemnification</a>
            <a href="#modification-of-terms" className="text-emerald-600 hover:text-emerald-800 hover:underline">14. Modification of Terms</a>
            <a href="#termination" className="text-emerald-600 hover:text-emerald-800 hover:underline">15. Termination</a>
            <a href="#governing-law" className="text-emerald-600 hover:text-emerald-800 hover:underline">16. Governing Law & Dispute Resolution</a>
            <a href="#severability" className="text-emerald-600 hover:text-emerald-800 hover:underline">17. Severability</a>
            <a href="#entire-agreement" className="text-emerald-600 hover:text-emerald-800 hover:underline">18. Entire Agreement</a>
        </nav>
      </div>

      <section id="introduction" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Introduction</h2>
        <p className="text-gray-700 leading-relaxed">1.1 These Terms of Use and Legal Disclosures (“Terms”) govern your access to and use of the services provided by ComfHutt Technologies Private Limited (“ComfHutt”, “we”, “our”, “us”) through the website, mobile app, or other digital interfaces (collectively the “Platform”).</p>
        <p className="text-gray-700 leading-relaxed">1.2 By accessing or using the Platform in any manner, you acknowledge that you have read, understood, and agree to be bound by these Terms.</p>
      </section>

      <section id="definitions" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Definitions</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li><strong>“Platform”:</strong> ComfHutt’s digital marketplace for fractional ownership in real estate via SPV share offerings.</li>
            <li><strong>“Property Entity / SPV”:</strong> A Special Purpose Vehicle or company that holds title to a specific real estate asset.</li>
            <li><strong>“Investor”:</strong> Any individual or entity participating in fractional ownership opportunities facilitated by the Platform.</li>
            <li><strong>“SEBI”:</strong> Securities and Exchange Board of India, the regulator of securities and capital markets in India.</li>
        </ul>
      </section>
      
      <section id="nature-of-platform" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Nature of the Platform & Services</h2>
        <p className="text-gray-700 leading-relaxed">3.1 ComfHutt is a technology platform and marketplace that connects investors with opportunities for fractional ownership in real estate assets through SPV equity share offerings.</p>
        <p className="text-gray-700 leading-relaxed">3.2 ComfHutt does not provide financial, legal, tax, or investment advice. All investment decisions are solely made by the Investor.</p>
        <p className="text-gray-700 leading-relaxed">3.3 ComfHutt does not act as a stock exchange, broker, investment manager, trustee, or custodian unless specifically agreed in writing.</p>
      </section>

      <section id="legal-framework" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Legal & Regulatory Framework</h2>
        <p className="text-gray-700 leading-relaxed">4.1 <strong>Fractional Ownership Is Legal but Evolving</strong> – Fractional ownership of real estate is practiced in India and investors can own fractions of property via SPVs under existing company and property laws. There is no specific standalone statute banning fractional ownership. However, the regulatory environment is actively evolving.</p>
        <h3 className="text-xl font-bold text-gray-900 my-4">4.2 SEBI Regulatory Context</h3>
        <p className="text-gray-700 leading-relaxed">4.2.1 The Securities and Exchange Board of India (SEBI) has proposed bringing Fractional Ownership Platforms (FOPs) under regulatory oversight through amendments and additions to REIT regulations (including the MSM REIT framework). These proposals intend to improve transparency, disclosures, and investor protection.</p>
        <p className="text-gray-700 leading-relaxed">4.2.2 SEBI’s consultation and amendments do not presently prohibit all fractional ownership structures; they focus on regulated formats such as Small & Medium REITs (SM REITs) for pooled, publicly accessible schemes.</p>
        <p className="text-gray-700 leading-relaxed">4.2.3 ComfHutt does not currently operate as a regulated SM REIT. ComfHutt structures offerings via SPVs under corporate law to avoid being classified as a public pooled investment scheme as defined under SEBI regulations.</p>
        <h3 className="text-xl font-bold text-gray-900 my-4">4.3 RERA and Property Law</h3>
        <p className="text-gray-700 leading-relaxed">4.3.1 Applicable provisions under the Real Estate (Regulation and Development) Act, 2016 (“RERA”) may apply to underlying properties if they are part of a RERA-registered project. Investors must independently verify RERA registration status for applicable properties.</p>
        <p className="text-gray-700 leading-relaxed">4.3.2 Compliance with RERA is separate from compliance with securities or company law.</p>
        <h3 className="text-xl font-bold text-gray-900 my-4">4.4 Companies Act & SPV Laws</h3>
        <p className="text-gray-700 leading-relaxed">4.4.1 Investments are facilitated through SPVs governed by the Companies Act, 2013. SPV compliance with directorship, shareholder limits, annual filings, and statutory compliance is required.</p>
        <p className="text-gray-700 leading-relaxed">4.4.2 If an SPV inadvertently breaches the maximum number of members permitted for private companies, separate compliance steps must be taken.</p>
      </section>

      <section id="investment-structure" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Investment Structure & Disclaimers</h2>
        <h3 className="text-xl font-bold text-gray-900 my-4">5.1 Ownership Structure</h3>
        <p className="text-gray-700 leading-relaxed">Investors acquire equity shares in the SPV that holds the property. This equity represents ownership rights in the SPV, not a direct title in the underlying real estate, unless otherwise specified.</p>
        <h3 className="text-xl font-bold text-gray-900 my-4">5.2 No Guarantees</h3>
        <p className="text-gray-700 leading-relaxed">ComfHutt does not guarantee investment returns, principal preservation, liquidity, valuation increases, rental income, or exit outcomes. Market conditions, tenant occupancy, legal issues, and regulatory changes can affect investment outcomes.</p>
        <h3 className="text-xl font-bold text-gray-900 my-4">5.3 Risk Acknowledgment</h3>
        <p className="text-gray-700 leading-relaxed">5.3.1 Fractional real estate investment carries risk including but not limited to valuation risk, liquidity risk, tenant risk, regulatory changes, property management risk, and legal title risk.</p>
        <p className="text-gray-700 leading-relaxed">5.3.2 Investors acknowledge that fractional ownership platforms may have limited regulatory oversight relative to fully regulated public investment products unless and until they migrate to regulated formats like SM REITs.</p>
        <h3 className="text-xl font-bold text-gray-900 my-4">5.4 No Investment Advice</h3>
        <p className="text-gray-700 leading-relaxed">Nothing on the Platform constitutes investment advice. Investors should consult their own legal, tax, and financial advisors before engaging in investment transactions.</p>
      </section>

      <section id="disclosures" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Disclosures, Transparency & Documentation</h2>
        <p className="text-gray-700 leading-relaxed">6.1 Each investment opportunity on the Platform will be accompanied by an offering document or investment memorandum that includes property details, SPV governance, fee structures, risk disclosures, and legal agreements.</p>
        <p className="text-gray-700 leading-relaxed">6.2 Investors must review and accept all such documents prior to investing.</p>
        <p className="text-gray-700 leading-relaxed">6.3 ComfHutt disclaims liability for inaccuracies in third-party documentation; Investors should conduct independent due diligence.</p>
      </section>

      <section id="investor-eligibility" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Investor Eligibility & AML/KYC</h2>
        <p className="text-gray-700 leading-relaxed">7.1 Investors must be at least 18 years old and comply with applicable Indian laws, including Know Your Customer (KYC) and Anti-Money Laundering (AML) rules.</p>
        <p className="text-gray-700 leading-relaxed">7.2 ComfHutt may refuse services or investments if KYC/AML screening is incomplete or fails.</p>
      </section>

      <section id="secondary-market" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Secondary Market & Liquidity</h2>
        <p className="text-gray-700 leading-relaxed">8.1 ComfHutt may provide mechanisms for secondary trading of SPV shares subject to terms specified per offering.</p>
        <p className="text-gray-700 leading-relaxed">8.2 Secondary sale availability is not guaranteed and depends on demand, investor agreement, and legal transfer conditions.</p>
      </section>

      <section id="fees" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Fees & Charges</h2>
        <p className="text-gray-700 leading-relaxed">9.1 ComfHutt may charge service fees, platform fees, transaction charges, or management fees as disclosed in investment documents.</p>
        <p className="text-gray-700 leading-relaxed">9.2 All fees are exclusive of applicable taxes.</p>
      </section>

      <section id="intellectual-property" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Intellectual Property</h2>
        <p className="text-gray-700 leading-relaxed">10.1 The ComfHutt platform, trademarks, software, content, and designs are owned by ComfHutt and protected under applicable IP laws.</p>
        <p className="text-gray-700 leading-relaxed">10.2 Users may not reproduce or distribute Platform content without written permission.</p>
      </section>

      <section id="privacy" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">11. Privacy & Data Protection</h2>
        <p className="text-gray-700 leading-relaxed">11.1 User data is governed by ComfHutt’s Privacy Policy, which outlines data collection, use, storage, and protection practices.</p>
      </section>

      <section id="limitation-of-liability" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">12. Limitation of Liability</h2>
        <p className="text-gray-700 leading-relaxed">12.1 To the maximum extent permitted under law, ComfHutt and its affiliates are not liable for any direct, indirect, consequential, incidental, punitive, or special damages arising out of Platform use, investments, or reliance on Platform information.</p>
      </section>

      <section id="indemnification" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">13. Indemnification</h2>
        <p className="text-gray-700 leading-relaxed">13.1 Users agree to indemnify and hold ComfHutt, its directors, officers, employees, and agents harmless from any claims, liabilities, losses, damages, costs, or expenses arising from use of the Platform, violation of these Terms, or engagement in any investment activity.</p>
      </section>

      <section id="modification-of-terms" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">14. Modification of Terms</h2>
        <p className="text-gray-700 leading-relaxed">14.1 ComfHutt may modify these Terms at any time. Continued use of the Platform after changes constitutes acceptance of updated Terms.</p>
      </section>

      <section id="termination" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">15. Termination</h2>
        <p className="text-gray-700 leading-relaxed">15.1 ComfHutt may suspend or terminate access to the Platform for breach of Terms, non-compliance, or at its sole discretion.</p>
      </section>

      <section id="governing-law" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">16. Governing Law & Dispute Resolution</h2>
        <p className="text-gray-700 leading-relaxed">16.1 These Terms shall be governed by the laws of India.</p>
        <p className="text-gray-700 leading-relaxed">16.2 Any dispute will be subject to the exclusive jurisdiction of courts in Ahmedabad, Gujarat, India.</p>
      </section>

      <section id="severability" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">17. Severability</h2>
        <p className="text-gray-700 leading-relaxed">17.1 If any clause is held invalid or unenforceable, the remaining provisions will remain in full force.</p>
      </section>

      <section id="entire-agreement" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">18. Entire Agreement</h2>
        <p className="text-gray-700 leading-relaxed">18.1 These Terms constitute the entire agreement between ComfHutt and the user regarding use of the Platform.</p>
      </section>

      <div className="text-center text-xs text-gray-400 py-8 mt-8 border-t border-gray-100">
        <p>This document is for informational purposes only and does not constitute financial advice.</p>
      </div>
    </div>
  );
}
