const thresholdsByMetric = {
  cls: [0.1, 0.25], // https://web.dev/cls/#what-is-a-good-cls-score
  fcp: [1800, 3000], // https://web.dev/fcp/#what-is-a-good-fcp-score
  fid: [100, 300], // https://web.dev/fid/#what-is-a-good-fid-score
  lcp: [2500, 4000], // https://web.dev/lcp/#what-is-a-good-lcp-score
  ttfb: [800, 1800], // https://web.dev/ttfb/#what-is-a-good-ttfb-score
}

const getRating = (value, thresholds) => {
  if (!thresholds) return 'unknown'
  if (value > thresholds[1]) return 'poor'
  if (value > thresholds[0]) return 'needs-improvement'
  return 'good'
}

const getId = key => `xaiku-${key}-${Date.now()}`

const initialState = {
  name: '',
  id: null,
  value: null,
  rating: null,
  entries: [],
  reported: false,
  pathname: null,
  session: {},
  browser: {},
  type: null,
}

export default (sdk, name, { session = initialState.session, reportAll = false } = {}) => {
  const thresholds = thresholdsByMetric[name]

  const broadcast = action => {
    sdk.trigger(`metric:${metric.name}:${action}`, metric)
    sdk.trigger(`metric:${action}`, metric)
  }

  let metric = {
    init: (values = {}) => {
      metric.mutate({ ...initialState, session, name, id: getId(name), reported: false, ...values })
      broadcast('init')
    },
    setAttributes: values => {
      metric.mutate(values)
      broadcast('update')
    },
    setAttribute: (key, value) => {
      metric[key] = typeof value === 'function' ? value(metric[key]) : value
      broadcast('update')
    },
    mutate: (values = {}) => {
      Object.keys(values).forEach(key => metric.setAttribute(key, values[key]))
    },
    report: ({ force = false } = {}) => {
      if (metric.value === null) return
      if (!force && !reportAll) return

      metric.rating = getRating(metric.value, thresholds)
      metric.reported = true
      sdk.trigger(name, metric)
      broadcast('report')
    },
  }

  return metric
}
