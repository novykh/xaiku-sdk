import makeSessionStorageStore, { name } from './sessionStorage'
import { serialize } from '~/json'

describe.skip('sessionStorage store module', () => {
  let originalSessionStorage

  let fakeStorage
  let storageData

  beforeEach(() => {
    originalSessionStorage = window.sessionStorage

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

    window.sessionStorage = fakeStorage
  })

  afterEach(() => {
    window.sessionStorage = originalSessionStorage
  })

  test('should create a store with correct properties and mark supported true when sessionStorage exists', () => {
    const store = makeSessionStorageStore()
    expect(store).toHaveProperty('name', name)
    expect(typeof store.get).toBe('function')
    expect(typeof store.set).toBe('function')
    expect(typeof store.delete).toBe('function')
    expect(store.supported).toBe(true)
  })

  test('get should return the deserialized value from sessionStorage', () => {
    const store = makeSessionStorageStore()
    const key = 'testKey'
    const value = { foo: 'bar' }
    window.sessionStorage.setItem(key, serialize(value))
    const result = store.get(key)
    expect(fakeStorage.getItem).toHaveBeenCalledWith(key)
    expect(result).toEqual(value)
  })

  test('set should store the serialized value in sessionStorage', () => {
    const store = makeSessionStorageStore()
    const key = 'setKey'
    const value = { hello: 'world' }
    store.set(key, value)
    expect(fakeStorage.setItem).toHaveBeenCalledWith(key, serialize(value))
  })

  test('delete should remove the item from sessionStorage', () => {
    const store = makeSessionStorageStore()
    const key = 'deleteKey'
    store.delete(key)
    expect(fakeStorage.removeItem).toHaveBeenCalledWith(key)
  })

  test('should mark supported false if window.sessionStorage is undefined', () => {
    window.sessionStorage = undefined
    const store = makeSessionStorageStore()
    expect(store.supported).toBe(false)
  })
})
