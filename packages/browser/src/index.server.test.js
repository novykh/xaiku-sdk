/**
 * @jest-environment node
 */

import init from '.'

describe('init in server', () => {
  it('init() should fail with error "The library needs DOM"', () => {
    expect(() => {
      init({ pkey: 'pk_test_123', projectIds: ['projectId'] })
    }).toThrow('@xaiku/browser runs only on browsers and expects document to exist.')
  })
})
