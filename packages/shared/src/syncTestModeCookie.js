import { testModeStorageKey, buildTestModeCookie } from './setTestMode'

export default () => {
  if (typeof localStorage === 'undefined' || typeof document === 'undefined') return

  const enabled = localStorage.getItem(testModeStorageKey) === 'true'
  document.cookie = buildTestModeCookie(enabled)
}
