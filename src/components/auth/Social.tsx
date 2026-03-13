"use client";

import { googleLogin } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaLinkedin } from "react-icons/fa";

export const Social = () => {
  const onClick = (provider: "google" | "apple" | "linkedin") => {
    if (provider === "google") {
      googleLogin();
    } else {
      console.warn(`Login with ${provider} is not supported yet`);
    }
  };

  return (
    <div className="flex items-center w-full gap-x-4">
      <button
        className="w-full flex items-center justify-center h-12 rounded-full border border-white/20 hover:bg-white/5 transition-all hover:border-white/40"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-5 w-5" />
      </button>
      <button
        className="w-full flex items-center justify-center h-12 rounded-full border border-white/20 hover:bg-white/5 transition-all hover:border-white/40"
        onClick={() => onClick("apple")}
      >
        <FaApple className="h-5 w-5 text-white" />
      </button>
      <button
        className="w-full flex items-center justify-center h-12 rounded-full border border-white/20 hover:bg-white/5 transition-all hover:border-white/40"
        onClick={() => onClick("linkedin")}
      >
        <FaLinkedin className="h-5 w-5 text-[#0077b5]" />
      </button>
    </div>
  );
};