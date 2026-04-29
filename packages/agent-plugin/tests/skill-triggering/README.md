# Skill-triggering smoke tests

These tests prove the xaiku orchestrator routes user prompts to the correct skill. They shell into the real `claude` CLI and assert the expected skill name appears in the transcript.

## Run

```bash
pnpm test:behavioral            # all prompts
bash runner.sh maya-ads-headline   # one prompt
```

## Requirements

- `claude` CLI installed and authenticated.
- xaiku plugin installed (`pnpm` symlink from repo root, or via marketplace in staging).
- `XAIKU_TEST_ORG` env pointing at a sandbox org on `mcp.xaiku.com` (or a mock).

## Adding a prompt

1. Pick a representative user message that should route to exactly one skill.
2. First line: `# expect: <skill-name>`.
3. Rest: the user message.
4. Commit.
