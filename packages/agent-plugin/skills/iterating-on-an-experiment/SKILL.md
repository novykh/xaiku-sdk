---
name: iterating-on-an-experiment
description: Use when results are in and the user wants to rerun, refine, or launch a follow-up. Turns insight into the next experiment.
---

# iterating-on-an-experiment

## Preconditions

- Experiment has results (live + events collected) OR the user explicitly references a past experiment.

## Modes

| User signal | Next step |
|---|---|
| "Winner was weak, try different angle" | New experiment (use `creating-an-experiment` with findings as seed). |
| "Winner was clear, push the angle further" | New experiment generating more variants in the winning direction. Reuse the voice; set the winner as the new baseline. |
| "Mix of learnings across 2 experiments" | Create a fresh experiment and feed the top phrases from each as control context. |

## Flow

1. Summarize what we learned in one line (pull from `xaiku_get_analytics` + `xaiku_forecast_variants` if still available).
2. Ask the user what angle they want to explore next. Offer 2-3 concrete options.
3. Hand off to `creating-an-experiment` with seed context, or `generating-variants` if they want more variants on the existing experiment.

## Red flags

| Thought | Reality |
|---|---|
| "Archive the old experiment first" | Don't archive — you'll want to reference it. Just create the new one. |
| "Apply winning copy automatically" | No — let the user decide. They may want to test a refinement rather than ship the raw winner. |

## Next likely skill

`creating-an-experiment` or `generating-variants`.
