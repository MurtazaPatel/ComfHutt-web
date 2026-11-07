# ComfHutt Web

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health

## Founder gates (D54, 2026-11-07) — non-negotiable
- **[ASK] = stop and wait for the founder.** Never shorten, skip or self-approve an [ASK] gate or an
  observation window (e.g. a WAF detection period, a 14-day parallel run, a review of samples). If the
  founder is offline, WAIT — "finish before I'm back" does not cancel a gate.
- Attribution: use "Source: GujRERA public records" (fact sheets: "Source: GujRERA filings, as of <date>").
  "Data sourced from GujRERA" only after GujRERA's written approval. Never use the GujRERA logo or emblem (D56).
- Crawler conduct is fixed: night-only (22:00–07:00 IST), ≤1 req/s combined, CRUXBot UA, CAPTCHA solving off (D57).

## CGM spec stays current (D60)
Any PR that changes CGM code, constants, weights or the methodology hash MUST regenerate
`crux-data-miner/CGM_CURRENT_SPEC.md` in the same change (Parts A/B/C, rule numbers stable, version + hash +
changelog entry at the top). CI fails when the methodology hash changes but the spec's recorded hash does not.
