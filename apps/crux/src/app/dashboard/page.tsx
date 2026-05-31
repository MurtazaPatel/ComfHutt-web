"use client";

import { useRouter } from "next/navigation";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useCruxUser } from "@/hooks/useCruxUser";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { user, isLoading: userLoading, error } = useCruxUser();
  const router = useRouter();

  if (!authLoaded || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-6 h-6 animate-spin text-crux-green" />
      </div>
    );
  }

  if (!isSignedIn) {
    router.replace("/signin");
    return null;
  }

  if (user?.isNewUser) {
    router.replace("/onboarding");
    return null;
  }

  return (
    <div className="min-h-screen bg-crux-bg-secondary">
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

          <nav className="hidden md:flex items-center gap-6">
            <a
              href="/dashboard"
              className="text-[13px] text-gray-900 font-semibold"
            >
              Dashboard
            </a>
            <a
              href="/dashboard/properties"
              className="text-[13px] text-gray-500 hover:text-[#0A0A1A] transition-colors font-medium"
            >
              Properties
            </a>
            <a
              href="/dashboard/reports"
              className="text-[13px] text-gray-500 hover:text-[#0A0A1A] transition-colors font-medium"
            >
              Reports
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {user && (
              <span className="hidden md:inline text-[13px] text-gray-500">
                {user.watchCredits} watch credit
                {user.watchCredits !== 1 ? "s" : ""}
              </span>
            )}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {error ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-[#0A0A1A] mb-2">
              Could not load your profile
            </h1>
            <p className="text-gray-500 text-[14px]">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-12 h-12 rounded-full bg-crux-green/10 flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6 text-crux-green"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-[#0A0A1A] tracking-tight mb-3">
              {user ? `Welcome, ${user.displayName || user.email}` : "Your Dashboard"}
            </h1>
            <p className="text-gray-500 max-w-[480px] leading-relaxed">
              Search any property address to generate a CRUX score. View your
              saved reports, track market trends, and make data-backed decisions.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}