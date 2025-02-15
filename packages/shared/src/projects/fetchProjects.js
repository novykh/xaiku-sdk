import request from '@/request'
import ensureOneSlash from '@/ensureOneSlash'

export default async sdk => {
  try {
    const url = ensureOneSlash(`${sdk.apiUrl}/projects`)
    const response = await request(url, {
      headers: {
        Accept: 'custom/json',
        'X-public-key': sdk.pkey,
        'X-project-ids': sdk.projectIds.join(','),
      },
    })

    return response.projects
  } catch (error) {
    console.error(error)
  }

  return []
}
