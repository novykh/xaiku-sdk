---
name: managing-voices
description: Use when the user wants to create, edit, pick, or archive a brand voice; or when an experiment needs a voice set before generating variants. A voice is a reusable writing-style profile (8 toggles + accepted/avoided excerpts).
---

# managing-voices

## Preconditions

- orgId resolved.

## What a voice is

A voice bundles 8 binary style toggles (headline, personalize, storytelling, active, person, factual, simple, concise) and two excerpt lists (accepted = examples to emulate, avoided = examples to shun). Voices are org-scoped and reused across experiments.

## Tools

- `xaiku_list_voices(orgId)` — list non-archived voices.
- `xaiku_get_voice(orgId, id)`
- `xaiku_create_voice(orgId, name, textStyles?, acceptedExcerpts?, avoidedExcerpts?)`
- `xaiku_update_voice(orgId, id, patch)`
- `xaiku_archive_voice(orgId, id)`

## Flows

**Creating a voice**: ask the user for name, pitch (headline vs subtle, active vs passive, simple vs sophisticated — present as paired trade-offs, not checkboxes with technical names), and 1-2 example snippets of copy they love. Build `textStyles` from their answers.

**Picking a voice for an experiment**: call `xaiku_list_voices`. If one, use it. If multiple, ask. If zero, ask whether to create one now or proceed voice-less (the default generic voice applies).

**Editing**: pull with `xaiku_get_voice`, show the current settings, change what the user asks, call `xaiku_update_voice` with a patch.

## Red flags

| Thought | Reality |
|---|---|
| "Let me suggest 'professional but friendly' as a voice" | No — that's marketing fluff. Ask the user for real examples of copy they want to emulate. |
| "I'll fill in all 8 toggles with defaults" | No — unset toggles use sensible defaults. Only set what the user expresses. |

## Next likely skill

`creating-an-experiment` (if no experiment yet), otherwise orchestrator routing.
