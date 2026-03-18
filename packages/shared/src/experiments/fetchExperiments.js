import request from '~/request'
import ensureOneSlash from '~/ensureOneSlash'
import isTestMode from '~/isTestMode'

export default async (sdk, ids) => {
  try {
    const url = ensureOneSlash(`${sdk.apiUrl}/experiments`)
    const headers = {
      Accept: 'application/json',
      'X-public-key': sdk.pkey,
      'X-experiment-ids': (ids ?? sdk.experimentIds).join(','),
    }

    if (isTestMode()) {
      headers['X-xaiku-test'] = 'true'
    }

    const response = await request(url, { headers })

    return response.experiments
  } catch (error) {
    console.error(error)
  }

  return []
}
