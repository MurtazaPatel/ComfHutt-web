"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { redirectToChoices } from "@/utils/navigation";

export default function OnboardingNavbar() {
  const router = useRouter();

  return (
    <nav
      className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-transparent"
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="flex items-center">
        <Link href="/" className="block" aria-label="ComfHutt Home">
          <Image
            src="/brand/comfhutt-logo.svg"
            alt="ComfHutt"
            width={160}
            height={32}
            className="h-6 w-auto md:h-8"
            priority
          />
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
        <Link href="#how-it-works" className="hover:text-black transition-colors">
          How It Works
        </Link>
        <Link href="#developer-benefits" className="hover:text-black transition-colors">
          Benefits
        </Link>
        <Link href="/docs" className="hover:text-black transition-colors">
          Docs
        </Link>
        <Link href="/marketplace" className="hover:text-black transition-colors">
          Marketplace
        </Link>
      </div>

      <div className="hidden md:block">
        <button
          onClick={() => redirectToChoices(router)}
          className="bg-black text-white px-5 py-2.5 text-sm font-medium rounded-full hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          GET STARTED
        </button>
      </div>
    </nav>
  );
}
