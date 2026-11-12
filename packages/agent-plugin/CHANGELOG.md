# @xaiku/agent-plugin

## 0.1.0

### Minor Changes

- c869fbd: First release. A Claude Code plugin that connects Claude to the xaiku MCP server and adds 15 skills for the whole experiment flow: connecting and selecting an organization, creating and configuring an experiment, managing voices, setting writing rules, generating variants, editing phrases, reading the forecast, integrating the SDK or publishing by hand, going live, reading results and iterating.

### Patch Changes

- 248589b: `integrating-the-sdk` says what each SDK records: React and Next.js record the view automatically and use `useTrackConversion`; the browser SDK records the view inside `experiments:fetched` and uses `trackConversion`; Node records neither. It names the minimum SDK versions that count views correctly.
- b4e7f54: Skills match what the xaiku tools do today. A new `setting-writing-rules` skill covers casing, "we" or "I", the 7 style switches, banned words and exact spellings, all saved on the voice. `managing-voices` lists the 7 real style switches. `creating-an-experiment` lists every field, explains that `statics` means words every version must include, and asks one question at a time, like xaiku's own chat. Generating and editing route whole-version style fixes to field rewrites or fresh generation. Readiness codes and forecast estimates are explained. `integrating-the-sdk` gives the test-mode console line and asks where a conversion happens.
