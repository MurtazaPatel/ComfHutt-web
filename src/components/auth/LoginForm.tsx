"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { loginSchema } from "@/lib/validations/auth";
import { CardWrapper } from "@/components/auth/CardWrapper";
import { login } from "@/lib/actions/login";
import { cn } from "@/lib/utils";
import { LoadingState } from "@/components/auth/LoadingState";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? "Email already in use with different provider!"
    : "";

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }
          
          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/signup"
      showSocial
    >
      {isPending ? (
        <div className="py-10 flex justify-center">
          <LoadingState message="Accessing secure network..." />
        </div>
      ) : (
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div className="group">
            <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5 block group-focus-within:text-white transition-colors">Email</label>
            <input
              {...form.register("email")}
              disabled={isPending}
              placeholder="john.doe@example.com"
              type="email"
              className={cn(
                "flex h-11 w-full border-b border-white/20 bg-transparent py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                form.formState.errors.email && "border-red-500 focus:border-red-500"
              )}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="group">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider group-focus-within:text-white transition-colors">Password</label>
            </div>
            <input
              {...form.register("password")}
              disabled={isPending}
              placeholder="******"
              type="password"
              className={cn(
                "flex h-11 w-full border-b border-white/20 bg-transparent py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                form.formState.errors.password && "border-red-500 focus:border-red-500"
              )}
            />
            {form.formState.errors.password && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.password.message}</p>
            )}
             <div className="flex justify-end mt-2">
              <Link href="/reset" className="text-xs text-white/50 hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>
        </div>
        {(error || urlError) && (
          <div className="bg-red-500/10 border border-red-500/20 p-3 rounded flex items-center gap-x-2 text-sm text-red-500">
            <p>{error || urlError}</p>
          </div>
        )}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded flex items-center gap-x-2 text-sm text-emerald-500">
            <p>{success}</p>
          </div>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="w-full h-11 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          Login
        </button>
      </form>
      )}
    </CardWrapper>
  );
};