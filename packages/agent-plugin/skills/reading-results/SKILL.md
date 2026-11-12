---
name: reading-results
description: Use when an experiment is live and the user asks "how's my test doing" / "any results yet" / "who's winning". Pulls aggregated analytics, renders a summary table, significance and a trend chart, links back to the dashboard for deep dives.
---

# reading-results

## Preconditions

- Experiment is live.
- Some events have been collected.

## Tools

- `xaiku_get_analytics(orgId, experimentId)` — returns `{ perVariant, winner, significance, daily, notIncluded }`. `significance` and `daily` depend on the workspace plan (see Plan-dependent fields):
  - `perVariant[i]`: `{ variantId, control, approved, impressions, conversions, conversionRate, deltaVsControl }`.
  - `winner`: `{ variantId, conversionRate, relativeLift }` or `null`. It is a lead signal (enough impressions and enough lift), not a significance test.
  - `significance[i]`: one row per approved variant compared with control — `{ variantId, pValue, adjustedPValue, effectSize, conversionRateCI: { lowerBound, upperBound }, significant }`. `adjustedPValue` is Bonferroni-corrected, `significant` is `adjustedPValue <= 0.05`, `conversionRateCI` is the 95% interval of that variant's own conversion rate (not of the lift). Empty when there is no control or no data to compare. On some plans a row is only `{ variantId, significant }`.
  - `daily[i]`: `{ date, variantId, impressions, conversions }`, one row per UTC day and variant, ordered by day.
  - `notIncluded[i]`: `{ fields, availableFrom }` — fields the workspace plan leaves out and the name of the plan that adds them. Empty when nothing is left out.
- `xaiku_get_readiness(orgId, experimentId)` — optional; provides `stats.requiredSamplePerVariant` and `stats.estimatedWeeks` so you can tell the user how much more data they need.

## What the analytics payload does NOT include

- Sankey, heatmap, radar.
- Per-field breakdowns.

**Never fabricate a confidence figure** (e.g., "winning at 95% confidence"). Report significance only from the `significance` rows. A variant with no row has no significance result — say so.

## Plan-dependent fields

The payload mirrors what the workspace sees in the dashboard:

| Plan | `daily` | `significance` |
|---|---|---|
| Free | absent | absent |
| Starter, Team | present | `{ variantId, significant }` only |
| Pro, Team Pro | present | full rows |

`xaiku_list_events` follows the same rule as `daily`: its `events` rows are absent on Free and present on every paid plan.

- A field listed in `notIncluded` is left out by the plan. It is not missing data and not an error. Do not say "no data yet" for it.
- Work with what is there, then add one line naming what the plan in `availableFrom` adds, with `https://xaiku.com/pricing`. Say it once, not after every answer.
- Never compute, estimate or guess a left-out value (a p-value, an interval, "significant", a trend) from `perVariant` or from raw events.

## Flow

1. If you do not know the experiment id, call `xaiku_list_experiments(orgId)`. If one fits, use it. If several, ask the user which by name.
2. Call `xaiku_get_analytics`. For the raw event rows, `xaiku_list_events(orgId, experimentId)` is also available. It returns `{ events, notIncluded }`; on the Free plan `events` is absent.
3. Render a table, using `perVariant[i].deltaVsControl` directly (already computed as a ratio; format as a % with sign). Take the p-value from the matching `significance` row. Drop the "Adjusted p" column when the rows carry no `adjustedPValue`, and the "Significant" column too when `significance` is absent:

```
| Variant | Imps | Conv | Rate | Δ vs control | Adjusted p | Significant |
| v0 (control) | 1,204 | 58 | 4.8% | — | — | — |
| v1 | 1,198 | 72 | 6.0% | +25% | 0.21 | no |
```

4. If `winner` is non-null and its `significance` row has `significant: true`, add a single-line card: *"🏆 v1 beats control — +25% on 1,198 impressions, statistically significant (adjusted p = 0.01)."* Leave the p-value out when the row has none.
5. If `winner` is non-null but its row is not significant (or missing), say it is leading and not yet significant: *"v1 is leading — +25% vs control, not yet statistically significant (adjusted p = 0.21)."* Never call it a winner.
   If `significance` is absent (see `notIncluded`), say only that it is leading: *"v1 is leading — +25% vs control on 1,198 impressions."* Do not say whether it is significant.
6. If `winner` is null, say so in plain language. Optionally call `xaiku_get_readiness` to get `stats.requiredSamplePerVariant` and compare to current impressions — then tell the user *"You're at 1,198 of ~4,000 impressions needed. Give it another week."* If readiness data is missing, just say *"Not enough data yet — keep it running."* Do not invent an ETA from weekly traffic alone without the readiness sample plan.
7. Show the trend from `daily` (see Charts). Skip this step when `daily` is absent.
8. Link to the xaiku dashboard for the remaining charts (Sankey, heatmap, radar): `https://xaiku.com/dashboard/{org}/experiments/{experimentId}/analysis`.

## Charts

When the host can render charts, draw a line chart from `daily`: one line per variant, x = `date`, y = conversion rate (`conversions / impressions`) or impressions. Use only the values in `daily` — do not smooth, fill missing days, or extrapolate. When the host renders markdown only, show `daily` as a table (or a unicode sparkline per variant). If `daily` is empty, say there is no trend data yet. If `daily` is absent, the plan leaves it out (see Plan-dependent fields) — do not build a trend from `xaiku_list_events` instead.

## Red flags

| Thought | Reality |
|---|---|
| "I'll compute significance myself from the raw numbers" | No — call `xaiku_get_analytics`. The server handles it. |
| "The current leader is the winner" | Not if `winner` is null. Say so. |
| "`daily` is missing, so there is no data yet" | Check `notIncluded`. The plan leaves it out. |
| "I'll work out the p-value the plan leaves out" | No. Name the plan that adds it and stop. |

## Next likely skill

`iterating-on-an-experiment` (if the user wants to push further) or return to orchestrator idle.
