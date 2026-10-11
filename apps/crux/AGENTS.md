<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Design system

`DESIGN.md` in this folder is the fixed brand and design guideline for every CRUX
screen. Read it before writing or changing any UI.

- Tokens and classes are defined in `src/app/globals.css`. Use them; do not invent
  a colour, radius, shadow or font size in a component.
- Run `pnpm design:check` (from the repo root) before finishing UI work. It is a
  hard gate in CI.
- New public UI is checked across the 24-size responsive matrix in `DESIGN.md` §8.
- Do not change user-facing copy as part of a visual change. Copy is guarded by
  `pnpm copy:check` and `pnpm landing:check`.
