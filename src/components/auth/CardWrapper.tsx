"use client";

import { BackButton } from "@/components/auth/BackButton";
import { Header } from "@/components/auth/Header";
import { Social } from "@/components/auth/Social";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <div className="w-full flex flex-col gap-8">
      <Header label={headerLabel} />
      <div className="w-full">{children}</div>
      {showSocial && (
        <div className="w-full">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-white/40">Or continue with</span>
            </div>
          </div>
          <Social />
        </div>
      )}
      <div className="flex justify-center">
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </div>
    </div>
  );
};