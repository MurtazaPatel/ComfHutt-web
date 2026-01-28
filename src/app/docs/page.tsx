import React from "react";
import Link from "next/link";
import { Book, FileText, Download } from "lucide-react";

const documents = [
  {
    name: "Pitch Deck",
    href: "/docs/comfhutt-whitepaper#pitch-deck",
    icon: Download,
    description: "Investment breakdown, market analysis, and financial projections.",
  },
  {
    name: "Whitepaper",
    href: "/docs/comfhutt-whitepaper",
    icon: FileText,
    description: "Our SPV-backed fractional ownership model, AI Credibility Score, and legal framework.",
  },
  {
    name: "Terms of Use & Legal Disclosures",
    href: "/docs/terms-of-use",
    icon: Book,
    description: "This document governs the use of the ComfHutt platform and participation in fractional real estate ownership.",
  },
];

export default function DocsPage() {
  return (
    <div className="prose prose-slate max-w-none">
      <div className="mb-12 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Documentation</h1>
        <p className="text-xl text-gray-500">
          Explore our legal documents, whitepaper, and pitch deck.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc) => (
          <Link
            key={doc.name}
            href={doc.href}
            className="group block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-emerald-500 transition-all duration-300 no-underline"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                <doc.icon className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors duration-300 mt-0">
                {doc.name}
              </h2>
            </div>
            <p className="text-sm text-gray-600 m-0">{doc.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}