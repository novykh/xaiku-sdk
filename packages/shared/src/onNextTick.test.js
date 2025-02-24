import onNextTick from '~/onNextTick'
import isBrowser from '~/isBrowser'

jest.mock('~/isBrowser')

describe('onNextTick', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call requestAnimationFrame twice if in browser environment', () => {
    isBrowser.mockReturnValue(true)
    const callback = jest.fn()
    global.requestAnimationFrame = jest.fn(cb => cb())

    onNextTick(callback)

    expect(requestAnimationFrame).toHaveBeenCalledTimes(2)
    expect(callback).toHaveBeenCalled()
  })

  it('should call callback immediately if not in browser environment', () => {
    isBrowser.mockReturnValue(false)
    const callback = jest.fn()

    onNextTick(callback)

    expect(callback).toHaveBeenCalled()
  })
})
