"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "What is fractional real estate investing?",
    answer: "Fractional real estate investing allows multiple investors to pool capital and collectively own a high-value property. At ComfHutt, you can start investing with as little as ₹10,000, owning a share of the property and earning proportional rental income.",
  },
  {
    question: "How does ComfHutt work?",
    answer: "You browse vetted properties, purchase fractional shares, and become a legal co-owner via a Special Purpose Vehicle (SPV). ComfHutt manages the property, collects rent, and distributes your share of the income monthly. You can also sell your shares on our marketplace.",
  },
  {
    question: "How is ComfHutt different from traditional real estate investing?",
    answer: "Traditional real estate requires large capital, extensive paperwork, and has low liquidity. ComfHutt offers low entry costs (₹10,000), verified assets, digital management, and a secondary marketplace for easier exits (subject to market demand).",
  },
  {
    question: "Is ComfHutt legally compliant in India?",
    answer: "Yes. Each property is held in a private limited company or LLP (Special Purpose Vehicle). When you invest, you are purchasing shares in that SPV, giving you direct, legally enforceable ownership rights under the Companies Act, 2013.",
  },
  {
    question: "What are the risks involved?",
    answer: "Real estate investments carry risks including market fluctuations, vacancy periods, and potential loss of capital. While ComfHutt uses an AI Credibility Score to vet assets, returns are not guaranteed. Investors should diversify and read all offer documents carefully.",
  },
  {
    question: "How does rental income distribution work?",
    answer: "Rent collected from tenants is deposited into the SPV's account. After deducting property management and maintenance fees, the net rental income is distributed to investors' bank accounts on a monthly basis.",
  },
  {
    question: "Can investors exit their investment?",
    answer: "Yes. You can list your fractional shares for sale on the ComfHutt secondary marketplace. Once a buyer is found and the transaction settles, your ownership is transferred and you receive the funds.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500">
            Clear answers to your questions about fractional ownership.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {FAQS.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white border border-gray-200 rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-emerald-600 transition-colors py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
