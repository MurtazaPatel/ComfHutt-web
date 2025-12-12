import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FEATURES } from "@/config/feature-flags";
import HeroSection from "@/components/owner-onboarding/HeroSection";
import HowItWorks from "@/components/owner-onboarding/HowItWorks";
import OnboardingForm from "@/components/owner-onboarding/OnboardingForm";
import TrustSection from "@/components/owner-onboarding/TrustSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Owner Onboarding | ComfHutt",
  description: "List your property and start earning fractional returns today.",
};

const OwnerOnboardingPage = async () => {
  const session = await auth();

  // MVP: Remove auth guard for public access.
  // Only redirect if feature flag strictly requires auth.
  if (FEATURES.AUTH_REQUIRED && !session) {
     redirect("/auth/signin?callbackUrl=/owner-onboarding");
  }

  const initialData = {
    name: session?.user?.name || "",
    email: session?.user?.email || "",
  };

  return (
    <div className="flex min-h-screen flex-col">
        <Navbar user={session?.user} />
      <main className="flex-1">
        <HeroSection />
        <HowItWorks />
        <div className="bg-secondary/10 py-16 md:py-24">
            <div className="container px-4 md:px-6 mb-8 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Get Started</h2>
                <p className="text-muted-foreground mt-2">
                   No account required — start listing in minutes. Fill in the details below to begin your journey.
                </p>
            </div>
            {/* The form component will handle client-side prefill reading */}
            <OnboardingForm initialData={initialData} />
        </div>
        <TrustSection />
      </main>
      <Footer />
    </div>
  );
};

export default OwnerOnboardingPage;