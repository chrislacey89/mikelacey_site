---
date: 2026-09-04
category: patterns
problem_type: implementation intake / an externally-authored specification silently reverses decisions already recorded in the repo
components: [docs/solutions, github-issues, prod/src/utils/jsonld.ts, prod/src/pages/robots.txt.ts, prod/src/pages/work.astro]
technologies: [schema.org, json-ld, robots.txt, vercel, astro]
severity: high
volatility: evergreen
---

# An externally-supplied spec routes around every place this repo records its own decisions

## Problem

Work driven by a specification authored outside the repo — an attached checklist, a pasted audit, a vendor report — reverses decisions the repo had already made and written down, without anyone noticing that a decision was being reversed. The reversals are found at review, after the whole branch exists.

## Context

A session was handed an ~80-item SEO/AEO checklist as an attachment and asked to work it. The checklist was good: specific, evidence-graded, and complete on its own terms. That completeness is the trap — a spec that answers every question it raises gives no signal that the repo has already answered some of them differently.

The session surveyed the codebase thoroughly, implemented against the checklist, and shipped 2,879 lines across 42 files in one commit. It never opened the issue backlog. It never opened `docs/solutions/`.

`/pre-merge` returned nine Concerns. **Four of them were constraints that already existed in the repo before the work started**, each a two-minute read at intake:

| # | Where the decision was recorded | What the branch did |
|---|---|---|
| 1 | Issue #19 §3: *"Do **not** mark up production credits as `Movie`/`ItemList`"*, with Google's self-review manual-action policy as the stated reason | `work.astro:63` ships an `ItemList` of credits |
| 2 | Issue #19: *"`telephone` should be E.164 … strip separators … This is the `toE164` helper that was scoped out of #11"* | `jsonld.ts:266` emits the hyphenated CMS value, and `jsonld.test.ts:329` pins it |
| 3 | Issue #12: *"non-production hosts should not serve a permissive robots.txt pointing at a live sitemap"* | `robots.txt.ts:9` prerenders one file, byte-identical on every deployment — and the PR lists #12 under `Closes` |
| 4 | `docs/solutions/testing-patterns/validator-detection-vs-acceptance-2026-07-25.md:116` — *"Follow-up: #19 … `validator.schema.org` is the only gate there"* | Four new JSON-LD graphs shipped; no schema validation was run, and the PR's verification section does not mention it |

Row 2 is the sharpest: the deviation is now **defended by a passing test**, so correcting it later reads as a regression to anyone who does not know #19 exists.

## Symptoms

There is no error to search for — every one of these ships green. Recognise it structurally:

- The work has a specification, and the specification did not come from this repo
- The branch closes issues it never opened — `Closes #N` written from the diff's shape rather than from the issue's text
- A new test asserts a value that an open issue says is wrong
- A `docs/solutions/` entry names a verification gate for exactly this work, and the PR's verification section lists a different set of checks
- Review findings cluster on "the repo already said not to do this" rather than on "this code is wrong"

## Root Cause

**A decision is not a constraint until something reads it.** This repo records decisions in two durable places, and both are consulted by pipeline steps that an external spec routes around:

- `docs/solutions/` is read by `/research` and `/write-a-prd`.
- The issue backlog is read by `/prd-to-issues` and `/execute`-from-an-issue.

A checklist handed straight to `/execute` enters below all four. `/execute` Step 1 orients on *the task*; nothing in it directs the session to what the repo has already decided *about* the task. The external spec is not competing with the repo's decisions — it never meets them.

Two things make the failure likely rather than merely possible:

1. **The spec's own completeness suppresses the search.** A document that raises and answers eighty questions reads as sufficient. Nothing in it says "the repo may disagree with item 55."
2. **The feedback is delayed by the whole branch.** The correcting signal arrives at `/pre-merge`, which is exactly where it is most expensive — the reversal has to be argued about against 2,879 lines of context instead of against a blank editor.

## Learning Level

- **Level:** Structure
- **Feedback loop or delay:** A missing feedback link, not a broken one. Recorded decisions flow into implementation only through `/research` and the issue-driven path; the external-spec path has no edge back to them. The correcting loop exists (`/pre-merge` Dimensions 4 and 7 caught all four) but closes one full branch late, so its cost scales with the diff rather than with the decision.

## Rule Scope

