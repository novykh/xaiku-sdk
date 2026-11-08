---
name: generating-variants
description: Use when the user wants variants for an existing experiment — first generation or additional batches. Produces structurally distinct copy with phrase-level analysis.
---

# generating-variants

## Preconditions

- Experiment exists.
- Voice set (or explicitly skipped).

## Tool

- `xaiku_generate_variants(orgId, experimentId, count)` — generates `count` new variants. `count` is capped at **10 per call** by the MCP tool schema (see `app/api/mcp/tools/variants.js`). For larger batches on paid tiers, call multiple times. Each variant carries one entry in `variant.parts`, keyed by part id, for every editable template part — each with its own phrase breakdown carrying emotions and gene types.

## Flow

1. Ask the user how many variants (default to 5 on free/starter, 8 on pro — but let them override).
2. If this is the first generation and no control exists, explain what a control is in one line ("the version you compare against"). The MCP tools cannot yet add the user's current live copy as a variant: `xaiku_set_variant_control` only marks an existing generated variant. Say this plainly, and offer to mark one generated version as control or to continue without one.
3. Call `xaiku_generate_variants`.
4. Show every version in full, as a visitor would read it (see "Talking to the user" in `using-xaiku`): all parts in page order, labelled in plain words, with how it feels in 1–2 words. Then add one line per version on what makes it different from the others.
5. Check the copy against what the user told you (tone, casing, "we" vs "I", parts that must stay fixed) and flag mismatches in plain words before moving on.
6. Offer next moves: "Change a line in one version? See which one is likely to win? Approve them and launch?"

## Tier limits

- Free: 2 variants max.
- Starter: 8.
- Pro: 32.

If the user asks for more than their tier allows, say so and offer the tier max.

## Red flags

| Thought | Reality |
|---|---|
| "I'll generate 20 to be safe" | No — too many muddies the forecast. 3-5 is a healthy first batch. |
| "I'll write one variant myself and ask xaiku to make 4 more" | No — always have xaiku generate from scratch. Your handwritten variant loses the phrase analysis. |

## Next likely skill

`editing-phrases` (if the user wants to refine one) or `reading-the-forecast` (if happy with the batch).
