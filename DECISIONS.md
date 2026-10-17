# DECISIONS — why, not just what

Append only. Never edit or delete a past entry; if a decision is reversed, add a new dated
entry that supersedes it. Shared founder decisions are mirrored in every CRUX repo
(crux-data-miner, crux-agents, comfhutt-backend `docs/DECISIONS.md`, ComfHutt-web).

---

## Founder decisions — 2026-10-11

**Decided by:** Murtaza (founder). **Recorded by:** Claude Opus 5.5 (`claude-opus-5-5`), Claude Code.
**Status:** binding for every future session until superseded by a later dated entry.
Context: GCP project `comfhutt-backend` suspended 2026-09-21; see `GCP_DEPENDENCY_AUDIT.md` and `AZURE_MIGRATION_PLAN.md` in crux-data-miner.

- **D1 — Stopgap: deploy now.** The Task 1 stopgap (90-day stale window and geocode TTL, `freshness` label, 503s, optional Google keys, stale-grade label) ships to prod on its own, ahead of the rest of `migration/azure`.
- **D2 — Legal / Module L: PARKED, UNDER EVALUATION.** The founder is discussing licensed legal data and credibility sources with an IBBI-registered professional; final decision pending. Until then, keep current behaviour **exactly**: RERA Tribunal + IBBI only; Module L shows "Unverified"; automated CAPTCHA solving stays **OFF permanently**. Make **no** changes to legal-corpus code or coverage logic. Do **not** evaluate the eCourts partner API.
- **D3 — Maps: Azure Maps is PRE-APPROVED as the INTERIM geocoder** behind the `MapsProvider` interface. Ask before creating the Azure Maps account or making any live Maps call. When the bake-off is due, ask the founder to create the Mappls and Ola Maps accounts; do not block Phase 1 on them.
- **D4 — Dependencies: PRE-APPROVED** (no need to ask).
  ADD Python: `psycopg[binary]`, `azure-identity`, `azure-storage-blob`, `azure-ai-documentintelligence`, `openai` (Azure Foundry/OpenAI endpoints), `azure-monitor-opentelemetry`.
  ADD Node: `@azure/monitor-opentelemetry`, `@azure/identity`.
  REMOVE: `firebase-admin`, `google-cloud-firestore`, `google-cloud-storage`, `google-genai`, `google-antigravity`, `@google/generative-ai`.
  Conditions: pin versions; lockfiles in the same commit; list every dependency/lockfile change in the session summary. Anything not on this list is still ask-first.
- **D5 — Vision bake-off fetch: APPROVED with limits.** Max 30 documents, GujRERA public filings only, UA exactly `CRUXBot/1.0 (+https://comfhutt.com; murtaza@comfhutt.com)`, ≤ 1 req/s, off-peak 22:00–07:00 IST, no CAPTCHA, no other sites. Before the run: show the founder the 30 document URLs and doc types and wait for "go".
- **D6 — Azure for Startups Milestone 3 (Microsoft wording, page updated 08/05/2026):** "Use 5+ Azure workloads over a sustained period (~60 days) … Workloads can include services such as VMs, AI models, databases, or other Azure offerings. Both service adoption and sustained usage are required." "The 60-day clock starts once you have the required number of workloads, each with at least $1 in spend. Every workload must stay above $1 in spend for all 60 days. If any workload drops below the threshold, you fall under the required number. The count only completes after 60 continuous days at or above the target." "Each unique service counts toward your workload total, for example: Virtual Machines (compute), AI and machine learning services, Databases, Application hosting services." "Your progress is evaluated based on recent activity and sustained usage patterns, not one-time spikes." "At the $25K milestone, you receive a one-time extension of two years to use your credits." **Plan for the strict reading:** every counted service spends steadily every day and never sits idle.
- **D7 — Clerk Google sign-in: REMOVE the "Continue with Google" button now** (`SocialAuth.tsx`), behind a flag defaulting to off; email-code sign-in only. The OAuth client was in the suspended project and is dead. Revisit after the appeal.
- **D8 — Do NOT show the 13 older-methodology grades.** The methodology-hash rule in `cachePolicy.ts` stays as is.
- **D9 — "≤ 1 req/s" means COMBINED across all target sites** (GujRERA + RERA Tribunal + IBBI + anything else the crawler touches), across live and batch.

