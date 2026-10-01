#!/usr/bin/env node
/**
 * Design-system guard.
 *
 * WHY THIS EXISTS
 * apps/crux/DESIGN.md is the brand and design guideline. A guideline that only
 * lives in a document drifts: the app once carried two greens (#22C55E and
 * #10B981), white text on an emerald fill that measured 2.5:1, and the same
 * card built three different ways. Each was fixed by hand, and each could come
 * back in the next pull request without anyone noticing.
 *
 * This turns the rules that can be checked mechanically into a check.
 *
 * TWO KINDS OF RULE
 *   hard     -> zero tolerance. These were all at zero when the guard was
 *               written, so any hit is new. Each is a brand or accessibility
 *               failure, not a matter of taste.
 *   ratchet  -> counted against scripts/.design-baseline.json. The count may
 *               fall, never rise. Existing debt is printed, not hidden.
 *
 * Lower a baseline number in the same commit that removes the debt. Never raise
 * one: a baseline that can be raised is a rug to sweep things under.
 *
 * Usage: node scripts/design-system-guard.mjs <app-dir>   (e.g. apps/crux)
 * Exits 0 when every rule holds, 1 otherwise.
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..");

const appDir = process.argv[2];
if (!appDir) {
  console.error("usage: node scripts/design-system-guard.mjs <app-dir>   (e.g. apps/crux)");
  process.exit(2);
}
const SRC = join(repoRoot, appDir, "src");

/**
 * Files that must use literal colours and are exempt from the raw-hex count.
 *
 * - opengraph-image: rendered by Satori, which cannot read CSS variables.
 * - lib/grade.ts: the grade bands' colour table. It is itself a token source —
 *   the one place grade colours are defined — so literals there are the point.
 * - auth/SocialAuth: Google's logo, in Google's colours. Another company's mark
 *   is drawn the way that company specifies, not recoloured to ours.
 * - app/preview: a temporary screenshot reference, removed with its route.
 */
const HEX_EXEMPT = [
  /opengraph-image\.tsx$/,
  /lib\/grade\.ts$/,
  /components\/auth\/SocialAuth\.tsx$/,
  /app\/preview\//,
];

/** Anything under these is not product UI and is skipped entirely. */
const SKIP = [/app\/preview\//];

const HARD = [
  {
    id: "rejected-green",
    why: "One green. #10B981 (--color-crux-green) is the brand green; these are the rejected set.",
    pattern: /#(?:22C55E|16A34A|15803D|DCFCE7|4ADE80|86EFAC)\b/gi,
  },
  {
    id: "white-on-emerald",
    why: "White on #10B981 is 2.5:1. Text on an emerald fill is forest ink: use .btn-crux or text-crux-ink.",
    // Same line, either order. A class list is one line in this codebase.
    pattern: /bg-crux-green(?=[\s"'`]).*\btext-white\b|\btext-white\b.*bg-crux-green(?=[\s"'`])/g,
  },
  {
    id: "literal-font",
    why: "Fonts come from the variables (font-sans, font-mono, .t-voice), never a literal family.",
    pattern: /fontFamily\s*:\s*["'`](?!var\()/g,
  },
  {
    id: "tiny-text",
    why: "Nothing a reader has to read is set below 9px; body text is 13px and up.",
    pattern: /\btext-\[[0-8](?:\.\d+)?px\]/g,
  },
];

const RATCHET = [
  {
    id: "raw-hex",
    why: "Use a token. A literal hex is a colour the system does not know about.",
    pattern: /#[0-9A-Fa-f]{6}\b/g,
    exempt: HEX_EXEMPT,
  },
  {
    id: "tailwind-palette",
    why: "Tailwind's stock green/grey scales are not CRUX colours. Use the crux-* tokens.",
    pattern:
      /\b(?:text|bg|border|ring|from|to|via|fill|stroke|divide|outline|decoration|placeholder)-(?:green|emerald|gray|slate|zinc|neutral|stone|lime|teal)-\d{2,3}\b/g,
    exempt: [/lib\/grade\.ts$/],
  },
  {
    id: "transition-all",
    why: "Name the properties. transition-all animates layout properties along with the one you meant.",
    pattern: /\btransition-all\b/g,
  },
  {
    id: "default-shadow",
    why: "Use --shadow-premium-*. Tailwind's stock shadows are neutral grey, not forest-tinted.",
    pattern: /(?<![\w-])shadow-(?:sm|md|lg|xl|2xl)\b/g,
  },
];

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx?|css)$/.test(p)) out.push(p);
  }
  return out;
}

