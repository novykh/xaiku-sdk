import { spawn } from 'node:child_process'
import { runCli } from './cli'

jest.mock('node:child_process', () => ({ spawn: jest.fn() }))

describe('xaiku-mcp cli', () => {
  beforeEach(() => spawn.mockReset())

  it('spawns mcp-remote with default xaiku.com url', () => {
    const fakeChild = { on: jest.fn() }
    spawn.mockReturnValue(fakeChild)

    runCli({ argv: [], env: {} })

    expect(spawn).toHaveBeenCalledWith(
      'npx',
      ['-y', 'mcp-remote', 'https://mcp.xaiku.com'],
      { stdio: 'inherit' }
    )
  })

  it('honors XAIKU_MCP_URL override', () => {
    const fakeChild = { on: jest.fn() }
    spawn.mockReturnValue(fakeChild)

    runCli({ argv: [], env: { XAIKU_MCP_URL: 'http://localhost:3000/api/mcp' } })

    expect(spawn).toHaveBeenCalledWith(
      'npx',
      ['-y', 'mcp-remote', 'http://localhost:3000/api/mcp'],
      { stdio: 'inherit' }
    )
  })
})
