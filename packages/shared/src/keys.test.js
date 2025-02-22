import { parsePublicKey, errorMissingKeyMessage, errorInvalidKeyMessage } from './keys'

describe('parsePublicKey', () => {
  test('throws error if sdk.pkey is missing', () => {
    const sdk = {
      pkey: null,
      options: {},
    }
    expect(() => parsePublicKey(sdk)).toThrow(errorMissingKeyMessage)
  })

  test('throws error if sdk.pkey is not valid (does not start with "pk_")', () => {
    const sdk = {
      pkey: 'invalid_key',
      options: {},
    }
    expect(() => parsePublicKey(sdk)).toThrow(errorInvalidKeyMessage)
  })

  test('returns token and production API URL when no options are provided', () => {
    const sdk = {
      pkey: 'pk_validtoken',
    }
    const result = parsePublicKey(sdk)
    expect(result.token).toEqual('validtoken')
    // Defaults to production URL
    expect(result.apiUrl).toEqual('https://xaiku.com/api/v1/')
  })

  test('returns development API URL if sdk.options.dev is true', () => {
    const sdk = {
      pkey: 'pk_devtoken',
      options: { dev: true },
    }
    const result = parsePublicKey(sdk)
    expect(result.token).toEqual('devtoken')
    expect(result.apiUrl).toEqual('http://localhost:3000/api/v1/')
  })

  test('returns proxyApiUrl if provided in sdk.options', () => {
    const proxyUrl = 'https://proxy.example.com/api/v1/'
    const sdk = {
      pkey: 'pk_proxyToken',
      options: { proxyApiUrl: proxyUrl },
    }
    const result = parsePublicKey(sdk)
    expect(result.token).toEqual('proxyToken')
    expect(result.apiUrl).toEqual(proxyUrl)
  })
})