/** Blank out comments, keeping line numbers, so a rule cited in prose is not a hit. */
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:"'`])\/\/[^\n]*/g, (m, lead) => lead + " ".repeat(m.length - lead.length));
}

const files = walk(SRC).filter((f) => !SKIP.some((re) => re.test(f)));
// globals.css defines the tokens, so its literals are the definitions themselves.
const scanned = files.filter((f) => !/app\/globals\.css$/.test(f));

function scan(rule) {
  const hits = [];
  for (const file of scanned) {
    if (rule.exempt?.some((re) => re.test(file))) continue;
    const lines = stripComments(readFileSync(file, "utf8")).split("\n");
    lines.forEach((line, i) => {
      const found = line.match(rule.pattern);
      if (found) {
        for (const text of found) {
          hits.push({ where: `${relative(repoRoot, file)}:${i + 1}`, text: text.slice(0, 60) });
        }
      }
    });
  }
  return hits;
}

let failed = false;

console.log(`design-system-guard: ${scanned.length} files under ${relative(repoRoot, SRC)}\n`);

for (const rule of HARD) {
  const hits = scan(rule);
  if (hits.length === 0) {
    console.log(`PASS  ${rule.id}`);
    continue;
  }
  failed = true;
  console.error(`FAIL  ${rule.id} — ${rule.why}`);
  for (const h of hits.slice(0, 20)) console.error(`        ${h.where}  "${h.text}"`);
  if (hits.length > 20) console.error(`        … and ${hits.length - 20} more`);
}

const baselinePath = join(here, ".design-baseline.json");
let baseline = null;
try {
  baseline = JSON.parse(readFileSync(baselinePath, "utf8")).ratchet;
} catch {
  failed = true;
  console.error("FAIL  scripts/.design-baseline.json is missing or unreadable");
}

if (baseline) {
  for (const rule of RATCHET) {
    const hits = scan(rule);
    const allowed = baseline[rule.id];
    if (typeof allowed !== "number") {
      failed = true;
      console.error(`FAIL  ${rule.id} — no baseline recorded in scripts/.design-baseline.json`);
      continue;
    }
    if (hits.length > allowed) {
      failed = true;
      console.error(`FAIL  ${rule.id} — ${hits.length} found, baseline ${allowed}. ${rule.why}`);
      // The baseline cannot say which hits are the new ones, so list them by file.
      const byFile = new Map();
      for (const h of hits) {
        const file = h.where.replace(/:\d+$/, "");
        byFile.set(file, (byFile.get(file) ?? 0) + 1);
      }
      for (const [file, n] of [...byFile].sort((a, b) => b[1] - a[1]).slice(0, 15)) {
        console.error(`        ${String(n).padStart(3)}  ${file}`);
      }
    } else if (hits.length < allowed) {
      console.log(
        `PASS  ${rule.id} — ${hits.length}, baseline ${allowed}. Lower the baseline to ${hits.length} to keep the gain.`,
      );
    } else {
      console.log(`PASS  ${rule.id}${hits.length ? ` — ${hits.length} known, none new` : ""}`);
    }
  }
}

console.log(failed ? "\ndesign-system-guard: FAILED. See apps/crux/DESIGN.md." : "\ndesign-system-guard: clean.");
process.exit(failed ? 1 : 0);