- **Applies when:** the specification for a piece of work originates outside the repo (attachment, pasted audit, vendor report, third-party checklist) **and** the repo carries durable decision records — an issue backlog with implementation constraints in issue bodies, or a `docs/solutions/`-style archive. Both halves are required: an external spec against a repo with no recorded decisions has nothing to contradict.
- **Inverts or does not apply when:** the work originates from an issue in this repo (that path already reads the record), or the external spec is explicitly a *replacement* for prior decisions — a rewrite, a migration mandate, a compliance requirement. In that case the reconciliation still runs, but its output is "these N decisions are superseded, here is the authority," not "these N decisions were missed." The failure mode this entry describes is the *silent* reversal, not the reversal.
- **Sibling docs:** `docs/solutions/testing-patterns/validator-detection-vs-acceptance-2026-07-25.md` — adjacent, not the same pattern. That entry is about a claim regarding a *tool's output* being inherited rather than observed; this one is about a *recorded decision* never being read at all. They intersect at exactly one point: row 4 above is that entry's own follow-up line going unread, which is this pattern applied to that document.

## Solution

Reconcile before implementing, and write the reconciliation down.

**Before:** read the external spec, survey the codebase, implement.

**After:** read the external spec, then — before any code — search the repo's own records for what it has already decided in this area:

```bash
# Constraints stated in the backlog, not just scope
gh issue list --state all --search "<area keywords>" --json number,title,body

# Gates and follow-ups this repo has already committed to for this class of work
rg -n "Follow-up|Prevention|Do not|must not" docs/solutions/
```

Then state the outcome in the PR body, in one of two forms:

- *"Issue #19 says not to emit an `ItemList` here; this branch does anyway, because \<reason\>."* — a decision, arguable on the merits.
- *"Issue #19 says `telephone` must be E.164; implemented."* — a constraint honoured.

Either is fine. What is not fine is neither, which is what shipped.

The asymmetry is the whole argument: the search is bounded by this repo's backlog and runs once against an empty editor. The alternative is arguing the same four questions at review against a diff that already assumes the answers.

## Prevention

**Code-level:** none available for the class. The failure is at intake, before code exists — there is nothing yet to assert on. The *instances* are testable once fixed (an E.164 assertion on every emitted `Person.telephone`; an assertion that `/work`'s graph carries no `ItemList`), and both belong with the fix rather than here, since committing them today would pin the suite red.

**Process-level:** `prod/CLAUDE.md` now carries the reconciliation step, so it loads into every session in this repo rather than waiting to be found in `docs/solutions/`. That is the mechanism; this entry is the reasoning behind it.

The durable fix belongs one level up, in `/execute` Step 1 — the pipeline step that accepts an external specification is the one that should reconcile it. That change cannot be made from this repo. An anonymized proposal was written for `chrislacey89/skills` and **could not be filed**: `gh issue create` returns `Unauthorized: As an Enterprise Managed User, you cannot access this content`. The body is preserved at `.context/skills-issue-execute-step1-backlog-reconciliation.md` (gitignored) for a human to file from an account that can. Until then, recommend `/improve-pipeline`.

## Planning / Calibration Notes

- **What widened the work:** nothing widened it during implementation — the checklist was accurate and the codebase cooperated. The work widened *after* review: four Concerns that are each small to fix but require reopening decisions the branch had assumed.
- **What tightened the work:** delegating `/pre-merge` to sub-agents that had never seen the implementation. All four of these were found by the reviewer that was told to read the issue bodies itself. The authoring session had read the same issues zero times.
- **Future planning adjustment:** when `/execute` is invoked with an attached specification, treat "what has this repo already decided here" as a research question to discharge before Step 2, not as context to absorb along the way.

## Actuals Worth Reusing

- **Comparable future work:** any audit-driven or checklist-driven change — SEO passes, accessibility remediation, dependency-upgrade sweeps, security-scanner findings. All arrive as complete-looking external documents.
- **Reusable baseline:** on a repo with ~14 open issues, reconciling an 80-item external checklist against the backlog is a single `gh issue list` plus reading four or five bodies. Against that, four of nine review Concerns on this branch were preventable by it.

## Defect Classification

**Origin phase:** Specification error — the spec was correct in itself and incomplete as an authority, because nothing reconciled it with the repo's standing decisions.
**Fix type:** Correction at the process level (the reconciliation step now exists in `prod/CLAUDE.md`); the four instances it should have caught are corrections pending in `/fix-findings`.

## Related

- PR #24 — the branch this was learned on
- Issues #19, #12 — the recorded decisions that were reversed
- `docs/solutions/testing-patterns/validator-detection-vs-acceptance-2026-07-25.md` — the entry whose own follow-up line row 4 missed

## Shelf Life

Evergreen — no expiration condition. The specific records change; "a decision is not a constraint until something reads it" does not. Supersede this entry if `/execute` gains an intake reconciliation step, at which point it becomes the reasoning behind a step rather than a substitute for one.
