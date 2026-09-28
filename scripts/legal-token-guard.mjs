#!/usr/bin/env node
/**
 * Legal facts guard.
 *
 * Fails a PRODUCTION build while the legal pages are incomplete.
 *
 * Two failure modes, both of which have shipped on real products:
 *
 * 1. A drafting token survives into production — `{{Company Name}}`,
 *    `[INSERT ADDRESS]`, `TBD` — and the Terms of Use reads as a template
 *    somebody forgot to fill in. On a product that publishes adverse opinions
 *    about named businesses, the Terms are the document that stands behind
 *    every grade. A visibly unfinished one is worse than no page at all.
 *
 * 2. A fact that cannot be derived from this codebase is left null. The CIN and
 *    the registered office address come off the certificate of incorporation;
 *    nothing in this repository knows them. A Privacy Policy that gives a data
 *    subject no address to write to does not satisfy the SPDI Rules, and a Terms
 *    of Use that names no legal entity binds nobody.
 *
 * Advisory in development so the pages can be built and reviewed before those
 * facts arrive; hard in production so they cannot be forgotten on the way out.
 * Set LEGAL_GUARD_STRICT=1 to force the hard behaviour locally.
 *
 * Usage: node scripts/legal-token-guard.mjs [appDir]
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const APP = process.argv[2] ?? "apps/crux";
const STRICT =
  process.env.LEGAL_GUARD_STRICT === "1" ||
  process.env.VERCEL_ENV === "production" ||
  process.env.NODE_ENV === "production";

/** Surfaces that carry legal text. */
const ROOTS = [
  `${APP}/src/app/(legal)`,
  `${APP}/src/app/terms`,
  `${APP}/src/app/privacy`,
  `${APP}/src/app/disclaimer`,
  `${APP}/src/app/dispute`,
  `${APP}/src/app/methodology`,
  `${APP}/src/components/legal`,
];
const FILES = [`${APP}/src/config/legal.ts`];

/**
 * Drafting leftovers. Each is [pattern, why].
 *
 * Deliberately narrow: these match the shapes a template actually leaves behind,
 * not any bracket. Prose legitimately contains square brackets (a citation, a
 * link label), so only bracketed ALL-CAPS placeholders and mustache tokens count.
 */
const TOKEN_RULES = [
  [/\{\{[^}]*\}\}/, "unreplaced mustache token"],
  [/\[(?:INSERT|TBD|TODO|PLACEHOLDER|XXX)[^\]]*\]/i, "drafting placeholder"],
  [/\[[A-Z][A-Z0-9 _/-]{3,}\]/, "bracketed ALL-CAPS placeholder"],
  [/\bLorem ipsum\b/i, "placeholder prose"],
  [/\bTBD\b|\bTO BE DECIDED\b/i, "undecided fact in published text"],
  [/\bCIN[:\s]*U?0{4,}/i, "dummy CIN"],
  [/\bexample\.com\b/i, "placeholder domain"],
];

function collect(path) {
  let out = [];
  let info;
  try {
    info = statSync(path);
  } catch {
    return out; // a page that does not exist yet
  }
  if (info.isDirectory()) {
    for (const entry of readdirSync(path)) out = out.concat(collect(join(path, entry)));
  } else if (/\.(tsx?|mdx?)$/.test(path)) {
    out.push(path);
  }
  return out;
}

/** Strip comments: a comment explaining a placeholder is not a placeholder. */
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p) => p + " ".repeat(Math.max(0, m.length - p.length)));
}

const problems = [];

// ── 1. Tokens in the shipped text ───────────────────────────────────────────
const targets = [...ROOTS, ...FILES].flatMap(collect);
for (const file of targets) {
  const lines = stripComments(readFileSync(file, "utf8")).split("\n");
  lines.forEach((line, i) => {
    for (const [pattern, why] of TOKEN_RULES) {
      const hit = line.match(pattern);
      if (hit) {
        problems.push({
          where: `${relative(process.cwd(), file)}:${i + 1}`,
          what: hit[0].trim(),
          why,
        });
      }
    }
  });
}

// ── 2. Facts that must be supplied by a human ───────────────────────────────
// Read the config as text rather than importing it: this script runs under plain
// node with no TypeScript loader, and a regex over a literal object is enough to
// tell `null` from a real value.
const CONFIG = `${APP}/src/config/legal.ts`;
const REQUIRED = [
  ["cin", "Corporate Identity Number, from the certificate of incorporation"],
  ["registeredAddress", "registered office address as recorded on the MCA register"],
];
try {
  const source = readFileSync(CONFIG, "utf8");
  // Read the VALUES, not the interface. `interface LegalFacts` declares
  // `cin: string | null` above the literal, and matching that instead of the
  // assignment made an earlier version of this guard pass while cin was null.
  const literal = source.slice(source.indexOf("export const LEGAL"));
  if (!literal) throw new Error("no LEGAL literal");
  const config = stripComments(literal);
  for (const [key, description] of REQUIRED) {
    const match = config.match(new RegExp(`^\\s*${key}\\s*:\\s*([^,\\n]+)`, "m"));
    const value = match?.[1]?.trim();
    if (!value || value === "null" || value === '""' || value === "''") {
      problems.push({
        where: `${relative(process.cwd(), CONFIG)}`,
        what: `${key} is not set`,
        why: `needs the ${description}`,
      });
    }
  }
} catch {
  problems.push({
    where: CONFIG,
    what: "missing",
    why: "the legal pages read their company facts from this file",
  });
}

if (problems.length > 0) {
  const label = STRICT ? "error" : "warning";
  const log = STRICT ? console.error : console.warn;
  log(`\nlegal-token-guard: ${problems.length} ${label}(s).\n`);
  for (const p of problems) log(`  ${p.where}\n    ${p.what} — ${p.why}\n`);
  if (STRICT) {
    console.error("These pages are what stands behind every published grade. Fill in");
    console.error("apps/crux/src/config/legal.ts before deploying to production.\n");
    process.exit(1);
  }
  console.warn("Advisory in development. This is a HARD FAILURE in production.\n");
  process.exit(0);
}

console.log(`legal-token-guard: clean (${targets.length} files checked).`);
