import makeMetric from './metric'

// [FID](https://web.dev/fid/) - First Input Delay

export default (sdk, options = {}) => {
  const { windowContext } = options
  const metric = makeMetric(sdk, 'fid', options)

  sdk.on('first-input', entry => {
    if (entry.startTime >= windowContext.getFirstHiddenTime()) return

    metric.init({
      type: 'timeseries',
      context: 'browser.web_performance.web_vitals',
      group: 'web_performance',
      title: 'Web performance core metrics',
      value: entry.processingStart - entry.startTime,
      entries: [entry],
    })

    metric.report({ force: true })
  })
}
