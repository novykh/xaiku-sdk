import init, { defaultOptions } from '.'
import { errorMissingKeyMessage, errorInvalidKeyMessage, storeNames } from '@xaiku/shared'

describe('init', () => {
  it('throws missing public key', () => {
    expect(() => init()).toThrow(errorMissingKeyMessage)
  })

  it('throws invalid public key', () => {
    expect(() => init({ pkey: 'asdf' })).toThrow(errorInvalidKeyMessage)
  })

  it('initializes with default options', () => {
    const sdk = init({ pkey: 'pk_123' })

    expect(sdk.appName).toBe(defaultOptions.appName)
    expect(sdk.version).toBe(defaultOptions.version)
    expect(sdk.projectIds).toEqual([])
    expect(sdk.options).toEqual({ ...defaultOptions, pkey: 'pk_123' })
    expect(sdk.on).toBeDefined()
    expect(sdk.trigger).toBeDefined()
    expect(sdk.storage).toBeDefined()
    expect(sdk.storage.get).toBeDefined()
    expect(sdk.storage.set).toBeDefined()
    expect(sdk.storage.delete).toBeDefined()
    expect(sdk.storage.supported).toBeDefined()

    // No DOM - fallback to memory from default store cookie
    expect(sdk.storage.name).toBe(storeNames.memory)
    expect(sdk.trigger).toBeDefined()
    expect(sdk.token).toBe('123')
    expect(sdk.apiUrl).toBe('https://xaiku.com/api/v1/')
  })

  it('initializes with options', () => {
    let sdk = init({
      pkey: 'pk_1234',
      appName: 'foo',
      version: 'bar',
      projectIds: [1, 2, 3],
      store: { custom: { get: 1, set: 2, delete: 3 } },
      dev: true,
    })

    expect(sdk.appName).toBe('foo')
    expect(sdk.version).toBe('bar')
    expect(sdk.projectIds).toEqual([1, 2, 3])
    expect(sdk.storage.get).not.toBe(1)
    expect(sdk.storage.get).toBeDefined()
    expect(sdk.storage.set).not.toBe(2)
    expect(sdk.storage.set).toBeDefined()
    expect(sdk.storage.delete).not.toBe(3)
    expect(sdk.storage.delete).toBeDefined()
    expect(sdk.storage.supported).toBeDefined()

    // Invalid custom store actions
    expect(sdk.storage.name).toBe(storeNames.memory)
    expect(sdk.token).toBe('1234')
    expect(sdk.apiUrl).toBe('http://localhost:3000/api/v1/')

    sdk = init({
      pkey: 'pk_1234',
      projectIds: 1,
      store: { name: 'sessionStorage' },
      proxyApiUrl: 'http://localhost:3001/api/v1/',
    })

    expect(sdk.projectIds).toEqual([1])

    // No DOM
    expect(sdk.storage.name).toBe(storeNames.memory)
    expect(sdk.apiUrl).toBe('http://localhost:3001/api/v1/')
  })

  it('listens on metric:report event', () => {
    const onReport = jest.fn()

    const sdk = init({ pkey: 'pk_123', onReport })

    const metric = {
      context: 'test',
      value: 1,
      group: 'testGroup',
      name: 'testMetric',
      title: 'Test Metric',
      labels: [],
      entries: [],
    }

    sdk.trigger('metric:report', metric)

    expect(onReport).toHaveBeenCalledWith(metric, sdk)
  })
})
