---
name: connecting-to-xaiku
description: Use on first run, when a xaiku MCP tool returns 401, or when the user says "log in / reconnect". Walks the user through the OAuth handshake with xaiku's MCP server.
---

# connecting-to-xaiku

## Preconditions

- A xaiku MCP tool has never been called successfully this session, OR
- A xaiku MCP tool just returned 401/unauthorized.

## What to do

1. Tell the user you're going to open a browser for them to sign in to xaiku.
2. Call any xaiku MCP tool (e.g., `xaiku_list_orgs`). Claude Code will trigger the OAuth flow on first call: a browser window opens, the user signs in with Clerk, the token is stored.
3. Once the call succeeds, confirm: *"Connected. I can see your xaiku account."*
4. Hand off to `selecting-an-organization`.

## Red flags

| Thought | Reality |
|---|---|
| "I'll ask for an API key" | No — xaiku uses OAuth via MCP. The user just clicks through a browser flow. No keys to paste. |
| "The 401 means xaiku is broken" | No — it means the token expired or never existed. Trigger the flow. |

## Next likely skill

`selecting-an-organization`
