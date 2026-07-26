#!/bin/bash
# Quality gate — runs after each Write/Edit to catch issues early.
# Covers the app's src/, scripts/ and sanity/ trees. Skips test/config files.

# Anchor to the project root before running any feedback loop. If the
# directory is gone — e.g. a worktree was removed out from under the
# shell during /closeout teardown — no-op instead of emitting false
# MODULE_NOT_FOUND errors from a vanished node_modules. A stranded cwd
# must never masquerade as a lint/type failure. This is the one case where
# silence is right: the session is ending, there is nobody to tell.
if [ -z "$CLAUDE_PROJECT_DIR" ] || [ ! -d "$CLAUDE_PROJECT_DIR" ]; then
  exit 0
fi

# The Astro app is nested one level down; package.json lives there, not at the
# repo root. Everything below runs from that directory.
APP_DIR="$CLAUDE_PROJECT_DIR/prod"

# Missing deps is NOT the teardown case — the project is present and the
# operator is actively editing it. Say so rather than exiting 0, which would
# report a pass for checks that never ran. A gate whose failure mode is silence
# is indistinguishable from a gate that approves everything.
if [ ! -d "$APP_DIR/node_modules" ]; then
  echo "quality-gate: SKIPPED — $APP_DIR/node_modules is missing. No lint, typecheck, or tests ran. Run 'pnpm install' in prod/ to re-enable the gate." >&2
  exit 0
fi
cd "$APP_DIR" || exit 0

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only gate implementation files inside the directories Biome is configured for
# (biome.json `files.includes`). Previously src/ only, which left scripts/ and
# sanity/ ungated — including scripts/migrate-to-sanity.ts, where one of the
# type errors this gate is meant to catch actually lived.
case "$FILE_PATH" in
  "$APP_DIR"/src/* | "$APP_DIR"/scripts/* | "$APP_DIR"/sanity/*) ;;
  *) exit 0 ;;
esac
if [[ ! "$FILE_PATH" == *.ts && ! "$FILE_PATH" == *.tsx && ! "$FILE_PATH" == *.astro && ! "$FILE_PATH" == *.js && ! "$FILE_PATH" == *.jsx ]]; then
  exit 0
fi
# Skip test files, type declarations, config files. Basename, not full path —
# see enforce-classification.sh for why a bare *test* is unsafe here.
BASE_NAME=$(basename "$FILE_PATH")
if [[ "$BASE_NAME" == *.test.* || "$BASE_NAME" == *.spec.* || "$BASE_NAME" == *.d.ts || "$BASE_NAME" == *.config.* ]]; then
  exit 0
fi

# 1. Biome lint, scoped to the file just written.
#
# Lint only, not `check`: formatting is enforced at commit time by lefthook, and
# running the formatter here would flag every pre-existing file the moment it is
# touched. Scoped to $FILE_PATH rather than src/ for the same reason — Biome was
# adopted after this codebase was written, so a whole-tree gate reports 29
# pre-existing errors and blocks every edit. Widen to src/ once that backlog is
# cleared.
BIOME_OUTPUT=$(pnpm exec biome lint --colors=off "$FILE_PATH" 2>&1)
BIOME_EXIT=$?

# 2. Type check (astro check — covers .astro, .ts, and .tsx).
#
# Whole-repo and blocking on the exit code: the baseline is clean (0 errors),
# so any failure here is attributable to the current change. Deliberately not
# filtered to $FILE_PATH — a type error caused by this edit frequently surfaces
# in the *consumer* file rather than the one just written, and a per-file filter
# would hide exactly that case.
# Capture the status before stripping colour: piping into sed would make $?
# report sed's status, which is always 0, silently disabling this check.
TSC_RAW=$(pnpm run typecheck 2>&1)
TSC_EXIT=$?
TSC_OUTPUT=$(echo "$TSC_RAW" | sed 's/\x1b\[[0-9;]*m//g')

if [ $BIOME_EXIT -ne 0 ] || [ $TSC_EXIT -ne 0 ]; then
  if [ $BIOME_EXIT -ne 0 ]; then
    echo "Biome errors found:" >&2
    echo "$BIOME_OUTPUT" >&2
    echo "" >&2
  fi
  if [ $TSC_EXIT -ne 0 ]; then
    echo "Type errors found:" >&2
    echo "$TSC_OUTPUT" >&2
  fi
  exit 2
fi

# 3. Run tests for changed files only (vitest import graph analysis)
VITEST_OUTPUT=$(pnpm exec vitest run --changed 2>&1)
VITEST_EXIT=$?

if [ $VITEST_EXIT -ne 0 ]; then
  echo "Tests failed for changed files:" >&2
  echo "$VITEST_OUTPUT" >&2
  exit 2
fi

exit 0
