"use client";

import { useSignIn } from "@clerk/nextjs/legacy";
import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Loader2 } from "lucide-react";
import FormInput from "@/components/auth/FormInput";
import SocialAuth from "@/components/auth/SocialAuth";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthErrorBanner from "@/components/auth/AuthErrorBanner";
import Link from "next/link";

export default function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useAuth();
  const reduceMotion = useReducedMotion();

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
        <Loader2 className="w-6 h-6 animate-spin text-[var(--color-crux-green)]" />
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
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[400px] mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-[28px] md:text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--color-crux-text-primary)]">
          Welcome back
        </h1>
        <p className="text-[15px] leading-[1.55] text-[var(--color-crux-text-secondary)] mt-2.5 break-words">
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

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="t-eyebrow text-[var(--color-crux-text-secondary)]"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="-my-3 py-3 text-[12px] font-medium text-[var(--color-crux-green-dark)] underline-offset-4 hover:underline"
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
          className="btn-crux btn-crux--block min-h-12 text-[15px]"
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

      <p className="text-center text-[14px] text-[var(--color-crux-text-secondary)] mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-[var(--color-crux-green-dark)] font-medium underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}
