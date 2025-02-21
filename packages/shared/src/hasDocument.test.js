import hasDocument from '~/hasDocument'

describe('hasDocument', () => {
  it('should return false when document is undefined', () => {
    const windowSpy = jest.spyOn(global, 'document', 'get')
    windowSpy.mockImplementation(() => undefined)

    const result = hasDocument()

    expect(result).toBe(false)

    windowSpy.mockRestore()
  })

  it('should return true when document is defined', () => {
    const windowSpy = jest.spyOn(global, 'document', 'get')
    windowSpy.mockImplementation(() => ({}))

    const result = hasDocument()

    expect(result).toBe(true)

    windowSpy.mockRestore()
  })
})
