import makePerformanceObserver from '~/performanceObserver'

const originalPerformanceObserver = global.PerformanceObserver

class FakePerformanceObserver {
  constructor(callback) {
    this.callback = callback
    this.observe = jest.fn()
    this.disconnect = jest.fn()
  }

  simulateEntries(entries) {
    const entryList = {
      getEntries: () => entries,
    }
    this.callback(entryList)
  }
}

FakePerformanceObserver.supportedEntryTypes = ['paint', 'navigation', 'event']

describe('PerformanceObserver module', () => {
  let triggerSpy

  beforeAll(() => {
    global.PerformanceObserver = FakePerformanceObserver
  })

  afterAll(() => {
    global.PerformanceObserver = originalPerformanceObserver
  })

  beforeEach(() => {
    triggerSpy = jest.fn()
  })

  test('connect with a key creates a single observer', () => {
    const observers = makePerformanceObserver(triggerSpy)
    observers.connect('paint')

    const observer = observers.get('paint')
    expect(observer).toBeDefined()

    expect(observer.observe).toHaveBeenCalledWith({
      type: 'paint',
      buffered: true,
    })
  })

  test('connect without a key creates observers for all supported entry types', () => {
    const observers = makePerformanceObserver(triggerSpy, {})
    observers.connect()

    FakePerformanceObserver.supportedEntryTypes.forEach(type => {
      const observer = observers.get(type)
      expect(observer).toBeDefined()

      const expectedBuffered = type === 'navigation' ? false : true
      expect(observer.observe).toHaveBeenCalledWith({
        type,
        buffered: expectedBuffered,
      })
    })
  })

  test('observer callback triggers events as expected for list and individual entries', async () => {
    const observers = makePerformanceObserver(triggerSpy, {})
    observers.connect('paint')
    const observer = observers.get('paint')

    const fakeEntry = {
      entryType: 'paint',
      name: 'my-paint-entry',
    }
    const fakeNoNameEntry = {
      entryType: 'paint',
    }

    observer.simulateEntries([fakeEntry, fakeNoNameEntry])

    await Promise.resolve()

    expect(triggerSpy).toHaveBeenCalledWith('paint:list', [fakeEntry, fakeNoNameEntry])
    expect(triggerSpy).toHaveBeenCalledWith('paint', fakeEntry, observer)
    expect(triggerSpy).toHaveBeenCalledWith('my-paint-entry', fakeEntry, observer)
  })

  test('disconnect with a key calls disconnect on that observer', () => {
    const observers = makePerformanceObserver(triggerSpy, {})
    observers.connect('navigation')
    const observer = observers.get('navigation')
    observers.disconnect('navigation')
    expect(observer.disconnect).toHaveBeenCalled()
  })

  test('disconnect without a key calls disconnect on all observers', () => {
    const observers = makePerformanceObserver(triggerSpy, {})

    observers.connect('paint')
    observers.connect('event')

    observers.disconnect()
    Object.keys(observers.all).forEach(key => {
      expect(observers.all[key].disconnect).toHaveBeenCalled()
    })
  })
})
