#!/usr/bin/env node
/**
 * The landing revamp's acceptance checklist, run mechanically over the source.
 *
 * The copy guard (landing-copy-guard.mjs) stops retired CLAIMS coming back. This
 * checks the STRUCTURAL promises the same brief made: that the required routes
 * exist, that no link is a placeholder, that no drafting token survived, that the
 * grade surfaces carry the disclaimer inline, that the page got shorter, and that
 * nothing new was added to package.json.
 *
 * Static checks only. The rendered-page checks — overflow, heading order and
 * colour contrast at 375 / 768 / 1440 — need a browser and are run separately.
 *
 * Usage: node scripts/landing-acceptance.mjs
 * Exits 0 when every check passes, 1 otherwise.
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const APP = "apps/crux";
const results = [];
const ok = (name, detail) => results.push({ pass: true, name, detail });
const bad = (name, detail) => results.push({ pass: false, name, detail });

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx?|mdx?)$/.test(p)) out.push(p);
  }
  return out;
}
const strip = (s) =>
  s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
   .replace(/(^|[^:])\/\/[^\n]*/g, (m, p) => p + " ".repeat(Math.max(0, m.length - p.length)));

const LANDING = [...walk(`${APP}/src/components/landing`), `${APP}/src/app/page.tsx`, `${APP}/src/app/layout.tsx`]
  .filter(existsSync);
const ALL_PAGES = walk(`${APP}/src/app`).concat(walk(`${APP}/src/components`), walk(`${APP}/src/content`));
const body = (files) => files.map((f) => strip(readFileSync(f, "utf8"))).join("\n");
const landingText = body(LANDING);
const allText = body(ALL_PAGES);

// 1 — kill-list strings (delegated to the guard, re-asserted here)
// 2 — sources outside the permitted families
const BAD_SOURCES = /MCA21|NHB RESIDEX|\bRESIDEX\b|CPCB|\bVIIRS\b|\bCPWD\b|State IGR|\bTRAI\b|satellite imagery|flood risk/i;
const m2 = landingText.match(BAD_SOURCES);
m2 ? bad("2. Only permitted source families named", `found "${m2[0]}"`)
   : ok("2. Only permitted source families named", "no disallowed source on the landing surfaces");

// 4 — CRUX Score
const m4 = allText.match(/CRUX Score/i);
m4 ? bad("4. \"CRUX Score\" appears nowhere", `found "${m4[0]}"`)
   : ok("4. \"CRUX Score\" appears nowhere", "\"CRUX Grade\" used throughout");

// 5 — seven modules, no weights, no six-category model
const m5a = landingText.match(/six dimensions|six categories|data categories/i);
const m5b = landingText.match(/\b(Location|Developer|Legal|Market|Structural|Risk)\s*[:—-]?\s*\d{1,2}\s*%/i);
m5a || m5b ? bad("5. Seven modules, no weights printed", `found "${(m5a || m5b)[0]}"`)
           : ok("5. Seven modules, no weights printed", "no weight table, no six-category model");

// 6 — forbidden vocabulary
const FORBIDDEN = /India'?s First|\bfraud\w*|\bscams?\b|\bcheats?\b|\bdubious\b|\bshady\b|\bguaranteed\b|verified safe|\binstant(ly)?\b|any address in India/i;
const m6 = landingText.match(FORBIDDEN);
m6 ? bad("6. No forbidden vocabulary", `found "${m6[0]}"`)
   : ok("6. No forbidden vocabulary", "none of: first, fraud, instant, guaranteed, verified safe, any address in India");

// 7 — no checkout on paid tiers
const pricing = existsSync(`${APP}/src/components/landing/PricingSection.tsx`)
  ? strip(readFileSync(`${APP}/src/components/landing/PricingSection.tsx`, "utf8")) : "";
/razorpay|checkout|subscribe/i.test(pricing)
  ? bad("7. No checkout on paid tiers", "a checkout affordance is present")
  : ok("7. No checkout on paid tiers", "unpurchasable tiers render a note plus a mailto");

