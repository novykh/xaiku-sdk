const initialState = {
  activationStart: 0,
  decodedBodySize: 0,
  duration: 0,
  encodedBodySize: 0,
  entryType: 'navigation',
  initiatorType: 'navigation',
  name: null,
  nextHopProtocol: '',
  redirectCount: 0,
  renderBlockingStatus: 'blocking',
  serverTiming: [],
  startTime: 0,
  transferSize: 0,
  type: 'navigate',
  workerStart: 0,
}

const buildEntry = () => {
  const timing = self.performance.timing
  const type = self.performance.navigation.type

  const navigationEntry = {
    ...initialState,
    type: type == 2 ? 'back_forward' : type === 1 ? 'reload' : 'navigate',
    name: self.location.url,
  }

  Object.keys(timing).forEach(key => {
    if (key === 'navigationStart') return

    navigationEntry[key] = Math.max(timing[key] - timing.navigationStart, 0)
  })

  return navigationEntry
}

export default () => self.performance?.getEntriesByType?.('navigation')?.[0] || buildEntry()
