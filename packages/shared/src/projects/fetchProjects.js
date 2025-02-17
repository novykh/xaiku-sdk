import request from '@/request'
import ensureOneSlash from '@/ensureOneSlash'

export default async (sdk, ids) => {
  try {
    const url = ensureOneSlash(`${sdk.apiUrl}/projects`)
    const response = await request(url, {
      headers: {
        Accept: 'application/json',
        'X-public-key': sdk.pkey,
        'X-project-ids': (ids ?? sdk.projectIds).join(','),
      },
    })

    return response.projects
  } catch (error) {
    console.error(error)
  }

  return []
}
