#!/usr/bin/env node
/**
 * Lint gate with a baseline.
 *
 * WHY THIS EXISTS
 * `pnpm lint` in this repo was completely dead for months:
 *   TypeError: Error while loading rule 'react/display-name':
 *   contextOrFilename.getFilename is not a function
 * eslint-plugin-react@7.37.5 (the newest published version) declares peer
 * `eslint ^3 || … || ^9.7`, so ESLint 10 was never supported. CI ran lint with
 * `continue-on-error: true`, so the crash produced a green tick and nobody knew
 * the frontend had no linting at all.
 *
 * A plain `eslint .` cannot express what we need, because it exits 1 both for
 * "there are 32 known pre-existing errors" and for "you just added a new one".
 * This gate separates the three outcomes that actually matter:
 *
 *   crash          -> ALWAYS FAIL. This is the failure mode that hid for months.
 *                     A linter that cannot run is worse than none, because it
 *                     looks like coverage.
 *   errors > base  -> FAIL. New errors cannot be introduced.
 *   errors <= base -> pass, and print the remaining debt.
 *
 * Lower BASELINE as the backlog is burned down. It may never be raised: raising
 * it is how a baseline turns into a rug to sweep things under.
 */

import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');
const baselinePath = join(repoRoot, '.lint-baseline.json');

const appDir = process.argv[2];
if (!appDir) {
  console.error('usage: node scripts/lint-gate.mjs <app-dir>   (e.g. apps/crux)');
  process.exit(2);
}

const baseline = existsSync(baselinePath)
  ? JSON.parse(readFileSync(baselinePath, 'utf8'))
  : {};
const allowed = baseline[appDir]?.maxErrors;

if (typeof allowed !== 'number') {
  console.error(`✖ no lint baseline recorded for "${appDir}" in .lint-baseline.json`);
  process.exit(2);
}

const run = spawnSync('npx', ['eslint', '.', '-f', 'json'], {
  cwd: join(repoRoot, appDir),
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
});

// ── 1. Did ESLint itself fail to run? ────────────────────────────────────────
// A crash writes nothing parseable to stdout. This is the check that would have
// caught the dead linter, and it is unconditional.
let results;
try {
  results = JSON.parse(run.stdout || '');
  if (!Array.isArray(results)) throw new Error('not an array');
} catch {
  console.error('✖ ESLint did not produce a report — it crashed rather than linting.');
  console.error('  This is the failure mode that went unnoticed for months.');
  console.error('  ─ stderr ─────────────────────────────────────────────');
  console.error((run.stderr || '(empty)').split('\n').slice(0, 25).join('\n'));
  process.exit(1);
}

// ── 2. Count ─────────────────────────────────────────────────────────────────
let errors = 0;
let warnings = 0;
const byRule = new Map();
for (const file of results) {
  for (const m of file.messages ?? []) {
    if (m.severity === 2) {
      errors++;
      byRule.set(m.ruleId, (byRule.get(m.ruleId) ?? 0) + 1);
    } else {
      warnings++;
    }
  }
}

console.log(`ESLint ran clean (no crash). ${errors} errors, ${warnings} warnings.`);
console.log(`Baseline for ${appDir}: ${allowed} errors.`);

if (errors > allowed) {
  console.error(`\n✖ Lint errors increased: ${errors} > baseline ${allowed}.`);
  console.error('  Fix the new errors. Do not raise the baseline.');
  for (const [rule, n] of [...byRule].sort((a, b) => b[1] - a[1])) {
    console.error(`    ${String(n).padStart(3)}  ${rule}`);
  }
  process.exit(1);
}

if (errors < allowed) {
  console.log(`\n✔ ${allowed - errors} error(s) fixed since the baseline was set.`);
  console.log(`  Lower "maxErrors" for ${appDir} to ${errors} in .lint-baseline.json to lock the gain in.`);
}

if (errors > 0) {
  console.log('\nRemaining known debt:');
  for (const [rule, n] of [...byRule].sort((a, b) => b[1] - a[1])) {
    console.log(`    ${String(n).padStart(3)}  ${rule}`);
  }
}

process.exit(0);
