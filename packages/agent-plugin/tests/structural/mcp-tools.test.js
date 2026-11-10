const fs = require('node:fs')
const path = require('node:path')

const SKILLS_DIR = path.join(__dirname, '..', '..', 'skills')

const EXPECTED_TOOLS = new Set([
  'xaiku_list_orgs',
  'xaiku_list_experiments',
  'xaiku_get_experiment',
  'xaiku_create_experiment',
  'xaiku_update_experiment',
  'xaiku_list_variants',
  'xaiku_generate_variants',
  'xaiku_approve_variant',
  'xaiku_unapprove_variant',
  'xaiku_set_variant_control',
  'xaiku_set_variant_weight',
  'xaiku_create_variant',
  'xaiku_analyze_variant',
  'xaiku_set_field_text',
  'xaiku_remove_variant_control',
  'xaiku_archive_variant',
  'xaiku_list_voices',
  'xaiku_get_voice',
  'xaiku_create_voice',
  'xaiku_update_voice',
  'xaiku_archive_voice',
  'xaiku_get_integration',
  'xaiku_update_integration',
  'xaiku_check_connection',
  'xaiku_go_live',
  'xaiku_list_events',
  'xaiku_generate_phrase_alternatives',
  'xaiku_adjust_emotion',
  'xaiku_rewrite_gene_type',
  'xaiku_apply_phrase',
  'xaiku_forecast_variants',
  'xaiku_get_analytics',
  'xaiku_get_readiness',
  'xaiku_get_sdk_snippet',
])

const TOOL_MENTION = /xaiku_[a-z_]+/g

const collectToolMentions = () => {
  const mentions = new Set()
  for (const folder of fs.readdirSync(SKILLS_DIR)) {
    const file = path.join(SKILLS_DIR, folder, 'SKILL.md')
    if (!fs.existsSync(file)) continue
    const text = fs.readFileSync(file, 'utf8')
    for (const m of text.matchAll(TOOL_MENTION)) mentions.add(m[0])
  }
  return mentions
}

describe('MCP tool cross-references', () => {
  test('every xaiku_* name mentioned in a skill exists in the expected tool list', () => {
    const mentioned = collectToolMentions()
    const unknown = [...mentioned].filter(t => !EXPECTED_TOOLS.has(t))
    expect(unknown).toEqual([])
  })
})
