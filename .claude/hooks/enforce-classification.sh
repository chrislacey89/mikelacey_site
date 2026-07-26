#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Implementation patterns — narrowed at install time to this project's actual
# surface (Astro 5 + React 19 + TypeScript). Over-gating is intended within it.
IMPL_PATTERNS=("*.ts" "*.tsx" "*.astro" "*.js" "*.jsx")

MATCHED=0
for pattern in "${IMPL_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" == $pattern ]]; then MATCHED=1; break; fi
done
if [ $MATCHED -eq 0 ]; then exit 0; fi

# Skip test files, type declarations, and config files.
#
# Matched against the basename, never the full path: file_path arrives absolute,
# so a bare *test* would also match any ancestor directory. A worktree or branch
# named `test-*` or `spec-*` — this repo names worktrees after the branch —
# would silently disable the gate for every file in the repo.
BASE_NAME=$(basename "$FILE_PATH")
if [[ "$BASE_NAME" == *.test.* || "$BASE_NAME" == *.spec.* || "$BASE_NAME" == *.d.ts ]]; then
  exit 0
fi
# Skip config files (astro.config, vitest.config, sanity.config, etc.)
if [[ "$BASE_NAME" == *.config.* ]]; then
  exit 0
fi
# Fail open, not closed, when the project dir is unknown. An unset
# CLAUDE_PROJECT_DIR would otherwise resolve the markers to /.claude/*, which
# cannot exist, blocking every edit with a remedy the operator cannot perform.
if [ -z "$CLAUDE_PROJECT_DIR" ] || [ ! -d "$CLAUDE_PROJECT_DIR" ]; then
  exit 0
fi
# Check for classification markers
if [ ! -f "$CLAUDE_PROJECT_DIR/.claude/.tdd-active" ] && [ ! -f "$CLAUDE_PROJECT_DIR/.claude/.tdd-skipped" ]; then
  echo '{"decision":"block","reason":"BLOCKED: classify work in /execute Step 3 before writing implementation files. Either invoke /tdd (backend/behavior-heavy) or create .claude/.tdd-skipped (visual frontend)."}' >&2
  exit 2
fi
exit 0
