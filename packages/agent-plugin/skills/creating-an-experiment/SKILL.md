---
name: creating-an-experiment
description: Use when the user describes something to test (headline, ad, email subject, CTA, landing page section). Extracts the template structure from the conversation and creates the experiment.
---

# creating-an-experiment

## Preconditions

- orgId resolved.

The voice and writing rules come after the structure is agreed, as in xaiku's own chat.

## What to extract

Before calling `xaiku_create_experiment`, you must extract a **template**. A template is
`{ name, parts: [...] }`, where each part describes one piece of the copy:

| Key | Required | Meaning |
|---|---|---|
| `id` | yes | stable identifier, snake_case |
| `role` | yes | what the part does: `badge`, `mainText`, `emphasisText`, `subText`, `icon`, `divider`, `image`, `cta`, `meta` |
| `kind` | yes | how it renders: `text`, `icon`, `divider`, `image`, `cta` |
| `editable` | yes | `true` if variants may rewrite it; `false` pins it as fixed context |
| `maxLength` | no | character limit — positive integer |

Only `editable: true` parts get rewritten during generation. Mark the surrounding
fixed copy `editable: false` so the model can see it without changing it.

**Examples:**

- Google Ads headline → `{ id: 'headline', role: 'mainText', kind: 'text', editable: true, maxLength: 30 }`
- Facebook ad → `{ id: 'headline', role: 'mainText', kind: 'text', editable: true, maxLength: 27 }` and `{ id: 'post_text', role: 'subText', kind: 'text', editable: true, maxLength: 150 }`
- Landing hero → `{ id: 'headline', role: 'mainText', kind: 'text', editable: true, maxLength: 60 }`, `{ id: 'subhead', role: 'subText', kind: 'text', editable: true, maxLength: 120 }`, `{ id: 'cta', role: 'cta', kind: 'cta', editable: true, maxLength: 20 }`
- Email subject → `{ id: 'subject', role: 'mainText', kind: 'text', editable: true, maxLength: 60 }`

## Fields

`xaiku_create_experiment` takes these. Fill only what the user said or what you read from their page; never invent a value.

| Field | What xaiku does with it |
|---|---|
| `name` | Required. The name shown in the dashboard. |
| `template` | Required. The parts above. |
| `channel` | One of `web`, `app`, `email`, `social`, `ads`, `sms`, `push`, `other`. |
| `notes` | The brief the writer reads as context. Put the current copy here (it becomes the control later), the facts that may be claimed, and what must not be said. |
| `intent` | The goal, for example "more sign-ups from first-time visitors". |
| `tone` | How it should sound, in the user's words. |
| `audience` | Who reads it. |
| `brandVoice` | Free-text description of the brand's voice. |
| `keywords` | Words the writer works in where they fit. |
| `statics` | Words or phrases **every version must include**. This is not for fixed text; fixed text is a template part with `editable: false`. |
| `variants` | How many versions the experiment holds. |
| `description` | Stored for the dashboard only. The writer does not read it, so put anything the writer needs in `notes`. |

Writing rules (casing, "we" or "I", banned words, exact spellings) are not experiment fields. They live on the voice: see `setting-writing-rules`.

## Optional but recommended: classify the channel

Map the user's brief onto one of `web | app | email | social | ads | sms | push | other`.
This drives how the user later integrates the variants — `web` and `app` lead with the
SDK, everything else leads with manual publish. If you can't tell, omit it: the system
defaults to manual-primary with the SDK still one click away.

## Tools

- `xaiku_create_experiment(orgId, name, template, channel?, notes?, intent?, tone?, audience?, keywords?, statics?, variants?)` — returns the new experiment. See Fields.
- `xaiku_update_experiment(orgId, id, patch)` — changes any field later, or archives an experiment with `patch.archived: true`.

## Flow

1. If the user gave a page, URL, screenshot or pasted copy, read it with your own tools first. Build parts only from what is visible there, in page order. Never add a part that is not on the page (no invented button or badge). Put the current copy in `notes`.
2. Ask **one short question at a time**, and only for what is still missing. Ask where it runs (the channel) first if you cannot tell. Do not ask about tone or voice until the structure is agreed.
3. Infer parts and limits. Platform hints are strong (Google Ads headline = 30 characters).
4. Propose the name and template in one message, with fixed parts marked as fixed: *"I'll create 'Summer sale Google Ads' with one part that gets rewritten, the headline (30 characters max). OK?"*
5. On approval, call `xaiku_create_experiment`.
6. If the user rejects the proposal, propose again with their correction applied. Don't only apologise, and don't ask which parts to keep.
7. Hand off to `setting-writing-rules` (picks or creates the voice, settles casing and "we" or "I"), then `generating-variants`.

## Red flags

| Thought | Reality |
|---|---|
| "I'll create the experiment without asking" | No — confirm the template first. Wrong part structure means useless variants. |
| "Character limits are optional" | For ads/social they're often required. Ask if unsure, err on the side of setting one. |
| "Parts should be detailed (e.g., 'opening_hook', 'value_prop', 'cta_urgency')" | No — stay platform-accurate. If Google Ads says "Headline," the part is `headline`. |
| "I'll send a `fields` array like the old docs showed" | Rejected by the server. The template shape is `parts`, and every part needs `role`, `kind` and `editable`. |
| "Everything should be `editable: true`" | Only if variants really should rewrite it. Fixed surrounding copy belongs in the template as `editable: false`. |
| "The fixed button labels go in `statics`" | No. `statics` forces those words into every version. Fixed labels are `editable: false` parts. |
| "The plan limit stops me, so I'll archive an old experiment" | Only with the user's go-ahead. The limit counts experiments that have a template and are not archived, so archiving one the user names frees the slot (`xaiku_update_experiment` with `patch.archived: true`). |
| "I'll ask everything up front" | No. One short question at a time, only for what is missing. |

## Next likely skill

`setting-writing-rules`, then `generating-variants`.
