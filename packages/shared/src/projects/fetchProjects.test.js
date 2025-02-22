import fetchProjects from './fetchProjects'

describe('fetchProjects', () => {
  const sdk = {
    apiUrl: 'https://api.example.com',
    pkey: 'test-public-key',
    projectIds: ['default-project-id'],
  }

  it('fetches project data successfully', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ projects: [{ id: 'test-project-id', name: 'Test Project' }] })
    )

    const ids = ['test-project-id']
    const projects = await fetchProjects(sdk, ids)

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/projects', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-public-key': 'test-public-key',
        'X-project-ids': 'test-project-id',
      },
      method: 'GET',
    })
    expect(projects).toEqual([{ id: 'test-project-id', name: 'Test Project' }])
  })

  it('fetches project ids from sdk', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ projects: [{ id: 'default-project-id', name: 'Default Project' }] })
    )

    const projects = await fetchProjects(sdk)

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/projects', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-public-key': 'test-public-key',
        'X-project-ids': 'default-project-id',
      },
      method: 'GET',
    })
    expect(projects).toEqual([{ id: 'default-project-id', name: 'Default Project' }])
  })

  it('handles fetch errors', async () => {
    fetch.mockRejectOnce(new Error('API is down'))

    const ids = ['test-project-id']
    const projects = await fetchProjects(sdk, ids)

    expect(projects).toEqual([])
  })
})
