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
    <div className="w-[400px] shadow-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8">
      <Header label={headerLabel} />
      <div className="mt-6">{children}</div>
      {showSocial && (
        <div className="mt-6">
          <Social />
        </div>
      )}
      <div className="mt-6 text-center">
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </div>
    </div>
  );
};