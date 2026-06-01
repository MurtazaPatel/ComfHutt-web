"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function ReportSection({ title, children, defaultOpen = false }: ReportSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#ededed] last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full py-3 text-left hover:bg-gray-50 transition-colors px-1"
      >
        {isOpen ? (
          <ChevronDown size={14} className="text-crux-text-muted flex-shrink-0" />
        ) : (
          <ChevronRight size={14} className="text-crux-text-muted flex-shrink-0" />
        )}
        <span
          className="text-[14px] font-medium text-crux-text-primary"
          style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
        >
          {title}
        </span>
      </button>
      {isOpen && (
        <div className="pb-3 pl-7">
          {children}
        </div>
      )}
    </div>
  );
}
