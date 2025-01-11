import makeListeners, { unregister } from './listeners'

describe('makeListeners', () => {
  let listeners

  beforeEach(() => {
    listeners = makeListeners()
  })

  test('should register and trigger an event once', () => {
    const handler = jest.fn()
    listeners.once('testEvent', handler)
    listeners.trigger('testEvent', 'arg1', 'arg2')
    listeners.trigger('testEvent', 'arg1', 'arg2')

    expect(handler).toHaveBeenCalledTimes(1)
  })

  test('should unregister an once event handler', () => {
    const handler = jest.fn()
    const off = listeners.once('testEvent', handler)
    off()
    listeners.trigger('testEvent', 'arg1', 'arg2')
    listeners.trigger('testEvent', 'arg1', 'arg2')

    expect(handler).toHaveBeenCalledTimes(0)
  })

  test('should register and trigger an event', () => {
    const handler = jest.fn()
    listeners.on('testEvent', handler).on('testEvent2', handler)
    listeners.trigger('testEvent', 'arg1', 'arg2')
    listeners.trigger('testEvent', 'arg1', 'arg2')
    listeners.trigger('testEvent2', 'arg1', 'arg2')

    expect(handler).toHaveBeenCalledWith('arg1', 'arg2')
    expect(handler).toHaveBeenCalledTimes(3)
  })

  test('should unregister an event handler', () => {
    const handler = jest.fn()
    const off = listeners.on('testEvent', handler)
    off()
    listeners.trigger('testEvent', 'arg1', 'arg2')
    listeners.trigger('testEvent2', 'arg1', 'arg2')

    expect(handler).not.toHaveBeenCalled()
  })

  test('should unregister all event handlers', () => {
    const handler1 = jest.fn()
    const handler2 = jest.fn()
    listeners.on('testEvent', handler1)
    listeners.on('testEvent', handler2)
    listeners.offAll()
    listeners.trigger('testEvent', 'arg1', 'arg2')

    expect(handler1).not.toHaveBeenCalled()
    expect(handler2).not.toHaveBeenCalled()
  })

  test('should unregister multiple handlers using unregister function', () => {
    const handler1 = jest.fn()
    const handler2 = jest.fn()
    const off1 = listeners.on('testEvent', handler1)
    const off2 = listeners.on('testEvent', handler2)
    const unregisterAll = unregister(off1, off2)
    unregisterAll()
    listeners.trigger('testEvent', 'arg1', 'arg2')

    expect(handler1).not.toHaveBeenCalled()
    expect(handler2).not.toHaveBeenCalled()
  })
})
