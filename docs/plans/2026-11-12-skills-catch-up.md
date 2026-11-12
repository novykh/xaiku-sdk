# Skills catch-up Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every plugin skill tells the agent exactly what today's xaiku tools do. The toolkit (writing rules) is taught. The in-app chat's guidance reaches external agents through the skills.

**Architecture:** Markdown-only changes under `packages/agent-plugin/skills/`, plus one new skill, `setting-writing-rules`. No MCP or SDK code changes: those are Plans 2-5 of the roadmap. Wherever a skill describes behaviour, it describes what the code does today, with the code location in this plan so the implementer can check it.

**Tech Stack:** Markdown skills, Jest structural tests (`packages/agent-plugin/tests/structural/*`).

**Spec:** `/Users/novykh/Projects/xaiku/docs/plans/2026-11-12-agent-experience-roadmap.md` (Plan 1 row and problems 10, 11, 13), and the session transcript `~/Downloads/session-transcript-2026-11-12.md`.

## Global Constraints

- The skills address a marketer through an agent. Keep the existing "Talking to the user" rules in `using-xaiku` (`SKILL.md:107-125`).
- Every claim about tool behaviour must match the code in `/Users/novykh/Projects/xaiku`. Paths are given per task. Do not describe planned behaviour.
- Only tool names in `EXPECTED_TOOLS` (`tests/structural/mcp-tools.test.js:6-42`) may appear. No new tool names.
- Skill names referenced in backticks must exist (`tests/structural/crossrefs.test.js`).
- Frontmatter must keep `name` and `description` (`tests/structural/frontmatter.test.js`).
- Follow the style of the in-app chat stages (`/Users/novykh/Projects/xaiku/lib/chat/stages/*.md`, `base.md:5-19`): one short question at a time; never invent data; save only what the user said; structure first, then voice and tone.
- The plugin version is in three places: `.claude-plugin/marketplace.json`, `packages/agent-plugin/.claude-plugin/plugin.json`, `packages/agent-plugin/package.json`. Release goes through a changeset (`.changeset/*.md`, patch bump for `@xaiku/agent-plugin`), and plugin.json and marketplace.json are bumped by hand to match.
- Documentation changes need no failing test first (owner rule). The structural tests are the gate.

## Review Focus

