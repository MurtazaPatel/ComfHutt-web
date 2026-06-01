"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useApiFetch } from "@/lib/api";

export interface CruxUser {
  userId: string;
  email: string;
  phone: string | null;
  displayName: string | null;
  planTier: string;
  watchCredits: number;
  totalSearches: number;
  isNewUser: boolean;
  createdAt: string;
}

interface CruxUserResponse {
  success: boolean;
  data?: CruxUser;
}



export function useCruxUser() {
  const { isSignedIn, isLoaded } = useAuth();
  const apiFetch = useApiFetch();
  const [user, setUser] = useState<CruxUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadUser() {
      try {
        const data = await apiFetch<CruxUserResponse>("/crux/auth/me", {
          cache: "no-store",
        });
        if (!cancelled) {
          setUser(data.data ?? null);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setUser(null);
          setError(err instanceof Error ? err.message : "Failed to load user profile");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, [isSignedIn, isLoaded]);

  return { user, isLoading, error };
}
