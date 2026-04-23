---
name: checking-experiment-results
description: Use when asked about experiment performance, conversion rates, which variant is winning, A/B test results, or experiment analytics
---

# Checking Experiment Results

Use the Xaiku MCP `get_results` tool to retrieve experiment performance data.

## When to Use

- Your human partner asks "how is the experiment doing?"
- You need to decide whether to stop or continue an experiment
- You're reporting on campaign performance
- Someone asks which variant is winning

## Core Pattern

```
1. get_results(experiment_id="...")
2. Report: impressions per variant, conversion rates, which is leading
3. Do NOT claim statistical significance — report directional data only
```

## Reading Results

The `get_results` response contains per-variant data:

```json
{
  "experiment_id": "summer-sale-23",
  "variants": [
    {
      "variant_id": "v_abc",
      "impressions": 142,
      "conversions": 18,
      "conversion_rate": 0.127,
      "control": true
    },
    {
      "variant_id": "v_def",
      "impressions": 138,
      "conversions": 24,
      "conversion_rate": 0.174,
      "control": false
    }
  ]
}
```

## Reporting Rules

1. **Never claim statistical significance.** Xaiku v1 does not compute confidence intervals. Say "Variant B is leading with 17.4% vs 12.7%" — not "Variant B is significantly better."
2. **Always report raw numbers.** Percentages without sample sizes are misleading. Include impression and conversion counts.
3. **Identify the control.** The variant with `control: true` is the baseline. Compare others against it.
4. **Minimum sample check.** If any variant has fewer than 30 impressions, explicitly say the data is too early to draw conclusions.
5. **Report all variants.** Don't cherry-pick the best one. Show the full picture.

## Example Report

> **Experiment: summer-sale-23**
>
> After 280 total impressions across 2 variants:
> - **Control (v_abc):** 142 impressions, 18 conversions (12.7%)
> - **Variant B (v_def):** 138 impressions, 24 conversions (17.4%)
>
> Variant B is leading by 4.7 percentage points. Both variants have sufficient impressions for directional data, but this is not a statistically validated result.
