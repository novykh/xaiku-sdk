#!/usr/bin/env bash
# packages/agent-plugin/tests/skill-triggering/runner.sh
#
# Usage: bash runner.sh [prompt-name]
#   Runs one or all prompts through `claude`, checks the expected skill was invoked.
#
# Requires: `claude` CLI authenticated; xaiku plugin installed; XAIKU_TEST_ORG env set.

set -euo pipefail

PROMPTS_DIR="$(dirname "$0")/prompts"
FAILED=0

run_prompt() {
  local prompt_file="$1"
  local name
  name="$(basename "$prompt_file" .txt)"
  local expected
  expected="$(head -n1 "$prompt_file" | sed -E 's/^#\s*expect:\s*//')"
  local body
  body="$(tail -n +2 "$prompt_file")"

  echo "→ $name (expects skill: $expected)"
  local transcript
  transcript="$(echo "$body" | claude --print 2>/dev/null || true)"

  if echo "$transcript" | grep -q "$expected"; then
    echo "  ✓ PASS"
  else
    echo "  ✗ FAIL — skill '$expected' not invoked"
    FAILED=1
  fi
}

if [[ $# -gt 0 ]]; then
  run_prompt "$PROMPTS_DIR/$1.txt"
else
  for p in "$PROMPTS_DIR"/*.txt; do run_prompt "$p"; done
fi

exit $FAILED
