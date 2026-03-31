---
"@xaiku/shared": patch
---

Fix variant/experiment handling edge cases: guard against empty object falsy bypasses in `getExperiments` and `getVariants`, accept pre-fetched variants via `sdk.options.variants`, simplify experiments initialization.
