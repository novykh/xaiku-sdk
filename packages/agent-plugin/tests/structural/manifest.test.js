const fs = require('node:fs')
const path = require('node:path')

const PKG_ROOT = path.join(__dirname, '..', '..')
const REPO_ROOT = path.join(PKG_ROOT, '..', '..')

describe('plugin manifests', () => {
  test('plugin.json is valid JSON with required fields', () => {
    const raw = fs.readFileSync(path.join(PKG_ROOT, '.claude-plugin', 'plugin.json'), 'utf8')
    const parsed = JSON.parse(raw)
    expect(parsed.name).toBe('xaiku')
    expect(parsed.version).toMatch(/^\d+\.\d+\.\d+$/)
    expect(parsed.description).toBeTruthy()
  })

  test('root marketplace.json points at this package', () => {
    const raw = fs.readFileSync(
      path.join(REPO_ROOT, '.claude-plugin', 'marketplace.json'),
      'utf8'
    )
    const parsed = JSON.parse(raw)
    const entry = parsed.plugins.find(p => p.name === 'xaiku')
    expect(entry).toBeTruthy()
    expect(entry.source).toBe('./packages/agent-plugin')
  })

  test('plugin ships the xaiku MCP server in .mcp.json at the plugin root', () => {
    const raw = fs.readFileSync(path.join(PKG_ROOT, '.mcp.json'), 'utf8')
    const parsed = JSON.parse(raw)
    expect(parsed.mcpServers.xaiku).toEqual({ type: 'http', url: 'https://mcp.xaiku.com' })
  })

  test('plugin and marketplace versions match', () => {
    const plugin = JSON.parse(
      fs.readFileSync(path.join(PKG_ROOT, '.claude-plugin', 'plugin.json'), 'utf8')
    )
    const market = JSON.parse(
      fs.readFileSync(path.join(REPO_ROOT, '.claude-plugin', 'marketplace.json'), 'utf8')
    )
    const entry = market.plugins.find(p => p.name === 'xaiku')
    expect(entry.version).toBe(plugin.version)
  })
})
