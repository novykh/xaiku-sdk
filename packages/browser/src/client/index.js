import { getFrameworks, getGuid } from '@xaiku/shared'
import cls from '@/metrics/cls'
import fcp from '@/metrics/fcp'
import fid from '@/metrics/fid'
import lcp from '@/metrics/lcp'
import ttfb from '@/metrics/ttfb'
import makeWindowContext from './makeWindowContext'
import metricObserver from './metricObserver'
import proxyHistory from './proxyHistory'
import proxyTimers from './proxyTimers'
import proxyFetch from './proxyFetch'
import proxyDOM from './proxyDOM'

export default sdk => {
  let session = {
    guid: null,
    frameworks: [],
    userAgent: '',
    windowDimensions: [self.innerWidth, self.innerHeight],
  }

  const setAttribute = (key, value) => {
    session[key] = typeof value === 'function' ? value(session[key]) : value
  }

  const setAttributes = values => {
    Object.keys(values).forEach(key => setAttribute(key, values[key]))
  }

  const windowContext = makeWindowContext(sdk)

  const options = { windowContext, session }

  proxyHistory(sdk, options)
  // proxyTimers(sdk, options)
  // proxyFetch(sdk, options)
  proxyDOM(sdk, options)

  // cls(sdk, options)
  // fcp(sdk, options)
  // fid(sdk, options)
  // lcp(sdk, options)
  // ttfb(sdk, options)

  document.addEventListener('DOMContentLoaded', () => {
    setAttributes({
      guid: getGuid(sdk),
      frameworks: getFrameworks(),
      userAgent: navigator.userAgent,
      windowDimensions: [self.innerWidth, self.innerHeight],
    })
  })

  const stopMetricObserver = metricObserver(sdk)

  const destroy = () => {
    windowContext.destroy()
    stopMetricObserver()
    session = null
  }

  return {
    destroy,
  }
}
