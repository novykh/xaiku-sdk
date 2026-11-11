---
name: going-live
description: Use when the user says "launch" / "go live" / "ship it" — checks the readiness gate, then branches to SDK integration or manual publish based on channel.
---

# going-live

## Preconditions

- Experiment exists with control + ≥1 approved variant.

## Flow

1. If you do not know the experiment id, call `xaiku_list_experiments(orgId)`. If several, ask the user which by name.
2. Call `xaiku_get_readiness(orgId, experimentId)`. If `blockers` is non-empty, stop. Hand back to `configuring-the-experiment` with the blocker list.
3. If only warnings, tell the user and ask if they want to proceed anyway.
4. Ask the user which delivery path:
   - **SDK** — the variants will be served by your code (website/app/landing page).
   - **Manual** — you'll paste copy into another tool (ads, email, social, push, SMS).
   If the persona/channel hints from the orchestrator already answered this, don't re-ask.
5. Hand off to `integrating-the-sdk` or `publishing-manually`. Those skills call `xaiku_go_live` when their prep is complete.

## Red flags

| Thought | Reality |
|---|---|
| "Blockers don't really matter" | They do. Launching without a primary metric means xaiku can't tell you who won. |
| "SDK is better than manual" | They're both fine. Match the user's actual channel. |

## Next likely skill

`integrating-the-sdk` or `publishing-manually`.
