"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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
            setDisplayedPlaceholder("");
            charIndex = 0;
          }
        }, 3000);
      }
    };

    if (isTyping && !query) {
      typingTimeout = setTimeout(type, 100);
    }

    return () => clearTimeout(typingTimeout);
  }, [isTyping, placeholderIndex, query, placeholder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (onSubmit) {
      onSubmit(query);
    } else {
      router.push(`/chat?q=${encodeURIComponent(query)}`);
    }

    setQuery("");
    setDisplayedPlaceholder("");
    setPlaceholderIndex(0);
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
    size === "large" ? "text-base" : "text-sm",
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
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsTyping(false);
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
          disabled={!query.trim()}
          className={cn(
            "shrink-0 flex items-center justify-center rounded-xl p-2.5 transition-all duration-200",
            query.trim()
              ? "bg-gradient-green text-white hover:opacity-90 cursor-pointer"
              : variant === "dark"
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
          aria-label="Submit query"
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}
