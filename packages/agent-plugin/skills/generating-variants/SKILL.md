---
name: generating-variants
description: Use when the user wants variants for an existing experiment — first generation or additional batches. Produces structurally distinct copy with phrase-level analysis.
---

# generating-variants

## Preconditions

- Experiment exists.
- Voice set (or explicitly skipped).

## Tools

- `xaiku_generate_variants(orgId, experimentId, count)` — generates `count` new variants, up to 10 per call. Each variant carries one entry in `variant.parts`, keyed by part id, for every editable template part — each with its own phrase breakdown carrying emotions and gene types.
- `xaiku_create_variant(orgId, experimentId, fields, control?, normalize)` — adds a variant from the user's own text, only when they explicitly ask. Usually this is their current live copy as the control. Ask whether to clean up spacing and punctuation; pass `normalize: true` unless they decline. Then call `xaiku_analyze_variant(orgId, variantId)` so phrase editing works on it.
- `xaiku_update_experiment(orgId, id, patch)` — `patch.variants` sets how many variants the experiment holds (1-32).

## Approving, control and archive

`xaiku_approve_variant(orgId, id, confirmLive?)`, `xaiku_unapprove_variant`, `xaiku_remove_variant_control` and `xaiku_archive_variant(orgId, id, archived?, confirmLive?)` take a variant `id`. `xaiku_set_variant_control(orgId, id, experimentId, confirmLive?)` also needs the `experimentId`. Pass `archived: false` to unarchive. `xaiku_set_variant_weight(orgId, id, weight)` sets how much traffic a version gets, when the user asks. On a live experiment, ask the user first and pass `confirmLive: true` only after they agree. Archiving an approved version also removes its approval; tell the user. The last approved version of a live experiment cannot be archived.

## Flow

1. Ask the user how many variants they want and suggest 3. Generate only once they have stated a number. Save it with `xaiku_update_experiment` (`variants`) before generating.
2. If this is the first generation and no control exists, explain what a control is in one line ("the version you compare against"). Offer to add their current live copy as the control (`xaiku_create_variant` with `control: true`), or to mark one generated version as control, or to continue without one.
3. Call `xaiku_generate_variants`. If it is refused because the experiment is already at its variant count, tell the user in plain words, ask whether to raise the number, then call `xaiku_update_experiment` and retry.
4. Show every version in full, as a visitor would read it (see "Talking to the user" in `using-xaiku`): all parts in page order, labelled in plain words, with how it feels in 1–2 words. Then add one line per version on what makes it different from the others.
5. Check the copy against what the user told you (tone, casing, "we" vs "I", parts that must stay fixed) and flag mismatches in plain words before moving on.
6. If a tool returns a warning that a text is over a field's limit, the text is still saved. Tell the user and offer a shorter version.
7. Offer next moves: "Change a line in one version? See which one is likely to win? Approve them and launch?"

## Red flags

| Thought | Reality |
|---|---|
| "I'll generate 20 to be safe" | No — too many muddies the forecast. 3-5 is a healthy first batch. |
| "I'll pick the number of variants myself" | No — ask, suggest 3, and wait for the user's number. |
| "I'll write one variant myself and ask xaiku to make 4 more" | Only if the user explicitly asks for their own text. Add it with `xaiku_create_variant`, then offer `xaiku_analyze_variant` so it gets the same phrase analysis. Otherwise have xaiku generate. |

## Next likely skill

`editing-phrases` (if the user wants to refine one) or `reading-the-forecast` (if happy with the batch).
