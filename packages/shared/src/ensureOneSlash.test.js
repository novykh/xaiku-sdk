import ensureOneSlash from './ensureOneSlash'

describe('ensureOneSlash', () => {
  test('should reduce multiple slashes to a single slash in a URL', () => {
    const input = 'http://example.com//path///to//resource'
    const expected = 'http://example.com/path/to/resource'
    expect(ensureOneSlash(input)).toEqual(expected)
  })

  test('should not change URLs that already have one slash between parts', () => {
    const input = 'https://example.com/path/to/resource'
    expect(ensureOneSlash(input)).toEqual(input)
  })

  test('should handle URLs with protocol slashes correctly', () => {
    const input = 'https://example.com///'
    const expected = 'https://example.com/'
    expect(ensureOneSlash(input)).toEqual(expected)
  })

  test('should return non-string inputs unchanged', () => {
    const nonStringInput = 12345
    expect(ensureOneSlash(nonStringInput)).toEqual(nonStringInput)
  })

  test('should handle an empty string', () => {
    const input = ''
    expect(ensureOneSlash(input)).toEqual('')
  })
})
