"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  /** Optional trailing marker (a module score, a "not assessed" note). */
  meta?: React.ReactNode;
}

export function ReportSection({ title, children, defaultOpen = false, meta }: ReportSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className="border-b border-crux-border last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center gap-2 rounded-lg px-1 py-3 text-left transition-colors hover:bg-crux-bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green motion-reduce:transition-none"
      >
        {/* One icon rotated, so the chevron can't disagree with itself between states. */}
        <ChevronDown
          size={14}
          className={cn(
            "shrink-0 text-crux-text-muted transition-transform duration-150 motion-reduce:transition-none",
            !isOpen && "-rotate-90",
          )}
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1 text-[14px] font-medium text-crux-text-primary">{title}</span>
        {meta && <span className="shrink-0 text-[12px] text-crux-text-muted">{meta}</span>}
      </button>
      <div id={panelId} hidden={!isOpen} className="pb-3 pl-7">
        {children}
      </div>
    </div>
  );
}
