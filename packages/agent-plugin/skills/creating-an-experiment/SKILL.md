---
name: creating-an-experiment
description: Use when the user describes something to test (headline, ad, email subject, CTA, landing page section). Extracts the template structure from the conversation and creates the experiment.
---

# creating-an-experiment

## Preconditions

- orgId resolved.
- Voice chosen (or explicit "skip voice" decision).

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

## Optional but recommended: classify the channel

Map the user's brief onto one of `web | app | email | social | ads | sms | push | other`.
This drives how the user later integrates the variants — `web` and `app` lead with the
SDK, everything else leads with manual publish. If you can't tell, omit it: the system
defaults to manual-primary with the SDK still one click away.

## Tools

- `xaiku_create_experiment(orgId, name, template, channel?, description?)` — returns the new experiment.

## Flow

1. Ask 2-3 short questions if the user's description is vague (what platform / where will this run / is there a character limit).
2. Infer parts + limits from the answer. Platform hints are strong (Google Ads headline = 30 chars).
3. Propose the experiment name + template back to the user in one line: *"I'll create an experiment called 'Summer sale Google Ads' with a single editable part 'headline' (30 char max), channel `ads`. OK?"*
4. On approval, call `xaiku_create_experiment`.
5. Hand off to `generating-variants`.

## Red flags

| Thought | Reality |
|---|---|
| "I'll create the experiment without asking" | No — confirm the template first. Wrong part structure means useless variants. |
| "Character limits are optional" | For ads/social they're often required. Ask if unsure, err on the side of setting one. |
| "Parts should be detailed (e.g., 'opening_hook', 'value_prop', 'cta_urgency')" | No — stay platform-accurate. If Google Ads says "Headline," the part is `headline`. |
| "I'll send a `fields` array like the old docs showed" | Rejected by the server. The template shape is `parts`, and every part needs `role`, `kind` and `editable`. |
| "Everything should be `editable: true`" | Only if variants really should rewrite it. Fixed surrounding copy belongs in the template as `editable: false`. |

## Next likely skill

`generating-variants`
