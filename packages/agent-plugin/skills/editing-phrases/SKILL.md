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

- `xaiku_apply_phrase(orgId, variantId, attr, phraseIndex, phrase, emotions?)` — replaces the phrase inside the part's text and saves the phrase with its emotions. Pass the `emotions` exactly as the chosen alternative returned them.

## Flow

1. Confirm which version, which part, and what should change. Ask in plain words ("the second sentence of the subhead"), never by index.
2. Call the right proposal tool.
3. **Show each alternative in context, not as a fragment.** Every alternative comes back with `text`: the full part with the new phrase already swapped in. For each one, show:
   - the full part as it would read, with the changed words in **bold**;
   - how it feels, in 1–2 plain words, and what that changes compared with now ("calmer, less salesy");
   - one line on what it does for the version as a whole ("now the subhead answers 'do I need an account?'").

   Start with the current wording as the baseline, then list the options:

   > **Subhead now:** Use your email, Google, GitHub or SSO. I will set up your account if you're new. — *feels: personal, odd*
   > **a.** Use your email, Google, GitHub or SSO. **First time? We'll create your account.** — *feels: welcoming, clear.* Speaks to new visitors directly.
   > **b.** …

   Recommend one and say why in one line.
4. When the user picks, call `xaiku_apply_phrase` with the chosen phrase and its emotions.
5. Re-read the version with `xaiku_list_variants` and show the **whole version** as it now reads (all parts), so the user sees the edit in place. If the saved text doesn't contain the new phrase, say so plainly and stop editing.

## Red flags

| Thought | Reality |
|---|---|
| "I'll rewrite the whole variant instead" | No — phrase-level editing preserves the analysis on unchanged phrases. |
| "I can generate alternatives myself" | No — xaiku's tool respects voice, gene type, and character limits. Your hand-written alternatives don't. |

## Next likely skill

Back to orchestrator routing — often `reading-the-forecast` or another `editing-phrases` call.
