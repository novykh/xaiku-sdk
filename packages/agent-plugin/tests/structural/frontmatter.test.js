const fs = require('node:fs')
const path = require('node:path')
const matter = require('gray-matter')

const SKILLS_DIR = path.join(__dirname, '..', '..', 'skills')

const skillFolders = fs
  .readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)

describe('skill frontmatter', () => {
  test.each(skillFolders)('%s has valid frontmatter', folder => {
    const file = path.join(SKILLS_DIR, folder, 'SKILL.md')
    expect(fs.existsSync(file)).toBe(true)
    const { data } = matter(fs.readFileSync(file, 'utf8'))
    expect(data.name).toBe(folder)
    expect(typeof data.description).toBe('string')
    expect(data.description.length).toBeGreaterThan(20)
    expect(data.description.toLowerCase()).toMatch(/^use when/)
  })

  test('all skill names are unique', () => {
    const names = skillFolders.map(folder => {
      const file = path.join(SKILLS_DIR, folder, 'SKILL.md')
      return matter(fs.readFileSync(file, 'utf8')).data.name
    })
    expect(new Set(names).size).toBe(names.length)
  })
})
