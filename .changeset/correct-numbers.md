---
"@xaiku/shared": minor
"@xaiku/react": minor
---

One view per experiment per page load. `Experiment` and `Text` send the experiment view once the variant is known; `Text` keeps a view per part for the per-part charts. `trackView` fills in the selected variant and sends nothing without one, and clicks and conversions no longer send an empty variant. `variants:select` fires after the variants are saved, so listeners can read the selected variant. Experiments are fetched on every page load; the stored copy is used only when the request fails.
