"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { registerSchema } from "@/lib/validations/auth";
import { CardWrapper } from "@/components/auth/CardWrapper";
import { register } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import { LoadingState } from "@/components/auth/LoadingState";

export const RegisterForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }
          
          if (data.success) {
            setSuccess(data.success);
            setTimeout(() => {
              router.push("/dashboard");
            }, 1000);
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/signin"
      showSocial
    >
      {isPending ? (
        <div className="py-10 flex justify-center">
          <LoadingState message="Creating your identity..." />
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
            <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5 block group-focus-within:text-white transition-colors">Password</label>
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
          </div>
        </div>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-3 rounded flex items-center gap-x-2 text-sm text-red-500">
            <p>{error}</p>
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
          className="w-full h-11 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          Create account
        </button>
      </form>
      )}
    </CardWrapper>
  );
};