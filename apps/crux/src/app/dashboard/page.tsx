"use client";

import { useCruxUser } from "@/hooks/useCruxUser";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { PromptBox } from "@/components/dashboard/PromptBox";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { GradeMix } from "@/components/dashboard/GradeMix";
import { PlanUsageCard } from "@/components/dashboard/PlanUsageCard";
import { RecentProperties } from "@/components/dashboard/RecentProperties";
import { HowItWorks } from "@/components/dashboard/HowItWorks";
import { ModuleGuide } from "@/components/dashboard/ModuleGuide";
import { GradeGuide } from "@/components/dashboard/GradeGuide";

/**
 * Dashboard home.
 *
 * Ordered by how much the reader already has invested: the search box first
 * because scoring a property is the only thing most visits are for, then their
 * own numbers, then their own properties, then the explainers — which matter on
 * the first visit and become wallpaper on the tenth, so they sit last.
 *
 * Exactly one panel on this page is saturated (PlanUsageCard). Letting a second
 * one compete would flatten the hierarchy back out, which is what a grid of
 * identically-styled cards does.
 */
export default function DashboardHomePage() {
  const { user, isLoading: userLoading } = useCruxUser();

  const firstName = user?.displayName?.split(" ")[0] || null;

  return (
    <div className="mx-auto max-w-[1040px] px-4 py-10 sm:px-6">
      <div className="mb-10">
        <WelcomeHeader userName={firstName} isLoading={userLoading} />
      </div>

      <div className="mb-10">
        <PromptBox />
      </div>

      <div className="mb-6">
        <QuickStats />
      </div>

      {/* Their own outcomes beside their own account. The mix gets the wider
          column because it carries a bar that needs the room to stay readable. */}
      <div className="mb-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GradeMix />
        </div>
        <PlanUsageCard />
      </div>

      <div className="mb-10">
        <RecentProperties />
      </div>

      {/* The explainers: how to get a grade, what goes into one, how to read it. */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <HowItWorks />
        <ModuleGuide />
        <GradeGuide />
      </div>
    </div>
  );
}
