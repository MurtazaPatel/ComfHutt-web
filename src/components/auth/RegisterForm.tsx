"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";

import { registerSchema } from "@/lib/validations/auth";
import { CardWrapper } from "@/components/auth/CardWrapper";
import { register } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

export const RegisterForm = () => {
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
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/signin"
      showSocial
    >
      <form 
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white">Email</label>
            <input
              {...form.register("email")}
              disabled={isPending}
              placeholder="john.doe@example.com"
              type="email"
              className={cn(
                "flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50",
                form.formState.errors.email && "border-red-500 focus:ring-red-500"
              )}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-white">Password</label>
            <input
              {...form.register("password")}
              disabled={isPending}
              placeholder="******"
              type="password"
              className={cn(
                "flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50",
                form.formState.errors.password && "border-red-500 focus:ring-red-500"
              )}
            />
            {form.formState.errors.password && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.password.message}</p>
            )}
          </div>
        </div>
        {error && (
          <div className="bg-red-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-500">
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
            <p>{success}</p>
          </div>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="w-full h-10 rounded-md bg-white text-black font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
        >
          {isPending ? "Loading..." : "Create account"}
        </button>
      </form>
    </CardWrapper>
  );
};