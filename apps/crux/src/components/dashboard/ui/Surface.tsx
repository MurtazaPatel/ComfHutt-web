"use client";

import { cn } from "@/lib/utils";

/**
 * The one card treatment the dashboard uses.
 *
 * Before this there were two, mixed arbitrarily across screens: a hairline
 * `border border-[#ededed]` box on the home page and a `ring-1 ring-black/5`
 * plus soft-shadow box on the grading page, each with its own hand-written
 * radius, padding and hover rule. Same visual role, two different looks, so
 * moving between screens felt like moving between products.
 *
 * Every surface now comes from here. Padding is the only knob a caller
 * normally needs; anything beyond that belongs in `className`.
 */
export function Surface({
  children,
  className,
  padding = "default",
  interactive = false,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** `default` = 24px (a content card), `tight` = 16px (a nested block), `none` = self-managed. */
  padding?: "default" | "tight" | "none";
  /** Adds the lift-on-hover affordance. Only for a surface that is itself a link or button. */
  interactive?: boolean;
  as?: "div" | "section" | "article";
}) {
  return (
    <Tag
      className={cn(
        "rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
        padding === "default" && "p-6",
        padding === "tight" && "p-4",
        interactive &&
          "transition-shadow duration-200 hover:shadow-[0_12px_36px_rgb(0,0,0,0.07)] motion-reduce:transition-none",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * A card's own heading. Kept as a component so the type scale can't drift —
 * the same heading was previously written at 14px, 16px and 20px on different
 * cards, each with the font family repeated inline even though `<html>` already
 * sets it.
 */
export function SurfaceTitle({
  children,
  className,
  as: Tag = "h3",
  action,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h2" | "h3";
  /** Optional trailing control (a link, a filter) aligned with the title. */
  action?: React.ReactNode;
}) {
  if (action) {
    return (
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <Tag className={cn("text-[15px] font-semibold tracking-tight text-crux-text-primary", className)}>
          {children}
        </Tag>
        {action}
      </div>
    );
  }
  return (
    <Tag className={cn("mb-4 text-[15px] font-semibold tracking-tight text-crux-text-primary", className)}>
      {children}
    </Tag>
  );
}

/** A page's own heading block — title plus one line of context. */
export function PageHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-bold leading-tight tracking-tight text-crux-text-primary">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-crux-text-secondary">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
