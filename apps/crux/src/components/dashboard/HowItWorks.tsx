"use client";

import { MapPin, FileSearch, Award, type LucideIcon } from "lucide-react";
import { Surface, SurfaceTitle } from "./ui/Surface";

/**
 * Three steps, each one something the product actually does.
 *
 * The old copy claimed a database count nothing in the code supports, and used
 * emoji as icons.
 */
const STEPS: Array<{ icon: LucideIcon; title: string; detail: string }> = [
  {
    icon: MapPin,
    title: "Name the property",
    detail: "Type a project name or address in Gujarat — that is the area CRUX covers.",
  },
  {
    icon: FileSearch,
    title: "CRUX reads the public record",
    detail: "RERA filings, court and tribunal cases, and company filings for the developer.",
  },
  {
    icon: Award,
    title: "You get a CRUX Grade",
    detail: "A letter grade with the records behind it, so you can check the reasoning yourself.",
  },
];

export function HowItWorks() {
  return (
    <Surface as="section" className="h-full">
      <SurfaceTitle as="h2">How CRUX works</SurfaceTitle>

      <ol className="flex flex-col gap-4">
        {STEPS.map(({ icon: Icon, title, detail }, idx) => (
          <li key={title} className="flex items-start gap-3">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-crux-green-tint">
              <Icon size={14} strokeWidth={1.75} aria-hidden="true" className="text-crux-green" />
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-medium text-crux-text-primary">
                {idx + 1}. {title}
              </p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-crux-text-secondary">{detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </Surface>
  );
}
