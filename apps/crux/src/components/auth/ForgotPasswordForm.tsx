"use client";

import { useSignIn } from "@clerk/nextjs/legacy";
import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Loader2, ArrowLeft } from "lucide-react";
import FormInput from "@/components/auth/FormInput";
import AuthErrorBanner from "@/components/auth/AuthErrorBanner";
import Link from "next/link";

type Screen = "request" | "reset";

export default function ForgotPasswordForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useAuth();
  const reduceMotion = useReducedMotion();

  const [screen, setScreen] = useState<Screen>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
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

  // Step 1 — ask Clerk to email a reset code.
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setBanner(null);

    if (!email.trim()) {
      setBanner({ message: "Please enter your email.", variant: "error" });
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email.trim(),
      });
      setScreen("reset");
      setBanner({
        message: `We sent a 6-digit code to ${email}. Enter it below with your new password.`,
        variant: "success",
      });
    } catch (err: unknown) {
      const error = err as { errors?: { message: string }[] };
      setBanner({
        message:
          error?.errors?.[0]?.message ||
          "We couldn't send a reset code. Check the email and try again.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2 — verify the code and set the new password in one shot, then sign in.
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setBanner(null);

    if (code.length < 6) {
      setBanner({ message: "Please enter the 6-digit code.", variant: "error" });
      return;
    }
    if (password.length < 8) {
      setBanner({
        message: "Password must be at least 8 characters.",
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: code.trim(),
        password,
      });

      if (result.status === "complete") {
        const sessionId = result.createdSessionId ?? signIn.createdSessionId;
        if (sessionId) {
          await setActive({ session: sessionId });
        }
        // Full page navigation ensures the session cookie is set before middleware runs.
        window.location.href = "/dashboard";
        return;
      }

      // e.g. status "needs_second_factor" — MFA isn't wired into this custom UI.
      setBanner({
        message:
          "Your password was reset, but this account needs another step to sign in. Please sign in manually.",
        variant: "error",
      });
    } catch (err: unknown) {
      const error = err as { errors?: { message: string }[] };
      setBanner({
        message:
          error?.errors?.[0]?.message ||
          "Invalid code or password. Please try again.",
        variant: "error",
      });
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
      {screen === "reset" && (
        <button
          type="button"
          onClick={() => {
            setScreen("request");
            setBanner(null);
          }}
          className="flex items-center gap-1.5 min-h-11 -ml-1 px-1 text-[14px] text-[var(--color-crux-text-secondary)] hover:text-[var(--color-crux-text-primary)] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      )}

      <div className="mb-8">
        <h1 className="text-[28px] md:text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--color-crux-text-primary)]">
          {screen === "request" ? "Reset your password" : "Enter your new password"}
        </h1>
        <p className="text-[15px] leading-[1.55] text-[var(--color-crux-text-secondary)] mt-2.5 break-words">
          {screen === "request"
            ? "We'll email you a 6-digit code to reset it."
            : `Code sent to ${email}`}
        </p>
      </div>

      {screen === "request" ? (
        <form onSubmit={handleRequestCode} className="space-y-5">
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
                Sending code…
              </>
            ) : (
              "Send reset code"
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-5">
          <FormInput
            id="code"
            label="Verification code"
            type="text"
            placeholder="123456"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            disabled={isSubmitting}
            autoFocus
          />

          <FormInput
            id="password"
            label="New password"
            type="password"
            icon="lock"
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            autoComplete="new-password"
          />

          {banner && (
            <AuthErrorBanner message={banner.message} variant={banner.variant} />
          )}

          <button
            type="submit"
            disabled={isSubmitting || code.length < 6}
            className="btn-crux btn-crux--block min-h-12 text-[15px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Resetting…
              </>
            ) : (
              "Reset password & sign in"
            )}
          </button>
        </form>
      )}

      <p className="text-center text-[14px] text-[var(--color-crux-text-secondary)] mt-6">
        Remembered it?{" "}
        <Link
          href="/signin"
          className="text-[var(--color-crux-green-dark)] font-medium underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </motion.div>
  );
}
