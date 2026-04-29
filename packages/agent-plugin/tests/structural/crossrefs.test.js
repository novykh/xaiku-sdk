const fs = require('node:fs')
const path = require('node:path')

const SKILLS_DIR = path.join(__dirname, '..', '..', 'skills')

const skillNames = new Set(
  fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
)

const SKILL_NAME_RE = /`([a-z][a-z-]+)`/g

const collectReferencedSkills = body => {
  const refs = new Set()
  for (const m of body.matchAll(SKILL_NAME_RE)) {
    const name = m[1]
    if (skillNames.has(name)) refs.add(name)
  }
  return refs
}

describe('skill cross-references', () => {
  test.each([...skillNames])('%s references only real skills', folder => {
    const body = fs.readFileSync(path.join(SKILLS_DIR, folder, 'SKILL.md'), 'utf8')
    const refs = collectReferencedSkills(body)
    for (const ref of refs) {
      expect(skillNames.has(ref)).toBe(true)
    }
  })
})
