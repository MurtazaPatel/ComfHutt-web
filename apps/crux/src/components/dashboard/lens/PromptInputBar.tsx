"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowUp, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptInputBarProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isLoading: boolean;
  error?: string | null;
}

/** Tallest the composer grows before it scrolls internally. */
const MAX_HEIGHT_PX = 200;

export function PromptInputBar({ onSend, onStop, isLoading, error }: PromptInputBarProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Keyboard shortcut: "/" focuses the composer.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // A "/" that belongs to someone else must not be swallowed:
      // - isComposing: mid-IME composition, where "/" is part of the candidate the
      //   user is typing. preventDefault there silently eats the character.
      // - a modifier: "/" with Ctrl/Cmd/Alt is a browser or OS shortcut.
      if (e.key !== "/" || e.isComposing || e.metaKey || e.ctrlKey || e.altKey) return;

      // Any editable host, not just <input>/<textarea> — a contenteditable (rich text,
      // a comment box, a search combobox) is just as much somewhere "/" is literal.
      const active = document.activeElement as HTMLElement | null;
      if (!active) return;
      const tag = active.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || active.isContentEditable) return;

      e.preventDefault();
      textareaRef.current?.focus();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /**
   * Auto-grow, driven by the value rather than by the change event.
   *
   * It used to run only inside onChange, with handleSubmit separately poking
   * `style.height = "auto"`. Any value change that did not come from a keystroke
   * therefore left the box at its old height, and the two code paths disagreed about
   * who owned it. Keying off `text` means the height always describes what is in the
   * box — including when sending empties it.
   */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`;
  }, [text]);

  const handleSubmit = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setText("");
  }, [text, isLoading, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends, Shift+Enter is a newline — but never while an IME is composing,
    // where Enter commits the candidate.
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="sticky bottom-0 bg-gradient-to-t from-white from-80% to-transparent px-4 pb-6 pt-4 sm:px-6">
      <div className="mx-auto max-w-[768px]">
        <div
          className={cn(
            "flex items-end gap-2 rounded-2xl border border-crux-border bg-white px-3 py-2",
            "transition-colors duration-200 motion-reduce:transition-none",
            "focus-within:border-crux-green focus-within:ring-[3px] focus-within:ring-crux-green/15",
          )}
        >
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "CRUX is responding…" : "Ask anything about this property…"}
            disabled={isLoading}
            rows={1}
            aria-label="Message CRUX Lens"
            className={cn(
              "min-h-[24px] max-h-[200px] flex-1 resize-none border-none bg-transparent py-[4px] outline-none",
              "text-[16px] leading-[1.65] text-crux-text-primary placeholder:text-crux-text-muted",
              "disabled:opacity-50",
            )}
          />

          {isLoading ? (
            <button
              type="button"
              onClick={onStop}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-crux-text-primary text-white transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
              aria-label="Stop generating"
            >
              <Square size={13} fill="currentColor" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!text.trim()}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none",
                text.trim()
                  ? "cursor-pointer bg-crux-green text-white hover:bg-crux-green-mid"
                  : "cursor-not-allowed bg-crux-bg-secondary text-crux-text-muted",
              )}
              aria-label="Send message"
            >
              <ArrowUp size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-2 text-center text-[13px] text-red-600">
            {error}
          </p>
        )}

        {/* Advisory requirement — this line ships. */}
        <p className="mt-2 text-center text-[11px] text-crux-text-muted">
          CRUX Lens may produce inaccurate information. Verify critical decisions independently.
        </p>
      </div>
    </div>
  );
}
