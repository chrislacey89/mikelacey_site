---
date: 2026-07-25
category: devops
problem_type: enforcement tooling / silent no-op failure modes
components: [.claude/hooks/enforce-classification.sh, .claude/hooks/quality-gate.sh, lefthook.yml]
technologies: [bash, claude-code-hooks, lefthook, biome, git-worktree]
severity: high
volatility: stable
---

# A gate whose failure mode is silence is indistinguishable from a gate that approves everything

## Problem

Four defects in one session's enforcement tooling — a classification hook, a quality gate, and a pre-commit hook — all shared one failure mode: the gate stopped checking and reported success. None produced output. None failed a build. Every one of them would have read, from the outside, as "the check passed."

## Context

A repo with no pipeline enforcement had Claude Code hooks, Biome, and Lefthook scaffolded into it. The hooks were written, installed, and spot-checked on the happy path — a blocked edit blocked, an allowed edit passed. Every defect below survived that spot-check, because a hook that has silently disabled itself passes the happy-path test perfectly.

Three were found by reviewing the diff, one by reading a line back immediately after writing it. **Zero were found by running the hooks**, which is the whole point: the observable behaviour of a broken gate and a satisfied gate is identical.

## Symptoms

There is no error message to search for. That is the defining symptom. Recognise it structurally instead:

- A gate that never blocks anything, and you assume the code is clean
- CI or hooks that "run" in well under the time the checks would actually take
- A gate that passes on a tree where you know a violation exists
- Enforcement that works on the machine it was installed on and nowhere else

## Root Cause

Four distinct mechanisms, one shape — the early-exit path returns success:

**1. Substring globs against absolute paths.** The skip predicate was `[[ "$FILE_PATH" == *test* ]]`. Hooks receive *absolute* paths, so the pattern also matches every ancestor directory. This repo names worktrees after the branch, so working on a branch called `test-meta-descriptions` would silently disable both hooks for every file in the repo for the entire session. Verified: `/Users/x/latest-work/src/foo.ts` and `/Users/x/prod/src/lib/protest.ts` both take the skip branch.

**2. Exit status captured after a pipe.** `TSC_OUTPUT=$(pnpm run typecheck 2>&1 | sed 's/…//'); TSC_EXIT=$?` reads *sed's* status, which is always 0. The typecheck arm of the gate could never fail. (Caught by re-reading, pre-commit — but only by reading. No test would have flagged it, because the gate still exited 0 on clean input, exactly as expected.)

**3. A fallback chain ending in `echo`.** Lefthook's generated hook tries ~12 ways to locate its binary and ends with `else echo "Can't find lefthook in PATH"` — no `exit 1`. The hook returns 0 and the commit proceeds with Biome skipped. It only worked at all because lefthook's postinstall happened to run in this worktree, and the installed hook hardcodes an absolute path *into that worktree*. Once `/closeout` tears it down, that path is gone.

**4. A missing-dependency guard that couldn't tell two situations apart.** `[ ! -d "$APP_DIR/node_modules" ] && exit 0` was written for the legitimate case (the worktree was deleted mid-session). It also silently covered the illegitimate one: an operator actively editing a project that was never `pnpm install`ed gets a gate reporting success on checks that never ran.

The structural condition underneath all four: **enforcement tooling is the one category of code where "no output" is the success signal.** For ordinary code a bug surfaces as a wrong value or an exception. For a gate, the correct output on success is *nothing*, so any defect that causes an early return is camouflaged by the contract itself. Add the delayed feedback — you don't discover the gate was off until a defect it should have caught reaches review or production, weeks later — and there is nothing in the loop to correct it.

## Learning Level

- **Level:** Structure
- **Feedback loop or delay:** Missing feedback, not a slow one. Ordinary code has a tight loop (wrong output → notice). A silent gate severs it entirely: the signal that would tell you the gate is broken is *the same signal* it emits when it is working. The loop only closes when an escaped defect is caught downstream and someone thinks to ask why the gate missed it — and the natural conclusion then is "the gate doesn't cover that case," not "the gate has been off for a month."

## Rule Scope

- **Applies when:** the artifact's success output is empty or a zero, and its job is to *withhold* approval. Pre-commit and pre-push hooks, Claude Code PreToolUse/PostToolUse hooks, CI gates, custom lint rules, policy checks, schema guards, feature-flag kill switches. The tell: you cannot distinguish "ran and found nothing" from "did not run" by looking at the output.
- **Also applies when:** the check runs in an environment it did not create — another worktree, a fresh clone, CI, a teammate's machine. Every defect above except #2 was an environment-coupling bug that the authoring machine could not reveal.
- **Inverts or does not apply when:** the tool's success output is a *value* rather than a silence. A test asserting `expect(x).toBe(3)` cannot silently pass on a broken harness — a harness failure surfaces as a mismatch or an error. Adding negative controls there is ceremony. This is the same boundary the sibling doc draws for third-party validators.
- **Sibling docs:** [Validator detection vs acceptance](../testing-patterns/validator-detection-vs-acceptance-2026-07-25.md) — the identical principle for tools you *consume* rather than author. That doc says: never trust a zero without a negative control. This one says: when you wrote the gate yourself, you also own proving it can fail. [Hook anchoring and granularity](./hook-anchoring-and-granularity-2026-07-26.md) — the **inverted** failure mode in these same two hooks: gates that deny loudly and wrongly rather than approving silently. Read together, they bound the problem from both sides; the Key Decision below (fail loud-open) trades toward the failure mode that doc describes, so its dilution loop is the cost of this one's remedy.

## Solution

