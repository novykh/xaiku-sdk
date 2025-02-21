import getInitialNavEntry from '~/helpers/getInitialNavEntry'
import makeMetric from './metric'

// [FCP](https://web.dev/fcp/) - First Contentful Paint

export default (sdk, options = {}) => {
  const { windowContext } = options
  const metric = makeMetric(sdk, 'fcp', options)

  sdk.on('first-contentful-paint', (entry, po) => {
    po.disconnect()

    if (entry.startTime >= windowContext.getFirstHiddenTime()) return

    const navEntry = getInitialNavEntry()

    metric.init({
      type: 'timeseries',
      context: 'browser.web_performance.web_vitals',
      group: 'web_performance',
      title: 'Web performance core metrics',
      value: Math.max(entry.startTime - navEntry.activationStart, 0),
      entries: [entry, navEntry],
    })

    metric.report({ force: true })
  })

  const po = sdk.pos.get('paint')

  if (po) {
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
