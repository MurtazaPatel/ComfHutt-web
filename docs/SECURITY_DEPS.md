# Security dependency upgrades (2026-11-07)

`pnpm audit` (monorepo, prod+dev), severity counts:

| | critical | high | moderate | low |
|---|---|---|---|---|
| Before | 8 | 43 | 56 | 9 |
| After | 0 | 2 | 29 | 2 |

(Dependabot reported 13 critical / 45 high; it counts per advisory per manifest, pnpm audit per advisory.)

## Fixed
- Direct, same major: `next` 16.2.12 -> 16.4.5 (critical+high; apps/crux and apps/main), `eslint-config-next` -> 16.4.5, `@clerk/nextjs` ^7.6.4 -> ^7.9.25 (minor; sign-in build verified), `nodemailer` ^9.0.4 -> ^9.1.1 (partial).
- Root `pnpm.overrides` (transitive): js-yaml, fast-uri, undici, brace-expansion, source-map-js, proxy-addr (critical), @modelcontextprotocol/sdk, handlebars (critical), zod (all -> ^4.6.7), body-parser, systeminformation, form-data, ws, nanoid. Most come through the `shadcn` CLI, `jest`/`ts-jest` and `jest-environment-jsdom` (dev tooling, not shipped runtime).
- zod 3.x -> 4.x override affects only the shadcn CLI's MCP dependency; if `npx shadcn` misbehaves, drop that one override.

## Remaining
- HIGH x2 (one advisory pair): `nodemailer` in apps/main, fix only in 10.0.6+ (major). See [ASK].
- 29 moderate / 2 low: ws, qs, hono, @hono/node-server, ip-address, glob, minimatch, @humanfs/node, postcss-selector-parser, nodemailer, deepmerge, @tootallnate/once. Mostly dev tooling (shadcn, jest). Plan: add overrides for those with a same-major fix in a follow-up, then re-run `pnpm audit`; revisit after next quarterly bump.

## [ASK] major bumps (not done)
- `nodemailer` 9 -> 10 (apps/main): needed to clear the last 2 HIGH. Breaking-change summary not verified here; review the v10 changelog (transport/option changes, Node engine requirement) before bumping. apps/main only (not crux/Clerk).

## Verification
tsc (apps/crux) clean; `pnpm build` (apps/crux) succeeds; `pnpm design:check` and `pnpm copy:check` clean. `pnpm lint` fails with pre-existing errors in source files (apps/main 58 errors, apps/crux 3); no source files were changed.
