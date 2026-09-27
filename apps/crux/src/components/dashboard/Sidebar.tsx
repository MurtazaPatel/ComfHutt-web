"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  House,
  Building2,
  MessageSquare,
  FileText,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { ComfHuttMark } from "@/components/brand/ComfHuttMark";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** The four destinations that fit a phone's bottom bar. */
const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: House },
  { href: "/dashboard/properties", label: "Properties", icon: Building2 },
  { href: "/dashboard/lens", label: "Lens", icon: MessageSquare },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
];

/**
 * Settings had a page and an imported icon but no nav entry, so the only way in
 * was to type the URL. It is listed last on both breakpoints.
 */
const SETTINGS_ITEM: NavItem = { href: "/dashboard/settings", label: "Settings", icon: Settings };

const ALL_ITEMS: NavItem[] = [...NAV_ITEMS, SETTINGS_ITEM];

/** One weight pair for both breakpoints; they used to disagree. */
function iconStroke(active: boolean) {
  return active ? 2.2 : 1.8;
}

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/*
        Desktop rail. It widens on hover *and* on focus-within, because the labels
        used to be `opacity-0` until hover: a keyboard user tabbing the nav landed on
        invisible link text. Every link also carries an explicit `aria-label`, so the
        accessible name exists in the collapsed state regardless of what is painted —
        a `title` tooltip is not an accessible name.

        The width itself is not transitioned. `transition-all` on `w-[72px] → w-60`
        animated layout on every frame of the hover, which janks the whole main column
        beside it; only colour and label opacity move.
      */}
      <aside className="group fixed left-0 top-0 z-40 hidden h-dvh w-[72px] flex-col overflow-hidden border-r border-crux-border bg-white hover:w-60 focus-within:w-60 md:flex">
        <div className="mt-4 flex h-10 w-full items-center px-4">
          {/*
            The lockup. Two things were wrong: the glyph was a generic lucide house
            outline, not the ComfHutt mark, and it sat on flat #10B981 — a white mark
            on that green measures 2.6:1, under the 3:1 floor for a non-text graphic.
            The deeper gradient (#059669 -> #047857) takes the same white mark to
            ~3.8-5.5:1 and reads as a solid brand chip rather than a flat swatch.
          */}
          <Link
            href="/dashboard"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-crux-green-mid to-crux-green-dark text-white shadow-sm transition-shadow duration-150 hover:shadow-[var(--shadow-premium-glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
            aria-label="CRUX dashboard home"
          >
            <ComfHuttMark className="w-[19px]" />
          </Link>
          <span className="ml-3 whitespace-nowrap text-lg font-bold text-crux-text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none">
            CRUX
          </span>
        </div>

        <nav aria-label="Dashboard" className="mt-8 flex w-full flex-1 flex-col gap-2 px-4">
          {ALL_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-10 w-10 items-center rounded-lg transition-colors duration-150 group-hover:w-full group-focus-within:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green motion-reduce:transition-none",
                  active
                    ? "bg-crux-green-tint text-crux-green"
                    : "text-crux-text-muted hover:bg-crux-bg-secondary hover:text-crux-text-primary",
                )}
              >
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-crux-green"
                  />
                )}
                <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                  <Icon size={20} strokeWidth={iconStroke(active)} aria-hidden="true" />
                </span>
                <span
                  aria-hidden="true"
                  className="ml-3 whitespace-nowrap text-[14px] font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none"
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mb-6 flex w-full items-center px-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                  userButtonAvatarBox: "w-8 h-8",
                },
              }}
            />
          </span>
          <span className="ml-3 whitespace-nowrap text-[14px] font-medium text-crux-text-secondary opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none">
            Account
          </span>
        </div>
      </aside>

      {/*
        Mobile bottom bar. `pb-safe` was a class this Tailwind v4 setup never
        defined (no plugin, no `@utility`), so the bar sat under the home indicator
        on iOS — real safe-area padding instead. Tiles flex rather than taking a
        fixed 56px so six of them still fit at 360px without a horizontal scroll.
      */}
      <nav
        aria-label="Dashboard"
        className="fixed bottom-0 left-0 right-0 z-40 flex items-stretch justify-around border-t border-crux-border bg-white px-1 pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {ALL_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-16 min-w-0 flex-1 basis-0 flex-col items-center justify-center rounded-lg px-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green",
                active ? "text-crux-green" : "text-crux-text-muted hover:text-crux-text-primary",
              )}
            >
              <Icon size={20} strokeWidth={iconStroke(active)} aria-hidden="true" />
              <span className="mt-1 w-full truncate text-center text-[10px] font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
        <div className="flex h-16 min-w-0 flex-1 basis-0 flex-col items-center justify-center px-0.5">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-6 h-6",
                userButtonAvatarBox: "w-6 h-6",
              },
            }}
          />
          <span className="mt-1 w-full truncate text-center text-[10px] font-medium text-crux-text-muted">
            Account
          </span>
        </div>
      </nav>
    </>
  );
}
