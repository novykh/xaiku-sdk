import syncTestModeCookie from './syncTestModeCookie'
import { testModeStorageKey } from './setTestMode'

describe('syncTestModeCookie', () => {
  beforeEach(() => {
    localStorage.clear()
    document.cookie = `${testModeStorageKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
  })

  it('sets cookie when localStorage has xaiku_test=true', () => {
    localStorage.setItem('xaiku_test', 'true')
    syncTestModeCookie()
    expect(document.cookie).toContain('xaiku_test=true')
  })

  it('does not set cookie when localStorage does not have xaiku_test', () => {
    syncTestModeCookie()
    expect(document.cookie).not.toContain('xaiku_test=true')
  })

  it('clears cookie when localStorage has xaiku_test set to something other than true', () => {
    localStorage.setItem('xaiku_test', 'false')
    syncTestModeCookie()
    expect(document.cookie).not.toContain('xaiku_test=true')
  })

  it('clears an existing cookie when localStorage xaiku_test is removed', () => {
    localStorage.setItem('xaiku_test', 'true')
    syncTestModeCookie()
    expect(document.cookie).toContain('xaiku_test=true')
    localStorage.removeItem('xaiku_test')
    syncTestModeCookie()
    expect(document.cookie).not.toContain('xaiku_test=true')
  })
})
