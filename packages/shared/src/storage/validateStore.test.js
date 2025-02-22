import storeValidator, { checkSizeForCookie, checkSizeForLocalStorage } from './validateStore'

describe('checkMaxSize helpers', () => {
  describe('checkSizeForCookie', () => {
    test('returns true when JSON string length is below or equal to 4000', () => {
      const data = { a: 'small string' }
      expect(checkSizeForCookie(data)).toBe(true)
    })

    test('returns false when JSON string length exceeds 4000', () => {
      const largeString = 'a'.repeat(4001)
      expect(checkSizeForCookie(largeString)).toBe(false)
    })

    test('returns false if JSON.stringify throws an error', () => {
      const circular = {}
      circular.self = circular
      expect(checkSizeForCookie(circular)).toBe(false)
    })
  })

  describe('checkSizeForLocalStorage', () => {
    test('returns true when JSON string length is below or equal to 1e6', () => {
      const data = { a: 'small string' }
      expect(checkSizeForLocalStorage(data)).toBe(true)
    })

    test('returns false when JSON string length exceeds 1e6', () => {
      const largeString = 'a'.repeat(1e6 + 1)
      expect(checkSizeForLocalStorage(largeString)).toBe(false)
    })

    test('returns false if JSON.stringify throws an error', () => {
      const circular = {}
      circular.self = circular
      expect(checkSizeForLocalStorage(circular)).toBe(false)
    })
  })
})

describe('storeValidator (default export)', () => {
  const key = '_xaiku_foo_'
  const val = '_xaiku_bar_'

  test('returns false if store is not an object or is null', () => {
    expect(storeValidator(null)).toBe(false)
    expect(storeValidator('not an object')).toBe(false)
  })

  test('returns false if store.supported is false', () => {
    const store = { supported: false }
    expect(storeValidator(store)).toBe(false)
  })

  test('returns true if store.supported is true and set/get/delete work as expected', () => {
    const store = {
      supported: true,
      set: jest.fn(),
      get: jest.fn(() => val),
      delete: jest.fn(),
    }
    const result = storeValidator(store)
    expect(store.set).toHaveBeenCalledWith(key, val)
    expect(store.get).toHaveBeenCalledWith(key)
    expect(store.delete).toHaveBeenCalledWith(key)
    expect(result).toBe(true)
  })

  test('returns false and sets supported to false if store.get returns wrong value', () => {
    const store = {
      supported: true,
      set: jest.fn(),
      get: jest.fn(() => 'wrong value'),
      delete: jest.fn(),
    }
    const result = storeValidator(store)
    expect(store.set).toHaveBeenCalledWith(key, val)
    expect(store.get).toHaveBeenCalledWith(key)
    expect(result).toBe(false)
    expect(store.supported).toBe(false)
  })

  test('returns false and sets supported to false if an exception is thrown', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const store = {
      supported: true,
      set: jest.fn(() => {
        throw new Error('set error')
      }),
      get: jest.fn(() => val),
      delete: jest.fn(),
      name: 'testStore',
    }
    const result = storeValidator(store)
    expect(warnSpy).toHaveBeenCalledWith('Store not supported', store.name, val, store.get(key))
    expect(result).toBe(false)
    expect(store.supported).toBe(false)
    warnSpy.mockRestore()
  })
})
