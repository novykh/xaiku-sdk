---
name: publishing-manually
description: Use when the user is on the manual delivery path — ads, email, social, push, SMS. They take approved variants and paste them into their ad platform / email tool. No code needed.
---

# publishing-manually

## Preconditions

- `going-live` gate passed.
- Channel is non-SDK (Google Ads, Meta Ads, email, LinkedIn, X, push, SMS, etc.).

## Tools

- `xaiku_list_variants(orgId, experimentId)` — filter client-side to `approved: true`.
- `xaiku_update_integration(orgId, experimentId, { integration: { method: "manual" } })` — arg schema wraps the patch in an `integration` field.
- `xaiku_go_live(orgId, experimentId)`

## Flow

1. Fetch approved variants.
2. Present them in a clean format appropriate for the channel:
   - **Ads**: one block per variant, each field labeled, character count shown.
   - **Email subjects**: a bulleted list of subjects.
   - **Social posts**: one post per variant, ready to paste.
3. Offer CSV: format all variants as CSV text in the chat (columns = field IDs, rows = variants). The user can copy and save.
4. Explain traffic split: "Run each variant for the same duration with equal weight. Track which converts, then tell me the results and I'll import them."
5. Call `xaiku_update_integration` with `method: "manual"`, then `xaiku_go_live`.
6. Remind them results can be uploaded via CSV on the analysis page once they have data.

## Rendering tips

- Maya sees markdown. Make tables tidy. Show character counts inline (`Headline: "Summer sale — 50% off" (22/30)`).
- Never show variant IDs in the copy block; show them in a separate reference table so she can tell you which one flopped.

## Red flags

| Thought | Reality |
|---|---|
| "Give her the SDK snippet anyway" | No — she doesn't have a codebase. Respect the channel. |
| "Recommend she use a specific ad platform" | No — that's not our call. Work with whatever she's using. |

## Next likely skill

`reading-results` (once she has tracked data).
