# Embeddings — Design & Logic Reference

This document explains how vector embeddings work in Shine Peerpath: the core module, the
model, the offline fallback, caching, and every place embeddings feed into a match score.

Scope: `server/services/embeddingService.ts` and its three consumers —
`trajectoryService.ts`, `recruiterService.ts`, `cvService.ts`.

---

## 1. Core module: `embeddingService.ts`

Single shared module. Everything else imports from here — there is no other place in the
codebase that talks to the embedding model directly.

### 1.1 Model

```
Model:   Xenova/all-MiniLM-L6-v2   (via @huggingface/transformers)
Output:  384-dimensional float vector
Pooling: mean pooling over token embeddings
Norm:    L2-normalized at generation time (normalize: true)
```

MiniLM-L6-v2 is a small sentence-embedding model — good enough to place semantically similar
short phrases (job titles, skill names, bios) close together in vector space, small enough to
run locally with no API key and no network dependency once downloaded.

The extractor pipeline is lazy-loaded once per process and memoized:

```ts
let extractorPromise: Promise<any> | null = null;
async function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = (async () => {
      const mod = await import('@huggingface/transformers');
      return mod.pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    })();
  }
  return extractorPromise;
}
```

First call in the process pays the model-load cost; every call after reuses the same
extractor instance.

### 1.2 Fallback embedding (offline / load-failure path)

If the `@huggingface/transformers` import or the pipeline call throws for any reason (no
network on first run to download model weights, unsupported runtime, etc.), `createEmbedding`
**silently falls back** to a hand-rolled hashing embedding rather than crashing the server:

```
fallbackEmbedding(text):
  1. Tokenize (split on non-alphanumeric, apply TOKEN_ALIASES, drop 1-char tokens)
  2. For each token:
       - hash the token → bucket index in [0, 384) → +1
       - hash every 3-character substring (trigram) of the token → bucket index → +0.5
  3. L2-normalize the resulting 384-dim vector
```

This is a **bag-of-tokens/trigrams hash vector**, not a learned semantic embedding. It gives
partial credit for shared substrings (so `"microfrontend"` and `"micro-frontends"` land
close together via shared trigrams), but it has no real understanding of meaning — two
unrelated words that happen to share letters can score deceptively high, and it will never
recognize a genuine synonym pair with zero character overlap (e.g. "car" vs "automobile").

