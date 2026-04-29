---
name: editing-phrases
description: Use when the user wants to refine one specific phrase inside one specific variant — three modes — revise (3 alternatives), shift emotion (same gene, new feeling), or rewrite via another gene type (e.g., make a descriptive phrase functional).
---

# editing-phrases

## Preconditions

- Variants exist.
- The user has named which variant and which phrase to edit (by index or by pointing at the text).

## What a phrase is

xaiku breaks each field's text into semantic phrases. Each phrase has:
- `text` — the phrase itself.
- `emotions[]` — 1-3 detected emotions (e.g., urgency, trust, anticipation).
- `geneType` — one of Emotional / Formatting / Descriptive / Positioning / Functional.

You reference a phrase by `{ attr: "<field_id>", phraseIndex: N }`.

## Modes

| Mode | Tool | Use when |
|---|---|---|
| Revise | `xaiku_generate_phrase_alternatives(orgId, variantId, attr, phraseIndex, query?)` | User wants 3 different phrasings of the same phrase. |
| Emotion | `xaiku_adjust_emotion(orgId, variantId, attr, phraseIndex, emotion)` | User wants this phrase to feel urgent / trusting / exclusive (etc.) instead. |
| Gene type | `xaiku_rewrite_gene_type(orgId, variantId, attr, phraseIndex, targetGeneTypes[])` | User wants to switch the phrase's rhetorical role — e.g., from descriptive to functional (CTA). |

All three take `variantId` (not experimentId) because phrase edits are variant-scoped.

## Persisting a picked phrase

These three tools only *propose* alternatives — they do not mutate the variant. To persist the user's chosen phrase, call:

- `xaiku_apply_phrase(orgId, variantId, attr, phraseIndex, phrase, emotions?)` — writes the chosen `phrase` and optional `emotions` array into `variant.parts[attr].phrases[phraseIndex]` and returns the updated variant.

## Flow

1. Confirm which variant, which field, which phrase, which mode.
2. Call the right proposal tool. Show the user the alternatives inline.
3. When the user picks one, call `xaiku_apply_phrase` with the chosen text and any updated emotions from the alternative.
4. Confirm the persistence back to the user: *"Updated. The variant now reads: …"*.

## Red flags

| Thought | Reality |
|---|---|
| "I'll rewrite the whole variant instead" | No — phrase-level editing preserves the analysis on unchanged phrases. |
| "I can generate alternatives myself" | No — xaiku's tool respects voice, gene type, and character limits. Your hand-written alternatives don't. |

## Next likely skill

Back to orchestrator routing — often `reading-the-forecast` or another `editing-phrases` call.
