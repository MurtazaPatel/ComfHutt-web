"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useCruxUser } from "@/hooks/useCruxUser";
import { useApiFetch } from "@/lib/api";
import { Loader2, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Three questions, each of which has to be answerable honestly.
 *
 * The subtitles used to promise things the product does not do — that the answers
 * would tailor the dashboard, prioritise data refreshes for the user's area, and
 * filter risk metrics by budget. None of that is implemented anywhere, and the
 * city list offered Mumbai, Bangalore, Delhi NCR, Hyderabad and Pune, so a new
 * user's first interaction with CRUX was choosing a market it cannot cover. These
 * answers are product signal for what to build next, and the copy now says so.
 */
const QUESTIONS = [
  {
    id: "role",
    question: "How do you use property data?",
    subtitle: "This tells us who CRUX is being used by. It shapes what we build next.",
    options: [
      { value: "home_buyer", label: "Home buyer — looking to purchase" },
      { value: "investor", label: "Investor — commercial or multi-property" },
      { value: "broker", label: "Broker or agent" },
      { value: "legal", label: "Legal or due-diligence professional" },
      { value: "other", label: "Other — just exploring" },
    ],
  },
  {
    id: "city",
    question: "Where in Gujarat are you looking?",
    subtitle: "CRUX covers Gujarat today. Ahmedabad has the deepest record so far.",
    options: [
      { value: "ahmedabad", label: "Ahmedabad" },
      { value: "surat", label: "Surat" },
      { value: "vadodara", label: "Vadodara" },
      { value: "rajkot", label: "Rajkot" },
      { value: "gandhinagar", label: "Gandhinagar" },
      { value: "other_gujarat", label: "Elsewhere in Gujarat" },
    ],
  },
  {
    id: "budget",
    question: "What is your typical range?",
    subtitle: "Optional. It tells us which segment to deepen first.",
    options: [
      { value: "under_50l", label: "Under ₹50 lakh" },
      { value: "50l_1cr", label: "₹50 lakh – ₹1 crore" },
      { value: "1cr_5cr", label: "₹1 crore – ₹5 crore" },
      { value: "above_5cr", label: "Above ₹5 crore" },
      { value: "exploring", label: "Still exploring" },
    ],
  },
] as const;

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

  // Backfill anonymous pre-signup score history (if any) into the new account.
  // Fire-and-forget — the backend no-ops silently if there's nothing to migrate.
  useEffect(() => {
    if (isLoaded && !userLoading && isSignedIn && user?.isNewUser) {
      apiFetch("/crux/auth/migrate-anon", { method: "POST" }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, userLoading, isSignedIn, user?.isNewUser]);

  const finish = useCallback(
    async (finalAnswers: Record<string, string>) => {
      // Guard against a double-fire: the last option's click and a fast second tap
      // could both reach here, sending the PATCH twice.
      if (isSubmitting) return;
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
      } catch {
        // These answers are preference signal, not a gate. Failing to record them
        // must not trap a new account on the onboarding screen — go to the
        // dashboard either way. The server still reports isNewUser, so the shell
        // may route back here once; that is better than a dead end.
      }
      router.push("/dashboard");
    },
    [apiFetch, isSubmitting, router],
  );

  if (!isLoaded || userLoading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-white">
        <Loader2 className="h-5 w-5 animate-spin text-crux-text-muted" aria-label="Loading" />
      </div>
    );
  }

  if (!isSignedIn || !user || !user.isNewUser) {
    return null;
  }

  const currentQuestion = QUESTIONS[step];
  const hasNext = step < QUESTIONS.length - 1;

  const advance = (updated: Record<string, string>) => {
    if (hasNext) setStep(step + 1);
    else finish(updated);
  };

  const handleSelect = (value: string) => {
    const updated = { ...answers, [currentQuestion.id]: value };
    setAnswers(updated);
    // Advance immediately. The previous 150ms setTimeout existed to let the check
    // mark register, but it also let a second tap land mid-delay and skip a step.
    // The selected state paints in the same frame, so the feedback is not lost.
    advance(updated);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white text-crux-text-primary">
      <header className="absolute top-0 flex w-full items-center justify-between px-6 py-4">
        <span className="text-lg font-semibold tracking-tight">CRUX</span>
        <button
          type="button"
          onClick={() => signOut().then(() => router.push("/"))}
          className="rounded-md text-sm font-medium text-crux-text-secondary transition-colors hover:text-crux-text-primary focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Sign out
        </button>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-24 sm:px-12">
        <div className="w-full max-w-lg">
          {/* Progress. Announced, so a screen reader knows how much is left. */}
          <div
            className="mb-12 flex gap-2"
            role="group"
            aria-label={`Step ${step + 1} of ${QUESTIONS.length}`}
          >
            {QUESTIONS.map((q, i) => (
              <span
                key={q.id}
                aria-hidden
                className={`h-0.5 flex-1 rounded-full transition-colors duration-500 motion-reduce:transition-none ${
                  i <= step ? "bg-crux-green" : "bg-crux-border"
                }`}
              />
            ))}
          </div>

          {/* key={step} remounts so the entry animation replays per question. */}
          <div
            key={step}
            className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700 ease-out motion-reduce:animate-none"
          >
            <h1 className="mb-3 text-[1.75rem] font-semibold leading-tight tracking-tight">
              {currentQuestion.question}
            </h1>
            <p className="mb-8 text-base text-crux-text-secondary">{currentQuestion.subtitle}</p>

            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((opt) => {
                const isSelected = answers[currentQuestion.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    disabled={isSubmitting}
                    aria-pressed={isSelected}
                    className={`group flex w-full items-center justify-between rounded-xl border px-5 py-4 text-left transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${
                      isSelected
                        ? "border-crux-green bg-crux-green-tint"
                        : "border-crux-border hover:border-crux-text-muted hover:bg-crux-bg-secondary"
                    }`}
                  >
                    <span
                      className={`text-[15px] font-medium ${
                        isSelected
                          ? "text-crux-green-deeper"
                          : "text-crux-text-secondary group-hover:text-crux-text-primary"
                      }`}
                    >
                      {opt.label}
                    </span>
                    {isSelected && <Check className="h-4 w-4 flex-shrink-0 text-crux-green" aria-hidden />}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between">
              {/* A mis-tap used to be unrecoverable — the only way back was to
                  restart onboarding, and the answers are already submitted by then. */}
              {step > 0 ? (
                <Button
                  variant="ghost"
                  onClick={() => setStep(step - 1)}
                  disabled={isSubmitting}
                  className="h-auto px-4 py-2 font-normal text-crux-text-secondary hover:text-crux-text-primary"
                >
                  <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden />
                  Back
                </Button>
              ) : (
                <span />
              )}

              <Button
                variant="ghost"
                onClick={() => advance(answers)}
                disabled={isSubmitting}
                className="h-auto px-4 py-2 font-normal text-crux-text-secondary hover:text-crux-text-primary"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" aria-hidden />
                    Setting up
                  </>
                ) : hasNext ? (
                  "Skip this step"
                ) : (
                  "Skip and finish"
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
