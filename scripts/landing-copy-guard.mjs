#!/usr/bin/env node
/**
 * Landing copy guard.
 *
 * Fails the build if a retired claim reappears on the marketing surfaces.
 *
 * This exists because the claims below were not styling mistakes. A hero that
 * promised "builder fraud" for "any address in India" is a defamation exposure
 * attached to real, named builders and a coverage claim the product cannot meet;
 * a printed six-category weight table described an engine that does not exist;
 * "weighted by predictive accuracy against 12 months of closed deal data"
 * described a calibration that has never been run. They were deleted once. The
 * point of this script is that they cannot come back by accident — through a
 * revert, a stale branch, or a well-meaning copy edit.
 *
 * Comments are stripped before matching, so a comment explaining what was removed
 * does not trip the guard. Only shipped copy is checked.
 *
 * Usage: node scripts/landing-copy-guard.mjs [appDir]
 * Exits 0 when clean, 1 with file:line for every violation.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const APP = process.argv[2] ?? "apps/crux";

/** The marketing surfaces. Authenticated screens have their own rules. */
const ROOTS = [
  `${APP}/src/components/landing`,
  `${APP}/src/components/sections`,
];
const FILES = [
  `${APP}/src/components/ChatInput.tsx`,
  `${APP}/src/app/page.tsx`,
  `${APP}/src/app/layout.tsx`,
  `${APP}/src/app/opengraph-image.tsx`,
];

/**
 * Each rule is [pattern, why]. The reason is printed with the failure so whoever
 * trips it learns the rule rather than just deleting words until CI goes green.
 */
const RULES = [
  // ── Retired hero claims ────────────────────────────────────────────────────
  [/India'?s First|first property intelligence/i, "never claim 'first'"],
  [/every property has a score/i, "retired hero line; it is a Grade, not a score"],
  [/any address in India|any property in India|score any property/i, "coverage is Gujarat, districts named"],

  // ── Source families outside the permitted four ─────────────────────────────
  [/MCA21|NHB RESIDEX|\bRESIDEX\b|CPCB|\bVIIRS\b|\bCPWD\b|State IGR|\bTRAI\b/i, "source CRUX has no adapter for"],
  [/satellite imagery|flood risk/i, "not computed by the engine"],

  // ── Retired engine model ───────────────────────────────────────────────────
  [/six dimensions|six categories|data categories/i, "the engine has seven modules"],
  [/predictive accuracy/i, "no calibration has been run"],
  [/can'?t be gamed|cannot be gamed/i, "unevidenced claim"],
  [/\b20\+\s*(signals|parameters|verified|data)|23 data signals/i, "unsourced signal count"],

  // ── Unshipped products ─────────────────────────────────────────────────────
  [/CRUX Cast|CRUX Yield|Liquidity Mesh/i, "not built; endpoints answer 501"],
  [/five dimensions of intelligence/i, "retired product framing"],
  [/top \d+% in area/i, "fabricated percentile"],
  [/updated daily/i, "re-scoring is scheduled, not daily"],

  // ── Retired pricing ────────────────────────────────────────────────────────
  [/₹199|Rs\.?\s*199\b/, "consumer Pro at ₹199 is retired"],
  [/watch credits?/i, "Watch alerts are a stub; not plan copy"],
  [/chai a day/i, "retired pricing line"],
  [/priority re-?scoring|investor fit profile|PDF dossier/i, "unshipped tier feature"],

  // ── Unsourced numbers and superlatives ─────────────────────────────────────
  [/\b18 years saving|1 in 3\b|214 people|skipped the line/i, "unsourced claim"],
  [/Verified Asset|Legal Clarity|8\.4%\s*Net/i, "fabricated demo card"],
  [/12 (Indian )?cities/i, "coverage is Gujarat"],
  [/<\s*90s|90 seconds|results in seconds|\binstant(ly)?\b/i, "unsourced timing claim"],
  [/free forever|completely free/i, "absolute claim; say what the free tier includes"],

  // ── Vocabulary bans ────────────────────────────────────────────────────────
  [/\bfraud\w*|\bscams?\b|\bcheats?\b|\bdubious\b|\bshady\b/i, "forbidden word about a named business"],
  [/\bguaranteed\b|verified safe/i, "no warranty may be implied"],
  [/CRUX Score/i, "it is the CRUX Grade; the composite is secondary"],

  // ── Dead links ─────────────────────────────────────────────────────────────
  [/href=["']#["']/, "placeholder link; every footer link must resolve"],
];

/** Strip comments so an explanation of a removal is not itself a violation. */
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p) => p + " ".repeat(Math.max(0, m.length - p.length)));
}

function collect(path) {
  let out = [];
  let info;
  try {
    info = statSync(path);
  } catch {
    return out; // an optional surface that does not exist in this app
  }
  if (info.isDirectory()) {
    for (const entry of readdirSync(path)) out = out.concat(collect(join(path, entry)));
  } else if (/\.(tsx?|mdx?)$/.test(path)) {
    out.push(path);
  }
  return out;
}

const targets = [...ROOTS, ...FILES].flatMap(collect);
if (targets.length === 0) {
  console.error(`landing-copy-guard: no files found under ${APP} — wrong path?`);
  process.exit(1);
}

const violations = [];
for (const file of targets) {
  const lines = stripComments(readFileSync(file, "utf8")).split("\n");
  lines.forEach((line, i) => {
    for (const [pattern, why] of RULES) {
      const hit = line.match(pattern);
      if (hit) {
        violations.push({
          where: `${relative(process.cwd(), file)}:${i + 1}`,
          text: hit[0].trim(),
          why,
        });
      }
    }
  });
}

if (violations.length > 0) {
  console.error(`\nlanding-copy-guard: ${violations.length} retired claim(s) are back.\n`);
  for (const v of violations) console.error(`  ${v.where}\n    "${v.text}" — ${v.why}\n`);
  console.error("These were removed deliberately. If a claim is now true and evidenced,");
  console.error("update the rule in scripts/landing-copy-guard.mjs in the same commit.\n");
  process.exit(1);
}

console.log(`landing-copy-guard: clean (${targets.length} files, ${RULES.length} rules).`);
