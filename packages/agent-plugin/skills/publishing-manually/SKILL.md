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
- `xaiku_update_integration(orgId, experimentId, integration)` — `integration` is an object with `method` and `status`. Fields left out keep their saved value.
- `xaiku_go_live(orgId, experimentId)`

## Flow

1. Fetch approved variants.
2. Present them in a clean format appropriate for the channel:
   - **Ads**: one block per variant, each field labeled, character count shown.
   - **Email subjects**: a bulleted list of subjects.
   - **Social posts**: one post per variant, ready to paste.
3. Explain traffic split: "Run each version for the same time with equal weight."
4. Call `xaiku_update_integration(orgId, experimentId, integration)` with `method: "manual"` and `status: "testing"`, then `xaiku_go_live`.
5. Be honest about results: xaiku cannot import numbers from ad or email tools yet, so it will not show a winner for this test. They compare the versions in their own tool. If they tell you which won, you can help write the next round (`iterating-on-an-experiment`).

## Rendering tips

- Maya sees markdown. Make tables tidy. Show character counts inline (`Headline: "Summer sale — 50% off" (22/30)`).
- Never show variant IDs in the copy block; show them in a separate reference table so she can tell you which one flopped.

## Red flags

| Thought | Reality |
|---|---|
| "Give her the SDK snippet anyway" | No — she doesn't have a codebase. Respect the channel. |
| "Recommend she use a specific ad platform" | No — that's not our call. Work with whatever she's using. |

## Next likely skill

`iterating-on-an-experiment` (once she knows which version won in her own tool).
