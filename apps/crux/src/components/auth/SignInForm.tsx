"use client";

import { useSignIn } from "@clerk/nextjs/legacy";
import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import FormInput from "@/components/auth/FormInput";
import SocialAuth from "@/components/auth/SocialAuth";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthErrorBanner from "@/components/auth/AuthErrorBanner";
import Link from "next/link";

export default function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [banner, setBanner] = useState<{
    message: string;
    variant: "error" | "success";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      window.location.href = "/dashboard";
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-crux-green" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBanner(null);

    if (!email.trim() || !password) {
      setBanner({ message: "Please fill in all fields.", variant: "error" });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status === "complete") {
        const sessionId = result.createdSessionId ?? signIn.createdSessionId;
        if (sessionId) {
          await setActive({ session: sessionId });
        }
        // Full page navigation ensures session cookie is set
        window.location.href = "/dashboard";
      } else {
        setBanner({
          message:
            "This account may need email verification. Check your inbox or use Google sign-in.",
          variant: "error",
        });
      }
    } catch (err: unknown) {
      const error = err as { errors?: { message: string }[] };
      const msg =
        error?.errors?.[0]?.message ||
        "Invalid email or password. Please try again.";
      setBanner({ message: msg, variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
      className="w-full max-w-[400px] mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-crux-text-primary tracking-tight">
          Welcome back
        </h1>
        <p className="text-[14px] text-crux-text-secondary mt-1.5">
          Sign in to your CRUX account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormInput
          id="email"
          label="Email"
          type="email"
          icon="mail"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          autoComplete="email"
          autoFocus
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-[11px] font-semibold uppercase tracking-[0.12em] text-crux-text-secondary"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] text-crux-text-muted hover:text-crux-text-primary transition-colors"
            >
              Forgot?
            </Link>
          </div>
          <FormInput
            id="password"
            label=""
            type="password"
            icon="lock"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            autoComplete="current-password"
          />
        </div>

        {banner && (
          <AuthErrorBanner message={banner.message} variant={banner.variant} />
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 rounded-full bg-crux-green text-white font-semibold text-[15px] hover:bg-crux-green-mid active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <AuthDivider />

      <SocialAuth />

      <p className="text-center text-[13px] text-crux-text-secondary mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-crux-green hover:underline font-medium"
        >
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}
