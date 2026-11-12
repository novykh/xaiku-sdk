---
name: setting-writing-rules
description: Use when the user says how copy must be written (casing, "we" or "I", words to avoid, exact brand or product spelling, price or date format), before generating variants, or when generated copy breaks such a rule. Writing rules live on a voice and apply to every experiment that uses it.
---

# setting-writing-rules

## Preconditions

- orgId resolved.
- An experiment exists (the rules are set on its voice).

## What writing rules are

Writing rules live on a **voice**, in its `toolkit`. Every experiment that uses that voice is written with them. When xaiku writes variants, it starts from its own defaults and applies the voice's `toolkit` on top.

Rules only shape versions written afterwards. Existing versions keep their text.

## The rules that change the writing

| Key in `toolkit` | What it does | Example |
|---|---|---|
| `casing.preferred` | `sentence`, `title`, `upper` or `lower`. **Default: `title`** (Every Word Capitalised). | `{ casing: { preferred: 'sentence' } }` |
| `casing.brandExceptions` | Names always spelled exactly as given. An object; the values are what counts. | `{ casing: { brandExceptions: { github: 'GitHub' } } }` |
| `casing.acronyms` | Words always kept in capitals. | `{ casing: { acronyms: ['SSO', 'API'] } }` |
| `forbidden.terms` | Words and phrases never used. xaiku already bans 8 clichés (unleash, unlock, dive into, revolutionize, elevate, empower, supercharge, game-changing). A list you add is combined with those and never replaces them. | `{ forbidden: { terms: ['free trial'] } }` |
| `consistency.productName` | The product is always named exactly like this. | `'Netdata Cloud'` |
| `consistency.priceFormat` | Prices are always written like this. | `'$9/mo'` |
| `consistency.dateTimeFormat` | Dates are always written like this. | `'12 Nov 2026'` |
| `replace.rules` | `[{ find, replace }]` pairs, applied to the text of every newly written version. | `[{ find: 'login', replace: 'sign in' }]` |
| `textStyles` | The 7 style switches below. | `{ textStyles: { person: false } }` |

### The 7 style switches (`toolkit.textStyles`)

| Key | `true` tells the writer | `false` tells the writer | Default |
|---|---|---|---|
| `personalize` | Create personalized content to connect with readers directly. | Use a general tone to address a broader audience. | `true` |
| `storytelling` | Present content as a narrative with characters, setting, and plot. | Present content as a straightforward announcement or argument. | `false` |
| `active` | Write in active voice for clearer, more engaging text. | Write in passive voice for a more formal tone or to emphasize the action over the subject. | `true` |
| `person` | Use first person to create an intimate, personal connection. ("I") | Use third person for a more formal and objective approach. (a company speaking as "we") | `true` |
| `factual` | Base content solely on facts and data. | Include opinions and interpretations to personalize and add perspective. | `true` |
| `simple` | Use simple sentences for clarity and ease of reading. | Use complex sentences to convey detailed and nuanced information. | `true` |
| `concise` | Use concise language that sticks to the essentials. | Use detailed descriptions to provide depth and enrich the narrative. | `true` |

**The defaults write in Title Case and in first person ("I").** A brand page almost always needs `casing.preferred: 'sentence'` and `textStyles.person: false`. Settle both before the first generation.

## Tools

- `xaiku_get_experiment(orgId, id)`: its `voiceId` says which voice the experiment uses.
- `xaiku_list_voices(orgId)`: the workspace's voices, with their names.
- `xaiku_get_voice(orgId, id)`: returns the voice, including its `toolkit`.
- `xaiku_create_voice(orgId, name)`: creates a voice. It does not take a `toolkit`; set that next with an update.
- `xaiku_update_voice(orgId, id, patch)`: with `patch.toolkit`, **replaces the whole `toolkit`.**
- `xaiku_update_experiment(orgId, id, patch)`: with `patch.voiceId`, points the experiment at a voice.

## Flow

1. Find the experiment's voice with `xaiku_get_experiment`.
2. Ask at most one question, and only for what the user has not already said: *"Should it read like the company ('we') or like a person ('I'), and in sentence case or Title Case?"* Add words to avoid or exact spellings only when the user mentions them.
3. **No voice yet:** ask the user what to call the voice (never invent a name). Create it with `xaiku_create_voice`, then attach it with `xaiku_update_experiment` and `voiceId`.
4. **Before changing an existing voice**, say other experiments may use it: *"This changes the writing for every experiment that uses 'Brand voice'. OK, or should I make a separate voice for this one?"* A separate voice is a new voice the user names, starting from the current voice's `toolkit`. Do not quote a count: no tool reports one reliably yet.
5. Read, merge, write: read the current `toolkit` with `xaiku_get_voice`, merge only the user's changes into it, and send the whole object with `xaiku_update_voice`.
6. Confirm in plain words: *"Saved to 'Brand voice': sentence case, speaks as 'we', never says 'free trial'."*
7. Continue with `generating-variants`. If versions already exist, say they keep their old wording. Offer to rewrite fields (`editing-phrases`) or to archive them and write new ones (`generating-variants`).

## Red flags

| Thought | Reality |
|---|---|
| "I'll send just the setting that changed" | No. `xaiku_update_voice` replaces the whole `toolkit`. Read, merge, then send it all. |
| "I'll put the fixed button words in `statics`" | No. `statics` means words every version **must include**. Fixed text is a template part with `editable: false`. |
| "I'll set `textStyles` at the top level of the voice" | It is stored but not used for writing. Use `toolkit.textStyles`. |
| "I'll set a `toolkit` on the experiment" | No. Writing rules live on the voice. The experiment's own toolkit is being removed. |
| "I'll name the voice 'Default'" | No. Ask the user for the name. |
| "The defaults are fine" | They write in Title Case and as "I". Check with the user before the first generation. |

## Next likely skill

`generating-variants`.
