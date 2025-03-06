import { getDataFromLocale } from '@xaiku/shared'
// import cls from '~/metrics/cls'
// import fcp from '~/metrics/fcp'
// import fid from '~/metrics/fid'
// import lcp from '~/metrics/lcp'
// import ttfb from '~/metrics/ttfb'
import makeWindowContext from './makeWindowContext'
import metricObserver from './metricObserver'
import proxyHistory from './proxyHistory'
// import proxyTimers from './proxyTimers'
// import proxyFetch from './proxyFetch'
import proxyDOM from './proxyDOM'

export default sdk => {
  let client = sdk.client
  let parentDestroy = client.destroy

  const windowContext = makeWindowContext(sdk)

  const options = { client, windowContext }

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
    client.setAttributes({
      domain: window.location.hostname,
      userAgent: navigator.userAgent,
      windowDimensions: [self.innerWidth, self.innerHeight],
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      ...getDataFromLocale(),
    })
  })

  const stopMetricObserver = metricObserver(sdk)

  client.destroy = () => {
    windowContext.destroy()
    stopMetricObserver()
    client.destroy()
    parentDestroy()
    client = null
    parentDestroy = null
  }

  return client
}
