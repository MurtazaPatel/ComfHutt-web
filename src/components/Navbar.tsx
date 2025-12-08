"use client";

import React from "react";
import Link from "next/link";
// import { User } from "next-auth"; // Optional: Import types if strictly needed, but `any` might suffice for a fix

interface NavbarProps {
  user?: any; // Using any to avoid complex type import issues for this fix
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-4 flex items-center justify-between text-white">
      <Link href="/" className="font-bold text-xl tracking-tight">
        COMFHUTT DASHBOARD
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
            <span className="text-sm">Welcome, {user.name || "User"}</span>
        ) : (
            <Link href="/auth/signin" className="text-sm hover:underline">Sign In</Link>
        )}
      </div>
    </nav>
  );
}