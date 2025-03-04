import request from '~/request'
import ensureOneSlash from '~/ensureOneSlash'
import makeEvents from './events'

export default sdk => {
  const endpoint = ensureOneSlash(`${sdk.apiUrl}/analytics`)
  let buffer = []
  let timer = null
  let flushInterval = 5_000
  let batchSize = 5

  const flush = (isUnload = false) => {
    if (buffer.length === 0) return

    try {
      if (typeof sdk.options.onReport === 'function') sdk.options.onReport(buffer)

      if (navigator.sendBeacon && isUnload) {
        navigator.sendBeacon(endpoint, JSON.stringify({ events: buffer, pkey: sdk.pkey }))
      } else {
        const url = ensureOneSlash(endpoint)
        const response = request(url, {
          method: 'POST',
          body: JSON.stringify({ events: buffer }),
          headers: {
            Accept: 'application/json',
            'X-public-key': sdk.pkey,
          },
        })
      }
    } catch (error) {
      console.error(error)
    }

    buffer = []
  }

  const addMetric = metric => {
    buffer.push(metric)

    if (buffer.length >= batchSize) flush()
  }

  const startTimer = () => {
    if (timer) return

    timer = setInterval(() => flush(), flushInterval)
  }

  const stopTimer = () => {
    if (!timer) return

    clearInterval(timer)
    timer = null
  }

  const unloadFlush = () => flush(true)
  window.addEventListener('unload', unloadFlush)

  startTimer()

  const offMetricReport = sdk.on('metric:report', (eventName, metric = {}) => {
    const urlParams = new URLSearchParams(window.location.search)
    const clientAttributes = sdk.client ? sdk.client.getAttributes() : {}

    const baseMetric = {
      ...clientAttributes,
      projectId: metric.projectId || 'defaultProject',
      variantId: metric.variantId,
      partId: metric.partId || 'defaultPart',
      eventName: eventName || metric.name,
      referrer: metric.referrer || document.referrer,
      ...(!!sdk.options.searchParams &&
        sdk.options.searchParams.reduce((h, k) => {
          h[k] = metric[k] || urlParams.get(k)
          return h
        }, {})),
    }

    addMetric({ ...baseMetric, ...metric })
  })

  const destroy = () => {
    flush()

    window.removeEventListener('unload', unloadFlush)

    offMetricReport()
    stopTimer()

    buffer = null
  }

  return {
    addMetric,
    flush,
    destroy,
    events: makeEvents(sdk),
  }
}
