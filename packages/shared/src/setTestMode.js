export const testModeStorageKey = 'xaiku_test'

const getExpiresUtcString = days => {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  return date.toUTCString()
}

const getDomain = () => window.location.hostname.split('.').slice(-2).join('.')

export const buildTestModeCookie = enabled => {
  if (enabled) {
    return `${testModeStorageKey}=true; path=/; domain=.${getDomain()}; expires=${getExpiresUtcString(7)}; secure; SameSite=Lax`
  }
  return `${testModeStorageKey}=; path=/; domain=.${getDomain()}; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; SameSite=Lax`
}

export default (enabled = true) => {
  if (typeof localStorage === 'undefined' || typeof document === 'undefined') return

  if (enabled) {
    localStorage.setItem(testModeStorageKey, 'true')
  } else {
    localStorage.removeItem(testModeStorageKey)
  }

  document.cookie = buildTestModeCookie(enabled)
}
