import makeCookieStore, { name } from './cookie'
import { serialize } from '~/json'

let cookieStore = ''
Object.defineProperty(document, 'cookie', {
  get() {
    return cookieStore
  },
  set(val) {
    cookieStore = val
  },
  configurable: true,
})

describe('store module (default export)', () => {
  const originalHostname = window.location.hostname

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'sub.example.com',
      },
      writable: true,
    })
  })

  afterAll(() => {
    window.location.hostname = originalHostname
  })

  beforeEach(() => {
    cookieStore = ''
  })

  const defaultSdk = {
    options: {},
  }

  test('should return a store object with expected properties', () => {
    const store = makeCookieStore(defaultSdk)
    expect(store).toHaveProperty('name', name)
    expect(typeof store.get).toBe('function')
    expect(typeof store.set).toBe('function')
    expect(typeof store.delete).toBe('function')
    expect(store.supported).toBe(true)
  })

  describe('store.get', () => {
    test('should return null if no cookie is found', () => {
      const store = makeCookieStore(defaultSdk)
      expect(store.get('testKey')).toBeNull()
    })

    test('should return the deserialized value if cookie exists', () => {
      const store = makeCookieStore(defaultSdk)
      const value = { foo: 'bar' }
      const serializedValue = encodeURIComponent(serialize(value))
      const cookieName = encodeURIComponent('myKey') + '='
      cookieStore = cookieName + serializedValue + '; path=/'
      const retrieved = store.get('myKey')
      expect(retrieved).toEqual(value)
    })
  })

  describe('store.set', () => {
    test('should set document.cookie with expected attributes using default config', () => {
      const store = makeCookieStore(defaultSdk)
      const key = 'myKey'
      const value = { a: 1 }
      store.set(key, value)

      const encodedKey = encodeURIComponent(key)
      const encodedValue = encodeURIComponent(serialize(value))
      expect(cookieStore).toContain(`${encodedKey}=${encodedValue}`)
      expect(cookieStore).toContain('path=/')

      expect(cookieStore).toContain('domain=.example.com')
      expect(cookieStore).toContain('secure')
    })

    test('should use custom store options from sdk.options.store', () => {
      const customOptions = {
        crossSubdomain: false,
        secure: false,
        expiresAfterDays: 1,
      }
      const sdk = {
        options: { store: customOptions },
      }
      const store = makeCookieStore(sdk)
      const key = 'customKey'
      const value = 'testValue'
      store.set(key, value)

      expect(cookieStore).not.toContain('domain=')
      expect(cookieStore).not.toContain('secure')
      expect(cookieStore).toMatch(/expires=.*GMT/)
    })
  })

  describe('store.delete', () => {
    test('should set cookie to empty string', () => {
      const store = makeCookieStore(defaultSdk)
      const key = 'deleteKey'
      store.delete(key)
      const encodedKey = encodeURIComponent(key) + '='
      const decoded = decodeURIComponent(cookieStore)
      expect(decoded).toContain(encodedKey + '')
    })
  })
})
