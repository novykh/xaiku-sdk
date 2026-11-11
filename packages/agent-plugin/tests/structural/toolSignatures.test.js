const fs = require('node:fs')
const path = require('node:path')

const SKILLS_DIR = path.join(__dirname, '..', '..', 'skills')

// Parameter names copied from the zod schemas in xaiku app/api/mcp/tools/*.js
const org = ['orgId']
const SERVER_PARAMS = {
  xaiku_list_orgs: [],
  xaiku_list_experiments: [...org, 'limit'],
  xaiku_get_experiment: [...org, 'id'],
  xaiku_create_experiment: [
    ...org,
    'name',
    'description',
    'channel',
    'template',
    'voiceId',
    'notes',
    'tone',
    'intent',
    'audience',
    'brandVoice',
    'keywords',
    'statics',
    'variants',
    'samplePlan',
    'toolkit',
  ],
  xaiku_update_experiment: [...org, 'id', 'patch'],
  xaiku_forecast_variants: [...org, 'experimentId'],
  xaiku_get_integration: [...org, 'experimentId'],
  xaiku_create_public_key: [...org],
  xaiku_update_integration: [...org, 'experimentId', 'integration'],
  xaiku_check_connection: [...org, 'experimentId'],
  xaiku_go_live: [...org, 'experimentId'],
  xaiku_get_readiness: [...org, 'experimentId'],
  xaiku_get_sdk_snippet: [...org, 'experimentId', 'framework'],
  xaiku_get_analytics: [...org, 'experimentId'],
  xaiku_list_events: [...org, 'experimentId'],
  xaiku_generate_phrase_alternatives: [...org, 'variantId', 'attr', 'phraseIndex', 'query'],
  xaiku_adjust_emotion: [...org, 'variantId', 'attr', 'phraseIndex', 'emotion'],
  xaiku_rewrite_gene_type: [...org, 'variantId', 'attr', 'phraseIndex', 'targetGeneTypes'],
  xaiku_apply_phrase: [
    ...org,
    'variantId',
    'attr',
    'phraseIndex',
    'phrase',
    'emotions',
    'normalize',
    'confirmLive',
  ],
  xaiku_list_variants: [...org, 'experimentId'],
  xaiku_generate_variants: [...org, 'experimentId', 'count', 'force'],
  xaiku_approve_variant: [...org, 'id', 'confirmLive'],
  xaiku_unapprove_variant: [...org, 'id', 'confirmLive'],
  xaiku_set_variant_weight: [...org, 'id', 'weight'],
  xaiku_set_variant_control: [...org, 'id', 'experimentId', 'confirmLive'],
  xaiku_remove_variant_control: [...org, 'id', 'confirmLive'],
  xaiku_archive_variant: [...org, 'id', 'archived', 'confirmLive'],
  xaiku_create_variant: [...org, 'experimentId', 'fields', 'control', 'normalize'],
  xaiku_set_field_text: [...org, 'variantId', 'field', 'text', 'normalize', 'confirmLive'],
  xaiku_analyze_variant: [...org, 'variantId', 'changedField'],
  xaiku_list_voices: [...org],
  xaiku_get_voice: [...org, 'id'],
  xaiku_create_voice: [...org, 'name', 'textStyles', 'acceptedExcerpts', 'avoidedExcerpts'],
  xaiku_update_voice: [...org, 'id', 'patch'],
  xaiku_archive_voice: [...org, 'id'],
}

const readSkills = () =>
  fs
    .readdirSync(SKILLS_DIR)
    .filter(folder => fs.existsSync(path.join(SKILLS_DIR, folder, 'SKILL.md')))
    .map(folder => ({
      folder,
      text: fs.readFileSync(path.join(SKILLS_DIR, folder, 'SKILL.md'), 'utf8'),
    }))

const SIGNATURE = /(xaiku_[a-z_]+)\(([^()]*)\)/g

const collectSignatureProblems = () => {
  const problems = []
  for (const { folder, text } of readSkills()) {
    for (const [, tool, rawArgs] of text.matchAll(SIGNATURE)) {
      const known = SERVER_PARAMS[tool]
      if (!known) continue
      const args = rawArgs
        .split(',')
        .map(arg => arg.trim().replace(/\[\]$/, '').replace(/\?$/, ''))
        .filter(Boolean)
      for (const arg of args) {
        if (!known.includes(arg)) problems.push(`${folder}: ${tool}(${rawArgs}) has "${arg}"`)
      }
    }
  }
  return problems
}

describe('tool call signatures in skills', () => {
  test('every argument name is one the server tool really takes', () => {
    expect(collectSignatureProblems()).toEqual([])
  })

  test('every server tool is named in at least one skill', () => {
    const all = readSkills()
      .map(s => s.text)
      .join('\n')
    const unplaced = Object.keys(SERVER_PARAMS).filter(tool => !all.includes(`${tool}`))
    expect(unplaced).toEqual([])
  })

  test('skills do not promise a results import or CSV upload', () => {
    const all = readSkills()
      .map(s => s.text)
      .join('\n')
    expect(all).not.toMatch(/import them|uploaded via CSV|Offer CSV/i)
  })
})
