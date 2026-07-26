#!/bin/bash
# Quality gate — runs after each Write/Edit to catch issues early.
# Only runs on files inside the Astro app (prod/src). Skips test/config files.

# Anchor to the project root before running any feedback loop. If the
# directory is gone — e.g. a worktree was removed out from under the
# shell during /closeout teardown — no-op instead of emitting false
# MODULE_NOT_FOUND errors from a vanished node_modules. A stranded cwd
# must never masquerade as a lint/type failure.
if [ -z "$CLAUDE_PROJECT_DIR" ] || [ ! -d "$CLAUDE_PROJECT_DIR" ]; then
  exit 0
fi

# The Astro app is nested one level down; package.json lives there, not at the
# repo root. Everything below runs from that directory.
APP_DIR="$CLAUDE_PROJECT_DIR/prod"
if [ ! -d "$APP_DIR/node_modules" ]; then
  exit 0
fi
cd "$APP_DIR" || exit 0

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only gate implementation files inside the app's source tree
case "$FILE_PATH" in
  "$APP_DIR"/src/*) ;;
  *) exit 0 ;;
esac
if [[ ! "$FILE_PATH" == *.ts && ! "$FILE_PATH" == *.tsx && ! "$FILE_PATH" == *.astro && ! "$FILE_PATH" == *.js && ! "$FILE_PATH" == *.jsx ]]; then
  exit 0
fi
# Skip test files, type declarations, config files
if [[ "$FILE_PATH" == *test* || "$FILE_PATH" == *spec* || "$FILE_PATH" == *.d.ts || "$FILE_PATH" == *.config.* ]]; then
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

# 2. Type check (astro check — covers .astro, .ts, and .tsx)
TSC_OUTPUT=$(pnpm run typecheck 2>&1)
TSC_EXIT=$?

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
