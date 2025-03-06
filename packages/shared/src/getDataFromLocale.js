const unknown = 'unknown'

export default () => {
  let locale
  try {
    locale = Intl.DateTimeFormat().resolvedOptions().locale
    // eslint-disable-next-line no-empty
  } catch {}

  locale = locale || navigator?.language || ''
  const [language, country] = locale.split('-')

  return {
    language: (language || unknown).toLowerCase(),
    country: (country || unknown).toUpperCase(),
  }
}
