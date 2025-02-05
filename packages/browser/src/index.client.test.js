import init from '.'

describe('init in browser', () => {
  it('should not fail', () => {
    init({ pkey: 'pk_test_123', projectIds: ['projectId'] })
  })
})
