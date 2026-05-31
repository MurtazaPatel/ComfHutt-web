"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type IconType = "mail" | "lock" | "user" | "none";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: IconType;
}

const iconMap: Record<IconType, React.ComponentType<{ className?: string }>> = {
  mail: Mail,
  lock: Lock,
  user: User,
  none: () => null,
};

export default function FormInput({
  label,
  error,
  icon = "none",
  type,
  id,
  disabled,
  ...props
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const Icon = iconMap[icon];
  const isPassword = type === "password";

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200",
            error
              ? "text-red-500"
              : "text-crux-text-secondary peer-focus:text-crux-green",
          )}
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        <input
          id={id}
          type={isPassword && showPassword ? "text" : type}
          disabled={disabled}
          className={cn(
            "peer h-12 w-full rounded-xl bg-crux-bg-secondary px-4 text-[15px] text-crux-text-primary outline-none transition-all duration-200",
            "placeholder:text-crux-text-muted",
            "border",
            error
              ? "border-red-300 ring-1 ring-red-200"
              : "border-crux-border hover:border-crux-text-muted focus:border-crux-green focus:ring-1 focus:ring-crux-green/20",
            icon === "none" ? "" : "pl-11",
            isPassword ? "pr-12" : "",
            disabled && "cursor-not-allowed opacity-50",
          )}
          style={{ caretColor: "#22C55E" }}
          aria-invalid={!!error}
          {...props}
        />

        {Icon && (
          <Icon
            className={cn(
              "absolute left-4 w-4 h-4 pointer-events-none transition-colors duration-200",
              error ? "text-red-400" : "text-crux-text-muted",
            )}
          />
        )}

        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-crux-text-muted hover:text-crux-text-primary transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p
          className="flex items-center gap-1 text-[11px] text-red-500 mt-1"
          role="alert"
        >
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}