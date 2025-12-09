"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Loader2, Building2, TrendingUp } from "lucide-react";
import { choiceSchema, ChoiceInput } from "@/lib/validations/choices";

/**
 * ChoicesCard Component
 * 
 * A multi-step form card for collecting user intent and lead info.
 * Designed with "minimal, luxe" aesthetic.
 * 
 * Steps:
 * 1. Intent Selection (Invest vs List)
 * 2. NPS / Score (Product validation)
 * 3. Details (Name, Email)
 * 4. Success State
 */

const STEPS = [
  { id: "intent", title: "Your Goal" },
  { id: "nps", title: "Quick Check" },
  { id: "details", title: "Final Step" },
];

export default function ChoicesCard() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<ChoiceInput>({
    resolver: zodResolver(choiceSchema),
    defaultValues: {
      nps: 8, // Default optimistic score
    },
  });

  const intent = watch("intent");
  const npsValue = watch("nps");

  const nextStep = async () => {
    let isValid = false;
    if (step === 0) isValid = await trigger("intent");
    if (step === 1) isValid = await trigger("nps");

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const onSubmit = async (data: ChoiceInput) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/choices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Submission failed");
      
      // Emit analytics event (mock)
      console.log("Analytics: choices.submitted", data);
      
      setIsSuccess(true);

      // Redirect to marketplace after short delay
      setTimeout(() => {
        window.location.href = "/marketplace";
      }, 2000);

    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[540px] bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center"
      >
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">You're on the list.</h3>
        <p className="text-gray-500 mb-8">
          We've received your preferences. Redirecting you to the live marketplace preview...
        </p>
        <button
          onClick={() => window.location.href = "/marketplace"}
          className="px-6 py-3 bg-gray-900 text-white font-medium rounded-full hover:bg-black transition-colors"
        >
          Go to Marketplace Now
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-[540px] bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-white/50 backdrop-blur-sm p-8 md:p-10 relative overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 h-1 bg-gray-50 w-full">
        <motion.div
          className="h-full bg-emerald-500"
          initial={{ width: "0%" }}
          animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase">Step 1 of 3</span>
                <h2 className="text-3xl font-bold text-gray-900">What's your primary goal?</h2>
                <p className="text-gray-500">Help us tailor your experience.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setValue("intent", "invest")}
                  className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left group hover:border-emerald-200 ${
                    intent === "invest"
                      ? "border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500"
                      : "border-gray-100 bg-white"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-colors ${
                    intent === "invest" ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500 group-hover:bg-emerald-50 group-hover:text-emerald-500"
                  }`}>
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Invest</h3>
                  <p className="text-sm text-gray-500">Buy fractional ownership in premium assets.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setValue("intent", "list-property")}
                  className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left group hover:border-blue-200 ${
                    intent === "list-property"
                      ? "border-blue-500 bg-blue-50/30 ring-1 ring-blue-500"
                      : "border-gray-100 bg-white"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-colors ${
                    intent === "list-property" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500"
                  }`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">List Property</h3>
                  <p className="text-sm text-gray-500">Unlock liquidity for your real estate.</p>
                </button>
              </div>
              {errors.intent && (
                <p role="alert" className="text-red-500 text-sm text-center">{errors.intent.message}</p>
              )}
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase">Step 2 of 3</span>
                <h2 className="text-3xl font-bold text-gray-900">How likely are you to use ComfHutt?</h2>
                <p className="text-gray-500">0 = Not likely, 10 = Definitely</p>
              </div>

              <div className="pt-8 pb-4 px-2">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    {...register("nps", { valueAsNumber: true })}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  />
                  <div className="flex justify-between mt-4">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                      <div key={val} className="flex flex-col items-center gap-1">
                         <div className={`w-1 h-1 rounded-full ${val === npsValue ? 'bg-emerald-600 scale-150' : 'bg-gray-300'}`} />
                         <span className={`text-[10px] font-medium ${val === npsValue ? 'text-emerald-700' : 'text-gray-400'}`}>
                           {val}
                         </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center mt-6">
                  <span className="text-4xl font-bold text-emerald-600">{npsValue}</span>
                  <span className="text-gray-400 text-lg">/10</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase">Final Step</span>
                <h2 className="text-3xl font-bold text-gray-900">Where should we send your invite?</h2>
                <p className="text-gray-500">No spam, just access.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700 ml-1">Name (Optional)</label>
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    placeholder="jane@example.com"
                  />
                  {errors.email && (
                    <p role="alert" className="text-red-500 text-sm ml-1">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 flex justify-end">
          {step < 2 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white font-medium rounded-full hover:bg-black transition-all hover:gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={step === 0 && !intent}
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-medium rounded-full hover:bg-emerald-700 transition-all hover:shadow-lg hover:shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed min-w-[140px] justify-center"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get Access"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}