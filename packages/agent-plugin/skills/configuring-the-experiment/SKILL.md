---
name: configuring-the-experiment
description: Use when readiness is below 100%, when going live is blocked, or when the user asks about metrics / baseline / traffic / significance. Sets the four config fields and reports readiness.
---

# configuring-the-experiment

## Preconditions

- Experiment exists, has at least one approved non-control variant.

## The four config fields

Config lives in the **`samplePlan` subdoc** on the experiment — NOT at the top level:

```
experiment.samplePlan = {
  primaryMetric: 'conversion_rate' | 'click_through_rate',
  baselineRate: 0-1 decimal,
  mde: 0-1 decimal (e.g., 0.1 = 10% minimum detectable effect),
  weeklyTraffic: positive integer,
}
```

| Field | What it is | How to get it from the user |
|---|---|---|
| `primaryMetric` | `"conversion_rate"` or `"click_through_rate"`. | Ask what "winning" looks like — a click or a conversion. |
| `baselineRate` | Current rate, as a decimal 0-1 (e.g., 0.05 = 5%). | Ask the current conversion/click-through rate for this page/ad/email. |
| `mde` | Minimum detectable effect, as a decimal 0-1 (e.g., 0.1 = 10%). | Default to 0.1 if they don't know. |
| `weeklyTraffic` | Weekly visitors/impressions expected. | Ask their rough weekly volume. |

## Tools

- `xaiku_get_readiness(orgId, experimentId)` — returns `{ blockers, warnings, readiness, isBlocked, stats: { requiredSamplePerVariant, totalSampleNeeded, estimatedDays, estimatedWeeks } }`.
- `xaiku_get_experiment(orgId, id)` — reads the experiment. It takes `id`; the readiness tool takes `experimentId`.
- `xaiku_update_experiment(orgId, id, patch)` — `id` is the experiment id. Nest the four fields inside `samplePlan` in the patch. Partial updates to `samplePlan` replace the subdoc; to preserve existing values, merge them client-side first from `xaiku_get_experiment`.

## Flow

0. If you do not know the experiment id, call `xaiku_list_experiments(orgId)`. If one fits, use it. If several, ask the user which by name.
1. Call `xaiku_get_readiness`.
2. If readiness < 1, walk through the missing fields one by one (or batch them in one question if the user is impatient).
3. Call `xaiku_get_experiment` to read the current `samplePlan`, merge the new values, then call `xaiku_update_experiment` with `patch.samplePlan` set to the merged values.
4. Re-call `xaiku_get_readiness` to confirm. Report the sample plan in plain English, reading from `stats.estimatedWeeks`: *"With 10k weekly visitors at a 5% baseline, detecting a 10% lift needs ~2 weeks."*
5. Flag any warnings (e.g., `underpowered` → ask if they want to lower MDE or extend timeline).

## Red flags

| Thought | Reality |
|---|---|
| "I'll guess the baseline at 5%" | No — ask the user. Guessing distorts the sample plan. |
| "Readiness 80% is fine, let's launch" | Check whether the remaining 20% is blockers or warnings. Only warnings may be acceptable to bypass. |

## Next likely skill

`reading-the-forecast` or `going-live`.
