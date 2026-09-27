import { ThinkingIndicator } from "./ThinkingIndicator";

/**
 * Loading state for the transcript.
 *
 * Every shape here mirrors the real thing it stands in for — same 30px square
 * avatar, same gutters, same right-aligned user bubble, same tool-card indent — so
 * the column does not visibly re-lay-out the instant the history arrives.
 */
const pulse = "animate-pulse motion-reduce:animate-none";

export function LensChatSkeleton() {
  return (
    <div
      className="mx-auto flex w-full max-w-[768px] flex-1 flex-col gap-6 overflow-y-auto py-6"
      aria-hidden="true"
    >
      {/* Assistant answer */}
      <div className="flex gap-3 px-4 sm:gap-4 sm:px-6">
        <div className={`h-[30px] w-[30px] shrink-0 rounded-[2px] bg-crux-bg-secondary ${pulse}`} />
        <div className="flex w-full min-w-0 flex-col gap-2">
          <div className={`h-4 w-[92px] rounded bg-crux-bg-secondary ${pulse}`} />
          <div className={`h-4 w-3/4 rounded bg-crux-bg-secondary ${pulse}`} />
          <div className={`h-4 w-2/3 rounded bg-crux-bg-secondary ${pulse}`} />
        </div>
      </div>

      {/* User question */}
      <div className="flex justify-end px-4 sm:px-6">
        <div className={`h-[46px] w-[60%] rounded-2xl bg-crux-bg-secondary sm:w-[45%] ${pulse}`} />
      </div>

      {/* Assistant answer carrying a module result */}
      <div className="flex gap-3 px-4 sm:gap-4 sm:px-6">
        <div className={`h-[30px] w-[30px] shrink-0 rounded-[2px] bg-crux-bg-secondary ${pulse}`} />
        <div className="flex w-full min-w-0 flex-col gap-2">
          <div className={`h-4 w-[92px] rounded bg-crux-bg-secondary ${pulse}`} />
          <div className={`h-4 w-full rounded bg-crux-bg-secondary ${pulse}`} />
          <div className={`mt-2 h-[104px] w-full max-w-[420px] rounded-2xl bg-crux-bg-secondary ${pulse}`} />
        </div>
      </div>

      <ThinkingIndicator label="Connecting to CRUX…" />
    </div>
  );
}
