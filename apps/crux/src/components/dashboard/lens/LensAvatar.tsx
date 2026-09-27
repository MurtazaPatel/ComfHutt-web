"use client";

import { cn } from "@/lib/utils";
import { ComfHuttMark } from "@/components/brand/ComfHuttMark";

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
        // Same deeper green as the sidebar chip: white-on-#10B981 was 2.6:1.
        "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-crux-green-mid to-crux-green-dark text-white",
        className,
      )}
    >
      <ComfHuttMark className="w-[15px]" />
    </div>
  );
}
