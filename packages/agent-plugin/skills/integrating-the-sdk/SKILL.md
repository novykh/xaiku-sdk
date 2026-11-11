---
name: integrating-the-sdk
description: Use when the user is on the SDK delivery path — website, app, landing page. Walks them through installing the right xaiku SDK, wiring the provider, pulling the public key, and running a connection check before flipping live.
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
- `xaiku_create_public_key(orgId)` — creates the workspace public key when there is none and returns `{ publicKey, created }`. When a key already exists it returns that key unchanged, so it is safe to call again.
- `xaiku_get_sdk_snippet(orgId, experimentId, framework)` — returns `{ install, provider, usage }` canonical strings for `react` | `nextjs` | `browser` | `node`, pre-substituted with the experiment's pkey and field list. **This is the only source of truth for SDK code in the plugin.** Do not invent or hand-write SDK snippets.
- `xaiku_check_connection(orgId, experimentId)` — returns `connected: true` or `connected: false`. It only reads; it changes nothing.
- `xaiku_update_integration(orgId, experimentId, integration)` — `integration` is an object with `method` and `status`. Always pass both.
- `xaiku_go_live(orgId, experimentId)` — flips integration to `live`.

## Flow

1. Ask which framework: `react`, `nextjs`, `browser`, or `node`.
2. Call `xaiku_create_public_key`, so the snippet carries a real key instead of the `your-public-key` placeholder. Then call `xaiku_get_sdk_snippet` for that framework. Show the three returned strings to the user — `install` first, then `provider` (React/Next only), then `usage`.
3. Tell them to enable test mode (`setTestMode(true)` from `@xaiku/shared`) and load their page.
4. Call `xaiku_update_integration` with `method: "sdk"` and `status: "testing"`.
5. Ask them to tell you when they've loaded the page, then call `xaiku_check_connection`. If it says `connected: false`, ask them to check test mode and reload, then try again.
6. When it says `connected: true`, flip to `live` with `xaiku_go_live`.
7. Confirm: *"Live. xaiku is now serving variants. Come back to `reading-results` in a few days."*

## Red flags

| Thought | Reality |
|---|---|
| "I'll generate SDK code from memory" | No. Always call `xaiku_get_sdk_snippet`. It's the single source of truth and includes the right pkey + field list. |
| "The snippet from the tool looks off, I'll tweak it" | No. If the snippet is wrong, that's a bug in `lib/integration/snippets.js` — file it. Do not ship a different snippet to the user. |
| "Skip the connection check" | No — going live without a verified connection burns the experiment. |

## Next likely skill

`reading-results` (after real traffic arrives).
