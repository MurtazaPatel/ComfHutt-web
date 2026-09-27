"use client";

import { UserButton } from "@clerk/nextjs";
import { useCruxUser } from "@/hooks/useCruxUser";
import { PageHeading, Surface, SurfaceTitle } from "@/components/dashboard/ui/Surface";

/** A label/value pair in the plan grid. */
function Field({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div>
      <p className="mb-1 text-[12px] uppercase tracking-[0.04em] text-crux-text-secondary">{label}</p>
      <p className="text-[14px] font-medium text-crux-text-primary">{value}</p>
      {note && <p className="mt-1 text-[12px] text-crux-text-muted">{note}</p>}
    </div>
  );
}

/** "free" -> "Free", "pro_monthly" -> "Pro Monthly". */
function titleCase(value: string): string {
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export default function SettingsPage() {
  const { user, isLoading } = useCruxUser();

  return (
    <div className="mx-auto max-w-[720px] px-4 py-10 sm:px-6">
      <PageHeading title="Settings" />

      <div className="space-y-6">
        <Surface>
          <SurfaceTitle>Profile</SurfaceTitle>
          <div className="flex items-center gap-4">
            <UserButton appearance={{ elements: { avatarBox: "w-12 h-12" } }} />
            <div className="min-w-0">
              {/* Only what /crux/auth/me returned. No stand-in name for a profile
                  that hasn't loaded — an empty line is honest, "User" is not. */}
              <p className="truncate text-[14px] font-medium text-crux-text-primary">
                {user?.displayName ?? user?.email ?? (isLoading ? "Loading…" : "")}
              </p>
              {user?.email && (
                <p className="truncate text-[13px] text-crux-text-secondary">{user.email}</p>
              )}
            </div>
          </div>
        </Surface>

        {/* Rendered only once the profile is in hand; a default plan tier would be a
            claim about what this account is paying for. */}
        {user && (
          <Surface>
            <SurfaceTitle>Plan &amp; usage</SurfaceTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* planTier arrives lowercase, and can still read "pro" on an account
                  carrying the retired ₹199 consumer tier. Show it capitalised rather
                  than rewriting it: claiming an account is on Free when the backend
                  says otherwise would be its own inaccuracy. */}
              <Field label="Plan" value={titleCase(user.planTier)} />
              <Field label="Searches run" value={String(user.totalSearches)} />
              <Field
                label="Watch credits"
                value={String(user.watchCredits)}
                // Real spendable balance: the backend seeds these and a watch
                // registration costs one. Alerts themselves are still
                // pending_activation, which the label says rather than implying live
                // monitoring the product does not do yet.
                note="One credit registers a watch on a property. Score-change alerts are not live yet."
              />
            </div>
          </Surface>
        )}

        <Surface className="ring-red-200">
          <SurfaceTitle className="text-red-600">Danger zone</SurfaceTitle>
          <p className="mb-4 text-[13px] text-crux-text-secondary">
            Deleting an account removes it and all associated data. This action cannot be undone.
          </p>
          {/*
            Disabled rather than removed: the row explains the capability exists, and a
            button that looks live but does nothing is worse than one that says why not.
            There is no delete endpoint wired to this app.
          */}
          <button
            type="button"
            disabled
            aria-describedby="delete-account-reason"
            className="cursor-not-allowed rounded-xl border border-crux-border px-4 py-2 text-[13px] font-medium text-crux-text-muted"
          >
            Delete account
          </button>
          <p id="delete-account-reason" className="mt-2 text-[12px] text-crux-text-muted">
            {/* No support address is configured anywhere in this app, so none is
                promised here. */}
            Account deletion is not available in the app yet.
          </p>
        </Surface>
      </div>
    </div>
  );
}
