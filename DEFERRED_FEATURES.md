# Deferred Features — post-launch

Things deliberately **not** built before launch, and the reason each one waits.

Nothing here is forgotten or abandoned. Each entry records what blocks it, so the
decision does not have to be re-argued later — and so nobody rediscovers a
"missing" feature that was in fact a considered call.

Last updated: 2026-08-27.

---

## 1 · Learning flywheel

**What:** Lens gets better as people use it — remembering corrections, recurring
confusions, and what a good answer looked like, so the agent compounds over time.

**Why it waits:** It is an unsolved design problem, not an unbuilt one. Before any
code, three questions need answers:

- What is actually stored — corrected facts, phrasings, retrieval preferences?
- How do you distinguish a **genuine correction** from one user's opinion? A
  disagreement with a certified RERA filing is not a correction.
- How do you avoid **poisoning** the agent? A learning loop with no adjudication is
  a way for the loudest or most motivated user (a broker, say) to reshape what the
  product says about a property.

Shipping this half-considered would compromise the one thing CRUX sells: that its
answers come from certified records.

**Unblocked by:** a design pass of its own, plus real usage data to learn *from*.

---

## 2 · Embeddings + cross-encoder re-ranking

**What:** The dense half of hybrid retrieval. Today ranking is lexical (Okapi BM25
plus authority, boilerplate and entity-anchor adjustments).

**Why it waits:** This is the last ~20% of retrieval quality and it costs the most
to get right — a model dependency, per-call latency, per-call spend, and an
evaluation set to tune against. That eval set cannot be built from a corpus of 8
projects and no query logs.

The lexical layer already delivers a 12–33× reduction in what reaches the model,
measured in production. Chasing the remaining fifth before the first is validated
is the wrong order.

**Unblocked by:** real query logs from live users, and measured p50/p95 showing
where lexical ranking actually falls short.

---

## 3 · Module P — Price Fairness

**What:** The seventh CGM module. Currently `not_assessed` on every property.

**Why it waits:** Not for the reason originally assumed. The inputs are:

| Input | Status |
| --- | --- |
| `quotedPricePerSqft` | User-supplied at score time — a form field, not a scraper |
| `cohortMedianPerSqft` | **The real blocker** — needs a cohort; the spec wants n ≥ 30 and the corpus is 8 |
| `jantriPerSqft` | Optional floor only (see below) |

The declared ₹/sqft is **already computed at ingest** and stored on every entity,
so the cohort fills itself as people score properties. Corpus-wide today it ranges
₹1,590–₹7,199/sqft, all plausible for Gujarat.

**Unblocked by:** roughly 30 comparable projects, which arrives with usage. No
engineering work is required to start accumulating — that already happens.

---

## 4 · Jantri rate scraping

**What:** Government circle rates as a floor benchmark for Module P.

**Why it waits:** It was only ever the *optional* floor, never the primary
comparator. The CGM spec is explicit that the benchmark comes from CRUX's own
corpus — *"a proprietary price-comps benchmark without scraping a single listing
portal."* Low value until Module P is live.

**Unblocked by:** nothing technical. Simply not worth doing before #3.

---

## 5 · Freshness ranking

**What:** Rank recent evidence above stale evidence, per content class (property
news ages in weeks; a court judgment does not).

**Why it waits:** **Blocked on data that does not exist.** Probed live across
magicbricks, economictimes, 99acres and livemint: **zero** returned a usable
publish date, and GujRERA exposes no date field at all. A freshness axis built on
that would be null for nearly every passage — silently inert while appearing
implemented, which is worse than absent.

**Unblocked by:** content-level date extraction (parsing dates out of page text),
which is its own project with its own accuracy problem.

---

## 6 · Verification surface — "what the builder says vs what they filed"

**What:** Contrast a developer's marketing claims against their RERA filings:
promised possession vs filed completion, advertised amenities vs sanctioned plan,
"90% sold" vs declared bookings.

**Why it waits:** Founder's call — post-launch. The service (`verification.service.ts`)
already exists and is unreached; it needs a trigger and a UI, plus careful wording,
since publishing "developer contradicted" carries real defamation exposure.

**Unblocked by:** a deliberate product decision about how to present a
contradiction fairly.

---

## 7 · Promoting Firecrawl Cloud to the primary search provider

**What:** Today the self-hosted instance is primary and Firecrawl Cloud is the
reliability tier, consulted when self-hosted search returns an empty result.

**Why it waits:** Founder's call — self-hosted first for cost. The pairing is
already reliable: the self-hosted instance measured `5 5 0 0 0` on one repeated
query (public engines rate-limit by IP), while the cloud returned `5 5 5 5 5`, and
empty results are now corroborated rather than believed.

**Unblocked by:** post-launch volume data showing what a metered-primary setup
would actually cost.

---

## 8 · Network isolation for the Firecrawl VM (VPC connector + Cloud NAT)

**What:** A static egress IP for Cloud Run so the VM's NSG can allowlist an
address range instead of relying on a shared secret.

**Why it waits:** The shared-secret gate shipped on 2026-08-27 and closes the
actual hole — Firecrawl is behind a Caddy proxy requiring `X-Gateway-Key`, the API
is bound to localhost, and the NSG is narrowed to a single port. Cloud NAT is
strictly more infrastructure and ongoing cost for a marginal gain.

**Unblocked by:** exposing more services from that VM, at which point proper
network isolation starts to pay for itself.

---

## 9 · Express 5 migration

**What:** `comfhutt-backend` runs Express 4.x.

**Why it waits:** Express 5 makes `req.query` a **read-only getter**, and
`validation.middleware.ts` assigns to it — which threw a `TypeError` on every
scoring request and broke production when a Dependabot major bump auto-merged.
Typecheck and build both passed; only a runtime smoke test caught it.

**Dependabot PR #19 must not be merged** until that middleware is migrated
deliberately and runtime-tested.

**Unblocked by:** a planned migration of the middleware, not a dependency bump.

---

## 10 · Retiring the legacy CPSM scoring path

**What:** Deleting the old five-pillar LLM score entirely.

**Why it waits:** It is the `CGM_V1_ENABLED`-off rollback rail. Lens can no longer
reach it (its only tool is research-only, and `ScoringAgent` is unreachable from
that path), so it costs nothing to keep and remains a genuine safety net.

**Unblocked by:** a production bake period on CGM long enough to trust deleting the
rail.

---

## Explicitly rejected — not deferred

**Building our own web search index.** Perplexity built Sonar because general
search *is* their product. CRUX's moat is the certified-records corpus — 15
documents and 12 quarterly filings per project — which no competitor can assemble
without rebuilding the scraper history. Web search is a supporting signal. Taking
it to 70–80% of Claude's quality is worth real effort; taking it to 100% is not,
and would cost the corpus that actually differentiates the product.
