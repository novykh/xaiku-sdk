import getInitialNavEntry from './getInitialNavEntry'

const originalPerformance = window.performance

describe('getInitialNavEntry', () => {
  afterEach(() => {
    // Restore the original window.performance
    Object.defineProperty(window, 'performance', {
      value: originalPerformance,
      writable: true,
    })
  })

  test('has entries by type navigation', () => {
    Object.defineProperty(window, 'performance', {
      value: {
        getEntriesByType: jest.fn(() => [
          {
            activationStart: 2,
            connectEnd: 619.2000000029802,
            connectStart: 619.2000000029802,
            criticalCHRestart: 0,
            decodedBodySize: 208792,
            deliveryType: '',
            domComplete: 1724.7999999970198,
            domContentLoadedEventEnd: 858.2999999970198,
            domContentLoadedEventStart: 846.8999999985099,
            domInteractive: 845.8999999985099,
            domainLookupEnd: 619.2000000029802,
            domainLookupStart: 619.2000000029802,
            duration: 1727.7000000029802,
            encodedBodySize: 37248,
            entryType: 'navigation',
            fetchStart: 619.2000000029802,
            firstInterimResponseStart: 0,
            initiatorType: 'navigation',
            loadEventEnd: 1727.7000000029802,
            loadEventStart: 1725.7000000029802,
            name: 'https://www.typeface.ai/product/arc/index.html',
            nextHopProtocol: 'h2',
            notRestoredReasons: null,
            redirectCount: 1,
            redirectEnd: 619.2000000029802,
            redirectStart: 40.399999998509884,
            renderBlockingStatus: 'non-blocking',
            requestStart: 620.5,
            responseEnd: 843.8999999985099,
            responseStart: 781.8999999985099,
            responseStatus: 200,
            secureConnectionStart: 619.2000000029802,
            serverTiming: [],
            startTime: 0,
            transferSize: 37548,
            type: 'mock-type',
            unloadEventEnd: 0.1,
            unloadEventStart: 0,
            workerStart: 0,
          },
        ]),
      },
      writable: true,
    })

    let navEntry = getInitialNavEntry()
    expect(navEntry).toBeDefined()
    expect(navEntry).toHaveProperty('activationStart', 2)
    expect(navEntry).toHaveProperty('type', 'mock-type')
    expect(navEntry).not.toHaveProperty('navigationStart')
    expect(navEntry).toHaveProperty('renderBlockingStatus', 'non-blocking')
    expect(navEntry).toHaveProperty('domContentLoadedEventEnd', 858.2999999970198)
    expect(navEntry).toHaveProperty('unloadEventEnd', 0.1)
  })

  test('buildEntry navigate', () => {
    Object.defineProperty(window, 'performance', {
      value: {
        timing: {},
        navigation: {},
      },
      writable: true,
    })

    let navEntry = getInitialNavEntry()
    expect(navEntry).toBeDefined()
    expect(navEntry).toHaveProperty('activationStart', 0)
    expect(navEntry).toHaveProperty('type', 'navigate')
    expect(navEntry).toHaveProperty('name', 'https://xaiku.com/')
    expect(navEntry).toHaveProperty('duration', expect.any(Number))
    expect(navEntry).toHaveProperty('startTime', expect.any(Number))
    expect(navEntry).toHaveProperty('renderBlockingStatus', 'blocking')

    Object.defineProperty(window, 'performance', {
      value: {
        timing: {
          connectEnd: 1736344108105,
          connectStart: 1736344108105,
          domComplete: 1736344109210,
          domContentLoadedEventEnd: 1736344108344,
          domContentLoadedEventStart: 1736344108332,
          domInteractive: 1736344108332,
          domLoading: 1736344108277,
          domainLookupEnd: 1736344108105,
          domainLookupStart: 1736344108105,
          fetchStart: 1736344108105,
          loadEventEnd: 1736344109213,
          loadEventStart: 1736344109211,
          navigationStart: 1736344107486,
          redirectEnd: 1736344108105,
          redirectStart: 1736344107526,
          requestStart: 1736344108106,
          responseEnd: 1736344108329,
          responseStart: 1736344108267,
          secureConnectionStart: 0,
          unloadEventEnd: 0,
          unloadEventStart: 0,
        },
        navigation: {
          type: 0,
        },
      },
      writable: true,
    })

    navEntry = getInitialNavEntry()
    expect(navEntry).toHaveProperty('type', 'navigate')
    expect(navEntry).not.toHaveProperty('navigationStart')
    expect(navEntry).toHaveProperty('domContentLoadedEventEnd', 1736344108344 - 1736344107486)
    expect(navEntry).toHaveProperty('unloadEventEnd', 0)
  })

  test('buildEntry back_forward', () => {
    Object.defineProperty(window, 'performance', {
      value: {
        timing: {},
        navigation: {
          type: 2,
        },
      },
      writable: true,
    })

    const navEntry = getInitialNavEntry()
    expect(navEntry).toBeDefined()
    expect(navEntry).toHaveProperty('activationStart')
    expect(navEntry).toHaveProperty('type', 'back_forward')
    expect(navEntry).toHaveProperty('name', 'https://xaiku.com/')
    expect(navEntry).toHaveProperty('duration', expect.any(Number))
    expect(navEntry).toHaveProperty('startTime', expect.any(Number))
  })

  test('buildEntry reload', () => {
    Object.defineProperty(window, 'performance', {
      value: {
        timing: {},
        navigation: {
          type: 1,
        },
      },
      writable: true,
    })

    const navEntry = getInitialNavEntry()
    expect(navEntry).toBeDefined()
    expect(navEntry).toHaveProperty('activationStart')
    expect(navEntry).toHaveProperty('type', 'reload')
    expect(navEntry).toHaveProperty('name', 'https://xaiku.com/')
    expect(navEntry).toHaveProperty('duration', expect.any(Number))
    expect(navEntry).toHaveProperty('startTime', expect.any(Number))
  })
})
