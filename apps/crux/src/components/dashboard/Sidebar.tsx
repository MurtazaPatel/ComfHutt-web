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
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: House },
  { href: "/dashboard/properties", label: "Properties", icon: Building2 },
  { href: "/dashboard/lens", label: "Lens", icon: MessageSquare },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex fixed left-0 top-0 h-full w-[72px] hover:w-60 flex-col bg-white border-r border-crux-border z-40 transition-all duration-300 group overflow-hidden"
      >
      {/* Logo */}
      <div className="flex items-center px-4 mt-4 h-10 w-full">
        <Link
          href="/dashboard"
          className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-crux-green hover:bg-crux-green-mid transition-colors duration-150"
          aria-label="CRUX Dashboard"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </Link>
        <span className="ml-3 text-lg font-bold text-crux-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          CRUX
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-2 mt-8 flex-1 px-4 w-full">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "relative flex items-center w-10 group-hover:w-full h-10 rounded-lg transition-all duration-150",
                active
                  ? "text-crux-green bg-crux-green-tint"
                  : "text-crux-text-muted hover:text-crux-text-primary hover:bg-gray-100"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-crux-green rounded-r-full" />
              )}
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <span className="ml-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium text-[14px]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* User avatar */}
      <div className="px-4 mb-6 w-full flex items-center">
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
                userButtonAvatarBox: "w-8 h-8",
              },
            }}
          />
        </div>
        <span className="ml-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium text-[14px] text-crux-text-secondary">
          Profile & Settings
        </span>
      </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-crux-border z-40 flex items-center justify-around px-2 pb-safe">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-14 h-14 rounded-lg",
                active ? "text-crux-green" : "text-crux-text-muted hover:text-crux-text-primary"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
        <div className="flex flex-col items-center justify-center w-14 h-14 rounded-lg">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-6 h-6",
                userButtonAvatarBox: "w-6 h-6",
              },
            }}
          />
          <span className="text-[10px] mt-1 font-medium text-crux-text-muted">Profile</span>
        </div>
      </nav>
    </>
  );
}
