import getDataFromLocale from './getDataFromLocale' // adjust path as needed

describe('getDataFromLocale function', () => {
  const originalIntl = global.Intl

  afterEach(() => {
    global.Intl = originalIntl
  })

  test('returns locale from Intl with full language and country', () => {
    global.Intl.DateTimeFormat = jest.fn(() => ({
      resolvedOptions: () => ({ locale: 'fr-FR' }),
    }))
    jest.spyOn(window.navigator, 'language', 'get').mockReturnValue('en-US')

    const result = getDataFromLocale()
    expect(result).toEqual({ language: 'fr', country: 'FR' })
  })

  test('falls back to navigator.language when Intl fails', () => {
    global.Intl = null
    jest.spyOn(window.navigator, 'language', 'get').mockReturnValue('fr-FR')

    const result = getDataFromLocale()
    expect(result).toEqual({ language: 'fr', country: 'FR' })
  })

  test('returns defaults when locale is empty', () => {
    global.Intl.DateTimeFormat = jest.fn(() => ({
      resolvedOptions: () => ({ locale: '' }),
    }))
    jest.spyOn(window, 'navigator', 'get').mockReturnValue(undefined)

    const result = getDataFromLocale()
    expect(result).toEqual({ language: 'unknown', country: 'UNKNOWN' })
  })

  test('handles locale with only language code', () => {
    global.Intl = null
    jest.spyOn(window.navigator, 'language', 'get').mockReturnValue('fr')

    const result = getDataFromLocale()
    expect(result).toEqual({ language: 'fr', country: 'UNKNOWN' })
  })
})
