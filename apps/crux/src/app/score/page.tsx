"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import ChatInput from "@/components/ChatInput";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { HowItWorks } from "@/components/dashboard/HowItWorks";
import { MarketPulse } from "@/components/dashboard/MarketPulse";
import { apiFetch } from "@/lib/api";

interface QuotaResponse {
  success: boolean;
  data?: { unlimited: boolean; reportCount?: number; maxReports?: number };
}

function MiniHeader() {
  return (
    <div className="border-b border-black/5 bg-white">
      <div className="max-w-[960px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-[18px] font-bold tracking-[-0.03em] text-crux-text-primary">
          CRUX
        </Link>
        <Link
          href="/signup"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-crux-green text-white rounded-full hover:bg-crux-green-mid transition-colors"
        >
          Sign up free
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function AnonymousStartPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [quota, setQuota] = useState<QuotaResponse["data"] | null>(null);

  // Signed-in visitors get the real dashboard instead.
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    apiFetch<QuotaResponse>("/crux/anon/quota", { skipAuth: true })
      .then((res) => {
        if (res.success && res.data) setQuota(res.data);
      })
      .catch(() => {
        // Non-fatal — quota banner just won't show a count
      });
  }, []);

  if (!isLoaded || (isLoaded && isSignedIn)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-6 h-6 animate-spin text-crux-green" />
      </div>
    );
  }

  const remaining =
    quota && !quota.unlimited && typeof quota.reportCount === "number" && typeof quota.maxReports === "number"
      ? Math.max(quota.maxReports - quota.reportCount, 0)
      : null;

  return (
    <div className="min-h-screen bg-crux-bg-secondary">
      <MiniHeader />
      <div className="max-w-[960px] mx-auto px-6 py-10">
        <div className="mb-10">
          <WelcomeHeader userName={null} isLoading={false} />
          <p className="mt-2 text-[15px] text-crux-text-secondary">
            Score any property in India, free — no signup required.
          </p>
        </div>

        <div className="mb-4 max-w-[580px] mx-auto">
          <ChatInput size="large" />
        </div>

        {remaining !== null && (
          <p className="mb-10 text-center text-[13px] text-crux-text-muted">
            {remaining > 0
              ? `${remaining} of ${quota?.maxReports} free scores remaining`
              : "You've used all your free scores — sign up to keep going"}
          </p>
        )}
        {remaining === null && <div className="mb-10" />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HowItWorks />
          <MarketPulse />
        </div>
      </div>
    </div>
  );
}
