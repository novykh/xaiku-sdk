import getInitialNavEntry from '@/helpers/getInitialNavEntry'
import makeMetric from './metric'

// [LCP](https://web.dev/lcp/) - Largest Content

export default (sdk, options = {}) => {
  const { windowContext } = options
  const metric = makeMetric(sdk, 'lcp', options)

  const reportMetric = entries => {
    const navEntry = getInitialNavEntry()

    const lastEntry = entries[entries.length - 1]

    if (!lastEntry) return

    const value = Math.max(lastEntry.startTime - navEntry.activationStart, 0)

    if (value < windowContext.getFirstHiddenTime()) {
      metric.init({
        type: 'timeseries',
        context: 'browser.web_performance.web_vitals',
        group: 'web_performance',
        title: 'Web performance core metrics',
        value,
        entries: [...entries, navEntry],
      })
      metric.report()
    }

    metric.report({ force: true })
  }

  sdk.on('largest-contentful-paint:list', reportMetric)

  const po = sdk.pos.get('largest-contentful-paint')

  if (po) {
    const stopListening = () => {
      if (!metric.reported) reportMetric(po.takeRecords())

      po.disconnect()
    }

    // Stop listening after input. Note: while scrolling is an input that
    // stops LCP observation, it's unreliable since it can be programmatically
    // generated. See: https://github.com/GoogleChrome/web-vitals/issues/75
    ;['keydown', 'click'].forEach(type => {
      addEventListener(type, stopListening, { once: true, capture: true })
    })

    sdk.on('hide', stopListening)

    sdk.on('BFCacheRestore', event => {
      metric.init({
        type: 'timeseries',
        context: 'browser.web_performance.web_vitals',
        group: 'web_performance',
        title: 'Web performance core metrics',
        value: performance.now() - event.timeStamp,
      })

      metric.report({ force: true })
    })
  }
}
