import init from '.'

describe('init in browser', () => {
  it('should not fail', () => {
    init({ pkey: 'pk_test_123', experimentIds: ['experimentId'] })
  })

  describe('testMode', () => {
    afterEach(() => {
      localStorage.clear()
    })

    it('sets sdk.options.testMode from localStorage', () => {
      localStorage.setItem('xaiku_test', 'true')
      const sdk = init({ pkey: 'pk_test_123', experimentIds: ['experimentId'] })
      expect(sdk.options.testMode).toBe(true)
    })

    it('does not set sdk.options.testMode when localStorage has no xaiku_test', () => {
      const sdk = init({ pkey: 'pk_test_123', experimentIds: ['experimentId'] })
      expect(sdk.options.testMode).toBeFalsy()
    })
  })
})
