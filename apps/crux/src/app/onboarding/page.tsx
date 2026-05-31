"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useCruxUser } from "@/hooks/useCruxUser";
import { apiFetch } from "@/lib/api";
import { Loader2, ArrowRight } from "lucide-react";

const QUESTIONS = [
  {
    id: "role",
    question: "What best describes your role in real estate?",
    options: [
      { value: "home_buyer", label: "Home buyer — looking to purchase" },
      { value: "investor", label: "Investor — commercial / multi-property" },
      { value: "broker", label: "Broker / Agent" },
      { value: "legal", label: "Legal / Due diligence professional" },
      { value: "other", label: "Other — just exploring" },
    ],
  },
  {
    id: "city",
    question: "Which cities are you most interested in?",
    options: [
      { value: "mumbai", label: "Mumbai" },
      { value: "bangalore", label: "Bangalore" },
      { value: "delhi_ncr", label: "Delhi NCR" },
      { value: "hyderabad", label: "Hyderabad" },
      { value: "pune", label: "Pune" },
      { value: "chennai", label: "Chennai" },
      { value: "ahmedabad", label: "Ahmedabad" },
      { value: "multiple", label: "Multiple cities" },
    ],
  },
  {
    id: "budget",
    question: "What's your typical investment budget range?",
    options: [
      { value: "under_50l", label: "Under ₹50 Lakhs" },
      { value: "50l_1cr", label: "₹50L – ₹1 Cr" },
      { value: "1cr_5cr", label: "₹1 Cr – ₹5 Cr" },
      { value: "above_5cr", label: "Above ₹5 Cr" },
      { value: "exploring", label: "Still exploring — no range yet" },
    ],
  },
];

export default function OnboardingPage() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user, isLoading: userLoading } = useCruxUser();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoaded || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-6 h-6 animate-spin text-crux-green" />
      </div>
    );
  }

  if (!isSignedIn || !user) {
    router.replace("/signin");
    return null;
  }

  if (!user.isNewUser) {
    router.replace("/dashboard");
    return null;
  }

  const currentQuestion = QUESTIONS[step];
  const hasNext = step < QUESTIONS.length - 1;

  const handleSelect = (value: string) => {
    const updated = { ...answers, [currentQuestion.id]: value };
    setAnswers(updated);

    if (hasNext) {
      setStep(step + 1);
    } else {
      handleFinish(updated);
    }
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
      await apiFetch("/auth/onboarding-complete", {
        method: "PATCH",
      });
      router.push("/dashboard");
    } catch {
      router.push("/dashboard");
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-crux-border bg-white/80 backdrop-blur-lg">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3.5">
          <a href="/" className="flex items-center gap-2.5 no-underline">
            <span className="font-bold text-[#0A0A1A] tracking-tight text-xl">
              CRUX
            </span>
            <span className="flex items-center gap-1.5 self-end mb-0.5">
              <span className="text-[10px] text-gray-400">by</span>
              <span className="text-[10px] text-gray-400 font-medium">
                ComfHutt
              </span>
            </span>
          </a>
          <button
            onClick={handleLogout}
            className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-[480px] py-12">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-1 rounded-full transition-colors duration-300"
                  style={{
                    background:
                      i <= step ? "#22C55E" : "#E5E7EB",
                  }}
                />
              ))}
            </div>
            <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-crux-text-muted mb-2">
              Step {step + 1} of {QUESTIONS.length}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-crux-text-primary tracking-tight mb-2">
              {currentQuestion.question}
            </h1>
            <p className="text-[14px] text-crux-text-secondary">
              Help us tailor your experience. You can always update this later.
            </p>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                disabled={isSubmitting}
                className="w-full text-left px-5 py-4 rounded-xl border border-crux-border bg-white hover:border-crux-green/30 hover:bg-crux-green-tint/50 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
              >
                <span className="text-[15px] text-crux-text-primary font-medium">
                  {opt.label}
                </span>
                <ArrowRight className="w-4 h-4 text-crux-text-muted group-hover:text-crux-green transition-colors" />
              </button>
            ))}
          </div>

          <button
            onClick={handleSkip}
            disabled={isSubmitting}
            className="w-full mt-4 text-[13px] text-crux-text-muted hover:text-crux-text-secondary transition-colors py-2"
          >
            {hasNext ? "Skip this question" : "Skip all"}
          </button>
        </div>
      </main>
    </div>
  );
}