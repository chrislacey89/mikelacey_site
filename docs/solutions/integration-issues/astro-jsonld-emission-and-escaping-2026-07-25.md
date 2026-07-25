---
date: 2026-07-25
category: integration-issues
problem_type: framework templating semantics / XSS
components: [BaseLayout.astro, JsonLd.astro, src/utils/jsonld.ts]
technologies: [astro, json-ld, schema.org, sanity]
severity: high
volatility: stable
---

# Emitting JSON-LD in Astro: two traps that both look correct

## Problem

Writing a `<script type="application/ld+json">` block in an `.astro` file has two independent failure modes, and the natural way to write it hits both. One produces silently broken output; the other is a genuine XSS hole. Neither is caught by the type checker, the build, or a passing test suite.

## Context

Adding a schema.org `Person` block to the homepage (issue #11, PR #18), sourced from Sanity CMS content.

## Symptoms

- **Trap 1:** view-source shows the literal text `{JSON.stringify(graph)}` instead of JSON. Validators report a parse error; the build is green.
- **Trap 2:** no visible symptom at all until a CMS string happens to contain `</script>`, at which point the block terminates early and everything after it becomes live DOM.

## Root Cause

**Trap 1 — inline script tags do not interpolate.** Astro [only processes `<script>` tags with no attribute other than `src`](https://docs.astro.build/en/guides/client-side-scripts/#script-processing). `type="application/ld+json"` is such an attribute, so [`is:inline` is implied](https://docs.astro.build/en/reference/directives-reference/#isinline) and the tag body becomes raw text — `{expressions}` inside it are never evaluated.

The docs state the inline behavior. They do **not** state the interpolation consequence, which is the part that actually bites. Astro issues [#1266](https://github.com/withastro/astro/issues/1266) and [#3544](https://github.com/withastro/astro/issues/3544) are both this.

**Trap 2 — `set:html` is unescaped by design.** Astro's docs are explicit: *"The value is not automatically escaped by Astro! … Forgetting to do this will open you up to Cross Site Scripting (XSS) attacks."* `JSON.stringify` escapes for JSON, not for HTML. `set:text` *is* escaped but entity-mangles the JSON into something unparseable, so it is not an escape hatch.

The two traps interact: fixing Trap 1 (switch to `set:html`) is what *creates* Trap 2. Anyone who hits the first and fixes it lands directly on the second.

## Learning Level

- **Level:** Structure
- **Feedback loop or delay:** Two structural conditions keep producing this. First, the framework's two relevant facts live on different documentation pages and neither cross-references the other, so the fix for one leads directly into the other. Second — and worse — both defects are **invisible to every automated signal the project has**: typecheck passes, build succeeds, unit tests on the serializer pass, and the page returns 200. The failure surfaces only when a human reads view-source, or when a specific CMS string appears months later. Delayed, silent feedback on a security-relevant path is the structure; the individual bugs are the symptom.

## Rule Scope

- **Applies when:** emitting *non-JavaScript* content into a `<script>` tag in an `.astro` template — JSON-LD, `importmap`, `speculationrules`, `application/json` config blobs. Any `type` attribute triggers the inline treatment, so the rule is about the attribute, not about JSON-LD specifically. The escaping half applies with full force whenever any part of the payload originates outside the source file (CMS, API, user input); when the payload is entirely hardcoded literals the escaping is belt-and-braces, but the interpolation rule still applies absolutely.
- **Inverts or does not apply when:** the framework is JSX-based (React, Preact, Solid). There, `{expression}` children interpolate normally, so Trap 1 does not exist — but Trap 2 does, in the form of `dangerouslySetInnerHTML`, and needs the identical `<` treatment. Do not carry the "use `set:html`" half across; do carry the escaping half. Next.js documents [the same `<` mitigation](https://nextjs.org/docs/app/guides/json-ld) for its equivalent path.
- **Also does not apply to:** `<script>` tags with no attributes or only `src` — those are processed and bundled normally, which is the documented behavior everyone already expects.
- **Sibling docs:** [validator detection vs acceptance](../testing-patterns/validator-detection-vs-acceptance-2026-07-25.md) — the verification half of this same feature.

## Solution

**Before** — broken (ships literal source text):

```astro
<script type="application/ld+json">{JSON.stringify(graph)}</script>
```

**Also before** — renders correctly, and is exploitable:

```astro
<script type="application/ld+json" set:html={JSON.stringify(graph)} />
```

**After** — one component owns the tag, both directives, and the escaping:

```astro
---
// src/components/shell/JsonLd.astro
import { serializeJsonLd } from '../../utils/jsonld';
const { graph } = Astro.props;
---
{graph && <script type="application/ld+json" is:inline set:html={serializeJsonLd(graph)} />}
```

```typescript
// src/utils/jsonld.ts
export function serializeJsonLd(graph: object): string {
  return JSON.stringify(graph).replace(/</g, '\\u003c');
}
```

`<` is a native JSON escape, so `</` can never form and `JSON.parse` still returns a real `<`. Prefer it over HTML-entity escaping, which also blocks the breakout but is lossy — [W3C JSON-LD 1.1 §7.2](https://www.w3.org/TR/json-ld11/#restrictions-for-contents-of-json-ld-script-elements) notes that entity-escaped content *"will remain escaped after processing through the JSON-LD API"*, so consumers receive `Mike &amp; Co`.

`is:inline` is behaviorally redundant but silences an `astro check` hint and documents the intent.

## Prevention

**Code-level:**
- Put the tag in a single component. `serializeJsonLd`'s signature cannot force a caller to use `set:html`, so the guarantee is only real if there is exactly one caller. Extracting `JsonLd.astro` converted a documented convention into an unforgeable one.
- Test the *emission site*, not just the serializer. `experimental_AstroContainer` renders `.astro` components in vitest and is the only thing that can catch Trap 1:
  ```typescript
  const html = await AstroContainer.create().then(c => c.renderToString(JsonLd, { props }));
  expect(html).not.toContain('serializeJsonLd');   // Trap 1
  expect(html).not.toContain('<img');              // Trap 2 — no live element escaped
  expect(html.match(/<\/script>/g)).toHaveLength(1);
  ```
  This requires `getViteConfig` from `astro/config` in `vitest.config.ts` so `.astro` files are importable.
- Assert the *invariant*, not the mechanism. `expect(out).not.toContain('<')` survives a switch to any other lossless escape; `expect(out).toContain('\\u003c')` would pin the implementation and produce a false failure on a safe refactor.

**Process-level:**
- **Use HTML comments in `.astro` files only when the comment should ship.** `<!-- -->` is passed through verbatim; only `{/* */}` is stripped. An 11-line explanatory comment written as `<!-- -->` shipped to every visitor on all five pages of this site — including pages that emitted no JSON-LD — and publicly narrated the mitigation. Caught in review, not by any tool.
- **When verifying rendered output, read the whole `<head>`, not the element you were working on.** The comment leak was missed precisely because verification grepped for the JSON-LD block and found it correct.

## Planning / Calibration Notes

- **What widened the work:** the escaping and emission traps were both known from research *before* implementation and still cost a review cycle — one via the comment leak, one via a missing emission test. Knowing a trap exists is not the same as having a guard against it.
- **What tightened the work:** building a scratch Astro project at the exact installed version during `/research` and observing the emitted HTML for each candidate form. That converted five plausible-looking options into one correct one before any production code was written.
- **Future planning adjustment:** when `/research` establishes a framework behavior empirically, the PRD should carry the *guard* (a named test) as a deliverable, not just the finding as prose. The finding informs the first write; only the guard survives the second.

## Key Decision

**Decision:** hand-roll the emission and escaping rather than adopt `astro-seo-schema`.
**Rationale:** on Astro 5 that package resolves to `5.0.0` (published 2024-12-03), its entire implementation is the one line above, and its serializer uses the lossy entity escaper. Hand-rolling allowed choosing `<`.
**Alternatives considered:** `astro-seo-schema` (rejected — pinned to a 2024 release for one line, worse escaping); `schema-dts` for compile-time property typing (rejected — `validator.schema.org` already catches unknown properties, and it is a 12k-line type dependency for ~20 lines of object literal).
**Revisable:** yes — adopt `schema-dts` if the graph grows past a couple of node types, where typo risk starts to exceed the dependency cost.

## Related

- Issue #11, PR #18
- Follow-up: #19 (extend to `/connect` and `/story`)

## Shelf Life

Trap 1 expires if Astro ever interpolates expressions inside attributed `<script>` tags, or ships a first-class structured-data helper. Trap 2 is inherent to raw HTML injection and will not expire while `set:html` exists. Re-verify the emission behavior on any Astro major upgrade — this was established against `astro@5.16.6`, and the repo's `^5.16.6` range already floats within 5.x while Astro 7 is current.
