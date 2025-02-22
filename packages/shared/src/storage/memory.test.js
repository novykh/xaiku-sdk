import makeMemoryStore, { name } from './memory'

describe('Memory store module', () => {
  let store

  beforeEach(() => {
    store = makeMemoryStore()
  })

  test('should have supported set to true and correct name', () => {
    expect(store.supported).toBe(true)
    expect(store.name).toEqual(name)
  })

  test('get returns undefined for keys that have not been set', () => {
    expect(store.get('nonexistent')).toBeUndefined()
  })

  test('set stores a value and get retrieves it', () => {
    store.set('foo', 'bar')
    expect(store.get('foo')).toEqual('bar')
  })

  test('delete removes a previously set key', () => {
    store.set('key', 42)
    expect(store.get('key')).toEqual(42)
    store.delete('key')
    expect(store.get('key')).toBeUndefined()
  })

  test('multiple instances share the same underlying attributes', () => {
    store.set('shared', 'value')
    const anotherStore = makeMemoryStore()
    expect(anotherStore.get('shared')).toEqual('value')
  })
})
