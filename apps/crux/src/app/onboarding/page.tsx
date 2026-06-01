"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useCruxUser } from "@/hooks/useCruxUser";
import { useApiFetch } from "@/lib/api";
import { Loader2, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const QUESTIONS = [
  {
    id: "role",
    question: "How do you primarily use real estate data?",
    subtitle: "We'll tailor your dashboard to highlight the most relevant metrics.",
    options: [
      { value: "home_buyer", label: "Home buyer — looking to purchase" },
      { value: "investor", label: "Investor — commercial or multi-property" },
      { value: "broker", label: "Broker or Agent" },
      { value: "legal", label: "Legal or Due diligence professional" },
      { value: "other", label: "Other — just exploring" },
    ],
  },
  {
    id: "city",
    question: "Which markets are you focused on?",
    subtitle: "This helps us prioritize data refreshes in your area.",
    options: [
      { value: "mumbai", label: "Mumbai Metropolitan Region" },
      { value: "bangalore", label: "Bangalore" },
      { value: "delhi_ncr", label: "Delhi NCR" },
      { value: "hyderabad", label: "Hyderabad" },
      { value: "pune", label: "Pune" },
      { value: "other", label: "Other / Multiple cities" },
    ],
  },
  {
    id: "budget",
    question: "What is your typical investment range?",
    subtitle: "We use this to filter risk metrics and highlight relevant properties.",
    options: [
      { value: "under_50l", label: "Under ₹50 Lakhs" },
      { value: "50l_1cr", label: "₹50L – ₹1 Cr" },
      { value: "1cr_5cr", label: "₹1 Cr – ₹5 Cr" },
      { value: "above_5cr", label: "Above ₹5 Cr" },
      { value: "exploring", label: "Still exploring" },
    ],
  },
];

export default function OnboardingPage() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user, isLoading: userLoading } = useCruxUser();
  const apiFetch = useApiFetch();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoaded && !userLoading && (!isSignedIn || !user)) {
      router.replace("/signin");
    }
  }, [isLoaded, userLoading, isSignedIn, user, router]);

  useEffect(() => {
    if (isLoaded && !userLoading && isSignedIn && user && !user.isNewUser) {
      router.replace("/dashboard");
    }
  }, [isLoaded, userLoading, isSignedIn, user, router]);

  if (!isLoaded || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!isSignedIn || !user || !user.isNewUser) {
    return null;
  }

  const currentQuestion = QUESTIONS[step];
  const hasNext = step < QUESTIONS.length - 1;

  const handleSelect = (value: string) => {
    const updated = { ...answers, [currentQuestion.id]: value };
    setAnswers(updated);

    // Add a tiny delay for visual feedback
    setTimeout(() => {
      if (hasNext) {
        setStep(step + 1);
      } else {
        handleFinish(updated);
      }
    }, 150);
  };

  const handleSkip = () => {
    if (hasNext) {
      setStep(step + 1);
    } else {
      handleFinish(answers);
    }
  };

  const handleFinish = async (finalAnswers: Record<string, string>) => {
    setIsSubmitting(true);
    try {
      await apiFetch("/crux/auth/onboarding-complete", {
        method: "PATCH",
        body: JSON.stringify({
          role: finalAnswers.role,
          city: finalAnswers.city,
          budget: finalAnswers.budget,
        }),
      });
      // Force a full refresh to ensure all global state picks up the non-new user
      window.location.href = "/dashboard";
    } catch {
      // Even if it fails, we fall back to dashboard but they might be redirected back
      window.location.href = "/dashboard";
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans selection:bg-gray-100">
      <header className="flex items-center justify-between px-6 py-4 absolute top-0 w-full">
        <div className="font-semibold text-lg tracking-tight text-gray-900">
          CRUX
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          Sign out
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 sm:px-12 w-full max-w-2xl mx-auto">
        <div className="w-full max-w-lg">
          {/* Progress Indicator */}
          <div className="flex gap-2 mb-12">
            {QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
                  i <= step ? "bg-gray-900" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both" key={step}>
            <h1 className="text-[1.75rem] leading-tight font-semibold tracking-tight text-gray-900 mb-3">
              {currentQuestion.question}
            </h1>
            <p className="text-base text-gray-500 mb-8">
              {currentQuestion.subtitle}
            </p>

            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((opt) => {
                const isSelected = answers[currentQuestion.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    disabled={isSubmitting}
                    className={`group relative w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 ${
                      isSelected
                        ? "border-gray-900 bg-gray-50/50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className={`text-[15px] font-medium transition-colors ${
                      isSelected ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"
                    }`}>
                      {opt.label}
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-gray-900 animate-in zoom-in duration-200" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                variant="ghost"
                onClick={handleSkip}
                disabled={isSubmitting}
                className="text-gray-500 hover:text-gray-900 h-auto py-2 px-4 font-normal"
              >
                Skip this step
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
