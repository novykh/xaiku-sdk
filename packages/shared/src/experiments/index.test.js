import makeListeners from '~/listeners'
import makeStorage from '~/storage'
import makeExperiments from '.'

const makeTestSdk = options => {
  const sdk = {
    options: { store: { name: 'memory' }, ...options },
    apiUrl: 'https://api.example.com',
    pkey: 'pk',
    guid: 'guid-1',
    experimentIds: [],
    ...makeListeners(),
  }
  sdk.storage = makeStorage(sdk)
  return sdk
}

describe('experiments', () => {
  let sdk

  afterEach(() => {
    sdk.storage.delete('__xaiku__experiments__')
    sdk.storage.delete('__xaiku__variants__')
  })

  it('a variants:select listener can read the selected variant through the sdk', async () => {
    sdk = makeTestSdk({ skipExperiments: true })
    await makeExperiments(sdk)
    const seen = []
    sdk.on('variants:select', () => seen.push(sdk.getVariantId('e1')))
    sdk.selectVariants({ e1: [{ id: 'v1', weight: 5, control: true }] })
    expect(seen).toEqual(['v1'])
  })

  describe('getExperiments', () => {
    const stored = { e1: [{ id: 'old', weight: 5 }] }

    const makeWithStored = async () => {
      sdk = makeTestSdk({ skipExperiments: true })
      await makeExperiments(sdk)
      sdk.storage.set('__xaiku__experiments__', stored)
    }

    it('fetches even when storage already holds experiments', async () => {
      await makeWithStored()
      const fresh = { e1: [{ id: 'new', weight: 5 }] }
      fetch.mockResponseOnce(JSON.stringify({ experiments: fresh }))
      const fetched = jest.fn()
      sdk.on('experiments:fetched', fetched)

      await expect(sdk.getExperiments()).resolves.toEqual(fresh)
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetched).toHaveBeenCalledWith(fresh)
      expect(sdk.getVariantId('e1')).toBe('new')
    })

    it('falls back to the stored copy when the fetch fails', async () => {
      await makeWithStored()
      fetch.mockRejectOnce(new Error('down'))
      jest.spyOn(console, 'error').mockImplementation(() => {})

      await expect(sdk.getExperiments()).resolves.toEqual(stored)
      expect(sdk.getVariantId('e1')).toBe('old')
    })

    it('an empty response clears stale experiments', async () => {
      await makeWithStored()
      fetch.mockResponseOnce(JSON.stringify({ experiments: {} }))

      await expect(sdk.getExperiments()).resolves.toEqual({})
      expect(sdk.getVariantId('e1')).toBeNull()
    })

    it('options.experiments are served without a request', async () => {
      const given = { e1: [{ id: 'v1', weight: 5 }] }
      sdk = makeTestSdk({ skipExperiments: true, experiments: given })
      await makeExperiments(sdk)

      await expect(sdk.getExperiments()).resolves.toEqual(given)
      expect(fetch).not.toHaveBeenCalled()
    })
  })
})
