"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useCruxUser } from "@/hooks/useCruxUser";
import { CircleAlert, Loader2, RefreshCw } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { DashboardContentSkeleton } from "./DashboardContentSkeleton";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: React.ReactNode;
  variant?: "default" | "minimal";
}

/**
 * Does this /crux/auth/me failure mean "no profile yet" rather than "broken"?
 *
 * One definition, because the same string-matching expression was written out four
 * times — in three effects and again in the render body — and four copies of a
 * heuristic drift. Still a heuristic: the backend has no distinct code for it, so
 * anything that reads as a missing profile is treated as a new user and sent to
 * onboarding rather than to a dead end.
 */
function looksLikeMissingProfile(error: string | null): boolean {
  if (!error) return false;
  return (
    error.includes("USER_NOT_FOUND") || error.includes("not found") || error.includes("404")
  );
}

export function DashboardShell({ children, variant = "default" }: DashboardShellProps) {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { user, isLoading: userLoading, error } = useCruxUser();
  const router = useRouter();

  const ready = authLoaded && !userLoading;
  const isNewUserError = looksLikeMissingProfile(error);

  // Redirect unauthenticated users to sign in
  useEffect(() => {
    if (ready && !isSignedIn) {
      router.replace("/signin");
    }
  }, [ready, isSignedIn, router]);

  // Redirect new users to onboarding
  useEffect(() => {
    if (ready && isSignedIn && user?.isNewUser) {
      router.replace("/onboarding");
    }
  }, [ready, isSignedIn, user?.isNewUser, router]);

  // An error that just means "this user has no profile row yet" is onboarding, not a failure.
  useEffect(() => {
    if (ready && isSignedIn && isNewUserError) {
      router.replace("/onboarding");
    }
  }, [ready, isSignedIn, isNewUserError, router]);

  // While Clerk auth or the user profile (/crux/auth/me) is loading, render the shell
  // chrome + a structured skeleton instead of a bare full-page spinner. This makes the
  // dashboard feel instant and keeps its shape while the (sometimes slow, e.g. backend
  // cold-start) profile request resolves. Child sections skeleton their own data too.
  if (!ready) {
    return (
      <div className="flex min-h-dvh bg-crux-bg-secondary">
        {variant === "default" && <Sidebar />}
        <main className={cn(variant === "default" ? "md:ml-[72px]" : "", "min-w-0 flex-1 pb-[calc(4rem_+_env(safe-area-inset-bottom))] md:pb-0")}>
          <DashboardContentSkeleton />
        </main>
      </div>
    );
  }

  if (!isSignedIn || user?.isNewUser) {
    return null;
  }

  // Generic error state (network failure, server error — not a new-user issue)
  if (error && !user) {
    // New-user errors get redirected by the effect above — show a loader while navigating
    if (isNewUserError) {
      return (
        <div className="flex min-h-dvh items-center justify-center bg-white">
          <Loader2 className="h-6 w-6 animate-spin text-crux-green motion-reduce:animate-none" aria-label="Loading" />
        </div>
      );
    }

    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-white p-6 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <CircleAlert className="h-6 w-6 text-red-500" aria-hidden="true" strokeWidth={1.5} />
        </div>
        <h2 className="mb-2 text-lg font-semibold text-crux-text-primary">Trouble connecting</h2>
        <p className="mb-5 max-w-xs text-sm text-crux-text-secondary">{error}</p>
        <button
          type="button"
          // Blunt, but the shell has no finer-grained retry: the profile fetch runs on mount.
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-xl bg-crux-green px-4 py-2 text-sm font-medium text-crux-ink transition-colors hover:bg-crux-green-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
        >
          <RefreshCw size={14} aria-hidden="true" />
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh bg-crux-bg-secondary">
      {variant === "default" && <Sidebar />}
      <main className={cn(variant === "default" ? "md:ml-[72px]" : "", "min-w-0 flex-1 pb-[calc(4rem_+_env(safe-area-inset-bottom))] md:pb-0")}>
        {children}
      </main>
    </div>
  );
}
