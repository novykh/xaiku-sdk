# @xaiku/agent-plugin

The xaiku agent plugin for Claude Code.

Install via the xaiku marketplace. Once enabled, any Claude Code session
(including Cowork and NanoClaw) can drive xaiku experiments end-to-end:
create, generate variants, edit phrases, read the forecast, launch, and
analyze results.

## What's inside

- **MCP server registration** — auto-connects to `mcp.xaiku.com` using
  Claude Code's OAuth flow.
- **SessionStart hook** — injects the `using-xaiku` orchestrator so the
  agent knows when and how to use xaiku.
- **14 skills** — one per stage of the experiment lifecycle.
