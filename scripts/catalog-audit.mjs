import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packageDir = path.join(root, 'packages')
const packageJsonFiles = fs
  .readdirSync(packageDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => path.join('packages', entry.name, 'package.json'))
  .filter(file => fs.existsSync(path.join(root, file)))

const manifests = ['package.json', ...packageJsonFiles]
const sections = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']
const skipPrefixes = ['workspace:', 'catalog:', 'file:', 'link:', 'git+', 'http://', 'https://', 'github:', 'npm:']

const workspaceCatalogKeys = new Set()
const repeated = new Map()
const directVersions = []

const workspaceYamlPath = path.join(root, 'pnpm-workspace.yaml')
if (fs.existsSync(workspaceYamlPath)) {
  const lines = fs.readFileSync(workspaceYamlPath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const isCatalogKey = /^ {4}["']?[^"']+["']?:/.test(line)
    if (!isCatalogKey) continue

    const trimmed = line.trim()
    const splitAt = trimmed.indexOf(':')
    if (splitAt === -1) continue
    const rawName = trimmed.slice(0, splitAt)
    const depName = rawName.replace(/^["']|["']$/g, '')
    workspaceCatalogKeys.add(depName)
  }
}

for (const manifestPath of manifests) {
  const absolutePath = path.join(root, manifestPath)
  const json = JSON.parse(fs.readFileSync(absolutePath, 'utf8'))

  for (const section of sections) {
    const deps = json[section] ?? {}
    for (const [name, version] of Object.entries(deps)) {
      if (typeof version !== 'string') continue
      if (skipPrefixes.some(prefix => version.startsWith(prefix))) continue

      const item = {
        file: manifestPath,
        section,
        name,
        version,
      }
      directVersions.push(item)

      const versionsByName = repeated.get(name) ?? new Map()
      const refs = versionsByName.get(version) ?? []
      refs.push(item)
      versionsByName.set(version, refs)
      repeated.set(name, versionsByName)
    }
  }
}

const repeatedCandidates = []
for (const [name, versionsByName] of repeated) {
  let refsCount = 0
  const uniqueVersions = []
  for (const [version, refs] of versionsByName) {
    refsCount += refs.length
    uniqueVersions.push(version)
  }
  if (refsCount < 2) continue
  repeatedCandidates.push({
    name,
    refsCount,
    uniqueVersions: uniqueVersions.sort(),
    inCatalog: workspaceCatalogKeys.has(name),
  })
}

directVersions.sort((a, b) => a.name.localeCompare(b.name) || a.file.localeCompare(b.file))
repeatedCandidates.sort((a, b) => b.refsCount - a.refsCount || a.name.localeCompare(b.name))

const printSection = title => {
  console.log(`\n${title}`)
  console.log('-'.repeat(title.length))
}

if (directVersions.length === 0) {
  printSection('Direct versions not using catalog/workspace')
  console.log('None')
} else {
  printSection('Direct versions not using catalog/workspace')
  for (const item of directVersions) {
    console.log(`${item.name}@${item.version}  (${item.file} -> ${item.section})`)
  }
}

if (repeatedCandidates.length === 0) {
  printSection('Repeated direct-version dependencies')
  console.log('None')
} else {
  printSection('Repeated direct-version dependencies')
  for (const candidate of repeatedCandidates) {
    const status = candidate.inCatalog ? 'already in catalog' : 'candidate for catalog'
    console.log(`${candidate.name}  refs=${candidate.refsCount}  versions=[${candidate.uniqueVersions.join(', ')}]  ${status}`)
  }
}

const missingInCatalog = repeatedCandidates.filter(candidate => !candidate.inCatalog)
printSection('Catalog expansion candidates')
if (missingInCatalog.length === 0) {
  console.log('None')
} else {
  for (const candidate of missingInCatalog) {
    console.log(`${candidate.name} (${candidate.refsCount} refs)`)
  }
}
