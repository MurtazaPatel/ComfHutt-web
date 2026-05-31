"use client";

import { useSignUp } from "@clerk/nextjs/legacy";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import FormInput from "@/components/auth/FormInput";
import SocialAuth from "@/components/auth/SocialAuth";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthErrorBanner from "@/components/auth/AuthErrorBanner";
import Link from "next/link";

type Screen = "form" | "verify-email";

export default function SignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [screen, setScreen] = useState<Screen>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [banner, setBanner] = useState<{
    message: string;
    variant: "error" | "success";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-crux-green" />
      </div>
    );
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setBanner(null);

    if (!name.trim() || !email.trim() || !password) {
      setBanner({ message: "Please fill in all fields.", variant: "error" });
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
      const result = await signUp.create({
        emailAddress: email.trim(),
        password,
        firstName: name.trim().split(" ")[0],
        lastName: name.trim().split(" ").slice(1).join(" ") || undefined,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else if (result.status === "complete") {
        if (signUp.createdSessionId) {
          await setActive({ session: signUp.createdSessionId });
          router.push("/dashboard");
        } else {
          router.push("/signin?registered=true");
        }
      } else if (result.status === "missing_requirements") {
        await handleEmailVerification();
      } else {
        router.push("/signin?registered=true");
      }
    } catch (err: unknown) {
      const error = err as { errors?: { message: string }[] };
      const msg =
        error?.errors?.[0]?.message ||
        "Something went wrong. Please try again.";
      setBanner({ message: msg, variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailVerification = async () => {
    try {
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setScreen("verify-email");
      setBanner({
        message: `We sent a 6-digit code to ${email}. Enter it below.`,
        variant: "success",
      });
    } catch (err: unknown) {
      const error = err as { errors?: { message: string }[] };
      setBanner({
        message:
          error?.errors?.[0]?.message ||
          "Failed to send verification code. Try again.",
        variant: "error",
      });
    }
    setIsSubmitting(false);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setBanner(null);

    if (code.length < 6) {
      setBanner({
        message: "Please enter the 6-digit code.",
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const verifyResult = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      const sessionId =
        verifyResult.createdSessionId ?? signUp.createdSessionId;

      if (sessionId) {
        await setActive({ session: sessionId });
        router.push("/dashboard");
        return;
      }

      if (
        verifyResult.status === "complete" ||
        signUp.status === "complete"
      ) {
        if (signUp.createdSessionId) {
          await setActive({ session: signUp.createdSessionId });
          router.push("/dashboard");
          return;
        }
      }

      router.push("/signin?verified=true");
    } catch (err: unknown) {
      if (signUp.createdSessionId) {
        await setActive({ session: signUp.createdSessionId });
        router.push("/dashboard");
        return;
      }

      const error = err as { errors?: { message: string }[] };
      setBanner({
        message:
          error?.errors?.[0]?.message || "Invalid code. Please try again.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setBanner(null);
    try {
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setBanner({ message: "A new code has been sent.", variant: "success" });
    } catch (err: unknown) {
      const error = err as { errors?: { message: string }[] };
      setBanner({
        message: error?.errors?.[0]?.message || "Failed to resend code.",
        variant: "error",
      });
    }
  };

  if (screen === "verify-email") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[400px] mx-auto"
      >
        <button
          type="button"
          onClick={() => setScreen("form")}
          className="flex items-center gap-1 text-[13px] text-crux-text-secondary hover:text-crux-text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-crux-text-primary tracking-tight">
            Check your email
          </h1>
          <p className="text-[14px] text-crux-text-secondary mt-1.5">
            We sent a 6-digit verification code to{" "}
            <span className="font-medium text-crux-text-primary">{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerifyCode} className="space-y-5">
          <FormInput
            id="code"
            label="Verification code"
            type="text"
            placeholder="123456"
            maxLength={6}
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            disabled={isSubmitting}
            autoFocus
          />

          {banner && (
            <AuthErrorBanner
              message={banner.message}
              variant={banner.variant}
            />
          )}

          <button
            type="submit"
            disabled={isSubmitting || code.length < 6}
            className="w-full h-12 rounded-full bg-crux-green text-white font-semibold text-[15px] hover:bg-crux-green-mid active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying…
              </>
            ) : (
              "Verify email"
            )}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResendCode}
          className="w-full mt-4 text-[13px] text-crux-text-secondary hover:text-crux-green transition-colors text-center"
        >
          Didn&apos;t receive a code? Resend
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
      className="w-full max-w-[400px] mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-crux-text-primary tracking-tight">
          Create your account
        </h1>
        <p className="text-[14px] text-crux-text-secondary mt-1.5">
          Start scoring properties in under 90 seconds
        </p>
      </div>

      <form onSubmit={handleCreateAccount} className="space-y-5">
        <FormInput
          id="name"
          label="Full name"
          type="text"
          icon="user"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
          autoComplete="name"
          autoFocus
        />

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
        />

        <div>
          <FormInput
            id="password"
            label="Password"
            type="password"
            icon="lock"
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordStrength(calculateStrength(e.target.value));
            }}
            disabled={isSubmitting}
            autoComplete="new-password"
          />

          {password.length > 0 && (
            <div className="flex gap-1 mt-2" aria-hidden="true">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex-1 h-[2px] rounded-full transition-colors duration-200"
                  style={{
                    background:
                      i <= passwordStrength ? "#22C55E" : "#E5E7EB",
                  }}
                />
              ))}
            </div>
          )}
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
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <AuthDivider />

      <SocialAuth />

      <p className="text-center text-[13px] text-crux-text-secondary mt-6">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="text-crux-green hover:underline font-medium"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}