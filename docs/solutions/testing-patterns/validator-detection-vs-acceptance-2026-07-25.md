---
date: 2026-07-25
category: testing-patterns
problem_type: verification methodology / false-negative tooling
components: [src/utils/jsonld.ts, acceptance criteria]
technologies: [schema.org, google-rich-results-test, validator.schema.org, json-ld]
severity: medium
volatility: stable
---

# "The validator detected it" and "the validator accepted it" are different claims

## Problem

A verification tool returning nothing is ambiguous. It can mean *your input is clean*, or it can mean *your input is outside what I report on*. Treating the second as the first produces an acceptance criterion that cannot be satisfied, or — worse — a green result that proves nothing.

## Context

Issue #11 shipped schema.org `Person` markup. Its original acceptance criterion read: *"paste each live URL into Google's Rich Results Test and confirm it detects a Person entity with no errors or warnings."*

That criterion is unsatisfiable, and the research that was supposed to catch it instead asserted the opposite.

## Symptoms

- A tool reports "No items detected" / "0 errors" on input you believe is correct, and it is unclear which of the two meanings applies.
- An acceptance criterion is written against a tool's output without anyone having run that tool on a representative payload.
- A claim of the form "X is supported, therefore the tool will report X" appears in a research artifact with a citation to a *capability list* rather than to observed tool behavior.

## Root Cause

Two distinct errors, both of which produced wrong conclusions here.

