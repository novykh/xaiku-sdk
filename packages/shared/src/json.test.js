import { deserialize, serialize } from './json' // adjust the import path as needed

describe('deserialize', () => {
  test('should return parsed value when given a valid JSON string', () => {
    const input = '{"a":1,"b":"test"}'
    const output = deserialize(input)
    expect(output).toEqual({ a: 1, b: 'test' })
  })

  test('should return null when given a falsy value (e.g., empty string)', () => {
    expect(deserialize('')).toBeNull()
    expect(deserialize(null)).toBeNull()
    expect(deserialize(undefined)).toBeNull()
  })

  test('should return fallback when JSON.parse throws and a fallback is provided', () => {
    const invalidJSON = '{a:1}'
    const fallback = 'fallbackValue'
    const result = deserialize(invalidJSON, fallback)
    expect(result).toBe(fallback)
  })

  test('should return original value when JSON.parse throws and no fallback is provided', () => {
    const invalidJSON = '{a:1}'
    const result = deserialize(invalidJSON)
    expect(result).toBe(invalidJSON)
  })
})

describe('serialize', () => {
  test('should stringify non-string values (object)', () => {
    const input = { a: 1, b: 'test' }
    expect(serialize(input)).toEqual(JSON.stringify(input))
  })

  test('should stringify non-string values (array)', () => {
    const input = [1, 2, 3]
    expect(serialize(input)).toEqual(JSON.stringify(input))
  })

  test('should stringify non-string values (number)', () => {
    const input = 42
    expect(serialize(input)).toEqual(JSON.stringify(input))
  })

  test('should return the same string if already a string', () => {
    const input = '{"a":1,"b":"test"}'
    expect(serialize(input)).toEqual(input)
  })
})
