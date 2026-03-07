import request from '~/request'
import ensureOneSlash from '~/ensureOneSlash'
import isTestMode from '~/isTestMode'

export default async (sdk, ids) => {
  try {
    const url = ensureOneSlash(`${sdk.apiUrl}/projects`)
    const headers = {
      Accept: 'application/json',
      'X-public-key': sdk.pkey,
      'X-project-ids': (ids ?? sdk.projectIds).join(','),
    }

    if (isTestMode()) {
      headers['X-xaiku-test'] = 'true'
    }

    const response = await request(url, { headers })

    return response.projects
  } catch (error) {
    console.error(error)
  }

  return []
}
