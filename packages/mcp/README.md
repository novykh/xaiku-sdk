# @xaiku/mcp

Model Context Protocol stdio bridge for [Xaiku](https://xaiku.com). Proxies stdio ⇄ `https://mcp.xaiku.com` via `mcp-remote`.

## Install

```bash
npx -y @xaiku/mcp
```

## Configure in Claude Desktop

```json
{
  "mcpServers": {
    "xaiku": {
      "command": "npx",
      "args": ["-y", "@xaiku/mcp"]
    }
  }
}
```

First call opens your browser for OAuth; the token is cached locally by `mcp-remote`.
