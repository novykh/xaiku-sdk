---
name: creating-an-experiment
description: Use when the user describes something to test (headline, ad, email subject, CTA, landing page section). Extracts the template structure from the conversation and creates the experiment.
---

# creating-an-experiment

## Preconditions

- orgId resolved.
- Voice chosen (or explicit "skip voice" decision).

## What to extract

Before calling `xaiku_create_experiment`, you must extract a **template**:

- **Fields**: what distinct pieces of copy does the experiment contain? Each field has an `id` (camelCase), a `name` (human label), and an optional `maxLength` (character limit).
- **Examples**:
  - Google Ads headline → one field: `{ id: "headline", name: "Headline", maxLength: 30 }`.
  - Facebook ad → `{ id: "headline", maxLength: 27 }`, `{ id: "post_text", maxLength: 150 }`.
  - Landing hero → `{ id: "headline", maxLength: 60 }`, `{ id: "subhead", maxLength: 120 }`, `{ id: "cta", maxLength: 20 }`.
  - Email subject → `{ id: "subject", maxLength: 60 }`.

## Tools

- `xaiku_create_experiment(orgId, { name, template, description? })` — returns the new experiment.

## Flow

1. Ask 2-3 short questions if the user's description is vague (what platform / where will this run / is there a character limit).
2. Infer fields + limits from the answer. Platform hints are strong (Google Ads headline = 30 chars).
3. Propose the experiment name + template back to the user in one line: *"I'll create an experiment called 'Summer sale Google Ads' with a single field 'Headline' (30 char max). OK?"*
4. On approval, call `xaiku_create_experiment`.
5. Hand off to `generating-variants`.

## Red flags

| Thought | Reality |
|---|---|
| "I'll create the experiment without asking" | No — confirm the template first. Wrong field structure means useless variants. |
| "Character limits are optional" | For ads/social they're often required. Ask if unsure, err on the side of setting one. |
| "Fields should be detailed (e.g., 'opening_hook', 'value_prop', 'cta_urgency')" | No — stay platform-accurate. If Google Ads says "Headline," the field is `headline`. |

## Next likely skill

`generating-variants`
