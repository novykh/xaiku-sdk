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
})
