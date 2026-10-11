# CRUX UI revamp — status and next step

Last updated: 2026-10-11. Branch: `experiment/crux-ui-polish`.

## Done

The **public, signed-out** frontend is on one fixed design system.

- Landing page (`/`), `/score`, `/signin`, `/signup`, `/forgot-password`, and the legal pages.
- Brand guidelines: `DESIGN.md` (this folder). Tokens and classes: `src/app/globals.css`.
- Motion graphics: `src/components/motion/`, `src/hooks/useSpotlight.ts`.
- Enforcement: `pnpm design:check` (hard gate in CI, baseline all zeros).
- Checked at 24 screen sizes, 320 to 2560px (matrix in `DESIGN.md` section 8).
- Copy was not changed. `pnpm copy:check` and `pnpm landing:check` guard it.

## Next step: redesign the signed-in screens

Everything a user sees after signing in has **not** been redesigned or visually reviewed:

- `/dashboard` (home), `/dashboard/properties`, `/dashboard/properties/[id]`
- `/dashboard/reports`, `/dashboard/lens`, `/dashboard/settings`
- `/onboarding`, `/score/[propertyId]` (grade result), `/card/[shareToken]`

What the polish pass already did to them, unseen: they inherit the new tokens, and
18 primary buttons changed from white text to forest-ink text on emerald. Look at
those first.

### How to start

1. Read `DESIGN.md`, especially section 10 (app screens: density, one ink block per
   screen, `.t-voice` at most once, designed empty/loading/error states).
2. Get the screens on screen. The signed-in pages need a Clerk session and the
   backend, which is down while the GCP project is suspended. Options:
   - Run with `NEXT_PUBLIC_USE_MOCKS=true` (CI already does) and sign in once with a
     Clerk test account in the browser being driven. Sample data fills the screens.
   - Or design from the code and review visually afterwards. Faster, riskier.
3. Audit each screen against the checklist in `DESIGN.md` section 12, then redesign
   one screen at a time, starting with the dashboard home.
4. Re-run the 24-size sweep and `pnpm design:check` before each commit.

### Order suggested

1. Dashboard shell (sidebar, top bar) and home
2. Property grade page (`/dashboard/properties/[id]`) and the public `/score/[propertyId]`
3. Properties and reports lists
4. Lens
5. Settings and onboarding

## Open items

- `apps/crux/.git` is a stale nested repo that catches git commands run from this
  folder. Run git from the monorepo root, or delete it.
- Local `main` goes stale. Run `git fetch` and branch from `origin/main`.
- `backup/crux-ui-polish-stale-base` (local only) is an obsolete first attempt. Safe to delete.
- 21st.dev MCP and Motion+ need authorizing from an interactive session (`/mcp`);
  neither was used for the shipped work.
- Known lint debt: 3 errors (`react-hooks/set-state-in-effect` in `hooks/`), held by
  `.lint-baseline.json`.
- Lighthouse Best Practices is 73 locally, from Clerk development-key cookies.
