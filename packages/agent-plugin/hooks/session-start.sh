#!/usr/bin/env bash
# session-start.sh — inject the xaiku orchestrator skill into the session.
#
# Reads skills/using-xaiku/SKILL.md from the plugin root and emits a
# SessionStart JSON response with `additionalContext`. Always includes a
# first-run preamble so non-onboarded users get a proactive hello; once
# onboarded the orchestrator instructs the agent to skip the hello.
#
# A missing skill file is a broken install — emit an empty JSON object
# rather than crash the session.

set -euo pipefail

PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"
ORCH_PATH="$PLUGIN_ROOT/skills/using-xaiku/SKILL.md"

if [[ ! -f "$ORCH_PATH" ]]; then
  printf '%s' '{}'
  exit 0
fi

ORCHESTRATOR_BODY=$(cat "$ORCH_PATH")

FIRST_RUN_PREAMBLE=$(cat <<'EOF'

---
## First-run note

If this is the first message of the session and the user has not yet
used xaiku, open with:

> "xaiku is installed. I can help you test copy — headlines, ads, emails,
> CTAs. What are you working on?"

Do not say xaiku is connected until a xaiku tool has answered. Invoke
`connecting-to-xaiku` as soon as the user describes something testable.

If you can already see a successful response from any xaiku tool this
session (e.g., the agent has called `xaiku_list_orgs` and got a real
list), skip the hello — the user is already onboarded.
EOF
)

ADDITIONAL_CONTEXT=$(printf '<EXTREMELY-IMPORTANT>\n%s%s\n</EXTREMELY-IMPORTANT>' \
  "$ORCHESTRATOR_BODY" "$FIRST_RUN_PREAMBLE")

ESCAPED=$(printf '%s' "$ADDITIONAL_CONTEXT" \
  | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')

printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":%s}}\n' \
  "$ESCAPED"
