const { execFileSync } = require('node:child_process')
const path = require('node:path')

const HOOK = path.join(__dirname, '..', '..', 'hooks', 'session-start.sh')
const PLUGIN_ROOT = path.join(__dirname, '..', '..')

const describeOrSkip = process.platform === 'win32' ? describe.skip : describe

describeOrSkip('session-start hook', () => {
  test('emits valid JSON with additionalContext', () => {
    const out = execFileSync(HOOK, [], {
      env: { ...process.env, CLAUDE_PLUGIN_ROOT: PLUGIN_ROOT },
      encoding: 'utf8',
    })
    const parsed = JSON.parse(out)
    expect(parsed.hookSpecificOutput?.hookEventName).toBe('SessionStart')
    expect(typeof parsed.hookSpecificOutput?.additionalContext).toBe('string')
    expect(parsed.hookSpecificOutput.additionalContext).toContain('using-xaiku')
  })
})
