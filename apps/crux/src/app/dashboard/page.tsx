"use client";

import { useCruxUser } from "@/hooks/useCruxUser";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { PromptBox } from "@/components/dashboard/PromptBox";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { RecentProperties } from "@/components/dashboard/RecentProperties";
import { HowItWorks } from "@/components/dashboard/HowItWorks";
import { MarketPulse } from "@/components/dashboard/MarketPulse";

export default function DashboardHomePage() {
  const { user, isLoading: userLoading } = useCruxUser();

  const firstName = user?.displayName?.split(" ")[0] || null;

  return (
    <div className="max-w-[960px] mx-auto px-6 py-10">
      {/* Welcome + Prompt hero */}
      <div className="mb-10">
        <WelcomeHeader userName={firstName} isLoading={userLoading} />
      </div>

      <div className="mb-10">
        <PromptBox />
      </div>

      {/* Quick stats */}
      <div className="mb-10">
        <QuickStats />
      </div>

      {/* Recent Research */}
      <div className="mb-10">
        <RecentProperties />
      </div>

      {/* Bottom two-panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HowItWorks />
        <MarketPulse />
      </div>
    </div>
  );
}
