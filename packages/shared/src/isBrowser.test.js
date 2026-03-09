/** @jest-environment node */

import isBrowser from '~/isBrowser'

describe('isBrowser', () => {
  let originalWindow
  let originalDocument

  beforeEach(() => {
    originalWindow = global.window
    originalDocument = global.document
  })

  afterEach(() => {
    if (originalWindow === undefined) {
      delete global.window
    } else {
      global.window = originalWindow
    }

    if (originalDocument === undefined) {
      delete global.document
    } else {
      global.document = originalDocument
    }
  })

  it('should return false when window is undefined', () => {
    delete global.window
    global.document = {}
    expect(isBrowser()).toBe(false)
  })

  it('should return false when document is undefined', () => {
    global.window = {}
    delete global.document
    expect(isBrowser()).toBe(false)
  })

  it('should return true when window and document are defined', () => {
    global.window = {}
    global.document = {}
    expect(isBrowser()).toBe(true)
  })
})
