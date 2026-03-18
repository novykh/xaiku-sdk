import fetchExperiments from './fetchExperiments'

describe('fetchExperiments', () => {
  const sdk = {
    apiUrl: 'https://api.example.com',
    pkey: 'test-public-key',
    experimentIds: ['default-experiment-id'],
  }

  it('fetches experiment data successfully', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ experiments: [{ id: 'test-experiment-id', name: 'Test Experiment' }] })
    )

    const ids = ['test-experiment-id']
    const experiments = await fetchExperiments(sdk, ids)

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/experiments', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-public-key': 'test-public-key',
        'X-experiment-ids': 'test-experiment-id',
      },
      method: 'GET',
    })
    expect(experiments).toEqual([{ id: 'test-experiment-id', name: 'Test Experiment' }])
  })

  it('fetches experiment ids from sdk', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        experiments: [{ id: 'default-experiment-id', name: 'Default Experiment' }],
      })
    )

    const experiments = await fetchExperiments(sdk)

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/experiments', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-public-key': 'test-public-key',
        'X-experiment-ids': 'default-experiment-id',
      },
      method: 'GET',
    })
    expect(experiments).toEqual([{ id: 'default-experiment-id', name: 'Default Experiment' }])
  })

  it('handles fetch errors', async () => {
    fetch.mockRejectOnce(new Error('API is down'))

    const ids = ['test-experiment-id']
    const experiments = await fetchExperiments(sdk, ids)

    expect(experiments).toEqual([])
  })
})
