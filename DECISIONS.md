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
