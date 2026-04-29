---
name: reading-results
description: Use when an experiment is live and the user asks "how's my test doing" / "any results yet" / "who's winning". Pulls aggregated analytics, renders a summary table and winner card, links back to the dashboard for deep dives.
---

# reading-results

## Preconditions

- Experiment is live.
- Some events have been collected.

## Tools

- `xaiku_get_analytics(orgId, experimentId)` — returns `{ perVariant: [...], winner: { variantId, conversionRate, relativeLift } | null }`. `perVariant[i]` has `{ variantId, control, approved, impressions, conversions, conversionRate, deltaVsControl }`.
- `xaiku_get_readiness(orgId, experimentId)` — optional; provides `stats.requiredSamplePerVariant` and `stats.estimatedWeeks` so you can tell the user how much more data they need.

## What the v1 analytics payload does NOT include

- Statistical significance / p-value / confidence interval.
- Time-series, Sankey, heatmap, radar.
- Per-field breakdowns.

**Never fabricate a confidence figure** (e.g., "winning at 95% confidence"). The v1 payload has no such field. For significance, link the user to the dashboard.

## Flow

1. Call `xaiku_get_analytics`.
2. Render a table, using `perVariant[i].deltaVsControl` directly (already computed as a ratio; format as a % with sign):

```
| Variant | Imps | Conv | Rate | Δ vs control |
| v0 (control) | 1,204 | 58 | 4.8% | — |
| v1 | 1,198 | 72 | 6.0% | +25% |
```

3. If `winner` is non-null, add a single-line card: *"🏆 v1 is leading — +25% vs control on 1,198 impressions. Confirm significance on the dashboard."* Never claim a confidence %.
4. If `winner` is null, say so in plain language. Optionally call `xaiku_get_readiness` to get `stats.requiredSamplePerVariant` and compare to current impressions — then tell the user *"You're at 1,198 of ~4,000 impressions needed. Give it another week."* If readiness data is missing, just say *"Not enough data yet — keep it running."* Do not invent an ETA from weekly traffic alone without the readiness sample plan.
5. Link to the xaiku dashboard for charts (time series, Sankey, heatmap) and significance: `https://xaiku.com/dashboard/{org}/experiments/{experimentId}/analysis`.

## Rendering in Cowork

Cowork renders markdown. No React charts. Stick to tables, counts, and a winner card. For time trends, unicode sparklines are acceptable but optional — the dashboard is the canonical chart source.

## Red flags

| Thought | Reality |
|---|---|
| "I'll compute significance myself from the raw numbers" | No — call `xaiku_get_analytics`. The server handles it. |
| "The current leader is the winner" | Not if `winner` is null. Say so. |

## Next likely skill

`iterating-on-an-experiment` (if the user wants to push further) or return to orchestrator idle.
