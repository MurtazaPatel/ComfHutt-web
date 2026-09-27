"use client";

import { useState, useEffect, useRef, useId } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { track } from "@vercel/analytics";
import { cn } from "@/lib/utils";
import { useApiFetch } from "@/lib/api";

/**
 * Placeholders name the area CRUX actually covers.
 *
 * The old set opened with "Enter any address in India…" and offered to take a
 * 99acres link. CRUX grades RERA-registered projects in Gujarat and cannot read
 * a portal listing, so both were promises the box could not keep. "Satellite" in
 * the third line is the Ahmedabad locality, not imagery.
 */
const PLACEHOLDERS = [
  "A project or locality in Gujarat…",
  "Try: 2BHK Satellite, Ahmedabad",
  "Try: Vesu, Surat",
];

/** True when the visitor has asked for less motion — the typewriter is motion. */
function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

interface ChatInputProps {
  onSubmit?: (query: string) => void;
  placeholder?: string;
  className?: string;
  variant?: "default" | "white" | "dark";
  size?: "default" | "large";
}

export default function ChatInput({
  onSubmit,
  placeholder,
  className = "",
  variant = "default",
  size = "default",
}: ChatInputProps) {
  const [query, setQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const apiFetch = useApiFetch();
  // ChatInput can render more than once on a page (hero + footer) — ids must be unique.
  const inputId = useId();

  useEffect(() => {
    const currentPlaceholder = placeholder || PLACEHOLDERS[placeholderIndex];
    let charIndex = 0;
    let typingTimeout: ReturnType<typeof setTimeout>;

    const type = () => {
      // Reduced motion: show the hint outright and stop. No per-character
      // animation, and no rotation either — a placeholder that swaps itself out
      // is still movement the visitor asked not to see.
      if (prefersReducedMotion()) {
        setDisplayedPlaceholder(currentPlaceholder);
        return;
      }
      if (isTyping && charIndex < currentPlaceholder.length) {
        setDisplayedPlaceholder(currentPlaceholder.slice(0, charIndex + 1));
        charIndex++;
        typingTimeout = setTimeout(type, 50);
      } else if (isTyping && charIndex === currentPlaceholder.length) {
        typingTimeout = setTimeout(() => {
          if (!placeholder) {
            setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
          }
        }, 3000);
      }
    };

    if (isTyping && !query) {
      typingTimeout = setTimeout(type, 100);
    }

    return () => clearTimeout(typingTimeout);
  }, [isTyping, placeholderIndex, query, placeholder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || isSubmitting) return;

    if (onSubmit) {
      onSubmit(trimmed);
      setQuery("");
      setDisplayedPlaceholder("");
      setPlaceholderIndex(0);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    track("anonymous_score_started", { signedIn: Boolean(isSignedIn) });

    try {
      const resp = await apiFetch<{ success: boolean; data?: { id: string } }>(
        "/crux/property",
        { method: "POST", body: JSON.stringify({ address: trimmed }), skipAuth: !isSignedIn }
      );

      if (!resp.success || !resp.data) {
        throw new Error("Failed to create property record");
      }

      setQuery("");
      setDisplayedPlaceholder("");
      setPlaceholderIndex(0);

      router.push(
        isSignedIn
          ? `/dashboard/properties/${resp.data.id}`
          : `/score/${resp.data.id}`
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      if (msg.includes("geocode") || msg.includes("find") || msg.includes("not found")) {
        setError("Could not find this project. Try a project name or locality in Gujarat.");
      } else if (msg.includes("rate") || msg.includes("429")) {
        setError("Too many requests. Try again in a few minutes.");
      } else {
        setError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerStyles = cn(
    // Explicit property list, not transition-all: the container also animates
    // its shadow on focus, and transition-all would drag layout properties in.
    "flex items-center gap-3 rounded-2xl transition-[border-color,box-shadow] duration-300",
    // The ring is driven by the input's own :focus-visible so keyboard users get
    // an unmistakable outline, while a click does not draw one.
    "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-crux-green has-[:focus-visible]:ring-offset-2",
    size === "large" ? "px-6 py-4 sm:py-5" : "px-5 py-3.5",
    {
      "bg-white border border-crux-border shadow-lg": variant === "default",
      "bg-white border border-crux-border": variant === "white",
      "bg-crux-surface-dark-card border border-crux-border-dark": variant === "dark",
    },
    (isFocused || query) && "border-crux-green shadow-[var(--shadow-premium-glow)]",
    className
  );

  const inputStyles = cn(
    "flex-1 outline-none bg-transparent font-medium",
    "text-base",
    {
      "text-crux-text-primary placeholder-crux-text-muted": variant !== "dark",
      "text-crux-text-light placeholder-crux-text-muted": variant === "dark",
    }
  );

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={containerStyles}>
        <input
          ref={inputRef}
          id={inputId}
          name={inputId}
          type="text"
          value={query}
          disabled={isSubmitting}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsTyping(false);
            if (error) setError(null);
          }}
          onFocus={() => {
            setIsFocused(true);
            setIsTyping(false);
          }}
          onBlur={() => {
            setIsFocused(false);
            if (!query) setIsTyping(true);
          }}
          placeholder={displayedPlaceholder}
          className={inputStyles}
        />
        <button
          type="submit"
          disabled={!query.trim() || isSubmitting}
          className={cn(
            "shrink-0 flex items-center justify-center rounded-xl p-2.5 min-w-11 min-h-11",
            "transition-[background-color,opacity] duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2",
            query.trim() && !isSubmitting
              ? "bg-gradient-green text-white hover:opacity-90 cursor-pointer"
              : variant === "dark"
                ? "bg-crux-border-dark text-crux-text-muted cursor-not-allowed"
                : "bg-crux-bg-secondary text-crux-text-muted cursor-not-allowed"
          )}
          aria-label="Grade this project"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin motion-reduce:animate-none" /> : <ArrowRight size={18} />}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-600 text-center" role="status">{error}</p>
      )}
    </form>
  );
}
