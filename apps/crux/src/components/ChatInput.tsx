"use client";

import { useState, useEffect, useRef, useId } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { track } from "@vercel/analytics";
import { cn } from "@/lib/utils";
import { useApiFetch } from "@/lib/api";

const PLACEHOLDERS = [
  "Enter any address in India...",
  "Paste a 99acres link...",
  "Try: 2BHK Satellite, Ahmedabad",
];

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
    let typingTimeout: NodeJS.Timeout;

    const type = () => {
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
        setError("Could not find this address. Try a more specific one.");
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
    "flex items-center gap-3 rounded-2xl transition-all duration-300",
    size === "large" ? "px-6 py-4 sm:py-5" : "px-5 py-3.5",
    {
      "bg-white border border-crux-border shadow-lg": variant === "default",
      "bg-white border border-crux-border": variant === "white",
      "bg-[#141414] border border-crux-border-dark": variant === "dark",
    },
    (isFocused || query) && "animate-glow-pulse",
    (isFocused || query) && "border-crux-green",
    className
  );

  const inputStyles = cn(
    "flex-1 outline-none bg-transparent font-medium",
    "text-base",
    {
      "text-crux-text-primary placeholder-crux-text-muted":
        variant !== "dark",
      "text-white placeholder-gray-500": variant === "dark",
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
            "shrink-0 flex items-center justify-center rounded-xl p-2.5 min-w-11 min-h-11 transition-all duration-200",
            query.trim() && !isSubmitting
              ? "bg-gradient-green text-white hover:opacity-90 cursor-pointer"
              : variant === "dark"
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
          aria-label="Submit query"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-500 text-center">{error}</p>
      )}
    </form>
  );
}
