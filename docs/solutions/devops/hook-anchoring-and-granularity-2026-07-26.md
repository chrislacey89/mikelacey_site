---
date: 2026-07-26
category: devops
problem_type: enforcement tooling / correct rules applied to the wrong context
components: [.claude/hooks/enforce-classification.sh, .claude/hooks/quality-gate.sh, .claude/settings.json]
technologies: [bash, claude-code-hooks, vitest, astro, pnpm, git-worktree]
severity: medium
volatility: stable
---

# A gate can be correctly implemented and still be wrong about *where* and *when* it is looking

## Problem

Two enforcement hooks in this repo behaved exactly as written and still produced wrong verdicts during one slice: one blocked work that had already satisfied its precondition, and one reported failures on states that were correct-in-progress. Neither has a bug in its own logic. Both encode an assumption about the shape of the surrounding work that this repo does not satisfy.

## Context

Implementing issue #9 (canonical URLs, PR #23) through `/execute` → `/tdd`. The hooks were hardened the previous day (see the sibling doc below) against *silent* failure — gates that approve everything. These two defects are the inverse: gates that deny loudly and incorrectly.

## Symptoms

- `enforce-classification.sh` blocks a `Write` with *"BLOCKED: classify work… Either invoke /tdd or create .claude/.tdd-skipped"* — **after** `/tdd` has been invoked and the marker demonstrably exists on disk.
- The remedy printed by the gate has already been performed, so following the instruction a second time changes nothing. The operator has no way to act on the message.
- `quality-gate.sh` reports *"Tests failed for changed files"* on an edit whose failing tests are expected to fail — the red half of a red-green cycle that needs more than one edit to complete.
- Reported failures are identical in shape to real ones, so they must each be read and dismissed by hand.

## Root Cause

### 1. Two anchors for "the project directory", and this repo makes them differ

The Astro app is nested: `package.json` lives in `prod/`, not at the repo root. So "the project root" has two defensible referents, and the tooling picks different ones.

- `enforce-classification.sh:39` resolves the marker as `$CLAUDE_PROJECT_DIR/.claude/.tdd-active` — the **git repo root**.
- `/tdd` creates the marker relative to the **shell's cwd** — which is `prod/`, because that is where `pnpm` has to run.

The marker was written to `prod/.claude/.tdd-active`. The hook looked in `<repo-root>/.claude/`. Both are behaving correctly and they never meet.

In a flat repo these two anchors coincide and the mismatch is unobservable. It only appears once repo root ≠ build root — which is also exactly when it is hardest to notice, because both paths look plausible. `quality-gate.sh:17` shows the repo already knows about the nesting (`APP_DIR="$CLAUDE_PROJECT_DIR/prod"`); the classification hook inherited no such awareness because the marker is genuinely repo-level, not app-level. The disagreement is between the hook and the *skill that writes the marker*, not between the two hooks.

### 2. The gate's unit of judgment is one tool call; the unit of correctness is one logical change

`quality-gate.sh` runs on every `Write|Edit` (`.claude/settings.json` PostToolUse) and, at line 88, runs `vitest run --changed`. But a red-green transition frequently requires two or more edits — add the import, then use it; compute the value, then render it. The intermediate states are *correct in progress* and *failing by design*.

The evidence from this one slice is unusually clean about which check suffers:

| Edit | Check that fired | Verdict |
|---|---|---|
| `BaseLayout.astro` — added import only | test run | **false alarm** (tag not wired yet) |
| `BaseLayout.astro` — added `canonical` const | test run | **false alarm** (tag still not emitted) |
| `index.astro` — used `PRODUCTION_ORIGIN` before importing it | typecheck | **true positive** |

Both false alarms came from the test run; the only true positive came from typecheck. That is not coincidence, and it is the actionable part:

- **Typecheck on a partial edit is usually meaningful.** A dangling reference is wrong at every intermediate state, so a red typecheck mid-change is real. The whole-repo scope (justified at `quality-gate.sh:62-67` — a type error often surfaces in the *consumer* file) is earning its keep.
- **A test run on a partial edit is frequently meaningless.** Tests encode behaviour that is *supposed* not to exist yet. Under TDD this is not an edge case — it is the method.

