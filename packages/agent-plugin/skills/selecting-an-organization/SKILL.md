---
name: selecting-an-organization
description: Use when no orgId is set for the session, when the user mentions a different workspace, or before any other xaiku tool call when the session state has no org. Resolves which org the user wants to work in and remembers it for the rest of the session.
---

# selecting-an-organization

## Preconditions

- Connection is established (`connecting-to-xaiku` has run successfully).
- No `orgId` is currently held for the session, OR the user has switched context.

## What to do

1. Call `xaiku_list_orgs`. Returns a list of Clerk orgs the user belongs to, plus the special `personal` sentinel.
2. If there's exactly one org and no personal workspace content, auto-select it silently.
3. If there's more than one: show the user the list (name + id), ask which to use. Keep the message short.
4. Store the chosen `orgId` in working memory for the rest of the session. Every subsequent xaiku MCP call must include it.
5. Hand off to the next skill dictated by state:
   - If the user mentioned creating/editing a voice → `managing-voices`.
   - If the user described something to test → `creating-an-experiment`.
   - Otherwise → wait for user direction.

## The `personal` sentinel

`personal` is not a Clerk org. It's the per-user workspace. Pass the literal string `"personal"` as `orgId` in subsequent tool calls. The MCP server maps it to the user's personal ownerId.

## Red flags

| Thought | Reality |
|---|---|
| "I'll pick the org named 'Default'" | Ask the user. Don't guess. |
| "I can call tools without orgId" | No — every xaiku tool except `xaiku_list_orgs` requires `orgId`. |

## Next likely skill

State-dependent: `managing-voices`, `creating-an-experiment`, or back to orchestrator routing.