**Why this matters for anyone debugging match quality:** if scores look oddly literal/
character-based rather than meaning-based, check whether the real model ever loaded. There is
currently no explicit log line distinguishing "using MiniLM" vs "using fallback hash" — the
`catch` blocks around `getExtractor()` and the `extractor(...)` call swallow the error
silently. (Worth adding a one-time console warning if you're debugging this in production.)

### 1.3 Caching

```ts
const embeddingCache = new Map<string, number[]>();
```

Keyed by the **exact trimmed input string**. Not fuzzy — `"React.js"` and `"react.js "` are
different cache keys. In-memory only: cleared on every server restart, never persisted to
disk. For a given process, the same text is only ever embedded once (real model or fallback).

### 1.4 Exported functions

| Function | Signature | Does |
|---|---|---|
| `createEmbedding(text)` | `Promise<number[]>` | Returns cached vector, or generates (real model → fallback) and caches it. Empty/blank input returns a zero vector. |
| `cosineSimilarity(a, b)` | `number` | Plain dot product — valid as cosine similarity **only** because both inputs are already L2-normalized (real model normalizes at generation; fallback normalizes manually). |
| `semanticSimilarity(a, b)` | `Promise<number>` | Embeds both strings and returns `max(0, cosineSimilarity(...))` — negative similarities are clamped to 0 everywhere in this codebase. |
| `semanticSkillMatch(skillA, skillB, threshold=0.72)` | `Promise<boolean>` | Cheap exact/substring check first (post-normalization); only falls through to a real embedding call if that fails. Returns true if similarity ≥ threshold. |
| `normalizedSkill(skill)` | `string` | Tokenizes + aliases + rejoins with no separator — used for cheap string-level skill comparison before ever calling the model. |

---

## 2. Consumer #1 — Trajectory Matching (`trajectoryService.ts`)

The "4-Way Alignment" mentor-match score blends two independent signals:

1. **Taxonomy score** — rule-based: role-family match, company-tier match, transition-type
   match (see `mentorMatchTaxonomy.ts` — role families, company tiers, no embeddings involved).
2. **Dense semantic score** — embeddings, described here.

### 2.1 What gets embedded

Four pieces of text per match attempt, two for the candidate (computed once) and two per
mentor (computed per creator in the loop):

```
candidateBaselineText = currentRole + currentCompany + skills
candidateTargetText   = dreamRole + targetCompany + domain + skills

creatorPastText    = mentor.trajectory.role3YearsAgo + company3YearsAgo + keyJumpSkills
creatorCurrentText = mentor.role + mentor.company + mentor.skills
```

```
originSemanticSim = cosineSim(candidateBaselineVec, creatorPastVec)     // "did they start like me?"
destSemanticSim   = cosineSim(candidateTargetVec,   creatorCurrentVec)  // "are they where I want to be?"
```

### 2.2 How the semantic score feeds the taxonomy score

It's not a separate weighted term — it's blended **into** `roleMatchScore` as a boost on top
of the rule-based family match, via an optional 5th parameter:

```ts
// mentorMatchTaxonomy.ts
export function roleMatchScore(roleA, roleB, domainA, domainB, semanticSim) {
  if (exactRoleMatch(roleA, roleB)) return 1.0;
  let baseScore = (sameFamily) ? 0.7 : 0.3;
  if (semanticSim !== undefined && semanticSim > 0) {
    baseScore = Math.min(1.0, Math.max(baseScore, baseScore * 0.4 + semanticSim * 0.6));
  }
  return round(baseScore, 2);
}
```

Called as:
```ts
roleMatchScore(dreamRole, creator.role, domain, creator.domain, destSemanticSim)
roleMatchScore(currentRole, creator.trajectory.role3YearsAgo, domain, creator.domain, originSemanticSim)
```

So embeddings can only ever **raise** the family-based score (`Math.max(baseScore, ...)`),
never lower it — a strong semantic match can lift a "different family" 0.3 up toward 1.0, but
a weak/zero semantic match never drags a same-family 0.7 down.

### 2.3 Final composite score

```
taxonomyScore = wDreamRole·RoleMatch + wCurrentRole·RoleMatch
              + wDreamCompany·CompanyMatch + wCurrentCompany·CompanyMatch
              + wTransition·TransitionMatch

compositeTrajectory = taxonomyScore · 0.70  +  avg(originSemanticSim, destSemanticSim) · 0.30

trajectorySimilarityScore = clamp(round(compositeTrajectory · 100), 52, 99)
```

The `w*` weights are **dynamically rebalanced** when the candidate hasn't supplied a current
or dream company (redistributing the company weight into role/transition — see the
`hasDreamCompany`/`hasCurrentCompany` branch in `trajectoryService.ts`), but the 70/30
taxonomy/semantic split at the top level is fixed.

The match-reasons text also surfaces the raw semantic number directly:
`"Dense Semantic Sim {round(avg(origin,dest)*100)}%"` — visible in the API response's
`matchReasons` array for debugging/transparency.

---

## 3. Consumer #2 — Recruiter Search (`recruiterService.ts`)

Two separate embedding-backed flows.

### 3.1 `matchCandidatesToRole` — role → ranked candidates

```
candidateEmbedding = embed(candidate.headline + candidate.summary + candidate.skills.join(' '))
roleEmbedding      = embed(roleTitle + requiredSkills.join(' '))

semanticSimilarity = cosineSim(candidateEmbedding, roleEmbedding)
skillCoverage      = matchedSkills.length / requiredSkills.length   // string-level match, no embeddings

matchPercent = clamp(round((skillCoverage·0.7 + semanticSimilarity·0.25 + verifiedBoost) · 100), 0, 99)
```
`verifiedBoost = 0.05` if the candidate has any peer-verification badge, else `0`.

Candidate embeddings are cached **per candidate id**, with staleness detection — the cache
entry stores the exact source text it was computed from, and is recomputed if that text
changes (e.g. candidate updates their headline/summary/skills):

```ts
private readonly candidateEmbeddingCache = new Map<string, { sourceText: string; embedding: number[] }>();
// cache hit only if cached.sourceText === current sourceText
```

This cache is a class-instance field on the singleton `recruiterService`, so it persists for
the life of the process (same in-memory-only caveat as the module-level cache).

### 3.2 `searchCandidates` — free-text natural-language query

Only runs the embedding path when a `query` string is provided:

```
queryVec = embed(query)
similarity = cosineSim(queryVec, candidateEmbedding)   // reuses the same per-candidate cache

matchScore = clamp(round(similarity·55 + (hasExactKeyword ? 20 : 0) + (hasBadges ? 15 : 0) + profileScore·0.1), 50, 99)
```

`hasExactKeyword` is a plain substring check against name/headline/skills — a keyword hit adds
a flat 20 points on top of whatever the semantic score contributed.

**Relevance filter:** a candidate is only included in results if `similarity >= 0.25` **or**
`hasExactKeyword` is true — this is the one place in the codebase where a raw (unscaled)
cosine similarity is used directly as a pass/fail gate rather than just a score contributor.

When no `query` is given, this function skips embeddings entirely and returns a flat
`96`/`82` score split purely on whether the candidate has a peer-verification badge.

---

## 4. Consumer #3 — CV Gap Analysis (`cvService.ts`)

Used inside `performGapAnalysis` (powers `/api/cv/gap-analysis` and the batch
`/api/cv/pathways-analysis`).

### 4.1 Flexible skill matching — `semanticSkillMatch`

For every expected/booster skill in a domain template, the candidate's skills are checked
against it in two passes:

```
1. Cheap pass: substring / normalized-string equality (no embeddings)
2. If that fails: semanticSkillMatch(candidateSkill, templateSkill, threshold)
```

Two different thresholds depending on which list is being matched:
- expected skills → threshold `0.70`
- high-leverage booster skills → threshold `0.75` (booster skills need a tighter match — they
  drive the "missing skills" gap report, so a looser threshold would under-report real gaps)

### 4.2 Dense semantic fit — candidate vs. target-role template

```
candidateText = currentRole + candidateSkills.join(', ')
targetText    = template.defaultTargetRole + template.domain + template.expectedSkills.join(' ')

semanticFit = cosineSim(embed(candidateText), embed(targetText))
```

Feeds directly into the headline gap-analysis score:

```
baseScore = clamp(round(40 + matchRatio·25 + semanticFit·22 + roleBonus), 45, 88)
```

where `matchRatio` is the plain string-matched-skills ratio and `roleBonus` is a small
hand-coded bonus (0–8 points) if the candidate's current title contains domain-relevant
keywords (e.g. "front"/"react" for Full-Stack, "ai"/"ml"/"python" for AI/ML).

---

## 5. Cross-cutting notes

- **No persistence, no vector DB.** Every cache here is a plain in-memory `Map`/class field.
  Restarting the server means every embedding gets recomputed on first use again — there is
  no warm-start, no on-disk vector index, nothing external.
- **Negative similarities are always clamped to 0** (`Math.max(0, cosineSimilarity(...))`)
  everywhere embeddings are consumed — a "semantic similarity" in this codebase is always in
  `[0, 1]`, never negative, even though raw cosine similarity mathematically can be.
- **The real model vs. the fallback hash are interchangeable at the call-site level** — every
  consumer just calls `createEmbedding`/`cosineSimilarity` and gets a vector back; none of
  them know or check which path actually produced it. Match-quality differences between "real
  MiniLM is loaded" and "running on the fallback hash" are silent from the outside.
- **Embeddings are a soft signal everywhere they're used** — in trajectory matching they can
  only raise a role-match score, never override an exact/family-based result downward; in
  recruiter search they're one weighted term among several (skill coverage, keyword match,
  verification badge); nowhere in the codebase is a match decided by embedding similarity
  alone.
