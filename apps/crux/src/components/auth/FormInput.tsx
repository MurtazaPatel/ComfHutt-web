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
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "t-eyebrow",
            error ? "text-crux-danger" : "text-[var(--color-crux-text-secondary)]",
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
            "peer min-h-12 w-full rounded-[var(--radius-control)] bg-white px-4 text-base text-[var(--color-crux-text-primary)] outline-none",
            "transition-[border-color,box-shadow] duration-200 ease-[var(--ease-crux)]",
            "placeholder:text-[var(--color-crux-text-muted)]",
            "border",
            error
              ? "border-crux-danger focus:shadow-[0_0_0_4px_rgba(220,38,38,0.14)]"
              : "border-[var(--color-crux-border)] hover:border-[var(--color-crux-text-muted)] focus:border-[var(--color-crux-green)] focus:shadow-[0_0_0_4px_rgba(16,185,129,0.16)]",
            icon === "none" ? "" : "pl-11",
            isPassword ? "pr-12" : "",
            disabled && "cursor-not-allowed opacity-50",
          )}
          style={{ caretColor: "var(--color-crux-green)" }}
          aria-invalid={!!error}
          {...props}
        />

        {Icon && (
          <Icon
            className={cn(
              "absolute left-4 w-4 h-4 pointer-events-none transition-colors duration-200",
              error
                ? "text-crux-danger"
                : "text-[var(--color-crux-text-muted)] peer-focus:text-[var(--color-crux-green-dark)]",
            )}
          />
        )}

        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0.5 flex h-11 w-11 items-center justify-center text-[var(--color-crux-text-muted)] hover:text-[var(--color-crux-text-primary)] transition-colors"
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
          className="flex items-center gap-1.5 text-[12px] text-crux-danger"
          role="alert"
        >
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
