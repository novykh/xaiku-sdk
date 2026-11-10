#!/usr/bin/env bash
# Builds a copy of the plugin that talks to a local xaiku server, for `claude --plugin-dir`.
# The dev Clerk instance has no client registration, so the copy carries a pre-registered client ID.
#
# Usage:
#   XAIKU_OAUTH_CLIENT_ID=<id> pnpm dev:plugin
# Optional:
#   XAIKU_MCP_URL            (default http://localhost:3000/api/mcp)
#   XAIKU_OAUTH_CALLBACK_PORT (default 33418, the port registered on the dev OAuth client)

set -euo pipefail

: "${XAIKU_OAUTH_CLIENT_ID:?set XAIKU_OAUTH_CLIENT_ID to the dev Clerk OAuth client ID}"
MCP_URL="${XAIKU_MCP_URL:-http://localhost:3000/api/mcp}"
CALLBACK_PORT="${XAIKU_OAUTH_CALLBACK_PORT:-33418}"

PLUGIN_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$(cd "$PLUGIN_ROOT/../.." && pwd)/.dev/xaiku-plugin"

rm -rf "$OUT"
mkdir -p "$OUT"
cp -R "$PLUGIN_ROOT/.claude-plugin" "$PLUGIN_ROOT/skills" "$PLUGIN_ROOT/hooks" "$OUT/"

cat > "$OUT/.mcp.json" <<JSON
{
  "mcpServers": {
    "xaiku": {
      "type": "http",
      "url": "$MCP_URL",
      "oauth": { "clientId": "$XAIKU_OAUTH_CLIENT_ID", "callbackPort": $CALLBACK_PORT }
    }
  }
}
JSON

echo "Dev plugin built at $OUT (server: $MCP_URL)"
echo "Start Claude with: claude --plugin-dir \"$OUT\""
