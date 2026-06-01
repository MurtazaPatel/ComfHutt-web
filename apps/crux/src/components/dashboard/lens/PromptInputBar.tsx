"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowUp, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptInputBarProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isLoading: boolean;
  sessionExpired?: boolean;
  onCreateNew?: () => void;
  error?: string | null;
}

export function PromptInputBar({
  onSend,
  onStop,
  isLoading,
  sessionExpired,
  onCreateNew,
  error,
}: PromptInputBarProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Keyboard shortcut: "/" focuses input
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        textareaRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, []);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (sessionExpired) {
    return (
      <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-8 pb-6 px-6">
        <div
          className="max-w-[768px] mx-auto flex flex-col items-center gap-2 border border-[#e5e5e5] bg-white py-4"
          style={{ borderRadius: "16px" }}
        >
          <p className="text-[14px] text-crux-text-secondary">Session expired.</p>
          <button
            type="button"
            onClick={onCreateNew}
            className="px-4 py-2 text-sm font-medium bg-crux-green text-white rounded-lg hover:bg-crux-green-mid transition-colors"
          >
            Start a new session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="sticky bottom-0 pb-6 px-6"
      style={{
        background: "linear-gradient(to top, white 80%, transparent)",
        paddingTop: "16px",
      }}
    >
      <div className="max-w-[768px] mx-auto">
        <div
          className={cn(
            "flex items-end gap-2 border bg-white transition-all duration-[220ms]",
            "focus-within:border-crux-green focus-within:shadow-[0_0_0_3px_rgba(34,197,94,0.12)]",
            "border-[#e5e5e5]"
          )}
          style={{ borderRadius: "16px", padding: "8px 12px" }}
        >
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              adjustHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "CRUX is responding..." : "Ask anything about this property..."}
            disabled={isLoading}
            rows={1}
            className={cn(
              "flex-1 border-none outline-none resize-none bg-transparent",
              "text-[16px] leading-[1.65] text-crux-text-primary placeholder:text-crux-text-muted",
              "disabled:opacity-50 py-[4px]"
            )}
            style={{
              fontFamily: "var(--font-inter, Inter, sans-serif)",
              minHeight: "24px",
              maxHeight: "200px",
            }}
          />

          {isLoading ? (
            <button
              type="button"
              onClick={onStop}
              className="flex items-center justify-center flex-shrink-0 bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              style={{ width: "32px", height: "32px", borderRadius: "8px" }}
              aria-label="Stop"
            >
              <Square size={14} fill="white" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!text.trim()}
              className={cn(
                "flex items-center justify-center flex-shrink-0 transition-colors duration-150",
                text.trim()
                  ? "bg-crux-green text-white hover:bg-crux-green-mid cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
              style={{ width: "32px", height: "32px", borderRadius: "8px" }}
              aria-label="Send"
            >
              <ArrowUp size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {error && (
          <p className="mt-2 text-center text-[13px] text-red-500">
            {error}
          </p>
        )}

        <p
          className="text-center text-[11px] text-[#9b9b9b] mt-2"
          style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
        >
          CRUX Lens may produce inaccurate information. Verify critical decisions independently.
        </p>
      </div>
    </div>
  );
}
