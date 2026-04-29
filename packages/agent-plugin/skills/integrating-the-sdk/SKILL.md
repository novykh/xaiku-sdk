---
name: integrating-the-sdk
description: Use on the SDK delivery path — website, app, landing page. Walks the user through installing the right xaiku SDK, wiring the provider, pulling the public key, and running a connection check before flipping live.
---

# integrating-the-sdk

## Preconditions

- `going-live` gate passed.
- User is (or has access to) a developer.

## Pick the SDK

| Channel | Package |
|---|---|
| React app | `@xaiku/react` |
| Next.js app | `@xaiku/nextjs` |
| Browser / vanilla JS | `@xaiku/browser` |
| Node server | `@xaiku/node` |

## Tools

- `xaiku_get_integration(orgId, experimentId)` — returns current integration status and the public key.
- `xaiku_get_sdk_snippet(orgId, experimentId, framework)` — returns `{ install, provider, usage }` canonical strings for `react` | `nextjs` | `browser` | `node`, pre-substituted with the experiment's pkey and field list. **This is the only source of truth for SDK code in the plugin.** Do not invent or hand-write SDK snippets.
- `xaiku_check_connection(orgId, experimentId)` — verifies raw events are flowing (testing state).
- `xaiku_update_integration(orgId, experimentId, { integration: { method: "sdk" } })` — arg schema wraps the patch in an `integration` field (see `app/api/mcp/tools/integration.js`).
- `xaiku_go_live(orgId, experimentId)` — flips integration to `live`.

## Flow

1. Ask which framework: `react`, `nextjs`, `browser`, or `node`.
2. Call `xaiku_get_sdk_snippet` for that framework. Show the three returned strings to the user — `install` first, then `provider` (React/Next only), then `usage`.
3. Tell them to enable test mode (`setTestMode(true)` from `@xaiku/shared`) and load their page.
4. Ask them to tell you when they've done this, then call `xaiku_check_connection`. Retry if pending.
5. On success, status moves to `testing`. Flip to `live` with `xaiku_go_live`.
6. Confirm: *"Live. xaiku is now serving variants. Come back to `reading-results` in a few days."*

## Red flags

| Thought | Reality |
|---|---|
| "I'll generate SDK code from memory" | No. Always call `xaiku_get_sdk_snippet`. It's the single source of truth and includes the right pkey + field list. |
| "The snippet from the tool looks off, I'll tweak it" | No. If the snippet is wrong, that's a bug in `lib/integration/snippets.js` — file it. Do not ship a different snippet to the user. |
| "Skip the connection check" | No — going live without a verified connection burns the experiment. |

## Next likely skill

`reading-results` (after real traffic arrives).
