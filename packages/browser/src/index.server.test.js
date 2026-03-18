/**
 * @jest-environment node
 */

import init from '.'

describe('init in server', () => {
  it('init() should fail', () => {
    expect(() => {
      init({ pkey: 'pk_test_123', experimentIds: ['experimentId'] })
    }).toThrow('@xaiku browser runs only on browsers and expects document to exist.')
  })
})
