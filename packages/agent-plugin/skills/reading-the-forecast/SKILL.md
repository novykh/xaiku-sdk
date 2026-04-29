---
name: reading-the-forecast
description: Use when the user wants to know which variant will likely win before launch, or has 2+ approved variants and asks for a preview. Requires Starter+ subscription.
---

# reading-the-forecast

## Preconditions

- Experiment has a control variant and at least 2 approved variants.
- User is on Starter plan or higher (forecast is gated).

## Tool

- `xaiku_forecast_variants(orgId, experimentId)` — returns 5-dim scores per variant + leaderboard + top insight.

## The 5 dimensions

| Dimension | What it measures |
|---|---|
| Readability | Clarity, flow, scannability |
| Relevance | Audience-message fit |
| Urgency | Time pressure, scarcity |
| Specificity | Concrete details vs. vague claims |
| Trust | Credibility, authentic tone |

## Flow

1. Call `xaiku_forecast_variants`.
2. Show the leaderboard as a markdown table: rank, variant id, composite, vs-control delta.
3. Highlight the top insight — the forecast's one-line summary of what separates the leader.
4. Offer follow-ups: "Edit a phrase on the runner-up? Launch the leader? Generate more variants?"

## On free-tier rejection

If the tool returns a plan-gate error, tell the user: *"Forecast requires the Starter plan or higher. You can still launch without it — xaiku will learn which wins from real traffic."*

## Red flags

| Thought | Reality |
|---|---|
| "The top variant will definitely win" | No — forecast is a prediction. Real traffic is truth. |
| "Let me estimate scores for variants not in the approved set" | No — forecast only scores approved variants. Approve first, then forecast. |

## Next likely skill

`going-live`, or back to `editing-phrases` to refine based on the forecast.
