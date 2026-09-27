"use client";

import { cn } from "@/lib/utils";

/**
 * The assistant's avatar mark.
 *
 * Shared because three places drew it: the answer bubble, the thinking indicator
 * and the loading skeleton — at two different sizes and two different shapes. The
 * indicator therefore visibly jumped into the answer the moment the first token
 * arrived. One mark, one size, no jump.
 */
export function LensAvatar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[2px] bg-crux-green text-white",
        className,
      )}
    >
      {/* ComfHutt house mark (matches the favicon) */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    </div>
  );
}