---

## Founder decisions — 2026-10-12

**Decided by:** Murtaza (founder). **Recorded by:** Claude Opus 5.5 (`claude-opus-5-5`). Binding until superseded.

- **D10 — Overpass User-Agent exception APPROVED.** Overpass (mod_security returns 406 on any UA containing "(") uses exactly `CRUX-DataMiner/1.0 https://crux.comfhutt.com murtaza@comfhutt.com` — no parentheses — and stays under the combined limiter.
- **D11 — Firecrawl is our crawler.** Self-hosted VM only: the cloud Firecrawl tier-2 path is disabled/removed. The self-hosted instance sends the honest UA `CRUXBot/1.0 (+https://comfhutt.com; murtaza@comfhutt.com)`, respects robots.txt, and fetches at **≤ 1 req/s PER DOMAIN** with its own budget. **Amends D9:** the combined 1.0 req/s cap covers government/public-records sites (GujRERA, RERA Tribunal, IBBI, eCourts, Overpass); private websites get the per-domain budget instead.
- **D12 — D2 freeze lifted for TWO safety fixes only:** remove the `ECOURTS_AUTOMATED_CAPTCHA_ENABLED` env override (hard-off in code), and replace the eCourts session Chrome UA with the CRUXBot UA. No other legal changes; D2 otherwise stands.
- **D13 — `api.crux.comfhutt.com`:** ask first, then fix the managed-certificate binding and verify HTTPS. Do not switch the frontend to it yet; report readiness.
- **D14 — Azurite via `npx azurite` approved** — temporary, not a project dependency — for the M3 Blob integration test.
- **D15 — Push every `migration/azure` branch to origin** (never `main`).
- **Monitoring:** add an Azure Monitor alert, emailing murtaza@comfhutt.com, when the `firecrawl-vm` start runbook fails or the VM is not running by 09:30 IST.

---

## Founder decisions — 2026-10-13

**Decided by:** Murtaza (founder). **Recorded by:** Claude Opus 5.5 (`claude-opus-5-5`). Binding until superseded.

- **D16 — VM security, before any deploy.** `firecrawl-vm` NSG admits only crux-env's outbound IP(s) and the founder's current public IP; everything else denied; SSH only from the founder's IP. SearXNG and every other VM service bind to localhost/internal — only the Firecrawl API port is reachable, and only from crux-env. Firecrawl's default UA = the CRUXBot string. Verify blocked from outside and working from crux-env; report before/after rules.
- **D17 — Deploy miner + agents: GO.** Do every step possible without the founder (prereqs Bicep, Key Vault keys, federated credentials, GitHub secrets via `gh` if available); ask only for steps that need the founder's hands. Miner and agents stay INTERNAL ingress. After both pass `/health` from inside crux-env, ask, then point crux-backend's `CRUX_AGENTS_API_URL` / `CRUX_DATA_MINER_URL` at their internal URLs. Service-to-service calls never use the public domain.
- **D18 — Bake-off: APPROVED** the 16 GujRERA metadata requests (8 projects × 2), off-peak 22:00–07:00 IST, ≤ 1 req/s, CRUXBot UA, no other sites. APPROVED: create the Azure resources the D22 candidates need (Document Intelligence, Mistral OCR, Azure OpenAI/Foundry deployments), Central India if available else nearest region (report which). APPROVED dependency: `pypdfium2` (not PyMuPDF/AGPL). Then ask with the 30-document list before fetching PDFs.
- **D19 — `api.comfhutt.com` is the canonical PUBLIC API domain** (replaces `api.crux.comfhutt.com`): check CAA; give the Cloudflare records and ask; bind with a managed cert and verify HTTPS + `/health` + CORS from crux.comfhutt.com; ask, then switch the Vercel env vars in use to `https://api.comfhutt.com`, redeploy, verify sign-in, stale grade, 503 path; ask, then update the Clerk webhook (API if possible); remove the old `api.crux.comfhutt.com` binding + cert and give the Cloudflare records to delete. The raw `*.azurecontainerapps.io` address keeps working as a fallback.
- **D20 — Remove `sqlalchemy`, `psycopg2-binary`, `pydantic-settings` from crux-agents: APPROVED.**
- **D21 — Wire the Kimi disposal reader into the eCourts runner behind a flag, default ON: APPROVED** (restores existing behaviour; D2 otherwise unchanged). If D22 picks a different model for this task, use that.
- **D22 — Best Azure model PER TASK.** Survey what is deployable in our subscription/region; criteria in order: accuracy > reliability (structured output, tool calling) > latency > cost. Must be Azure-billed and consume startup credits (no Marketplace-billed models unless credits are confirmed to cover them); prefer Entra auth; pin model + version per deployment and store it with every output; temperature 0 where possible. (a) PDF/image transcription — bake-off decides, flagship vision models included. (b) disposal word, (c) `generate()` primary, (d) `generate()` reasoning, (e) report narrative, (f) Lens tool calling + streaming — comparison table and ask before switching any live chain. Kimi/DeepSeek stay as fallbacks where useful. Estimate daily/monthly spend per service against §3a and the $5K balance.
- **D23 — No test in any repo may load a real `.env`.**

