import { isomorphicAtob, isomorphicBtoa } from './base64'

describe('isomorphicAtob', () => {
  it('should decode a base64 encoded string', () => {
    const encoded = 'SGVsbG8gd29ybGQ='
    const decoded = 'Hello world'
    expect(isomorphicAtob(encoded)).toBe(decoded)
  })

  it('should decode an empty string', () => {
    const input = ''
    expect(isomorphicAtob(input)).toBe(input)
  })

  it('should decode using Buffer when atob is not available', () => {
    const originalAtob = global.atob
    delete global.atob
    global.Buffer = require('buffer').Buffer

    const encoded = 'SGVsbG8gd29ybGQ='
    const decoded = 'Hello world'
    expect(isomorphicAtob(encoded)).toBe(decoded)

    global.atob = originalAtob
  })

  it('return self if no base64 functions', () => {
    const originalAtob = global.atob
    delete global.atob
    const originalBuffer = global.Buffer
    delete global.Buffer

    const encoded = 'SGVsbG8gd29ybGQ='
    expect(isomorphicAtob(encoded)).toBe(encoded)

    global.atob = originalAtob
    global.Buffer = originalBuffer
  })
})

describe('isomorphicBtoa', () => {
  it('should encode a string to base64', () => {
    const input = 'Hello world'
    const encoded = 'SGVsbG8gd29ybGQ='
    expect(isomorphicBtoa(input)).toBe(encoded)
  })

  it('should encode an empty string to base64', () => {
    const input = ''
    const encoded = ''
    expect(isomorphicBtoa(input)).toBe(encoded)
  })

  it('should encode using Buffer when btoa is not available', () => {
    const originalBtoa = global.btoa
    delete global.btoa
    global.Buffer = require('buffer').Buffer

    const input = 'Hello world'
    const encoded = 'SGVsbG8gd29ybGQ='
    expect(isomorphicBtoa(input)).toBe(encoded)

    global.btoa = originalBtoa
  })

  it('return self if no base64 functions', () => {
    const originalBtoa = global.btoa
    delete global.btoa
    const originalBuffer = global.Buffer
    delete global.Buffer

    const input = 'Hello world'
    expect(isomorphicBtoa(input)).toBe(input)

    global.btoa = originalBtoa
    global.Buffer = originalBuffer
  })
})