1. An agent with no voice creates a web experiment. The skill must make it set casing and first or third person explicitly. Until Plan 4 ships, the defaults are title case and first person (`lib/toolkit/settings.js:3,62`).
2. An agent puts fixed page words into `statics`. `statics` means "must include in every version" (`lib/generation/instructions.js:148-149`), not "fixed text". Fixed text is an `editable: false` template part.
3. An agent edits `toolkit` with a partial object and wipes the other settings. `xaiku_update_voice` replaces `toolkit` as a whole (`$set` in `services/voices.js` update). The agent must read, merge and write.
4. An agent creates a voice with `textStyles` and expects it to change the writing. It does not today: generation reads only the merged toolkit (`lib/toolkit/settings.js:81-86`, `lib/generation/instructions.js:43`).
5. An agent fixes a casing or "I/we" problem phrase by phrase, then overwrites the work with whole-field edits (transcript calls #30-#51). The skill must route whole-version style problems to whole-field edits, or to writing rules plus fresh generation.

---

### Task 1: New skill `setting-writing-rules`

**Files:**
- Create: `packages/agent-plugin/skills/setting-writing-rules/SKILL.md`
- Modify: `packages/agent-plugin/skills/using-xaiku/SKILL.md` (skill map, routing)

**Interfaces:**
- Produces: the skill name `setting-writing-rules`, referenced by Tasks 2, 3, 4 and 6.

- [ ] **Step 1: Write the skill.** Frontmatter `name: setting-writing-rules`. Description: "Use when the user states how copy must be written (casing, we/I, words to avoid, exact brand or product spelling, price or date format), before generating variants, or when generated copy breaks such a rule." Sections:
  - **What writing rules are.** Writing rules live on a voice, in its `toolkit`. Every experiment using that voice is written with them. Generation merges xaiku defaults with the voice's `toolkit` (`lib/toolkit/settings.js:81-86`, `services/variants/generate.js:49-50`). Owner decision 5B (roadmap): the experiment's own `toolkit` is going away, so the skill never sets it.
  - **The settings that change the writing**, as a table with key, meaning and example. Source: `lib/generation/instructions.js:4-60` and `lib/toolkit/settings.js:1-75`.
    - `casing.preferred`: `sentence` | `title` | `upper` | `lower`. The default is `title`.
    - `casing.brandExceptions`: an object mapping a key to the exact spelling.
    - `casing.acronyms`: a string array.
    - `forbidden.terms`: by default the 8 cliches in `settings.js:38-49`. Arrays merge as a union (`settings.js:74`), so a user-supplied list adds to the defaults and never removes them. State that exactly.
    - `consistency.productName`, `consistency.priceFormat`, `consistency.dateTimeFormat`.
    - `textStyles`: the 7 keys `personalize`, `storytelling`, `active`, `person`, `factual`, `simple`, `concise`. Give each key's yes and no instruction, verbatim from `constants/textStyles.js` (`yes:`/`no:` lines). `person: true` means first person ("I"); `false` means third person, so a brand speaking as "we" needs `person: false`. Defaults: `settings.js:58-66`.
  - **Settings applied after generation:** `replace.rules` and `normalization` (`services/variants/generate.js:52-71`). Name them and say they apply to new versions only.
  - **Where to set them.**
    - On the experiment's voice: `xaiku_update_voice(orgId, id, { toolkit })`. Before changing it, tell the user it applies to every experiment using this voice. The count is `experimentCount` from `xaiku_list_voices`.
    - **No voice yet:** ask the user to name one (never invent a name). Then call `xaiku_create_voice(orgId, name)`, `xaiku_update_voice` with the `toolkit`, and `xaiku_update_experiment(orgId, id, { voiceId })`. `xaiku_create_voice` does not accept `toolkit` today.
    - **A rule for this experiment only:** offer a new voice the user names, starting from the current voice's settings.
    - **Read, merge, write:** `xaiku_update_voice` replaces the whole `toolkit`. Read it first with `xaiku_get_voice`, merge, then send the full object.
  - **Flow.**
    1. Ask at most one question: "Should it read like a person ('I') or like the company ('we'), and in sentence case or Title Case?" Skip anything the user already stated.
    2. Save only what the user said.
    3. Rules apply to versions generated afterwards. Existing versions keep their text. Offer whole-field edits, or archive and generate again.
  - **Red flags.**
    - Sending a partial `toolkit` wipes the rest.
    - Putting fixed words in `statics` is wrong (see Task 2).
    - Setting `textStyles` on the voice's top level does not change generation today. Use `toolkit.textStyles`.
    - Setting `toolkit` on the experiment. It is being removed (5B).

- [ ] **Step 2: Add `setting-writing-rules` to `using-xaiku`.** Add it to the skill map table (`SKILL.md:77-93`) with the purpose "Casing, we/I, banned words, brand spelling and formats for generation". In the routing graph (`:27-58`), add an edge from "No variants?" (yes) to `setting-writing-rules` before `generating-variants`, labelled "rules not set yet".

- [ ] **Step 3: Run the structural tests.**
  Run: `pnpm --filter @xaiku/agent-plugin test`
  Expected: all suites pass. `crossrefs` sees the new skill. `mcp-tools` sees only known tool names.

- [ ] **Step 4: Commit.**
  ```bash
  git add packages/agent-plugin/skills/setting-writing-rules/SKILL.md packages/agent-plugin/skills/using-xaiku/SKILL.md
  git commit -m "docs(plugin): setting-writing-rules teaches casing, we/I, banned words and formats through the voice toolkit"
  ```

### Task 2: `creating-an-experiment` covers every field and the app chat's intake rules

**Files:** Modify: `packages/agent-plugin/skills/creating-an-experiment/SKILL.md`

**Interfaces:** Consumes `setting-writing-rules` (Task 1).

- [ ] **Step 1: Preconditions.** Replace "Voice chosen (or explicit 'skip voice' decision)" (`:11`) with "orgId resolved". The voice is chosen after the template, as in the app chat (`lib/chat/stages/intake.md:9,17`).

- [ ] **Step 2: Add a "Fields" table** after "What to extract". Source: `services/experiments.js` (editable fields) and `lib/generation/instructions.js:63-67,132-149`. One line each:
  - `name`: required.
  - `template`: required.
  - `channel`: one of `web app email social ads sms push other` (`lib/experiment/channel.js:1`).
  - `description`: stored only; the writer does not read it.
  - `notes`: the brief the writer reads as "EXPERIMENT CONTEXT". Include the current copy, the facts that may be claimed, and what to avoid.
  - `intent`: the goal.
  - `tone`.
  - `audience`.
  - `brandVoice`: free text.
  - `keywords`: worked in where they fit.
  - `statics`: **words or phrases every version must include.** Not fixed text.
  - `variants`: count.
  - `voiceId`.
  - Writing rules (casing, we/I, banned words): not on the experiment. They live on the voice (`setting-writing-rules`).

- [ ] **Step 3: Rewrite "Flow" in the app chat's style.**
  1. If the user gave a page, URL, screenshot or pasted copy, read it with your own tools. Build parts only from elements visible in it, in page order. Never add a part that is not there (`lib/chat/stages/proposingTemplate.md:8,15-19`). Put the current copy in `notes`; it becomes the control later.
  2. Ask one short question at a time, and only for what is missing. Ask for the channel first if unknown. Do not ask about tone or voice before the structure is agreed (`intake.md:8-9`).
  3. After creating, settle the voice and the writing rules that matter for the channel through `setting-writing-rules`, before any generation.
  4. Propose the name, parts (with fixed parts marked fixed) and limits in one message. Create on approval.
  5. If the user rejects the template, re-propose with their correction applied. Do not just apologise, and do not ask which parts to keep (`handlingCorrections.md:8-9,16`).
  6. Hand off to `setting-writing-rules` (which picks or creates the voice), then `generating-variants`.

- [ ] **Step 4: Plan limit.** Add a red-flag row: a "plan includes N experiments" refusal means the limit counts only experiments that have a template and are not archived (`xaiku/helpers/planLimits.js:17`). Offer to archive one the user names, through `xaiku_update_experiment` with `{ archived: true }`. Do not archive without asking.

- [ ] **Step 5: Run the structural tests.** Run: `pnpm --filter @xaiku/agent-plugin test`. Expected: all pass.

- [ ] **Step 6: Commit.**
  ```bash
  git add packages/agent-plugin/skills/creating-an-experiment/SKILL.md
  git commit -m "docs(plugin): creating-an-experiment lists every field, statics means must-include, intake follows the app chat"
  ```

### Task 3: `managing-voices` matches the code

**Files:** Modify: `packages/agent-plugin/skills/managing-voices/SKILL.md`

- [ ] **Step 1: Fix the facts.**
  - Description (`:3`) and "What a voice is" (`:14`): 7 toggles, not 8. Drop `headline`. List the 7 keys from `constants/textStyles.js`, each with a plain-word meaning. Say plainly that `person: true` is "I" and `false` is "we".
  - Add: "Today generation reads a voice's writing rules from its `toolkit` (see `setting-writing-rules`). The top-level `textStyles`, `acceptedExcerpts` and `avoidedExcerpts` are stored but not used when writing (`lib/toolkit/settings.js:81-86`, `lib/generation/instructions.js:43`). To make a voice change the writing, set `toolkit.textStyles` and the other rules with `xaiku_update_voice`." Mark it with the HTML comment `<!-- Plan 4 decision 4 changes this -->` so it is updated when the code changes.
- [ ] **Step 2: Flows.** "Creating a voice" ends with an `xaiku_update_voice` call that sets `toolkit` (read, merge, write). "Picking a voice" sets `voiceId` with `xaiku_update_experiment`.
- [ ] **Step 3: Red flags.** Replace "all 8 toggles" with "7 toggles", and keep the rule "only set what the user expresses".
- [ ] **Step 4: Run the structural tests.** Run: `pnpm --filter @xaiku/agent-plugin test`. Expected: pass.
- [ ] **Step 5: Commit.**
  ```bash
  git add packages/agent-plugin/skills/managing-voices/SKILL.md
  git commit -m "docs(plugin): managing-voices lists the 7 real style toggles and says writing rules live in the voice toolkit"
  ```

### Task 4: `generating-variants` and `editing-phrases` handle whole-version style fixes

**Files:** Modify: `packages/agent-plugin/skills/generating-variants/SKILL.md`, `packages/agent-plugin/skills/editing-phrases/SKILL.md`

- [ ] **Step 1: `generating-variants`.**
  - Preconditions (`:10-11`): replace "Voice set (or explicitly skipped)" with "writing rules checked (`setting-writing-rules`)".
  - Flow step 5 (`:29`): when every version breaks the same rule (casing, "I" vs "we", a word to avoid), offer two fixes:
    - (a) set the rule, archive the affected versions with `xaiku_archive_variant`, and generate again;
    - (b) rewrite each whole field with `xaiku_set_field_text`, then `xaiku_analyze_variant`.
  - Do not fix it phrase by phrase.
  - Note that `xaiku_generate_variants` adds versions and never replaces them. There is no regenerate tool today.
- [ ] **Step 2: `editing-phrases`.**
  - Add a red-flag row: "Applying phrases, then rewriting the same field with `xaiku_set_field_text`" throws away the phrase work. Choose one route per field.
  - Phrase tools change one phrase. The rest of the field keeps its casing. For a casing fix use `xaiku_set_field_text`.
- [ ] **Step 3: Run the structural tests.** Run: `pnpm --filter @xaiku/agent-plugin test`. Expected: pass.
- [ ] **Step 4: Commit.**
  ```bash
  git add packages/agent-plugin/skills/generating-variants/SKILL.md packages/agent-plugin/skills/editing-phrases/SKILL.md
  git commit -m "docs(plugin): whole-version style problems are fixed per field or by rules and fresh generation, not phrase by phrase"
  ```

### Task 5: `configuring-the-experiment`, `reading-the-forecast`, `using-xaiku` explain what tools return

**Files:** Modify the three `SKILL.md` files.

- [ ] **Step 1: `configuring-the-experiment`.**
  - Add a table of every readiness code and its meaning, from `xaiku/lib/experiments/readiness.js:3,28-44`:
    - Blockers: `no_primary_metric`, `no_control`, `no_approved_variants`.
    - Warnings: `no_traffic_estimate`, `no_baseline`, `too_many_variants` (over 4 versions under 10,000 weekly visitors), `underpowered` (over 90 days), `variants_similar` (near-duplicate text by the uniqueness check, `lib/toolkit/rules/uniqueness.js`).
  - Add: if an analytics tool (PostHog, Google Analytics) is connected, offer to read weekly traffic and the current rate from it. Say how it was measured. Never guess a baseline.
- [ ] **Step 2: `reading-the-forecast`.**
  - Add: scores and `vsControl.delta` are model estimates, not measurements (`xaiku/lib/generation/schemas.js:153-154`). Say "xaiku estimates" for every percentage.
  - Add: `vsControl` exists only when a control exists.
- [ ] **Step 3: `using-xaiku`.**
  - Routing: move the "No voice?" check after "No experiment yet?". The voice is picked before generation, not before the experiment.
  - Plan-limit row (`:101`): say archived experiments do not count. Offer to archive one the user names.
  - Add a short "How to ask" section copying the rules from `xaiku/lib/chat/stages/base.md:5-19`: one short question at a time; never invent data; save only what the user said; act in the same turn you announce.
- [ ] **Step 4: Run the structural tests.** Run: `pnpm --filter @xaiku/agent-plugin test`. Expected: pass.
- [ ] **Step 5: Commit.**
  ```bash
  git add packages/agent-plugin/skills/configuring-the-experiment/SKILL.md packages/agent-plugin/skills/reading-the-forecast/SKILL.md packages/agent-plugin/skills/using-xaiku/SKILL.md
  git commit -m "docs(plugin): readiness codes, forecast estimates and the app chat's asking rules are in the skills"
  ```

### Task 6: `integrating-the-sdk` fixes that need no SDK change

**Files:** Modify: `packages/agent-plugin/skills/integrating-the-sdk/SKILL.md`

- [ ] **Step 1: Test mode.** Replace `:35` with the console one-liner `localStorage.setItem('xaiku_test', 'true')`, then reload. It is the key `setTestMode` uses (`packages/shared/src/setTestMode.js:1,22`). Say that test mode also serves draft experiments (`xaiku/app/api/v1/experiments/route.js:27`).
- [ ] **Step 2: Remove the internal path.** In the red flag at `:46`, replace "a bug in `lib/integration/snippets.js` — file it" with "tell the user it looks wrong and stop".
- [ ] **Step 3: Conversions.** Add a step after showing the snippet. Ask where a win happens: a click on this page, or a later page such as a sign-up confirmation. Point to `useTrackConversion` from `@xaiku/react` (`packages/react/src/useTrack.js:41`), called inside the same `XaikuProvider` and `Experiment`. If the win happens on another device or another site, say xaiku cannot attribute it yet. Do not build it by hand. Plan 3 adds it.
- [ ] **Step 4: Repo-access persona.** Add one line: when you work directly in the user's repo, use the snippet's components as given. Do not read the SDK's built files to work out internals; if something is missing, tell the user.
- [ ] **Step 5: Run the structural tests.** Run: `pnpm --filter @xaiku/agent-plugin test`. Expected: pass.
- [ ] **Step 6: Commit.**
  ```bash
  git add packages/agent-plugin/skills/integrating-the-sdk/SKILL.md
  git commit -m "docs(plugin): integrating-the-sdk gives the test-mode one-liner, asks where a conversion happens and stops at what the SDK supports"
  ```

### Task 7: Release

**Files:** Create: `.changeset/skills-catch-up.md`. Modify: `.claude-plugin/marketplace.json`, `packages/agent-plugin/.claude-plugin/plugin.json`.

- [ ] **Step 1:** Write the changeset: `"@xaiku/agent-plugin": patch`, with a one-paragraph description of the skill changes.
- [ ] **Step 2:** Bump `plugin.json` and `marketplace.json` to the version `changeset version` will produce. Check it with `pnpm changes status --verbose`.
- [ ] **Step 3: Run the structural tests.** Run: `pnpm --filter @xaiku/agent-plugin test`. Expected: pass, including `manifest.test.js` (the plugin.json and marketplace.json versions match).
- [ ] **Step 4: Commit.**
  ```bash
  git add .changeset/skills-catch-up.md .claude-plugin/marketplace.json packages/agent-plugin/.claude-plugin/plugin.json
  git commit -m "chore: changeset for the skills catch-up"
  ```
- [ ] **Step 5:** Hand the push to the owner. Pushing `main` opens the release pull request.
