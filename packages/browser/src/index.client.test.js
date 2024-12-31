/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://xaiku.com/"}
 */

import init from '.'

describe('init in browser', () => {
  it('should not fail', () => {
    init()
  })
})
