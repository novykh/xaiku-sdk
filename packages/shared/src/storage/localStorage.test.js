import makeLocalStorageStore, { name } from './localStorage'
import { serialize } from '~/json'

jest.mock('~/isBrowser', () => jest.fn(() => true))

describe.skip('localStorage store module', () => {
  let originalLocalStorage
  let fakeStorage
  let storageData

  beforeEach(() => {
    originalLocalStorage = window.localStorage

    storageData = {}

    fakeStorage = {
      getItem: jest.fn(key => storageData[key] || null),
      setItem: jest.fn((key, value) => {
        storageData[key] = value
      }),
      removeItem: jest.fn(key => {
        delete storageData[key]
      }),
    }

    window.localStorage = fakeStorage
  })

  afterEach(() => {
    window.localStorage = originalLocalStorage
  })

  test('should create a store with correct properties and mark supported true when localStorage exists', () => {
    const store = makeLocalStorageStore()
    expect(store).toHaveProperty('name', name)
    expect(typeof store.get).toBe('function')
    expect(typeof store.set).toBe('function')
    expect(typeof store.delete).toBe('function')
    expect(store.supported).toBe(true)
  })

  test('get should return the deserialized value from localStorage', () => {
    const store = makeLocalStorageStore()
    const key = 'testKey'
    const value = { foo: 'bar' }
    window.localStorage.setItem(key, serialize(value))
    const result = store.get(key)
    expect(fakeStorage.getItem).toHaveBeenCalledWith(key)
    expect(result).toEqual(value)
  })

  test('set should store the serialized value in localStorage', () => {
    const store = makeLocalStorageStore()
    const key = 'setKey'
    const value = { hello: 'world' }
    store.set(key, value)
    expect(fakeStorage.setItem).toHaveBeenCalledWith(key, serialize(value))
  })

  test('delete should remove the item from localStorage', () => {
    const store = makeLocalStorageStore()
    const key = 'deleteKey'
    store.delete(key)
    expect(fakeStorage.removeItem).toHaveBeenCalledWith(key)
  })

  test('should mark supported false if window.localStorage is undefined', () => {
    window.localStorage = undefined
    const store = makeLocalStorageStore()
    expect(store.supported).toBe(false)
  })
})
