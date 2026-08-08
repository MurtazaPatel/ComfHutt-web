"use client";

// Structured skeleton for the dashboard content area, shown while the user profile
// (/crux/auth/me) loads — instead of a bare full-page spinner. Mirrors the home
// layout (hero + prompt + stats + recent + two-panel) so the page feels instant and
// keeps its shape while data streams in.

function Block({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-[var(--color-crux-border)] opacity-60 ${className}`}
    />
  );
}

function Card({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div
      className={`bg-[var(--color-crux-bg-primary)] border border-[var(--color-crux-border)] rounded-2xl ${className}`}
    >
      {children}
    </div>
  );
}

export function DashboardContentSkeleton() {
  return (
    <div className="max-w-[960px] mx-auto px-6 py-10" aria-busy="true" aria-label="Loading dashboard">
      {/* Welcome header */}
      <div className="mb-10 space-y-3">
        <Block className="h-[34px] w-[220px]" />
        <Block className="h-[22px] w-[320px]" />
      </div>

      {/* Prompt box */}
      <div className="mb-10">
        <Card className="h-[120px] w-full animate-pulse" />
      </div>

      {/* Quick stats */}
      <div className="mb-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="flex flex-col items-center gap-2 px-6 py-6 animate-pulse">
            <Block className="h-8 w-16" />
            <Block className="h-4 w-20" />
          </Card>
        ))}
      </div>

      {/* Recent research */}
      <div className="mb-10">
        <Block className="h-6 w-[180px] mb-4" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="flex flex-col gap-3 min-w-[280px] max-w-[320px] flex-shrink-0 p-4 animate-pulse">
              <Block className="h-5 w-3/4" />
              <Block className="h-4 w-1/2" />
              <Block className="h-16 w-full" />
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom two-panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="h-[200px] animate-pulse" />
        <Card className="h-[200px] animate-pulse" />
      </div>
    </div>
  );
}
