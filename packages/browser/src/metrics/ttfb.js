import { getInitialNavEntry } from '@xaiku/shared'
import makeMetric from './metric'

// [TTFB](https://web.dev/time-to-first-byte/) - Time to First Byte

export default (sdk, options = {}) => {
  const metric = makeMetric(sdk, 'ttfb', options)

  sdk.on('navigation', entry => {
    const responseStart = entry.responseStart

    if (responseStart <= 0 || responseStart > self.performance.now()) return

    const navEntry = getInitialNavEntry()

    metric.init({
      type: 'timeseries',
      context: 'browser.web_performance.web_vitals',
      group: 'web_performance',
      title: 'Web performance core metrics',
      value: Math.max(responseStart - navEntry.activationStart, 0),
      entries: [entry],
    })

    metric.report({ force: true })
  })

  sdk.on('BFCacheRestore', () => {
    metric.setAttribute('value', 0)
    metric.report({ force: true })
  })
}
