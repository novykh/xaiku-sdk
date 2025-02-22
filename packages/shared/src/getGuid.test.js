import getGuid, { key } from './getGuid'

// Immediately invoke the onNextTick callback.
jest.mock('~/onNextTick', () => fn => fn())

describe('GUID module default export', () => {
  const validGuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

  let sdk, storageSetSpy, storageGetSpy
  const originalMathRandom = Math.random

  beforeEach(() => {
    Math.random = jest.fn(() => 0.5)

    storageSetSpy = jest.fn()
    storageGetSpy = jest.fn()
    sdk = {
      storage: {
        get: storageGetSpy,
        set: storageSetSpy,
      },
      options: {},
    }
  })

  afterEach(() => {
    Math.random = originalMathRandom
  })

  test('returns guid from storage if present', () => {
    const storedGuid = '11111111-1111-4111-8111-111111111111'
    storageGetSpy.mockReturnValue(storedGuid)
    // Even if options.guid is provided, storage value takes precedence.
    sdk.options.guid = 'ignored-input'
    const result = getGuid(sdk)
    expect(result).toEqual(storedGuid)
    expect(storageSetSpy).not.toHaveBeenCalled()
  })

  test('uses sdk.options.guid if it is a valid guid and storage is empty', () => {
    storageGetSpy.mockReturnValue(null)
    const validGuid = '22222222-2222-4222-8222-222222222222'
    sdk.options.guid = validGuid
    const result = getGuid(sdk)
    expect(result).toEqual(validGuid)
    expect(result).toMatch(validGuidRegex)
    // onNextTick should call storage.set with the guid.
    expect(storageSetSpy).toHaveBeenCalledWith(key, '22222222-2222-4222-8222-222222222222')
  })

  test('sanitizes sdk.options.guid if invalid guid and storage is empty', () => {
    storageGetSpy.mockReturnValue(null)
    const validGuid = '22222222-2222-4222-8222-22222222222%'
    sdk.options.guid = validGuid
    const result = getGuid(sdk)
    expect(result).toEqual('00000000-0000-4000-8000-00006b535b77')
    expect(result).toMatch(validGuidRegex)
    // onNextTick should call storage.set with the guid.
    expect(storageSetSpy).toHaveBeenCalledWith(key, '00000000-0000-4000-8000-00006b535b77')
  })

  test('sanitizes sdk.options.guid if invalid (but a string) and storage is empty', () => {
    storageGetSpy.mockReturnValue(null)
    // Provide a string that is not a valid guid.
    sdk.options.guid = 'not-a-valid-guid'
    const result = getGuid(sdk)
    // The result should be sanitized into a valid guid format.
    expect(result).toMatch(validGuidRegex)
    expect(storageSetSpy).toHaveBeenCalledWith(key, '00000000-0000-4000-8000-0000395fc360')
  })

  test('sanitizes sdk.options.guid if not a string and storage is empty', () => {
    storageGetSpy.mockReturnValue(null)
    // Provide a non-string (e.g., a number)
    sdk.options.guid = 12345
    const result = getGuid(sdk)
    expect(result).toMatch(validGuidRegex)
    expect(storageSetSpy).toHaveBeenCalledWith(key, '88888888-8888-4888-8888-888888888888')
  })
})
