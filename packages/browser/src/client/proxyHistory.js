import makeMetric from '~/metrics/metric'

const hasSupport = () => {
  if (self?.chrome?.app?.runtime) return false

  return 'history' in self && !!self.history.pushState && !!self.history.replaceState
}

const isValidUrl = input => {
  try {
    new URL(input)
    return true
    // eslint-disable-next-line no-unused-vars
  } catch (e) {
    return false
  }
}

export default (sdk, options) => {
  if (!hasSupport()) return

  const metric = makeMetric(sdk, 'history', options)

  metric.init({
    type: 'timeseries',
    context: `browser.navigation.history`,
    group: 'history',
    title: 'Web Navigation',
    value: 1,
  })

  let prevHref = null

  sdk.proxy(
    self,
    'onpopstate',
    () => {
      const to = self.location.href
      // keep track of the current URL state, as we always receive only the updated state
      const from = prevHref
      prevHref = to

      metric.setAttributes({
        name: 'onpopstate',
        entries: [{ from, to }],
      })

      metric.report({ force: true })
    },
    'history'
  )

  const onChange = (args, fnName) => {
    const [, , url] = args
    if (!url) return

    const from = prevHref
    let to = String(url)

    prevHref = to

    metric.setAttributes({
      name: fnName,
      entries: [{ from, to }],
    })

    metric.report({ force: true })
  }

  sdk.proxy(self.history, ['pushState', 'replaceState'], onChange, 'history')
}