Prove the gate fails. Not that it passes — passing is what a disabled gate does too.

**Before** — the gate was verified by running it on clean input and observing exit 0. Every defect above survives that check.

**After** — mutation-test the gate, and treat each skip path as a claim requiring evidence:

```bash
# 1. Negative control: does the gate actually reject what it claims to reject?
#    Inject a real violation into a file OTHER than the one being edited —
#    a per-file filter would hide exactly that case.
printf '\nconst broken: number = "not a number";\n' >> src/utils/qrcode.ts
.claude/hooks/quality-gate.sh < payload.json; echo "exit=$?"   # must be 2, not 0
git checkout src/utils/qrcode.ts

# 2. Enumerate every early-exit path and assert the intended one fires.
#    Absolute paths, not basenames, is the trap:
for p in /Users/x/test-branch/src/a.ts /Users/x/src/protest.ts /Users/x/src/a.test.ts; do
  .claude/hooks/enforce-classification.sh <<<"{\"tool_input\":{\"file_path\":\"$p\"}}"
  echo "$p -> $?"     # only the third may be 0
done
```

Code-level changes that removed the four mechanisms:

```bash
# 1. Match the basename, never the absolute path
BASE_NAME=$(basename "$FILE_PATH")
if [[ "$BASE_NAME" == *.test.* || "$BASE_NAME" == *.spec.* ]]; then exit 0; fi

# 2. Capture status before any pipe
TSC_RAW=$(pnpm run typecheck 2>&1)
TSC_EXIT=$?
TSC_OUTPUT=$(echo "$TSC_RAW" | sed 's/\x1b\[[0-9;]*m//g')

# 4. Distinguish "nobody to tell" from "misconfigured", and be loud about the latter
if [ -z "$CLAUDE_PROJECT_DIR" ] || [ ! -d "$CLAUDE_PROJECT_DIR" ]; then
  exit 0                                   # worktree torn down; session ending
fi
if [ ! -d "$APP_DIR/node_modules" ]; then
  echo "quality-gate: SKIPPED — no checks ran. Run 'pnpm install'." >&2
  exit 0                                   # cannot usefully block, but never silent
fi
```

For #3, install the hook from the repo rather than inheriting it: add `"prepare": "lefthook install"` so a fresh clone or new worktree reinstalls it instead of depending on a path baked into a directory that may no longer exist.

## Prevention

**Code-level:**

- Every skip path in a gate either announces itself on stderr or is justified in a comment naming why silence is correct there. In this repo exactly one qualifies: the project directory has vanished, so there is no one left to tell.
- Never `[[ "$path" == *word* ]]` on a value that arrives absolute. Use `basename`, or anchor the pattern (`*.test.*`).
- Never read `$?` after a pipeline. Capture, then transform.
- Prefer fail-loud-open over fail-closed for gates that can misidentify their own environment: fail-closed here blocked every edit while printing a remedy that pointed at `/.claude/`, a path the operator could not create.

**Process-level:**

- When `/init-pipeline` scaffolds hooks, the acceptance check is a mutation test, not a smoke test. "I ran it and it passed" is not evidence a gate works — it is the one observation that cannot distinguish a working gate from a broken one.
- `/pre-merge` should treat any diff touching enforcement tooling as requiring an explicit negative control in the verification notes.
- Verify hooks from an environment other than the one that installed them, since three of the four defects were invisible on the authoring machine.

## Planning / Calibration Notes

- **What widened the work:** scaffolding enforcement was framed as setup, but the gates are production code with an adversarial failure mode. Writing them took minutes; proving they worked took substantially longer and found four defects. Budget the proving, not the writing.
- **What tightened the work:** the gate caught a real pre-existing condition on its first run (a typecheck baseline already failing on `main`), which paid for itself immediately — but only because the failure was loud. The three silent defects sat undetected in the same files.
- **Future planning adjustment:** treat "adopt a linter / add a hook / add a CI gate" as carrying a mandatory verification slice. `/prd-to-issues` should not decompose enforcement tooling into a single "add the hook" slice with no acceptance criterion beyond installation.

## Defect Classification

**Origin phase:** Design error — the hooks were specified by behaviour on the happy path, with no requirement that any skip path be observable.
**Fix type:** Correction for #1, #2, and #4 (the mechanisms are removed). Partial for #3: `prepare` makes installation reproducible, but the `echo`-without-`exit-1` fallback lives in lefthook's generated hook and is not ours to change — the real fix would be upstream, or a wrapper asserting the binary resolved.

## Key Decision

**Decision:** Fail loud-open rather than fail-closed when a gate cannot locate its own configuration.
**Rationale:** fail-closed produced an unrecoverable state — every implementation-file edit blocked, with printed guidance pointing at a path outside the project. Loud-open keeps the operator working and still surfaces that enforcement is off.
**Alternatives considered:** fail-closed with better messaging (rejected — the operator still cannot proceed); silent-open (rejected — that is the defect this document is about).
**Revisable:** Yes. If hook stderr on exit 0 proves not to surface visibly in practice, revisit — the warning is only worth anything if someone sees it.

## Related

- PR #22 — the branch that introduced and then fixed all four
- [Validator detection vs acceptance](../testing-patterns/validator-detection-vs-acceptance-2026-07-25.md) — same principle, for tools you consume rather than author

## Shelf Life

Evergreen as a principle. The specific mechanisms are bash- and Lefthook-specific and would need revisiting if the enforcement layer moves to another runner — but the structural claim (a gate's success signal is silence, so its defects are camouflaged by its own contract) holds for any enforcement tooling in any language.