**1. Inferring tool behavior from a capability list.** Google publishes a [list of supported structured-data features](https://developers.google.com/search/docs/appearance/structured-data/search-gallery). `Profile page` is on it. The research artifact reasoned: *Profile page is a supported feature, therefore Rich Results Test detects it* — and recorded that as verified, with the capability list as the citation.

The capability list says what Google *has a feature for*. It says nothing about how the validator resolves references while checking that feature's required properties. Those are different claims, and only the second was load-bearing.

Concretely: Google lists `mainEntity` as required on `ProfilePage`, with `name` required inside it. RRT does **not** resolve `@id` references across `@graph` siblings when checking required properties. So this shape reports **"No items detected"**:

```json
{"@type": "ProfilePage", "mainEntity": {"@id": "https://example.com/#person"}}
```

while this one reports **"Profile page"**:

```json
{"@type": "ProfilePage", "mainEntity": {"@type": "Person", "@id": "https://example.com/#person", "name": "…"}}
```

Both are idiomatic JSON-LD. Both pass `validator.schema.org` with zero errors. `@id` cross-referencing is correct for entity *understanding* and insufficient for feature *detection* — and no document says so, because it is a property of the validator, not of the spec.

**2. Trusting a zero without a negative control.** A separate tool, `validator.schema.org`, returned `0 errors, 0 warnings`. That is only meaningful if the tool would have returned non-zero for bad input. On first attempt it silently accepted the wrong POST field name and returned `numObjects: 0, totalNumErrors: 0` — indistinguishable at a glance from a clean pass.

## Learning Level

- **Level:** Structure
- **Feedback loop or delay:** The structural condition is that these tools report against a *curated list*, not against the total spec, and encode "not applicable to me" and "clean" in the same null output. Nothing about the interface distinguishes them. Combined with acceptance criteria being written before anyone runs the tool, this reliably produces criteria that are either unsatisfiable or vacuous — and the error surfaces at verification time, after the code is written against it.

## Rule Scope

- **Applies when:** the verification tool reports against a curated feature list, rule set, or supported-type registry rather than a total specification — structured-data validators, linters with configurable rule sets, accessibility checkers, security scanners, SEO auditors, LLM-judge rubrics. The tell is that the tool can legitimately have *nothing to say* about valid input.
- **Also applies when:** a null/zero result is the *success* signal. Any assertion of the form "no errors were reported" needs a negative control; assertions of the form "the expected value was returned" generally do not, because a broken harness surfaces as a mismatch rather than a pass.
- **Inverts or does not apply when:** the tool is a strict total parser whose only outputs are pass and fail against a complete grammar — `JSON.parse`, a compiler front-end, a schema validator running a closed schema. There, absence of error genuinely means conformance, and adding negative controls is ceremony.
- **Sibling docs:** [Astro JSON-LD emission and escaping](../integration-issues/astro-jsonld-emission-and-escaping-2026-07-25.md) — the implementation half of this same feature. [Enforcement gates that fail silent](../devops/enforcement-gates-that-fail-silent-2026-07-25.md) — the same "never trust a zero" principle for gates you *author* rather than consume; there you also own proving the check can fail, and the null-success shape is the tool's contract rather than an artifact of a curated rule set.

## Solution

**Run a negative control before trusting a zero.** Three inputs, one command:

```
our real payload   → objects=1  errors=0  warnings=0
control: bogus property (notARealProperty) → objects=1  errors=1
control: malformed JSON                    → objects=0  errors=1
```

The controls prove the tool reacts. Only then does the zero on the real payload carry information. This took under a minute and is the difference between "the validator passed" and "the validator was asked."

**Rewrite tool-dependent acceptance criteria to name the tool's actual semantics.** Before:

> Rich Results Test detects a Person entity with no errors or warnings.

After:

> - `validator.schema.org` parses the graph with **0 errors** ← the correctness gate
> - Rich Results Test detects **"Profile page"** with 0 errors — achievable only because the Person is nested as `mainEntity`
> - Warnings limited to inapplicable *recommended* properties, **not** to be silenced by fabricating values

The last clause matters: RRT warns about missing recommended `ProfilePage` properties like `interactionStatistic`. Inventing interaction counts to reach zero warnings would be exactly the misleading-markup violation the work exists to avoid. *"Zero warnings"* is the wrong target whenever a tool's recommended-property set is broader than what the page honestly supports.

**Discharge tool-dependent criteria with a 60-second paste before writing code.** Pasting the candidate payload into the tool costs a minute and settles what days of reasoning cannot. Here it refuted a claim the research had already recorded as verified.

## Prevention

**Code-level:** for automated checks, assert the negative control in the test itself rather than relying on someone having run it once — a harness that cannot fail is worth no more than no harness.

**Process-level:**
- In `/research`, distinguish *"the docs say this feature exists"* from *"I observed the tool do this."* A citation to a capability list does not support a claim about tool behavior. If the claim is about what a tool will output, the only valid citation is an observation.
- In `/write-a-prd`, any acceptance criterion phrased as *"tool T reports R"* is unverified until someone has run T once. Treat it as an assumption to discharge, not a criterion to inherit.
- **Assertions written in prose need the same verification bar as assertions written in code.** This PR's commit message claimed vitest 3.x was pinned "so the runner reuses astro's vite 6." That was false — the lockfile shows vitest 3.2.7 pinning vite 7.3.1, and vite 7 predated the branch. The mis-attribution had already been caught and corrected *during* implementation, then re-introduced in the commit message afterward. A wrong claim in a commit message outlives the session that produced it and is read as fact.

## Planning / Calibration Notes

- **What widened the work:** an acceptance criterion inherited from an audit, never tested against the tool it named. Discovering it was unsatisfiable required rewriting the criterion mid-flight and re-verifying the graph shape.
- **What tightened the work:** the 60-second RRT paste. It refuted a recorded-as-verified claim before any code was written, and produced the nesting constraint that the implementation was then built around.
- **Future planning adjustment:** when an acceptance criterion names an external tool, `/research` should discharge it with one real invocation and record the observed output verbatim — not reason about it from documentation.

## Key Decision

**Decision:** `@graph` with `WebSite` + `ProfilePage` + `Person` nested inline as `mainEntity`, rather than a flat `Person` or an `@id`-referenced sibling.
**Rationale:** nesting is the only form RRT detects, and it costs nothing — the nested `Person` keeps its own `@id`, so other pages still reference it by stub.
**Alternatives considered:** flat `Person` (correct, but RRT reports nothing, so the criterion collapses to validator-only); `WebPage` instead of `ProfilePage` (avoids an eligibility judgment call for a portfolio homepage, same validator-only gate).
**Revisable:** yes — if Google narrows `ProfilePage` eligibility to community/forum profiles, fall back to `WebPage`. Nothing else in the graph changes.

## Related

- Issue #11, PR #18
- Follow-up: #19 (`/connect` and `/story`) — `ContactPage` is *not* a Google-supported rich-result type, so `validator.schema.org` is the only gate there; do not chase RRT detection

## Shelf Life

The RRT-specific facts — that `Person` is unsupported standalone, that `Profile page` is supported, that `@id` is not resolved across `@graph` siblings for required-property checks — are Google implementation details and may change; re-run the negative-control paste rather than trusting this document on those specifics. The general rule (a null result from a curated-rule tool is ambiguous; establish that the tool reacts before trusting a zero) is evergreen.
