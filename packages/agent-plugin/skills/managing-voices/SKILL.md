---
name: managing-voices
description: Use when the user wants to create, edit, pick, or archive a brand voice; or when an experiment needs a voice before generating variants. A voice is a reusable set of writing rules (casing, "we" or "I", 7 style switches, banned words, exact spellings) shared by every experiment that uses it.
---

# managing-voices

## Preconditions

- orgId resolved.

## What a voice is

A voice is the place where writing rules live. Every experiment that uses the voice is written with them. Voices belong to the workspace and are reused across experiments.

What changes the writing is the voice's `toolkit`: casing, the 7 style switches (`personalize`, `storytelling`, `active`, `person`, `factual`, `simple`, `concise`), banned words, exact spellings and formats. `setting-writing-rules` explains every key.

<!-- Plan 4 (decisions 4B and 5B) moves everything into the toolkit; update this note when it ships. -->
A voice also stores `textStyles`, `acceptedExcerpts` and `avoidedExcerpts` at its top level. Today these are saved but **not used when writing**. Do not rely on them; put the style switches in `toolkit.textStyles`.

## Tools

- `xaiku_list_voices(orgId)` — non-archived voices, with their names.
- `xaiku_get_voice(orgId, id)` — the voice, including its `toolkit`.
- `xaiku_create_voice(orgId, name)` — creates a voice. Set its rules next with an update.
- `xaiku_update_voice(orgId, id, patch)` — `patch.toolkit` **replaces the whole toolkit**: read it first, merge, send it all. `patch.name` renames.
- `xaiku_archive_voice(orgId, id)`
- `xaiku_update_experiment(orgId, id, patch)` — `patch.voiceId` points an experiment at a voice.

## Flows

**Picking a voice for an experiment**: call `xaiku_list_voices`. If there is one, offer it. If there are several, ask which by name. If there are none, ask whether to create one now. Set it with `xaiku_update_experiment` and `patch.voiceId`. Without a voice, xaiku writes with its defaults: Title Case and first person ("I").

**Creating a voice**:
1. Ask the user for a name. Never invent one.
2. Ask how it should read, in plain trade-offs, not switch names: "the company ('we') or a person ('I')?", "sentence case or Title Case?", "short and plain, or detailed?". One question at a time. Skip anything they already said.
3. Call `xaiku_create_voice` with the name.
4. Call `xaiku_update_voice` with `patch.toolkit` holding only what the user expressed (see `setting-writing-rules`).

**Editing**: read the voice with `xaiku_get_voice`. Show its current rules in plain words. Say the change applies to every experiment using this voice. Merge the user's change into the `toolkit` and send it all with `xaiku_update_voice`.

## Red flags

| Thought | Reality |
|---|---|
| "Let me suggest 'professional but friendly' as a voice" | No — that's marketing fluff. Ask the user how it should read and for real examples of copy they like. |
| "I'll fill in all 7 switches with defaults" | No — unset switches keep xaiku's defaults. Only set what the user expresses. |
| "I'll set `textStyles` when creating the voice" | It is stored but not used for writing today. Set `toolkit.textStyles` with `xaiku_update_voice`. |
| "I'll send only the changed setting" | `patch.toolkit` replaces the whole toolkit. Read, merge, then send it all. |
| "There's a 'headline' switch" | No. There are 7 switches; `headline` is not one of them. |

## Next likely skill

`setting-writing-rules` for the rules themselves, then `generating-variants`.
