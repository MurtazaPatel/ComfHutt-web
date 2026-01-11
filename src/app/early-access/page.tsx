"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { VARIANTS } from "@/utils/animationUtils";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import { CheckCircle2, ChevronRight, Mail, User, Wallet, Building2, Target, AlertCircle } from "lucide-react";

type InvestmentIntent = "JUST_EXPLORING" | "INVEST_WITHIN_3_MONTHS" | "READY_TO_INVEST";
type InvestmentRange = "BELOW_10K" | "TEN_TO_FIFTY_K" | "FIFTY_K_TO_TWO_L" | "ABOVE_TWO_L";
type PropertyType = "RESIDENTIAL" | "COMMERCIAL" | "MIXED_USE";

type Step = 1 | 2 | 3 | 4 | 5;

export default function EarlyAccessPage() {
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    investmentIntent: "" as InvestmentIntent,
    expectedInvestmentRange: "" as InvestmentRange,
    preferredPropertyType: "" as PropertyType,
  });

  // Scroll to top of form container on step change for mobile
  useEffect(() => {
    if (formRef.current && step > 1) {
        const yOffset = -100; 
        const y = formRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [step]);

  const nextStep = () => setStep((s) => (s + 1) as Step);
  const prevStep = () => setStep((s) => (s - 1) as Step);

  const handleSubmit = async () => {
    if (isSubmitting) return; 
    
    setIsSubmitting(true);
    setError(null);
    try {
      console.log("[Early Access] Submitting data...");
      const response = await fetch("/api/early-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          preferredPropertyType: formData.preferredPropertyType || undefined,
          source: "website",
        }),
      });

      const result = await response.json();
      console.log("[Early Access] Response:", result);

      if (response.ok && result.success) {
        setStep(5);
      } else {
        setError(result.error || "We couldn't submit your request right now. Please try again.");
      }
    } catch (e) {
      console.error("[Early Access] Fetch error:", e);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={VARIANTS.slideUp}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Let's start with the basics</h2>
              <p className="text-sm md:text-base text-gray-500">How should we reach you?</p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  inputMode="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-base"
                  required
                />
              </div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-base"
                />
              </div>
            </div>
            <button
              onClick={nextStep}
              disabled={!formData.email.includes("@") || formData.email.length < 5}
              className="w-full py-4 bg-black text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] touch-manipulation min-h-[56px]"
            >
              Continue <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={VARIANTS.slideUp}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Your investment intent?</h2>
              <p className="text-sm md:text-base text-gray-500">Help us understand your timeline.</p>
            </div>
            <div className="grid gap-3">
              {[
                { id: "JUST_EXPLORING" as const, label: "Just exploring", icon: <Target className="w-5 h-5" /> },
                { id: "INVEST_WITHIN_3_MONTHS" as const, label: "In the next 3 months", icon: <Wallet className="w-5 h-5" /> },
                { id: "READY_TO_INVEST" as const, label: "Ready to invest now", icon: <CheckCircle2 className="w-5 h-5" /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setFormData({ ...formData, investmentIntent: item.id });
                    nextStep();
                  }}
                  className={`flex items-center gap-4 p-4 md:p-5 rounded-2xl border-2 transition-all text-left active:scale-[0.98] touch-manipulation ${
                    formData.investmentIntent === item.id
                      ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                      : "border-gray-100 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className={`p-2 rounded-lg flex-shrink-0 ${formData.investmentIntent === item.id ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                    {item.icon}
                  </div>
                  <span className="font-medium text-base">{item.label}</span>
                </button>
              ))}
            </div>
            <button onClick={prevStep} className="w-full text-gray-400 text-sm py-2 hover:text-gray-600 transition-all text-center">Go Back</button>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={VARIANTS.slideUp}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Expected investment range?</h2>
              <p className="text-sm md:text-base text-gray-500">Select your comfortable starting point.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: "BELOW_10K" as const, label: "Below ₹10k" },
                { id: "TEN_TO_FIFTY_K" as const, label: "₹10k – ₹50k" },
                { id: "FIFTY_K_TO_TWO_L" as const, label: "₹50k – ₹2L" },
                { id: "ABOVE_TWO_L" as const, label: "₹2L+" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setFormData({ ...formData, expectedInvestmentRange: item.id });
                    nextStep();
                  }}
                  className={`p-5 md:p-6 rounded-2xl border-2 transition-all text-center active:scale-[0.98] touch-manipulation ${
                    formData.expectedInvestmentRange === item.id
                      ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                      : "border-gray-100 hover:border-gray-300 bg-white"
                  }`}
                >
                  <span className="font-bold text-base md:text-lg">{item.label}</span>
                </button>
              ))}
            </div>
            <button onClick={prevStep} className="w-full text-gray-400 text-sm py-2 hover:text-gray-600 transition-all text-center">Go Back</button>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            key="step4"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={VARIANTS.slideUp}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Preferred property type?</h2>
              <p className="text-sm md:text-base text-gray-500">This helps us curate our launch portfolio.</p>
            </div>
            <div className="grid gap-3">
              {[
                { id: "RESIDENTIAL" as const, label: "Residential", icon: <Building2 className="w-5 h-5" /> },
                { id: "COMMERCIAL" as const, label: "Commercial", icon: <Building2 className="w-5 h-5" /> },
                { id: "MIXED_USE" as const, label: "Mixed Use", icon: <Building2 className="w-5 h-5" /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFormData({ ...formData, preferredPropertyType: item.id })}
                  className={`flex items-center gap-4 p-4 md:p-5 rounded-2xl border-2 transition-all text-left active:scale-[0.98] touch-manipulation ${
                    formData.preferredPropertyType === item.id
                      ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                      : "border-gray-100 hover:border-gray-300 bg-white"
                  }`}
                >
                   <div className={`p-2 rounded-lg flex-shrink-0 ${formData.preferredPropertyType === item.id ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                    {item.icon}
                  </div>
                  <span className="font-medium text-base">{item.label}</span>
                </button>
              ))}
            </div>
            
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4 pt-2">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-4 bg-black text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 active:scale-[0.98] touch-manipulation min-h-[56px]"
              >
                {isSubmitting ? "Processing..." : "Request Early Access"}
              </button>
              <p className="text-[10px] md:text-xs text-center text-gray-400 uppercase tracking-tight">
                We’ll only reach out when early access opens.
              </p>
            </div>
            <button onClick={prevStep} className="w-full text-gray-400 text-sm py-2 hover:text-gray-600 transition-all text-center">Go Back</button>
          </motion.div>
        );
      case 5:
        return (
          <motion.div
            key="success"
            initial="hidden"
            animate="visible"
            variants={VARIANTS.slideUp}
            className="text-center space-y-6 py-12"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div className="space-y-3 px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">You're on the list!</h2>
              <p className="text-base md:text-lg text-gray-500 max-w-sm mx-auto leading-relaxed">
                Thank you for your interest. You're on the early access list. We'll reach out soon.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/"
                className="inline-block px-10 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-black transition-all active:scale-[0.98] touch-manipulation min-h-[56px]"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <LandingNavbar />
      <div className="flex-1 flex items-center justify-center p-4 md:p-6 pt-24 md:pt-32 pb-20">
        <div ref={formRef} className="w-full max-w-lg mx-auto">
          {/* Progress Bar */}
          {step < 5 && (
            <div className="mb-8 md:mb-12 px-2">
              <div className="flex justify-between text-[10px] md:text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                <span>Step {step} of 4</span>
                <span>{Math.round((step / 4) * 100)}% Complete</span>
              </div>
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / 4) * 100}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
              </div>
            </div>
          )}

          <div className="mb-6 md:mb-8 text-center px-2">
             {step < 5 && (
               <>
                 <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">Get early access</h1>
                 <p className="text-sm md:text-base text-gray-500 leading-relaxed">Help us understand you better so we can prioritize access.</p>
               </>
             )}
          </div>

          <div className="bg-white/50 backdrop-blur-sm p-1 md:p-2 rounded-3xl">
             <AnimatePresence mode="wait">
              {renderStep()}
             </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
