import { spawn } from 'node:child_process'

export const runCli = ({ argv = process.argv.slice(2), env = process.env } = {}) => {
  const url = env.XAIKU_MCP_URL || 'https://mcp.xaiku.com'
  const child = spawn('npx', ['-y', 'mcp-remote', url], { stdio: 'inherit' })
  child.on?.('exit', code => process.exit(code ?? 0))
  return child
}