## Founder decisions — 2026-10-14

**Decided by:** Murtaza (founder). **Recorded by:** Claude Opus 5.5 (`claude-opus-5-5`). Binding until superseded.

- **D18a — 7 more GujRERA requests: APPROVED** (one `getproject-doc` per bake-off project, off-peak, ≤ 1 req/s, CRUXBot UA) after the first discovery run lost them to a parser bug.
- **Founder confirmed:** GitHub secrets `AZURE_CLIENT_ID` / `AZURE_TENANT_ID` / `AZURE_SUBSCRIPTION_ID` added in crux-data-miner and crux-agents; Cloudflare `CNAME api` (DNS only) and `TXT asuid.api` added in comfhutt.com. Verify both before use.
- **D24 — Backend → internal URLs: APPROVED.** Record the current crux-backend revision; set `CRUX_AGENTS_API_URL=http://crux-agents`, `CRUX_DATA_MINER_URL=http://crux-data-miner`; verify backend `/health`, both internal `/health` reachable from the backend, stale grade page renders, new-property path still the clean 503. Any failure → reactivate the previous revision, then report.
- **D25 — D19 steps 3–6 PRE-APPROVED:** bind `api.comfhutt.com` with a managed cert (verify HTTPS, `/health`, CORS from https://crux.comfhutt.com); switch the Vercel API env vars to `https://api.comfhutt.com`, redeploy, verify sign-in / stale grade / 503 (revert + redeploy on failure); update the Clerk webhook endpoint via API if possible else give click steps, send a test event and confirm receipt; remove the `api.crux.comfhutt.com` binding + cert and list the Cloudflare records to delete. The raw `*.azurecontainerapps.io` address stays as fallback.
- **D26 — Model switch.** (a) APPROVED: ~3 live test calls (Kimi answer budget; GPT-6 with temperature 0 + JSON output). (b) CONDITIONALLY APPROVED: `generate()` primary + reasoning and the report narrative → `gpt-6.1-sol`, fallbacks Kimi then DeepSeek-V4-Pro, only if it is Azure-billed on startup credits, wins or ties a ~10-prompt golden set vs current Kimi on valid-JSON rate and field correctness with no TEST-CHECKLIST regressions, and model + version are pinned and logged per call. Otherwise Kimi stays primary. Golden-set cost (cents) approved.
- **D27 — Azure Maps account (Gen2, managed-identity auth, no shared keys): APPROVED.** Wire M5 as the INTERIM provider: geocode (backend TS) and nearby/distance (agents, Module X). Run the plan's 20-address check against Azure Maps only (≤ ~100 calls); report accuracy vs GujRERA coordinates. Mappls/Ola bake-off deferred to after launch.
- **D28 — After D24–D27: M10 backend cutover** (remove run.app fallbacks, fail closed on unset URLs, Gemini out of `llm.ts`, report → `generate()`, Lens endpoint returns an honest 503 "Lens is being rebuilt"); deploy via PR to main with a rollback note. **[ASK] before merging to main.**
- **Target:** M12 end-to-end (a NEW Ahmedabad property gets a real grade) by **2026-10-20**.

## Founder decisions — 2026-10-17

**Decided by:** Murtaza (founder). **Recorded by:** Claude Opus 5.5 (`claude-opus-5-5`). Binding until superseded.

- **D29 — Vision bake-off: GO, lean run.** Fetch the 30 listed GujRERA documents (12 financial incl. 3 JPEG-scanned statements of GJ_3536, 10 legal, 8 Forms 1/2/8; `bakeoff/fetch_list.json`) off-peak 22:00–07:00 IST, ≤ 1 req/s, CRUXBot UA, stored locally only. Each reader (Document Intelligence, Mistral Document AI 2512, `gpt-6.1-sol`, `gpt-6-luna`) runs once on all 30, plus 3 runs on 10 documents for determinism; EST ~$5–7. Ground truth: values hand-keyed from the page images, 5 spot-checked by the founder.
- **D30 — `projectdoc` gap: fix AFTER the bake-off.** The miner reads only `findoc`, so title, encumbrance, commencement, NOC, ITR and director-report documents were never processed. One-line change in `orchestrator.py` + a test on `migration/azure`, deployed together with the winning document reader.

## Founder decisions — 2026-10-18 (Finish Phase 1)

**Decided by:** Murtaza (founder). **Recorded by:** Claude Opus 5.5 (`claude-opus-5-5`). Binding until superseded.

- **D31 — Merge backend PR #47: GO.** Then one revision with the chain `gpt-6.1-sol → Kimi → DeepSeek-V4-Pro`, the DeepSeek model and the Maps env vars; verify a real Ahmedabad geocode, the report narrative logging model + version, Lens 503, the stale grade page, and a foreign origin rejected. Failure → reactivate the previous revision, fix, retry.
- **D32 — Ground truth:** key values from the page images; the founder spot-checks 10 (every escrow/bank balance, amount collected and cost incurred from ≥ 3 Form 3s, plus 3 random), each with a page number or crop. Wait only if one is wrong.
- **D33 — Wire the bake-off winner: PRE-APPROVED** (including a routed cheap-first / escalate-hard-pages setup) if it reaches **≥ 95 % numeric exact-match on scanned Form 3 and 0 invented numbers**; otherwise [ASK] with the table. Then apply the D30 `projectdoc` fix.
- **D34 — M12 on dev Supabase:** a never-graded Ahmedabad RERA project, live scrape under live limits (0.4 req/s, CRUXBot UA); fix and retry on failure; [ASK] only for crawler-conduct or legal-code changes.
- **D35 — M12 on PROD: PRE-APPROVED once dev passes**, same acceptance; then 2 more new Ahmedabad projects → 3 live demo grades, each reported with module status + confidence, wall-clock (flag > 3 min), and LLM + vision cost.
- **D36 — Side items while blocked:** miner `/health/deps` with Postgres + an Azure Monitor alert (failing ≥ 5 min); Phase 3 plan entry for a VNet-integrated environment + Postgres private access; methodology changelog (POI counts, geocoder, vision reader); DRAFT privacy text for Azure Maps (EU) — founder sign-off, not published; design + estimate for project-first geocoding.
- **Phase 1 done when:** 3 new prod grades, stale label works, no run.app / Gemini / Google Maps calls in live paths (grep + runtime logs), all three apps healthy with alerts, everything merged to main; then `PHASE1_DONE.md`.
- **Noted 2026-10-18:** the D29 fetch set has no Form 3 (it needs the `form_ids` → `form_three` → download chain, 3 requests per project), so D33's Form 3 gate is evaluated on the closest scanned proxies until the founder approves a Form 3 fetch.
