"use client";

import { cn } from "@/lib/utils";

/**
 * Localities inside CRUX's coverage.
 *
 * Every example the chips used to offer was outside Gujarat, so tapping one
 * demonstrated the product failing.
 */
const EXAMPLES = [
  "Bodakdev, Ahmedabad",
  "Vesu, Surat",
  "Alkapuri, Vadodara",
  "Kalawad Road, Rajkot",
  "Sector 11, Gandhinagar",
];

interface ExampleSearchesProps {
  onSelect: (text: string) => void;
}

export function ExampleSearches({ onSelect }: ExampleSearchesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {EXAMPLES.map((example) => (
        <button
          key={example}
          type="button"
          onClick={() => onSelect(example)}
          className={cn(
            "inline-flex cursor-pointer items-center rounded-full px-[10px] py-[4px]",
            "text-xs font-medium",
            "bg-crux-bg-secondary text-crux-text-secondary",
            "transition-colors duration-150 motion-reduce:transition-none",
            "hover:bg-crux-bg-accent hover:text-crux-text-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2",
          )}
        >
          {example}
        </button>
      ))}
    </div>
  );
}
