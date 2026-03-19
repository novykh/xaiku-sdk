import request from '~/request'
import ensureOneSlash from '~/ensureOneSlash'

export default async (sdk, ids) => {
  try {
    const url = ensureOneSlash(`${sdk.apiUrl}/experiments`)
    const headers = {
      Accept: 'application/json',
      'X-public-key': sdk.pkey,
      'X-experiment-ids': (ids ?? sdk.experimentIds).join(','),
    }

    if (sdk.options?.testMode) {
      headers['X-xaiku-test'] = 'true'
    }

    const response = await request(url, { headers })

    return response.experiments
  } catch (error) {
    console.error(error)
  }

  return []
}
