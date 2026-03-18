import setTestMode, { testModeStorageKey, buildTestModeCookie } from './setTestMode'

describe('setTestMode', () => {
  beforeEach(() => {
    localStorage.clear()
    document.cookie = `${testModeStorageKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
  })

  describe('testModeStorageKey', () => {
    it('equals xaiku_test', () => {
      expect(testModeStorageKey).toBe('xaiku_test')
    })
  })

  describe('enabling test mode', () => {
    it('sets localStorage', () => {
      setTestMode(true)
      expect(localStorage.getItem('xaiku_test')).toBe('true')
    })

    it('sets cookie', () => {
      setTestMode(true)
      expect(document.cookie).toContain('xaiku_test=true')
    })
  })

  describe('disabling test mode', () => {
    it('removes localStorage', () => {
      localStorage.setItem('xaiku_test', 'true')
      setTestMode(false)
      expect(localStorage.getItem('xaiku_test')).toBeNull()
    })

    it('clears cookie', () => {
      setTestMode(true)
      setTestMode(false)
      expect(document.cookie).not.toContain('xaiku_test=true')
    })
  })

  describe('defaults to enabled', () => {
    it('sets test mode when called without arguments', () => {
      setTestMode()
      expect(localStorage.getItem('xaiku_test')).toBe('true')
    })
  })

  describe('buildTestModeCookie', () => {
    it('includes path, secure, and SameSite=Lax', () => {
      const cookie = buildTestModeCookie(true)
      expect(cookie).toContain('path=/')
      expect(cookie).toContain('secure')
      expect(cookie).toContain('SameSite=Lax')
    })

    it('includes domain from window.location.hostname', () => {
      const cookie = buildTestModeCookie(true)
      expect(cookie).toContain('domain=.')
    })

    it('includes expires for enabled', () => {
      const cookie = buildTestModeCookie(true)
      expect(cookie).toContain('expires=')
    })

    it('expires in the past for disabled', () => {
      const cookie = buildTestModeCookie(false)
      expect(cookie).toContain('expires=Thu, 01 Jan 1970')
    })
  })
})
