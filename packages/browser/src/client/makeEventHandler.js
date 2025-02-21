import makeMetric from '~/metrics/metric'

const isDifferentEvent = (previous, current) => {
  if (!previous) return true
  if (previous.type !== current.type) return true

  try {
    if (previous.target !== current.target) return true
    // eslint-disable-next-line no-empty, no-unused-vars
  } catch (e) {}

  return false
}

let timerId = null
let lastCapturedEvent = null

export default (sdk, name = 'event', { debounceMillis = 1000, ...options } = {}) => {
  const metric = makeMetric(sdk, name, options)

  return event => {
    // It's possible this handler might trigger multiple times for the same
    // event (e.g. event propagation through node ancestors).
    // Ignore if we've already captured that event.
    if (!event || lastCapturedEvent === event) {
      return
    }

    const eventName = event?.type || name

    metric.init({
      type: 'timeseries',
      context: `browser.dom.events`,
      group: 'dom',
      title: 'Web DOM Events',
      name: eventName,
      value: 1,
    })
    // We always want to skip _some_ events.
    // if (shouldSkipDOMEvent(event)) {
    //   return;
    // }

    // If there is no debounce timer, it means that we can safely capture the new event and store it for future comparisons.
    if (timerId === undefined) {
      metric.setAttributes({
        entries: [event],
      })

      lastCapturedEvent = event

      metric.report({ force: true })
    }
    // If there is a debounce awaiting, see if the new event is different enough to treat it as a unique one.
    // If that's the case, emit the previous event and store locally the newly-captured DOM event.
    else if (isDifferentEvent(lastCapturedEvent, event)) {
      metric.setAttributes({
        entries: [event],
      })

      lastCapturedEvent = event

      metric.report({ force: true })
    }

    // Start a new debounce timer that will prevent us from capturing multiple events that should be grouped together.
    clearTimeout(timerId)
    timerId = self.setTimeout(() => {
      timerId = undefined
    }, debounceMillis)
  }
}
