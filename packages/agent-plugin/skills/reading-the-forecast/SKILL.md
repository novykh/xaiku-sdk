---
name: reading-the-forecast
description: Use when the user wants to know which variant will likely win before launch, or has 2+ approved variants and asks for a preview.
---

# reading-the-forecast

## Preconditions

- Experiment has a control variant and at least 2 approved variants.

## Tool

- `xaiku_forecast_variants(orgId, experimentId)` — returns 5-dim scores per variant, a ranking and a top insight. Each item carries a `label`.

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
2. Show the leaderboard as a markdown table: rank, the variant `label` as the tool returns it, and the scores the tool returns. Show only what the tool returned.
3. Highlight the top insight — the forecast's one-line summary of what separates the leader.
4. Offer follow-ups: "Edit a phrase on the runner-up? Launch the leader? Generate more variants?"

## Not enough variants

If the tool returns `needs_more_variants`, tell the user there are not enough versions to compare yet, and offer to add or approve more.

## Red flags

| Thought | Reality |
|---|---|
| "The top variant will definitely win" | No — forecast is a prediction. Real traffic is truth. |
| "Let me estimate scores for variants not in the approved set" | No — forecast only scores approved variants. Approve first, then forecast. |

## Next likely skill

`going-live`, or back to `editing-phrases` to refine based on the forecast.
