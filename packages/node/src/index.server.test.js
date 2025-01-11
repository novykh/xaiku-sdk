import init from '.'

describe('init in server', () => {
  it('init() should fail with error "The library needs DOM"', () => {
    expect(() => {
      init()
    }).toThrow('@xaiku/browser runs only on browsers and expects document to exist.')
  })
})