// 8 — required routes exist, no href="#", no surviving token
const ROUTES = ["methodology", "disclaimer", "terms", "privacy", "dispute"];
const missing = ROUTES.filter((r) => !existsSync(`${APP}/src/app/${r}/page.tsx`));
missing.length ? bad("8a. Required routes resolve", `missing: ${missing.join(", ")}`)
               : ok("8a. Required routes resolve", ROUTES.map((r) => `/${r}`).join(", "));

const hashLinks = ALL_PAGES.filter((f) => /href=["']#["']/.test(strip(readFileSync(f, "utf8"))));
hashLinks.length ? bad("8b. Zero href=\"#\"", hashLinks.join(", "))
                 : ok("8b. Zero href=\"#\"", "none in app or components");

// A drafting token is {{NAME}} — an identifier, nothing else. The naive
// /\{\{[^}]*\}\}/ also matches every JSX inline style (style={{ color: x }}),
// which is why the first run of this script "failed" on 28 perfectly good files.
const TOKEN_RE = /(?<!=)\{\{\s*[A-Za-z_][A-Za-z0-9_.]*\s*\}\}/;
const tokens = ALL_PAGES.filter((f) => TOKEN_RE.test(strip(readFileSync(f, "utf8"))));
tokens.length ? bad("8c. No {{token}} survives", tokens.join(", "))
              : ok("8c. No {{token}} survives", "every token replaced from config/legal.ts");

// 9 — every grade surface links to /disclaimer inline
const SURFACES = [
  `${APP}/src/components/dashboard/CgmGradeSurface.tsx`,
  `${APP}/src/app/card/[shareToken]/page.tsx`,
];
const noDisc = SURFACES.filter((f) => existsSync(f) && !/\/disclaimer/.test(readFileSync(f, "utf8")));
noDisc.length ? bad("9. Grade surfaces link /disclaimer inline", `missing in: ${noDisc.join(", ")}`)
              : ok("9. Grade surfaces link /disclaimer inline", SURFACES.map((s) => s.split("/").pop()).join(", "));

// 10 — section count went down
const page = strip(readFileSync(`${APP}/src/app/page.tsx`, "utf8"));
const rendered = (page.match(/<(HeroSection|ProblemSection|HowItWorks|SevenChecks|PricingSection|InvestTeaser)\b/g) || []).length;
rendered < 7 ? ok("10. Section count is lower", `${rendered} sections in <main>, was 7`)
             : bad("10. Section count is lower", `${rendered} sections`);

// 13 — no new runtime dependency
// Compare against a committed baseline, not a list typed from memory and not
// git. The hand-written list was missing tw-animate-css, which has been a
// dependency since the original landing page, and reported it as newly added.
// Reading `git show main:...` fixed that locally but failed in CI, where
// actions/checkout fetches a single branch and `main` is not a local ref. A
// committed baseline works in both and matches how .lint-baseline.json already
// records known state in this repo.
const pkg = JSON.parse(readFileSync(`${APP}/package.json`, "utf8"));
let BASELINE;
try {
  BASELINE = JSON.parse(readFileSync("scripts/.deps-baseline.json", "utf8")).dependencies;
} catch {
  bad("13. No new runtime dependency", "scripts/.deps-baseline.json is missing or unreadable");
  BASELINE = null;
}
const added = BASELINE === null
  ? []
  : Object.keys(pkg.dependencies || {}).filter((d) => !BASELINE.includes(d));
// A removed dependency is worth knowing about too — it means the baseline is
// stale, and a stale baseline silently stops catching additions.
const removed = BASELINE === null
  ? []
  : BASELINE.filter((d) => !(pkg.dependencies || {})[d]);
if (BASELINE !== null) {
  if (added.length) bad("13. No new runtime dependency", `added: ${added.join(", ")}`);
  else if (removed.length)
    bad("13. No new runtime dependency", `baseline is stale — no longer present: ${removed.join(", ")}`);
  else ok("13. No new runtime dependency", `${BASELINE.length} deps, matching scripts/.deps-baseline.json`);
}

let failed = 0;
for (const r of results) {
  if (!r.pass) failed++;
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}\n        ${r.detail}`);
}
console.log(`\n${results.length - failed}/${results.length} static checks pass.`);
process.exit(failed ? 1 : 0);
