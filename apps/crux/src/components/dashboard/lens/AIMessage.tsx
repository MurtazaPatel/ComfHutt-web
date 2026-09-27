"use client";

import { createContext, useContext, useEffect, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";
import { LensAvatar } from "./LensAvatar";

interface AIMessageProps {
  content: string;
  /**
   * False while this answer is still streaming — copying half an answer and acting
   * on it is exactly the mistake this product exists to prevent.
   */
  canCopy?: boolean;
}

/**
 * react-markdown v10 tells a `code` component nothing about its parent: there is no
 * `inline` prop (removed in v9) and `node` is the element itself, with no pointer
 * upwards. The previous test — `!match && !className` — therefore misread a fence
 * with no language ("```\n…\n```"), which also carries no className, as inline code;
 * and because the `code` renderer emitted its own `<pre>`, every real code block
 * came out as `<pre><pre><code>`. The wrapper now tells the child where it is.
 */
const InsidePre = createContext(false);

function CodeToken({ className, children }: { className?: string; children?: React.ReactNode }) {
  const insidePre = useContext(InsidePre);
  if (insidePre) {
    // The <pre> above already carries the block treatment; keep the syntax class.
    return <code className={className}>{children}</code>;
  }
  return (
    <code className="rounded bg-crux-bg-secondary px-1.5 py-0.5 font-mono text-[0.9em] text-crux-text-primary">
      {children}
    </code>
  );
}

const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-4 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-crux-text-primary">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  h1: ({ children }) => (
    <h1 className="mb-3 mt-4 text-[19px] font-bold text-crux-text-primary first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 mt-4 text-[17px] font-bold text-crux-text-primary first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-3 text-[15px] font-bold text-crux-text-primary first:mt-0">{children}</h3>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-crux-green underline decoration-crux-green/30 underline-offset-2 hover:decoration-crux-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2"
    >
      {children}
    </a>
  ),
  pre: ({ children }) => (
    <InsidePre.Provider value={true}>
      <pre className="mb-4 overflow-x-auto rounded-lg border border-crux-border bg-crux-bg-secondary p-4 font-mono text-[13px] text-crux-text-primary last:mb-0">
        {children}
      </pre>
    </InsidePre.Provider>
  ),
  code: ({ className, children }) => <CodeToken className={className}>{children}</CodeToken>,
  table: ({ children }) => (
    <div className="mb-4 overflow-x-auto last:mb-0">
      <table className="min-w-full divide-y divide-crux-border overflow-hidden rounded-lg border border-crux-border">
        {children}
      </table>
    </div>
  ),
  // `style` carries GFM column alignment — dropping it silently left-aligns every column.
  th: ({ children, style }) => (
    <th style={style} className="bg-crux-bg-secondary px-4 py-2 text-left text-[13px] font-semibold text-crux-text-primary">
      {children}
    </th>
  ),
  td: ({ children, style }) => (
    <td style={style} className="border-t border-crux-border px-4 py-2 text-[13px]">
      {children}
    </td>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-4 rounded-r-lg border-l-4 border-crux-border bg-crux-bg-secondary py-1 pl-4 italic text-crux-text-secondary last:mb-0">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="mb-4 border-crux-border last:mb-0" />,
};

export function AIMessage({ content, canCopy = true }: AIMessageProps) {
  /**
   * idle → copied → idle, or one-way to "unavailable".
   *
   * navigator.clipboard is undefined on an insecure origin (a LAN IP over http, which
   * is how this gets demoed) and writeText can also be refused by permission policy.
   * Probing it during render would disagree with the server-rendered markup, so the
   * button stays until a real attempt fails — and then says so rather than sitting
   * there doing nothing.
   */
  const [copyState, setCopyState] = useState<"idle" | "copied" | "unavailable">("idle");

  useEffect(() => {
    if (copyState !== "copied") return;
    const t = setTimeout(() => setCopyState("idle"), 1600);
    return () => clearTimeout(t);
  }, [copyState]);

  const handleCopy = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(content);
      setCopyState("copied");
    } catch {
      setCopyState("unavailable");
    }
  };

  const copied = copyState === "copied";
  const showCopy = canCopy && copyState !== "unavailable" && content.trim().length > 0;

  // The copy button stays visible rather than appearing on hover — there is no hover
  // on a phone, and this is an answer people are meant to act on.
  return (
    <div className="flex gap-3 px-4 sm:gap-4 sm:px-6">
      <LensAvatar />

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <p className="text-[14px] font-semibold text-crux-text-primary">CRUX Lens</p>
          {showCopy && (
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Answer copied" : "Copy answer"}
              className="flex h-7 w-7 items-center justify-center rounded-md text-crux-text-muted transition-colors hover:bg-crux-bg-secondary hover:text-crux-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
            >
              {copied ? <Check size={14} className="text-crux-green" /> : <Copy size={14} />}
            </button>
          )}
          {copyState === "unavailable" && (
            <span className="text-[11px] text-crux-text-muted">
              Copying needs a secure connection
            </span>
          )}
          {/* The icon swap alone is silent, so announce the result too. */}
          <span className="sr-only" role="status">
            {copied ? "Answer copied to clipboard" : ""}
          </span>
        </div>

        <div className="break-words text-[15px] leading-[1.65] text-crux-text-primary">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
