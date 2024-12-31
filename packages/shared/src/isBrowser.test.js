import isBrowser from './isBrowser'

describe('isBrowser', () => {
  it('should return false when window is undefined', () => {
    const windowSpy = jest.spyOn(global, 'window', 'get')
    windowSpy.mockImplementation(() => undefined)

    const result = isBrowser()

    expect(result).toBe(false)

    windowSpy.mockRestore()
  })

  it('should return true when window is defined', () => {
    const result = isBrowser()

    expect(result).toBe(true)
  })

  it('should return false when document is undefined', () => {
    const documentSpy = jest.spyOn(global, 'document', 'get')
    documentSpy.mockImplementation(() => undefined)

    const result = isBrowser()

    expect(result).toBe(false)

    documentSpy.mockRestore()
  })

  it('should return true when document is defined', () => {
    const result = isBrowser()

    expect(result).toBe(true)
  })
})
