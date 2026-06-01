"use client";

import { cn } from "@/lib/utils";

const EXAMPLES = [
  "2BHK Satellite, Ahmedabad",
  "Bandra West, Mumbai",
  "Whitefield, Bangalore",
  "DLF Phase 1, Gurgaon",
  "Koregaon Park, Pune",
];

interface ExampleSearchesProps {
  onSelect: (text: string) => void;
}

export function ExampleSearches({ onSelect }: ExampleSearchesProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {EXAMPLES.map((example) => (
        <button
          key={example}
          type="button"
          onClick={() => onSelect(example)}
          className={cn(
            "inline-flex items-center px-[10px] py-[4px]",
            "rounded-full",
            "text-xs font-medium",
            "bg-[#f5f5f5] text-[#6e6e6e]",
            "border-none cursor-pointer",
            "transition-colors duration-150",
            "hover:bg-[#fafafa] hover:text-[#0d0d0d]"
          )}
          style={{
            borderRadius: "9999px",
          }}
        >
          {example}
        </button>
      ))}
    </div>
  );
}
