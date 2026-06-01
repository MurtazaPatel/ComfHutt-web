"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { useCruxUser } from "@/hooks/useCruxUser";

export default function SettingsPage() {
  const { isSignedIn } = useAuth();
  const { user } = useCruxUser();

  return (
    <div className="max-w-[720px] mx-auto px-6 py-10">
      <h2
        style={{
          fontFamily: "var(--font-inter, Inter, sans-serif)",
          fontSize: "28px",
          fontWeight: 600,
          lineHeight: 1.2,
          letterSpacing: "-0.005em",
          color: "#111827",
        }}
        className="mb-8"
      >
        Settings
      </h2>

      <div className="space-y-6">
        {/* Profile */}
        <div
          className="bg-white border border-[#ededed]"
          style={{ borderRadius: "16px", padding: "24px" }}
        >
          <h3
            className="text-[16px] font-semibold text-crux-text-primary mb-4"
            style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
          >
            Profile
          </h3>
          <div className="flex items-center gap-4">
            <UserButton
              appearance={{
                elements: { avatarBox: "w-12 h-12" },
              }}
            />
            <div>
              <p className="text-[14px] font-medium text-crux-text-primary">
                {user?.displayName || user?.email || "User"}
              </p>
              <p className="text-[13px] text-crux-text-secondary">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Plan */}
        <div
          className="bg-white border border-[#ededed]"
          style={{ borderRadius: "16px", padding: "24px" }}
        >
          <h3
            className="text-[16px] font-semibold text-crux-text-primary mb-4"
            style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
          >
            Plan &amp; Usage
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[12px] uppercase tracking-[0.04em] text-[#6e6e6e] mb-1">Plan</p>
              <p className="text-[14px] font-medium capitalize text-crux-text-primary">
                {user?.planTier || "Free"}
              </p>
            </div>
            <div>
              <p className="text-[12px] uppercase tracking-[0.04em] text-[#6e6e6e] mb-1">Watch Credits</p>
              <p className="text-[14px] font-medium text-crux-text-primary">
                {user?.watchCredits ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div
          className="bg-white border border-red-200"
          style={{ borderRadius: "16px", padding: "24px" }}
        >
          <h3
            className="text-[16px] font-semibold text-red-600 mb-2"
            style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
          >
            Danger Zone
          </h3>
          <p className="text-[13px] text-crux-text-secondary mb-4">
            Delete your account and all associated data. This action cannot be undone.
          </p>
          <button
            type="button"
            className="px-4 py-2 text-[13px] font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
