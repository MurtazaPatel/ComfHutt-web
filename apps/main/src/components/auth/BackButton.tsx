"use client";

import Link from "next/link";

interface BackButtonProps {
  href: string;
  label: string;
}

export const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Link
      href={href}
      className="font-normal w-full text-sm text-white/50 hover:text-white transition-colors"
    >
      {label}
    </Link>
  );
};