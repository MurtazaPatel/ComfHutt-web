"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useCruxUser } from "@/hooks/useCruxUser";
import { Loader2, RefreshCw } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: React.ReactNode;
  variant?: "default" | "minimal";
}

export function DashboardShell({ children, variant = "default" }: DashboardShellProps) {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { user, isLoading: userLoading, error } = useCruxUser();
  const router = useRouter();

  // Redirect unauthenticated users to sign in
  useEffect(() => {
    if (authLoaded && !userLoading && !isSignedIn) {
      router.replace("/signin");
    }
  }, [authLoaded, userLoading, isSignedIn, router]);

  // Redirect new users to onboarding
  useEffect(() => {
    if (authLoaded && !userLoading && isSignedIn && user?.isNewUser) {
      router.replace("/onboarding");
    }
  }, [authLoaded, userLoading, isSignedIn, user?.isNewUser, router]);

  // If the API returns an error that looks like a missing/new user profile,
  // treat it as a new user and redirect to onboarding rather than showing a dead end.
  useEffect(() => {
    if (authLoaded && !userLoading && isSignedIn && error) {
      const isNewUserError =
        error.includes("USER_NOT_FOUND") ||
        error.includes("not found") ||
        error.includes("404");
      if (isNewUserError) {
        router.replace("/onboarding");
      }
    }
  }, [authLoaded, userLoading, isSignedIn, error, router]);

  if (!authLoaded || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!isSignedIn || user?.isNewUser) {
    return null;
  }

  // Generic error state (network failure, server error — not a new-user issue)
  if (error && !user) {
    const isNewUserError =
      error.includes("USER_NOT_FOUND") ||
      error.includes("not found") ||
      error.includes("404");

    // New-user errors get redirected by the effect above — show a loader while navigating
    if (isNewUserError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Trouble connecting
        </h2>
        <p className="text-sm text-gray-500 mb-5 max-w-xs">
          {error}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
        >
          <RefreshCw size={14} />
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-crux-bg-secondary">
      {variant === "default" && <Sidebar />}
      <main className={cn(variant === "default" ? "md:ml-[72px]" : "", "flex-1 min-w-0 pb-16 md:pb-0")}>
        {children}
      </main>
    </div>
  );
}
