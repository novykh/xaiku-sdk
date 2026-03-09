/** @jest-environment node */

import hasDocument from '~/hasDocument'

describe('hasDocument', () => {
  let originalDocument

  beforeEach(() => {
    originalDocument = global.document
  })

  afterEach(() => {
    if (originalDocument === undefined) {
      delete global.document
    } else {
      global.document = originalDocument
    }
  })

  it('should return false when document is undefined', () => {
    delete global.document
    expect(hasDocument()).toBe(false)
  })

  it('should return true when document is defined', () => {
    global.document = {}
    expect(hasDocument()).toBe(true)
  })
})