Meanwhile `lefthook` pre-commit ran on all three commits with zero false alarms, because a commit boundary *is* a logical-change boundary by construction.

The structural condition: **per-edit gates sample at a granularity finer than the work's unit of correctness.** For checks whose red state is only ever a defect (typecheck, lint) that is fine. For checks whose red state is a normal intermediate condition (tests), it manufactures false alarms at exactly the rate the developer makes multi-step changes.

## Learning Level

- **Level:** Structure
- **Feedback loop or delay:** A reinforcing loop toward learned dismissal. Each false alarm is individually cheap and correctly ignored; the adaptation that makes them cheap — reading gate output less carefully — is the same adaptation that lets a true positive slip past. The sibling doc closes with *"the warning is only worth anything if someone sees it."* This is how it stops being seen: not by being silenced, but by being diluted. There is no signal at the moment of dilution, which is why the loop runs unchecked.

## Rule Scope

- **Applies when (anchoring):** the repo root and the build root differ — a nested app directory, a monorepo package, an app inside an infra repo — *and* two pieces of tooling locate shared state by different means (an env var like `$CLAUDE_PROJECT_DIR` vs the shell's cwd). The tell: the state file is written and read by different actors, and at least one of them resolves its path relatively.
- **Applies when (granularity):** a gate fires per-edit or on-save and runs a check whose red state is a legitimate intermediate condition — most sharply a test suite under TDD, but also integration checks, snapshot tests, or contract verification.
- **Inverts or does not apply when:** the repo is flat (cwd and repo root coincide, so no anchor can disagree); or the gate runs at a commit/push boundary, which aligns with logical-change granularity by construction — this is why the lefthook pre-commit hook produced no false alarms across the same three commits; or the check is order-independent and file-scoped (Biome lint on the file just written), whose red state is a defect at every intermediate step.
- **Sibling docs:** [Enforcement gates that fail silent](./enforcement-gates-that-fail-silent-2026-07-25.md) — the **inverted failure mode** in the same hooks. That doc is about gates that approve everything and say nothing; this one is about gates that deny correctly-in-progress work and say too much. Both degrade the same asset (whether gate output is worth reading), from opposite directions, so they should be read together.

## Solution

**Anchoring — make the marker path independent of cwd.** The durable fix belongs where the marker is written, not where it is read: `/tdd` should resolve the marker against `$CLAUDE_PROJECT_DIR` (falling back to `git rev-parse --show-toplevel`) rather than cwd. Until then, the repo-side mitigation is for the hook to say what it actually checked, so the operator can act:

```bash
# Before — the remedy may already have been performed; the operator cannot tell
echo '{"decision":"block","reason":"BLOCKED: classify work in /execute Step 3…"}' >&2

# After — name the path, so a marker in the wrong place is diagnosable
if [ ! -f "$CLAUDE_PROJECT_DIR/.claude/.tdd-active" ] && [ ! -f "$CLAUDE_PROJECT_DIR/.claude/.tdd-skipped" ]; then
  FOUND=$(find "$CLAUDE_PROJECT_DIR" -maxdepth 3 -name '.tdd-active' -o -maxdepth 3 -name '.tdd-skipped' 2>/dev/null | head -1)
  REASON="BLOCKED: no classification marker in $CLAUDE_PROJECT_DIR/.claude/."
  [ -n "$FOUND" ] && REASON="$REASON A marker exists at $FOUND — wrong anchor; move it to \$CLAUDE_PROJECT_DIR/.claude/."
  echo "{\"decision\":\"block\",\"reason\":\"$REASON\"}" >&2
  exit 2
fi
```

**Granularity — keep per-edit checks to those whose red state is always a defect.** Split the test run out of the per-edit gate and let the commit boundary own it (lefthook already runs there and was clean on all three commits):

```bash
# quality-gate.sh — keep Biome (file-scoped) and astro check (whole-repo, but
# red only on genuine dangling references). Drop the vitest run:
#
#   VITEST_OUTPUT=$(pnpm exec vitest run --changed 2>&1)   # ← remove
#
# and add it to lefthook.yml instead, where the unit of judgment matches the
# unit of correctness:
```

```yaml
pre-commit:
  commands:
    test:
      root: "prod/"
      run: pnpm exec vitest run --changed
```

This is not a loosening. The suite still gates every commit; it simply stops rendering a verdict on states nobody claimed were finished.

## Prevention

**Code-level:**

- Any file used as cross-tool shared state must have exactly one documented anchor. If one actor resolves it via an env var, every actor must — a relative path anywhere in the chain reintroduces this class the moment repo root ≠ build root.
- A gate's block message should state what it checked, not only what to do about it. *"No marker at `<path>`"* is diagnosable; *"invoke /tdd"* is not, when `/tdd` was already invoked.
- Before adding a check to a per-edit hook, ask whether its red state is ever legitimate mid-change. If yes, it belongs at a commit boundary.

**Process-level:**

- `/init-pipeline` should place whole-suite test runs at the commit boundary and reserve per-edit hooks for file-scoped, order-independent checks. The current scaffold puts tests in the PostToolUse gate, which conflicts with `/tdd` by construction.
- When a project's build root is nested, record that fact where hook authors will see it. `quality-gate.sh` handles it correctly (`APP_DIR="$CLAUDE_PROJECT_DIR/prod"`); nothing propagated that knowledge to the marker convention.
- The main lesson here is partly about Skill Kit rather than this codebase — `/tdd`'s cwd-relative marker write, and `/init-pipeline`'s per-edit test placement. Consider `/improve-pipeline` for those two.

## Planning / Calibration Notes

- **What widened the work:** roughly three interruptions mid-cycle, each requiring the operator to distinguish a false alarm from a real failure by reading output identical in shape to a genuine one. Individually small; the cost is attention, not minutes.
- **What tightened the work:** the hooks' own comments. `quality-gate.sh:62-67` explains *why* typecheck is whole-repo rather than file-scoped, which is precisely the reasoning that identified typecheck as the check worth keeping per-edit. Comments that record rationale rather than behaviour paid off directly here.
- **Future planning adjustment:** treat "the app is nested one level down" as a first-class project fact that any tooling slice must account for, not an incidental layout detail. It has now produced defects in two consecutive sessions.

## Defect Classification

**Origin phase:** Design error, both. Neither hook has a coding defect; each encodes an assumption (one anchor for the project root; one edit equals one complete change) that this repo violates.
**Fix type:** Correction available for both. The anchoring fix is properly upstream in `/tdd`; the repo-side diagnostic message above is a mitigation that makes the failure legible rather than removing it. Moving the test run to the commit boundary is a full correction.

## Key Decision

**Decision:** Move the whole-suite test run from the per-edit PostToolUse gate to the pre-commit boundary; keep Biome and `astro check` per-edit.
**Rationale:** the observed split is clean — both false alarms came from the test run, the only true positive from typecheck. Tests assert behaviour that is legitimately absent mid-change; type errors are wrong at every intermediate state.
**Alternatives considered:** suppressing the gate during `/tdd` via the marker (rejected — disables the gate exactly when code is being written most actively); accepting the noise (rejected — that is the dilution loop above).
**Revisable:** Yes. If commit-boundary testing proves too slow to run on every commit, scope it to `--changed` at pre-push instead — but do not return it to per-edit.

## Related

- Issue #9, PR #23 — the slice during which both surfaced
- [Enforcement gates that fail silent](./enforcement-gates-that-fail-silent-2026-07-25.md) — the inverted failure mode in the same two hooks (PR #22)

## Shelf Life

The granularity claim is evergreen for any per-edit gate running a test suite. The anchoring claim expires if `/tdd` starts resolving markers against `$CLAUDE_PROJECT_DIR`, or if the app moves to the repo root and `prod/` disappears — at that point the two anchors coincide and the defect becomes unreachable.
